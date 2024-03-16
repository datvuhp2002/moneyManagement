import { ApiProperty } from '@nestjs/swagger';
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
