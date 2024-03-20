import { Delete, HttpException, HttpStatus, Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { PrismaService } from 'src/prisma.servcie';
import {
  TransactionByRangeResponseType,
  TransactionFilterType,
  TransactionPaginationResponseType,
  TransactionRangeFilterType,
} from './dto/filter-type.dto';
import { Statistics, Transaction } from '@prisma/client';
import { StatisticsService } from 'src/statistics/statistics.service';
import { TransactionType } from './dto/Transaction.enum';
import { WalletService } from 'src/wallet/wallet.service';
import { UploadPaymentImageDto } from './dto/upload-paymentImage.dto';

@Injectable()
export class TransactionService {
  constructor(
    private prismaService: PrismaService,
    @Inject(forwardRef(() => StatisticsService))
    private statisticsService: StatisticsService,
    private walletService: WalletService,
  ) {}
  async create(
    userId: number,
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    const transaction = await this.prismaService.transaction.create({
      data: {
        ...createTransactionDto,
        bill: Number(createTransactionDto.bill),
        currency_id: Number(createTransactionDto.currency_id),
        categoriesGroup_id: Number(createTransactionDto.categoriesGroup_id),
        category_id: Number(createTransactionDto.category_id),
        wallet_id: Number(createTransactionDto.wallet_id),
        user_id: userId,
      },
    });
    const date = createTransactionDto.recordDate
      ? new Date(createTransactionDto.recordDate)
      : new Date();
    if (transaction)
      await this.updateOrCreateStatistics(userId, date, createTransactionDto);
    return transaction;
  }
  private async updateOrCreateStatistics(
    userId: number,
    date: Date,
    createTransactionDto: CreateTransactionDto,
  ): Promise<void> {
    const statistics = await this.statisticsService.findOne(userId, date);
    if (statistics) {
      await this.updateStatistics(statistics, createTransactionDto);
    } else {
      await this.createStatistics(userId, date, createTransactionDto);
    }
  }
  private async updateStatistics(
    statistics: Statistics,
    createTransactionDto: any,
  ): Promise<Statistics> {
    const date = createTransactionDto.recordDate
      ? new Date(createTransactionDto.recordDate)
      : new Date();
    const statisticsUpdateData = await this.statisticsService.update(statistics.id, {
      expense:
        createTransactionDto.transactionType === TransactionType.Chi
          ? statistics.expense + Number(createTransactionDto.bill)
          : statistics.expense,
      revenue:
        createTransactionDto.transactionType === TransactionType.Thu
          ? statistics.revenue + Number(createTransactionDto.bill)
          : statistics.revenue,
      recordDate: date,
      wallet_id: Number(createTransactionDto.wallet_id),
    });
    const amount = statisticsUpdateData.revenue - statisticsUpdateData.expense;
    await this.walletService.updateAmount(statisticsUpdateData.wallet_id,amount)
    return statisticsUpdateData
  }
  private async updateValueStatistics(statistics: Statistics, transaction: Transaction, updateTransaction: UpdateTransactionDto): Promise<Statistics> {
    const oldTransactionType = transaction.transactionType;
    const newTransactionType = updateTransaction.transactionType;

    const billChange = Number(updateTransaction.bill) - Number(transaction.bill);
    let expense = statistics.expense;
    let revenue = statistics.revenue;

    // Nếu loại giao dịch không thay đổi, chỉ cập nhật giá trị thống kê dựa trên sự thay đổi của giao dịch
    if (oldTransactionType === newTransactionType) {
        if (oldTransactionType === TransactionType.Chi) {
            expense += billChange;
        } else if (oldTransactionType === TransactionType.Thu) {
            revenue += billChange;
        }
    } else {
        if (oldTransactionType === TransactionType.Chi) {
            expense -= Number(transaction.bill);
        } else if (oldTransactionType === TransactionType.Thu) {
            revenue -= Number(transaction.bill);
        }
        if (newTransactionType === TransactionType.Chi) {
            expense += Number(updateTransaction.bill);
        } else if (newTransactionType === TransactionType.Thu) {
            revenue += Number(updateTransaction.bill);
        }
    }
    const amount = revenue - expense;
    await this.walletService.updateAmount(statistics.wallet_id,amount)
    return await this.statisticsService.update(statistics.id, {
        expense,
        revenue,
        wallet_id: Number(updateTransaction.wallet_id),
    });
}
  async update(userId: number, id: number, updateTransactionDto: UpdateTransactionDto):Promise<Transaction> {
    const transaction = await this.getDetail(id);
    try {
        const date = transaction.recordDate ? new Date(transaction.recordDate) : new Date();
        const statistics = await this.statisticsService.findOne(userId, date);
        const updatedStatistics = await this.updateValueStatistics(statistics, transaction, updateTransactionDto);
        return await this.prismaService.transaction.update({
            where: { id },
            data: {
                ...updateTransactionDto,
                bill: Number(updateTransactionDto.bill),
                currency_id: Number(updateTransactionDto.currency_id),
                categoriesGroup_id: Number(updateTransactionDto.categoriesGroup_id),
                category_id: Number(updateTransactionDto.category_id),
                wallet_id: Number(updateTransactionDto.wallet_id),
            },
        });
      } catch (err) {
        console.error(err);
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR); 
    }
  }
  private async createStatistics(
    userId: number,
    date: Date,
    createTransactionDto: CreateTransactionDto,
  ): Promise<void> {
    await this.statisticsService.create(
      {
        expense:
          createTransactionDto.transactionType === TransactionType.Chi
            ? Number(createTransactionDto.bill)
            : 0,
        revenue:
          createTransactionDto.transactionType === TransactionType.Thu
            ? Number(createTransactionDto.bill)
            : 0,
        recordDate: date,
        wallet_id: Number(createTransactionDto.wallet_id),
      },
      userId,
    );
  }
  async getAll(
    filters: TransactionFilterType,
  ): Promise<TransactionPaginationResponseType> {
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
  async getAllForUser(
    userId: number,
    filters: TransactionFilterType,
  ): Promise<TransactionPaginationResponseType> {
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
  async getAllByRange(
    userId: number,
    startDate:Date,
    endDate:Date,
    search:string,
    transaction_type:string
  ): Promise<TransactionByRangeResponseType> {
    const searchKeyWord = search || '';
    endDate.setHours(23, 59, 59, 999);
    const where:any = {
      user_id: userId,
      recordDate: {
        gte: startDate,
        lte: endDate,
      },
      deleteMark: false,
      OR: [
        {
          note: {
            contains: searchKeyWord,
          },
        },
      ],
    }
    if(transaction_type){
      const transactionsType = TransactionType[`${transaction_type}`] 
      where.transactionType = transactionsType;
    }
    const Transactions = await this.prismaService.transaction.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.transaction.count({
      where
    });
    return {
      data: Transactions,
      total,
    };
  }
  async getDetail(id: number):Promise<Transaction> {
    return await this.prismaService.transaction.findUnique({ where: { id,deleteMark:false } });
  }
  async uploadPaymentImage(id: number, paymentImage: string): Promise<UploadPaymentImageDto> {
    return await this.prismaService.transaction.update({
      where: { id },
      data: { paymentImage },
    });
  }
  async getDetailForUser(userId: number, id: number): Promise<any> {
    return await this.prismaService.transaction.findUnique({
      where: { user_id: userId, id, deleteMark: false },
      select: {
        id: true,
        recordDate: true,
        transactionType: true,
        bill: true,
        note: true,
        paymentImage: true,
        createdAt: true,
        updatedAt: true,
        user_id: true,
        wallet_id: true,
        category_id: true,
        currency_id: true,
        categoriesGroup_id: true,
        ownership_wallet: {
          select: {
            id: true,
            name: true,
            amount: true,
            createdAt: true,
            updatedAt: true, 
            deletedAt: false, // Loại bỏ deletedAt
            deleteMark: false, // Loại bỏ deleteMark
            user_id: true,
          },
        },
        ownership_categoriesGroup: {
          select: {
            id: true,
            user_id: true,
            name: true,
            note: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: false, // Loại bỏ deletedAt
            deleteMark: false, // Loại bỏ deleteMark
          },
        },
        ownership_category: {
          select: {
            id: true,
            name: true,
            symbol: true,
            user_id: true,
            categoriesGroup_id: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: false, // Loại bỏ deletedAt
            deleteMark: false, // Loại bỏ deleteMark
          },
        },
        ownership_currency: {
          select: {
            id: true,
            name: true,
            exchange_rate: true,
            symbol: true,
            createdAt: true,
            updatedAt: true,
            deletedAt: false, // Loại bỏ deletedAt
            deleteMark: false, // Loại bỏ deleteMark
          },
        },
      },
    });
  }
  
  async trash(
    filters: TransactionFilterType,
  ): Promise<TransactionPaginationResponseType> {
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
  async delete(userId: number, id: number): Promise<void> {
    try {
        const transaction = await this.prismaService.transaction.findUnique({
            where: { id },
        });
        const statisticsDate = new Date(transaction.recordDate);
        const statistics = await this.statisticsService.findOne(userId, statisticsDate);
        const bill = Number(transaction.bill);
        const updateData: Partial<Statistics> = {};
        if (transaction.transactionType === TransactionType.Chi) {
            updateData.expense = statistics.expense - bill;
        } else if (transaction.transactionType === TransactionType.Thu) {
            updateData.revenue = statistics.revenue - bill;
        }
        await this.statisticsService.update(statistics.id, updateData);
        await this.prismaService.transaction.update({
            where: { id },
            data: {
                deleteMark: true,
                deletedAt: new Date(),
            },
        });
    } catch (err) {
        console.error(err);
        throw new HttpException(err.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async forceDelete(id: number) {
    return await this.prismaService.transaction.delete({ where: { id } });
  }
}
