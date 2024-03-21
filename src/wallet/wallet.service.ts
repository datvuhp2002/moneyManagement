import { Injectable } from '@nestjs/common';
import {
  CreateWalletDto,
  WalletFilterType,
  WalletPaginationResponseType,
} from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Wallet } from '@prisma/client';
import { StatisticsService } from 'src/statistics/statistics.service';
import { TransactionService } from 'src/transaction/transaction.service';

@Injectable()
export class WalletService {
  constructor(private prismaService: PrismaService) {}
  async create(id: number, data: CreateWalletDto): Promise<Wallet> {
    return await this.prismaService.wallet.create({
      data: { ...data, user_id: id, amount:Number(data.amount) },
    });
  }
  async createDefaultWallet(userId: number): Promise<void> {
    const defaultWalletData = {
      name: 'Tổng tiền ví',
      amount: 0,
    };
    await this.create(userId, defaultWalletData);
  }
  async getAllTrash(
    filters: WalletFilterType,
  ): Promise<WalletPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const wallet = await this.prismaService.wallet.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            name: {
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
    const total = await this.prismaService.categoriesGroup.count({
      where: {
        OR: [
          {
            name: {
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
      data: wallet,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAll(
    filters: WalletFilterType,
  ): Promise<WalletPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const wallet = await this.prismaService.wallet.findMany({
      take: items_per_page,
      skip,
      select: {
        name: true,
        createdAt: true,
        deletedAt: true,
      },
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.role.count({
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: wallet,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAllForUser(
    id: number,
    filters: WalletFilterType,
  ): Promise<WalletPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const wallet = await this.prismaService.wallet.findMany({
      take: items_per_page,
      skip,
      where: {
        user_id: id,
        OR: [
          {
            name: {
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
    console.log('wallet = ', wallet);
    const total = await this.prismaService.categoriesGroup.count({
      where: {
        user_id: id,
        OR: [
          {
            name: {
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
      data: wallet,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getDetail(id: number): Promise<Wallet> {
    return await this.prismaService.wallet.findUnique({
      where: {
        id,
      },
    });
  }
  async update(id: number, data: UpdateWalletDto): Promise<Wallet> {
    return await this.prismaService.wallet.update({
      where: { id },
      data,
    });
  }
  async updateAmount(id:number, amount:number):Promise<Wallet>{
    return await this.prismaService.wallet.update({
      where: { id },
      data:{
        amount
      }
    })
  }
  async delete(id: number): Promise<Wallet> {
    await this.prismaService.transaction.updateMany({where: { wallet_id:id }, data:{
      deleteMark: true, 
      deletedAt: new Date(),
    }})
    await this.prismaService.statistics.updateMany({where: { wallet_id:id }, data:{
      deleteMark: true, 
      deletedAt: new Date(),
    }})
    return await this.prismaService.wallet.update({
      where: { id, deleteMark: false },
      data: {
        deleteMark: true,
        deletedAt: new Date(),
      },
    });
  }
  async deleteForUser(userId:number,id: number): Promise<Wallet> {
    await this.prismaService.transaction.updateMany({where: {user_id:userId, wallet_id:id }, data:{
      deleteMark: true, 
      deletedAt: new Date(),
    }})
    await this.prismaService.statistics.updateMany({where: {user_id:userId, wallet_id:id }, data:{
      deleteMark: true, 
      deletedAt: new Date(),
    }})
    return await this.prismaService.wallet.update({
      where: { user_id:userId,id, deleteMark: false },
      data: {
        deleteMark: true,
        deletedAt: new Date(),
      },
    });
  }
  async forceDelete(id: number): Promise<Wallet> {
    await this.prismaService.transaction.deleteMany({where: { wallet_id:id }})
    await this.prismaService.statistics.deleteMany({where: {wallet_id:id }})
    return await this.prismaService.wallet.delete({
      where: { id, deleteMark: true },
    });
  }
}
