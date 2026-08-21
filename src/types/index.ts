export type ModuleId = 
  | 'overview'
  | 'risk'
  | 'portfolio'
  | 'goals'
  | 'spend'
  | 'marketsim'
  | 'decisionsim'
  | 'hypedetector';

export interface UserProfile {
  name: string;
  age: number;
  email: string;
  occupation: string;
  city: string;
  monthlyIncome: number;
  riskCategory: string;
  healthScore: number;
  isGuest: boolean;
}

export interface MetricItem {
  label: string;
  value: string;
  change?: string;
  isPositive?: boolean;
  annotation: string;
}

export interface RiskQuestion {
  id: number;
  question: string;
  context: string;
  options: {
    label: string;
    description: string;
    score: number;
  }[];
}

export interface RiskProfileResult {
  persona: string;
  score: number; // 0-100
  description: string;
  keyTrait: string;
  recommendedMix: {
    equity: number;
    debt: number;
    gold: number;
    liquid: number;
  };
  behavioralWarning: string;
}

export interface PortfolioHolding {
  id: string;
  name: string;
  ticker?: string;
  category: 'Large Cap' | 'Flexi Cap' | 'Mid Cap' | 'Debt/EPF' | 'Gold/SGB' | 'Liquid Cash';
  platform: 'Zerodha' | 'Groww' | 'INDmoney' | 'EPFO' | 'Direct Bank';
  investedValue: number;
  currentValue: number;
  returnsPercentage: number;
  xirr: number;
}

export interface OverlapWarning {
  pair: [string, string];
  overlapPercentage: number;
  commonHoldings: string[];
  recommendation: string;
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'Security' | 'Milestone' | 'Retirement' | 'Discretionary';
  targetAmount: number;
  currentSaved: number;
  targetYear: number;
  expectedInflation: number;
  expectedCagr: number;
  requiredMonthlySip: number;
  currentMonthlySip: number;
  status: 'On Track' | 'Attention Needed' | 'Critical Gap';
}

export interface SpendCategory {
  category: string;
  amount: number;
  percentage: number;
  benchmarkPercentage: number;
  isHigh: boolean;
  leakagePotential: number;
}

export interface SpendTransaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  isRecurring: boolean;
  isDiscretionary: boolean;
}

export interface HistoricalCrisisCase {
  id: string;
  title: string;
  period: string;
  drawdownPercentage: number;
  recoveryMonths: number;
  niftyDrawdown: string;
  description: string;
  lesson: string;
  panicSoldResult: string;
  continuedSipResult: string;
}

export interface DecisionScenario {
  id: string;
  title: string;
  tagline: string;
  category: 'Asset Purchase' | 'Debt vs Invest' | 'Tax Regime';
  parameters: {
    label: string;
    defaultValue: number;
    min: number;
    max: number;
    step: number;
    unit: string;
  }[];
  optionA: {
    title: string;
    netWealth5Years: number;
    summary: string;
  };
  optionB: {
    title: string;
    netWealth5Years: number;
    summary: string;
  };
  analyticalTakeaway: string;
}

export interface HypeClaim {
  id: string;
  title: string;
  sourceType: 'Social Media / Reel' | 'WhatsApp Group' | 'Finfluencer Course' | 'Crypto Channel';
  quote: string;
  verdict: 'High Risk / Statistically Unfavorable' | 'Misleading Assumption' | 'Factually Flawed' | 'Context-Dependent';
  sebiGroundTruth: string;
  mathematicalReality: string;
  recommendedAction: string;
}

export interface AuditCardSection {
  title: string;
  description: string;
}

export interface AuditResult {
  risk_assessment_badge: string;
  source_type?: string;
  regulatory_ground_truth: AuditCardSection;
  mathematical_reality: AuditCardSection;
  evidence_based_strategy: AuditCardSection;
}
