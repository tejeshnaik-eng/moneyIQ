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
        return { title: 'Learning', desc: 'Build your market knowledge by learning with real charts and interactive examples.' };
      case 'hypedetector':
        return { title: 'Hype Detector', desc: 'Official SEBI & RBI empirical fact-checker and claim verification.' };
      default:
        return { title: 'Dashboard', desc: 'Institutional portfolio management engine.' };
    }
  };

  const meta = getModuleMeta(activeModule);

  return (
    <header className={`${activeModule === 'overview' ? 'bg-[#1E1E1E] text-white border-b border-gray-800' : 'bg-surface/80 text-primary border-b border-outline-variant/30'} backdrop-blur-md sticky top-0 z-40 flex justify-between items-center h-16 px-lg w-full`}>
      <div className="flex items-center gap-sm">
        <span className={`font-headline-sm text-headline-sm font-bold ${activeModule === 'overview' ? 'text-white' : 'text-primary'}`}>{meta.title}</span>
      </div>
      {/* Search & Actions */}
      <div className="flex items-center gap-lg">
        <div className="relative focus-within:ring-2 focus-within:ring-primary/20 rounded-full">
          <Search className={`w-5 h-5 absolute left-md top-1/2 -translate-y-1/2 ${activeModule === 'overview' ? 'text-gray-400' : 'text-on-surface-variant'}`} />
          <input className={`${activeModule === 'overview' ? 'bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-gray-700' : 'bg-surface-variant/30 text-body-sm placeholder-on-surface-variant/60 focus:ring-primary'} border-none py-2 pl-10 pr-sm w-64 rounded-full focus:outline-none focus:ring-1`} placeholder="Search ticker or asset..." type="text"/>
        </div>
        <div className={`flex items-center gap-sm ${activeModule === 'overview' ? 'text-gray-400' : 'text-on-surface-variant'}`}>
          <button className={`hover:text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-full ${activeModule === 'overview' ? 'hover:bg-[#2A2A2A] hover:text-white' : 'hover:bg-surface-variant/50'}`}><Bell className="w-5 h-5" /></button>
          <button className={`hover:text-primary transition-colors w-10 h-10 flex items-center justify-center rounded-full ${activeModule === 'overview' ? 'hover:bg-[#2A2A2A] hover:text-white' : 'hover:bg-surface-variant/50'}`}><History className="w-5 h-5" /></button>
          <button className={`hover:text-primary transition-colors ml-xs w-10 h-10 flex items-center justify-center rounded-full ${activeModule === 'overview' ? 'hover:bg-[#2A2A2A] hover:text-white' : 'hover:bg-surface-variant/50'}`}><UserCircle className="w-5 h-5" /></button>
        </div>
      </div>
    </header>
  );
};
