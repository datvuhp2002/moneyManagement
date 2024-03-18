import { Transaction } from '@prisma/client';

export interface TransactionFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
}
export interface TransactionRangeFilterType {
  items_per_page?: number;
  page?: number;
  search?: string;
  nextPage?: number;
  previousPage?: number;
  start_date?:Date;
  end_date?:Date;

}
export interface TransactionPaginationResponseType {
  data: Transaction[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
}
export interface TransactionByRangeResponseType {
  data: Transaction[];
  total: number;
}

