import { Statistics } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
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
