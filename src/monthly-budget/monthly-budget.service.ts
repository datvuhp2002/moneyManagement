import { Injectable } from '@nestjs/common';
import {
  CreateMonthlyBudgetDto,
  MonthlyBudgetFilterType,
  MonthlyBudgetPaginationResponseType,
} from './dto/create-monthly-budget.dto';
import { UpdateMonthlyBudgetDto } from './dto/update-monthly-budget.dto';
import { PrismaService } from 'src/prisma.servcie';
import { MonthlyBudget } from '@prisma/client';

@Injectable()
export class MonthlyBudgetService {
  constructor(private prismaService: PrismaService) {}
  async create(userId: number, data: CreateMonthlyBudgetDto) {
    return await this.prismaService.monthlyBudget.create({
      data: {
        ...data,
        amount: Number(data.amount),
        user_id: userId,
        category_id: Number(data.category_id),
      },
    });
  }

  async getAll(
    filters: MonthlyBudgetFilterType,
  ): Promise<MonthlyBudgetPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const monthlyBudget = await this.prismaService.monthlyBudget.findMany({
      take: items_per_page,
      skip,
      select: {
        amount: true,
        note: true,
        createdAt: true,
        deletedAt: true,
      },
      where: {
        OR: [
          {
            note: {
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
      data: monthlyBudget,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getAllForUser(
    id: number,
    filters: MonthlyBudgetFilterType,
  ): Promise<MonthlyBudgetPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const monthlyBudget = await this.prismaService.monthlyBudget.findMany({
      take: items_per_page,
      skip,
      where: {
        user_id: id,
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
    console.log('monthly budget = ', monthlyBudget);
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
      data: monthlyBudget,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: number): Promise<MonthlyBudget> {
    return await this.prismaService.monthlyBudget.findUnique({
      where: {
        id,
      },
    });
  }

  async update(
    id: number,
    data: UpdateMonthlyBudgetDto,
  ): Promise<MonthlyBudget> {
    return await this.prismaService.monthlyBudget.update({
      where: { id },
      data: { ...data, amount: Number(data.amount) },
    });
  }

  async delete(id: number): Promise<MonthlyBudget> {
    return await this.prismaService.monthlyBudget.update({
      where: { id },
      data: {
        deleteMark: true,
        deletedAt: new Date(),
      },
    });
  }
  async forceDelete(id: number): Promise<MonthlyBudget> {
    return await this.prismaService.monthlyBudget.delete({
      where: { id, deleteMark: true },
    });
  }
}
