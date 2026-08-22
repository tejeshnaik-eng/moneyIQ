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
import { QuantRiskModule } from '../modules/QuantRiskModule';
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


const TIPS = [
  "💡 Tip: Ask the AI Chatbot for help adjusting your portfolio!",
  "💡 Tip: You can paste screenshots into the AI Chatbot for instant analysis.",
  "💡 Tip: Not sure what a term means? Ask the AI Chatbot for a quick explanation.",
  "💡 Tip: The AI can generate custom SIP baskets based on your changing goals."
];

const TipWidget = () => {
  const [tipIndex, setTipIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setTipIndex((prev) => (prev + 1) % TIPS.length);
        setVisible(true);
      }, 500); // fade out duration
    }, 12000); // change tip every 12 seconds
    return () => clearInterval(interval);
  }, []);

    return (
    <div className={`fixed bottom-3 left-6 z-50 transition-all duration-500 ${visible ? 'opacity-60 hover:opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
      <div className="cursor-pointer" onClick={() => window.dispatchEvent(new CustomEvent('ai-chat-prompt', { detail: { prompt: "Can you help me?", autoSend: false } }))}>
        <p className="text-[10px] text-[#8A8F98] font-medium tracking-wide">{TIPS[tipIndex]}</p>
      </div>
    </div>
  );
};

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
      case 'quant_risk':
        return <QuantRiskModule />;
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

        <main className="flex-1 w-full mx-auto p-4 md:p-8 max-w-none">
          {renderActiveModule()}
        </main>
      </div>
      
      {/* Floating Global AI Chatbot */}
      <TipWidget />
      <AiChatWidget />
    </div>
  );
};
