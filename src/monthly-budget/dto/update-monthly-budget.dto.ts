import { PartialType } from '@nestjs/swagger';
import { CreateMonthlyBudgetDto } from './create-monthly-budget.dto';

export class UpdateMonthlyBudgetDto extends PartialType(CreateMonthlyBudgetDto) {
    username: string;
}
