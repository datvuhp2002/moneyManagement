import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional } from "class-validator";
  
export class CreateTransactionDto {
    @IsNotEmpty()
    @ApiProperty()
    transactionType: string
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
}
