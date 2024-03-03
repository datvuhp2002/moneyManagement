import { Controller, Get, Post, Body, Param, Delete, Query, ParseIntPipe, Put } from '@nestjs/common';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto, CurrencyFilterType, CurrencyPaginationResponseType } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { Public } from 'src/auth/decorator/auth.decorator';
import { Currency } from '@prisma/client';

@Controller('currency')
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Public()
  @Post()
  create(@Body() body: CreateCurrencyDto) : Promise<Currency> {
    console.log('create currency api', body);
    return this.currencyService.create(body);
  }
  @Public()
  @Get()
  getAll(@Query() params: CurrencyFilterType): Promise<CurrencyPaginationResponseType> {
    console.log('get all currency api', params);
    return this.currencyService.getAll(params);
  }

  @Get(':id')
  getDetail(@Param('id', ParseIntPipe) id: number): Promise<Currency> {
  console.log('get detail currency api =>', id);
  return this.currencyService.getDetail(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateCurrencyDto,
  ): Promise<Currency> {
    console.log('update currency api =>', id);
    return this.currencyService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.remove(+id);
  }
}
