import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Statistics } from '@prisma/client';
import {
  StatisticsDateFilterType,
  StatisticsFilterType,
  StatisticsPaginationResponseType,
} from './dto/filter-type.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService) {}
  async create(data: CreateStatisticDto, userId: number): Promise<Statistics> {
    return await this.prismaService.statistics.create({
      data: {
        ...data,
        revenue: Number(data.revenue),
        expense: Number(data.expense),
        user_id: Number(userId),
        wallet_id: Number(data.wallet_id),
      },
    });
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
    return await this.prismaService.statistics.update({
      where: { id },
      data: { ...updateStatisticDto },
    });
  }
  async getAll(
    filters: StatisticsFilterType,
  ): Promise<StatisticsPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const startDate = filters.start_date
      ? new Date(filters.start_date)
      : new Date(0); // Ngày bắt đầu
    const endDate = filters.end_date ? new Date(filters.end_date) : new Date(); // Ngày kết thúc
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
      : new Date(0); // Ngày bắt đầu
    const endDate = filters.end_date ? new Date(filters.end_date) : new Date(); // Ngày kết thúc
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
  async calculatorByMonth(userId: number, date: Date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tiên của tháng
    const endDate = new Date(year, month, 0); // Ngày cuối cùng của tháng
    const statistics = await this.prismaService.statistics.findMany({
      where: {
        user_id: userId,
        deleteMark: false,
        recordDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        recordDate: 'asc',
      },
    });

    const total = await this.prismaService.statistics.aggregate({
      _sum: {
        expense: true,
        revenue: true,
      },
      where: {
        user_id: userId,
        deleteMark: false,
        recordDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return {
      data: statistics,
      total: {
        expense: total._sum?.expense ?? 0,
        revenue: total._sum?.revenue ?? 0,
      },
    };
  }

  async calculatorByDateRange(userId: number, startDate: Date, endDate: Date) {
    endDate.setHours(23, 59, 59, 999);
    const where = {
      user_id: userId,
      deleteMark: false,
      recordDate: {
        gte: startDate,
        lte: endDate,
      },
    };
    const statistics = await this.prismaService.statistics.findMany({
      where,
      orderBy: {
         recordDate: 'asc',
      },
    });
    const total = await this.prismaService.statistics.aggregate({
      _sum: {
        expense: true,
        revenue: true,
      },
      where,
    });
    return {
      data: statistics,
      total: {
        expense: total._sum?.expense ?? 0,
        revenue: total._sum?.revenue ?? 0,
      },
    };
  }

  async calculatorByYear(userId: number, date: Date) {
    const year = date.getFullYear();
    const statistics = await this.prismaService.statistics.findMany({
      where: {
        user_id: userId,
        deleteMark: false,
        recordDate: {
          gte: new Date(year, 0, 1), // Ngày bắt đầu của năm
          lt: new Date(year + 1, 0, 1), // Ngày kết thúc của năm
        },
      },
      orderBy: {
         recordDate: 'asc',
      },
    });

    const total = await this.prismaService.statistics.aggregate({
      _sum: {
        expense: true,
        revenue: true,
      },
      where: {
        user_id: userId,
        deleteMark: false,
        recordDate: {
          gte: new Date(year, 0, 1), // Ngày bắt đầu của năm
          lt: new Date(year + 1, 0, 1), // Ngày kết thúc của năm
        },
      },
    });

    return {
      data: statistics,
      total: {
        expense: total._sum?.expense ?? 0,
        revenue: total._sum?.revenue ?? 0,
      },
    };
  }

  async remove(id: number) {
    return `This action removes a #${id} statistic`;
  }
}
