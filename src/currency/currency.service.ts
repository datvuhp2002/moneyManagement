import { Injectable } from '@nestjs/common';
import {
  CreateCurrencyDto,
  CurrencyFilterType,
  CurrencyPaginationResponseType,
} from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaService } from 'src/prisma.servcie';
import { Currency } from '@prisma/client';

@Injectable()
export class CurrencyService {
  constructor(private prismaService: PrismaService) {}
  async getAllTrash(
  ): Promise<CurrencyPaginationResponseType> {
    const currency = await this.prismaService.currency.findMany({
      where: {
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
        AND: [
          {
            deleteMark: true,
          },
        ],
      },
    });
    return {
      data: currency,
      total,
    };
  }
  async create(data: CreateCurrencyDto): Promise<Currency> {
    return await this.prismaService.currency.create({
      data: { ...data},
    });
  }

  async getAll(
  ): Promise<CurrencyPaginationResponseType> {
    const currency = await this.prismaService.currency.findMany({
      select: {
        name: true,
        createdAt: true,
        deletedAt: true,
      },
      where: {
       
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    const total = await this.prismaService.role.count({
    });
    return {
      data: currency,
      total,
    };
  }

  async getAllForUser(
    id: number,
  ): Promise<CurrencyPaginationResponseType> {
    const currency = await this.prismaService.currency.findMany({
      where: {
        id,
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
    console.log('currency = ', currency);
    const total = await this.prismaService.categoriesGroup.count({
      where: {
        user_id: id,
        AND: [
          {
            deleteMark: false,
          },
        ],
      },
    });
    return {
      data: currency,
      total,
    };
  }

  async createDefaultCurrency(userId: number) {
    const DefaultCurrency = [
      { name: "VND"},
      { name: "USD"},
      { name: "EURO"},
      { name: "BAHT"},
      { name: "GBP"},
      { name: "CHF"},
      { name: "Yên"},
      { name: "RUB"},
      { name: "HRK "},
  ];
  await this.prismaService.currency.createMany({
      data: DefaultCurrency.map(Currency => ({
          name: Currency.name
      }))
  });
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
      data: { ...data },
    });
  }
  async delete(id: number): Promise<Currency> {
    return await this.prismaService.currency.update({
      where: { id, deleteMark: false },
      data: {
        deleteMark: true,
        deletedAt: new Date(),
      },
    });
  }
  async forceDelete(id: number): Promise<Currency> {
    return await this.prismaService.currency.delete({
      where: { id, deleteMark: true },
    });
  }
}
