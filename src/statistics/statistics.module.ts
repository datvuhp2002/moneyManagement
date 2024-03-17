import { Module, forwardRef } from '@nestjs/common';
import { StatisticsService } from './statistics.service';
import { StatisticsController } from './statistics.controller';
import { PrismaService } from 'src/prisma.servcie';
import { TransactionService } from 'src/transaction/transaction.service';
import { WalletService } from 'src/wallet/wallet.service';

@Module({
  controllers: [StatisticsController],
  providers: [StatisticsService, PrismaService,TransactionService,WalletService],
})
export class StatisticsModule {}
