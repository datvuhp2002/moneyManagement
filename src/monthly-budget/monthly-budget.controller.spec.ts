import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyBudgetController } from './monthly-budget.controller';
import { MonthlyBudgetService } from './monthly-budget.service';

describe('MonthlyBudgetController', () => {
  let controller: MonthlyBudgetController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MonthlyBudgetController],
      providers: [MonthlyBudgetService],
    }).compile();

    controller = module.get<MonthlyBudgetController>(MonthlyBudgetController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
