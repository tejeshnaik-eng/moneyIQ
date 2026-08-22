import React from 'react';
import { Bell, Search, History, UserCircle } from 'lucide-react';
import { ModuleId, UserProfile } from '../../types';

interface DashboardTopBarProps {
  activeModule: ModuleId;
  user: UserProfile;
  onNewAction?: () => void;
  onLogout?: () => void;
}

export const DashboardTopBar: React.FC<DashboardTopBarProps> = ({
  activeModule,
  user,
  onNewAction,
  onLogout,
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
      case 'learning':
        return { title: 'Learning', desc: 'Build your market knowledge with interactive lessons and visual explanations.' };
      case 'tools':
        return { title: 'Tools', desc: 'Useful calculators and financial tools to help you make better decisions.' };
      default:
        return { title: 'Dashboard', desc: 'Institutional portfolio management engine.' };
    }
  };

  const meta = getModuleMeta(activeModule);

  return (
    <header className="bg-[#1E1E1E] text-white border-b border-[#2A2A2A] backdrop-blur-md sticky top-0 z-40 flex justify-between items-center h-[100px] px-10 w-full">
      <div className="flex items-center gap-sm">
        <span className="font-headline-sm text-[26px] font-bold tracking-tight text-white">{meta.title}</span>
      </div>
      {/* Search & Actions */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3 text-[#71717A]">
          <button className="hover:text-white transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#2A2A2A]"><Bell className="w-6 h-6" /></button>
          <button className="hover:text-white transition-colors w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#2A2A2A]"><History className="w-6 h-6" /></button>
          <button className="hover:text-white transition-colors ml-2 w-12 h-12 flex items-center justify-center rounded-full hover:bg-[#2A2A2A]"><UserCircle className="w-7 h-7" /></button>
        </div>
      </div>
    </header>
  );
};
