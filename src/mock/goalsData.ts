import { FinancialGoal } from '../types';

export const mockGoals: FinancialGoal[] = [
  {
    id: 'g1',
    title: '6-Month Emergency Liquidity Reserve',
    category: 'Security',
    targetAmount: 450000,
    currentSaved: 380000,
    targetYear: 2026,
    expectedInflation: 5.5,
    expectedCagr: 7.0,
    requiredMonthlySip: 7000,
    currentMonthlySip: 7000,
    status: 'On Track',
  },
  {
    id: 'g2',
    title: 'Bengaluru 2BHK Down Payment (25% Margin)',
    category: 'Milestone',
    targetAmount: 2500000,
    currentSaved: 950000,
    targetYear: 2029,
    expectedInflation: 6.5,
    expectedCagr: 12.0,
    requiredMonthlySip: 26500,
    currentMonthlySip: 22000,
    status: 'Attention Needed',
  },
  {
    id: 'g3',
    title: 'Early Financial Independence (FI Corpus)',
    category: 'Retirement',
    targetAmount: 18000000,
    currentSaved: 512850,
    targetYear: 2042,
    expectedInflation: 6.0,
    expectedCagr: 12.5,
    requiredMonthlySip: 18500,
    currentMonthlySip: 9000,
    status: 'Critical Gap',
  },
];

export const mockGoalAssumptions = {
  inflationRate: 6.5,
  equityReturnRate: 12.0,
  debtReturnRate: 7.5,
  note: 'Assumptions are illustrative projections based on long-term Indian macroeconomic historical medians. Past performance is not a guarantee of future returns.',
};
