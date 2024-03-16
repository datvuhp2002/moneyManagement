import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'src/prisma.servcie';
import { StatisticsService } from 'src/statistics/statistics.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService, StatisticsService],
})
export class TransactionModule {}
