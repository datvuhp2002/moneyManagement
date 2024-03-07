import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Put, Req } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto, CurrencyFilterType, CurrencyPaginationResponseType } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Public } from 'src/auth/decorator/auth.decorator';
import { Currency } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}
  @Roles([Role.Admin])
  @Post()
  async create(@Body() body: CreateCurrencyDto) : Promise<Currency> {
    return await this.currencyService.create(body);
  }
  @Roles([Role.Admin])
  @Get("/trash")
  async getAllTrash(@Param() filter: CurrencyFilterType):Promise<CurrencyPaginationResponseType>{
      return await this.currencyService.getAllTrash(filter)
  }
  @Get()
  async getAll(@Param() filter: CurrencyFilterType):Promise<CurrencyPaginationResponseType>{
      return await this.currencyService.getAll(filter)
  }
  @Public()
  @Get(':id')
  async getDetail(@Param('id', ParseIntPipe) id: number): Promise<Currency> {
  return await this.currencyService.getDetail(id);
  }
  @Roles([Role.Admin])
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateCurrencyDto): Promise<Currency> {
    return await this.currencyService.update(id, data);
  }
  @Roles([Role.Admin])
  @Delete('force-delete/:id')
  async forceDelete(@Param('id',ParseIntPipe) id:number):Promise<Currency>{
      return await this.currencyService.forceDelete(id)
  }
  @Roles([Role.Admin])
  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id:number):Promise<Currency>{
      return await this.currencyService.delete(id)
  }
}
