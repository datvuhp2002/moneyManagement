import { Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Category } from '@prisma/client';
import {
  CategoryFilterType,
  CategoryPaginationResponseType,
} from './dto/category-filter.dto';

@Injectable()
export class CategoryService {
  constructor(private prismaService: PrismaService) {}
  async create(
    userId: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<Category> {
    return await this.prismaService.category.create({
      data: {
        ...createCategoryDto,
        categoriesGroup_id: Number(createCategoryDto.categoriesGroup_id),
        user_id: userId,
      },
    });
  }
  async trash(
    filters: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categories = await this.prismaService.category.findMany({
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
    const total = await this.prismaService.category.count({
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
      data: categories,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAll(
    filters: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categories = await this.prismaService.category.findMany({
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
            deleteMark: false,
          },
        ],
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.category.count({
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
            deleteMark: false,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: categories,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getAllForUser(
    userId: number,
    filters: CategoryFilterType,
  ): Promise<CategoryPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categories = await this.prismaService.category.findMany({
      take: items_per_page,
      skip,
      where: {
        user_id: userId,
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
    const total = await this.prismaService.category.count({
      where: {
        user_id: userId,
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
      data: categories,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async findDetail(id: number) {
    return await this.prismaService.category.findUnique({ where: { id } });
  }
  async findDetailForUser(userId: number, id: number) {
    return await this.prismaService.category.findUnique({
      where: { id, user_id: userId },
    });
  }
  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return await this.prismaService.category.update({
      where: { id },
      data: {
        ...updateCategoryDto,
        categoriesGroup_id: Number(updateCategoryDto.categoriesGroup_id),
      },
    });
  }
  async delete(id: number) {
    return await this.prismaService.category.update({
      where: { id },
      data: {
        deleteMark: true,
        deletedAt: new Date(),
      },
    });
  }
  async forceDelete(id: number) {
    return await this.prismaService.category.delete({ where: { id } });
  }
}
