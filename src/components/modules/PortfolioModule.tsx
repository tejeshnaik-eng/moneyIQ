import React, { useState } from 'react';
import { 
  PieChart, 
  AlertTriangle, 
  ArrowUpRight, 
  Building2, 
  ShieldCheck, 
  Filter
} from 'lucide-react';
import { mockHoldings, mockOverlapWarnings, mockPlatformBreakdown } from '../../mock/portfolioData';

export const PortfolioModule: React.FC = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const holdings = mockHoldings;
  const overlap = mockOverlapWarnings[0];
  const platforms = mockPlatformBreakdown;

  const filteredHoldings = selectedPlatform === 'all'
    ? holdings
    : holdings.filter(h => h.platform.toLowerCase().includes(selectedPlatform.toLowerCase()));

  const totalInvested = holdings.reduce((acc, h) => acc + h.investedValue, 0);
  const totalCurrent = holdings.reduce((acc, h) => acc + h.currentValue, 0);
  const netGain = totalCurrent - totalInvested;
  const returnPercent = ((netGain / totalInvested) * 100).toFixed(1);

  return (
    <div className="space-y-8 pb-12">
      {/* Portfolio Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Consolidated Value
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{totalCurrent.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#00b090] font-mono mt-1 block">
            Across 4 Master Accounts
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Principal Invested
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{totalInvested.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#565e74] font-mono mt-1 block">
            Cost basis
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Unrealized Returns
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#00b090] font-mono mt-1 block">
            +₹{netGain.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#00b090] font-mono mt-1 block">
            +{returnPercent}% absolute gain
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Portfolio Beta
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
            1.08
          </span>
          <span className="text-[11px] text-[#565e74] font-mono mt-1 block">
            Moderate Index Sensitivity
          </span>
        </div>
      </div>

      {/* 41.2% Overlap Alert Banner */}
      <div className="p-6 rounded-xl bg-white border border-[#ba1a1a]/30 shadow-sm space-y-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
          <div className="space-y-1 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                Portfolio Overlap Detected: {overlap.pair[0]} & {overlap.pair[1]}
              </h4>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#ffdad6] text-[#ba1a1a] self-start sm:self-auto">
                {overlap.overlapPercentage}% Overlap
              </span>
            </div>
            <p className="text-xs text-[#565e74] leading-relaxed">
              Common top holdings: {overlap.commonHoldings.join(', ')}.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-[#f7f9fb] border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-[#191c1e]">
            <strong>Recommendation:</strong> {overlap.recommendation}
          </span>
          <button className="text-xs font-heading font-bold text-[#006b57] hover:underline shrink-0">
            Rebalance Holdings →
          </button>
        </div>
      </div>

      {/* Holdings Ledger Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-bold text-base text-[#191c1e]">
              Consolidated Holdings Ledger
            </h4>
            <p className="text-xs text-[#565e74]">
              Synchronized across Zerodha, Groww, and EPFO master records.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {['all', 'zerodha', 'groww', 'epfo'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedPlatform(b)}
                className={`text-xs px-3 py-1.5 rounded-lg border uppercase font-heading font-semibold transition-colors ${
                  selectedPlatform === b
                    ? 'bg-[#006b57] text-white border-[#006b57]'
                    : 'bg-[#f7f9fb] text-[#565e74] border-[#E2E8F0] hover:bg-[#eceef0]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f7f9fb] border-b border-[#E2E8F0]">
                <th className="p-3.5 font-heading font-bold text-[#565e74]">Asset / Instrument</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74]">Platform</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74]">Category</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Invested</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Current Value</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Returns / XIRR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredHoldings.map((h) => (
                <tr key={h.id} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5 font-heading font-bold text-[#191c1e]">{h.name}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#f2f4f6] text-[#565e74] font-mono text-[10px] uppercase">
                      {h.platform}
                    </span>
                  </td>
                  <td className="p-3.5 text-[#565e74]">{h.category}</td>
                  <td className="p-3.5 text-right font-mono text-[#565e74]">₹{h.investedValue.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#191c1e]">₹{h.currentValue.toLocaleString('en-IN')}</td>
                  <td className="p-3.5 text-right font-mono text-[#00b090] font-bold">
                    +{h.returnsPercentage}% ({h.xirr}% XIRR)
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
