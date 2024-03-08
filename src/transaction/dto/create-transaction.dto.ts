import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
  
export class CreateTransactionDto {
    @IsNotEmpty()
    transactionType: string
    @IsNotEmpty()
    bill:number
    @IsNotEmpty()
    note: string
    @IsNotEmpty()
    currency_id:number
    @IsNotEmpty()
    categoriesGroup_id:number
    @IsNotEmpty()
    category_id:number
    @IsNotEmpty()
    wallet_id:number
    @IsOptional()
    paymentImage: string
}
