import { PartialType } from '@nestjs/swagger';
import { CreateMonthlyBudgetDto } from './create-monthly-budget.dto';

export class UpdateMonthlyBudgetDto extends PartialType(CreateMonthlyBudgetDto) {
    note: string;
    amount: number;
    category_id?: number;
    user_id?: number;
}
