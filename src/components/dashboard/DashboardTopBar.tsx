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
          
          <div className="relative group ml-2">
            <button className="flex items-center gap-3 hover:text-white transition-colors h-12 px-3 rounded-full hover:bg-[#2A2A2A]">
              <div className="flex flex-col items-end hidden md:flex">
                <span className="text-sm font-semibold text-white">{user.name || 'User'}</span>
                <span className="text-[11px] text-[#71717A] font-medium leading-none">Settings</span>
              </div>
              <UserCircle className="w-7 h-7" />
            </button>
            <div className="absolute right-0 top-full mt-2 w-48 bg-[#2A2A2A] rounded-xl shadow-2xl border border-[#333] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 py-2">
              <button onClick={onLogout} className="w-full text-left px-4 py-3 text-sm font-medium text-red-400 hover:bg-[#333] transition-colors">
                Sign Out
              </button>
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
