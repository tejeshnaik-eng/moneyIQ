import { 
  InvestorProfileForm, 
  ComprehensiveProfileResult 
} from '../types';

export const DEFAULT_INVESTOR_FORM: InvestorProfileForm = {
  age: 0,
  workType: 'Salaried employee',
  incomeStability: 'Fairly stable',
  incomeChange3Years: 'Stay approximately the same',
  monthlyIncome: 0,
  totalSavingsInvestments: 0,
  monthlyInvestmentCapacity: 0,
  emergencySavings: 0,
  currentInvestmentPct: 0,
  emergencyWithdrawalNeed: 0,
  hasDebt: false,
  outstandingDebt: 0,
  monthlyEmi: 0,
  timeHorizon: '3–5 years',
  primaryGoal: 'Wealth creation',
  investmentExperience: 'None',
  currentInvestments: [],
  decisionStyle: 'Combination of these',
  crashReaction20: 'Hold and wait',
  outcomePreference: '₹1.7 lakh with moderate risk',
  lossProtectionPriority: 'Moderately important',
  volatilityComfort: 'Neutral',
};

import { getStorageKey } from '../utils';

const getProfileStorageKey = () => getStorageKey('finsight_investor_profile');

export class RiskProfileEngine {
  /**
   * Loads saved profile form from localStorage or returns sensible defaults.
   */
  static getStoredProfile(): InvestorProfileForm {
    try {
      const stored = localStorage.getItem(getProfileStorageKey());
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed to parse stored profile:', e);
    }
    return DEFAULT_INVESTOR_FORM;
  }

  /**
   * Saves profile form to localStorage.
   */
  static saveProfile(form: InvestorProfileForm): void {
    try {
      localStorage.setItem(getProfileStorageKey(), JSON.stringify(form));
    } catch (e) {
      console.error('Failed to save profile to localStorage:', e);
    }
  }

  /**
   * Returns true only if the user has actually completed the risk questionnaire
   * (i.e. age > 0 and monthlyIncome > 0 are minimum signals that real data was entered).
   */
  static hasCompletedProfile(): boolean {
    try {
      const stored = localStorage.getItem(getProfileStorageKey());
      if (!stored) return false;
      const parsed = JSON.parse(stored) as InvestorProfileForm;
      return parsed.age > 0 && parsed.monthlyIncome > 0;
    } catch {
      return false;
    }
  }

  /**
   * Computes comprehensive quantitative and behavioral risk results.
   */
  static evaluateProfile(form: InvestorProfileForm): ComprehensiveProfileResult {
    // 1. Calculate Risk Capacity (0-100)
    let capacityScore = 0;

    // Age factor (Max 20 pts)
    if (form.age < 30) capacityScore += 20;
    else if (form.age < 40) capacityScore += 16;
    else if (form.age < 50) capacityScore += 12;
    else if (form.age < 60) capacityScore += 8;
    else capacityScore += 4;

    // Income Stability (Max 20 pts)
    const stabilityScores = {
      'Very stable': 20,
      'Stable': 17,
      'Fairly stable': 13,
      'Somewhat unstable': 7,
      'Very unstable': 2,
    };
    capacityScore += stabilityScores[form.incomeStability] || 12;

    // Emergency Runway Months (Max 25 pts)
    // Assume monthly non-invested expenses = monthlyIncome - monthlyInvestmentCapacity - (monthlyEmi || 0)
    const monthlyLivingCost = Math.max(10000, form.monthlyIncome - form.monthlyInvestmentCapacity - (form.hasDebt ? form.monthlyEmi : 0));
    const emergencyRunwayMonths = parseFloat((form.emergencySavings / monthlyLivingCost).toFixed(1));

    if (emergencyRunwayMonths >= 6) capacityScore += 25;
    else if (emergencyRunwayMonths >= 4) capacityScore += 20;
    else if (emergencyRunwayMonths >= 2) capacityScore += 12;
    else if (emergencyRunwayMonths >= 1) capacityScore += 6;
    else capacityScore += 2;

    // Debt-to-Income / Leverage (Max 15 pts)
    const dtiRatio = form.hasDebt && form.monthlyIncome > 0
      ? parseFloat(((form.monthlyEmi / form.monthlyIncome) * 100).toFixed(1))
      : 0;

    if (!form.hasDebt || dtiRatio <= 10) capacityScore += 15;
    else if (dtiRatio <= 25) capacityScore += 11;
    else if (dtiRatio <= 40) capacityScore += 6;
    else capacityScore += 2;

    // Horizon factor (Max 20 pts)
    const horizonYearsMap = {
      'More than 10 years': 12,
      '5–10 years': 8,
      '3–5 years': 4,
      '1–3 years': 2,
      'Within 1 year': 1,
    };
    const investmentHorizonYears = horizonYearsMap[form.timeHorizon] || 5;

    if (investmentHorizonYears >= 10) capacityScore += 20;
    else if (investmentHorizonYears >= 7) capacityScore += 16;
    else if (investmentHorizonYears >= 4) capacityScore += 10;
    else if (investmentHorizonYears >= 2) capacityScore += 5;
    else capacityScore += 2;

    capacityScore = Math.min(100, Math.max(10, capacityScore));

    // 2. Calculate Risk Tolerance (0-100)
    let toleranceScore = 0;

    // 20% Crash Reaction (25%)
    const crashScores = {
      'Invest more': 25,
      'Continue my SIP/investments': 20,
      'Hold and wait': 14,
      'Sell some investments': 7,
      'Sell everything': 2,
    };
    toleranceScore += crashScores[form.crashReaction20] || 15;

    // Outcome preference (25%)
    const outcomeScores = {
      '₹2.5 lakh with very high risk': 25,
      '₹2 lakh with high risk': 20,
      '₹1.7 lakh with moderate risk': 15,
      '₹1.4 lakh with low risk': 10,
      '₹1.2 lakh with very low risk': 5,
    };
    toleranceScore += outcomeScores[form.outcomePreference] || 15;

    // Loss protection priority (25%)
    const protectionScores = {
      'Not important': 25,
      'Slightly important': 20,
      'Moderately important': 14,
      'Very important': 8,
      'Extremely important': 3,
    };
    toleranceScore += protectionScores[form.lossProtectionPriority] || 14;

    // Volatility comfort (25%)
    const volatilityScores = {
      'Very comfortable': 25,
      'Comfortable': 20,
      'Neutral': 14,
      'Uncomfortable': 7,
      'Very uncomfortable': 2,
    };
    toleranceScore += volatilityScores[form.volatilityComfort] || 14;

    toleranceScore = Math.min(100, Math.max(10, toleranceScore));

    // 3. Overall Weighted Score (0-100)
    const overallScore = Math.round(0.55 * capacityScore + 0.45 * toleranceScore);

    // 4. Determine Persona & Target Asset Allocation
    let persona = 'Moderate — Growth Seeker';
    let suggestedApproach = 'Balanced growth with index foundation';
    let mainConsideration = 'Can tolerate temporary market declines but should avoid excessive concentration.';
    let description = '';
    let keyTrait = '';
    let recommendedMix = { equity: 65, debt: 20, gold: 10, liquid: 5 };
    let behavioralWarning = '';

    if (overallScore >= 80) {
      persona = 'Aggressive — Tactical Wealth Builder';
      suggestedApproach = 'High equity compounding & strategic midcap tilt';
      mainConsideration = 'Strong capacity & high risk tolerance allows 75-80% equity allocation.';
      description = `You have strong financial capacity with ${emergencyRunwayMonths} months of emergency runway and high psychological resilience. Your multi-year horizon (${investmentHorizonYears}+ years) allows substantial equity compounding.`;
      keyTrait = 'High Risk Capacity with Growth-Oriented Behavioral Discipline';
      recommendedMix = { equity: 75, debt: 15, gold: 5, liquid: 5 };
      behavioralWarning = 'Avoid speculative leverage (F&O / Crypto derivatives) despite high capacity; broad index compounding provides superior risk-adjusted wealth.';
    } else if (overallScore >= 65) {
      persona = 'Moderate — Growth Seeker';
      suggestedApproach = 'Balanced equity growth with disciplined debt cushion';
      mainConsideration = 'Can tolerate temporary market declines; maintain core index SIPs.';
      description = `Your profile shows steady ${form.incomeStability.toLowerCase()} income and adequate emergency reserves (${emergencyRunwayMonths} months). You are well suited for disciplined equity wealth creation over a ${investmentHorizonYears}-year horizon.`;
      keyTrait = 'Long Horizon with Strong Cash-Flow Stability';
      recommendedMix = { equity: 65, debt: 20, gold: 10, liquid: 5 };
      behavioralWarning = 'Caution: Do not panic during sudden 15-20% index corrections. Continue scheduled SIPs to dollar-cost average.';
    } else if (overallScore >= 50) {
      persona = 'Balanced — Disciplined Compounder';
      suggestedApproach = '50/50 Equity-Debt hybrid allocation';
      mainConsideration = 'Prioritize capital stability with moderate equity upside.';
      description = `You balance wealth growth with capital preservation. With an emergency buffer of ${emergencyRunwayMonths} months, a balanced hybrid allocation protects against severe market drawdowns.`;
      keyTrait = 'Balanced Stability with Moderate Equity Exposure';
      recommendedMix = { equity: 50, debt: 35, gold: 10, liquid: 5 };
      behavioralWarning = 'Review portfolio annually to rebalance back to target weights and prevent equity drift during bull markets.';
    } else if (overallScore >= 35) {
      persona = 'Moderately Conservative — Capital Preserver';
      suggestedApproach = 'High debt and liquid reserves with conservative equity';
      mainConsideration = 'Low tolerance for capital loss; prioritize high-quality debt & FDs.';
      description = `You place high priority on protecting initial capital. Your strategy emphasizes capital preservation, fixed income, and low-volatility instruments.`;
      keyTrait = 'Capital Preservation First';
      recommendedMix = { equity: 30, debt: 50, gold: 10, liquid: 10 };
      behavioralWarning = 'Excessive conservatism in low-yield FDs may fail to beat real 6.5% inflation over multi-year horizons.';
    } else {
      persona = 'Conservative — Security Anchor';
      suggestedApproach = 'Risk-free liquid reserves & government securities';
      mainConsideration = 'Zero volatility tolerance; focus on liquidity and capital safety.';
      description = `Preserving your initial capital is paramount. Your strategy focuses on risk-free liquid funds, Sweep-in FDs, and short-term debt.`;
      keyTrait = 'Maximum Liquidity & Safety';
      recommendedMix = { equity: 15, debt: 60, gold: 10, liquid: 15 };
      behavioralWarning = 'Keep at least 15% equity exposure to prevent inflation from eroding your purchasing power.';
    }

    const savingsRatePct = form.monthlyIncome > 0
      ? parseFloat(((form.monthlyInvestmentCapacity / form.monthlyIncome) * 100).toFixed(1))
      : 0;

    // 5. Structure AI Context Payload
    const aiPromptContext = {
      summary: `User is a ${form.age}-year-old ${form.workType} with monthly income ₹${form.monthlyIncome.toLocaleString('en-IN')}, savings rate ${savingsRatePct}%, and emergency runway of ${emergencyRunwayMonths} months.`,
      investorPersona: persona,
      capacityConstraints: `Risk capacity score: ${capacityScore}/100. Horizon: ${investmentHorizonYears} years. Debt-to-income: ${dtiRatio}%.`,
      psychologicalProfile: `Risk tolerance score: ${toleranceScore}/100. In a 20% crash: "${form.crashReaction20}". Loss priority: "${form.lossProtectionPriority}".`,
      suggestedNextEducationalTopics: [
        'How index funds beat active stock picking in Indian markets',
        'Managing sequence of returns risk during market drawdowns',
        'Optimizing debt allocation and emergency fund sweep accounts',
      ],
    };

    return {
      persona,
      riskCapacityScore: capacityScore,
      riskToleranceScore: toleranceScore,
      overallScore,
      investmentHorizonYears,
      monthlyCapacity: form.monthlyInvestmentCapacity,
      emergencyRunwayMonths,
      debtToIncomeRatio: dtiRatio,
      savingsRatePct,
      suggestedApproach,
      mainConsideration,
      description,
      keyTrait,
      recommendedMix,
      behavioralWarning,
      aiPromptContext,
    };
  }
}
