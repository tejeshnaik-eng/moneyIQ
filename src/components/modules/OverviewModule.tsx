import React from 'react';
import { 
  ShieldAlert, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Receipt,
  Wallet
} from 'lucide-react';
import { mockHealthScore } from '../../mock/overviewData';
import { ModuleId } from '../../types';

interface OverviewModuleProps {
  onNavigateModule: (module: ModuleId) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigateModule }) => {
  const health = mockHealthScore;

  return (
    <div className="space-y-8 pb-12">
      {/* Financial Health Score & Asset Summary Ledger Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Health Score Pillar (8 cols) */}
        <div className="lg:col-span-8 bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3 mb-6">
              <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#565e74]">
                Financial Health Score Index
              </span>
              <span className="text-xs font-mono text-[#006b57] bg-[#f2f4f6] px-2.5 py-1 rounded">
                Verified Quantitative Index
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-4 mb-6">
              <span className="text-6xl font-heading font-extrabold text-[#00b090] tracking-tight">
                {health.overall}
              </span>
              <span className="text-xl font-heading font-bold text-[#565e74]">/ {health.max}</span>
              <span className="text-xs text-[#565e74] sm:ml-auto font-body italic">
                "{health.band}"
              </span>
            </div>

            {/* 4 Pillars Progress */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0]">
              {health.pillars.map((pillar) => (
                <div key={pillar.name} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-heading font-bold">
                    <span className="text-[#565e74]">{pillar.name}</span>
                    <span className="text-[#191c1e] font-mono">{pillar.score}%</span>
                  </div>
                  <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#00b090] h-full rounded-full"
                      style={{ width: `${pillar.score}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#565e74] block truncate">{pillar.status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#565e74]">
              Next systematic rebalance scheduled in 14 days.
            </span>
            <button
              onClick={() => onNavigateModule('risk')}
              className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
            >
              <span>Retake Risk Assessment</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Secondary Asset & Liability Ledger (4 cols) */}
        <div className="lg:col-span-4 bg-white border border-[#E2E8F0] rounded-xl p-6 flex flex-col justify-between shadow-sm space-y-4">
          <div className="space-y-4">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#565e74] block border-b border-[#E2E8F0] pb-3">
              Balance Sheet Summary
            </span>

            <div>
              <span className="text-xs text-[#565e74] block font-heading">Total Consolidated Assets</span>
              <span className="text-2xl font-heading font-bold text-[#191c1e] font-mono mt-0.5 block">
                ₹ 18,42,850
              </span>
            </div>

            <div className="w-full h-px bg-[#E2E8F0]"></div>

            <div>
              <span className="text-xs text-[#565e74] block font-heading">Total Liabilities (Credit/Loans)</span>
              <span className="text-xl font-heading font-bold text-[#565e74] font-mono mt-0.5 block">
                ₹ 1,20,000
              </span>
            </div>

            <div className="w-full h-px bg-[#E2E8F0]"></div>

            <div>
              <span className="text-xs text-[#565e74] block font-heading">Monthly Discretionary Leakage</span>
              <span className="text-lg font-heading font-bold text-[#ba1a1a] font-mono mt-0.5 block">
                ₹ 4,850 / mo
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigateModule('spend')}
            className="btn-outline text-xs py-2 w-full justify-center"
          >
            <span>Audit Spending Leaks</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Priority Action Alerts */}
      <div className="space-y-3">
        <h3 className="text-sm font-heading font-bold text-[#191c1e] uppercase tracking-wider">
          Priority Ledger Action Items
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-5 rounded-xl border bg-white border-[#ba1a1a]/30 flex flex-col justify-between space-y-3">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                  41.2% Large-Cap Portfolio Overlap
                </h4>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Parag Parikh Flexi Cap & UTI Nifty 50 have redundant heavy allocations in HDFC Bank & ICICI Bank.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#565e74]">
                Impact: Overconcentration Risk
              </span>
              <button
                onClick={() => onNavigateModule('portfolio')}
                className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
              >
                <span>Resolve in Portfolio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="p-5 rounded-xl border bg-white border-[#00b090]/30 flex flex-col justify-between space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00b090] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                  Reallocate ₹4,850/mo Discretionary Leakage
                </h4>
                <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                  Redirecting unused food delivery and subscription leakages to Nifty SIP adds ₹3.95 Lakhs in 5 years.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
              <span className="text-[11px] font-mono text-[#565e74]">
                Impact: +₹3.95L 5-Yr Wealth
              </span>
              <button
                onClick={() => onNavigateModule('spend')}
                className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
              >
                <span>Resolve in Spend Analysis</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Module Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          onClick={() => onNavigateModule('portfolio')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#00b090] text-left transition-colors group"
        >
          <div className="flex items-center justify-between">
            <Wallet className="w-5 h-5 text-[#00b090]" />
            <ArrowUpRight className="w-4 h-4 text-[#565e74] group-hover:text-[#006b57]" />
          </div>
          <h4 className="text-sm font-heading font-bold text-[#191c1e] mt-3">Portfolio Overlap</h4>
          <p className="text-xs text-[#565e74] mt-0.5">Audit 41.2% large-cap concentration.</p>
        </button>

        <button
          onClick={() => onNavigateModule('goals')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#00b090] text-left transition-colors group"
        >
          <div className="flex items-center justify-between">
            <TrendingUp className="w-5 h-5 text-[#00b090]" />
            <ArrowUpRight className="w-4 h-4 text-[#565e74] group-hover:text-[#006b57]" />
          </div>
          <h4 className="text-sm font-heading font-bold text-[#191c1e] mt-3">Goal Progress</h4>
          <p className="text-xs text-[#565e74] mt-0.5">Track emergency, home, and FI milestones.</p>
        </button>

        <button
          onClick={() => onNavigateModule('marketsim')}
          className="p-4 rounded-xl bg-white border border-[#E2E8F0] hover:border-[#00b090] text-left transition-colors group"
        >
          <div className="flex items-center justify-between">
            <ShieldAlert className="w-5 h-5 text-[#00b090]" />
            <ArrowUpRight className="w-4 h-4 text-[#565e74] group-hover:text-[#006b57]" />
          </div>
          <h4 className="text-sm font-heading font-bold text-[#191c1e] mt-3">Crash Simulation</h4>
          <p className="text-xs text-[#565e74] mt-0.5">Replay Covid 2020 & 2008 drawdowns.</p>
        </button>
      </div>
    </div>
  );
};
