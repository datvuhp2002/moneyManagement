import { IsNotEmpty } from "class-validator";
export class CreateWalletDto {
    @IsNotEmpty()
    name:string;
    @IsNotEmpty()
    amount:number;
}
export interface WalletFilterType {
    items_per_page?: number;
    page?: number;
    search?: string;
    nextPage?: number;
    previousPage?: number;
  }
export interface WalletPaginationResponseType {
    data: { name: string; createdAt: Date }[];
    total: number;
    currentPage: number;
    nextPage?: number;
    previousPage?: number;
    itemsPerPage?: number;
}