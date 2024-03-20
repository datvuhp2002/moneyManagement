import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateTransactionDto } from './create-transaction.dto';
import { IsDateString, IsNotEmpty, IsOptional } from 'class-validator';
import { TransactionType } from './Transaction.enum';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
  @IsNotEmpty()
  @ApiProperty()
  transactionType: TransactionType;

  @IsNotEmpty()
  @ApiProperty()
  bill: number;

  @IsNotEmpty()
  @ApiProperty()
  note: string;

  @IsNotEmpty()
  @ApiProperty()
  currency_id: number;

  @IsOptional()
  @ApiProperty()
  categoriesGroup_id: number;

  @IsOptional()
  @ApiProperty()
  category_id: number;

  @IsOptional()
  @ApiProperty()
  wallet_id: number;

  @IsOptional()
  @ApiProperty()
  paymentImage: string;

  @IsOptional()
  @ApiProperty()
  @IsDateString()
  recordDate: Date;
}
