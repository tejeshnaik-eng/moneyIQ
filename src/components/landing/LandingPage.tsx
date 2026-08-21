import React, { useState } from 'react';
import { 
  ArrowRight, 
  Shield, 
  PieChart, 
  Flag, 
  Receipt, 
  Activity, 
  GitFork, 
  Flame, 
  Landmark,
  Calculator,
  ChevronRight
} from 'lucide-react';
import { ModuleId } from '../../types';

interface LandingPageProps {
  onStart: (module?: ModuleId) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  const [sipAmount, setSipAmount] = useState(15000);
  const [tenureYears, setTenureYears] = useState(10);
  const cagr = 0.125;

  const totalInvested = sipAmount * 12 * tenureYears;
  const monthlyRate = cagr / 12;
  const totalMonths = tenureYears * 12;
  const futureValue = Math.round(
    sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );
  const estimatedWealthGain = futureValue - totalInvested;

  const frameworkModules: Array<{
    id: ModuleId;
    title: string;
    description: string;
    icon: React.ReactNode;
    tag: string;
  }> = [
    {
      id: 'risk',
      title: 'Risk Profiling',
      description: 'Quantify emotional and financial drawdown tolerance with institutional precision.',
      icon: <Shield className="w-5 h-5 text-[#00b090]" />,
      tag: '5-Pillar Score',
    },
    {
      id: 'portfolio',
      title: 'Portfolio Blueprint',
      description: 'Consolidate Zerodha, Groww, and EPFO accounts with automatic fund overlap audits.',
      icon: <PieChart className="w-5 h-5 text-[#00b090]" />,
      tag: '41% Overlap Detector',
    },
    {
      id: 'goals',
      title: 'Goal Planning Ledger',
      description: 'Track milestones with immutable data-driven inflation math and SIP allocation markers.',
      icon: <Flag className="w-5 h-5 text-[#00b090]" />,
      tag: 'Shortfall Tracker',
    },
    {
      id: 'spend',
      title: 'Spend Analysis',
      description: 'Convert unnoticed recurring micro-expenses and lifestyle creep directly into compounding index SIPs.',
      icon: <Receipt className="w-5 h-5 text-[#00b090]" />,
      tag: 'Leakage-to-SIP',
    },
    {
      id: 'marketsim',
      title: 'Market Simulator',
      description: 'Experience historical Indian market crashes (Covid 2020, 2008 GFC) with zero capital risk.',
      icon: <Activity className="w-5 h-5 text-[#00b090]" />,
      tag: 'Crisis Replay',
    },
    {
      id: 'decisionsim',
      title: 'Decision Simulator',
      description: 'Model high-stakes trade-offs: Buying a ₹12L Car on EMI vs Cab + Index SIP or Prepaying Home Loans.',
      icon: <GitFork className="w-5 h-5 text-[#00b090]" />,
      tag: 'Opportunity Cost',
    },
    {
      id: 'hypedetector',
      title: 'Hype Detector',
      description: 'Verify viral social media claims and Telegram tips against official SEBI empirical datasets.',
      icon: <Flame className="w-5 h-5 text-[#00b090]" />,
      tag: 'SEBI Fact-Checker',
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#191c1e] flex flex-col font-body">
      <main className="max-w-[1280px] mx-auto px-6 py-12 space-y-16 flex-1 w-full">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-4">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00b090]/10 text-[#006b57] text-xs font-heading font-semibold border border-[#00b090]/20">
              <span>Next-Gen Indian Investor Architecture</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl font-extrabold tracking-tight text-[#191c1e] leading-[1.15]">
              Investing is not a gamble. <br />
              <span className="text-[#00b090]">It is a ledger.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#565e74] max-w-xl leading-relaxed">
              Move away from hype-driven trading and noisy finfluencer feeds. FinSight brings institutional-grade clarity to your portfolio with structured data, precision tracking, and architectural wealth planning.
            </p>

            <div className="pt-2 flex flex-wrap gap-4">
              <button
                onClick={() => onStart('overview')}
                className="btn-primary text-sm py-3 px-6 shadow-sm"
              >
                <span>Start Ledgering</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onStart('marketsim')}
                className="btn-secondary text-sm py-3 px-6"
              >
                <span>Launch Crisis Sandbox</span>
              </button>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden bg-white border border-[#E2E8F0] p-8 shadow-sm flex flex-col justify-between min-h-[380px]">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#00b090]"></div>
                <span className="text-xs font-heading font-bold uppercase tracking-wider text-[#565e74]">
                  Institutional Framework Model
                </span>
              </div>
              <span className="text-xs font-mono text-[#006b57] bg-[#f2f4f6] px-2.5 py-1 rounded">
                Verified 12.5% CAGR Nifty Benchmark
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 py-6">
              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                <span className="text-xs text-[#565e74] block font-heading">Disciplined Compounding</span>
                <span className="text-2xl font-heading font-bold text-[#006b57] mt-1 block">94.2%</span>
                <span className="text-[11px] text-[#565e74] mt-1 block">10-year positive rolling returns</span>
              </div>
              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                <span className="text-xs text-[#565e74] block font-heading">Retail Speculation Reality</span>
                <span className="text-2xl font-heading font-bold text-[#ba1a1a] mt-1 block">93.0%</span>
                <span className="text-[11px] text-[#565e74] mt-1 block">F&O traders lose capital (SEBI Study)</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#006b57]/5 border border-[#00b090]/30 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Landmark className="w-5 h-5 text-[#006b57]" />
                <span className="text-xs font-heading font-semibold text-[#191c1e]">
                  Ready to consolidate your financial truth?
                </span>
              </div>
              <button
                onClick={() => onStart('overview')}
                className="text-xs font-heading font-bold text-[#006b57] hover:underline flex items-center gap-1"
              >
                <span>Enter Portal</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </section>

        {/* Framework Bento Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-[#E2E8F0] pb-4">
            <div>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#191c1e]">
                The FinSight Framework
              </h2>
              <p className="text-sm text-[#565e74] mt-1">
                Seven dedicated intelligence modules engineered to architect your wealth.
              </p>
            </div>
            <span className="text-xs font-mono text-[#006b57] font-semibold">
              7 Active Modules
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {frameworkModules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => onStart(mod.id)}
                className="ledger-card p-6 flex flex-col justify-between hover:border-[#00b090] hover:shadow-md transition-all cursor-pointer group bg-white"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] flex items-center justify-center group-hover:bg-[#00b090]/10 transition-colors">
                      {mod.icon}
                    </div>
                    <span className="text-[11px] font-heading font-bold px-2 py-0.5 rounded bg-[#f2f4f6] text-[#565e74]">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-[#191c1e] group-hover:text-[#006b57] transition-colors">
                    {mod.title}
                  </h3>

                  <p className="text-xs text-[#565e74] leading-relaxed">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs font-heading font-semibold text-[#006b57]">
                  <span>Launch Module</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Live Reality-Check Compounding Calculator */}
        <section className="p-8 rounded-2xl bg-white border border-[#E2E8F0] space-y-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#00b090]/10 text-[#006b57] flex items-center justify-center">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-xl font-bold text-[#191c1e]">
                Interactive SIP Compounding Reality-Check
              </h3>
              <p className="text-xs text-[#565e74]">
                See what systematic allocation into a diversified index fund accomplishes without speculative churn.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-xs font-heading font-bold text-[#191c1e] mb-2">
                  <span>Monthly Investment (SIP)</span>
                  <span className="text-[#006b57] font-mono text-sm">₹{sipAmount.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="2000"
                  max="100000"
                  step="1000"
                  value={sipAmount}
                  onChange={(e) => setSipAmount(Number(e.target.value))}
                  className="w-full accent-[#00b090] bg-[#e6e8ea] h-2 rounded cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-heading font-bold text-[#191c1e] mb-2">
                  <span>Investment Horizon</span>
                  <span className="text-[#006b57] font-mono text-sm">{tenureYears} Years</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  step="1"
                  value={tenureYears}
                  onChange={(e) => setTenureYears(Number(e.target.value))}
                  className="w-full accent-[#00b090] bg-[#e6e8ea] h-2 rounded cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 p-5 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
              <div>
                <span className="text-[11px] font-heading font-semibold text-[#565e74] block">Principal Invested</span>
                <span className="text-base font-heading font-bold text-[#191c1e] font-mono mt-1 block">
                  ₹{(totalInvested / 100000).toFixed(2)} L
                </span>
              </div>
              <div>
                <span className="text-[11px] font-heading font-semibold text-[#565e74] block">Est. Wealth Gain</span>
                <span className="text-base font-heading font-bold text-[#00b090] font-mono mt-1 block">
                  +₹{(estimatedWealthGain / 100000).toFixed(2)} L
                </span>
              </div>
              <div>
                <span className="text-[11px] font-heading font-semibold text-[#565e74] block">Total Future Corpus</span>
                <span className="text-base font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                  ₹{(futureValue / 100000).toFixed(2)} L
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Institutional Footer */}
      <footer className="bg-white border-t border-[#E2E8F0] py-12 mt-12">
        <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#00b090] text-white flex items-center justify-center">
                <Landmark className="w-4 h-4" />
              </div>
              <span className="font-heading font-bold text-lg text-[#191c1e]">FinSight</span>
            </div>
            <p className="text-xs text-[#565e74] leading-relaxed">
              Institutional personal finance intelligence for Indian first-time investors and young professionals.
            </p>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#191c1e] mb-3">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-[#565e74]">
              <li><button onClick={() => onStart('risk')} className="hover:text-[#006b57]">Risk Profiling</button></li>
              <li><button onClick={() => onStart('portfolio')} className="hover:text-[#006b57]">Portfolio Blueprint</button></li>
              <li><button onClick={() => onStart('goals')} className="hover:text-[#006b57]">Goal Planning</button></li>
              <li><button onClick={() => onStart('spend')} className="hover:text-[#006b57]">Spend Analysis</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#191c1e] mb-3">
              Simulators & Tools
            </h4>
            <ul className="space-y-1.5 text-xs text-[#565e74]">
              <li><button onClick={() => onStart('marketsim')} className="hover:text-[#006b57]">Market Simulator</button></li>
              <li><button onClick={() => onStart('decisionsim')} className="hover:text-[#006b57]">Decision Engine</button></li>
              <li><button onClick={() => onStart('hypedetector')} className="hover:text-[#006b57]">Hype-to-Data Detector</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-[#191c1e] mb-3">
              Institutional Compliance
            </h4>
            <p className="text-xs text-[#565e74] leading-relaxed">
              Educational simulation engine aligned with SEBI investor awareness guidelines and RBI monetary frameworks.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};
