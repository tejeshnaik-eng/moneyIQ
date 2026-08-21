import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { AuthModal } from './components/auth/AuthModal';
import { mockUserProfile } from './mock/userData';
import { ModuleId, UserProfile } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [user, setUser] = useState<UserProfile | null>(mockUserProfile);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [pendingModule, setPendingModule] = useState<ModuleId>('overview');

  const handleStartFromLanding = (module: ModuleId = 'overview') => {
    setPendingModule(module);
    setCurrentView('dashboard');
  };

  const handleOpenAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    setAuthModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191c1e]">
      {currentView === 'landing' && (
        <Header
          user={user}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          currentView={currentView}
          onNavigate={(view) => setCurrentView(view)}
        />
      )}

      {currentView === 'landing' ? (
        <LandingPage onStart={handleStartFromLanding} />
      ) : (
        <DashboardShell
          user={user || mockUserProfile}
          initialModule={pendingModule}
        />
      )}

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
