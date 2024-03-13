import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Put, Req } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto, CurrencyFilterType, CurrencyPaginationResponseType } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Public } from 'src/auth/decorator/auth.decorator';
import { Currency } from '@prisma/client';
import { Request } from 'express';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
@ApiBearerAuth()

@ApiTags('Currency')
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
  @ApiQuery({name:"page",required:false})
  @ApiQuery({name:"items_per_page",required:false})
  @ApiQuery({name:"search",required:false})
  @ApiQuery({name:"previousPage",required:false})
  @ApiQuery({name:"nextPage",required:false})
  async getAllTrash(@Param() filter: CurrencyFilterType):Promise<CurrencyPaginationResponseType>{
      return await this.currencyService.getAllTrash(filter)
  }
  @Get()
  @ApiQuery({name:"page",required:false})
  @ApiQuery({name:"items_per_page",required:false})
  @ApiQuery({name:"search",required:false})
  @ApiQuery({name:"previousPage",required:false})
  @ApiQuery({name:"nextPage",required:false})
  async getAll(@Param() filter: CurrencyFilterType):Promise<CurrencyPaginationResponseType>{
      return await this.currencyService.getAll(filter)
  }
  @Roles([Role.User])
  @Get("/getAll")
  async getAllForUser(@Req() req: Request,@Param() filter: CurrencyFilterType):Promise<CurrencyPaginationResponseType>{
    const userId = Number(req.user['id']);
    return this.currencyService.getAllForUser(userId, filter)
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
