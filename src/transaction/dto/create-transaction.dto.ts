import { ApiProperty } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional } from "class-validator";
import { TransactionType } from "./Transaction.enum";
  
export class CreateTransactionDto {
    @IsNotEmpty()
    @ApiProperty()
    transactionType: TransactionType
    @IsNotEmpty()
    @ApiProperty()
    bill:number
    @IsNotEmpty()
    @ApiProperty()
    note: string
    @IsNotEmpty()
    @ApiProperty()
    currency_id:number
    @IsNotEmpty()
    @ApiProperty()
    categoriesGroup_id:number
    @IsNotEmpty()
    @ApiProperty()
    category_id:number
    @IsNotEmpty()
    @ApiProperty()
    wallet_id:number
    @IsOptional()
    @ApiProperty()
    paymentImage: string
    @IsOptional()
    @ApiProperty()
    @IsDateString()
    recordDate:Date
}
