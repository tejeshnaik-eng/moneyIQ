import { SpendCategory, SpendTransaction } from '../types';

export const mockSpendOverview = {
  totalMonthlyInflow: 110000,
  totalMonthlyOutflow: 56200,
  investmentsCommitted: 38000,
  surplusCash: 15800,
  identifiedLeakage: 4850,
  leakageAnnualImpact5Years: 395000, // at 12% CAGR
};

export const mockSpendCategories: SpendCategory[] = [
  { category: 'Rent & Society Maintenance', amount: 24000, percentage: 42.7, benchmarkPercentage: 30.0, isHigh: true, leakagePotential: 0 },
  { category: 'Food Delivery & Dining Out', amount: 11400, percentage: 20.2, benchmarkPercentage: 10.0, isHigh: true, leakagePotential: 3200 },
  { category: 'Groceries & Household', amount: 7200, percentage: 12.8, benchmarkPercentage: 15.0, isHigh: false, leakagePotential: 0 },
  { category: 'Digital Subscriptions & OTT', amount: 2850, percentage: 5.1, benchmarkPercentage: 2.0, isHigh: true, leakagePotential: 1650 },
  { category: 'Cab Commute & Fuel', amount: 4800, percentage: 8.5, benchmarkPercentage: 8.0, isHigh: false, leakagePotential: 0 },
  { category: 'Shopping & Leisure', amount: 5950, percentage: 10.7, benchmarkPercentage: 10.0, isHigh: false, leakagePotential: 0 },
];

export const mockTransactions: SpendTransaction[] = [
  { id: 'tx1', date: '2026-08-19', merchant: 'Swiggy Gourmet Bangalore', category: 'Food Delivery', amount: 1140, isRecurring: false, isDiscretionary: true },
  { id: 'tx2', date: '2026-08-17', merchant: 'Cult.fit Elite Monthly Auto', category: 'Health & Fitness', amount: 1750, isRecurring: true, isDiscretionary: false },
  { id: 'tx3', date: '2026-08-15', merchant: 'Netflix 4K Ultra Plan', category: 'Digital Subscriptions', amount: 649, isRecurring: true, isDiscretionary: true },
  { id: 'tx4', date: '2026-08-14', merchant: 'Amazon Prime Annual Share', category: 'Digital Subscriptions', amount: 1499, isRecurring: true, isDiscretionary: false },
  { id: 'tx5', date: '2026-08-12', merchant: 'Zomato Gold Delivery', category: 'Food Delivery', amount: 890, isRecurring: false, isDiscretionary: true },
  { id: 'tx6', date: '2026-08-10', merchant: 'Uber India Tech Park Commute', category: 'Cab Commute', amount: 420, isRecurring: false, isDiscretionary: false },
  { id: 'tx7', date: '2026-08-08', merchant: 'Apple iCloud+ & Arcade', category: 'Digital Subscriptions', amount: 489, isRecurring: true, isDiscretionary: true },
  { id: 'tx8', date: '2026-08-05', merchant: 'Blinkit Instant Groceries', category: 'Groceries', amount: 1240, isRecurring: false, isDiscretionary: false },
];
