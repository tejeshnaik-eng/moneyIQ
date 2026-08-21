import React, { useState } from 'react';
import { Header } from './components/common/Header';
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

  // Once auth state resolves, if a user is already logged in (cookie rehydration),
  // keep them on landing unless they navigate themselves.
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

  // Called by AuthModal after successful login/register
  const handleAuthSuccess = () => {
    setAuthModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await logout();
    setCurrentView('landing');
    localStorage.removeItem('current_user_email');
  };

  // Build a UserProfile from the JWT user object (for components that expect it)
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

  // Sync email to localStorage for getStorageKey() utility
  if (user) {
    localStorage.setItem('current_user_email', user.email);
  }

  // Show a minimal splash while we check the session cookie
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[#00b090] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-mono text-[#565e74]">Restoring session…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191c1e]">
      {currentView === 'landing' && (
        <Header
          user={userProfile}
          onOpenAuth={handleOpenAuth}
          onLogout={handleLogout}
          currentView={currentView}
          onNavigate={(view) => {
            if (view === 'dashboard' && !isLoggedIn) {
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
