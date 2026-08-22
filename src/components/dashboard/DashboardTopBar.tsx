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
        return { title: 'App Guides', desc: 'Build your market knowledge by learning with real charts and interactive examples.' };
      case 'hypedetector':
        return { title: 'Hype Detector', desc: 'Official SEBI & RBI empirical fact-checker and claim verification.' };
      case 'tools':
        return { title: 'Tools', desc: 'Useful calculators and financial tools to help you make better decisions.' };
      default:
        return { title: 'Dashboard', desc: 'Institutional portfolio management engine.' };
    }
  };

  const meta = getModuleMeta(activeModule);

  return (
    <header className={`${['overview', 'tools'].includes(activeModule) ? 'bg-[#1E1E1E] text-white border-b border-gray-800' : 'bg-surface/80 text-primary border-b border-outline-variant/30'} backdrop-blur-md sticky top-0 z-40 flex justify-between items-center h-[100px] px-10 w-full`}>
      <div className="flex items-center gap-sm">
        <span className={`font-headline-sm text-[26px] font-bold tracking-tight ${['overview', 'tools'].includes(activeModule) ? 'text-white' : 'text-primary'}`}>{meta.title}</span>
      </div>
      {/* Search & Actions */}
      <div className="flex items-center gap-8">
        <div className="relative focus-within:ring-2 focus-within:ring-primary/20 rounded-full">
          <Search className={`w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 ${['overview', 'tools'].includes(activeModule) ? 'text-gray-400' : 'text-on-surface-variant'}`} />
          <input className={`${['overview', 'tools'].includes(activeModule) ? 'bg-[#2A2A2A] text-white placeholder-gray-500 focus:ring-gray-700' : 'bg-surface-variant/30 text-body-sm placeholder-on-surface-variant/60 focus:ring-primary'} border-none py-3.5 pl-14 pr-6 w-80 rounded-full focus:outline-none focus:ring-1 text-[15px]`} placeholder="Search ticker or asset..." type="text"/>
        </div>
        <div className={`flex items-center gap-3 ${['overview', 'tools'].includes(activeModule) ? 'text-gray-400' : 'text-on-surface-variant'}`}>
          <button className={`hover:text-primary transition-colors w-12 h-12 flex items-center justify-center rounded-full ${['overview', 'tools'].includes(activeModule) ? 'hover:bg-[#2A2A2A] hover:text-white' : 'hover:bg-surface-variant/50'}`}><Bell className="w-6 h-6" /></button>
          <button className={`hover:text-primary transition-colors w-12 h-12 flex items-center justify-center rounded-full ${['overview', 'tools'].includes(activeModule) ? 'hover:bg-[#2A2A2A] hover:text-white' : 'hover:bg-surface-variant/50'}`}><History className="w-6 h-6" /></button>
          <button className={`hover:text-primary transition-colors ml-2 w-12 h-12 flex items-center justify-center rounded-full ${['overview', 'tools'].includes(activeModule) ? 'hover:bg-[#2A2A2A] hover:text-white' : 'hover:bg-surface-variant/50'}`}><UserCircle className="w-7 h-7" /></button>
        </div>
      </div>
    </header>
  );
};
