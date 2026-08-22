import React, { useState } from 'react';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { AuthModal } from './components/auth/AuthModal';
import { ModuleId, UserProfile } from './types';
import { useAuth } from './context/AuthContext';

export const App: React.FC = () => {
  const { user, isLoggedIn, isLoading, logout } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [pendingModule, setPendingModule] = useState<ModuleId>('overview');

  const handleStartFromLanding = (module: ModuleId = 'overview') => {
    setPendingModule(module);
    if (!isLoggedIn) {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('landing');
    localStorage.removeItem('current_user_email');
  };

  const userProfile: UserProfile | null = user
    ? {
        name: user.name,
        email: user.email,
        age: 30,
        occupation: 'Professional',
        city: 'India',
        monthlyIncome: 0,
        riskCategory: 'Not Assessed',
        healthScore: 0,
        isGuest: false,
      }
    : null;

  if (user) {
    localStorage.setItem('current_user_email', user.email);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#20EFA0] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#A7B5AE]">Restoring session...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#080B0A] text-[#F2F7F4]">
      {/* 
        CRITICAL FIX: The old global Header has been entirely annihilated from App.tsx. 
        LandingPage handles its own nav pill. DashboardShell handles its own TopBar and Sidebar.
      */}
      
      {currentView === 'landing' ? (
        <LandingPage onStart={handleStartFromLanding} />
      ) : userProfile ? (
        <DashboardShell
          user={userProfile}
          initialModule={pendingModule}
          onLogout={handleLogout}
        />
      ) : null}

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={handleAuthSuccess}
        initialMode={authModalMode}
      />
    </div>
  );
};

export default App;
