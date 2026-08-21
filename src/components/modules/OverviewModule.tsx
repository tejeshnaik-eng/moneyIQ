import { getStorageKey } from '../../utils';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, CheckCircle2, AlertTriangle } from 'lucide-react';
import { ModuleId } from '../../types';

interface OverviewModuleProps {
  onNavigateModule: (module: ModuleId) => void;
}

// Lightweight counter hook
function useCounter(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(Math.round(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return val;
}

// Animated thin progress bar
function DimensionBar({ label, pct, delay }: { label: string; pct: number; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), delay);
    return () => clearTimeout(t);
  }, [pct, delay]);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between items-baseline">
        <span className="font-heading font-semibold text-[14px] text-[#1D1D1F]">{label}</span>
        <span className="text-[12px] text-[#6E6E73]">{pct}%</span>
      </div>
      <div className="w-full h-[3px] bg-[#E5E5EA] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#006D44] rounded-full transition-all duration-[1400ms] ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigateModule }) => {
  const [assets, setAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [leakage, setLeakage] = useState(0);
  const [hasProfile, setHasProfile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const holdingsData = localStorage.getItem(getStorageKey('finsight_portfolio_holdings'));
      if (holdingsData) {
        const holdings = JSON.parse(holdingsData);
        if (Array.isArray(holdings)) {
          setAssets(holdings.reduce((s, h) => s + (Number(h.currentValue) || 0), 0));
        }
      }
      const profileData = localStorage.getItem(getStorageKey('finsight_investor_profile'));
      if (profileData) {
        const profile = JSON.parse(profileData);
        setLiabilities(Number(profile.outstandingDebt) || 0);
        setHasProfile(true);
      }
      const spendData = localStorage.getItem(getStorageKey('finsight_spend_transactions'));
      if (spendData) {
        const txns = JSON.parse(spendData);
        if (Array.isArray(txns)) {
          setLeakage(txns.filter(t => t.category === 'Discretionary').reduce((s, t) => s + (Number(t.amount) || 0), 0));
        }
      }
    } catch (e) { console.error('Overview data error', e); }
  }, []);

  const hasData = hasProfile || assets > 0;
  const healthScore = hasData
    ? Math.min(100, Math.max(30, 70 + (assets > 0 ? 10 : 0) - (liabilities > 0 ? 5 : 0) - (leakage > 0 ? 5 : 0)))
    : 0;
  const healthBand = healthScore > 75 ? 'Excellent' : healthScore > 50 ? 'Fair' : hasData ? 'Needs Work' : 'No Data';
  const healthBandColor = healthScore > 75 ? '#006D44' : healthScore > 50 ? '#883700' : '#BA1A1A';

  const displayScore = useCounter(healthScore);

  const fmt = (v: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);

  // Dimension scores (simple derivations from real data)
  const assetScore   = assets > 0 ? 100 : 0;
  const debtScore    = liabilities === 0 ? 100 : Math.max(0, Math.round(100 - (liabilities / Math.max(assets, 1)) * 100));
  const spendScore   = leakage === 0 ? 100 : Math.max(0, 100 - Math.round((leakage / Math.max(assets / 12, 1)) * 100));
  const riskScore    = hasProfile ? 100 : 0;

  const moduleTiles = [
    {
      id: 'portfolio' as ModuleId,
      label: 'Portfolio',
      sub: 'Analyze your asset allocation.',
      bg: '#E8F0FB',
      color: '#004E9F',
    },
    {
      id: 'goals' as ModuleId,
      label: 'Goals',
      sub: 'Track your financial milestones.',
      bg: '#E8F5EE',
      color: '#006D44',
    },
    {
      id: 'marketsim' as ModuleId,
      label: 'Crash Simulation',
      sub: 'Stress test your current positions.',
      bg: '#FDECEA',
      color: '#BA1A1A',
    },
  ];

  return (
    <div className="w-full max-w-[1280px] mx-auto px-8 py-12 flex flex-col gap-14">

      {/* ── INTRO ── */}
      <header
        className="max-w-3xl flex flex-col gap-2.5"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(18px)', transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <h1 className="font-heading font-semibold text-[36px] leading-[1.1] tracking-tight text-[#1D1D1F]">
          Your financial health, at a glance.
        </h1>
        <p className="text-[16px] text-[#6E6E73] font-body flex items-center gap-2">
          <span className="w-[6px] h-[6px] rounded-full bg-[#006D44] inline-block animate-pulse" />
          Last synced just now. All figures are from your saved data.
        </p>
      </header>

      {/* ── HERO SCORE SECTION ── */}
      <section
        className="bg-[#FFFFFF] rounded-xl p-9 flex flex-col lg:flex-row gap-12 border border-[#E5E5EA]"
        style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02), 0 12px 32px rgba(0,0,0,0.04)', opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(18px)', transition: 'opacity 0.7s 0.1s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.1s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {/* Score pillar */}
        <div className="flex flex-col lg:w-1/3 shrink-0 gap-4">
          <span className="text-[12px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest">Financial Health</span>
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading font-bold text-[72px] leading-none tracking-tighter text-[#1D1D1F]">
              {displayScore}
            </span>
            <span className="font-heading text-[28px] text-[#6E6E73] font-normal">/100</span>
          </div>
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full w-max border text-[12px] font-heading font-semibold"
            style={{ backgroundColor: `${healthBandColor}15`, borderColor: `${healthBandColor}30`, color: healthBandColor }}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            {healthBand}
          </div>
          {!hasData && (
            <p className="text-[13px] text-[#6E6E73] leading-relaxed mt-2 max-w-xs">
              Add your portfolio holdings and risk profile to calculate your real financial health score.
            </p>
          )}
        </div>

        {/* Dimension bars */}
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-6 content-center">
          <DimensionBar label="Assets"      pct={assetScore} delay={200} />
          <DimensionBar label="Debt Control" pct={debtScore}  delay={350} />
          <DimensionBar label="Spend Control" pct={spendScore} delay={500} />
          <DimensionBar label="Risk Profile"  pct={riskScore}  delay={650} />
        </div>
      </section>

      {/* ── BALANCE SHEET ── */}
      <section
        className="flex flex-col gap-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(18px)', transition: 'opacity 0.7s 0.2s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.2s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <h3 className="text-[12px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest px-0.5">Balance Sheet</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Total Assets', value: fmt(assets) },
            { label: 'Liabilities',  value: fmt(liabilities) },
            { label: 'Discretionary Leakage', value: assets === 0 && liabilities === 0 && leakage === 0 ? '₹0 / mo' : `${fmt(leakage)} / mo` },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="bg-[#FFFFFF] rounded-xl p-6 flex flex-col gap-1.5 border border-[#E5E5EA] transition-shadow duration-300"
              style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.03)')}
            >
              <span className="text-[15px] text-[#6E6E73] font-body">{label}</span>
              <span className="font-heading font-semibold text-[32px] leading-tight tracking-tight text-[#1D1D1F] mt-1">{value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── RECOMMENDED NEXT STEPS ── */}
      <section
        className="flex flex-col gap-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(18px)', transition: 'opacity 0.7s 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.3s cubic-bezier(0.16,1,0.3,1)' }}
      >
        <h3 className="text-[12px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest px-0.5">Recommended next steps</h3>
        <div className="flex flex-col gap-3">
          {/* Portfolio step */}
          <button
            onClick={() => onNavigateModule('portfolio')}
            className="bg-[#FFFFFF] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#E5E5EA] hover:bg-[#FAFAFC] transition-colors duration-200 group text-left"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#004E9F]/10 flex items-center justify-center shrink-0">
                {assets > 0
                  ? <CheckCircle2 className="w-5 h-5 text-[#006D44]" />
                  : <AlertTriangle className="w-5 h-5 text-[#BA1A1A]" />
                }
              </div>
              <div>
                <div className="font-heading font-semibold text-[16px] text-[#1D1D1F]">
                  {assets > 0 ? 'Portfolio setup complete' : 'Add your holdings'}
                </div>
                <div className="text-[14px] text-[#6E6E73] font-body mt-0.5">
                  {assets > 0 ? 'Your portfolio and risk profile are complete.' : 'Record your investments to unlock portfolio analysis.'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[14px] font-heading font-semibold text-[#004E9F] group-hover:translate-x-1 transition-transform duration-200 shrink-0">
              {assets > 0 ? 'View portfolio' : 'Add holdings'}
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Spend step */}
          <button
            onClick={() => onNavigateModule('spend')}
            className="bg-[#FFFFFF] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#E5E5EA] hover:bg-[#FAFAFC] transition-colors duration-200 group text-left"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#006D44]/10 flex items-center justify-center shrink-0">
                {leakage > 0
                  ? <AlertTriangle className="w-5 h-5 text-[#883700]" />
                  : <CheckCircle2 className="w-5 h-5 text-[#006D44]" />
                }
              </div>
              <div>
                <div className="font-heading font-semibold text-[16px] text-[#1D1D1F]">
                  {leakage > 0 ? `Review ${fmt(leakage)} discretionary spend` : 'Spending'}
                </div>
                <div className="text-[14px] text-[#6E6E73] font-body mt-0.5">
                  {leakage > 0 ? 'Consider reallocating towards your financial goals.' : 'No significant discretionary leakage detected.'}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[14px] font-heading font-semibold text-[#004E9F] group-hover:translate-x-1 transition-transform duration-200 shrink-0">
              {leakage > 0 ? 'Review spending' : 'View transactions'}
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>

          {/* Goals step */}
          <button
            onClick={() => onNavigateModule('goals')}
            className="bg-[#FFFFFF] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#E5E5EA] hover:bg-[#FAFAFC] transition-colors duration-200 group text-left"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.03)' }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#883700]/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-[#883700]" />
              </div>
              <div>
                <div className="font-heading font-semibold text-[16px] text-[#1D1D1F]">Goals</div>
                <div className="text-[14px] text-[#6E6E73] font-body mt-0.5">Track your emergency fund, home, and financial independence milestones.</div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-[14px] font-heading font-semibold text-[#004E9F] group-hover:translate-x-1 transition-transform duration-200 shrink-0">
              View goals <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>
      </section>

      {/* ── FEATURE TILES ── */}
      <section
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        style={{ opacity: mounted ? 1 : 0, transform: mounted ? 'none' : 'translateY(18px)', transition: 'opacity 0.7s 0.4s cubic-bezier(0.16,1,0.3,1), transform 0.7s 0.4s cubic-bezier(0.16,1,0.3,1)' }}
      >
        {moduleTiles.map(({ id, label, sub, bg, color }) => (
          <button
            key={id}
            onClick={() => onNavigateModule(id)}
            className="relative overflow-hidden rounded-[20px] p-7 flex flex-col h-[220px] text-left transition-all duration-500 group border border-[#E5E5EA] hover:-translate-y-1"
            style={{ backgroundColor: bg, boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 20px 40px rgba(0,0,0,0.07)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)')}
          >
            {/* Background SVG chart decoration */}
            <svg
              className="absolute inset-0 w-full h-full opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-500 pointer-events-none"
              viewBox="0 0 300 200"
              preserveAspectRatio="none"
            >
              <polyline
                points="0,160 30,140 60,150 90,100 120,120 150,80 180,90 210,60 240,70 270,40 300,50"
                fill="none"
                stroke={color}
                strokeWidth="3"
              />
              <polyline
                points="0,180 30,170 60,175 90,140 120,155 150,120 180,130 210,100 240,110 270,80 300,90"
                fill="none"
                stroke={color}
                strokeWidth="2"
              />
            </svg>

            <div className="relative z-10 mt-auto flex flex-col gap-1.5">
              <span
                className="font-heading font-semibold text-[28px] tracking-tight text-[#1D1D1F] group-hover:text-current transition-colors duration-300"
                style={{ '--tw-text-opacity': 1 } as React.CSSProperties}
              >
                {label}
              </span>
              <span className="text-[15px] text-[#6E6E73] font-body">{sub}</span>
            </div>
          </button>
        ))}
      </section>

    </div>
  );
};
