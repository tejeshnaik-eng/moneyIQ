const fs = require('fs');

const fullCode = `import React, { useState } from 'react';
import { Shield, Calculator, PieChart as PieChartIcon, TrendingUp, AlertTriangle } from 'lucide-react';
import { QuantitativeRiskEngine, RiskProfileInputs, RiskProfileResult } from '../../services/quantitativeRiskEngine';

export const QuantRiskModule: React.FC = () => {
  const [inputs, setInputs] = useState<RiskProfileInputs>({
    goalType: 'wealth_creation',
    horizonYears: 10,
    monthlyIncome: 100000,
    monthlySavings: 30000,
    emergencyMonths: 6,
    monthlyEmi: 15000,
    behavior: 'hold_and_do_nothing',
    monthlyBudget: 25000
  });

  const [result, setResult] = useState<RiskProfileResult | null>(null);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = QuantitativeRiskEngine.evaluate(inputs);
    setResult(res);
  };

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full pt-8 pb-12 px-4 md:px-0 text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Quantitative Risk Profiler</h1>
        <p className="text-[#8A8F98] text-[15px] max-w-2xl">
          A multi-variable algorithm that evaluates your exact financial goals, capacity, and behavioral tendencies to construct a highly personalized asset allocation and SIP basket.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT FORM */}
        <div className="lg:col-span-5 bg-[#1C1C1C] rounded-[24px] p-6 lg:p-8 shadow-2xl">
          <h2 className="text-xl font-heading font-bold mb-6 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-[#00D09C]" />
            Input Parameters
          </h2>
          
          <form onSubmit={handleCalculate} className="space-y-5">
            {/* 1. Goal */}
            <div>
              <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Primary Goal</label>
              <select className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" 
                value={inputs.goalType} onChange={e => setInputs({...inputs, goalType: e.target.value as any})}>
                <option value="capital_preservation">Capital Preservation</option>
                <option value="emergency_fund">Emergency Fund</option>
                <option value="short_term_purchase">Short Term Purchase (1-3 yrs)</option>
                <option value="wealth_creation">Long Term Wealth Creation</option>
                <option value="retirement_fire">Retirement / FIRE</option>
              </select>
            </div>

            {/* 2. Horizon */}
            <div>
              <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Investment Horizon (Years)</label>
              <input type="number" min="1" max="50" className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" 
                value={inputs.horizonYears} onChange={e => setInputs({...inputs, horizonYears: Number(e.target.value)})} />
            </div>

            {/* 3. Cushion (Income, Savings, EMI) */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Monthly Income (₹)</label>
                <input type="number" min="0" className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" 
                  value={inputs.monthlyIncome} onChange={e => setInputs({...inputs, monthlyIncome: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Monthly Savings (₹)</label>
                <input type="number" min="0" className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" 
                  value={inputs.monthlySavings} onChange={e => setInputs({...inputs, monthlySavings: Number(e.target.value)})} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Monthly EMI (₹)</label>
                <input type="number" min="0" className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" 
                  value={inputs.monthlyEmi} onChange={e => setInputs({...inputs, monthlyEmi: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Emergency Fund (Months)</label>
                <input type="number" min="0" max="60" className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" 
                  value={inputs.emergencyMonths} onChange={e => setInputs({...inputs, emergencyMonths: Number(e.target.value)})} />
              </div>
            </div>

            {/* 4. Behavior */}
            <div>
              <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">If the market crashes 20% next month, you would:</label>
              <select className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" 
                value={inputs.behavior} onChange={e => setInputs({...inputs, behavior: e.target.value as any})}>
                <option value="panic_sell_all">Panic and sell everything</option>
                <option value="stop_all_sips">Stop my SIPs to be safe</option>
                <option value="hold_and_do_nothing">Hold and do nothing</option>
                <option value="buy_more_aggressively">Buy more aggressively</option>
              </select>
            </div>

            {/* 5. Budget */}
            <div className="pt-2">
              <label className="block text-[12px] font-heading font-medium text-[#00D09C] mb-1.5 uppercase tracking-wider">SIP Budget (₹/month)</label>
              <input type="number" min="1000" className="w-full bg-[#00D09C]/10 border border-[#00D09C]/30 rounded-xl py-3 px-4 focus:outline-none focus:border-[#00D09C] text-[16px] font-bold text-white" 
                value={inputs.monthlyBudget} onChange={e => setInputs({...inputs, monthlyBudget: Number(e.target.value)})} />
            </div>

            <button type="submit" className="w-full bg-[#00D09C] text-black font-extrabold tracking-wide text-[15px] py-4 rounded-xl hover:bg-[#00E5AA] shadow-[0_4px_24px_rgba(0,208,156,0.25)] transition-all mt-6">
              GENERATE ALLOCATION
            </button>
          </form>
        </div>

        {/* RESULTS PANEL */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="bg-[#1C1C1C] rounded-[24px] p-12 h-full flex flex-col items-center justify-center text-center border border-[#2A2A2A] shadow-2xl">
              <Shield className="w-16 h-16 text-[#333] mb-4" />
              <h3 className="text-xl font-heading font-bold text-[#8A8F98]">Awaiting Inputs</h3>
              <p className="text-[14px] text-[#555] max-w-sm mt-2">Enter your financial details to generate a mathematically sound asset allocation and SIP basket.</p>
            </div>
          ) : (
            <>
              {/* Score & Persona */}
              <div className="bg-[#1C1C1C] rounded-[24px] p-6 lg:p-8 shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#00D09C]/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
                
                <div className="flex flex-col items-center md:items-start z-10">
                  <span className="text-[11px] font-bold text-[#8A8F98] uppercase tracking-widest mb-2">Composite Risk Score</span>
                  <div className="flex items-baseline">
                    <span className="text-6xl font-display-lg font-light tracking-tight text-white leading-none">{result.compositeScore}</span>
                    <span className="text-2xl font-bold text-[#444] ml-1">/100</span>
                  </div>
                </div>

                <div className="w-px h-16 bg-[#333] hidden md:block z-10"></div>

                <div className="flex flex-col items-center md:items-start z-10">
                  <span className="text-[11px] font-bold text-[#8A8F98] uppercase tracking-widest mb-2">Assigned Persona</span>
                  <h3 className="text-2xl font-heading font-bold text-[#00D09C]">{result.personaName}</h3>
                  <span className="inline-block px-2.5 py-1 bg-[#1A3329] text-[#00D09C] text-[10px] font-bold uppercase tracking-wider rounded mt-2">{result.tierKey}</span>
                </div>
              </div>

              {/* Asset Allocation */}
              <div className="bg-[#1C1C1C] rounded-[24px] p-6 lg:p-8 shadow-2xl">
                <h3 className="text-lg font-heading font-bold mb-6 flex items-center gap-2">
                  <PieChartIcon className="w-5 h-5 text-[#A7B5AE]" />
                  Target Allocation
                </h3>
                
                <div className="h-6 w-full rounded-full overflow-hidden flex mb-6 shadow-inner bg-[#111]">
                  {result.targetAllocation.equity > 0 && <div className="h-full bg-[#00D09C]" style={{ width: \`\${result.targetAllocation.equity}%\` }} title={\`Equity: \${result.targetAllocation.equity}%\`}></div>}
                  {result.targetAllocation.debt > 0 && <div className="h-full bg-[#2775E8]" style={{ width: \`\${result.targetAllocation.debt}%\` }} title={\`Debt: \${result.targetAllocation.debt}%\`}></div>}
                  {result.targetAllocation.gold > 0 && <div className="h-full bg-[#D99A00]" style={{ width: \`\${result.targetAllocation.gold}%\` }} title={\`Gold: \${result.targetAllocation.gold}%\`}></div>}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-[#111] rounded-xl p-4 border border-[#222]">
                    <span className="block text-[11px] font-bold text-[#8A8F98] uppercase tracking-wider mb-1">Equity</span>
                    <span className="text-2xl font-bold text-[#00D09C]">{result.targetAllocation.equity}%</span>
                  </div>
                  <div className="bg-[#111] rounded-xl p-4 border border-[#222]">
                    <span className="block text-[11px] font-bold text-[#8A8F98] uppercase tracking-wider mb-1">Debt</span>
                    <span className="text-2xl font-bold text-[#2775E8]">{result.targetAllocation.debt}%</span>
                  </div>
                  <div className="bg-[#111] rounded-xl p-4 border border-[#222]">
                    <span className="block text-[11px] font-bold text-[#8A8F98] uppercase tracking-wider mb-1">Gold</span>
                    <span className="text-2xl font-bold text-[#D99A00]">{result.targetAllocation.gold}%</span>
                  </div>
                </div>
              </div>

              {/* SIP Basket */}
              <div className="bg-[#1C1C1C] rounded-[24px] p-6 lg:p-8 shadow-2xl">
                <h3 className="text-lg font-heading font-bold mb-6 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-[#A7B5AE]" />
                  Recommended SIP Basket (₹{inputs.monthlyBudget.toLocaleString('en-IN')})
                </h3>
                
                <div className="space-y-3">
                  {result.basket.map((fund, idx) => (
                    <div key={idx} className="bg-[#111] border border-[#222] rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-[#333] transition-colors">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={\`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider \${
                            fund.category === 'Equity' ? 'bg-[#1A3329] text-[#00D09C]' :
                            fund.category === 'Debt' ? 'bg-[#1A2642] text-[#2775E8]' :
                            'bg-[#33250A] text-[#D99A00]'
                          }\`}>
                            {fund.category} • {fund.subCategory}
                          </span>
                          <span className="text-[10px] text-[#555] font-mono bg-[#222] px-1.5 py-0.5 rounded">ID: {fund.schemeCode}</span>
                        </div>
                        <h4 className="text-[14px] font-bold text-white leading-tight">{fund.schemeName}</h4>
                      </div>
                      <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center border-t md:border-t-0 border-[#222] pt-3 md:pt-0">
                        <span className="text-[12px] text-[#8A8F98] font-medium">{fund.weightagePercent.toFixed(1)}% Weight</span>
                        <span className="text-[18px] font-bold text-white">₹{fund.monthlySIPAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
`;

fs.writeFileSync('src/components/modules/QuantRiskModule.tsx', fullCode);
console.log('Restored QuantRiskModule.tsx directly without regex!');
