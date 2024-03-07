import { Module } from '@nestjs/common';
import { MonthlyBudgetService } from './monthly-budget.service';
import { MonthlyBudgetController } from './monthly-budget.controller';
import { PrismaService } from 'src/prisma.servcie';

@Module({
  controllers: [MonthlyBudgetController],
  providers: [MonthlyBudgetService, PrismaService],
})
export class MonthlyBudgetModule {}
