import { HistoricalCrisisCase } from '../types';

export const mockVirtualPortfolio = {
  virtualStartingBalance: 100000,
  currentCashBalance: 24500,
  investedBalance: 81200,
  totalCurrentValue: 105700,
  unrealizedReturnPct: 5.7,
  holdings: [
    { symbol: 'NIFTY50_VIRTUAL', name: 'Nifty 50 Index Basket', units: 14, avgBuyPrice: 2420, currentPrice: 2580, pnl: 2240 },
    { symbol: 'NIFTYMID_VIRTUAL', name: 'Nifty Midcap 150 Basket', units: 28, avgBuyPrice: 1120, currentPrice: 1210, pnl: 2520 },
    { symbol: 'GOLD_VIRTUAL', name: 'Virtual Sovereign Gold ETF', units: 12, avgBuyPrice: 6200, currentPrice: 6420, pnl: 2640 },
  ],
};

export const mockCrisisCases: HistoricalCrisisCase[] = [
  {
    id: 'covid-2020',
    title: 'March 2020: The Global Pandemic Crash',
    period: 'Feb 2020 – Nov 2020',
    drawdownPercentage: 38.4,
    recoveryMonths: 7,
    niftyDrawdown: 'Nifty dropped from 12,362 to 7,610 in 4 weeks',
    description: 'A black-swan health pandemic triggered unprecedented global circuit breakers. Mass retail panic led to heavy redemption of equity mutual funds.',
    lesson: 'Investors who continued their monthly SIPs bought units at extreme multi-year valuation discounts (P/E under 19) and experienced one of the sharpest bull runs in Indian financial history.',
    panicSoldResult: 'Liquidated ₹1,00,000 at bottom (-38%) -> Retained ₹61,600 and missed the subsequent +120% 18-month rally.',
    continuedSipResult: 'Disciplined SIP accumulator lowered average cost -> Portfolio achieved +84% cumulative return by Dec 2021.',
  },
  {
    id: 'gfc-2008',
    title: '2008: Global Financial Crisis (Subprime Collapse)',
    period: 'Jan 2008 – Nov 2010',
    drawdownPercentage: 55.2,
    recoveryMonths: 34,
    niftyDrawdown: 'Nifty dropped from 6,287 to 2,524 over 12 months',
    description: 'Systemic banking failures across the US and Europe caused severe liquidity freeze and foreign institutional sell-offs in Indian markets.',
    lesson: 'Recovery required patience (nearly 3 years). However, index SIPs during the entire 2008-2009 trough generated an annualized IRR exceeding 19% over the subsequent 7-year cycle.',
    panicSoldResult: 'Locking in -55% permanent capital loss created permanent risk aversion and missed Indian decadal GDP expansion.',
    continuedSipResult: 'Continuous rupee-cost averaging accumulated peak units -> 3x portfolio growth within 5 years post-bottom.',
  },
  {
    id: 'demonetization-2016',
    title: 'Nov 2016: Indian Currency Demonetization Pullback',
    period: 'Nov 2016 – Mar 2017',
    drawdownPercentage: 11.8,
    recoveryMonths: 4,
    niftyDrawdown: 'Nifty pulled back from 8,850 to 7,920 over 6 weeks',
    description: 'Sudden withdrawal of 86% of currency in circulation caused temporary consumption contraction and short-term earnings uncertainty.',
    lesson: 'Structural long-term formalization of the Indian economy accelerated digital transactions and retail equity participation.',
    panicSoldResult: 'Reacting to sensationalized news headlines incurred unnecessary exit loads and capital gains taxation.',
    continuedSipResult: 'Smooth 4-month recovery to new all-time highs with uninterrupted compounding.',
  },
];
