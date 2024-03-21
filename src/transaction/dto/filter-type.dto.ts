import { Transaction } from '@prisma/client';

export interface TransactionRangeFilterType {
  start_date?:Date;
  end_date?:Date;

}
export interface TransactionPaginationResponseType {
  data: Transaction[];
  total: number;
}
export interface TransactionByRangeResponseType {
  data: Transaction[];
  total: number;
}

