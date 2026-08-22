import React, { useState } from 'react';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, ArrowRight, BookOpen } from 'lucide-react';
import { GrowwInteractiveModule2 } from './GrowwInteractiveModule2';
import { SIPMechanicsModule3 } from './SIPMechanicsModule3';

/* ═══════════════════════════════════════════════════
   PHASE 1 COURSE DATA
   ═══════════════════════════════════════════════════ */

interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  content: React.ReactNode;
}

/* ═══════════════════════════════════════════════════
   LESSON VISUALS — SVG GRAPHICS
   ═══════════════════════════════════════════════════ */

const StockVsMFVisual: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-6">
    {/* Single Stock */}
    <div className="bg-[#1A1A1A] rounded-[20px] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-[12px] bg-[#D64545]/15 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="8" y="2" width="4" height="16" rx="2" fill="#D64545" />
          </svg>
        </div>
        <div>
          <h4 className="text-[15px] font-heading font-bold text-white">Single Stock</h4>
          <p className="text-[12px] text-[#71717A] font-body">e.g. Buying only Infosys</p>
        </div>
      </div>
      <svg width="100%" height="80" viewBox="0 0 240 80" fill="none" className="mb-3">
        <path d="M10 60 L40 30 L70 50 L100 15 L130 55 L160 20 L190 65 L220 35 L240 50" stroke="#D64545" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M10 60 L40 30 L70 50 L100 15 L130 55 L160 20 L190 65 L220 35 L240 50 L240 80 L10 80 Z" fill="#D64545" fillOpacity="0.08" />
      </svg>
      <div className="space-y-2">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D64545]" /><span className="text-[13px] text-[#A1A1AA] font-body">High volatility — one company's fate</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D64545]" /><span className="text-[13px] text-[#A1A1AA] font-body">Risk concentrated in single sector</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#D64545]" /><span className="text-[13px] text-[#A1A1AA] font-body">Requires constant monitoring</span></div>
      </div>
    </div>

    {/* Mutual Fund */}
    <div className="bg-[#1A1A1A] rounded-[20px] p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-[12px] bg-[#00B386]/15 flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <rect x="2" y="10" width="4" height="8" rx="1.5" fill="#00B386" fillOpacity="0.5" />
            <rect x="8" y="6" width="4" height="12" rx="1.5" fill="#00B386" fillOpacity="0.7" />
            <rect x="14" y="3" width="4" height="15" rx="1.5" fill="#00B386" />
          </svg>
        </div>
        <div>
          <h4 className="text-[15px] font-heading font-bold text-white">Mutual Fund</h4>
          <p className="text-[12px] text-[#71717A] font-body">e.g. Nifty 50 Index Fund</p>
        </div>
      </div>
      <svg width="100%" height="80" viewBox="0 0 240 80" fill="none" className="mb-3">
        <path d="M10 65 L40 55 L70 50 L100 42 L130 38 L160 30 L190 25 L220 18 L240 14" stroke="#00B386" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        <path d="M10 65 L40 55 L70 50 L100 42 L130 38 L160 30 L190 25 L220 18 L240 14 L240 80 L10 80 Z" fill="#00B386" fillOpacity="0.08" />
      </svg>
      <div className="space-y-2">
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00B386]" /><span className="text-[13px] text-[#A1A1AA] font-body">Diversified across 30–80+ stocks</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00B386]" /><span className="text-[13px] text-[#A1A1AA] font-body">Managed by professional fund manager</span></div>
        <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-[#00B386]" /><span className="text-[13px] text-[#A1A1AA] font-body">Lower individual risk, steady growth</span></div>
      </div>
    </div>
  </div>
);

const DirectVsRegularVisual: React.FC = () => {
  const [years] = useState(20);
  const investPerMonth = 10000;
  const regularExpense = 1.5;
  const directExpense = 0.5;
  const returnRate = 12;

  const calcFV = (expense: number) => {
    const effectiveRate = (returnRate - expense) / 100 / 12;
    const n = years * 12;
    return investPerMonth * ((Math.pow(1 + effectiveRate, n) - 1) / effectiveRate) * (1 + effectiveRate);
  };

  const regularFV = calcFV(regularExpense);
  const directFV = calcFV(directExpense);
  const difference = directFV - regularFV;

  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="my-6">
      <div className="bg-[#1A1A1A] rounded-[20px] p-6">
        <p className="text-[13px] text-[#8A8F98] font-body mb-4">
          Investing ₹10,000/month at 12% returns over 20 years
        </p>

        {/* Comparison Bars */}
        <div className="space-y-5 mb-6">
          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[14px] font-heading font-semibold text-white">Regular Plan</span>
              <span className="text-[14px] font-heading font-bold text-[#D99A00]">{fmt(regularFV)}</span>
            </div>
            <div className="h-6 bg-[#262626] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#D99A00] transition-all duration-500" style={{ width: `${(regularFV / directFV) * 100}%` }} />
            </div>
            <p className="text-[11px] text-[#71717A] mt-1 font-body">Expense Ratio: {regularExpense}% (includes distributor commission)</p>
          </div>

          <div>
            <div className="flex justify-between mb-1.5">
              <span className="text-[14px] font-heading font-semibold text-white">Direct Plan</span>
              <span className="text-[14px] font-heading font-bold text-[#00B386]">{fmt(directFV)}</span>
            </div>
            <div className="h-6 bg-[#262626] rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-[#00B386] transition-all duration-500" style={{ width: '100%' }} />
            </div>
            <p className="text-[11px] text-[#71717A] mt-1 font-body">Expense Ratio: {directExpense}% (no middleman)</p>
          </div>
        </div>

        {/* Difference callout */}
        <div className="bg-[#00B386]/10 rounded-[14px] p-4 flex items-center gap-4">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <circle cx="20" cy="20" r="18" stroke="#00B386" strokeWidth="2" fill="none" />
            <path d="M20 28 L20 12 M14 18 L20 12 L26 18" stroke="#00B386" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div>
            <p className="text-[16px] font-heading font-bold text-[#00B386]">{fmt(difference)} more</p>
            <p className="text-[13px] text-[#8A8F98] font-body">Extra wealth from Direct Plan over {years} years — just by cutting the middleman.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const GrowthVsIDCWVisual: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'growth' | 'idcw'>('growth');

  // Simulate 10 years of ₹1L investment at 12%
  const initial = 100000;
  const rate = 0.12;

  const growthData: { year: number; value: number }[] = [];
  const idcwData: { year: number; value: number; payout: number; cumPayout: number }[] = [];

  let growthVal = initial;
  let idcwVal = initial;
  let cumPayout = 0;

  for (let y = 1; y <= 10; y++) {
    growthVal = growthVal * (1 + rate);
    growthData.push({ year: y, value: growthVal });

    const yearReturn = idcwVal * rate;
    const payout = yearReturn * 0.7; // 70% distributed
    const reinvested = yearReturn * 0.3;
    idcwVal = idcwVal + reinvested;
    cumPayout += payout;
    idcwData.push({ year: y, value: idcwVal, payout, cumPayout });
  }

  const finalGrowth = growthData[growthData.length - 1].value;
  const finalIDCW = idcwData[idcwData.length - 1].value + idcwData[idcwData.length - 1].cumPayout;
  const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  const maxY = Math.max(finalGrowth, finalIDCW);
  const svgW = 320; const svgH = 140;

  const growthPath = growthData.map((d, i) => {
    const x = ((d.year) / 10) * (svgW - 20) + 10;
    const y = svgH - 10 - ((d.value / maxY) * (svgH - 30));
    return `${i === 0 ? 'M10,' + (svgH - 10 - ((initial / maxY) * (svgH - 30))) + ' L' : 'L'}${x},${y}`;
  }).join(' ');

  const idcwPath = idcwData.map((d, i) => {
    const totalVal = d.value + d.cumPayout;
    const x = ((d.year) / 10) * (svgW - 20) + 10;
    const y = svgH - 10 - ((totalVal / maxY) * (svgH - 30));
    return `${i === 0 ? 'M10,' + (svgH - 10 - ((initial / maxY) * (svgH - 30))) + ' L' : 'L'}${x},${y}`;
  }).join(' ');

  return (
    <div className="my-6">
      {/* Toggle */}
      <div className="flex gap-2 mb-5">
        {(['growth', 'idcw'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-[12px] text-[13px] font-heading font-semibold transition-all duration-[180ms] ${activeTab === tab ? 'bg-[#00B386] text-[#0D1117]' : 'bg-[#262626] text-[#A1A1AA] hover:bg-[#333]'}`}
          >
            {tab === 'growth' ? 'Growth Plan' : 'IDCW (Dividend)'}
          </button>
        ))}
      </div>

      <div className="bg-[#1A1A1A] rounded-[20px] p-6">
        {activeTab === 'growth' ? (
          <>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-[12px] bg-[#00B386]/15 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 16 C 8 14, 12 8, 16 4" stroke="#00B386" strokeWidth="2.5" strokeLinecap="round" />
                  <circle cx="16" cy="4" r="2" fill="#00B386" />
                </svg>
              </div>
              <div>
                <h4 className="text-[15px] font-heading font-bold text-white mb-1">Growth Plan</h4>
                <p className="text-[13px] text-[#8A8F98] font-body leading-relaxed">
                  All profits are automatically reinvested back into the fund. No payouts, no tax events. 
                  This maximizes the compounding effect — your returns generate their own returns.
                </p>
              </div>
            </div>

            <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mb-4">
              <path d={growthPath + ` L${svgW - 10},${svgH - 10} L10,${svgH - 10} Z`} fill="#00B386" fillOpacity="0.08" />
              <path d={growthPath} fill="none" stroke="#00B386" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <div className="bg-[#262626] rounded-[14px] p-4 flex justify-between items-center">
              <div>
                <p className="text-[12px] text-[#71717A] font-body">₹1,00,000 invested for 10 years at 12%</p>
                <p className="text-[22px] font-heading font-bold text-[#00B386]">{fmt(finalGrowth)}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#71717A] font-body">Tax Event</p>
                <p className="text-[14px] font-heading font-semibold text-[#00B386]">Only on sale</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-[12px] bg-[#D99A00]/15 flex items-center justify-center shrink-0">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="4" y="4" width="12" height="12" rx="3" fill="#D99A00" fillOpacity="0.3" />
                  <path d="M10 7 L10 13 M7 10 L13 10" stroke="#D99A00" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h4 className="text-[15px] font-heading font-bold text-white mb-1">IDCW (Income Distribution cum Capital Withdrawal)</h4>
                <p className="text-[13px] text-[#8A8F98] font-body leading-relaxed">
                  The fund periodically distributes payouts to you. Each payout is taxed at your income slab rate 
                  (up to 30%+). This drains capital from the fund and slows compounding.
                </p>
              </div>
            </div>

            <svg width="100%" height={svgH} viewBox={`0 0 ${svgW} ${svgH}`} className="mb-4">
              <path d={idcwPath + ` L${svgW - 10},${svgH - 10} L10,${svgH - 10} Z`} fill="#D99A00" fillOpacity="0.08" />
              <path d={idcwPath} fill="none" stroke="#D99A00" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="6 4" />
              <path d={growthPath} fill="none" stroke="#00B386" strokeWidth="1.5" strokeLinecap="round" strokeOpacity="0.3" />
            </svg>

            <div className="bg-[#262626] rounded-[14px] p-4 flex justify-between items-center">
              <div>
                <p className="text-[12px] text-[#71717A] font-body">Fund Value + All Payouts Received</p>
                <p className="text-[22px] font-heading font-bold text-[#D99A00]">{fmt(finalIDCW)}</p>
              </div>
              <div className="text-right">
                <p className="text-[12px] text-[#71717A] font-body">Tax Event</p>
                <p className="text-[14px] font-heading font-semibold text-[#D64545]">Every payout (slab rate)</p>
              </div>
            </div>

            <div className="mt-4 bg-[#D64545]/10 rounded-[14px] p-4">
              <p className="text-[13px] text-[#D64545] font-body">
                <span className="font-heading font-bold">Lost to tax & reduced compounding:</span> {fmt(finalGrowth - finalIDCW)} less than Growth Plan
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   INTERACTIVE KNOWLEDGE CHECK
   ═══════════════════════════════════════════════════ */

interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const KnowledgeCheck: React.FC<{ questions: QuizQuestion[] }> = ({ questions }) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  const q = questions[currentQ];
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (idx: number) => {
    if (showResult) return;
    setSelected(idx);
    setShowResult(true);
    if (idx === q.correctIndex) setScore(s => s + 1);
  };

  const handleNext = () => {
    setSelected(null);
    setShowResult(false);
    setCurrentQ(c => c + 1);
  };

  if (currentQ >= questions.length) {
    return (
      <div className="bg-[#1A1A1A] rounded-[20px] p-6 text-center">
        <div className="w-16 h-16 rounded-full bg-[#00B386]/15 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#00B386]" />
        </div>
        <h4 className="text-[18px] font-heading font-bold text-white mb-2">Module Complete!</h4>
        <p className="text-[14px] text-[#8A8F98] font-body mb-1">You scored {score} out of {questions.length}</p>
        <p className="text-[13px] text-[#71717A] font-body">{score === questions.length ? 'Perfect! You understand the fundamentals.' : 'Review the lessons above to strengthen your understanding.'}</p>
      </div>
    );
  }

  return (
    <div className="bg-[#1A1A1A] rounded-[20px] p-6">
      <div className="flex justify-between items-center mb-4">
        <span className="text-[12px] text-[#71717A] font-heading font-semibold uppercase tracking-wider">Knowledge Check</span>
        <span className="text-[12px] text-[#71717A] font-body">{currentQ + 1} of {questions.length}</span>
      </div>
      <h4 className="text-[16px] font-heading font-bold text-white mb-5">{q.question}</h4>
      <div className="space-y-2.5">
        {q.options.map((opt, idx) => {
          let optClass = 'bg-[#262626] text-[#A1A1AA] hover:bg-[#333] hover:text-white';
          if (showResult && idx === q.correctIndex) optClass = 'bg-[#00B386]/15 text-[#00B386] ring-1 ring-[#00B386]';
          if (showResult && idx === selected && !isCorrect) optClass = 'bg-[#D64545]/15 text-[#D64545] ring-1 ring-[#D64545]';
          return (
            <button key={idx} onClick={() => handleSelect(idx)}
              className={`w-full text-left px-5 py-3.5 rounded-[14px] text-[14px] font-body transition-all duration-[180ms] ${optClass}`}
            >
              {opt}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className="mt-5">
          <p className={`text-[13px] font-body leading-relaxed ${isCorrect ? 'text-[#00B386]' : 'text-[#D99A00]'}`}>
            {isCorrect ? '✓ Correct! ' : '✗ Not quite. '}{q.explanation}
          </p>
          {currentQ < questions.length - 1 && (
            <button onClick={handleNext} className="mt-4 inline-flex items-center gap-2 bg-[#262626] hover:bg-[#333] text-white px-5 py-2.5 rounded-[12px] text-[13px] font-heading font-semibold transition-all duration-[180ms]">
              Next Question <ArrowRight className="w-4 h-4" />
            </button>
          )}
          {currentQ === questions.length - 1 && (
            <button onClick={handleNext} className="mt-4 inline-flex items-center gap-2 bg-[#00B386] hover:bg-[#00B386]/80 text-[#0D1117] px-5 py-2.5 rounded-[12px] text-[13px] font-heading font-semibold transition-all duration-[180ms]">
              See Results <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   LESSON DEFINITIONS
   ═══════════════════════════════════════════════════ */

const LESSONS: Lesson[] = [
  {
    id: 'stock-vs-mf',
    title: 'The Stock Market vs. Mutual Funds',
    subtitle: 'Why diversification through mutual funds reduces risk compared to individual stocks.',
    content: (
      <>
        <div className="space-y-4 mb-6">
          <p className="text-[15px] text-[#C4C4C4] font-body leading-[1.75]">
            Buying a single stock — say <span className="text-white font-heading font-semibold">Infosys</span> — means 
            your entire investment's fate is tied to one company. If that company's earnings drop, faces regulation, 
            or a sector downturn hits, your portfolio takes the full hit.
          </p>
          <p className="text-[15px] text-[#C4C4C4] font-body leading-[1.75]">
            A <span className="text-white font-heading font-semibold">Mutual Fund</span> solves this by pooling money 
            from thousands of investors to buy a diversified basket of <span className="text-[#00B386] font-heading font-semibold">30–80+ stocks</span>, 
            managed professionally by an AMC (Asset Management Company) and a fund manager. 
            If one stock drops, the others cushion the fall.
          </p>
        </div>
        <StockVsMFVisual />
        <div className="bg-[#2775E8]/10 rounded-[14px] p-5 mt-6">
          <h4 className="text-[14px] font-heading font-bold text-[#2775E8] mb-2">Key Takeaway</h4>
          <p className="text-[13px] text-[#8A8F98] font-body leading-relaxed">
            Mutual Funds don't eliminate risk — they spread it. A Nifty 50 index fund holds 50 of India's largest companies. 
            Even if 5 stocks tank, the remaining 45 keep your portfolio stable. This is called <span className="text-white font-heading font-medium">diversification</span>.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'direct-vs-regular',
    title: 'Direct vs. Regular Plans',
    subtitle: 'How cutting the middleman compounds into lakhs more over time.',
    content: (
      <>
        <div className="space-y-4 mb-4">
          <p className="text-[15px] text-[#C4C4C4] font-body leading-[1.75]">
            Every mutual fund scheme is available in two variants: <span className="text-[#D99A00] font-heading font-semibold">Regular</span> and <span className="text-[#00B386] font-heading font-semibold">Direct</span>.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#D99A00]" />
                <h4 className="text-[14px] font-heading font-bold text-white">Regular Plan</h4>
              </div>
              <p className="text-[13px] text-[#8A8F98] font-body leading-relaxed">
                Sold through brokers, banks, or distributors. They earn a <span className="text-white font-heading font-medium">recurring commission</span> (0.5–1.5%) 
                that's baked into the fund's expense ratio. You pay this every year, silently.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#00B386]" />
                <h4 className="text-[14px] font-heading font-bold text-white">Direct Plan</h4>
              </div>
              <p className="text-[13px] text-[#8A8F98] font-body leading-relaxed">
                Bought directly from the fund house (AMC) or platforms like Groww, Kuvera, Zerodha Coin. 
                <span className="text-white font-heading font-medium"> No distributor commission</span>, resulting in a lower expense ratio and 1–2% higher compound returns annually.
              </p>
            </div>
          </div>
        </div>
        <DirectVsRegularVisual />
      </>
    ),
  },
  {
    id: 'growth-vs-idcw',
    title: 'Growth vs. IDCW (Dividend)',
    subtitle: 'Why Growth plans compound faster and are more tax-efficient than dividend payouts.',
    content: (
      <>
        <div className="space-y-4 mb-4">
          <p className="text-[15px] text-[#C4C4C4] font-body leading-[1.75]">
            When you invest in a mutual fund, you choose between two options for handling profits:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-[#1A1A1A] rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#00B386]" />
                <h4 className="text-[14px] font-heading font-bold text-white">Growth</h4>
              </div>
              <p className="text-[13px] text-[#8A8F98] font-body leading-relaxed">
                Profits are <span className="text-white font-heading font-medium">automatically reinvested</span>. 
                Your NAV keeps rising. No tax until you sell. Maximum compounding power.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-[16px] p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-3 h-3 rounded-full bg-[#D99A00]" />
                <h4 className="text-[14px] font-heading font-bold text-white">IDCW (Dividend)</h4>
              </div>
              <p className="text-[13px] text-[#8A8F98] font-body leading-relaxed">
                Fund periodically <span className="text-white font-heading font-medium">distributes payouts</span> to you. 
                Each payout is taxed at your income slab rate (up to 30%+). Drains capital.
              </p>
            </div>
          </div>
        </div>
        <GrowthVsIDCWVisual />
      </>
    ),
  },

  {
    id: 'decoding-groww',
    title: 'Module 2: Decoding the Groww Interface',
    subtitle: 'When you open a fund page on Groww, every metric tells a specific story.',
    content: (
      <>
        <div className="space-y-4 mb-6">
          <p className="text-[15px] text-[#C4C4C4] font-body leading-[1.75]">
            Before investing, you need to know how to read the data presented to you on platforms like Groww. We've broken down every UI element so you know exactly what to look for.
          </p>
        </div>
        <GrowwInteractiveModule2 />
      </>
    ),
  },{
    id: 'sip-mechanics',
    title: 'Module 3: Mechanics of SIP & Compounding',
    subtitle: 'Master Rupee Cost Averaging and the Groww execution lifecycle.',
    content: (
      <SIPMechanicsModule3 />
    )
  }
];

const QUIZ_QUESTIONS: QuizQuestion[] = [

    {
      question: 'What does the "Expense Ratio" of a mutual fund represent?',
      options: [
        'The amount of money the fund holds (AUM)',
        'The annual fee deducted directly from the NAV to cover operational fees',
        'A penalty for withdrawing early',
        'The expected yearly return of the fund',
      ],
      correctIndex: 1,
      explanation: 'Expense Ratio is the annual maintenance charge levied by mutual funds to finance its expenses. A lower expense ratio means more of your money is actually invested.',
    },

  {
    question: 'What is the main advantage of a Mutual Fund over a single stock?',
    options: [
      'Guaranteed higher returns',
      'Diversification — risk is spread across many stocks',
      'No expense ratio',
      'Stocks inside never fall in value',
    ],
    correctIndex: 1,
    explanation: 'Mutual Funds spread your investment across 30–80+ stocks, so one company\'s bad performance doesn\'t destroy your portfolio. They don\'t guarantee returns.',
  },
  {
    question: 'Why does a Direct Plan outperform a Regular Plan over time?',
    options: [
      'Direct Plans invest in better stocks',
      'Regular Plans have a lock-in period',
      'Direct Plans have a lower expense ratio (no distributor commission)',
      'Direct Plans get priority NAV pricing',
    ],
    correctIndex: 2,
    explanation: 'Both plans hold the exact same portfolio. The only difference is the expense ratio — Regular Plans include a distributor commission (0.5–1.5%) that compounds against you every year.',
  },
  {
    question: 'In a Growth plan, what happens to the fund\'s profits?',
    options: [
      'They are paid out to you monthly',
      'They are taxed annually at slab rate',
      'They are automatically reinvested, increasing your NAV',
      'They are donated to charity',
    ],
    correctIndex: 2,
    explanation: 'Growth plans reinvest all profits back into the fund. Your NAV rises, and you pay zero tax until you actually sell your units.',
  },
];

/* ═══════════════════════════════════════════════════
   MAIN LEARNING MODULE
   ═══════════════════════════════════════════════════ */


export const LearningModule: React.FC = () => {
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [activeLessonId, setActiveLessonId] = useState<string>(LESSONS[0].id);

  const activeLesson = LESSONS.find(l => l.id === activeLessonId) || LESSONS[0];

  const markComplete = (id: string) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  };

  const progress = (completedLessons.size / LESSONS.length) * 100;

  return (
    <div className="w-full h-full bg-[#121212] text-white overflow-hidden flex flex-col">
      {/* Header */}
      <div className="shrink-0 p-6 lg:px-10 border-b border-[#333] bg-[#1E1E1E]">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-[#00D09C]/15 text-[#00D09C] text-[11px] font-heading font-bold uppercase tracking-widest px-3 py-1 rounded-[8px]">
            Learning Center
          </div>
          <span className="text-[12px] text-[#A1A1AA] font-body">{completedLessons.size} of {LESSONS.length} modules complete</span>
        </div>
        <h1 className="text-[28px] font-bold tracking-[-0.03em] text-white font-heading">
          Foundations of Markets & Mutual Funds
        </h1>
        <div className="mt-4">
          <div className="h-1.5 w-64 bg-[#262626] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#00D09C] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 lg:p-10 pb-32">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 border-b border-[#333] pb-6">
              <h2 className="text-[32px] font-heading font-bold text-white mb-2">{activeLesson.title}</h2>
              <p className="text-[16px] text-[#A1A1AA] font-body">{activeLesson.subtitle}</p>
            </div>
            
            <div className="text-white">
              {activeLesson.content}
            </div>

            <div className="mt-12 pt-8 border-t border-[#333] flex justify-between items-center">
              {!completedLessons.has(activeLesson.id) ? (
                <button
                  onClick={() => markComplete(activeLesson.id)}
                  className="inline-flex items-center gap-2 bg-[#00D09C] hover:bg-[#00D09C]/80 text-[#0D1117] px-6 py-3 rounded-[14px] text-[14px] font-heading font-semibold transition-all duration-[180ms]"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Mark as Complete
                </button>
              ) : (
                <div className="flex items-center gap-2 text-[#00D09C]">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="text-[14px] font-heading font-semibold">Completed</span>
                </div>
              )}
            </div>

            {/* If it's the last lesson, show quiz at the bottom */}
            {activeLessonId === LESSONS[LESSONS.length - 1].id && (
              <div className="mt-16 pt-8 border-t border-[#333]">
                <h2 className="text-[20px] font-heading font-bold text-white mb-5">Test Your Understanding</h2>
                <KnowledgeCheck questions={QUIZ_QUESTIONS} />
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Module Navigation */}
        <div className="w-full lg:w-[380px] shrink-0 border-l border-[#333] bg-[#1E1E1E] overflow-y-auto custom-scrollbar p-6">
          <h3 className="text-[14px] font-heading font-bold text-[#8A8F98] uppercase tracking-wider mb-4">Course Modules</h3>
          <div className="space-y-3">
            {LESSONS.map((lesson, idx) => {
              const isActive = activeLessonId === lesson.id;
              const isComplete = completedLessons.has(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`w-full flex items-start gap-4 p-4 rounded-[16px] text-left transition-all duration-200 ${isActive ? 'bg-[#262626] ring-1 ring-[#00D09C]/30' : 'hover:bg-[#222]'}`}
                >
                  <div className="shrink-0 mt-0.5">
                    {isComplete ? (
                      <CheckCircle2 className="w-5 h-5 text-[#00D09C]" />
                    ) : (
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${isActive ? 'border-[#00D09C] text-[#00D09C]' : 'border-[#444] text-[#8A8F98]'}`}>
                        {idx + 1}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className={`text-[14px] font-heading font-bold mb-1 ${isActive ? 'text-white' : 'text-[#C4C4C4]'}`}>{lesson.title}</h4>
                    <p className="text-[12px] text-[#71717A] line-clamp-2 leading-relaxed">{lesson.subtitle}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
