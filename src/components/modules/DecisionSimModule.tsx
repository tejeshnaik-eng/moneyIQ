import React, { useState } from 'react';
import { Lightbulb, TrendingUp, Car, Landmark, ArrowRight } from 'lucide-react';
import { mockDecisionScenarios } from '../../mock/decisionSimData';
import { DecisionScenario } from '../../types';

export const DecisionSimModule: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<DecisionScenario>(mockDecisionScenarios[0]);
  const [carPrice, setCarPrice] = useState(1200000);
  const [downPayment, setDownPayment] = useState(240000);
  const [cagr, setCagr] = useState(12.0);

  const loanAmount = carPrice - downPayment;
  const r = 0.095 / 12;
  const n = 60;
  const emi = Math.round((loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1));
  const fuelAndMaintenance = 6500;
  const cabCost = 8000;
  const monthlyDifferenceToInvest = emi + fuelAndMaintenance - cabCost;

  const monthlyR = cagr / 100 / 12;
  const fvSip = monthlyDifferenceToInvest * ((Math.pow(1 + monthlyR, n) - 1) / monthlyR) * (1 + monthlyR);
  const fvDownPayment = downPayment * Math.pow(1 + cagr / 100, 5);
  const totalCompoundedSip = Math.round(fvSip + fvDownPayment);
  const depreciatedCarValue = Math.round(carPrice * 0.42);
  const netWealthAlpha = totalCompoundedSip - depreciatedCarValue;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <span className="text-xs font-mono text-[#006b57] font-semibold uppercase tracking-wider">
            Opportunity Cost Matrix
          </span>
          <h3 className="text-xl font-heading font-extrabold text-[#191c1e] mt-0.5">
            Financial Decision Simulator (What-If Engine)
          </h3>
          <p className="text-xs text-[#565e74] mt-0.5">
            Model high-stakes lifetime trade-offs to calculate true net opportunity costs.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {mockDecisionScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => setSelectedScenario(sc)}
              className={`text-xs font-heading font-semibold px-3 py-1.5 rounded-lg border transition-colors ${
                selectedScenario.id === sc.id
                  ? 'bg-[#006b57] text-white border-[#006b57]'
                  : 'bg-white text-[#565e74] border-[#E2E8F0] hover:bg-[#f2f4f6]'
              }`}
            >
              {sc.title.split(' vs ')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Scenario Hero Card */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <div>
          <span className="text-xs font-mono text-[#006b57] uppercase font-semibold">
            {selectedScenario.category} Simulation
          </span>
          <h4 className="text-xl font-heading font-extrabold text-[#191c1e] mt-0.5">
            {selectedScenario.title}
          </h4>
          <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
            {selectedScenario.tagline}
          </p>
        </div>

        {/* Dynamic Sliders */}
        {selectedScenario.id === 'car-emi-vs-sip' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-[#E2E8F0]">
            <div>
              <div className="flex justify-between text-xs font-heading font-bold text-[#191c1e] mb-1.5">
                <span>Vehicle On-Road Price</span>
                <span className="text-[#006b57] font-mono">₹{carPrice.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="600000"
                max="3000000"
                step="50000"
                value={carPrice}
                onChange={(e) => {
                  const p = Number(e.target.value);
                  setCarPrice(p);
                  setDownPayment(Math.round(p * 0.2));
                }}
                className="w-full accent-[#00b090] bg-[#e6e8ea] h-2 rounded cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[#565e74] mt-1 block">
                Calculated 5-Yr EMI @ 9.5%: ₹{emi.toLocaleString('en-IN')}/mo
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-heading font-bold text-[#191c1e] mb-1.5">
                <span>Initial Down Payment</span>
                <span className="text-[#006b57] font-mono">₹{downPayment.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="100000"
                max={carPrice * 0.5}
                step="25000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-[#00b090] bg-[#e6e8ea] h-2 rounded cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[#565e74] mt-1 block">
                Invested upfront into index if choosing Path B
              </span>
            </div>

            <div>
              <div className="flex justify-between text-xs font-heading font-bold text-[#191c1e] mb-1.5">
                <span>Alternative Equity Index CAGR</span>
                <span className="text-[#006b57] font-mono">{cagr}%</span>
              </div>
              <input
                type="range"
                min="9.0"
                max="15.0"
                step="0.5"
                value={cagr}
                onChange={(e) => setCagr(Number(e.target.value))}
                className="w-full accent-[#00b090] bg-[#e6e8ea] h-2 rounded cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[#565e74] mt-1 block">
                Nifty 50 long-term benchmark
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded bg-[#f7f9fb] border border-[#E2E8F0] text-xs text-[#565e74]">
            Comparing prepaying 8.75% home loan principal vs allocating monthly surplus into diversified equity funds.
          </div>
        )}
      </div>

      {/* Side-by-Side Wealth Outcome Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option A Card */}
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <span className="text-xs font-heading font-bold text-[#e59840] uppercase tracking-wider">
              Path A: Buy Vehicle on Loan
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#f2f4f6] text-[#565e74]">
              Depreciating Asset
            </span>
          </div>

          <div>
            <span className="text-xs text-[#565e74] block font-mono">End-of-Year-5 Residual Asset Worth:</span>
            <span className="text-3xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
              ₹{(selectedScenario.id === 'car-emi-vs-sip' ? depreciatedCarValue : selectedScenario.optionA.netWealth5Years).toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-[#565e74] leading-relaxed border-t border-[#E2E8F0] pt-3">
            {selectedScenario.id === 'car-emi-vs-sip' 
              ? `Total 5-Yr Outflow: ₹${((emi + fuelAndMaintenance) * 60 + downPayment).toLocaleString('en-IN')}. End Asset: 5-year-old car worth ~42% of original invoice.`
              : selectedScenario.optionA.summary}
          </p>
        </div>

        {/* Option B Card */}
        <div className="p-6 rounded-xl bg-white border border-[#00b090]/50 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
            <span className="text-xs font-heading font-bold text-[#006b57] uppercase tracking-wider">
              Path B: Cab/Metro + Invest Difference
            </span>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#00b090]/10 text-[#006b57]">
              Compounding Portfolio
            </span>
          </div>

          <div>
            <span className="text-xs text-[#565e74] block font-mono">End-of-Year-5 Compounded Liquid Wealth:</span>
            <span className="text-3xl font-heading font-extrabold text-[#00b090] font-mono mt-1 block">
              ₹{(selectedScenario.id === 'car-emi-vs-sip' ? totalCompoundedSip : selectedScenario.optionB.netWealth5Years).toLocaleString('en-IN')}
            </span>
          </div>

          <p className="text-xs text-[#565e74] leading-relaxed border-t border-[#E2E8F0] pt-3">
            {selectedScenario.id === 'car-emi-vs-sip' 
              ? `Invested ₹${downPayment.toLocaleString('en-IN')} lump sum + ₹${monthlyDifferenceToInvest.toLocaleString('en-IN')}/mo difference into Nifty 50 at ${cagr}% CAGR. Net gain: +₹${netWealthAlpha.toLocaleString('en-IN')}.`
              : selectedScenario.optionB.summary}
          </p>
        </div>
      </div>

      {/* Analytical Recommendation */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#006b57]">
          <Lightbulb className="w-5 h-5 text-[#00b090]" />
          <span>FinSight Analytical Recommendation</span>
        </div>
        <p className="text-xs text-[#191c1e] leading-relaxed">
          {selectedScenario.analyticalTakeaway}
        </p>
      </div>
    </div>
  );
};
