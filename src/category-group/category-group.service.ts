import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.servcie';
import {
  CategoryGroupFilterType,
  CategoryGroupPaginationResponseType,
  CreateCategoryGroupDto,
  UpdateCategoryGroupDto,
} from './dto/category-group.dto';
import { CategoriesGroup } from '@prisma/client';
@Injectable()
export class CategoryGroupService {
  constructor(private prismaService: PrismaService) {}
  async create(
    id: number,
    data: CreateCategoryGroupDto,
  ): Promise<CategoriesGroup> {
    return this.prismaService.categoriesGroup.create({
      data: { ...data, user_id: id },
    });
  }
  async getDetail(id: number): Promise<CategoriesGroup> {
    return await this.prismaService.categoriesGroup.findUnique({
      where: { id },
    });
  }
  async getAll(
    filters: CategoryGroupFilterType,
  ): Promise<CategoryGroupPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categoriesGroup = await this.prismaService.categoriesGroup.findMany({
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
            deleteMark: false,
          },
        ],
      },
    });
    const lastPage = Math.ceil(total / items_per_page);
    const nextPage = page + 1 > lastPage ? null : page + 1;
    const previousPage = page - 1 < 1 ? null : page - 1;
    return {
      data: categoriesGroup,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAllTrash(
    filters: CategoryGroupFilterType,
  ): Promise<CategoryGroupPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categoriesGroup = await this.prismaService.categoriesGroup.findMany({
      take: items_per_page,
      skip,
      include: {
        ownership_user: {
          select: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
      where: {
        OR: [
          {
            name: {
              contains: search,
            },
            ownership_user: {
              username: {
                contains: search,
              },
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
      data: categoriesGroup,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async getAllForUser(
    id: number,
    filters: CategoryGroupFilterType,
  ): Promise<CategoryGroupPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const categoriesGroup = await this.prismaService.categoriesGroup.findMany({
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
    console.log('category = ', categoriesGroup);
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
      data: categoriesGroup,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async update(
    id: number,
    data: UpdateCategoryGroupDto,
  ): Promise<CategoriesGroup> {
    return this.prismaService.categoriesGroup.update({
      where: { id },
      data: { ...data },
    });
  }
  async delete(id: number): Promise<CategoriesGroup> {
    return await this.prismaService.categoriesGroup.update({
      where: { id },
      data: {
        deleteMark: true,
        deletedAt: new Date(),
      },
    });
  }
  async forceDelete(id: number): Promise<CategoriesGroup> {
    return await this.prismaService.categoriesGroup.delete({
      where: { id, deleteMark: true },
    });
  }
}
