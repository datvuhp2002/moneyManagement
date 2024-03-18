import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateMonthlyBudgetDto {
    @ApiProperty()
    @IsNotEmpty()
    amount:number;
    @IsNotEmpty()
    @ApiProperty()
    note:string;
    @IsNotEmpty()
    @ApiProperty()
    category_id:number;
}
export interface MonthlyBudgetFilterType {
    items_per_page?: number;
    page?: number;
    search?: string;
    nextPage?: number;
    previousPage?: number;
  }
export interface MonthlyBudgetPaginationResponseType {
    data: { note: string; amount: number; createdAt: Date }[];
    total: number;
    currentPage: number;
    nextPage?: number;
    previousPage?: number;
    itemsPerPage?: number;
}