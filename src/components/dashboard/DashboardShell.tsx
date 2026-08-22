import React, { useState } from 'react';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardTopBar } from './DashboardTopBar';
import { OverviewModule } from '../modules/OverviewModule';
import { RiskProfilingModule } from '../modules/RiskProfilingModule';
import { PortfolioModule } from '../modules/PortfolioModule';
import { GoalsModule } from '../modules/GoalsModule';
import { SpendAnalysisModule } from '../modules/SpendAnalysisModule';
import { MarketSimModule } from '../modules/MarketSimModule';
import { LearningModule } from '../modules/LearningModule';
import { ToolsModule } from '../modules/ToolsModule';
import { AiChatWidget } from '../chat/AiChatWidget';
import { ModuleId, UserProfile } from '../../types';

interface DashboardShellProps {
  user: UserProfile;
  initialModule?: ModuleId;
  onLogout?: () => void;
}

import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const DashboardShell: React.FC<DashboardShellProps> = ({
  user,
  initialModule = 'overview',
  onLogout,
}) => {
  const { user: authUser } = useAuth();
  const [activeModule, setActiveModule] = useState<ModuleId>(initialModule);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isCheckingProfile, setIsCheckingProfile] = useState(true);

  React.useEffect(() => {
    const checkProfile = async () => {
      if (!authUser?.id) return;
      const { data } = await supabase.from('risk_profiles').select('id').eq('user_id', authUser.id).maybeSingle();
      if (!data) {
        setActiveModule('risk');
      }
      setIsCheckingProfile(false);
    };
    checkProfile();
  }, [authUser?.id]);

  const renderActiveModule = () => {
    if (isCheckingProfile) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
        </div>
      );
    }

    switch (activeModule) {
      case 'overview':
        return <OverviewModule onNavigateModule={(m) => setActiveModule(m)} />;
      case 'risk':
        return <RiskProfilingModule />;
      case 'portfolio':
        return <PortfolioModule />;
      case 'goals':
        return <GoalsModule />;
      case 'spend':
        return <SpendAnalysisModule />;
      case 'marketsim':
        return <MarketSimModule />;
      case 'learning':
        return <LearningModule />;
      case 'tools':
        return <ToolsModule />;
      default:
        return <OverviewModule onNavigateModule={(m) => setActiveModule(m)} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-on-background flex font-body-md">
      <DashboardSidebar
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
        user={user}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto h-screen bg-[#1E1E1E]">
        <DashboardTopBar
          activeModule={activeModule}
          user={user}
          onNewAction={activeModule === 'goals' ? () => setActiveModule('goals') : undefined}
          onLogout={onLogout}
        />

        <main className="flex-1 w-full mx-auto p-0 max-w-none">
          {renderActiveModule()}
        </main>
      </div>
      
      {/* Floating Global AI Chatbot */}
      <AiChatWidget />
    </div>
  );
};
