import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto, CurrencyFilterType, CurrencyPaginationResponseType } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Currency } from '@prisma/client';

@Injectable()
export class CurrencyService {
  constructor(private prismaService: PrismaService){}
  create(data: CreateCurrencyDto) {
    return this.prismaService.currency.create({data})
  }

  async getAll(filters: CurrencyFilterType): Promise<CurrencyPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const roles = await this.prismaService.role.findMany({
      take: items_per_page,
      skip,
      select: {
        name: true,
        createdAt: true,
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
      data: roles,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }

  async getDetail(id: number): Promise<Currency> {
    return await this.prismaService.currency.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, data: UpdateCurrencyDto): Promise<Currency> {
    return await this.prismaService.user.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return `This action removes a #${id} currency`;
  }
}
