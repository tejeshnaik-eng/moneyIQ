import React, { useState, useEffect } from 'react';
import { Landmark, Search, ShieldCheck, Moon, Sun } from 'lucide-react';
import { UserProfile, ModuleId } from '../../types';

interface HeaderProps {
  user: UserProfile | null;
  onOpenAuth: (mode: 'login' | 'signup') => void;
  onLogout: () => void;
  currentView: 'landing' | 'dashboard';
  onNavigate: (view: 'landing' | 'dashboard') => void;
  onStartModule?: (module: ModuleId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onOpenAuth,
  onLogout,
  currentView,
  onNavigate,
  onStartModule,
}) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial
    if (document.documentElement.classList.contains('dark')) {
      setIsDark(true);
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    }
  };
  return (
    <header className="bg-[var(--app-surface-alt)] border-b border-[var(--app-border)] sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 max-w-[1280px] mx-auto w-full h-16">
        {/* Brand & Market Categories */}
        <div className="flex items-center gap-8 h-full">
          <button
            onClick={() => onNavigate('landing')}
            className="font-heading text-xl font-bold text-[var(--app-text)] flex items-center gap-2.5 focus:outline-none"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white">
              <Landmark className="w-5 h-5" />
            </div>
            <span>FinSight</span>
          </button>

          <nav className="hidden md:flex h-full items-center gap-6 text-sm font-heading font-medium text-[var(--app-text-muted)]">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`h-full flex items-center pt-0.5 hover:text-[#0F9D65] transition-colors ${
                currentView === 'dashboard' ? 'text-[#0F9D65] border-b-2 border-[#0F9D65] font-bold' : ''
              }`}
            >
              Dashboard
            </button>
            {currentView === 'landing' && onStartModule && (
              <>
                <span className="text-[var(--app-border)]">|</span>
                <button 
                  onClick={() => onStartModule('portfolio')} 
                  className="hover:text-[#0F9D65] hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Portfolio Blueprint
                </button>
                <button 
                  onClick={() => onStartModule('marketsim')} 
                  className="hover:text-[#0F9D65] hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Market Simulator
                </button>
                <button 
                  onClick={() => onStartModule('risk')} 
                  className="hover:text-[#0F9D65] hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Risk Profiling
                </button>
                <button 
                  onClick={() => onStartModule('hypedetector')} 
                  className="hover:text-[#0F9D65] hover:underline decoration-2 underline-offset-4 transition-all"
                >
                  Hype Detector
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex relative items-center">
            <Search className="w-4 h-4 absolute left-3 text-[var(--app-text-muted)]" />
            <input
              type="text"
              placeholder="Search FinSight..."
              className="pl-9 pr-12 py-1.5 w-56 bg-[var(--app-surface-alt)] rounded-full border border-[var(--app-border)] focus:outline-none focus:border-[var(--primary)] text-xs font-body text-[var(--app-text)]"
            />
            <span className="absolute right-3 text-[10px] text-[var(--app-text-muted)] font-mono">Ctrl+K</span>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 bg-[var(--app-surface-alt)] text-[var(--primary-dim)] rounded border border-[var(--app-border)]">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>INR Base (₹)</span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg text-[var(--app-text-muted)] hover:bg-[var(--app-surface-hover)] transition-colors focus:outline-none"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--app-surface-alt)] border border-[var(--app-border)] text-xs font-heading font-medium text-[var(--app-text)] hover:bg-[var(--app-surface-hover)]"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline">{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="text-xs font-heading font-semibold text-[var(--app-text-muted)] hover:text-[#ba1a1a]"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-secondary text-xs py-1.5 px-3"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn-primary text-xs py-1.5 px-4"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
