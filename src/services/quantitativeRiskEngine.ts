export interface RiskProfileInputs {
  goalType: 'capital_preservation' | 'emergency_fund' | 'short_term_purchase' | 'wealth_creation' | 'retirement_fire';
  horizonYears: number;
  monthlyIncome: number;
  monthlySavings: number;
  emergencyMonths: number;
  monthlyEmi: number;
  behavior: 'panic_sell_all' | 'stop_all_sips' | 'hold_and_do_nothing' | 'buy_more_aggressively';
  monthlyBudget: number;
  additionalContext?: string;
}

export interface AllocatedFund {
  schemeCode: number;
  schemeName: string;
  category: 'Equity' | 'Debt' | 'Gold';
  subCategory: string;
  weightagePercent: number;
  monthlySIPAmount: number;
}

export interface RiskProfileResult {
  compositeScore: number;
  tierKey: string;
  personaName: string;
  targetAllocation: {
    equity: number;
    debt: number;
    gold: number;
  };
  subAssetSplit: {
    equity: { large: number; mid: number; small: number; flexi: number; };
    debt: { liquid: number; banking: number; shortDuration: number; corporate: number; ultraShort: number; };
  };
  basket: AllocatedFund[];
}

export class QuantitativeRiskEngine {
  static calculateScore(inputs: RiskProfileInputs): number {
    // 1. S_goal
    let sGoal = 0;
    switch (inputs.goalType) {
      case 'capital_preservation': sGoal = 10; break;
      case 'emergency_fund': sGoal = 25; break;
      case 'short_term_purchase': sGoal = 45; break;
      case 'wealth_creation': sGoal = 80; break;
      case 'retirement_fire': sGoal = 100; break;
    }

    // 2. S_horizon
    let sHorizon = 0;
    if (inputs.horizonYears <= 1) sHorizon = 5;
    else if (inputs.horizonYears <= 3) sHorizon = 25;
    else if (inputs.horizonYears <= 7) sHorizon = 55;
    else if (inputs.horizonYears <= 15) sHorizon = 85;
    else sHorizon = 100;

    // 3. S_cushion
    const savingsRate = inputs.monthlyIncome > 0 ? (inputs.monthlySavings / inputs.monthlyIncome) * 100 : 0;
    let savingsScore = 0;
    if (savingsRate < 10) savingsScore = 10;
    else if (savingsRate <= 25) savingsScore = 40;
    else if (savingsRate <= 50) savingsScore = 75;
    else savingsScore = 100;

    let emergencyScore = 0;
    if (inputs.emergencyMonths === 0) emergencyScore = 0;
    else if (inputs.emergencyMonths < 6) emergencyScore = 50;
    else emergencyScore = 100;

    const dti = inputs.monthlyIncome > 0 ? (inputs.monthlyEmi / inputs.monthlyIncome) * 100 : 0;
    let debtScore = 0;
    if (dti > 40) debtScore = 0;
    else if (dti >= 15) debtScore = 50;
    else debtScore = 100;

    const sCushion = (0.35 * savingsScore) + (0.35 * emergencyScore) + (0.30 * debtScore);

    // 4. S_behavior
    let sBehavior = 0;
    switch (inputs.behavior) {
      case 'panic_sell_all': sBehavior = 0; break;
      case 'stop_all_sips': sBehavior = 30; break;
      case 'hold_and_do_nothing': sBehavior = 70; break;
      case 'buy_more_aggressively': sBehavior = 100; break;
    }

    // Composite
    const composite = (0.20 * sGoal) + (0.25 * sHorizon) + (0.25 * sCushion) + (0.30 * sBehavior);
    return Math.round(composite);
  }

  static getProfileMapping(score: number) {
    if (score <= 20) {
      return {
        tierKey: 'CONSERVATIVE',
        personaName: 'Conservative Shield',
        alloc: { equity: 15, debt: 80, gold: 5 },
        split: {
          equity: { large: 100, mid: 0, small: 0, flexi: 0 },
          debt: { liquid: 70, banking: 30, shortDuration: 0, corporate: 0, ultraShort: 0 }
        }
      };
    } else if (score <= 40) {
      return {
        tierKey: 'MOD_CONSERVATIVE',
        personaName: 'Moderately Conservative',
        alloc: { equity: 35, debt: 55, gold: 10 },
        split: {
          equity: { large: 70, mid: 0, small: 0, flexi: 30 },
          debt: { liquid: 0, banking: 0, shortDuration: 60, corporate: 40, ultraShort: 0 }
        }
      };
    } else if (score <= 60) {
      return {
        tierKey: 'BALANCED',
        personaName: 'Balanced Explorer',
        alloc: { equity: 60, debt: 30, gold: 10 },
        split: {
          equity: { large: 50, mid: 30, small: 0, flexi: 20 },
          debt: { liquid: 0, banking: 0, shortDuration: 0, corporate: 100, ultraShort: 0 }
        }
      };
    } else if (score <= 80) {
      return {
        tierKey: 'GROWTH',
        personaName: 'Growth Accelerator',
        alloc: { equity: 75, debt: 15, gold: 10 },
        split: {
          equity: { large: 40, mid: 35, small: 25, flexi: 0 },
          debt: { liquid: 0, banking: 0, shortDuration: 0, corporate: 0, ultraShort: 100 }
        }
      };
    } else {
      return {
        tierKey: 'AGGRESSIVE',
        personaName: 'Aggressive Alpha',
        alloc: { equity: 90, debt: 0, gold: 10 },
        split: {
          equity: { large: 30, mid: 40, small: 30, flexi: 0 },
          debt: { liquid: 0, banking: 0, shortDuration: 0, corporate: 0, ultraShort: 0 }
        }
      };
    }
  }

  static generateBasket(inputs: RiskProfileInputs, mapping: any): AllocatedFund[] {
    const budget = inputs.monthlyBudget;
    const eqAmt = Math.round(budget * (mapping.alloc.equity / 100));
    const debtAmt = Math.round(budget * (mapping.alloc.debt / 100));
    const goldAmt = Math.round(budget * (mapping.alloc.gold / 100));

    const basket: AllocatedFund[] = [];

    // Scheme Codes
    const FUNDS = {
      large: { code: 120716, name: 'UTI Nifty 50 Index Fund - Direct Growth' },
      flexi: { code: 122639, name: 'Parag Parikh Flexi Cap Fund - Direct Growth' },
      mid: { code: 125354, name: 'Motilal Oswal Midcap Fund - Direct Growth' },
      small: { code: 125497, name: 'Nippon India Small Cap Fund - Direct Growth' },
      corporate: { code: 119598, name: 'HDFC Corporate Bond Fund - Direct Growth' },
      liquid: { code: 119787, name: 'ICICI Prudential Liquid Fund - Direct Growth' },
      gold: { code: 120468, name: 'Nippon India Gold Savings Fund - Direct Growth' },
    };

    // Equity Allocations
    if (mapping.split.equity.large > 0) {
      basket.push({ schemeCode: FUNDS.large.code, schemeName: FUNDS.large.name, category: 'Equity', subCategory: 'Large Cap', weightagePercent: (mapping.alloc.equity * mapping.split.equity.large / 100), monthlySIPAmount: Math.round(eqAmt * (mapping.split.equity.large / 100)) });
    }
    if (mapping.split.equity.flexi > 0) {
      basket.push({ schemeCode: FUNDS.flexi.code, schemeName: FUNDS.flexi.name, category: 'Equity', subCategory: 'Flexi Cap', weightagePercent: (mapping.alloc.equity * mapping.split.equity.flexi / 100), monthlySIPAmount: Math.round(eqAmt * (mapping.split.equity.flexi / 100)) });
    }
    if (mapping.split.equity.mid > 0) {
      basket.push({ schemeCode: FUNDS.mid.code, schemeName: FUNDS.mid.name, category: 'Equity', subCategory: 'Mid Cap', weightagePercent: (mapping.alloc.equity * mapping.split.equity.mid / 100), monthlySIPAmount: Math.round(eqAmt * (mapping.split.equity.mid / 100)) });
    }
    if (mapping.split.equity.small > 0) {
      basket.push({ schemeCode: FUNDS.small.code, schemeName: FUNDS.small.name, category: 'Equity', subCategory: 'Small Cap', weightagePercent: (mapping.alloc.equity * mapping.split.equity.small / 100), monthlySIPAmount: Math.round(eqAmt * (mapping.split.equity.small / 100)) });
    }

    // Debt Allocations
    if (mapping.split.debt.liquid > 0) {
      basket.push({ schemeCode: FUNDS.liquid.code, schemeName: FUNDS.liquid.name, category: 'Debt', subCategory: 'Liquid', weightagePercent: (mapping.alloc.debt * mapping.split.debt.liquid / 100), monthlySIPAmount: Math.round(debtAmt * (mapping.split.debt.liquid / 100)) });
    }
    if (mapping.split.debt.shortDuration > 0) { // Fallback to Liquid for simplicity if no code provided
      basket.push({ schemeCode: FUNDS.liquid.code, schemeName: 'Short Duration Fund (Generic) - Direct', category: 'Debt', subCategory: 'Short Duration', weightagePercent: (mapping.alloc.debt * mapping.split.debt.shortDuration / 100), monthlySIPAmount: Math.round(debtAmt * (mapping.split.debt.shortDuration / 100)) });
    }
    if (mapping.split.debt.corporate > 0) {
      basket.push({ schemeCode: FUNDS.corporate.code, schemeName: FUNDS.corporate.name, category: 'Debt', subCategory: 'Corporate Bond', weightagePercent: (mapping.alloc.debt * mapping.split.debt.corporate / 100), monthlySIPAmount: Math.round(debtAmt * (mapping.split.debt.corporate / 100)) });
    }
    if (mapping.split.debt.banking > 0) {
      basket.push({ schemeCode: FUNDS.corporate.code, schemeName: 'Banking & PSU Fund (Generic) - Direct', category: 'Debt', subCategory: 'Banking & PSU', weightagePercent: (mapping.alloc.debt * mapping.split.debt.banking / 100), monthlySIPAmount: Math.round(debtAmt * (mapping.split.debt.banking / 100)) });
    }
    if (mapping.split.debt.ultraShort > 0) {
      basket.push({ schemeCode: FUNDS.liquid.code, schemeName: 'Ultra Short Duration Fund (Generic) - Direct', category: 'Debt', subCategory: 'Ultra Short', weightagePercent: (mapping.alloc.debt * mapping.split.debt.ultraShort / 100), monthlySIPAmount: Math.round(debtAmt * (mapping.split.debt.ultraShort / 100)) });
    }

    // Gold Allocation
    if (goldAmt > 0) {
      basket.push({ schemeCode: FUNDS.gold.code, schemeName: FUNDS.gold.name, category: 'Gold', subCategory: 'Gold ETF/FoF', weightagePercent: mapping.alloc.gold, monthlySIPAmount: goldAmt });
    }

    return basket.filter(b => b.monthlySIPAmount > 0);
  }

  static evaluate(inputs: RiskProfileInputs): RiskProfileResult {
    const score = this.calculateScore(inputs);
    const mapping = this.getProfileMapping(score);
    const basket = this.generateBasket(inputs, mapping);

    return {
      compositeScore: score,
      tierKey: mapping.tierKey,
      personaName: mapping.personaName,
      targetAllocation: mapping.alloc,
      subAssetSplit: mapping.split,
      basket
    };
  }
}
