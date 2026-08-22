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
import { UserProfileModal } from './UserProfileModal';

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
  const [showProfileModal, setShowProfileModal] = React.useState(false);
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
      className={`bg-[#161616] text-[#E4E4E7] flex flex-col justify-between transition-all duration-200 z-20 shrink-0 h-screen sticky top-0 relative ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col">
        {/* Top Header / Back Button */}
        <div className="p-5 pt-8 pb-4">
          <button onClick={() => onSelectModule('overview')} className="flex items-center">
            {collapsed ? (
              <img src="/logo.png" alt="MoneyIQ" className="w-8 h-8 object-cover object-left" />
            ) : (
              <img src="/logo.png" alt="MoneyIQ Logo" className="h-8 w-auto object-contain" />
            )}
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

      {/* Bottom Section */}
      <div className="p-4 flex flex-col gap-3">


        {/* User Profile Pill */}
        <button 
          onClick={() => setShowProfileModal(true)}
          className={`w-full flex items-center justify-between p-2 rounded-xl border border-[#333333] bg-[#161616] hover:bg-[#222] transition-colors cursor-pointer ${collapsed ? 'justify-center' : ''}`} 
          title={user.email}
        >
          <div className="flex items-center gap-2 overflow-hidden flex-1">
            <div className="rounded-full p-[2px] bg-gradient-to-tr from-red-500 via-green-500 to-blue-500 shrink-0">
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white bg-[#A855F7]">
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
            </div>
            {!collapsed && (
              <span className="text-sm font-medium text-[#A1A1AA] truncate">
                {user.email || 'user@finsight.app'}
              </span>
            )}
          </div>
          {!collapsed && (
            <span className="text-[10px] font-bold bg-[#333333] text-[#A1A1AA] px-2 py-1 rounded-md shrink-0 tracking-wider ml-2">
              PRO
            </span>
          )}
        </button>
      </div>

      {showProfileModal && (
        <UserProfileModal onClose={() => setShowProfileModal(false)} />
      )}
    </aside>
  );
};
