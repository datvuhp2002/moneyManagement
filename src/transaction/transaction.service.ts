import { Delete, Injectable } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma.servcie';
import { TransactionFilterType, TransactionPaginationResponseType } from './dto/filter-type.dto';
import { Statistics, Transaction } from '@prisma/client';
import { StatisticsService } from 'src/statistics/statistics.service';
import { TransactionType } from './dto/Transaction.enum';

@Injectable()
export class TransactionService {
  constructor(private prismaService: PrismaService,private statisticsService: StatisticsService){}
  async create(userId: number, createTransactionDto: CreateTransactionDto): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.create({
      data: {
          ...createTransactionDto,
          bill: Number(createTransactionDto.bill),
          currency_id: Number(createTransactionDto.currency_id),
          categoriesGroup_id: Number(createTransactionDto.categoriesGroup_id),
          category_id: Number(createTransactionDto.category_id),
          wallet_id: Number(createTransactionDto.wallet_id),
          user_id: userId
      }
  });
    const date = createTransactionDto.recordDate ? new Date(createTransactionDto.recordDate) : new Date();
    if(transaction) await this.updateOrCreateStatistics(userId, date, createTransactionDto);
    return transaction;
}
private async updateOrCreateStatistics(userId: number, date: Date, createTransactionDto: CreateTransactionDto): Promise<void> {
    const statisticsDay = await this.statisticsService.findOne(userId, {
        day: Number(date.getDate()),
        month: Number(date.getMonth() + 1),
        year: Number(date.getFullYear())
    });
    if (statisticsDay) {
        await this.updateStatistics(statisticsDay, createTransactionDto);
    } else {
        await this.createStatistics(userId, date, createTransactionDto);
    }

}
private async updateStatistics(statistics:Statistics, createTransactionDto: CreateTransactionDto): Promise<void> {
    const date = createTransactionDto.recordDate ? new Date(createTransactionDto.recordDate) : new Date();
    await this.statisticsService.update(statistics.id, {
        expense: createTransactionDto.transactionType === TransactionType.Chi ? statistics.expense + Number(createTransactionDto.bill) : statistics.expense,
        revenue: createTransactionDto.transactionType === TransactionType.Thu ? statistics.revenue + Number(createTransactionDto.bill) : statistics.revenue,
        day: Number(date.getDate()),
        month: Number(date.getMonth() + 1),
        year: Number(date.getFullYear()),
        wallet_id: Number(createTransactionDto.wallet_id)
    });
}
private async createStatistics(userId: number, date: Date, createTransactionDto: CreateTransactionDto): Promise<void> {
    await this.statisticsService.create({
        expense: createTransactionDto.transactionType === TransactionType.Chi ? Number(createTransactionDto.bill) : 0,
        revenue: createTransactionDto.transactionType === TransactionType.Thu ? Number(createTransactionDto.bill) : 0,
        day: Number(date.getDate()),
        month: Number(date.getMonth() + 1),
        year: Number(date.getFullYear()),
        wallet_id: Number(createTransactionDto.wallet_id)
    }, userId);
}
  async getAll(filters: TransactionFilterType): Promise<TransactionPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const Transactions = await this.prismaService.transaction.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          
          {
            note: {
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
    const total = await this.prismaService.transaction.count({
      where: {
        OR: [
          {
            note: {
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
      data: Transactions,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAllForUser(userId:number,filters: TransactionFilterType): Promise<TransactionPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const Transactions = await this.prismaService.transaction.findMany({
      take: items_per_page,
      skip,
      where: {
        user_id: userId,
        OR: [
          {
            note: {
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
    const total = await this.prismaService.transaction.count({
      where: {
        user_id: userId,
        OR: [
          {
            note: {
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
      data: Transactions,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getDetail(id: number) {
    return await this.prismaService.transaction.findUnique({where:{id}});
  }
  async update(id: number, updateTransactionDto: UpdateTransactionDto) {
    return await this.prismaService.transaction.update({where:{id},data:{...updateTransactionDto,bill:Number(updateTransactionDto.bill),currency_id:Number(updateTransactionDto.currency_id),categoriesGroup_id:Number(updateTransactionDto.categoriesGroup_id),category_id:Number(updateTransactionDto.category_id),wallet_id:Number(updateTransactionDto.wallet_id)}});;
  }
  async trash(filters: TransactionFilterType): Promise<TransactionPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const Transactions = await this.prismaService.transaction.findMany({
      take: items_per_page,
      skip,
      where: {
        OR: [
          {
            note: {
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
    const total = await this.prismaService.transaction.count({
      where: {
        OR: [
          {
            note: {
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
      data: Transactions,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async delete(id: number) {
    return await this.prismaService.transaction.update({where:{id},data:{
      deleteMark: true,
      deletedAt: new Date()
    }});
  }
  async forceDelete(id:number){
    return await this.prismaService.transaction.delete({where:{id}});
  }
}
