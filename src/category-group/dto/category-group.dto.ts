import { ApiProperty } from '@nestjs/swagger';
import { CategoriesGroup } from '@prisma/client';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateCategoryGroupDto {
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @ApiProperty()
  @IsNotEmpty()
  note: string;
}
export class UpdateCategoryGroupDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  note: string;
}
export interface CategoryGroupFilterType {
  items_per_page?: number | null;
  page?: number | null;
  search?: string | null;
  nextPage?: number | null;
  previousPage?: number | null;
}
export interface CategoryGroupPaginationResponseType {
  data: { name: string; createdAt: Date }[];
  total: number;
  currentPage: number;
  nextPage?: number;
  previousPage?: number;
  itemsPerPage?: number;
  
}

// export interface CategoryGroupCalculatorFilterType {
//   items_per_page?: number;
//   page?: number;
//   date?: Date;
//   nextPage?: number;
//   previousPage?: number;
// }
// export interface CategoryGroupCalculatorByRangeFilterType {
//   items_per_page?: number;
//   page?: number;
//   nextPage?: number;
//   previousPage?: number;
//   start_date?: Date;
//   end_date?: Date;
// }
// export interface CategoryGroupCalculatorPaginationResponseType {
//   data: CategoriesGroup[];
//   name: string,
//   note:string,
//   total: number;
//   currentPage: number;
//   nextPage?: number;
//   previousPage?: number;
//   itemsPerPage?: number;
// }


