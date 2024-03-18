import { Inject, Injectable, forwardRef } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Statistics } from '@prisma/client';
import {
  StatisticsCalculatorByRangeFilterType,
  StatisticsCalculatorFilterType,
  StatisticsCalculatorPaginationResponseType,
  StatisticsDateFilterType,
  StatisticsFilterType,
  StatisticsPaginationResponseType,
} from './dto/filter-type.dto';
import { TransactionService } from 'src/transaction/transaction.service';
import { TransactionPaginationResponseType } from 'src/transaction/dto/filter-type.dto';
import { TransactionType } from 'src/transaction/dto/Transaction.enum';
import { WalletService } from 'src/wallet/wallet.service';

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => TransactionService))
    private transactionService: TransactionService,
    private walletService: WalletService) {}
  async create(data: CreateStatisticDto, userId: number): Promise<Statistics> {
    const stasitics = await this.prismaService.statistics.create({
      data: {
        ...data,
        revenue: Number(data.revenue),
        expense: Number(data.expense),
        user_id: Number(userId),
        wallet_id: Number(data.wallet_id),
      },
    });
    const amount = stasitics.revenue - stasitics.expense;
    await this.walletService.updateAmount(stasitics.wallet_id,amount)
    return stasitics
  }
  async findOne(userId: number, filters: Date) {
    const statistics = await this.prismaService.statistics.findFirst({
      where: {
        user_id: userId,
        recordDate: {
          gte: new Date(
            filters.getFullYear(),
            filters.getMonth(),
            filters.getDate(),
          ), // Lớn hơn hoặc bằng ngày/tháng/năm
          lt: new Date(
            filters.getFullYear(),
            filters.getMonth(),
            filters.getDate() + 1,
          ), // Nhỏ hơn ngày/tháng/năm tiếp theo
        },
        deleteMark: false,
      },
    });
    return statistics;
  }
  async update(
    id: number,
    updateStatisticDto: UpdateStatisticDto,
  ): Promise<Statistics> {
    const stasitics = await this.prismaService.statistics.update({
      where: { id },
      data: { ...updateStatisticDto },
    });
    const amount = stasitics.revenue - stasitics.expense;
    await this.walletService.updateAmount(stasitics.wallet_id,amount)
    return stasitics
  }
  async getAll(
    filters: StatisticsFilterType,
  ): Promise<StatisticsPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const startDate = filters.start_date
      ? new Date(filters.start_date)
      : new Date(0); 
    const endDate = filters.end_date ? new Date(filters.end_date) : new Date(); 
    endDate.setHours(23, 59, 59, 999);
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const where = {
      deleteMark: false,
      recordDate: {
        gte: startDate,
        lte: endDate,
      },
    };
    const statistics = await this.prismaService.statistics.findMany({
      take: items_per_page,
      skip,
      where,
      orderBy: {
         recordDate: 'asc',
      },
    });
    const total = await this.prismaService.statistics.count({ where });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: statistics,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAllForUser(
    userId: number,
    filters: StatisticsFilterType,
  ): Promise<StatisticsPaginationResponseType> {
    const itemsPerPage = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const startDate = filters.start_date
      ? new Date(filters.start_date)
      : new Date(0);
    const endDate = filters.end_date ? new Date(filters.end_date) : new Date(); 
    endDate.setHours(23, 59, 59, 999);
    const skip = (page - 1) * itemsPerPage;
    const where = {
        user_id:userId,
      deleteMark: false,
      recordDate: {
        gte: startDate,
        lte: endDate,
      },
    };
    const [statistics, total] = await Promise.all([
      this.prismaService.statistics.findMany({
        where,
        orderBy: {
            recordDate: 'asc',
        },
        take: itemsPerPage,
        skip,
      }),
      this.prismaService.statistics.count({ where }),
    ]);
    const lastPage = Math.ceil(total / itemsPerPage);
    const nextPage = page >= lastPage ? null : page + 1;
    const previousPage = page <= 1 ? null : page - 1;
    return {
      data: statistics,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage,
    };
  }
  async calculatorByMonth(userId: number, filters:StatisticsCalculatorFilterType):Promise<StatisticsCalculatorPaginationResponseType> {
    const date =filters.date ? new Date(filters.date) : new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startDate = new Date(year, month - 1, 1); 
    const endDate = new Date(year, month, 0);
    endDate.setHours(23, 59, 59, 999);
    const statistics = await this.calculatorByDateRange(userId, filters, startDate, endDate)
    return statistics
  }
  async calculatorByYear(userId: number, filters:StatisticsCalculatorFilterType ):Promise<StatisticsCalculatorPaginationResponseType> {
    const date = filters.date ? new Date(filters.date) : new Date();
    const year = date.getFullYear();
    const startDate = new Date(year, 0, 1); 
    const endDate = new Date(year + 1, 0, 1);
    endDate.setHours(23, 59, 59, 999);
    const statistics = await this.calculatorByDateRange(userId, filters, startDate, endDate)
    return statistics
  }
  async calculatorByDateRange(userId: number, filters: StatisticsCalculatorByRangeFilterType,startDate: Date, endDate: Date):Promise<StatisticsCalculatorPaginationResponseType>{
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const where = {
      user_id: userId,
      deleteMark: false,
      recordDate: {
        gte: startDate,
        lte: endDate,
      },
    };
    const statistics = await this.prismaService.statistics.findMany({
      take: items_per_page,
      skip,
      where,
      orderBy: {
         recordDate: 'asc',
      },
    });
    const calculator = await this.prismaService.statistics.aggregate({
      _sum: {
        expense: true,
        revenue: true,
      },
      where,
    });
    const transactions = await this.transactionService.getAllByRange(userId,startDate,endDate,filters.transaction_type)
    const total = await this.prismaService.statistics.count({ where });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: statistics,
      transaction: transactions,
      expense: calculator._sum?.expense ?? 0,
      revenue: calculator._sum?.revenue ?? 0,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async remove(id: number) {
    return `This action removes a #${id} statistic`;
  }
}
