import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateMonthlyBudgetDto } from './create-monthly-budget.dto';

export class UpdateMonthlyBudgetDto extends PartialType(CreateMonthlyBudgetDto) {
    @ApiProperty()
    note: string;
    @ApiProperty()
    amount: number;
    @ApiProperty()
    category_id?: number;
    @ApiProperty()
    user_id?: number;
}
