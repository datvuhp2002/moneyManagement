import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import { RegisterUserDto } from './dto/registerUserDto.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import {
  AuthPayLoadDto,
  ChangePasswordDto,
  forgetPasswordDto,
  payloadDto,
} from './dto/auth.dto';
import { WalletService } from 'src/wallet/wallet.service';
import { CategoryGroupService } from 'src/category-group/category-group.service';
import { CategoryService } from 'src/category/category.service';
import { CurrencyService } from 'src/currency/currency.service';
import { Currency } from 'src/currency/entities/currency.entity';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private walletService: WalletService,
    private categoryGroupService: CategoryGroupService,
    private categoryService: CategoryService,
    private currencyService: CurrencyService,
  ) {}
  async validateUser({ email, password }: AuthPayLoadDto): Promise<User> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email,
      },
      include: {
        ownership_role: {
          select: {
            name: true,
          },
        },
      },
    });
    console.log(user);
    if (!user) {
      throw new HttpException(
        { message: 'Account is not exist' },
        HttpStatus.UNAUTHORIZED,
      );
    }
    const verify = await this.VerifyPassword(password, user.password);
    if (!verify) {
      throw new HttpException(
        { message: 'Password does not correct' },
        HttpStatus.UNAUTHORIZED,
      );
      return null;
    }
    return user;
  }
  login = async (
    user: any,
  ): Promise<{ access_token: string; refresh_token: string }> => {
    const payload = {
      id: user.id,
      email: user.email,
      roleName: user.ownership_role.name,
    };
    return await this.generateToken(payload);
  };
  register = async (userData: RegisterUserDto): Promise<User> => {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
        deleteMark: true,
      },
    });
    if (user) {
      throw new BadRequestException('Email đã tồn tại');
    }
    const hashPassword = await this.hashPassword(userData.password);
    try{
      const createdUser = await this.prismaService.user.create({
      data: { ...userData, password: hashPassword },
      })
      this.walletService.createDefaultWallet(createdUser.id)
      const categoryGroupChi = await this.categoryGroupService.createDefaultCategoryGroupExpense(createdUser.id)
      const categoryGroupThu = await this.categoryGroupService.createDefaultCategoryGroupRevenue(createdUser.id)
      await this.categoryService.createDefaultCategory(createdUser.id,categoryGroupChi.id,categoryGroupThu.id)
      await this.currencyService.createDefaultCurrency(createdUser.id)
      return createdUser
    }catch (error) {
      throw new HttpException('Không thể tạo ra người dùng', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  };
  private async VerifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(password, hashedPassword);
  }
  private async generateToken(payload: payloadDto) {
    const access_token = await this.jwtService.signAsync(payload);
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('SECRET_REFRESH_TOKEN'),
      expiresIn: this.configService.get<string>('EXP_IN_REFRESH_TOKEN'),
    });
    await this.prismaService.user.update({
      where: { id: payload.id },
      data: {
        email: payload.email,
        refresh_token,
      },
    });
    return { access_token, refresh_token };
  }
  private async hashPassword(password: string): Promise<string> {
    const saltRounds = parseInt(this.configService.get<string>('SALTROUND'));
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  async refreshToken(refresh_token: string): Promise<any> {
    try {
      const verify = await this.jwtService.verifyAsync(refresh_token, {
        secret: this.configService.get<string>('SECRET_REFRESH_TOKEN'),
      });
      const checkExist = await this.prismaService.user.findUnique({
        where: { id: verify.id, refresh_token },
      });
      if (checkExist) {
        return this.generateToken({
          id: verify.id,
          email: verify.email,
          roleName: verify.roleName,
        });
      } else {
        throw new HttpException(
          'refresh token is not valid',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (err) {
      throw new HttpException(
        'refresh token is not valid',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async forgetPassword(data: forgetPasswordDto): Promise<boolean> {
    const user = await this.prismaService.user.findUnique({
      where: {
        email: data.email,
        deleteMark: false,
      },
    });
    if (!user) {
      throw new BadRequestException('Email không tồn tại');
    }
    return true;
  }
  async changePassword(data: ChangePasswordDto): Promise<any> {
    const hashPassword = await this.hashPassword(data.password);
    return await this.prismaService.user.update({
      where: {
        email: data.email,
        deleteMark: false,
      },
      data: {
        password: hashPassword,
      },
    });
  }
}
