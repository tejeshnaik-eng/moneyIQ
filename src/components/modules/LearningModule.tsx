import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowRight, TrendingUp, PieChart, BookOpen, ArrowLeft,
  CheckCircle2, CheckCircle, Star, ChevronDown, ChevronUp,
  Sparkles, FlaskConical
} from 'lucide-react';
import { allLearningConcepts } from '../../data/learningConcepts';
import { LearningConcept } from '../../types/learning';

// ─── Token palette ────────────────────────────────────────────────
// Surface:     #F5F5F7  (app-surface-alt)
// Surface-0:   #FFFFFF  (white cards)
// Border:      #E5E5EA
// Text:        #1D1D1F
// Text-muted:  #6E6E73
// Primary:     var(--primary)   teal brand
// Secondary:   var(--secondary) amethyst
// Bull green:  #1C7C4A
// Bear red:    #BA1A1A
// MA-20:       #3B82F6
// MA-50:       #F59E0B
// ─────────────────────────────────────────────────────────────────

// Deterministic OHLC data – no Math.random() on render to avoid re-render shimmer
const CANDLES = Array.from({ length: 48 }, (_, i) => {
  const seed = Math.sin(i * 2.7 + 1.4);
  const seed2 = Math.cos(i * 1.9 + 0.8);
  const base = 240 + seed * 55 + seed2 * 25;
  const isUp = Math.cos(i * 0.6) > -0.1;
  const bodyH = 8 + Math.abs(seed2) * 22;
  const open = base;
  const close = isUp ? base - bodyH : base + bodyH;
  const wick1 = Math.abs(seed) * 14;
  const wick2 = Math.abs(seed2) * 10;
  const high = Math.min(open, close) - wick1;
  const low = Math.max(open, close) + wick2;
  const volH = 18 + Math.abs(seed) * 58;
  return { x: i * 20 + 10, open, close, high, low, isUp, volH };
});

// Two MA paths derived from candle closes
const ma20Path = (() => {
  const pts = CANDLES.map((c, i) => {
    const start = Math.max(0, i - 19);
    const avg = CANDLES.slice(start, i + 1).reduce((s, c2) => s + c2.close, 0) / (i - start + 1);
    return `${i === 0 ? 'M' : 'L'}${c.x},${avg}`;
  });
  return pts.join(' ');
})();

const ma50Path = (() => {
  const pts = CANDLES.map((c, i) => {
    const start = Math.max(0, i - 49);
    const avg = CANDLES.slice(start, i + 1).reduce((s, c2) => s + c2.close, 0) / (i - start + 1);
    return `${i === 0 ? 'M' : 'L'}${c.x},${avg + 16}`;
  });
  return pts.join(' ');
})();

// Crossover point (where 20D was below 50D and crosses above)
const CROSSOVER_X = CANDLES[28].x;
const CROSSOVER_Y = CANDLES[28].close;

// ─── Interactive Chart ────────────────────────────────────────────
type MAToggle = { ma20: boolean; ma50: boolean; ema: boolean };

const CandlestickChart: React.FC<{ maToggles: MAToggle; hoveredIdx: number | null; onHover: (i: number | null) => void }> = ({ maToggles, hoveredIdx, onHover }) => {
  const hovered = hoveredIdx !== null ? CANDLES[hoveredIdx] : null;

  return (
    <div className="relative flex-1 min-h-0 bg-[#FAFAFA]">
      {/* Hover tooltip */}
      {hovered && (
        <div className="absolute top-3 left-3 z-20 bg-[#FFFFFF] border border-[#E5E5EA] rounded-xl p-3 text-xs font-mono shadow-sm pointer-events-none">
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <span className="text-[#6E6E73]">Open</span><span className="font-semibold text-[#1D1D1F]">{hovered.open.toFixed(2)}</span>
            <span className="text-[#6E6E73]">High</span><span className="font-semibold text-[#1D1D1F]">{hovered.high.toFixed(2)}</span>
            <span className="text-[#6E6E73]">Low</span><span className="font-semibold text-[#1D1D1F]">{hovered.low.toFixed(2)}</span>
            <span className="text-[#6E6E73]">Close</span><span className={`font-semibold ${hovered.isUp ? 'text-[#1C7C4A]' : 'text-[#BA1A1A]'}`}>{hovered.close.toFixed(2)}</span>
          </div>
          {maToggles.ma20 && <div className="flex items-center gap-1.5 mt-2"><span className="w-2 h-2 rounded-full bg-[#3B82F6] inline-block"></span><span className="text-[#6E6E73]">MA20:</span><span className="font-semibold">{(hovered.close + 4).toFixed(1)}</span></div>}
          {maToggles.ma50 && <div className="flex items-center gap-1.5 mt-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B] inline-block"></span><span className="text-[#6E6E73]">MA50:</span><span className="font-semibold">{(hovered.close + 18).toFixed(1)}</span></div>}
        </div>
      )}

      {/* Golden Cross annotation */}
      <div className="absolute top-3 right-3 z-20 bg-[#FFFFFF] border border-[#E5E5EA] rounded-xl px-3 py-2 text-xs shadow-sm pointer-events-none">
        <div className="font-heading font-semibold text-[#004E9F] text-xs">Golden Cross</div>
        <div className="text-[#6E6E73] text-[11px]">20D crosses above 50D</div>
      </div>

      <svg
        className="w-full h-full"
        viewBox="0 0 980 340"
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block' }}
      >
        {/* Horizontal price grid */}
        {[60, 120, 180, 240, 300].map(y => (
          <line key={y} x1="0" y1={y} x2="980" y2={y} stroke="#E5E5EA" strokeWidth="1" strokeDasharray="3 4" />
        ))}
        {/* Price axis labels */}
        {[60, 120, 180, 240, 300].map((y, i) => (
          <text key={y} x="970" y={y - 3} textAnchor="end" fontSize="9" fill="#6E6E73" fontFamily="'Hedvig Letters Sans', sans-serif">
            {(320 - y + 100).toFixed(0)}
          </text>
        ))}

        {/* Volume bars */}
        <g opacity="0.18">
          {CANDLES.map((c, i) => (
            <rect
              key={`vol-${i}`}
              x={c.x - 5}
              y={300 - c.volH * 0.6}
              width="10"
              height={c.volH * 0.6}
              fill={c.isUp ? '#1C7C4A' : '#BA1A1A'}
            />
          ))}
        </g>

        {/* MA lines */}
        {maToggles.ma50 && (
          <path d={ma50Path} fill="none" stroke="#F59E0B" strokeWidth="1.5" strokeLinejoin="round" opacity="0.85" />
        )}
        {(maToggles.ma20 || maToggles.ema) && (
          <path d={ma20Path} fill="none" stroke={maToggles.ema ? '#8B5CF6' : '#3B82F6'} strokeWidth="1.5" strokeLinejoin="round" opacity="0.85" />
        )}

        {/* Candlesticks */}
        {CANDLES.map((c, i) => {
          const isHovered = hoveredIdx === i;
          return (
            <g
              key={`c-${i}`}
              onMouseEnter={() => onHover(i)}
              onMouseLeave={() => onHover(null)}
              style={{ cursor: 'crosshair' }}
            >
              {/* Invisible hit area */}
              <rect x={c.x - 9} y={c.high} width="18" height={c.low - c.high} fill="transparent" />
              {/* Wick */}
              <line x1={c.x} y1={c.high} x2={c.x} y2={c.low} stroke={c.isUp ? '#1C7C4A' : '#BA1A1A'} strokeWidth="1.2" />
              {/* Body */}
              <rect
                x={c.x - 4.5}
                y={Math.min(c.open, c.close)}
                width="9"
                height={Math.max(2, Math.abs(c.open - c.close))}
                fill={c.isUp ? '#1C7C4A' : '#BA1A1A'}
                opacity={isHovered ? 1 : 0.88}
              />
              {/* Hover highlight */}
              {isHovered && (
                <line x1={c.x} y1="0" x2={c.x} y2="310" stroke="#6E6E73" strokeWidth="1" strokeDasharray="4 3" opacity="0.4" />
              )}
            </g>
          );
        })}

        {/* Golden cross marker */}
        <circle cx={CROSSOVER_X} cy={CROSSOVER_Y} r="10" fill="none" stroke="#7E57C2" strokeWidth="1.5" strokeDasharray="3 2" />
        <circle cx={CROSSOVER_X} cy={CROSSOVER_Y} r="3" fill="#7E57C2" />

        {/* Time axis labels */}
        {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'].map((m, i) => (
          <text key={m} x={i * 120 + 60} y="325" textAnchor="middle" fontSize="9" fill="#6E6E73" fontFamily="'Hedvig Letters Sans', sans-serif">{m}</text>
        ))}
      </svg>
    </div>
  );
};

// ─── Accordion section ────────────────────────────────────────────
const AccordionSection: React.FC<{ index: number; title: string; body: string; defaultOpen?: boolean }> = ({ index, title, body, defaultOpen }) => {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="rounded-xl border border-[#E5E5EA] bg-[#FFFFFF] overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-3.5 text-left hover:bg-[#F5F5F7] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-mono text-[#6E6E73] bg-[#F5F5F7] px-2 py-0.5 rounded-md font-semibold">{String(index).padStart(2, '0')}</span>
          <span className="font-heading font-semibold text-[15px] text-[#1D1D1F]">{title}</span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#6E6E73] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-[#6E6E73] shrink-0" />
        }
      </button>
      {open && (
        <div className="px-4 pb-4 pt-2 border-t border-[#E5E5EA] text-[14px] text-[#1D1D1F] leading-[1.55] font-body">
          {body}
        </div>
      )}
    </div>
  );
};

// ─── Chart Thumbnail (for Home view cards) ────────────────────────
const ChartThumbnail = () => (
  <div className="bg-[#FFFFFF] p-2 rounded-xl border border-[#E5E5EA] w-full h-full flex flex-col overflow-hidden">
    <div className="text-[7px] font-bold text-center mb-1.5 text-[#6E6E73] tracking-wider font-mono">SUPPORT AND RESISTANCE</div>
    <div className="flex-1 relative">
      <svg className="w-full h-full" viewBox="0 0 200 80" preserveAspectRatio="none">
        <line x1="0" y1="65" x2="200" y2="65" stroke="#1C7C4A" strokeDasharray="3" strokeWidth="1" opacity="0.5" />
        <line x1="0" y1="15" x2="200" y2="15" stroke="#BA1A1A" strokeDasharray="3" strokeWidth="1" opacity="0.5" />
        {[15, 35, 55, 75, 95, 115, 135, 155, 175].map((x, i) => {
          const seed = Math.sin(i * 2.2 + 0.5);
          const base = 40 + seed * 18;
          const isUp = seed > 0;
          return (
            <g key={x}>
              <line x1={x} y1={base - 8} x2={x} y2={base + 8} stroke={isUp ? '#1C7C4A' : '#BA1A1A'} strokeWidth="1" />
              <rect x={x - 4} y={isUp ? base - 5 : base} width="8" height="5" fill={isUp ? '#1C7C4A' : '#BA1A1A'} />
            </g>
          );
        })}
        <path d="M15,40 Q60,25 100,42 T185,28" fill="none" stroke="#7E57C2" strokeWidth="1.2" strokeDasharray="2" opacity="0.7" />
      </svg>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────
export const LearningModule: React.FC = () => {
  const [view, setView] = useState<'home' | 'lesson' | 'quiz'>('home');
  const [activeConceptId, setActiveConceptId] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [maToggles, setMaToggles] = useState<MAToggle>({ ma20: true, ma50: true, ema: false });
  const [hoveredCandleIdx, setHoveredCandleIdx] = useState<number | null>(null);
  const [askAIOpen, setAskAIOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('finsight_learning_progress');
    if (saved) setCompletedTopics(JSON.parse(saved));
  }, []);

  const saveProgress = (topicId: string) => {
    if (!completedTopics.includes(topicId)) {
      const next = [...completedTopics, topicId];
      setCompletedTopics(next);
      localStorage.setItem('finsight_learning_progress', JSON.stringify(next));
    }
  };

  const goHome = useCallback(() => {
    setView('home');
    setActiveConceptId(null);
    setSelectedQuizOption(null);
    setQuizFeedback(null);
    setAskAIOpen(false);
  }, []);

  const totalConcepts = Math.max(30, allLearningConcepts.length);
  const progressPercent = Math.round((completedTopics.length / totalConcepts) * 100) || 0;
  const activeConcept = allLearningConcepts.find(c => c.id === activeConceptId);

  // ─── LESSON VIEW ─────────────────────────────────────────────────
  if (view === 'lesson' && activeConcept?.lessonContent) {
    const allInCategory = allLearningConcepts.filter(c => c.category === activeConcept.category);
    const currentIdx = allInCategory.findIndex(c => c.id === activeConcept.id) + 1;
    const total = allInCategory.length;
    const nextConcept = allInCategory[currentIdx];
    const paragraphs = activeConcept.lessonContent.explanation.split('\n\n').filter(p => p.trim());
    const sectionTitles = ['Core Concept', 'Deep Dive', 'Practical Application', 'Key Takeaway'];
    const lastOHLC = CANDLES[CANDLES.length - 1];

    return (
      // Outer wrapper: fills the module area exactly, no overflow
      <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] overflow-hidden bg-[#F5F5F7]">

        {/* ── STICKY HEADER ── */}
        <header className="bg-[#FFFFFF] border-b border-[#E5E5EA] px-6 pt-4 pb-3 shrink-0">
          <button
            onClick={goHome}
            className="flex items-center gap-1.5 text-[#004E9F] hover:opacity-75 transition-opacity text-[13px] font-semibold mb-3"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Learning Curriculum
          </button>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="font-heading font-semibold text-[26px] leading-tight tracking-tight text-[#1D1D1F]">
                {activeConcept.title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-[12px] font-semibold text-[#6E6E73] uppercase tracking-widest">
                <span>Lesson {String(currentIdx).padStart(2, '0')}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-[#6E6E73]"></span>
                <span>{activeConcept.difficulty}</span>
                <span className="w-[3px] h-[3px] rounded-full bg-[#6E6E73]"></span>
                <span>{activeConcept.durationMinutes} Min</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[12px] font-semibold text-[#6E6E73] uppercase tracking-widest">
                {currentIdx} of {total} concepts
              </span>
              <div className="w-32 h-[3px] bg-[#E5E5EA] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#7E57C2] rounded-full transition-all duration-700"
                  style={{ width: `${(currentIdx / total) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* ── WORKSPACE (fills remaining height) ── */}
        <div className="flex-1 flex flex-row min-h-0 gap-0 overflow-hidden">

          {/* LEFT: Chart (62%) */}
          <div className="flex flex-col min-w-0 border-r border-[#E5E5EA] bg-[#FFFFFF]" style={{ flex: '0 0 62%' }}>

            {/* Chart toolbar */}
            <div className="flex items-center gap-2 px-4 py-2 border-b border-[#E5E5EA] bg-[#F5F5F7] shrink-0">
              {/* SMA / EMA toggle */}
              <div className="flex bg-[#E5E5EA] rounded-full p-0.5 shrink-0">
                <button
                  onClick={() => setMaToggles(t => ({ ...t, ema: false }))}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${!maToggles.ema ? 'bg-[#FFFFFF] text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73]'}`}
                >SMA</button>
                <button
                  onClick={() => setMaToggles(t => ({ ...t, ema: true }))}
                  className={`px-3 py-1 rounded-full text-[12px] font-semibold transition-all ${maToggles.ema ? 'bg-[#FFFFFF] text-[#1D1D1F] shadow-sm' : 'text-[#6E6E73]'}`}
                >EMA</button>
              </div>

              <div className="w-px h-4 bg-[#E5E5EA] mx-1 shrink-0" />

              {/* Period toggles */}
              {[
                { key: 'ma20' as keyof MAToggle, label: '20D', color: '#3B82F6' },
                { key: 'ma50' as keyof MAToggle, label: '50D', color: '#F59E0B' },
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setMaToggles(t => ({ ...t, [key]: !t[key] }))}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold border transition-all ${
                    maToggles[key]
                      ? 'bg-[#FFFFFF] border-[#E5E5EA] text-[#1D1D1F] shadow-sm'
                      : 'bg-transparent border-[#E5E5EA] text-[#6E6E73] opacity-60'
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                  {label}
                </button>
              ))}

              {/* OHLC readout */}
              <div className="ml-auto flex items-center gap-3 text-[12px] font-mono text-[#6E6E73] shrink-0">
                <span>O:<span className="text-[#1D1D1F] font-semibold ml-0.5">{lastOHLC.open.toFixed(1)}</span></span>
                <span>H:<span className="text-[#1D1D1F] font-semibold ml-0.5">{lastOHLC.high.toFixed(1)}</span></span>
                <span>L:<span className="text-[#1D1D1F] font-semibold ml-0.5">{lastOHLC.low.toFixed(1)}</span></span>
                <span>C:<span className="text-[#1C7C4A] font-semibold ml-0.5">{lastOHLC.close.toFixed(1)}</span></span>
              </div>
            </div>

            {/* Chart canvas */}
            <CandlestickChart
              maToggles={maToggles}
              hoveredIdx={hoveredCandleIdx}
              onHover={setHoveredCandleIdx}
            />

            {/* Try It Yourself (below chart) */}
            <div className="shrink-0 border-t border-[#E5E5EA] px-5 py-4 bg-[#FFFFFF]">
              <div className="flex items-center gap-2 mb-3">
                <FlaskConical className="w-4 h-4 text-[#004E9F]" />
                <h3 className="font-heading font-semibold text-[15px] text-[#1D1D1F]">Try It Yourself</h3>
              </div>
              {nextConcept?.quizContent ? (
                <>
                  <p className="text-[13px] text-[#6E6E73] mb-3 leading-snug">{nextConcept.quizContent.question}</p>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {nextConcept.quizContent.options.map((opt) => {
                      const isSelected = selectedQuizOption === opt.id;
                      const isCorrect = opt.isCorrect;
                      return (
                        <button
                          key={opt.id}
                          disabled={selectedQuizOption !== null}
                          onClick={() => {
                            setSelectedQuizOption(opt.id);
                            setQuizFeedback(opt.explanation);
                            if (opt.isCorrect) saveProgress(nextConcept.id);
                          }}
                          className={`px-4 py-2 rounded-full text-[13px] font-semibold transition-all border ${
                            isSelected && isCorrect
                              ? 'bg-[#1C7C4A] text-[#FFFFFF] border-[#1C7C4A]'
                              : isSelected && !isCorrect
                              ? 'bg-[#BA1A1A]/10 text-[#BA1A1A] border-[#BA1A1A]'
                              : selectedQuizOption
                              ? 'bg-[#F5F5F7] text-[#6E6E73] border-[#E5E5EA] opacity-50'
                              : 'bg-[#F5F5F7] text-[#1D1D1F] border-[#E5E5EA] hover:border-[#7E57C2] hover:text-[#7E57C2]'
                          }`}
                        >
                          {isSelected && isCorrect && <CheckCircle2 className="inline w-3.5 h-3.5 mr-1.5 -mt-px" />}
                          {opt.text}
                        </button>
                      );
                    })}
                  </div>
                  {quizFeedback && (
                    <div className="bg-[#F5F5F7] rounded-xl px-4 py-3 text-[13px] text-[#1D1D1F] leading-snug">
                      <span className="font-semibold text-[#1D1D1F]">Why? </span>
                      {quizFeedback}
                    </div>
                  )}
                </>
              ) : (
                <p className="text-[13px] text-[#6E6E73]">Toggle EMA in the chart above and observe how it tracks price changes faster than SMA.</p>
              )}
            </div>
          </div>

          {/* RIGHT: Learning panel (38%) */}
          <div
            className="flex flex-col min-h-0 overflow-y-auto bg-[#F5F5F7]"
            style={{ flex: '0 0 38%', scrollbarWidth: 'thin', scrollbarColor: '#D2D2D7 transparent' }}
          >
            <div className="p-5 flex flex-col gap-4">

              {/* What you'll learn */}
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] p-4">
                <h2 className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-widest mb-3">What You'll Learn</h2>
                <ul className="flex flex-col gap-2.5">
                  {activeConcept.lessonContent.whatYouWillLearn.split(', ').map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1C7C4A] shrink-0 mt-0.5" />
                      <span className="text-[14px] text-[#1D1D1F] leading-snug">{item.trim().replace(/^and\s/i, '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Ask AI button */}
              <button
                onClick={() => setAskAIOpen(o => !o)}
                className="flex items-center justify-center gap-2 w-full bg-[#7E57C2] hover:bg-[#6D46B3] text-[#FFFFFF] font-heading font-semibold text-[14px] px-4 py-3 rounded-xl transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Ask AI about this concept
              </button>

              {askAIOpen && (
                <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E5EA] p-4 text-[13px] text-[#6E6E73] leading-relaxed">
                  <p className="text-[#1D1D1F] font-semibold mb-2">AI Explainer</p>
                  <p>Moving averages smooth price noise by calculating the arithmetic mean over a rolling window. A shorter window (e.g. 20D) is more reactive; a longer window (e.g. 200D) reveals the macro trend. EMA assigns exponentially declining weights to older prices — making it faster to respond to recent moves than a simple average.</p>
                  <p className="mt-2">A <strong>Golden Cross</strong> — when the 50D MA rises above the 200D MA — is historically treated as a bullish regime signal, though it lags by nature.</p>
                </div>
              )}

              {/* Accordion lesson sections */}
              <div className="flex flex-col gap-2">
                {paragraphs.slice(0, 4).map((para, i) => (
                  <AccordionSection
                    key={i}
                    index={i + 1}
                    title={sectionTitles[i] ?? `Concept ${i + 1}`}
                    body={para}
                    defaultOpen={i === 0}
                  />
                ))}
              </div>

            </div>
          </div>
        </div>

        {/* ── FOOTER NAVIGATION ── */}
        <footer className="bg-[#FFFFFF] border-t border-[#E5E5EA] px-6 py-3 flex items-center justify-between shrink-0">
          <button
            onClick={goHome}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#1D1D1F] bg-[#F5F5F7] hover:bg-[#E5E5EA] px-5 py-2 rounded-full transition-colors border border-[#E5E5EA]"
          >
            <ArrowLeft className="w-4 h-4" /> Previous
          </button>
          <span className="font-heading text-[12px] font-semibold text-[#6E6E73] uppercase tracking-widest hidden sm:block">
            Concept {currentIdx} / {total}
          </span>
          <button
            onClick={() => {
              saveProgress(activeConcept.id);
              goHome();
            }}
            className="flex items-center gap-2 text-[14px] font-semibold text-[#FFFFFF] bg-[#004E9F] hover:opacity-90 transition-opacity px-5 py-2 rounded-full"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
    );
  }

  // ─── QUIZ VIEW ────────────────────────────────────────────────────
  if (view === 'quiz' && activeConcept?.quizContent) {
    const allInCategory = allLearningConcepts.filter(c => c.category === activeConcept.category);
    const currentIdx = allInCategory.findIndex(c => c.id === activeConcept.id) + 1;
    const total = allInCategory.length;
    const isCorrectAnswer = selectedQuizOption
      ? activeConcept.quizContent.options.find(o => o.id === selectedQuizOption)?.isCorrect
      : null;

    return (
      <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] overflow-hidden bg-[#F5F5F7]">

        {/* Header */}
        <header className="bg-[#FFFFFF] border-b border-[#E5E5EA] px-6 pt-4 pb-3 shrink-0">
          <button onClick={goHome} className="flex items-center gap-1.5 text-[#004E9F] hover:opacity-75 transition-opacity text-[13px] font-semibold mb-3">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Curriculum
          </button>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="font-heading font-semibold text-[22px] tracking-tight text-[#1D1D1F]">{activeConcept.title}</h1>
              <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-[#6E6E73] uppercase tracking-widest">
                <span>Quiz</span>
                <span className="w-[3px] h-[3px] rounded-full bg-[#6E6E73]"></span>
                <span>{activeConcept.difficulty}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 shrink-0">
              <span className="text-[12px] font-semibold text-[#6E6E73] uppercase tracking-widest">{currentIdx} of {total}</span>
              <div className="w-32 h-[3px] bg-[#E5E5EA] rounded-full overflow-hidden">
                <div className="h-full bg-[#7E57C2] rounded-full" style={{ width: `${(currentIdx / total) * 100}%` }} />
              </div>
            </div>
          </div>
        </header>

        {/* Quiz body */}
        <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-6 max-w-[780px] mx-auto w-full">
          <h2 className="font-heading font-semibold text-[22px] leading-snug text-[#1D1D1F]">
            {activeConcept.quizContent.question}
          </h2>

          <div className="flex flex-col gap-3">
            {activeConcept.quizContent.options.map((opt, i) => {
              const letter = String.fromCharCode(65 + i);
              const isSelected = selectedQuizOption === opt.id;
              return (
                <button
                  key={opt.id}
                  disabled={selectedQuizOption !== null}
                  onClick={() => {
                    setSelectedQuizOption(opt.id);
                    setQuizFeedback(opt.explanation);
                    if (opt.isCorrect) saveProgress(activeConcept.id);
                  }}
                  className={`w-full text-left px-5 py-4 rounded-xl border text-[15px] font-semibold transition-all ${
                    isSelected && opt.isCorrect
                      ? 'border-[#1C7C4A] bg-[#1C7C4A]/8 text-[#1C7C4A]'
                      : isSelected && !opt.isCorrect
                      ? 'border-[#BA1A1A] bg-[#BA1A1A]/8 text-[#BA1A1A]'
                      : selectedQuizOption
                      ? 'border-[#E5E5EA] bg-[#FFFFFF] text-[#6E6E73] opacity-50'
                      : 'border-[#E5E5EA] bg-[#FFFFFF] text-[#1D1D1F] hover:border-[#7E57C2]'
                  }`}
                >
                  <span className="text-[#6E6E73] mr-3">{letter}.</span>
                  {opt.text}
                </button>
              );
            })}
          </div>

          {quizFeedback && (
            <div className={`p-5 rounded-xl border ${isCorrectAnswer ? 'border-[#1C7C4A] bg-[#1C7C4A]/8' : 'border-[#BA1A1A] bg-[#BA1A1A]/8'}`}>
              <span className="font-semibold text-[14px]" style={{ color: isCorrectAnswer ? '#1C7C4A' : '#BA1A1A' }}>
                {isCorrectAnswer ? 'Correct! ' : 'Not quite — '}
              </span>
              <span className="text-[14px] text-[#1D1D1F]">{quizFeedback}</span>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={goHome}
                  className="flex items-center gap-2 bg-[#7E57C2] hover:bg-[#6D46B3] text-[#FFFFFF] font-heading font-semibold text-[14px] px-5 py-2.5 rounded-full transition-colors"
                >
                  Back to Curriculum <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── HOME VIEW ────────────────────────────────────────────────────
  const technicalConcepts = allLearningConcepts.filter(c => c.category === 'Technical Analysis');
  const fundamentalConcepts = allLearningConcepts.filter(c => c.category === 'Fundamental Analysis');
  const portfolioConcepts = allLearningConcepts.filter(c => c.category === 'Portfolio Strategy');
  const featuredConcept = technicalConcepts[0];

  const renderHorizontalCard = (concept: LearningConcept) => {
    const isCompleted = completedTopics.includes(concept.id);
    return (
      <div
        key={concept.id}
        className="bg-[#FFFFFF] hover:bg-[#F5F5F7] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-5 mb-4 border border-[#E5E5EA] transition-colors group cursor-pointer"
        onClick={() => { setActiveConceptId(concept.id); setView(concept.type); }}
      >
        <div className="flex-1">
          {isCompleted && (
            <div className="inline-flex items-center gap-1 bg-[#1C7C4A]/10 text-[#1C7C4A] font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full mb-2">
              <CheckCircle className="w-3 h-3" /> Completed
            </div>
          )}
          <h3 className="text-[17px] font-heading font-semibold text-[#1D1D1F] mb-2 group-hover:text-[#7E57C2] transition-colors leading-snug">{concept.title}</h3>
          <p className="text-[13px] text-[#6E6E73] leading-relaxed line-clamp-2">{concept.description}</p>
        </div>
        <div className="w-full sm:w-[180px] h-[110px] shrink-0 hidden sm:block rounded-xl overflow-hidden">
          <ChartThumbnail />
        </div>
      </div>
    );
  };

  return (
    <div className="w-full max-w-[1280px] mx-auto px-6 py-8 flex flex-col lg:flex-row gap-10">

      {/* LEFT SIDEBAR: Progress + Featured */}
      <div className="w-full lg:w-[360px] shrink-0 flex flex-col gap-6 lg:sticky lg:top-8 self-start">

        {/* Progress card */}
        <div className="bg-[#FFFFFF] rounded-2xl p-7 border border-[#E5E5EA]">
          <h3 className="text-[11px] font-semibold text-[#6E6E73] uppercase tracking-widest mb-4">Your Progress</h3>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="font-heading font-bold text-[64px] leading-none text-[#1D1D1F]">{completedTopics.length}</span>
            <span className="text-[17px] font-medium text-[#6E6E73]">of {totalConcepts} completed</span>
          </div>
          <div className="w-full h-[3px] bg-[#E5E5EA] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#7E57C2] rounded-full transition-all duration-700"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Featured card */}
        {featuredConcept && (
          <div className="bg-[#7E57C2]/8 rounded-2xl p-6 border border-[#7E57C2]/20">
            <div className="inline-flex items-center gap-1.5 bg-[#FFFFFF] text-[#7E57C2] font-bold text-[10px] uppercase tracking-widest px-2.5 py-1 rounded-full mb-4">
              <Star className="w-3 h-3" fill="currentColor" /> Featured
            </div>
            <h2 className="font-heading font-semibold text-[22px] text-[#1D1D1F] mb-2 leading-tight">{featuredConcept.title}</h2>
            <p className="text-[13px] text-[#6E6E73] mb-5 leading-relaxed line-clamp-3">{featuredConcept.description}</p>
            <div className="w-full h-[160px] mb-5 rounded-xl overflow-hidden">
              <ChartThumbnail />
            </div>
            <button
              onClick={() => { setActiveConceptId(featuredConcept.id); setView(featuredConcept.type); }}
              className="w-full flex items-center justify-center gap-2 bg-[#7E57C2] hover:bg-[#6D46B3] text-[#FFFFFF] font-heading font-semibold text-[14px] px-5 py-3 rounded-xl transition-colors"
            >
              Continue Learning <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* RIGHT: Course content */}
      <div className="flex-1 flex flex-col gap-12">
        <header className="hidden lg:block">
          <h1 className="font-heading font-semibold text-[42px] leading-none tracking-tight text-[#1D1D1F]">Learn investing.</h1>
          <p className="font-heading text-[28px] text-[#6E6E73] font-normal tracking-tight">Understand the market.</p>
        </header>

        {[
          { title: 'Technical Analysis', icon: <TrendingUp className="w-5 h-5" />, concepts: technicalConcepts.slice(1, 5) },
          { title: 'Fundamental Analysis', icon: <BookOpen className="w-5 h-5" />, concepts: fundamentalConcepts.slice(0, 4) },
          { title: 'Portfolio Strategy', icon: <PieChart className="w-5 h-5" />, concepts: portfolioConcepts.slice(0, 4) },
        ].map(section => (
          <section key={section.title}>
            <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[#E5E5EA]">
              <div className="w-9 h-9 rounded-xl bg-[#7E57C2]/10 text-[#7E57C2] flex items-center justify-center shrink-0">
                {section.icon}
              </div>
              <h2 className="font-heading font-semibold text-[22px] text-[#1D1D1F] tracking-tight">{section.title}</h2>
            </div>
            {section.concepts.map(c => renderHorizontalCard(c))}
          </section>
        ))}
      </div>
    </div>
  );
};
