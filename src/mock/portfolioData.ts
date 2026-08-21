import { PortfolioHolding, OverlapWarning } from '../types';

export const mockHoldings: PortfolioHolding[] = [
  {
    id: 'h1',
    name: 'UTI Nifty 50 Index Fund Direct-Growth',
    ticker: 'INDEX_NIFTY50',
    category: 'Large Cap',
    platform: 'Groww',
    investedValue: 350000,
    currentValue: 432000,
    returnsPercentage: 23.4,
    xirr: 14.8,
  },
  {
    id: 'h2',
    name: 'Parag Parikh Flexi Cap Fund Direct-Growth',
    ticker: 'FLEXI_PPFAS',
    category: 'Flexi Cap',
    platform: 'Zerodha',
    investedValue: 420000,
    currentValue: 548000,
    returnsPercentage: 30.5,
    xirr: 18.2,
  },
  {
    id: 'h3',
    name: 'Motilal Oswal Midcap Fund Direct-Growth',
    ticker: 'MIDCAP_MO',
    category: 'Mid Cap',
    platform: 'Zerodha',
    investedValue: 180000,
    currentValue: 228000,
    returnsPercentage: 26.6,
    xirr: 16.5,
  },
  {
    id: 'h4',
    name: 'Employees Provident Fund (EPFO)',
    ticker: 'EPF_GOVT',
    category: 'Debt/EPF',
    platform: 'EPFO',
    investedValue: 310000,
    currentValue: 342850,
    returnsPercentage: 10.6,
    xirr: 8.25,
  },
  {
    id: 'h5',
    name: 'Sovereign Gold Bond (SGB 2028 Series)',
    ticker: 'SGB_RBI',
    category: 'Gold/SGB',
    platform: 'Groww',
    investedValue: 110000,
    currentValue: 142000,
    returnsPercentage: 29.1,
    xirr: 12.1,
  },
  {
    id: 'h6',
    name: 'HDFC High Yield Liquid Fund',
    ticker: 'LIQUID_CASH',
    category: 'Liquid Cash',
    platform: 'Direct Bank',
    investedValue: 150000,
    currentValue: 150000,
    returnsPercentage: 6.8,
    xirr: 6.9,
  },
];

export const mockOverlapWarnings: OverlapWarning[] = [
  {
    pair: ['Parag Parikh Flexi Cap', 'UTI Nifty 50 Index Fund'],
    overlapPercentage: 41.2,
    commonHoldings: ['HDFC Bank (8.8%)', 'ICICI Bank (7.4%)', 'ITC Ltd (5.2%)', 'Infosys (4.9%)', 'Bajaj Holdings (3.8%)'],
    recommendation: 'Holding both funds results in duplicate large-cap banking exposure. Consider pairing Flexi-Cap with a dedicated Mid-Cap or international index rather than duplicating Top-10 Nifty weights.',
  },
];

export const mockPlatformBreakdown = [
  { platform: 'Zerodha (Coin/Kite)', value: 776000, percentage: 42.1 },
  { platform: 'Groww', value: 574000, percentage: 31.1 },
  { platform: 'EPFO (Retirement)', value: 342850, percentage: 18.6 },
  { platform: 'Direct Bank / Liquid', value: 150000, percentage: 8.2 },
];
