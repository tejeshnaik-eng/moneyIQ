import React, { useState } from 'react';
import {
  LayoutDashboard,
  Shield,
  PieChart,
  Flag,
  Receipt,
  Activity,
  Flame,
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Bell,
  Search,
  Key,
  Folder,
  Gauge,
  Database,
  ArrowUpRight,
  Smartphone,
  Wrench,
  GitFork
} from 'lucide-react';
import { ModuleId, UserProfile } from '../../types';
import { SettingsModal } from '../modules/SettingsModal';

interface DashboardSidebarProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  user: UserProfile;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeModule,
  onSelectModule,
  user,
  collapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const renderNavButton = (id: ModuleId, label: string, Icon: React.ElementType) => {
    const isActive = activeModule === id;
    return (
      <button
        onClick={() => onSelectModule(id)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group relative ${isActive
            ? 'bg-[#27272A] text-[#E4E4E7]'
            : 'text-[#A1A1AA] hover:text-[#E4E4E7] hover:bg-[#27272A]/50'
          }`}
      >
        <Icon className={`w-5 h-5 shrink-0 transition-colors ${isActive ? 'text-[#10B981]' : 'text-[#71717A] group-hover:text-[#A1A1AA]'}`} />
        {!collapsed && (
          <span className="font-heading text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
            {label}
          </span>
        )}
        {isActive && !collapsed && (
          <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
        )}
      </button>
    );
  };

  const navItems: Array<{
    id: ModuleId;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }> = [
      { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-5 h-5" /> },
      { id: 'risk', label: 'Risk Profiling', icon: <Shield className="w-5 h-5" /> },
      { id: 'portfolio', label: 'Portfolio', icon: <PieChart className="w-5 h-5" /> },
      { id: 'goals', label: 'Goals', icon: <Flag className="w-5 h-5" /> },
      { id: 'spend', label: 'Spend Analysis', icon: <Receipt className="w-5 h-5" /> },
      { id: 'marketsim', label: 'Market Simulator', icon: <Activity className="w-5 h-5" /> },
      { id: 'decisionsim', label: 'Decision Simulator', icon: <GitFork className="w-5 h-5" /> },
      { id: 'hypedetector', label: 'Hype Detector', icon: <Flame className="w-5 h-5" /> },
    ];

  return (
    <aside
      className={`bg-[#161616] text-[#E4E4E7] flex flex-col justify-between transition-all duration-200 z-20 shrink-0 h-screen sticky top-0 relative ${collapsed ? 'w-20' : 'w-64'
        }`}
    >
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Top Header / Back Button */}
        <div className="p-4 pt-6">
          <button
            onClick={() => onSelectModule('overview')}
            className="flex items-center gap-2 text-[#A1A1AA] hover:text-[#E4E4E7] transition-colors font-heading text-sm font-medium"
          >
            <ChevronLeft className="w-4 h-4" />
            {!collapsed && <span>Dashboard</span>}
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="px-3 pb-4 space-y-6 flex-1">

          {/* SECTION 1 */}
          <div className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[11px] font-heading font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                Portfolio
              </h3>
            )}
            {renderNavButton('overview', 'Overview', Key)}
            {renderNavButton('portfolio', 'Holdings', Folder)}
            {renderNavButton('goals', 'Goals', Flag)}
            {renderNavButton('spend', 'Spend Analysis', Receipt)}
          </div>

          {/* SECTION 2 */}
          <div className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[11px] font-heading font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                Analysis & Risk
              </h3>
            )}
            {renderNavButton('risk', 'Risk Profiling', Shield)}
            {renderNavButton('marketsim', 'Market Simulator', Gauge)}
          </div>

          {/* SECTION 3 */}
          <div className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[11px] font-heading font-semibold text-[#71717A] uppercase tracking-wider mb-2">
                Learn
              </h3>
            )}
            {renderNavButton('learning', 'Learning', GraduationCap)}
          </div>

          {/* SECTION 4: Utilities */}
          <div className="space-y-1">
            {!collapsed && (
              <h3 className="px-3 text-[11px] font-heading font-semibold text-[#71717A] uppercase tracking-wider mb-2 mt-4">
                Utilities
              </h3>
            )}
            {renderNavButton('tools', 'Tools', Wrench)}
          </div>

        </nav>
      </div>

      <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-between bg-[#f7f9fb]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-[#00b090] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.name.charAt(0)}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-bold bg-[#333333] text-[#A1A1AA] px-2 py-1 rounded-md shrink-0 tracking-wider">
              PRO
            </span>
          )}
        </div>
        {!collapsed && (
          <Settings className="w-4 h-4 text-[#565e74] hover:text-[#006b57] cursor-pointer" />
        )}
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        user={user}
        onLogout={onLogout}
      />
    </aside>
  );
};
