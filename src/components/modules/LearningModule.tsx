import React from 'react';
import { 
  BookOpen, 
  Clock, 
  BarChart2, 
  ArrowRight,
  TrendingUp,
  PieChart,
  Calculator,
  Activity
} from 'lucide-react';

export const LearningModule: React.FC = () => {
  return (
    <div className="w-full max-w-[1280px] mx-auto p-6 md:p-8 space-y-8 animate-in fade-in duration-300">
      
      {/* Header Section */}
      <header className="max-w-3xl mb-8">
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-[var(--app-text)] leading-tight mb-4">
          Learn investing.<br/>Understand the market.
        </h1>
        <p className="text-lg text-[var(--app-text-muted)] max-w-2xl">
          Build your market knowledge by learning with real charts and interactive examples.
        </p>
      </header>

      {/* Progress & Continue Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-12">
        
        {/* Overall Progress (Spans 4) */}
        <div className="lg:col-span-4 bg-[var(--app-surface)] rounded-2xl p-6 border border-[var(--app-border)] relative overflow-hidden flex flex-col justify-between min-h-[160px] shadow-sm">
          <div>
            <h3 className="text-xs font-heading font-semibold text-[var(--app-text-muted)] mb-2 uppercase tracking-wider">
              Your Learning Progress
            </h3>
            <div className="text-xl font-heading font-bold text-[var(--app-text)]">
              12 of 30 concepts completed
            </div>
          </div>
          <div className="mt-8 relative">
            <div className="w-full h-1.5 bg-[var(--app-surface-hover)] rounded-full overflow-hidden">
              <div className="h-full bg-[var(--primary)] rounded-full transition-all duration-1000 ease-out" style={{ width: '40%' }}></div>
            </div>
          </div>
        </div>

        {/* Continue Learning Hero Card (Spans 8) */}
        <div className="lg:col-span-8 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl overflow-hidden relative group hover:border-[var(--primary)] transition-all duration-300 flex flex-col sm:flex-row shadow-sm">
          <div className="absolute bottom-0 left-0 w-full h-1 bg-[var(--app-surface-hover)] flex">
            <div className="h-full bg-[var(--primary)]" style={{ width: '65%' }}></div>
          </div>
          
          <div className="p-6 md:p-8 flex-1 flex flex-col justify-between z-10 bg-[var(--app-surface)]">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--primary-soft)] text-[var(--primary)] tracking-wide uppercase">
                  Technical Analysis
                </span>
              </div>
              <h2 className="text-2xl font-heading font-bold text-[var(--app-text)] mb-2">
                Support & Resistance
              </h2>
              <div className="flex items-center gap-4 text-sm text-[var(--app-text-muted)] font-medium">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> 8 min left
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart2 className="w-4 h-4" /> Intermediate
                </span>
              </div>
            </div>
            
            <div className="mt-6 sm:mt-8">
              <button className="bg-[var(--primary)] hover:bg-[var(--primary-dim)] text-white font-semibold text-sm px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 shadow-sm">
                Continue Learning
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="w-full sm:w-2/5 h-48 sm:h-auto bg-[var(--app-surface-alt)] relative overflow-hidden hidden sm:block border-l border-[var(--app-border)]">
            {/* Abstract chart graphic */}
            <div className="absolute inset-0 opacity-20 dark:opacity-10" style={{ backgroundImage: 'linear-gradient(var(--app-border) 1px, transparent 1px), linear-gradient(90deg, var(--app-border) 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
            <svg className="absolute inset-0 w-full h-full text-[var(--app-text-muted)] opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 80 Q 20 60, 40 70 T 80 40 T 100 30" fill="none" stroke="currentColor" strokeWidth="2"></path>
              <line stroke="var(--primary)" strokeDasharray="4" strokeWidth="2" x1="0" x2="100" y1="75" y2="75"></line>
              <line stroke="#ba1a1a" strokeDasharray="4" strokeWidth="2" x1="0" x2="100" y1="35" y2="35"></line>
            </svg>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <section>
        <h2 className="text-2xl font-heading font-bold text-[var(--app-text)] mb-6">Explore Topics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Technical Analysis Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider border-b border-[var(--app-border)] pb-2 mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Technical Analysis
            </h3>
            
            <a className="bg-[var(--app-surface)] p-5 rounded-2xl border border-[var(--app-border)] hover:border-[var(--primary)] transition-all duration-200 group cursor-pointer block relative shadow-sm hover:shadow-md" href="#">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--app-surface-hover)] flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary-soft)] transition-colors">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[var(--app-text-muted)] bg-[var(--app-surface-alt)] px-2 py-0.5 rounded uppercase">Beginner</span>
              </div>
              <h4 className="text-base font-heading font-bold text-[var(--app-text)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                Candlestick Patterns
              </h4>
              <p className="text-sm text-[var(--app-text-muted)] line-clamp-2 mb-4">
                Learn to read the emotional story of the market through Japanese candlesticks.
              </p>
              <div className="flex items-center justify-between text-xs font-medium text-[var(--app-text-muted)] mt-auto pt-3 border-t border-[var(--app-border)]">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 12 min</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--primary)] flex items-center gap-1 font-bold">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </div>

          {/* Fundamental Analysis Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider border-b border-[var(--app-border)] pb-2 mb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Fundamental Analysis
            </h3>
            
            <a className="bg-[var(--app-surface)] p-5 rounded-2xl border border-[var(--app-border)] hover:border-[var(--primary)] transition-all duration-200 group cursor-pointer block relative shadow-sm hover:shadow-md" href="#">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--app-surface-hover)] flex items-center justify-center text-[var(--primary)] group-hover:bg-[var(--primary-soft)] transition-colors">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[var(--app-text-muted)] bg-[var(--app-surface-alt)] px-2 py-0.5 rounded uppercase">Intermediate</span>
              </div>
              <h4 className="text-base font-heading font-bold text-[var(--app-text)] mb-1 group-hover:text-[var(--primary)] transition-colors">
                P/E Ratio Explained
              </h4>
              <p className="text-sm text-[var(--app-text-muted)] line-clamp-2 mb-4">
                Understand how to value a company based on its current earnings relative to price.
              </p>
              <div className="flex items-center justify-between text-xs font-medium text-[var(--app-text-muted)] mt-auto pt-3 border-t border-[var(--app-border)]">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 15 min</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--primary)] flex items-center gap-1 font-bold">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </div>

          {/* Portfolio & Risk Column */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider border-b border-[var(--app-border)] pb-2 mb-2 flex items-center gap-2">
              <PieChart className="w-4 h-4" />
              Portfolio Strategy
            </h3>
            
            <a className="bg-[var(--app-surface)] p-5 rounded-2xl border border-[var(--app-border)] hover:border-[var(--secondary)] transition-all duration-200 group cursor-pointer block relative shadow-sm hover:shadow-md" href="#">
              <div className="flex justify-between items-start mb-3">
                <div className="w-10 h-10 rounded-full bg-[var(--app-surface-hover)] flex items-center justify-center text-[var(--secondary)] group-hover:bg-[var(--secondary-soft)] transition-colors">
                  <PieChart className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold text-[var(--app-text-muted)] bg-[var(--app-surface-alt)] px-2 py-0.5 rounded uppercase">Advanced</span>
              </div>
              <h4 className="text-base font-heading font-bold text-[var(--app-text)] mb-1 group-hover:text-[var(--secondary)] transition-colors">
                Asset Allocation Theory
              </h4>
              <p className="text-sm text-[var(--app-text-muted)] line-clamp-2 mb-4">
                Why spreading your risk mathematically is the only free lunch in investing.
              </p>
              <div className="flex items-center justify-between text-xs font-medium text-[var(--app-text-muted)] mt-auto pt-3 border-t border-[var(--app-border)]">
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 22 min</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--secondary)] flex items-center gap-1 font-bold">
                  Start <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </a>
          </div>

        </div>
      </section>
      
    </div>
  );
};
