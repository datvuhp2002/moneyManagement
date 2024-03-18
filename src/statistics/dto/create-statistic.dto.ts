import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateStatisticDto {
  @ApiProperty()
  @IsOptional()
  expense: number;
  @ApiProperty()
  @IsOptional()
  revenue: number;
  @ApiProperty()
  @IsNotEmpty()
  recordDate: Date;
  @IsNotEmpty()
  wallet_id: number;
}
