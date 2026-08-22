import { getStorageKey } from '../../utils';
import React, { useEffect, useState, useRef } from 'react';
import { ChevronRight, CheckCircle2, AlertTriangle, TrendingUp, TrendingDown, Sparkles, RefreshCw } from 'lucide-react';
import { ModuleId } from '../../types';
import {
  FinancialAnalysisResult,
  analyzeWithGemini,
} from '../../services/financialAnalysisService';

interface OverviewModuleProps {
  onNavigateModule: (module: ModuleId) => void;
}

// ── Animated score counter ──────────────────────────────────────────
function useCounter(target: number, duration = 1500) {
  const [val, setVal] = useState(0);
  const rafRef = useRef<number>();
  useEffect(() => {
    if (target === 0) { setVal(0); return; }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [target, duration]);
  return val;
}

// ── Thin progress bar ───────────────────────────────────────────────
function Bar({ pct, delay, color }: { pct: number; delay: number; color: string }) {
  const [w, setW] = useState(0);
  useEffect(() => { const t = setTimeout(() => setW(pct), delay); return () => clearTimeout(t); }, [pct, delay]);
  return (
    <div className="w-full h-[3px] rounded-full overflow-hidden" style={{ backgroundColor: `${color}30` }}>
      <div className="h-full rounded-full transition-all duration-[1300ms] ease-out" style={{ width: `${w}%`, backgroundColor: color }} />
    </div>
  );
}

// ── Colour palette for solid widget backgrounds ─────────────────────
const C = {
  surface:   '#FFFFFF',
  blue:      '#004E9F',
  blueLight: '#EBF1FB',
  green:     '#006D44',
  greenLight:'#E8F5EE',
  amber:     '#883700',
  amberLight:'#FEF3E2',
  red:       '#BA1A1A',
  redLight:  '#FBE9E7',
  purple:    '#7E57C2',
  purpleLight:'#F2EEFA',
  slate:     '#F5F5F7',
  text:      '#1D1D1F',
  muted:     '#6E6E73',
  border:    '#E5E5EA',
};

// ── Widget wrapper — solid bg, no border ────────────────────────────
function Widget({ bg = C.surface, className = '', children }: { bg?: string; className?: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-xl overflow-hidden ${className}`}
      style={{ backgroundColor: bg, boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.04)' }}
    >
      {children}
    </div>
  );
}

function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[10px] font-heading font-semibold uppercase tracking-widest mb-2" style={{ color: C.muted }}>{children}</div>;
}

// ── Main component ──────────────────────────────────────────────────
export const OverviewModule: React.FC<OverviewModuleProps> = ({ onNavigateModule }) => {
  const [assets, setAssets]       = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [leakage, setLeakage]     = useState(0);
  const [hasProfile, setHasProfile] = useState(false);
  const [goals, setGoals]         = useState<any[]>([]);
  const [holdings, setHoldings]   = useState<any[]>([]);
  const [txns, setTxns]           = useState<any[]>([]);
  const [profile, setProfile]     = useState<any>(null);
  const [analysis, setAnalysis]   = useState<FinancialAnalysisResult | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource]   = useState<'ai' | 'failed' | null>(null);
  const [mounted, setMounted]     = useState(false);

  // ── Load all data from localStorage ──────────────────────────────
  useEffect(() => {
    setMounted(true);
    try {
      const hd = localStorage.getItem(getStorageKey('finsight_portfolio_holdings'));
      if (hd) { const h = JSON.parse(hd); if (Array.isArray(h)) { setHoldings(h); setAssets(h.reduce((s: number, x: any) => s + (Number(x.currentValue) || 0), 0)); } }

      const pd = localStorage.getItem(getStorageKey('finsight_investor_profile'));
      if (pd) { const p = JSON.parse(pd); setProfile(p); setLiabilities(Number(p.outstandingDebt) || 0); setHasProfile(true); }

      const sd = localStorage.getItem(getStorageKey('finsight_spend_transactions'));
      if (sd) { const t = JSON.parse(sd); if (Array.isArray(t)) { setTxns(t); setLeakage(t.filter((x: any) => x.category === 'Discretionary').reduce((s: number, x: any) => s + (Number(x.amount) || 0), 0)); } }

      const gd = localStorage.getItem(getStorageKey('finsight_goals'));
      if (gd) { const g = JSON.parse(gd); if (Array.isArray(g)) setGoals(g); }
    } catch (e) { console.error(e); }
  }, []);

  // ── Run analysis whenever data is ready ──────────────────────────
  useEffect(() => {
    if (!mounted) return;
    runAnalysis();
  }, [mounted, assets, liabilities, leakage, hasProfile]);

  const runAnalysis = async () => {
    setAiLoading(true);

    // Build augmented profile payload
    const payload = {
      ...(profile ?? {}),
      computed: {
        totalAssets:   assets,
        totalLiabilities: liabilities,
        monthlyLeakage: leakage,
        netWorth:      assets - liabilities,
        holdingsCount: holdings.length,
        goalsCount:    goals.length,
      },
    };

    // Strict AI usage (no fakes/heuristics)
    const aiResult = await analyzeWithGemini(payload);
    if (aiResult) {
      setAnalysis(aiResult);
      setAiSource('ai');
    } else {
      setAnalysis(null);
      setAiSource('failed');
    }
    setAiLoading(false);
  };

  // ── Derived values ────────────────────────────────────────────────
  const score  = analysis?.healthScore ?? 0;
  const dims   = analysis?.dimensions  ?? { assets: 0, debtControl: 0, spendControl: 0, riskProfile: 0 };
  const band   = analysis?.healthBand  ?? 'No Data';
  const bandColor = band === 'Excellent' ? C.green : band === 'Good' ? C.blue : band === 'Fair' ? C.amber : C.red;

  const netWorth = assets - liabilities;
  const displayScore = useCounter(score);

  const needs     = txns.filter((x: any) => x.category === 'Needs').reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
  const goalSpend = txns.filter((x: any) => x.category === 'Goals').reduce((s: number, x: any) => s + Number(x.amount || 0), 0);
  const totalSp   = needs + goalSpend + leakage;

  const topHolding = [...holdings].sort((a, b) => (Number(b.currentValue) || 0) - (Number(a.currentValue) || 0))[0];
  const categories = holdings.reduce((acc: Record<string, number>, h: any) => {
    const cat = h.category || 'Other';
    acc[cat] = (acc[cat] || 0) + (Number(h.currentValue) || 0);
    return acc;
  }, {});
  const topCats = Object.entries(categories).sort(([, a], [, b]) => b - a).slice(0, 3);

  const fmt  = (v: number) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(v);
  const fmtK = (v: number) => v >= 100000 ? `₹${(v / 100000).toFixed(1)}L` : v >= 1000 ? `₹${(v / 1000).toFixed(0)}K` : v === 0 ? '₹0' : fmt(v);

  return (
    <div className="h-full flex flex-col gap-3 overflow-hidden">

      {/* ── ROW 0: COMPACT INTRO BAR ── */}
      <div className="flex items-center justify-between shrink-0 px-0.5">
        <div>
          <h1 className="font-heading font-semibold text-[20px] leading-tight tracking-tight" style={{ color: C.text }}>
            Your financial health, at a glance.
          </h1>
          <p className="text-[11px] flex items-center gap-1.5 mt-0.5" style={{ color: C.muted }}>
            <span className={`w-[5px] h-[5px] rounded-full inline-block ${aiLoading ? 'bg-amber-500 animate-pulse' : aiSource === 'failed' ? 'bg-[#BA1A1A]' : 'bg-[#006D44]'}`} />
            {aiLoading ? 'Analysing your data…' : aiSource === 'ai' ? 'AI-powered analysis · Gemini Flash' : aiSource === 'failed' ? 'AI analysis unavailable · Add API key' : 'Pending analysis'}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={runAnalysis}
            disabled={aiLoading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-heading font-semibold transition-opacity hover:opacity-80"
            style={{ backgroundColor: C.purpleLight, color: C.purple }}
          >
            {aiLoading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
            {aiLoading ? 'Analysing…' : aiSource === 'ai' ? 'Re-run AI' : 'Run AI Analysis'}
          </button>
          <span className="text-[11px] px-2.5 py-1 rounded-full font-heading font-semibold" style={{ backgroundColor: C.slate, color: C.muted }}>
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div className="flex-1 grid grid-cols-12 grid-rows-2 gap-3 min-h-0">

        {/* ── HEALTH SCORE (col 1-4, row 1) ── */}
        <Widget bg={C.surface} className="col-span-4 row-span-1 p-5 flex flex-col justify-between">
          <div className="flex items-start justify-between">
            <Label>Financial Health</Label>
            <span
              className="text-[10px] font-heading font-semibold px-2 py-0.5 rounded-full"
              style={{ color: bandColor, backgroundColor: `${bandColor}15` }}
            >{band}</span>
          </div>
          <div className="flex items-baseline gap-1 my-1">
            <span className="font-heading font-bold text-[52px] leading-none tracking-tighter" style={{ color: C.text }}>{displayScore}</span>
            <span className="font-heading text-[18px] font-normal" style={{ color: C.muted }}>/100</span>
            {aiSource === 'ai' && <Sparkles className="w-3.5 h-3.5 ml-2 mt-auto mb-2" style={{ color: C.purple }} />}
          </div>
          <div className="flex flex-col gap-2.5">
            {([
              { label: 'Assets',       pct: dims.assets,       color: C.blue },
              { label: 'Debt Control', pct: dims.debtControl,  color: C.green },
              { label: 'Spend',        pct: dims.spendControl, color: C.amber },
              { label: 'Risk Profile', pct: dims.riskProfile,  color: C.purple },
            ] as const).map(({ label, pct, color }, i) => (
              <div key={label} className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span className="text-[11px] font-heading font-semibold" style={{ color: C.text }}>{label}</span>
                  <span className="text-[11px]" style={{ color: C.muted }}>{pct}%</span>
                </div>
                <Bar pct={pct} delay={150 + i * 100} color={color} />
              </div>
            ))}
          </div>
        </Widget>

        {/* ── NET WORTH + SPEND/GOALS (col 5-9, row 1) ── */}
        <div className="col-span-5 row-span-1 grid grid-cols-2 grid-rows-2 gap-3">

          {/* Net Worth */}
          <Widget bg={C.blueLight} className="col-span-2 px-5 py-3.5 flex items-center justify-between">
            <div>
              <Label>Net Worth</Label>
              <div className="font-heading font-bold text-[28px] leading-none tracking-tight" style={{ color: C.blue }}>{fmtK(netWorth)}</div>
            </div>
            <div className="grid grid-cols-3 divide-x" style={{ borderColor: `${C.blue}25` }}>
              {[
                { label: 'Assets',      value: fmtK(assets),      color: C.blue   },
                { label: 'Liabilities', value: fmtK(liabilities),  color: liabilities > 0 ? C.red : C.muted },
                { label: 'Leakage/mo', value: fmtK(leakage),      color: leakage  > 0 ? C.amber : C.muted },
              ].map(({ label, value, color }) => (
                <div key={label} className="px-4 flex flex-col">
                  <span className="text-[10px] font-heading font-semibold uppercase tracking-wider" style={{ color: `${C.blue}99` }}>{label}</span>
                  <span className="font-heading font-bold text-[15px] tracking-tight mt-0.5" style={{ color }}>{value}</span>
                </div>
              ))}
            </div>
          </Widget>

          {/* Spend Breakdown */}
          <Widget bg={C.amberLight} className="px-4 py-3 flex flex-col justify-between">
            <Label>Spend Breakdown</Label>
            {totalSp === 0 ? (
              <span className="text-[12px]" style={{ color: C.muted }}>No transactions yet</span>
            ) : (
              <div className="flex flex-col gap-2">
                {[
                  { label: 'Needs',         val: needs,     pct: Math.round((needs    / totalSp) * 100), color: C.blue  },
                  { label: 'Goals',         val: goalSpend, pct: Math.round((goalSpend/ totalSp) * 100), color: C.green },
                  { label: 'Discretionary', val: leakage,   pct: Math.round((leakage  / totalSp) * 100), color: C.red   },
                ].map(({ label, val, pct, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-0.5">
                      <span className="text-[11px] font-heading font-semibold" style={{ color: C.text }}>{label}</span>
                      <span className="text-[10px]" style={{ color: C.muted }}>{pct}% · {fmtK(val)}</span>
                    </div>
                    <Bar pct={pct} delay={500} color={color} />
                  </div>
                ))}
              </div>
            )}
          </Widget>

          {/* Goals Summary */}
          <Widget bg={C.greenLight} className="px-4 py-3 flex flex-col justify-between">
            <Label>Active Goals</Label>
            {goals.length === 0 ? (
              <div>
                <p className="text-[12px]" style={{ color: C.muted }}>No goals set yet</p>
                <button onClick={() => onNavigateModule('goals')} className="mt-2 text-[11px] font-heading font-semibold hover:underline block" style={{ color: C.green }}>
                  Set your first goal →
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {goals.slice(0, 2).map((g: any, i: number) => {
                  const pct = Math.min(100, Math.round(((Number(g.currentAmount) || 0) / Math.max(Number(g.targetAmount) || 1, 1)) * 100));
                  return (
                    <div key={i}>
                      <div className="flex justify-between mb-0.5">
                        <span className="text-[11px] font-heading font-semibold truncate max-w-[110px]" style={{ color: C.text }}>{g.name || g.goalName}</span>
                        <span className="text-[10px]" style={{ color: C.muted }}>{pct}%</span>
                      </div>
                      <Bar pct={pct} delay={400} color={C.green} />
                    </div>
                  );
                })}
                {goals.length > 2 && <span className="text-[10px]" style={{ color: C.muted }}>+{goals.length - 2} more</span>}
              </div>
            )}
          </Widget>
        </div>

        {/* ── NEXT STEPS (col 10-12, row 1) ── */}
        <Widget bg={C.surface} className="col-span-3 row-span-1 p-4 flex flex-col gap-2">
          <Label>Next Steps</Label>
          {[
            { id: 'portfolio' as ModuleId, ok: assets > 0,      title: assets > 0 ? 'Portfolio set up' : 'Add holdings',          sub: assets > 0 ? `${holdings.length} asset${holdings.length !== 1 ? 's' : ''} · ${fmtK(assets)}` : 'No assets recorded',      okColor: C.green, failColor: C.red },
            { id: 'risk'      as ModuleId, ok: hasProfile,       title: hasProfile ? 'Risk profile done' : 'Complete risk profile', sub: hasProfile ? 'Profile assessed' : 'Needed for full analysis',                                                                okColor: C.green, failColor: C.amber },
            { id: 'spend'     as ModuleId, ok: leakage === 0,    title: leakage > 0 ? `${fmtK(leakage)} discretionary` : 'Spend clean', sub: leakage > 0 ? 'Review and reallocate' : txns.length > 0 ? `${txns.length} txns logged` : 'No transactions yet',       okColor: C.green, failColor: C.amber },
            { id: 'goals'     as ModuleId, ok: goals.length > 0, title: goals.length > 0 ? `${goals.length} goal${goals.length !== 1 ? 's' : ''} active` : 'Set your goals', sub: goals.length > 0 ? 'Tracking milestones' : 'No goals configured',              okColor: C.green, failColor: C.red },
          ].map(({ id, ok, title, sub, okColor, failColor }) => (
            <button
              key={id}
              onClick={() => onNavigateModule(id)}
              className="flex items-center gap-2.5 p-2.5 rounded-xl hover:opacity-90 transition-opacity text-left group w-full"
              style={{ backgroundColor: ok ? `${okColor}10` : `${failColor}10` }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: ok ? `${okColor}20` : `${failColor}20` }}>
                {ok
                  ? <CheckCircle2 className="w-3.5 h-3.5" style={{ color: okColor }} />
                  : <AlertTriangle className="w-3.5 h-3.5" style={{ color: failColor }} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-heading font-semibold text-[12px] truncate" style={{ color: C.text }}>{title}</div>
                <div className="text-[10px] truncate" style={{ color: C.muted }}>{sub}</div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 shrink-0 group-hover:translate-x-0.5 transition-transform" style={{ color: C.muted }} />
            </button>
          ))}
        </Widget>

        {/* ── PORTFOLIO BREAKDOWN (col 1-4, row 2) ── */}
        <Widget bg={C.surface} className="col-span-4 row-span-1 p-4 flex flex-col">
          <Label>Portfolio Breakdown</Label>
          {holdings.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-2">
              <span className="text-[12px]" style={{ color: C.muted }}>No holdings recorded yet.</span>
              <button onClick={() => onNavigateModule('portfolio')} className="text-[11px] font-heading font-semibold hover:underline" style={{ color: C.blue }}>
                Add your first holding →
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between">
              <div className="flex flex-col gap-2.5">
                {topCats.map(([cat, val], i) => {
                  const pct = Math.round((val / Math.max(assets, 1)) * 100);
                  const colors = [C.blue, C.green, C.purple];
                  return (
                    <div key={cat}>
                      <div className="flex justify-between mb-1">
                        <span className="text-[11px] font-heading font-semibold" style={{ color: C.text }}>{cat}</span>
                        <span className="text-[11px]" style={{ color: C.muted }}>{pct}% · {fmtK(val)}</span>
                      </div>
                      <Bar pct={pct} delay={300 + i * 100} color={colors[i]} />
                    </div>
                  );
                })}
              </div>
              {topHolding && (
                <div className="mt-2 pt-2.5 flex items-center justify-between" style={{ borderTop: `1px solid ${C.border}` }}>
                  <div>
                    <div className="text-[9px] font-heading font-semibold uppercase tracking-wider" style={{ color: C.muted }}>Top Holding</div>
                    <div className="text-[13px] font-heading font-semibold" style={{ color: C.text }}>{topHolding.ticker || topHolding.name}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[13px] font-heading font-bold" style={{ color: C.text }}>{fmtK(Number(topHolding.currentValue))}</div>
                    {topHolding.currentValue > topHolding.investedValue ? (
                      <div className="flex items-center gap-0.5 text-[11px] justify-end" style={{ color: C.green }}>
                        <TrendingUp className="w-3 h-3" />
                        +{Math.round(((topHolding.currentValue - topHolding.investedValue) / Math.max(topHolding.investedValue, 1)) * 100)}%
                      </div>
                    ) : topHolding.currentValue < topHolding.investedValue ? (
                      <div className="flex items-center gap-0.5 text-[11px] justify-end" style={{ color: C.red }}>
                        <TrendingDown className="w-3 h-3" />
                        {Math.round(((topHolding.currentValue - topHolding.investedValue) / Math.max(topHolding.investedValue, 1)) * 100)}%
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )}
        </Widget>

        {/* ── FEATURE TILES (col 5-9, row 2) ── */}
        <div className="col-span-5 row-span-1 grid grid-cols-3 gap-3">
          {([
            { id: 'portfolio' as ModuleId, label: 'Portfolio',    sub: 'Asset allocation',       bg: C.blueLight,   color: C.blue,  pts: '0,60 50,45 100,50 150,30 200,35 250,20 300,5'  },
            { id: 'goals'     as ModuleId, label: 'Goals',        sub: 'Track milestones',       bg: C.greenLight,  color: C.green, pts: '0,65 60,55 120,45 180,35 240,20 300,8'         },
            { id: 'marketsim' as ModuleId, label: 'Crash Sim',    sub: 'Stress test positions',  bg: C.redLight,    color: C.red,   pts: '0,10 60,13 120,15 180,40 240,60 300,70'        },
          ] as const).map(({ id, label, sub, bg, color, pts }) => (
            <button
              key={id}
              onClick={() => onNavigateModule(id)}
              className="relative overflow-hidden rounded-xl text-left p-4 flex flex-col justify-between transition-all duration-300 group hover:-translate-y-0.5"
              style={{ backgroundColor: bg, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.10)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)')}
            >
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-15 group-hover:opacity-25 transition-opacity" viewBox="0 0 300 80" preserveAspectRatio="none">
                <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" />
              </svg>
              <div className="relative z-10">
                <div className="font-heading font-bold text-[18px] tracking-tight" style={{ color }}>{label}</div>
                <div className="text-[12px] font-body mt-0.5" style={{ color: C.muted }}>{sub}</div>
              </div>
              <div className="relative z-10 mt-3 flex items-center gap-1 text-[11px] font-heading font-semibold" style={{ color }}>
                Open <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </button>
          ))}
        </div>

        {/* ── AI INSIGHTS + QUICK ACCESS (col 10-12, row 2) ── */}
        <Widget bg={C.purpleLight} className="col-span-3 row-span-1 p-4 flex flex-col gap-2.5">
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: C.purple }} />
            <Label>AI Insights</Label>
          </div>

          {aiLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 animate-spin" style={{ color: C.purple }} />
            </div>
          ) : analysis?.insights?.length ? (
            <div className="flex flex-col gap-2 flex-1">
              {analysis.insights.slice(0, 2).map((ins, i) => (
                <div key={i} className="text-[11px] leading-relaxed p-2 rounded-lg" style={{ backgroundColor: `${C.purple}12`, color: C.text }}>
                  {ins}
                </div>
              ))}
              {analysis.topRisk && (
                <div className="text-[10px] leading-relaxed p-2 rounded-lg" style={{ backgroundColor: `${C.red}10`, color: C.red }}>
                  <span className="font-heading font-semibold">Risk: </span>{analysis.topRisk}
                </div>
              )}
            </div>
          ) : (
            <p className="text-[11px]" style={{ color: C.muted }}>Run AI analysis to see personalised insights.</p>
          )}

          <div className="flex flex-col gap-1.5 pt-2" style={{ borderTop: `1px solid ${C.purple}20` }}>
            {[
              { id: 'learning'     as ModuleId, icon: '📚', label: 'Financial Learning', sub: '30 concepts · Interactive', color: C.purple },
              { id: 'hypedetector' as ModuleId, icon: '🔍', label: 'Hype Detector',       sub: 'Spot manipulated stocks',  color: C.amber  },
            ].map(({ id, icon, label, sub, color }) => (
              <button
                key={id}
                onClick={() => onNavigateModule(id)}
                className="flex items-center gap-2.5 p-2 rounded-xl hover:opacity-90 transition-opacity text-left w-full group"
                style={{ backgroundColor: `${color}12` }}
              >
                <span className="text-[14px] shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-heading font-semibold text-[11px] truncate" style={{ color: C.text }}>{label}</div>
                  <div className="text-[10px] truncate" style={{ color: C.muted }}>{sub}</div>
                </div>
                <ChevronRight className="w-3 h-3 shrink-0" style={{ color }} />
              </button>
            ))}
          </div>
        </Widget>

      </div>
    </div>
  );
};
