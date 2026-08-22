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
      <div className="flex items-center justify-between px-6 max-w-[1400px] mx-auto w-full h-16">
        {/* Brand & Market Categories */}
        <div className="flex items-center gap-6 h-full min-w-0">
          <button
            onClick={() => onNavigate('landing')}
            className="font-heading text-xl font-bold text-[var(--app-text)] flex items-center gap-2.5 focus:outline-none shrink-0"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--primary)] flex items-center justify-center text-white shrink-0">
              <Landmark className="w-5 h-5" />
            </div>
            <span>FinSight</span>
          </button>

          <nav className="hidden lg:flex h-full items-center gap-5 text-sm font-heading font-medium text-[var(--app-text-muted)] overflow-hidden">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`h-full flex items-center pt-0.5 hover:text-[var(--primary)] transition-colors whitespace-nowrap shrink-0 ${
                currentView === 'dashboard' ? 'text-[var(--primary)] border-b-2 border-[var(--primary)] font-bold' : ''
              }`}
            >
              Dashboard
            </button>
            {currentView === 'landing' && onStartModule && (
              <>
                <span className="text-[var(--app-border)] shrink-0">|</span>
                <button 
                  onClick={() => onStartModule('portfolio')} 
                  className="hover:text-[var(--primary)] hover:underline decoration-2 underline-offset-4 transition-all whitespace-nowrap shrink-0"
                >
                  Portfolio Blueprint
                </button>
                <button 
                  onClick={() => onStartModule('marketsim')} 
                  className="hover:text-[var(--primary)] hover:underline decoration-2 underline-offset-4 transition-all whitespace-nowrap shrink-0"
                >
                  Market Simulator
                </button>
                <button 
                  onClick={() => onStartModule('risk')} 
                  className="hover:text-[var(--primary)] hover:underline decoration-2 underline-offset-4 transition-all whitespace-nowrap shrink-0"
                >
                  Risk Profiling
                </button>
                <button 
                  onClick={() => onStartModule('hypedetector')} 
                  className="hover:text-[var(--primary)] hover:underline decoration-2 underline-offset-4 transition-all whitespace-nowrap shrink-0"
                >
                  Hype Detector
                </button>
              </>
            )}
          </nav>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-3 shrink-0 ml-4">
          {currentView !== 'landing' && (
            <div className="hidden xl:flex relative items-center shrink-0">
              <Search className="w-4 h-4 absolute left-3 text-[var(--app-text-muted)]" />
              <input
                type="text"
                placeholder="Search FinSight..."
                className="pl-9 pr-12 py-1.5 w-48 bg-[var(--app-surface-alt)] rounded-full border border-[var(--app-border)] focus:outline-none focus:border-[var(--primary)] text-xs font-body text-[var(--app-text)]"
              />
              <span className="absolute right-3 text-[10px] text-[var(--app-text-muted)] font-mono">Ctrl+K</span>
            </div>
          )}

          <div className="hidden md:flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 bg-[var(--app-surface-alt)] text-[var(--primary-dim)] rounded border border-[var(--app-border)] shrink-0 whitespace-nowrap">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
            <span>INR Base (₹)</span>
          </div>

          <button
            onClick={toggleDarkMode}
            className="p-1.5 rounded-lg text-[var(--app-text-muted)] hover:bg-[var(--app-surface-hover)] transition-colors focus:outline-none shrink-0"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--app-surface-alt)] border border-[var(--app-border)] text-xs font-heading font-medium text-[var(--app-text)] hover:bg-[var(--app-surface-hover)] shrink-0"
              >
                <div className="w-5 h-5 rounded-full bg-[var(--primary)] text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                  {user.name.charAt(0)}
                </div>
                <span className="hidden sm:inline whitespace-nowrap">{user.name}</span>
              </button>
              <button
                onClick={onLogout}
                className="text-xs font-heading font-semibold text-[var(--app-text-muted)] hover:text-[#ba1a1a] whitespace-nowrap shrink-0"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => onOpenAuth('login')}
                className="btn-secondary text-xs py-1.5 px-3 whitespace-nowrap"
              >
                Sign In
              </button>
              <button
                onClick={() => onOpenAuth('signup')}
                className="btn-primary text-xs py-1.5 px-4 whitespace-nowrap"
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
