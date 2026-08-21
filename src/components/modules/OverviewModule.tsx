import { getStorageKey } from '../../utils';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { ModuleId } from '../../types';

interface OverviewModuleProps {
  onNavigateModule: (module: ModuleId) => void;
}

function useCounter(target: number, duration = 1600) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(eased * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return val;
}

function ThinBar({ pct, delay, color = '#006D44' }: { pct: number; delay: number; color?: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div className="w-full h-[3px] bg-[#E5E5EA] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all duration-[1400ms] ease-out" style={{ width: `${w}%`, backgroundColor: color }} />
    </div>
  );
}

export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigateModule }) => {
  const [assets, setAssets] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [leakage, setLeakage] = useState(0);
  const [hasProfile, setHasProfile] = useState(false);
  const [goals, setGoals] = useState<any[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [mounted, setMounted] = useState(false);
  const [txns, setTxns] = useState<any[]>([]);

  useEffect(() => {
    setMounted(true);
    try {
      const hd = localStorage.getItem(getStorageKey('finsight_portfolio_holdings'));
      if (hd) {
        const h = JSON.parse(hd);
        if (Array.isArray(h)) { setHoldings(h); setAssets(h.reduce((s, x) => s + (Number(x.currentValue) || 0), 0)); }
      }
      const pd = localStorage.getItem(getStorageKey('finsight_investor_profile'));
      if (pd) { const p = JSON.parse(pd); setLiabilities(Number(p.outstandingDebt) || 0); setHasProfile(true); }
      const sd = localStorage.getItem(getStorageKey('finsight_spend_transactions'));
      if (sd) {
        const t = JSON.parse(sd);
        if (Array.isArray(t)) {
          setTxns(t);
          setLeakage(t.filter(x => x.category === 'Discretionary').reduce((s, x) => s + (Number(x.amount) || 0), 0));
        }
      }
      const gd = localStorage.getItem(getStorageKey('finsight_goals'));
      if (gd) { const g = JSON.parse(gd); if (Array.isArray(g)) setGoals(g); }
    } catch (e) { console.error(e); }
  }, []);

  const hasData = hasProfile || assets > 0;
  const healthScore = hasData ? Math.min(100, Math.max(30, 70 + (assets > 0 ? 10 : 0) - (liabilities > 0 ? 5 : 0) - (leakage > 0 ? 5 : 0))) : 0;
  const healthBand = healthScore > 75 ? 'Excellent' : healthScore > 50 ? 'Fair' : hasData ? 'Needs Work' : 'No Data';
  const healthColor = healthScore > 75 ? '#006D44' : healthScore > 50 ? '#883700' : '#BA1A1A';

  const assetScore = assets > 0 ? 100 : 0;
  const debtScore  = liabilities === 0 ? 100 : Math.max(0, Math.round(100 - (liabilities / Math.max(assets, 1)) * 100));
  const spendScore = leakage === 0 ? 100 : Math.max(0, 100 - Math.round((leakage / Math.max(assets / 12, 1)) * 100));
  const riskScore  = hasProfile ? 100 : 0;
  const netWorth   = assets - liabilities;

  const displayScore = useCounter(healthScore);

  const fmt = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  const fmtK = (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : fmt(v);

  // Spend breakdown
  const needs = txns.filter(x => x.category === 'Needs').reduce((s, x) => s + Number(x.amount || 0), 0);
  const goalsSpend = txns.filter(x => x.category === 'Goals').reduce((s, x) => s + Number(x.amount || 0), 0);
  const totalSpend = needs + goalsSpend + leakage;

  // Top holding
  const topHolding = holdings.sort((a, b) => (Number(b.currentValue) || 0) - (Number(a.currentValue) || 0))[0];

  // Category breakdown for portfolio
  const categories = holdings.reduce((acc: Record<string, number>, h) => {
    const cat = h.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (Number(h.currentValue) || 0);
    return acc;
  }, {});
  const topCategories = Object.entries(categories).sort(([,a],[,b]) => b - a).slice(0, 3);

  return (
    // This outer div must NOT scroll — it fills the main area
    <div className="h-full flex flex-col gap-4 overflow-hidden">

      {/* ── ROW 0: INTRO BAR ── */}
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="font-heading font-semibold text-[22px] leading-tight tracking-tight text-[#1D1D1F]">
            Your financial health, at a glance.
          </h1>
          <p className="text-[12px] text-[#6E6E73] flex items-center gap-1.5 mt-0.5">
            <span className="w-[5px] h-[5px] rounded-full bg-[#006D44] inline-block animate-pulse" />
            All figures sourced from your saved data · Last synced just now
          </p>
        </div>
        <div className="flex items-center gap-2 text-[12px] text-[#6E6E73] shrink-0">
          <span className="bg-[#F5F5F7] border border-[#E5E5EA] px-3 py-1 rounded-full font-heading font-semibold">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ── MAIN GRID (fills remaining height) ── */}
      <div className="flex-1 grid grid-cols-12 grid-rows-2 gap-4 min-h-0">

        {/* ── COL 1-4 ROW 1: HEALTH SCORE ── */}
        <div className="col-span-4 row-span-1 bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] p-5 flex flex-col justify-between"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02), 0 4px 16px rgba(0,0,0,0.03)' }}>
          <div className="flex items-start justify-between mb-2">
            <span className="text-[10px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest">Financial Health</span>
            <span className="text-[11px] font-heading font-semibold px-2 py-0.5 rounded-full border"
              style={{ color: healthColor, backgroundColor: `${healthColor}12`, borderColor: `${healthColor}30` }}>
              {healthBand}
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-heading font-bold text-[56px] leading-none tracking-tighter text-[#1D1D1F]">{displayScore}</span>
            <span className="font-heading text-[20px] text-[#6E6E73] font-normal">/100</span>
          </div>
          <div className="flex flex-col gap-2.5 mt-3">
            {[
              { label: 'Assets',       pct: assetScore,  delay: 150  },
              { label: 'Debt Control', pct: debtScore,   delay: 250  },
              { label: 'Spend',        pct: spendScore,  delay: 350  },
              { label: 'Risk Profile', pct: riskScore,   delay: 450, color: '#7E57C2' as string },
            ].map(({ label, pct, delay, color }) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[11px] font-heading font-semibold text-[#1D1D1F]">{label}</span>
                  <span className="text-[11px] text-[#6E6E73]">{pct}%</span>
                </div>
                <ThinBar pct={pct} delay={delay} color={color} />
              </div>
            ))}
          </div>
        </div>

        {/* ── COL 5-8 ROW 1: BALANCE SHEET + DEMOGRAPHICS ── */}
        <div className="col-span-5 row-span-1 grid grid-cols-2 grid-rows-2 gap-3">

          {/* Net Worth */}
          <div className="col-span-2 bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] px-4 py-3 flex items-center justify-between"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <div>
              <div className="text-[10px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest mb-0.5">Net Worth</div>
              <div className="font-heading font-bold text-[28px] leading-none tracking-tight text-[#1D1D1F]">{fmtK(netWorth)}</div>
            </div>
            <div className="grid grid-cols-3 divide-x divide-[#E5E5EA]">
              {[
                { label: 'Assets',      value: fmtK(assets),      color: '#1D1D1F' },
                { label: 'Liabilities', value: fmtK(liabilities), color: liabilities > 0 ? '#BA1A1A' : '#6E6E73' },
                { label: 'Leakage/mo', value: fmtK(leakage),    color: leakage > 0 ? '#883700' : '#6E6E73' },
              ].map(({ label, value, color }) => (
                <div key={label} className="px-4 flex flex-col">
                  <span className="text-[10px] text-[#6E6E73] font-heading font-semibold uppercase tracking-wider">{label}</span>
                  <span className="font-heading font-bold text-[16px] tracking-tight mt-0.5" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Spend breakdown */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] px-4 py-3 flex flex-col justify-between"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <div className="text-[10px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest mb-2">Spend Breakdown</div>
            {totalSpend === 0 ? (
              <span className="text-[12px] text-[#6E6E73]">No transactions yet</span>
            ) : (
              <div className="flex flex-col gap-1.5">
                {[
                  { label: 'Needs',        val: needs,      pct: Math.round((needs / totalSpend) * 100),       color: '#004E9F' },
                  { label: 'Goals',        val: goalsSpend, pct: Math.round((goalsSpend / totalSpend) * 100), color: '#006D44' },
                  { label: 'Discretionary', val: leakage,  pct: Math.round((leakage / totalSpend) * 100),   color: '#883700' },
                ].map(({ label, val, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[11px] font-heading font-semibold text-[#1D1D1F]">{label}</span>
                      <span className="text-[11px] text-[#6E6E73]">{pct}% · {fmtK(val)}</span>
                    </div>
                    <ThinBar pct={pct} delay={500} color={color} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Goals summary */}
          <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] px-4 py-3 flex flex-col justify-between"
            style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
            <div className="text-[10px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest mb-2">Active Goals</div>
            {goals.length === 0 ? (
              <div>
                <span className="text-[12px] text-[#6E6E73]">No goals set yet</span>
                <button onClick={() => onNavigateModule('goals')} className="mt-2 text-[11px] text-[#004E9F] font-heading font-semibold hover:underline block">
                  Set your first goal →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {goals.slice(0, 2).map((g: any, i) => {
                  const pct = Math.min(100, Math.round(((Number(g.currentAmount) || 0) / Math.max(Number(g.targetAmount) || 1, 1)) * 100));
                  return (
                    <div key={i}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[11px] font-heading font-semibold text-[#1D1D1F] truncate max-w-[120px]">{g.name || g.goalName}</span>
                        <span className="text-[11px] text-[#6E6E73]">{pct}%</span>
                      </div>
                      <ThinBar pct={pct} delay={400} color="#7E57C2" />
                    </div>
                  );
                })}
                {goals.length > 2 && <span className="text-[10px] text-[#6E6E73] mt-0.5">+{goals.length - 2} more</span>}
              </div>
            )}
          </div>
        </div>

        {/* ── COL 9-12 ROW 1: RECOMMENDED STEPS ── */}
        <div className="col-span-3 row-span-1 bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] p-4 flex flex-col gap-2"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div className="text-[10px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest mb-1">Next Steps</div>
          {[
            {
              id: 'portfolio' as ModuleId,
              ok: assets > 0,
              title: assets > 0 ? 'Portfolio set up' : 'Add holdings',
              sub: assets > 0 ? `${holdings.length} asset${holdings.length !== 1 ? 's' : ''} · ${fmtK(assets)}` : 'No assets recorded',
            },
            {
              id: 'risk' as ModuleId,
              ok: hasProfile,
              title: hasProfile ? 'Risk profile done' : 'Complete risk profile',
              sub: hasProfile ? 'Profile assessed' : 'Needed for full analysis',
            },
            {
              id: 'spend' as ModuleId,
              ok: leakage === 0,
              title: leakage > 0 ? `${fmtK(leakage)} discretionary leak` : 'Spend looks clean',
              sub: leakage > 0 ? 'Review and reallocate' : txns.length > 0 ? `${txns.length} transactions` : 'No transactions yet',
            },
            {
              id: 'goals' as ModuleId,
              ok: goals.length > 0,
              title: goals.length > 0 ? `${goals.length} goal${goals.length !== 1 ? 's' : ''} active` : 'Set your goals',
              sub: goals.length > 0 ? 'Tracking milestones' : 'No goals configured',
            },
          ].map(({ id, ok, title, sub }) => (
            <button
              key={id}
              onClick={() => onNavigateModule(id)}
              className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#F5F5F7] transition-colors text-left group w-full border border-[#E5E5EA]"
            >
              <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${ok ? 'bg-[#006D44]/10' : 'bg-[#BA1A1A]/10'}`}>
                {ok
                  ? <CheckCircle2 className="w-3.5 h-3.5 text-[#006D44]" />
                  : <AlertTriangle className="w-3.5 h-3.5 text-[#BA1A1A]" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-semibold text-[12px] text-[#1D1D1F] truncate">{title}</div>
                <div className="text-[10px] text-[#6E6E73] truncate">{sub}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-[#6E6E73] group-hover:text-[#004E9F] group-hover:translate-x-0.5 transition-all shrink-0" />
            </button>
          ))}
        </div>

        {/* ── COL 1-4 ROW 2: PORTFOLIO BREAKDOWN ── */}
        <div className="col-span-4 row-span-1 bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] p-4 flex flex-col"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div className="text-[10px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest mb-3">Portfolio Breakdown</div>
          {holdings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <span className="text-[13px] text-[#6E6E73] text-center">No holdings recorded yet.</span>
              <button onClick={() => onNavigateModule('portfolio')} className="text-[12px] text-[#004E9F] font-heading font-semibold hover:underline">
                Add your first holding →
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              {/* Category bars */}
              <div className="flex flex-col gap-2.5">
                {topCategories.map(([cat, val], i) => {
                  const pct = Math.round((val / Math.max(assets, 1)) * 100);
                  const colors = ['#004E9F', '#006D44', '#7E57C2'];
                  return (
                    <div key={cat}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-heading font-semibold text-[#1D1D1F]">{cat}</span>
                        <span className="text-[11px] text-[#6E6E73]">{pct}% · {fmtK(val)}</span>
                      </div>
                      <ThinBar pct={pct} delay={300 + i * 100} color={colors[i]} />
                    </div>
                  );
                })}
              </div>

              {/* Top holding */}
              {topHolding && (
                <div className="mt-3 pt-3 border-t border-[#E5E5EA] flex items-center justify-between">
                  <div>
                    <div className="text-[10px] text-[#6E6E73] font-heading font-semibold uppercase tracking-wider">Top Holding</div>
                    <div className="text-[13px] font-heading font-semibold text-[#1D1D1F]">{topHolding.ticker || topHolding.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-heading font-bold text-[#1D1D1F]">{fmtK(Number(topHolding.currentValue))}</div>
                    {topHolding.currentValue > topHolding.investedValue ? (
                      <div className="flex items-center gap-0.5 text-[11px] text-[#006D44] justify-end">
                        <TrendingUp className="w-3 h-3" />
                        +{Math.round(((topHolding.currentValue - topHolding.investedValue) / topHolding.investedValue) * 100)}%
                      </div>
                    ) : topHolding.currentValue < topHolding.investedValue ? (
                      <div className="flex items-center gap-0.5 text-[11px] text-[#BA1A1A] justify-end">
                        <TrendingDown className="w-3 h-3" />
                        {Math.round(((topHolding.currentValue - topHolding.investedValue) / topHolding.investedValue) * 100)}%
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── COL 5-9 ROW 2: FEATURE TILES ── */}
        <div className="col-span-5 row-span-1 grid grid-cols-3 gap-3">
          {[
            { id: 'portfolio' as ModuleId, label: 'Portfolio',         sub: 'Asset allocation',        bg: '#EBF1FB', color: '#004E9F',
              svg: <polyline points="0,60 25,45 50,50 75,30 100,35 125,20 150,28 175,15 200,22 225,10 250,18 275,12 300,5" fill="none" stroke="#004E9F" strokeWidth="2" /> },
            { id: 'goals' as ModuleId,     label: 'Goals',             sub: 'Track milestones',        bg: '#E8F5EE', color: '#006D44',
              svg: <polyline points="0,65 40,55 80,45 120,35 160,28 200,20 240,14 280,10 300,8" fill="none" stroke="#006D44" strokeWidth="2" /> },
            { id: 'marketsim' as ModuleId, label: 'Crash Sim',         sub: 'Stress test positions',   bg: '#FBE9E7', color: '#BA1A1A',
              svg: <polyline points="0,10 40,12 80,15 120,13 160,40 200,55 240,65 280,60 300,70" fill="none" stroke="#BA1A1A" strokeWidth="2" /> },
          ].map(({ id, label, sub, bg, color, svg }) => (
            <button
              key={id}
              onClick={() => onNavigateModule(id)}
              className="relative overflow-hidden rounded-xl text-left p-4 flex flex-col justify-between transition-all duration-300 group border border-[#E5E5EA] hover:-translate-y-0.5"
              style={{ backgroundColor: bg, boxShadow: '0 1px 4px rgba(0,0,0,0.03)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.03)')}
            >
              <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 300 80" preserveAspectRatio="none">
                {svg}
              </svg>
              <div className="relative z-10">
                <div className="font-heading font-bold text-[18px] text-[#1D1D1F] group-hover:text-current transition-colors" style={{ color }}>
                  {label}
                </div>
                <div className="text-[12px] text-[#6E6E73] font-body mt-0.5">{sub}</div>
              </div>
              <div className="relative z-10 mt-3 flex items-center gap-1 text-[11px] font-heading font-semibold" style={{ color }}>
                Open <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>

        {/* ── COL 10-12 ROW 2: QUICK INSIGHTS ── */}
        <div className="col-span-3 row-span-1 bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] p-4 flex flex-col gap-3"
          style={{ boxShadow: '0 1px 2px rgba(0,0,0,0.02)' }}>
          <div className="text-[10px] font-heading font-semibold text-[#6E6E73] uppercase tracking-widest">Quick Insights</div>

          {/* Learning shortcut */}
          <button
            onClick={() => onNavigateModule('learning')}
            className="flex items-center gap-2.5 p-2.5 bg-[#7E57C2]/8 rounded-xl border border-[#7E57C2]/20 hover:bg-[#7E57C2]/12 transition-colors group text-left w-full"
          >
            <div className="w-7 h-7 rounded-full bg-[#7E57C2]/15 flex items-center justify-center shrink-0">
              <span className="text-[14px]">📚</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-semibold text-[12px] text-[#1D1D1F]">Financial Learning</div>
              <div className="text-[10px] text-[#6E6E73]">30 concepts · Interactive</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#7E57C2] shrink-0" />
          </button>

          {/* Hype detector shortcut */}
          <button
            onClick={() => onNavigateModule('hypedetector')}
            className="flex items-center gap-2.5 p-2.5 bg-[#883700]/8 rounded-xl border border-[#883700]/20 hover:bg-[#883700]/12 transition-colors group text-left w-full"
          >
            <div className="w-7 h-7 rounded-full bg-[#883700]/15 flex items-center justify-center shrink-0">
              <span className="text-[14px]">🔍</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-heading font-semibold text-[12px] text-[#1D1D1F]">Hype Detector</div>
              <div className="text-[10px] text-[#6E6E73]">Spot manipulated stocks</div>
            </div>
            <ChevronRight className="w-3.5 h-3.5 text-[#883700] shrink-0" />
          </button>

          {/* Health score context */}
          <div className="mt-auto pt-3 border-t border-[#E5E5EA]">
            <div className="text-[10px] text-[#6E6E73] font-heading font-semibold uppercase tracking-wider mb-2">Score Breakdown</div>
            <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
              {[
                { label: 'Assets',  val: assetScore  },
                { label: 'Debt',    val: debtScore   },
                { label: 'Spend',   val: spendScore  },
                { label: 'Risk',    val: riskScore   },
              ].map(({ label, val }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-[11px] text-[#6E6E73] font-heading">{label}</span>
                  <span className="text-[11px] font-heading font-bold text-[#1D1D1F]">{val}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
