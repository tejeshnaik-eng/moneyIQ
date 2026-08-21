import { MetricItem } from '../types';

export const mockHealthScore = {
  overall: 78,
  max: 100,
  band: 'Strong Foundation — Optimize Concentration',
  pillars: [
    { name: 'Emergency Liquidity', score: 90, status: '5.2 Months Funded', weight: '25%' },
    { name: 'Equity Diversification', score: 65, status: '41% Top-5 Large Cap Overlap', weight: '25%' },
    { name: 'Goal Coverage Ratio', score: 82, status: '3 of 3 Goals Active', weight: '30%' },
    { name: 'Debt-to-Income', score: 85, status: '12% Low Leverage', weight: '20%' },
  ],
};

export const mockOverviewMetrics: MetricItem[] = [
  {
    label: 'Consolidated Net Worth',
    value: '₹18,42,850',
    change: '+14.2% YoY',
    isPositive: true,
    annotation: 'Across 4 connected accounts',
  },
  {
    label: 'Monthly Goal SIP Commitment',
    value: '₹38,000 / mo',
    change: '34.5% of salary',
    isPositive: true,
    annotation: 'Target: ₹42,000 / mo for on-time targets',
  },
  {
    label: 'Identified Discretionary Leakage',
    value: '₹4,850 / mo',
    change: 'Convertible to SIP',
    isPositive: false,
    annotation: 'Food delivery & dormant OTT subscriptions',
  },
  {
    label: 'Portfolio Volatility Beta',
    value: '1.08',
    change: 'Moderate High',
    isPositive: true,
    annotation: 'Benchmarked against Nifty 50 TRI',
  },
];

export const mockModuleTeasers = [
  {
    id: 'risk',
    title: 'Risk Profile Assessment',
    badge: 'Completed',
    headline: 'Growth Seeker (Score: 74/100)',
    description: 'Calculated capacity allows 65% equity allocation with a 7+ year horizon.',
    actionText: 'Review Questions & Mix',
  },
  {
    id: 'portfolio',
    title: 'Portfolio Consolidation',
    badge: '1 Overlap Alert',
    headline: '₹18.42L across Zerodha, Groww & EPFO',
    description: 'Warning: Parag Parikh Flexi Cap & UTI Nifty 50 hold overlapping HDFC & Reliance weights.',
    actionText: 'View Overlap Breakdown',
  },
  {
    id: 'goals',
    title: 'Goal-Based Financial Engine',
    badge: '3 Goals Active',
    headline: 'House Down Payment + FI Reserve',
    description: 'On track for 2028 home milestone assuming 11.5% equity CAGR and 6.5% inflation.',
    actionText: 'Track Goal Milestones',
  },
  {
    id: 'spend',
    title: 'Spend Analysis & Leak Detector',
    badge: '₹4,850/mo Recoverable',
    headline: 'Redirect Discretionary Outflows',
    description: 'System identified 4 unused auto-debit services and high weekend delivery spend.',
    actionText: 'Analyze Transactions',
  },
  {
    id: 'marketsim',
    title: 'Market Simulator (Crisis Replay)',
    badge: '₹1.0L Virtual Capital',
    headline: 'Test Covid 2020 & 2008 Drawdowns',
    description: 'See why continuing SIP during the 38% March 2020 crash generated 2.4x final wealth.',
    actionText: 'Launch Market Replay',
  },
  {
    id: 'decisionsim',
    title: 'Decision Simulator (What-If)',
    badge: 'Interactive Model',
    headline: 'Car on EMI vs Index Fund SIP',
    description: 'Compare net wealth impact over 5 years before committing to a ₹12 Lakh auto loan.',
    actionText: 'Run Decision Matrix',
  },
  {
    id: 'hypedetector',
    title: 'Hype-to-Data Detector',
    badge: 'SEBI Verified Data',
    headline: 'Fact-Check Social Media Claims',
    description: 'Paste any trading or investment claim to evaluate empirical win rates and risk math.',
    actionText: 'Test an Investment Claim',
  },
];
