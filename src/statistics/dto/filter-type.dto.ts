import { Statistics } from '@prisma/client';
import { TransactionType } from 'src/transaction/dto/Transaction.enum';
import { TransactionByRangeResponseType } from 'src/transaction/dto/filter-type.dto';
export interface StatisticsDateFilterType {
  recordDate?: Date;
}
export interface StatisticsFilterType {
  start_date?: Date;
  end_date?: Date;
}
export interface StatisticsPaginationResponseType {
  data: Statistics[];
  total: number;
}
export interface StatisticsCalculatorFilterType {
  date?: Date;
  transaction_type?: TransactionType;
}
export interface StatisticsCalculatorByRangeFilterType {
  start_date?: Date;
  end_date?: Date;
  transaction_type?: TransactionType;
}
export interface StatisticsCalculatorPaginationResponseType {
  data: Statistics[];
  transaction: TransactionByRangeResponseType;
  expense: number,
  revenue:number,
}
