import { Injectable } from '@nestjs/common';
import { CreateCurrencyDto, CurrencyFilterType, CurrencyPaginationResponseType } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Currency } from '@prisma/client';

@Injectable()
export class CurrencyService {
  constructor(private prismaService: PrismaService){}
  async getAllTrash(filters: CurrencyFilterType): Promise<CurrencyPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const currency = await this.prismaService.currency.findMany({
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
      data: currency,
      total,
      nextPage,
      previousPage,
      currentPage: page,
      itemsPerPage: items_per_page,
    };
  }
  async create(data: CreateCurrencyDto): Promise<Currency> {
    return await this.prismaService.currency.create({data: {...data, exchange_rate:Number(data.exchange_rate)}})    
  }


  // async create(data: CreateCurrencyDto):Promise<Currency>{
  //   return this.prismaService.categoriesGroup.create({data:{...data, exchange_rate:Number(data.exchange_rate)}})
  // }
  async getAll(filters: CurrencyFilterType): Promise<CurrencyPaginationResponseType> {
    const items_per_page = Number(filters.items_per_page) || 10;
    const page = Number(filters.page) || 1;
    const search = filters.search || '';
    const skip = page > 1 ? (page - 1) * items_per_page : 0;
    const roles = await this.prismaService.currency.findMany({
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
    return await this.prismaService.currency.update({
      where: { id },
      data: {...data,exchange_rate:Number(data.exchange_rate)},
    });
  }
  async delete(id: number):Promise<Currency>{
    return await this.prismaService.currency.update({
      where:{id, deleteMark: false},
      data:{
        deleteMark: true,
        deletedAt: new Date()
      }
    })
  }
  async forceDelete(id: number):Promise<Currency>{
    return await this.prismaService.currency.delete({
      where:{id, deleteMark:true},
    })
  }
}
