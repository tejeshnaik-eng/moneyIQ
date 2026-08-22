import React from 'react';
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
  Wrench
} from 'lucide-react';
import { ModuleId, UserProfile } from '../../types';

interface DashboardSidebarProps {
  activeModule: ModuleId;
  onSelectModule: (module: ModuleId) => void;
  user: UserProfile;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeModule,
  onSelectModule,
  user,
  collapsed,
  onToggleCollapse,
}) => {
  // If collapsed, we just show a minimized version (or we can hide it, but standard is icon-only)
  // The provided design doesn't show a collapsed state, but we'll adapt it.

  const renderNavButton = (id: ModuleId, label: string, Icon: any) => {
    const isActive = activeModule === id;
    
    return (
      <button
        key={id}
        onClick={() => onSelectModule(id)}
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-heading transition-all ${
          isActive
            ? 'bg-[#2A2A2A] text-white font-medium'
            : 'text-[#A1A1AA] hover:text-[#E4E4E7] hover:bg-[#2A2A2A]/50 font-medium'
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#A1A1AA]'}`} strokeWidth={isActive ? 2.5 : 2} />
        {!collapsed && <span>{label}</span>}
      </button>
    );
  };

  return (
    <aside
      className={`bg-[#161616] text-[#E4E4E7] flex flex-col justify-between transition-all duration-200 z-20 shrink-0 h-screen sticky top-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col">
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
                Observe
              </h3>
            )}
            {renderNavButton('learning', 'App Guides', Smartphone)}
            {renderNavButton('hypedetector', 'Hype Detector', Flame)}
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

          <div className="pt-4">
            <button className="flex items-center gap-2 px-3 py-2 text-[#A1A1AA] hover:text-[#E4E4E7] font-heading text-sm font-medium transition-colors">
              {!collapsed && <span>Changelog</span>}
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="p-4 flex flex-col gap-3">
        {/* 4 Icon Buttons Row */}
        {!collapsed && (
          <div className="flex items-center justify-between gap-2">
            <button className="flex-1 flex justify-center py-2 rounded-xl border border-[#333333] text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A] transition-colors">
              <Bell className="w-4 h-4" />
            </button>
            <button className="flex-1 flex justify-center py-2 rounded-xl border border-[#333333] text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A] transition-colors">
              <Settings className="w-4 h-4" />
            </button>
            <button className="flex-1 flex justify-center py-2 rounded-xl border border-[#333333] text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A] transition-colors">
              <Search className="w-4 h-4" />
            </button>
            <button className="flex-1 flex justify-center py-2 rounded-xl border border-[#333333] text-[#A1A1AA] hover:text-white hover:bg-[#2A2A2A] transition-colors">
              <Key className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* User Profile Pill */}
        <div className={`flex items-center justify-between p-2 rounded-xl border border-[#333333] bg-[#161616] ${collapsed ? 'justify-center' : ''}`}>
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="rounded-full p-[2px] bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#A855F7]">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </div>
            {!collapsed && (
              <span className="text-sm font-medium text-[#A1A1AA] truncate w-24">
                {user.email || 'user@finsight.app'}
              </span>
            )}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-bold bg-[#333333] text-[#A1A1AA] px-2 py-1 rounded-md shrink-0 tracking-wider">
              PRO
            </span>
          )}
        </div>
      </div>
      
      {/* Collapse Toggle */}
      <button
        onClick={onToggleCollapse}
        className="absolute -right-3 top-1/2 -translate-y-1/2 bg-[#2A2A2A] text-[#A1A1AA] hover:text-white rounded-full p-1 border border-[#333333] shadow-md z-30"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
};
