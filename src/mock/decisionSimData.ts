import { DecisionScenario } from '../types';

export const mockDecisionScenarios: DecisionScenario[] = [
  {
    id: 'car-emi-vs-sip',
    title: 'Buying a ₹12 Lakh Car on EMI vs Renting/Cab + Index SIP',
    tagline: 'Young professionals often underestimate the opportunity cost of vehicle depreciation and loan interest.',
    category: 'Asset Purchase',
    parameters: [
      { label: 'Car On-Road Price', defaultValue: 1200000, min: 600000, max: 3000000, step: 50000, unit: '₹' },
      { label: 'Down Payment (20%)', defaultValue: 240000, min: 100000, max: 1000000, step: 20000, unit: '₹' },
      { label: 'Monthly EMI (5 Yr @ 9.5%)', defaultValue: 20170, min: 10000, max: 60000, step: 1000, unit: '₹/mo' },
      { label: 'Monthly Fuel & Maintenance', defaultValue: 6500, min: 2000, max: 20000, step: 500, unit: '₹/mo' },
      { label: 'Alternative Cab/Metro Monthly Cost', defaultValue: 8000, min: 2000, max: 25000, step: 500, unit: '₹/mo' },
      { label: 'Expected Equity CAGR', defaultValue: 12.0, min: 8.0, max: 15.0, step: 0.5, unit: '%' },
    ],
    optionA: {
      title: 'Option A: Buy the Car on 5-Year Loan',
      netWealth5Years: 540000, // Residual depreciated car value (~45%)
      summary: 'Total Cash Outflow: ₹18.4 Lakhs (EMI + Fuel + Insurance + Down Payment). End Asset: 5-Year Old Depreciated Vehicle worth approx ₹5.4 Lakhs.',
    },
    optionB: {
      title: 'Option B: Cab/Metro + Invest Differential (₹18,670/mo + ₹2.4L initial)',
      netWealth5Years: 1980000, // Compounded SIP + lump sum
      summary: 'Total Cash Outflow: Same ₹18.4 Lakhs. End Asset: Liquid Equity Portfolio worth approx ₹19.8 Lakhs (Difference: +₹14.4 Lakhs net gain).',
    },
    analyticalTakeaway: 'The car purchase costs ₹14.4 Lakhs in lost compounding wealth over 5 years. If a vehicle is mandatory for family safety, consider a reliable certified pre-owned car at ₹5-6 Lakhs to balance utility and wealth accumulation.',
  },
  {
    id: 'prepay-home-loan-vs-sip',
    title: 'Prepaying 8.75% Home Loan vs Direct Equity SIP',
    tagline: 'Deciding between psychological debt freedom vs mathematical compounding spread.',
    category: 'Debt vs Invest',
    parameters: [
      { label: 'Home Loan Interest Rate', defaultValue: 8.75, min: 7.0, max: 11.0, step: 0.25, unit: '%' },
      { label: 'Expected Equity Return (Post-tax LTCG)', defaultValue: 11.25, min: 9.0, max: 14.0, step: 0.25, unit: '%' },
      { label: 'Monthly Surplus Available', defaultValue: 25000, min: 5000, max: 100000, step: 5000, unit: '₹/mo' },
    ],
    optionA: {
      title: 'Option A: Aggressively Prepay Home Loan Principal',
      netWealth5Years: 1890000,
      summary: 'Guaranteed risk-free return of 8.75% saved in interest outgo. Zero emotional stress of ongoing mortgage.',
    },
    optionB: {
      title: 'Option B: Invest Monthly Surplus into Flexi-Cap SIP',
      netWealth5Years: 2140000,
      summary: 'Net mathematical advantage of ~2.5% annualized alpha post LTCG tax. High liquidity retained in mutual funds.',
    },
    analyticalTakeaway: 'A hybrid strategy works best: Prepay 30% of surplus towards principal to reduce tenure under 10 years, and invest 70% into equity to build long-term liquid corpus.',
  },
];
