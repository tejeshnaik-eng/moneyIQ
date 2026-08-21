import { RiskQuestion, RiskProfileResult } from '../types';

export const mockRiskQuestions: RiskQuestion[] = [
  {
    id: 1,
    question: 'How would you react if the Indian stock market dropped 25% over a 3-month period?',
    context: 'Assesses psychological drawdown tolerance based on actual historical drawdowns (e.g., March 2020).',
    options: [
      { label: 'Panic & Liquidate', description: 'Sell all mutual funds/stocks to protect remaining principal.', score: 10 },
      { label: 'Pause SIP & Wait', description: 'Hold current investments but stop fresh monthly inflows until stability.', score: 40 },
      { label: 'Hold Steady', description: 'Continue scheduled SIPs without making emotional modifications.', score: 75 },
      { label: 'Deploy Surplus Cash', description: 'Increase monthly SIP and invest tactical lumpsum at discounted valuations.', score: 100 },
    ],
  },
  {
    id: 2,
    question: 'What is your primary investment time horizon for major financial goals?',
    context: 'Equity investments require longer compounding horizons to smooth short-term volatility.',
    options: [
      { label: 'Under 2 Years', description: 'Immediate milestones (wedding, gadget, emergency contingency).', score: 15 },
      { label: '3 to 5 Years', description: 'Medium-term targets (higher education, car down payment).', score: 50 },
      { label: '5 to 10 Years', description: 'Longer milestones (home purchase, wealth creation).', score: 80 },
      { label: '10+ Years', description: 'Long-term independence & multi-decade compounding.', score: 100 },
    ],
  },
  {
    id: 3,
    question: 'How stable is your current monthly income and profession?',
    context: 'Cash-flow certainty determines risk capacity separate from psychological tolerance.',
    options: [
      { label: 'Variable / Freelance', description: 'Irregular cash inflows with periodic lean months.', score: 30 },
      { label: 'Early-stage Startup', description: 'Fixed base with significant equity/ESOP uncertainty.', score: 60 },
      { label: 'Established Tech / Corporate', description: 'Stable monthly salary with predictable annual appraisals.', score: 85 },
      { label: 'Tenured Professional / PSU', description: 'Highly secure employment with steady pension/benefits.', score: 95 },
    ],
  },
  {
    id: 4,
    question: 'How many months of mandatory living expenses do you hold in risk-free liquid funds/FDs?',
    context: 'An emergency cushion prevents premature liquidation of equity portfolios during downturns.',
    options: [
      { label: 'Less than 1 Month', description: 'Relying on salary credit each month or credit cards for emergencies.', score: 10 },
      { label: '1 to 3 Months', description: 'Partial reserve in savings account.', score: 45 },
      { label: '3 to 6 Months', description: 'Adequate emergency fund held in Sweep-in FD or Liquid Mutual Fund.', score: 85 },
      { label: '6+ Months', description: 'Comprehensive liquidity buffer covering household and insurance deductibles.', score: 100 },
    ],
  },
  {
    id: 5,
    question: 'What is your perspective on high-risk instruments (Crypto, Derivatives / F&O, Penny Stocks)?',
    context: 'Distinguishes speculative thrill from evidence-based wealth accumulation.',
    options: [
      { label: 'Strict Avoidance', description: 'Zero allocation to speculative derivatives; prioritize index and debt.', score: 40 },
      { label: 'Exploratory (< 5%)', description: 'Willing to allocate tiny discretionary budget as learning capital.', score: 75 },
      { label: 'Active Trading Interest', description: 'Seeking accelerated returns despite SEBI loss probability statistics.', score: 90 },
      { label: 'Heavy Allocation (> 20%)', description: 'Chasing high leverage or speculative multi-bagger outcomes.', score: 100 },
    ],
  },
];

export const mockRiskResult: RiskProfileResult = {
  persona: 'Growth Seeker (Moderate-Aggressive)',
  score: 74,
  description: 'You possess a high financial risk capacity backed by a 5.2-month emergency reserve and stable software engineering income. While comfortable with market volatility, your profile thrives on disciplined equity compounding rather than speculative leverage.',
  keyTrait: 'Long Horizon (7+ Yrs) with Strong Cash-flow Certainty',
  recommendedMix: {
    equity: 65,
    debt: 20,
    gold: 10,
    liquid: 5,
  },
  behavioralWarning: 'Caution: Even with strong risk capacity, avoid FOMO-driven F&O derivatives. The 65% equity allocation in broad market indexes (Nifty 50 + Flexi Cap) offers mathematically superior risk-adjusted wealth over your 7-year horizon.',
};
