export const calculateSipFutureValue = (monthly: number, annualRatePct: number, years: number): number => {
  const monthlyRate = (annualRatePct / 100) / 12;
  const totalMonths = years * 12;
  if (monthlyRate === 0) return monthly * totalMonths;
  const fv = monthly * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate);
  return Math.round(fv);
};

export const calculateLumpSum = (principal: number, annualRatePct: number, years: number): number => {
  const fv = principal * Math.pow(1 + (annualRatePct / 100), years);
  return Math.round(fv);
};

export const calculateCAGR = (startValue: number, endValue: number, years: number): number => {
  if (startValue <= 0 || years <= 0) return 0;
  return (Math.pow(endValue / startValue, 1 / years) - 1) * 100;
};

export const calculateDrawdown = (prices: number[]): number => {
  let maxDrawdown = 0;
  let peak = -Infinity;
  for (const price of prices) {
    if (price > peak) peak = price;
    const drawdown = (peak - price) / peak;
    if (drawdown > maxDrawdown) maxDrawdown = drawdown;
  }
  return maxDrawdown * 100;
};

// Simplified XIRR approximation for regular SIPs
export const approximateXIRR = (totalInvested: number, currentValue: number, years: number): number => {
  if (totalInvested <= 0 || years <= 0) return 0;
  let guess = 0.1;
  for (let i = 0; i < 100; i++) {
    const fv = calculateSipFutureValue(totalInvested / (years * 12), guess * 100, years);
    const diff = fv - currentValue;
    if (Math.abs(diff) < 100) break;
    if (diff > 0) guess -= 0.001;
    else guess += 0.001;
  }
  return guess * 100;
};

export const adjustForInflation = (futureValue: number, inflationRatePct: number, years: number): number => {
  return Math.round(futureValue / Math.pow(1 + (inflationRatePct / 100), years));
};
