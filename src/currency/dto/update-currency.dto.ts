import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateCurrencyDto } from './create-currency.dto';

export class UpdateCurrencyDto extends PartialType(CreateCurrencyDto) {
  @ApiProperty()
  name: string;
  @ApiProperty()
  exchange_rate: number;
}
