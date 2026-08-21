import React from 'react';
import { 
  LayoutDashboard, 
  Shield, 
  PieChart, 
  Flag, 
  Receipt, 
  Activity, 
  GitFork, 
  Flame, 
  Settings,
  ChevronLeft,
  ChevronRight,
  GraduationCap
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
    { id: 'learning', label: 'Learning', icon: <GraduationCap className="w-5 h-5" /> },
    { id: 'hypedetector', label: 'Hype Detector', icon: <Flame className="w-5 h-5" /> },
  ];

  return (
    <aside
      className={`bg-[var(--app-surface)] border-r border-[var(--app-border)] flex flex-col justify-between transition-all duration-200 z-20 shrink-0 h-screen sticky top-0 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        <div className="p-6 border-b border-[var(--app-border)] flex items-center justify-between">
          {!collapsed ? (
            <div>
              <h1 className="font-heading font-bold text-xl text-[var(--primary-dim)]">FinSight</h1>
              <p className="font-heading font-semibold text-[10px] text-[var(--app-text-muted)] uppercase tracking-wider mt-0.5">
                Institutional Ledger
              </p>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] text-white flex items-center justify-center font-bold text-sm mx-auto">
              F
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-lg text-[var(--app-text-muted)] hover:bg-[var(--app-surface-alt)] hover:text-[var(--app-text)] transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-180px)]">
          {navItems.map((item) => {
            const isActive = activeModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-heading transition-all ${
                  isActive
                    ? 'bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold border-r-4 border-[var(--primary-dim)]'
                    : 'text-[var(--app-text-muted)] hover:bg-[var(--app-surface-alt)] hover:text-[var(--app-text)] font-medium'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <div className={`shrink-0 ${isActive ? 'text-[var(--primary-dim)]' : 'text-[var(--app-text-muted)]'}`}>
                  {item.icon}
                </div>

                {!collapsed && (
                  <div className="flex items-center justify-between flex-1 text-left">
                    <span>{item.label}</span>
                    {item.badge && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          item.badge.includes('Alert') || item.badge.includes('Leak')
                            ? 'bg-[#ffdad6] text-[#ba1a1a]'
                            : 'bg-[#dae2fd] text-[var(--primary-dim)]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-[var(--app-border)] flex items-center justify-between bg-[var(--app-surface-alt)]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-full bg-[var(--primary)] text-white flex items-center justify-center font-bold text-xs shrink-0">
            {user.name.charAt(0)}
          </div>
          {!collapsed && (
            <div className="truncate">
              <p className="font-heading font-bold text-xs text-[var(--app-text)] truncate">{user.name}</p>
              <p className="text-[11px] text-[var(--app-text-muted)] truncate">{user.riskCategory}</p>
            </div>
          )}
        </div>
        {!collapsed && (
          <Settings className="w-4 h-4 text-[var(--app-text-muted)] hover:text-[var(--primary-dim)] cursor-pointer" />
        )}
      </div>
    </aside>
  );
};
