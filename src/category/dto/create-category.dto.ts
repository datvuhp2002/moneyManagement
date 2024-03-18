import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @ApiProperty()
  categoriesGroup_id: number;
  @IsNotEmpty()
  @ApiProperty()
  name: string;
  @IsOptional()
  symbol: string;
}
