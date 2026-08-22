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
import { HypeDetectorModule } from '../modules/HypeDetectorModule';
import { AiChatWidget } from '../chat/AiChatWidget';
import { ModuleId, UserProfile } from '../../types';

interface DashboardShellProps {
  user: UserProfile;
  initialModule?: ModuleId;
  onLogout?: () => void;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({
  user,
  initialModule = 'overview',
  onLogout,
}) => {
  const [activeModule, setActiveModule] = useState<ModuleId>(initialModule);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const renderActiveModule = () => {
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
      case 'hypedetector':
        return <HypeDetectorModule />;
      case 'tools':
        return <ToolsModule />;
      default:
        return <OverviewModule onNavigateModule={(m) => setActiveModule(m)} />;
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-background flex font-body-md">
      <DashboardSidebar
        activeModule={activeModule}
        onSelectModule={(mod) => setActiveModule(mod)}
        user={user}
        collapsed={false}
        onToggleCollapse={() => {}}
      />

      <div className={`flex-1 flex flex-col min-w-0 overflow-y-auto h-screen ${['overview', 'tools'].includes(activeModule) ? 'bg-[#1E1E1E]' : ''}`}>
        <DashboardTopBar
          activeModule={activeModule}
          user={user}
          onNewAction={activeModule === 'goals' ? () => setActiveModule('goals') : undefined}
          onLogout={onLogout}
        />

        <main className={`flex-1 w-full mx-auto ${['overview', 'tools'].includes(activeModule) ? 'p-0 max-w-none' : 'p-6 sm:p-8 max-w-[1280px]'}`}>
          {renderActiveModule()}
        </main>
      </div>
      
      {/* Floating Global AI Chatbot */}
      <AiChatWidget />
    </div>
  );
};
