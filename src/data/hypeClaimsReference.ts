import { HypeClaim } from '../types';

export const mockHypeClaims: HypeClaim[] = [
  {
    id: 'fno-quick-wealth',
    title: 'Option Buying & Zero-Hero Intraday',
    sourceType: 'Finfluencer Course',
    quote: 'Trade Nifty & Bank Nifty expiry day options with ₹10,000 capital and double it weekly using 1-minute chart setup.',
    verdict: 'High Risk / Statistically Unfavorable',
    sebiGroundTruth: 'Official SEBI Study (2023 & 2024): 93% of retail individual traders in Equity Futures & Options (F&O) incurred net losses, with an average net loss of ~₹2,00,000 per trader, plus an additional 28% in transaction and brokerage costs.',
    mathematicalReality: 'Options buying suffers from severe negative theta (time decay) and high bid-ask spread friction. Consistent 20% weekly compounding is mathematically impossible (₹10k would compound to over ₹130 Crores in 1 year).',
    recommendedAction: 'Eliminate speculative F&O trading. Channel capital into broad market index SIPs (Nifty 50 / Next 50) where positive macroeconomic GDP growth drives positive expected value.',
  },
  {
    id: 'real-estate-supreme',
    title: 'Real Estate Always Yields 20%+ IRR',
    sourceType: 'Social Media / Reel',
    quote: 'Indian residential real estate is the only safe asset class. Buy an apartment on EMI because land values never decline.',
    verdict: 'Misleading Assumption',
    sebiGroundTruth: 'RBI House Price Index (HPI) 10-year data shows residential real estate in top Indian metros yielded a median annualized CAGR of 6.2% - 8.1% between 2013-2023, while Nifty 50 TRI delivered 13.4% CAGR.',
    mathematicalReality: 'Residential property yields only 2-3% gross rental return, while maintenance, property tax, stamp duty (6-8%), illiquidity discount, and 8.5% home loan interest significantly diminish actual net IRR.',
    recommendedAction: 'Treat primary residential property as a lifestyle purchase for family stability rather than an ultra-high CAGR investment instrument.',
  },
  {
    id: 'crypto-100x-gem',
    title: 'New Meme / Alt-Token Guaranteed 100x...',
    sourceType: 'Crypto Channel',
    quote: 'Buy this low-cap token before tier-1 exchange listing. Guaranteed 50x to 100x return in 60 days.',
    verdict: 'Factually Flawed',
    sebiGroundTruth: 'Unregulated instruments carry no investor protection redressal. In India, virtual digital assets are subject to a flat 30% tax without loss set-off and 1% TDS on every transfer (Section 115BBH).',
    mathematicalReality: 'Over 99.4% of low-cap meme tokens suffer rug-pulls, liquidity exhaustion, or infinite token inflation within 12 months.',
    recommendedAction: 'Never allocate goal-critical capital (emergency funds, home down payment) to unregulated speculative tokens. Keep speculative allocations under 3% of net worth.',
  },
];

