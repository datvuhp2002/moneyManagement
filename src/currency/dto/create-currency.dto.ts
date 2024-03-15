import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateCurrencyDto {
    @ApiProperty()
    @IsNotEmpty()
    name:string;
    @ApiProperty()
    @IsNotEmpty()
    exchange_rate:Number;
    @ApiProperty()
    @IsOptional()
    symbol:string;
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