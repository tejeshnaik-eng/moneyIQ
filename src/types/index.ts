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

export type WorkType = 
  | 'Student'
  | 'Salaried employee'
  | 'Self-employed'
  | 'Business owner'
  | 'Freelancer'
  | 'Homemaker'
  | 'Retired'
  | 'Currently unemployed'
  | 'Other';

export type IncomeStability = 
  | 'Very unstable'
  | 'Somewhat unstable'
  | 'Fairly stable'
  | 'Stable'
  | 'Very stable';

export type IncomeChange3Years = 
  | 'Increase significantly'
  | 'Increase slightly'
  | 'Stay approximately the same'
  | 'Decrease slightly'
  | 'Decrease significantly'
  | 'Not sure';

export type TimeHorizon = 
  | 'Within 1 year'
  | '1–3 years'
  | '3–5 years'
  | '5–10 years'
  | 'More than 10 years';

export type PrimaryGoal = 
  | 'Emergency fund'
  | 'Education'
  | 'Buying a vehicle'
  | 'Buying a house'
  | 'Retirement'
  | 'Wealth creation'
  | 'Starting a business'
  | 'Other';

export type InvestmentExperience = 
  | 'None'
  | 'Less than 1 year'
  | '1–3 years'
  | '3–5 years'
  | 'More than 5 years';

export type DecisionStyle = 
  | 'Bank/financial advisor'
  | 'Research and financial data'
  | 'Friends/family'
  | 'Social media/YouTube'
  | 'News and market trends'
  | 'My own experience'
  | 'Combination of these';

export type CrashReaction = 
  | 'Sell everything'
  | 'Sell some investments'
  | 'Hold and wait'
  | 'Continue my SIP/investments'
  | 'Invest more';

export type OutcomePreference = 
  | '₹1.2 lakh with very low risk'
  | '₹1.4 lakh with low risk'
  | '₹1.7 lakh with moderate risk'
  | '₹2 lakh with high risk'
  | '₹2.5 lakh with very high risk';

export type LossProtectionPriority = 
  | 'Extremely important'
  | 'Very important'
  | 'Moderately important'
  | 'Slightly important'
  | 'Not important';

export type VolatilityComfort = 
  | 'Very uncomfortable'
  | 'Uncomfortable'
  | 'Neutral'
  | 'Comfortable'
  | 'Very comfortable';

export interface InvestorProfileForm {
  // Demographics & Work
  age: number;
  workType: WorkType;
  incomeStability: IncomeStability;
  incomeChange3Years: IncomeChange3Years;

  // Financial Balance Sheet & Capacity
  monthlyIncome: number;
  totalSavingsInvestments: number;
  monthlyInvestmentCapacity: number;
  emergencySavings: number;
  currentInvestmentPct: number;
  emergencyWithdrawalNeed: number;
  hasDebt: boolean;
  outstandingDebt: number;
  monthlyEmi: number;

  // Goals & Horizon
  timeHorizon: TimeHorizon;
  primaryGoal: PrimaryGoal;

  // Experience & Holdings
  investmentExperience: InvestmentExperience;
  currentInvestments: string[];
  decisionStyle: DecisionStyle;

  // Behavioral & Psychological Tolerance
  crashReaction20: CrashReaction;
  outcomePreference: OutcomePreference;
  lossProtectionPriority: LossProtectionPriority;
  volatilityComfort: VolatilityComfort;
}

export interface ComprehensiveProfileResult {
  persona: string;
  riskCapacityScore: number; // 0-100
  riskToleranceScore: number; // 0-100
  overallScore: number; // 0-100
  investmentHorizonYears: number;
  monthlyCapacity: number;
  emergencyRunwayMonths: number;
  debtToIncomeRatio: number;
  savingsRatePct: number;
  suggestedApproach: string;
  mainConsideration: string;
  description: string;
  keyTrait: string;
  recommendedMix: {
    equity: number;
    debt: number;
    gold: number;
    liquid: number;
  };
  behavioralWarning: string;
  aiPromptContext: {
    summary: string;
    investorPersona: string;
    capacityConstraints: string;
    psychologicalProfile: string;
    suggestedNextEducationalTopics: string[];
  };
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
