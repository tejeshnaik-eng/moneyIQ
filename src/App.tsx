import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { LandingPage } from './components/landing/LandingPage';
import { DashboardShell } from './components/dashboard/DashboardShell';
import { AuthModal } from './components/auth/AuthModal';
import { ModuleId, UserProfile } from './types';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'dashboard'>('landing');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [pendingModule, setPendingModule] = useState<ModuleId>('overview');

  const handleStartFromLanding = (module: ModuleId = 'overview') => {
    setPendingModule(module);
    if (!user) {
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

  const handleAuthSuccess = (authenticatedUser: UserProfile) => {
    setUser(authenticatedUser);
    localStorage.setItem('current_user_email', authenticatedUser.email);
    setAuthModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('current_user_email');
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
          onNavigate={(view) => {
            if (view === 'dashboard' && !user) {
              setAuthModalMode('signup');
              setAuthModalOpen(true);
            } else {
              setCurrentView(view);
            }
          }}
        />
      )}

      {currentView === 'landing' ? (
        <LandingPage onStart={handleStartFromLanding} />
      ) : user ? (
        <DashboardShell
          user={user}
          initialModule={pendingModule}
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
