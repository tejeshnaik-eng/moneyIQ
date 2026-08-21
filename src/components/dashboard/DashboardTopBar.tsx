import React from 'react';
import { Bell, ShieldCheck, Plus } from 'lucide-react';
import { ModuleId, UserProfile } from '../../types';

interface DashboardTopBarProps {
  activeModule: ModuleId;
  user: UserProfile;
  onNewAction?: () => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  activeModule,
  user,
  onNewAction,
}) => {
  const getModuleMeta = (mod: ModuleId): { title: string; desc: string } => {
    switch (mod) {
      case 'overview':
        return { title: 'Overview', desc: 'Current financial health score and key portfolio metrics as of today.' };
      case 'risk':
        return { title: 'Risk Profiling', desc: '5-pillar emotional and structural drawdown risk assessment.' };
      case 'portfolio':
        return { title: 'Portfolio Blueprint', desc: 'Consolidated holdings across Zerodha, Groww, and EPFO with overlap analysis.' };
      case 'goals':
        return { title: 'Goal Planning', desc: 'Strategic capital allocation tracking and milestone projections.' };
      case 'spend':
        return { title: 'Spend Analysis', desc: 'Expense leakage detection and systematic SIP reallocation.' };
      case 'marketsim':
        return { title: 'Market Simulator', desc: 'Real historical crisis sandbox (Covid 2020, 2008 GFC, 2016 Demonetization).' };
      case 'decisionsim':
        return { title: 'Decision Simulator', desc: 'High-stakes Opportunity Cost Matrix and What-If scenario engine.' };
      case 'hypedetector':
        return { title: 'Hype Detector', desc: 'Official SEBI & RBI empirical fact-checker and claim verification.' };
      default:
        return { title: 'Dashboard', desc: 'Institutional portfolio management engine.' };
    }
  };

  const meta = getModuleMeta(activeModule);

  return (
    <header className="bg-white border-b border-[#E2E8F0] px-8 py-4 sticky top-0 z-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 max-w-[1280px] mx-auto w-full">
        <div>
          <div className="flex items-center gap-2 uppercase tracking-wider text-[11px] font-mono">
            <span className="text-[#006b57] font-semibold">
              FinSight Ledger
            </span>
            <span className="text-[#E2E8F0]">•</span>
            <span className="text-[#565e74]">
              {user.name} ({user.riskCategory})
            </span>
          </div>
          <h2 className="text-2xl font-heading font-extrabold text-[#191c1e] mt-0.5">
            {meta.title}
          </h2>
          <p className="text-xs text-[#565e74] mt-0.5">
            {meta.desc}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f7f9fb] border border-[#E2E8F0] text-xs font-mono text-[#006b57]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INR Base (₹)</span>
          </div>

          <button
            className="p-2 rounded-lg text-[#565e74] hover:bg-[#f2f4f6] hover:text-[#191c1e] border border-[#E2E8F0]"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {onNewAction && (
            <button
              onClick={onNewAction}
              className="btn-primary text-xs py-2 px-4 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create / Add</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
