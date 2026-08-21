import { getStorageKey } from '../../utils';
import React, { useEffect, useState } from 'react';
import { 
  ShieldAlert, 
  ArrowUpRight, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  TrendingUp,
  Wallet
} from 'lucide-react';
import { ModuleId } from '../../types';

interface OverviewModuleProps {
  onNavigateModule: (module: ModuleId) => void;
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigateModule }) => {
  const [assets, setAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [leakage, setLeakage] = useState(0);
  const [hasProfile, setHasProfile] = useState(false);

  useEffect(() => {
    try {
      const holdingsData = localStorage.getItem(getStorageKey('finsight_portfolio_holdings'));
      if (holdingsData) {
        const holdings = JSON.parse(holdingsData);
        if (Array.isArray(holdings)) {
          const totalAssets = holdings.reduce((sum, h) => sum + (Number(h.currentValue) || 0), 0);
          setAssets(totalAssets);
        }
      }

      const profileData = localStorage.getItem(getStorageKey('finsight_investor_profile'));
      if (profileData) {
        const profile = JSON.parse(profileData);
        setLiabilities(Number(profile.outstandingDebt) || 0);
        setHasProfile(true);
      }

      const spendData = localStorage.getItem(getStorageKey('finsight_spend_transactions'));
      if (spendData) {
        const transactions = JSON.parse(spendData);
        if (Array.isArray(transactions)) {
          const discretionary = transactions
            .filter(t => t.category === 'Discretionary')
            .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
          setLeakage(discretionary);
        }
      }
    } catch (e) {
      console.error('Error parsing overview data', e);
    }
  }, []);

  const hasData = hasProfile || assets > 0;
  
  // Calculate a basic health score based on inputs
  const healthScore = hasData ? Math.min(100, Math.max(30, 70 + (assets > 0 ? 10 : 0) - (liabilities > 0 ? 5 : 0) - (leakage > 0 ? 5 : 0))) : 0;
  const healthBand = hasData ? (healthScore > 75 ? 'Excellent' : healthScore > 50 ? 'Fair' : 'Needs Work') : 'N/A';

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

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
                {hasData ? healthScore : 'N/A'}
              </span>
              {hasData && <span className="text-xl font-heading font-bold text-[#565e74]">/ 100</span>}
              <span className="text-xs text-[#565e74] sm:ml-auto font-body italic">
                "{healthBand}"
              </span>
            </div>
            
            {!hasData && (
              <p className="text-sm text-[#565e74]">
                Add your profile and holdings to generate your Health Score.
              </p>
            )}

            {/* Basic Pillars Progress */}
            {hasData && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#E2E8F0]">
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-heading font-bold">
                    <span className="text-[#565e74]">Assets</span>
                    <span className="text-[#191c1e] font-mono">{assets > 0 ? '100' : '0'}%</span>
                  </div>
                  <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00b090] h-full rounded-full" style={{ width: `${assets > 0 ? 100 : 0}%` }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-heading font-bold">
                    <span className="text-[#565e74]">Debt Control</span>
                    <span className="text-[#191c1e] font-mono">{liabilities === 0 ? '100' : '50'}%</span>
                  </div>
                  <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00b090] h-full rounded-full" style={{ width: `${liabilities === 0 ? 100 : 50}%` }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-heading font-bold">
                    <span className="text-[#565e74]">Spend Control</span>
                    <span className="text-[#191c1e] font-mono">{leakage === 0 ? '100' : '60'}%</span>
                  </div>
                  <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00b090] h-full rounded-full" style={{ width: `${leakage === 0 ? 100 : 60}%` }} />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-heading font-bold">
                    <span className="text-[#565e74]">Risk Profile</span>
                    <span className="text-[#191c1e] font-mono">{hasProfile ? '100' : '0'}%</span>
                  </div>
                  <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00b090] h-full rounded-full" style={{ width: `${hasProfile ? 100 : 0}%` }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs text-[#565e74]">
              Next systematic rebalance scheduled in 14 days.
            </span>
            <button
              onClick={() => onNavigateModule('risk')}
              className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
            >
              <span>{hasProfile ? 'Retake Risk Assessment' : 'Take Risk Assessment'}</span>
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
                {formatCurrency(assets)}
              </span>
            </div>

            <div className="w-full h-px bg-[#E2E8F0]"></div>

            <div>
              <span className="text-xs text-[#565e74] block font-heading">Total Liabilities (Credit/Loans)</span>
              <span className="text-xl font-heading font-bold text-[#565e74] font-mono mt-0.5 block">
                {formatCurrency(liabilities)}
              </span>
            </div>

            <div className="w-full h-px bg-[#E2E8F0]"></div>

            <div>
              <span className="text-xs text-[#565e74] block font-heading">Monthly Discretionary Leakage</span>
              <span className="text-lg font-heading font-bold text-[#ba1a1a] font-mono mt-0.5 block">
                {formatCurrency(leakage)} / mo
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
          
          {/* Alert 1 */}
          {!hasProfile ? (
            <div className="p-5 rounded-xl border bg-white border-[#ba1a1a]/30 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                    Complete your Risk Profile
                  </h4>
                  <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                    We need your risk profile to accurately assess your portfolio suitability.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-mono text-[#565e74]">
                  Impact: Unknown Risk
                </span>
                <button
                  onClick={() => onNavigateModule('risk')}
                  className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
                >
                  <span>Resolve in Risk</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : assets === 0 ? (
            <div className="p-5 rounded-xl border bg-white border-[#ba1a1a]/30 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                    Add a Holding
                  </h4>
                  <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                    You have no assets recorded. Add holdings to see your portfolio analysis.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-mono text-[#565e74]">
                  Impact: No Analysis
                </span>
                <button
                  onClick={() => onNavigateModule('portfolio')}
                  className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
                >
                  <span>Add Holdings</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl border bg-white border-[#00b090]/30 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00b090] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                    Portfolio Setup Complete
                  </h4>
                  <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                    You have assets recorded and a complete risk profile.
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-mono text-[#565e74]">
                  Impact: Full Analysis Available
                </span>
                <button
                  onClick={() => onNavigateModule('portfolio')}
                  className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
                >
                  <span>View Portfolio</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Alert 2 */}
          {leakage > 0 ? (
            <div className="p-5 rounded-xl border bg-white border-[#00b090]/30 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#00b090] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                    Review {formatCurrency(leakage)} Discretionary Spend
                  </h4>
                  <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                    Consider reallocating your discretionary spending towards your financial goals.
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-mono text-[#565e74]">
                  Impact: Optimize Cashflow
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
          ) : (
            <div className="p-5 rounded-xl border bg-white border-[#00b090]/30 flex flex-col justify-between space-y-3">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#00b090] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-heading font-bold text-[#191c1e]">
                    No Discretionary Leakage
                  </h4>
                  <p className="text-xs text-[#565e74] mt-1 leading-relaxed">
                    Great job keeping your discretionary expenses low!
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="text-[11px] font-mono text-[#565e74]">
                  Impact: Optimal Cashflow
                </span>
                <button
                  onClick={() => onNavigateModule('spend')}
                  className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
                >
                  <span>View Spend Analysis</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
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
          <h4 className="text-sm font-heading font-bold text-[#191c1e] mt-3">Portfolio Overview</h4>
          <p className="text-xs text-[#565e74] mt-0.5">Audit your current holdings.</p>
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
