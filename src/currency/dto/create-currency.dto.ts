import { IsNotEmpty } from "class-validator";

export class CreateCurrencyDto {
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    exchange_rate:Number;
}
export interface CurrencyFilterType {
    items_per_page?: number;
    page?: number;
    search?: string;
    nextPage?: number;
    previousPage?: number;
  }
export interface CurrencyPaginationResponseType {
    data: { name: string; createdAt: Date }[];
    total: number;
    currentPage: number;
    nextPage?: number;
    previousPage?: number;
    itemsPerPage?: number;
}