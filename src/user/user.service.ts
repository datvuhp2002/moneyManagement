import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma.servcie';
import {
  CreateUserDto,
  SoftDeleteUserDto,
  UpdateUserDto,
  UploadAvatarResult,
  UserFilterType,
  UserPaginationResponseType,
} from './dto/user.dto';
import { hash } from 'bcrypt';
@Injectable()
export class UserService {
  constructor(private prismaService: PrismaService) {}
  async create(body: CreateUserDto): Promise<User> {
    // step 1: checking email has already exist
    const user = await this.prismaService.user.findUnique({
      where: {
        email: body.email,
        deleteMark: false,
      },
    });
    if (user) {
      throw new HttpException(
        { message: 'This email has been used' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // step 2: hash password and store to db
    const hashPassword = await hash(body.password, 10);
    const result = await this.prismaService.user.create({
      data: { ...body, password: hashPassword },
    });
    return result;
  }
  async trash(filters: UserFilterType): Promise<UserPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const users = await this.prismaService.user.findMany({
      take: items_per_page,
      skip,
      select: {
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            deleteMark: true,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.user.count({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            deleteMark: true,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: users,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAll(filters: UserFilterType): Promise<UserPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const users = await this.prismaService.user.findMany({
      take: items_per_page,
      skip,
      select: {
        username: true,
        email: true,
        avatar: true,
        createdAt: true,
      },
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            deleteMark: false,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.user.count({
      where: {
        OR: [
          {
            username: {
              contains: search,
            },
          },
          {
            email: {
              contains: search,
            },
          },
        ],
        AND: [
          {
            deleteMark: false,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: users,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getDetail(id: number): Promise<User> {
    return this.prismaService.user.findUnique({
      where: {
        id,
        deleteMark: false,
      },
    });
  }
 
  async update(id: number, data: UpdateUserDto): Promise<User> {
    return await this.prismaService.user.update({
      where: { id },
      data,
    });
  }
  async deleteById(id: number): Promise<SoftDeleteUserDto> {
    return await this.prismaService.user.update({
      where: { id },
      data: {
        deleteMark: true,
        deletedAt: new Date(),
      },
    });
  }
  async uploadAvatar(id: number, avatar: string): Promise<UploadAvatarResult> {
    return await this.prismaService.user.update({
      where: { id },
      data: { avatar },
    });
  }
}
