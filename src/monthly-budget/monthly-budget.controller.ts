import { Controller, Get, Post, Body, Patch, Param, Delete, Req } from '@nestjs/common';
import { MonthlyBudgetService } from './monthly-budget.service';
import { CreateMonthlyBudgetDto, MonthlyBudgetFilterType, MonthlyBudgetPaginationResponseType } from './dto/create-monthly-budget.dto';
import { UpdateMonthlyBudgetDto } from './dto/update-monthly-budget.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/dto/Role.enum';
import { MonthlyBudget } from '@prisma/client';
import { Request } from 'express';
import { Public } from '@prisma/client/runtime/library';

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
  @Roles([Role.Admin])
  @Get()
  async getAll(@Param() filter: MonthlyBudgetFilterType):Promise<MonthlyBudgetPaginationResponseType>{
      return await this.monthlyBudgetService.getAll(filter)
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.monthlyBudgetService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMonthlyBudgetDto: UpdateMonthlyBudgetDto) {
    return this.monthlyBudgetService.update(+id, updateMonthlyBudgetDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.monthlyBudgetService.remove(+id);
  }
}
