import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, Put } from '@nestjs/common';
import { MonthlyBudgetService } from './monthly-budget.service';
import { CreateMonthlyBudgetDto, MonthlyBudgetFilterType, MonthlyBudgetPaginationResponseType } from './dto/create-monthly-budget.dto';
import { UpdateMonthlyBudgetDto } from './dto/update-monthly-budget.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { MonthlyBudget } from '@prisma/client';
import { Request } from 'express';
import { Public } from 'src/auth/decorator/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('Monthly-budget')
@Controller('monthly-budget')
export class MonthlyBudgetController {
  constructor(private readonly monthlyBudgetService: MonthlyBudgetService) {}
  @Roles([Role.Admin])
  @Post()
  async create(@Req() req: Request,@Body() body: CreateMonthlyBudgetDto){
    const userId = Number(req.user['id'])
    // console.log(userId)
    return await this.monthlyBudgetService.create(userId,body);
  }
  @Roles([Role.Admin, Role.User])
  @Get()
  async getAll(@Param() filter: MonthlyBudgetFilterType):Promise<MonthlyBudgetPaginationResponseType>{
      return await this.monthlyBudgetService.getAll(filter)
  }

 @Public()
  @Get(':id')
  async getDetail(@Param('id', ParseIntPipe) id: number): Promise<MonthlyBudget> {
  return await this.monthlyBudgetService.getDetail(id);
  }

  @Roles([Role.Admin, Role.User])
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateMonthlyBudgetDto): Promise<MonthlyBudget> {
    return await this.monthlyBudgetService.update(id, data);
  }
  @Roles([Role.Admin])
  @Delete('force-delete/:id')
  async forceDelete(@Param('id',ParseIntPipe) id:number):Promise<MonthlyBudget>{
      return await this.monthlyBudgetService.forceDelete(id)
  }
  @Roles([Role.Admin])
  @Delete(':id')
  async delete(@Param('id',ParseIntPipe) id:number):Promise<MonthlyBudget>{
      return await this.monthlyBudgetService.delete(id)
  }
}
