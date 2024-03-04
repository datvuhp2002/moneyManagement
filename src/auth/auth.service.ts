import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import { RegisterUserDto } from './dto/registerUserDto.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { AuthPayLoadDto } from './dto/auth.dto';
import { resolve } from 'path';
@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
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
    await new Promise(resolve => setTimeout(resolve,2000))
    if(!user){
      throw new HttpException({message: "Account is not exist"},HttpStatus.UNAUTHORIZED)
  }
    const verify = await this.VerifyPassword(password, user.password);
    if (!verify){
      throw new HttpException({message: "Password does not correct"},HttpStatus.UNAUTHORIZED);
      return null;
    }
    return user;
  }
  // Promise<{ access_token: string; refresh_token: string }>
  login = async (user: any) => {
    const payload = {
      id: user.id,
      email: user.email,
      roleName: user.ownership_role.name,
    };
    return this.generateToken(payload);
  };
  register = async (userData: RegisterUserDto): Promise<User> => {
    // step 1 : checking email has already used
    const user = await this.prismaService.user.findUnique({
      where: {
        email: userData.email,
        deleteMark: true,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'Email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // step 2: hash password and store to db
    const hashPassword = await this.hashPassword(userData.password);
    const res = await this.prismaService.user.create({
      data: { ...userData, password: hashPassword },
    });
    return res;
  };
  private async VerifyPassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compareSync(password, hashedPassword);
  }
  private async generateToken(payload: { id: number; email: string }) {
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
        return this.generateToken({ id: verify.id, email: verify.email });
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
}
