import { Statistics } from '@prisma/client';
import { TransactionType } from 'src/transaction/dto/Transaction.enum';
import { TransactionByRangeResponseType } from 'src/transaction/dto/filter-type.dto';
export interface StatisticsDateFilterType {
  recordDate?: Date;
}
export interface StatisticsFilterType {
  items_per_page?: number;
  page?: number;
  start_date?: Date;
  end_date?: Date;
  nextPage?: number;
  previousPage?: number;
}
export interface StatisticsPaginationResponseType {
  data: Statistics[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export interface StatisticsCalculatorFilterType {
  items_per_page?: number;
  page?: number;
  date?: Date;
  nextPage?: number;
  previousPage?: number;
  transaction_type?: TransactionType;
}
export interface StatisticsCalculatorByRangeFilterType {
  items_per_page?: number;
  page?: number;
  nextPage?: number;
  previousPage?: number;
  start_date?: Date;
  end_date?: Date;
  search?:string
  transaction_type?: TransactionType;
}
export interface StatisticsCalculatorPaginationResponseType {
  data: Statistics[];
  transaction: TransactionByRangeResponseType;
  expense: number,
  revenue:number,
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
