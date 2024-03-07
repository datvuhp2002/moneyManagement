import { Test, TestingModule } from '@nestjs/testing';
import { MonthlyBudgetService } from './monthly-budget.service';

describe('MonthlyBudgetService', () => {
  let service: MonthlyBudgetService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MonthlyBudgetService],
    }).compile();

    service = module.get<MonthlyBudgetService>(MonthlyBudgetService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
