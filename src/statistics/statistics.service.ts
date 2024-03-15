import { Injectable } from '@nestjs/common';
import { CreateStatisticDto } from './dto/create-statistic.dto';
import { UpdateStatisticDto } from './dto/update-statistic.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Statistics } from '@prisma/client';
import { StatisticsDateFilterType, StatisticsFilterType, StatisticsPaginationResponseType } from './dto/filter-type.dto';

@Injectable()
export class StatisticsService {
  constructor(private readonly prismaService: PrismaService){}
  async create(data: CreateStatisticDto,userId:number):Promise<Statistics> {
    return await this.prismaService.statistics.create({data:{...data,revenue:Number(data.revenue),expense:Number(data.expense),user_id:Number(userId), wallet_id:Number(data.wallet_id)}});
  }
  async findOne(userId:number,filters: StatisticsDateFilterType) {
    const statistics = await this.prismaService.statistics.findFirst({
      where: {
        user_id: userId,
        day: filters.day,
        month: filters.month,
        year: filters.year,
        AND: [
          {
            deleteMark: false,
          },
        ],
      },
    });
    return statistics;
  }
  async update(id: number, updateStatisticDto: UpdateStatisticDto):Promise<Statistics> {
    return await this.prismaService.statistics.update({where:{id},data:{...updateStatisticDto}})
  }

  async getAll(filters: StatisticsFilterType): Promise<StatisticsPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const startDate = filters.start_date ? new Date(filters.start_date) : new Date(0); // Ngày bắt đầu
    const endDate = filters.end_date ? new Date(filters.end_date) : new Date(); // Ngày kết thúc
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const where = {
      AND: [
          {
              deleteMark: false,
          },
          {
              OR: [
                  {
                      AND: [
                          {
                              day: {
                                  gte: startDate.getDate(),
                                  lte: endDate.getDate(),
                              },
                              month: {
                                  gte: startDate.getMonth() + 1,
                                  lte: endDate.getMonth() + 1,
                              },
                              year: {
                                  gte: startDate.getFullYear(),
                                  lte: endDate.getFullYear(),
                              }
                          }
                      ]
                  },
              ]
          }
      ]
  };
    const statistics = await this.prismaService.statistics.findMany({
      take: items_per_page,
      skip,
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.statistics.count({
      where
    });
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
  async getAllForUser(userId: number, filters: StatisticsFilterType): Promise<StatisticsPaginationResponseType> {
    const itemsPerPage = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const startDate = filters.start_date ? new Date(filters.start_date) : new Date(0); // Ngày bắt đầu
    const endDate = filters.end_date ? new Date(filters.end_date) : new Date(); // Ngày kết thúc
    const skip = (page - 1) * itemsPerPage;
    const where = {
        user_id: userId,
        deleteMark: false,
        AND: [
            {
                OR: [
                    {
                        day: {
                            gte: startDate.getDate(),
                            lte: endDate.getDate(),
                        },
                        month: {
                            gte: startDate.getMonth() + 1,
                            lte: endDate.getMonth() + 1,
                        },
                        year: {
                            gte: startDate.getFullYear(),
                            lte: endDate.getFullYear(),
                        }
                    },
                ]
            }
        ]
    };
    const [statistics, total] = await Promise.all([
        this.prismaService.statistics.findMany({
            where,
            orderBy: {
                createdAt: 'desc',
            },
            take: itemsPerPage,
            skip,
        }),
        this.prismaService.statistics.count({ where })
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
  async remove(id: number) {
    return `This action removes a #${id} statistic`;
  }

}
