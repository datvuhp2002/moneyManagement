import { Transaction } from "@prisma/client";

export interface TransactionFilterType {
    items_per_page?: number;
    page?: number;
    search?: string;
    nextPage?: number;
    previousPage?: number;
  }
  export interface TransactionPaginationResponseType {
    data: Transaction[];
    total: number;
    currentPage: number;
    nextPage?: number;
    previousPage?: number;
    itemsPerPage?: number;
  }