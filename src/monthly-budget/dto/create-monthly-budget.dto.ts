import { IsNotEmpty } from "class-validator";

export class CreateMonthlyBudgetDto {
    @IsNotEmpty()
    amount:number;
    @IsNotEmpty()
    note:string;
    @IsNotEmpty()
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