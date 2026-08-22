import React, { useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   SHARED COMPONENTS
   ═══════════════════════════════════════════════════ */

const SliderInput: React.FC<{
  label: string; value: number; min: number; max: number; step: number;
  prefix?: string; suffix?: string; onChange: (v: number) => void;
}> = ({ label, value, min, max, step, prefix = '', suffix = '', onChange }) => (
  <div className="mb-6">
    <div className="flex justify-between items-baseline mb-2">
      <span className="text-[13px] text-[#A1A1AA] font-body">{label}</span>
      <span className="text-[15px] text-white font-heading font-semibold">{prefix}{value.toLocaleString('en-IN')}{suffix}</span>
    </div>
    <input
      type="range" min={min} max={max} step={step} value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-[#00B386]"
      style={{ background: `linear-gradient(to right, #00B386 ${((value - min) / (max - min)) * 100}%, #333 ${((value - min) / (max - min)) * 100}%)` }}
    />
  </div>
);

const ResultRow: React.FC<{ label: string; value: string; accent?: string }> = ({ label, value, accent }) => (
  <div className="flex justify-between items-center py-3 border-b border-[#2A2A2A] last:border-b-0">
    <span className="text-[13px] text-[#8A8F98] font-body">{label}</span>
    <span className="text-[16px] font-heading font-bold" style={{ color: accent || '#fff' }}>{value}</span>
  </div>
);

const fmt = (n: number) => '₹' + n.toLocaleString('en-IN', { maximumFractionDigits: 0 });
const fmtPct = (n: number) => n.toFixed(2) + '%';

/* Donut Chart */
const DonutChart: React.FC<{ slices: { value: number; color: string; label: string }[]; size?: number }> = ({ slices, size = 160 }) => {
  const total = slices.reduce((s, sl) => s + sl.value, 0);
  if (total === 0) return null;
  const r = 56; const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex flex-col items-center gap-4">
      <svg width={size} height={size} viewBox="0 0 160 160">
        {slices.map((sl, i) => {
          const pct = sl.value / total;
          const dashLen = pct * c;
          const el = (
            <circle key={i} cx="80" cy="80" r={r} fill="none" stroke={sl.color}
              strokeWidth="16" strokeDasharray={`${dashLen} ${c - dashLen}`}
              strokeDashoffset={-offset} strokeLinecap="round" transform="rotate(-90 80 80)" />
          );
          offset += dashLen;
          return el;
        })}
        <text x="80" y="74" textAnchor="middle" fill="#fff" fontSize="18" fontWeight="700" fontFamily="Outfit">{fmt(total)}</text>
        <text x="80" y="94" textAnchor="middle" fill="#8A8F98" fontSize="11" fontFamily="Hedvig Letters Sans">Total</text>
      </svg>
      <div className="flex flex-wrap gap-4 justify-center">
        {slices.map((sl, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sl.color }} />
            <span className="text-[12px] text-[#A1A1AA] font-body">{sl.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* Bar Chart */
const BarChart: React.FC<{ bars: { label: string; invested: number; returns: number }[] }> = ({ bars }) => {
  const maxVal = Math.max(...bars.map(b => b.invested + b.returns), 1);
  return (
    <div className="flex items-end gap-2 h-[140px]">
      {bars.map((b, i) => {
        const invH = (b.invested / maxVal) * 120;
        const retH = (b.returns / maxVal) * 120;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center justify-end" style={{ height: 120 }}>
              <div className="w-full max-w-[28px] rounded-t-md" style={{ height: retH, backgroundColor: '#00B386' }} />
              <div className="w-full max-w-[28px] rounded-b-md" style={{ height: invH, backgroundColor: '#2775E8' }} />
            </div>
            <span className="text-[10px] text-[#8A8F98] font-body mt-1">{b.label}</span>
          </div>
        );
      })}
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SIP CALCULATOR
   ═══════════════════════════════════════════════════ */
const SIPCalculator: React.FC = () => {
  const [monthly, setMonthly] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const invested = monthly * n;
    const fv = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
    const returns = fv - invested;
    // Yearly breakdown for chart
    const yearlyBars = [];
    for (let y = 1; y <= Math.min(years, 10); y++) {
      const mn = y * 12;
      const totalInv = monthly * mn;
      const totalFV = monthly * ((Math.pow(1 + r, mn) - 1) / r) * (1 + r);
      yearlyBars.push({ label: `Y${y}`, invested: totalInv, returns: totalFV - totalInv });
    }
    return { invested, fv, returns, yearlyBars };
  }, [monthly, rate, years]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Monthly Investment" value={monthly} min={500} max={100000} step={500} prefix="₹" onChange={setMonthly} />
        <SliderInput label="Expected Return Rate" value={rate} min={1} max={30} step={0.5} suffix="%" onChange={setRate} />
        <SliderInput label="Time Period" value={years} min={1} max={40} step={1} suffix=" yrs" onChange={setYears} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Invested Amount" value={fmt(result.invested)} accent="#2775E8" />
          <ResultRow label="Est. Returns" value={fmt(result.returns)} accent="#00B386" />
          <ResultRow label="Total Value" value={fmt(result.fv)} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <DonutChart slices={[
          { value: result.invested, color: '#2775E8', label: 'Invested' },
          { value: result.returns, color: '#00B386', label: 'Returns' },
        ]} />
        <BarChart bars={result.yearlyBars} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   SWP CALCULATOR
   ═══════════════════════════════════════════════════ */
const SWPCalculator: React.FC = () => {
  const [corpus, setCorpus] = useState(2500000);
  const [withdrawal, setWithdrawal] = useState(10000);
  const [rate, setRate] = useState(8);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const totalWithdrawn = withdrawal * n;
    let remaining = corpus;
    const yearlyBars = [];
    for (let y = 1; y <= Math.min(years, 12); y++) {
      for (let m = 0; m < 12; m++) {
        remaining = remaining * (1 + r) - withdrawal;
        if (remaining < 0) { remaining = 0; break; }
      }
      yearlyBars.push({ label: `Y${y}`, invested: remaining, returns: 0 });
    }
    return { totalWithdrawn, remaining: Math.max(remaining, 0), yearlyBars };
  }, [corpus, withdrawal, rate, years]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Total Investment" value={corpus} min={100000} max={10000000} step={50000} prefix="₹" onChange={setCorpus} />
        <SliderInput label="Monthly Withdrawal" value={withdrawal} min={1000} max={200000} step={1000} prefix="₹" onChange={setWithdrawal} />
        <SliderInput label="Expected Return Rate" value={rate} min={1} max={20} step={0.5} suffix="%" onChange={setRate} />
        <SliderInput label="Time Period" value={years} min={1} max={30} step={1} suffix=" yrs" onChange={setYears} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Total Withdrawn" value={fmt(result.totalWithdrawn)} accent="#D64545" />
          <ResultRow label="Remaining Corpus" value={fmt(result.remaining)} accent="#00B386" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <DonutChart slices={[
          { value: result.totalWithdrawn, color: '#D64545', label: 'Withdrawn' },
          { value: result.remaining, color: '#00B386', label: 'Remaining' },
        ]} />
        <div className="w-full">
          <p className="text-[12px] text-[#8A8F98] text-center mb-2 font-body">Corpus Over Time</p>
          <div className="flex items-end gap-1 h-[100px]">
            {result.yearlyBars.map((b, i) => {
              const max = Math.max(...result.yearlyBars.map(x => x.invested), 1);
              const h = (b.invested / max) * 80;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full max-w-[20px] rounded-t-sm" style={{ height: Math.max(h, 2), backgroundColor: b.invested > 0 ? '#00B386' : '#D64545' }} />
                  <span className="text-[9px] text-[#8A8F98]">{b.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   LUMPSUM CALCULATOR
   ═══════════════════════════════════════════════════ */
const LumpsumCalculator: React.FC = () => {
  const [amount, setAmount] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const fv = amount * Math.pow(1 + rate / 100, years);
    const returns = fv - amount;
    const yearlyBars = [];
    for (let y = 1; y <= Math.min(years, 12); y++) {
      const val = amount * Math.pow(1 + rate / 100, y);
      yearlyBars.push({ label: `Y${y}`, invested: amount, returns: val - amount });
    }
    return { invested: amount, fv, returns, yearlyBars };
  }, [amount, rate, years]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Investment Amount" value={amount} min={1000} max={10000000} step={5000} prefix="₹" onChange={setAmount} />
        <SliderInput label="Expected Return Rate" value={rate} min={1} max={30} step={0.5} suffix="%" onChange={setRate} />
        <SliderInput label="Time Period" value={years} min={1} max={40} step={1} suffix=" yrs" onChange={setYears} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Invested Amount" value={fmt(result.invested)} accent="#2775E8" />
          <ResultRow label="Est. Returns" value={fmt(result.returns)} accent="#00B386" />
          <ResultRow label="Total Value" value={fmt(result.fv)} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <DonutChart slices={[
          { value: result.invested, color: '#2775E8', label: 'Invested' },
          { value: result.returns, color: '#00B386', label: 'Returns' },
        ]} />
        <BarChart bars={result.yearlyBars} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   CAGR CALCULATOR
   ═══════════════════════════════════════════════════ */
const CAGRCalculator: React.FC = () => {
  const [initial, setInitial] = useState(100000);
  const [final, setFinal] = useState(250000);
  const [years, setYears] = useState(5);

  const result = useMemo(() => {
    const cagr = (Math.pow(final / initial, 1 / years) - 1) * 100;
    const absReturn = ((final - initial) / initial) * 100;
    // Growth curve data
    const points: { x: number; y: number }[] = [];
    for (let y = 0; y <= years; y++) {
      points.push({ x: y, y: initial * Math.pow(1 + cagr / 100, y) });
    }
    return { cagr, absReturn, gain: final - initial, points };
  }, [initial, final, years]);

  const maxY = Math.max(...result.points.map(p => p.y));
  const svgW = 300; const svgH = 140;
  const pathD = result.points.map((p, i) => {
    const x = (p.x / years) * (svgW - 20) + 10;
    const y = svgH - 10 - ((p.y / maxY) * (svgH - 30));
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');
  const areaD = pathD + ` L${svgW - 10},${svgH - 10} L10,${svgH - 10} Z`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Initial Value" value={initial} min={1000} max={10000000} step={5000} prefix="₹" onChange={setInitial} />
        <SliderInput label="Final Value" value={final} min={1000} max={50000000} step={5000} prefix="₹" onChange={setFinal} />
        <SliderInput label="Duration" value={years} min={1} max={40} step={1} suffix=" yrs" onChange={setYears} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="CAGR" value={fmtPct(result.cagr)} accent="#00B386" />
          <ResultRow label="Absolute Return" value={fmtPct(result.absReturn)} accent="#2775E8" />
          <ResultRow label="Total Gain" value={fmt(result.gain)} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-[12px] text-[#8A8F98] text-center mb-3 font-body">Growth Curve</p>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <path d={areaD} fill="#00B386" fillOpacity="0.12" />
          <path d={pathD} fill="none" stroke="#00B386" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {result.points.map((p, i) => {
            const x = (p.x / years) * (svgW - 20) + 10;
            const y = svgH - 10 - ((p.y / maxY) * (svgH - 30));
            return <circle key={i} cx={x} cy={y} r="4" fill="#00B386" />;
          })}
        </svg>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   BROKERAGE CALCULATOR
   ═══════════════════════════════════════════════════ */
const BrokerageCalculator: React.FC = () => {
  const [buyPrice, setBuyPrice] = useState(500);
  const [sellPrice, setSellPrice] = useState(550);
  const [qty, setQty] = useState(100);
  const [segment, setSegment] = useState<'delivery' | 'intraday'>('delivery');

  const result = useMemo(() => {
    const turnover = buyPrice * qty + sellPrice * qty;
    const brokerage = segment === 'delivery' ? 0 : Math.min(turnover * 0.0003, 40);
    const sttBuy = segment === 'delivery' ? buyPrice * qty * 0.001 : 0;
    const sttSell = sellPrice * qty * (segment === 'delivery' ? 0.001 : 0.00025);
    const stt = sttBuy + sttSell;
    const exchangeCharges = turnover * 0.0000345;
    const sebiCharges = turnover * 0.000001;
    const stampDuty = buyPrice * qty * 0.00015;
    const gst = (brokerage + exchangeCharges + sebiCharges) * 0.18;
    const totalCharges = brokerage + stt + exchangeCharges + sebiCharges + stampDuty + gst;
    const pnl = (sellPrice - buyPrice) * qty;
    const netPnl = pnl - totalCharges;
    return {
      brokerage, stt, exchangeCharges, sebiCharges, stampDuty, gst, totalCharges, pnl, netPnl,
      breakdown: [
        { label: 'Brokerage', value: brokerage, color: '#7757D9' },
        { label: 'STT', value: stt, color: '#D64545' },
        { label: 'Exchange', value: exchangeCharges, color: '#2775E8' },
        { label: 'GST', value: gst, color: '#D99A00' },
        { label: 'Stamp Duty', value: stampDuty, color: '#00B386' },
        { label: 'SEBI', value: sebiCharges, color: '#8A8F98' },
      ]
    };
  }, [buyPrice, sellPrice, qty, segment]);

  const maxBreakdown = Math.max(...result.breakdown.map(b => b.value), 0.01);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="flex gap-3 mb-6">
          {(['delivery', 'intraday'] as const).map(s => (
            <button key={s} onClick={() => setSegment(s)}
              className={`px-5 py-2 rounded-[12px] text-[13px] font-heading font-semibold transition-all duration-180 ${segment === s ? 'bg-[#00B386] text-[#0D1117]' : 'bg-[#262626] text-[#A1A1AA] hover:bg-[#333]'}`}
            >{s === 'delivery' ? 'Delivery' : 'Intraday'}</button>
          ))}
        </div>
        <SliderInput label="Buy Price" value={buyPrice} min={1} max={50000} step={1} prefix="₹" onChange={setBuyPrice} />
        <SliderInput label="Sell Price" value={sellPrice} min={1} max={50000} step={1} prefix="₹" onChange={setSellPrice} />
        <SliderInput label="Quantity" value={qty} min={1} max={10000} step={1} onChange={setQty} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Gross P&L" value={fmt(result.pnl)} accent={result.pnl >= 0 ? '#00B386' : '#D64545'} />
          <ResultRow label="Total Charges" value={fmt(result.totalCharges)} accent="#D64545" />
          <ResultRow label="Net P&L" value={fmt(result.netPnl)} accent={result.netPnl >= 0 ? '#00B386' : '#D64545'} />
        </div>
      </div>
      <div className="flex flex-col justify-center gap-3">
        <p className="text-[12px] text-[#8A8F98] mb-2 font-body">Charges Breakdown</p>
        {result.breakdown.map((b, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-[12px] text-[#8A8F98] w-20 text-right font-body">{b.label}</span>
            <div className="flex-1 h-5 bg-[#161616] rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${Math.max((b.value / maxBreakdown) * 100, 2)}%`, backgroundColor: b.color }} />
            </div>
            <span className="text-[12px] text-white w-16 font-heading">₹{b.value.toFixed(2)}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   MARGIN CALCULATOR
   ═══════════════════════════════════════════════════ */
const MarginCalculator: React.FC = () => {
  const [price, setPrice] = useState(2500);
  const [qty, setQty] = useState(50);
  const [marginPct, setMarginPct] = useState(20);

  const result = useMemo(() => {
    const totalValue = price * qty;
    const marginRequired = totalValue * (marginPct / 100);
    const leverage = 100 / marginPct;
    return { totalValue, marginRequired, leverage };
  }, [price, qty, marginPct]);

  const marginFrac = marginPct / 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Stock Price" value={price} min={1} max={50000} step={10} prefix="₹" onChange={setPrice} />
        <SliderInput label="Quantity" value={qty} min={1} max={5000} step={1} onChange={setQty} />
        <SliderInput label="Margin Required" value={marginPct} min={5} max={100} step={1} suffix="%" onChange={setMarginPct} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Total Trade Value" value={fmt(result.totalValue)} />
          <ResultRow label="Margin Required" value={fmt(result.marginRequired)} accent="#D99A00" />
          <ResultRow label="Leverage" value={`${result.leverage.toFixed(1)}x`} accent="#2775E8" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-[12px] text-[#8A8F98] font-body">Margin vs Total Value</p>
        <svg width="200" height="200" viewBox="0 0 200 200">
          {/* Total value bar */}
          <rect x="30" y="20" width="60" height="160" rx="8" fill="#2775E8" fillOpacity="0.2" />
          {/* Margin portion */}
          <rect x="30" y={20 + 160 * (1 - marginFrac)} width="60" height={160 * marginFrac} rx="8" fill="#D99A00" />
          {/* Labels */}
          <text x="60" y={20 + 160 * (1 - marginFrac) - 8} textAnchor="middle" fill="#D99A00" fontSize="12" fontWeight="600" fontFamily="Outfit">{fmt(result.marginRequired)}</text>
          <text x="150" y="100" textAnchor="middle" fill="#2775E8" fontSize="12" fontWeight="600" fontFamily="Outfit">{fmt(result.totalValue)}</text>
          <text x="150" y="120" textAnchor="middle" fill="#8A8F98" fontSize="10" fontFamily="Hedvig Letters Sans">Total Value</text>
          <text x="60" y="195" textAnchor="middle" fill="#8A8F98" fontSize="10" fontFamily="Hedvig Letters Sans">Margin</text>
        </svg>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   P/E CALCULATOR
   ═══════════════════════════════════════════════════ */
const PECalculator: React.FC = () => {
  const [marketPrice, setMarketPrice] = useState(1500);
  const [eps, setEps] = useState(75);

  const result = useMemo(() => {
    const pe = eps !== 0 ? marketPrice / eps : 0;
    const earningsYield = eps !== 0 ? (eps / marketPrice) * 100 : 0;
    let valuation = 'Fair Value';
    let valColor = '#D99A00';
    if (pe < 15) { valuation = 'Undervalued'; valColor = '#00B386'; }
    else if (pe > 25) { valuation = 'Overvalued'; valColor = '#D64545'; }
    return { pe, earningsYield, valuation, valColor };
  }, [marketPrice, eps]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Market Price" value={marketPrice} min={1} max={100000} step={10} prefix="₹" onChange={setMarketPrice} />
        <SliderInput label="Earnings Per Share (EPS)" value={eps} min={1} max={10000} step={1} prefix="₹" onChange={setEps} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="P/E Ratio" value={result.pe.toFixed(2)} accent="#2775E8" />
          <ResultRow label="Earnings Yield" value={fmtPct(result.earningsYield)} accent="#00B386" />
          <ResultRow label="Valuation" value={result.valuation} accent={result.valColor} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-[12px] text-[#8A8F98] font-body">P/E Gauge</p>
        <svg width="220" height="140" viewBox="0 0 220 140">
          {/* Background arc */}
          <path d="M 30 120 A 80 80 0 0 1 190 120" fill="none" stroke="#2A2A2A" strokeWidth="18" strokeLinecap="round" />
          {/* Colored segments */}
          <path d="M 30 120 A 80 80 0 0 1 76 52" fill="none" stroke="#00B386" strokeWidth="18" strokeLinecap="round" />
          <path d="M 76 52 A 80 80 0 0 1 144 52" fill="none" stroke="#D99A00" strokeWidth="18" strokeLinecap="round" />
          <path d="M 144 52 A 80 80 0 0 1 190 120" fill="none" stroke="#D64545" strokeWidth="18" strokeLinecap="round" />
          {/* Needle */}
          {(() => {
            const clampedPE = Math.min(Math.max(result.pe, 0), 50);
            const angle = -180 + (clampedPE / 50) * 180;
            const rad = (angle * Math.PI) / 180;
            const nx = 110 + 55 * Math.cos(rad);
            const ny = 120 + 55 * Math.sin(rad);
            return <line x1="110" y1="120" x2={nx} y2={ny} stroke="#fff" strokeWidth="3" strokeLinecap="round" />;
          })()}
          <circle cx="110" cy="120" r="6" fill="#fff" />
          <text x="110" y="105" textAnchor="middle" fill={result.valColor} fontSize="22" fontWeight="700" fontFamily="Outfit">{result.pe.toFixed(1)}</text>
          <text x="30" y="138" textAnchor="middle" fill="#8A8F98" fontSize="9">0</text>
          <text x="110" y="36" textAnchor="middle" fill="#8A8F98" fontSize="9">25</text>
          <text x="190" y="138" textAnchor="middle" fill="#8A8F98" fontSize="9">50</text>
        </svg>
        <span className="text-[14px] font-heading font-semibold" style={{ color: result.valColor }}>{result.valuation}</span>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   GOAL CALCULATOR
   ═══════════════════════════════════════════════════ */
const GoalCalculator: React.FC = () => {
  const [goalAmount, setGoalAmount] = useState(2000000);
  const [years, setYears] = useState(10);
  const [rate, setRate] = useState(12);

  const result = useMemo(() => {
    const r = rate / 100 / 12;
    const n = years * 12;
    const monthlySIP = goalAmount * r / (Math.pow(1 + r, n) - 1);
    const totalInvested = monthlySIP * n;
    const totalReturns = goalAmount - totalInvested;
    return { monthlySIP, totalInvested, totalReturns, goalAmount };
  }, [goalAmount, years, rate]);

  const progress = Math.min((result.totalInvested / result.goalAmount) * 100, 100);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Goal Amount" value={goalAmount} min={50000} max={50000000} step={50000} prefix="₹" onChange={setGoalAmount} />
        <SliderInput label="Time to Achieve" value={years} min={1} max={40} step={1} suffix=" yrs" onChange={setYears} />
        <SliderInput label="Expected Return Rate" value={rate} min={1} max={30} step={0.5} suffix="%" onChange={setRate} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Required Monthly SIP" value={fmt(result.monthlySIP)} accent="#00B386" />
          <ResultRow label="Total Investment" value={fmt(result.totalInvested)} accent="#2775E8" />
          <ResultRow label="Wealth Gain" value={fmt(result.totalReturns)} accent="#7757D9" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-8">
        <DonutChart slices={[
          { value: result.totalInvested, color: '#2775E8', label: 'Your Investment' },
          { value: result.totalReturns, color: '#00B386', label: 'Returns' },
        ]} />
        <div className="w-full max-w-[280px]">
          <div className="flex justify-between text-[11px] text-[#8A8F98] mb-1.5 font-body">
            <span>Investment</span>
            <span>Goal: {fmt(result.goalAmount)}</span>
          </div>
          <div className="h-4 bg-[#161616] rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-[#00B386] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   RETIREMENT CALCULATOR
   ═══════════════════════════════════════════════════ */
const RetirementCalculator: React.FC = () => {
  const [currentAge, setCurrentAge] = useState(25);
  const [retireAge, setRetireAge] = useState(60);
  const [monthlyExp, setMonthlyExp] = useState(30000);
  const [rate, setRate] = useState(12);
  const [inflation, setInflation] = useState(6);

  const result = useMemo(() => {
    const yearsToRetire = retireAge - currentAge;
    const retirementYears = 25; // Assume 25 years post-retirement
    if (yearsToRetire <= 0) return { corpus: 0, monthlySIP: 0, futureMonthlyExp: 0, yearlyBars: [] };

    const futureMonthlyExp = monthlyExp * Math.pow(1 + inflation / 100, yearsToRetire);
    const annualExpAtRetirement = futureMonthlyExp * 12;
    const realReturn = ((1 + rate / 100) / (1 + inflation / 100)) - 1;
    const corpus = realReturn > 0 ? annualExpAtRetirement * ((1 - Math.pow(1 + realReturn, -retirementYears)) / realReturn) : annualExpAtRetirement * retirementYears;

    const r = rate / 100 / 12;
    const n = yearsToRetire * 12;
    const monthlySIP = corpus * r / (Math.pow(1 + r, n) - 1);

    const yearlyBars = [];
    for (let y = 5; y <= yearsToRetire; y += Math.max(Math.floor(yearsToRetire / 8), 1)) {
      const mn = y * 12;
      const fv = monthlySIP * ((Math.pow(1 + r, mn) - 1) / r) * (1 + r);
      yearlyBars.push({ label: `${currentAge + y}`, invested: monthlySIP * mn, returns: fv - monthlySIP * mn });
    }

    return { corpus, monthlySIP, futureMonthlyExp, yearlyBars };
  }, [currentAge, retireAge, monthlyExp, rate, inflation]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Current Age" value={currentAge} min={18} max={55} step={1} suffix=" yrs" onChange={setCurrentAge} />
        <SliderInput label="Retirement Age" value={retireAge} min={40} max={70} step={1} suffix=" yrs" onChange={setRetireAge} />
        <SliderInput label="Monthly Expenses (today)" value={monthlyExp} min={5000} max={500000} step={1000} prefix="₹" onChange={setMonthlyExp} />
        <SliderInput label="Expected Return Rate" value={rate} min={5} max={20} step={0.5} suffix="%" onChange={setRate} />
        <SliderInput label="Inflation Rate" value={inflation} min={3} max={12} step={0.5} suffix="%" onChange={setInflation} />
        <div className="mt-4 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Corpus Needed" value={fmt(result.corpus)} accent="#7757D9" />
          <ResultRow label="Monthly SIP Required" value={fmt(result.monthlySIP)} accent="#00B386" />
          <ResultRow label="Future Monthly Exp." value={fmt(result.futureMonthlyExp)} accent="#D99A00" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <DonutChart slices={[
          { value: result.monthlySIP * (retireAge - currentAge) * 12, color: '#2775E8', label: 'Your Investment' },
          { value: Math.max(result.corpus - result.monthlySIP * (retireAge - currentAge) * 12, 0), color: '#00B386', label: 'Returns' },
        ]} />
        {result.yearlyBars.length > 0 && <BarChart bars={result.yearlyBars} />}
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   INFLATION CALCULATOR
   ═══════════════════════════════════════════════════ */
const InflationCalculator: React.FC = () => {
  const [currentCost, setCurrentCost] = useState(100);
  const [inflationRate, setInflationRate] = useState(6);
  const [years, setYears] = useState(10);

  const result = useMemo(() => {
    const futureCost = currentCost * Math.pow(1 + inflationRate / 100, years);
    const purchasingPower = currentCost / Math.pow(1 + inflationRate / 100, years);
    const points: { x: number; value: number; power: number }[] = [];
    for (let y = 0; y <= years; y++) {
      points.push({
        x: y,
        value: currentCost * Math.pow(1 + inflationRate / 100, y),
        power: currentCost / Math.pow(1 + inflationRate / 100, y),
      });
    }
    return { futureCost, purchasingPower, points };
  }, [currentCost, inflationRate, years]);

  const maxVal = Math.max(...result.points.map(p => p.value));
  const svgW = 300; const svgH = 140;

  const costPath = result.points.map((p, i) => {
    const x = (p.x / years) * (svgW - 20) + 10;
    const y = svgH - 10 - ((p.value / maxVal) * (svgH - 30));
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  const powerPath = result.points.map((p, i) => {
    const x = (p.x / years) * (svgW - 20) + 10;
    const y = svgH - 10 - ((p.power / maxVal) * (svgH - 30));
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <SliderInput label="Current Cost" value={currentCost} min={10} max={1000000} step={10} prefix="₹" onChange={setCurrentCost} />
        <SliderInput label="Inflation Rate" value={inflationRate} min={1} max={15} step={0.5} suffix="%" onChange={setInflationRate} />
        <SliderInput label="Time Period" value={years} min={1} max={40} step={1} suffix=" yrs" onChange={setYears} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Future Cost" value={fmt(result.futureCost)} accent="#D64545" />
          <ResultRow label="Today's ₹{currentCost.toLocaleString('en-IN')} will be worth" value={fmt(result.purchasingPower)} accent="#D99A00" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        <p className="text-[12px] text-[#8A8F98] mb-3 font-body">Cost Rise vs Purchasing Power</p>
        <svg width={svgW} height={svgH} viewBox={`0 0 ${svgW} ${svgH}`}>
          <path d={costPath} fill="none" stroke="#D64545" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d={powerPath} fill="none" stroke="#D99A00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="6 4" />
        </svg>
        <div className="flex gap-6 mt-3">
          <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#D64545] rounded" /><span className="text-[11px] text-[#8A8F98]">Future Cost</span></div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#D99A00] rounded" style={{ borderTop: '2px dashed #D99A00' }} /><span className="text-[11px] text-[#8A8F98]">Purchasing Power</span></div>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TAX CALCULATOR
   ═══════════════════════════════════════════════════ */
const TaxCalculator: React.FC = () => {
  const [buyPrice, setBuyPrice] = useState(100000);
  const [sellPrice, setSellPrice] = useState(200000);
  const [holdingMonths, setHoldingMonths] = useState(18);
  const [assetType, setAssetType] = useState<'equity' | 'debt'>('equity');

  const result = useMemo(() => {
    const gain = sellPrice - buyPrice;
    if (gain <= 0) return { gain, tax: 0, netGain: gain, taxType: 'No Tax (Loss)', taxRate: 0 };

    let tax = 0; let taxType = ''; let taxRate = 0;
    if (assetType === 'equity') {
      if (holdingMonths >= 12) {
        taxType = 'LTCG (Equity)';
        taxRate = 12.5;
        const taxableGain = Math.max(gain - 125000, 0); // 1.25L exemption
        tax = taxableGain * 0.125;
      } else {
        taxType = 'STCG (Equity)';
        taxRate = 20;
        tax = gain * 0.20;
      }
    } else {
      // Debt: taxed at slab rate, simplified as 30% for illustration
      if (holdingMonths >= 24) {
        taxType = 'LTCG (Debt)';
        taxRate = 20;
        tax = gain * 0.20;
      } else {
        taxType = 'STCG (Debt)';
        taxRate = 30;
        tax = gain * 0.30;
      }
    }
    return { gain, tax, netGain: gain - tax, taxType, taxRate };
  }, [buyPrice, sellPrice, holdingMonths, assetType]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="flex gap-3 mb-6">
          {(['equity', 'debt'] as const).map(t => (
            <button key={t} onClick={() => setAssetType(t)}
              className={`px-5 py-2 rounded-[12px] text-[13px] font-heading font-semibold transition-all duration-180 ${assetType === t ? 'bg-[#00B386] text-[#0D1117]' : 'bg-[#262626] text-[#A1A1AA] hover:bg-[#333]'}`}
            >{t === 'equity' ? 'Equity / MF' : 'Debt / Gold'}</button>
          ))}
        </div>
        <SliderInput label="Purchase Price" value={buyPrice} min={1000} max={10000000} step={1000} prefix="₹" onChange={setBuyPrice} />
        <SliderInput label="Sale Price" value={sellPrice} min={1000} max={10000000} step={1000} prefix="₹" onChange={setSellPrice} />
        <SliderInput label="Holding Period" value={holdingMonths} min={1} max={120} step={1} suffix=" mo" onChange={setHoldingMonths} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Capital Gain" value={fmt(result.gain)} accent={result.gain >= 0 ? '#00B386' : '#D64545'} />
          <ResultRow label={`Tax (${result.taxType} @ ${result.taxRate}%)`} value={fmt(result.tax)} accent="#D64545" />
          <ResultRow label="Net Gain After Tax" value={fmt(result.netGain)} accent="#00B386" />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <DonutChart slices={[
          { value: Math.max(result.netGain, 0), color: '#00B386', label: 'Net Gain' },
          { value: result.tax, color: '#D64545', label: 'Tax' },
        ]} />
        <div className="bg-[#161616] rounded-[14px] px-5 py-3 text-center">
          <span className="text-[12px] text-[#8A8F98] font-body">{holdingMonths >= (assetType === 'equity' ? 12 : 24) ? 'Long Term' : 'Short Term'}</span>
          <span className="text-[12px] text-[#8A8F98] font-body"> · </span>
          <span className="text-[12px] font-heading font-semibold" style={{ color: result.taxRate <= 15 ? '#00B386' : '#D99A00' }}>{result.taxRate}% Tax Rate</span>
        </div>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   FD / RD CALCULATOR
   ═══════════════════════════════════════════════════ */
const FDRDCalculator: React.FC = () => {
  const [principal, setPrincipal] = useState(100000);
  const [rate, setRate] = useState(7);
  const [years, setYears] = useState(5);
  const [type, setType] = useState<'fd' | 'rd'>('fd');

  const result = useMemo(() => {
    if (type === 'fd') {
      // Quarterly compounding
      const maturity = principal * Math.pow(1 + rate / 400, 4 * years);
      const interest = maturity - principal;
      return { maturity, interest, totalInvested: principal };
    } else {
      // RD: monthly deposit, quarterly compounding
      const n = years * 12;
      const r = rate / 400;
      let maturity = 0;
      for (let i = 0; i < n; i++) {
        const monthsLeft = n - i;
        const quarters = monthsLeft / 3;
        maturity += principal * Math.pow(1 + r, quarters);
      }
      const totalInvested = principal * n;
      const interest = maturity - totalInvested;
      return { maturity, interest, totalInvested };
    }
  }, [principal, rate, years, type]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div>
        <div className="flex gap-3 mb-6">
          {(['fd', 'rd'] as const).map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`px-5 py-2 rounded-[12px] text-[13px] font-heading font-semibold transition-all duration-180 ${type === t ? 'bg-[#00B386] text-[#0D1117]' : 'bg-[#262626] text-[#A1A1AA] hover:bg-[#333]'}`}
            >{t === 'fd' ? 'Fixed Deposit' : 'Recurring Deposit'}</button>
          ))}
        </div>
        <SliderInput label={type === 'fd' ? 'Principal Amount' : 'Monthly Deposit'} value={principal} min={1000} max={5000000} step={1000} prefix="₹" onChange={setPrincipal} />
        <SliderInput label="Interest Rate" value={rate} min={3} max={12} step={0.1} suffix="%" onChange={setRate} />
        <SliderInput label="Time Period" value={years} min={1} max={20} step={1} suffix=" yrs" onChange={setYears} />
        <div className="mt-6 bg-[#161616] rounded-[16px] p-5">
          <ResultRow label="Total Investment" value={fmt(result.totalInvested)} accent="#2775E8" />
          <ResultRow label="Total Interest" value={fmt(result.interest)} accent="#00B386" />
          <ResultRow label="Maturity Value" value={fmt(result.maturity)} />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-6">
        <DonutChart slices={[
          { value: result.totalInvested, color: '#2775E8', label: type === 'fd' ? 'Principal' : 'Deposits' },
          { value: Math.max(result.interest, 0), color: '#00B386', label: 'Interest' },
        ]} />
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════
   TOOL DIRECTORY & GRAPHICS
   ═══════════════════════════════════════════════════ */

const ToolGraphic: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case 'sip':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="3" y="22" width="4" height="6" rx="1.5" fill="#00B386" fillOpacity="0.35" />
          <rect x="10" y="16" width="4" height="12" rx="1.5" fill="#00B386" fillOpacity="0.55" />
          <rect x="17" y="10" width="4" height="18" rx="1.5" fill="#00B386" fillOpacity="0.75" />
          <rect x="24" y="4" width="4" height="24" rx="1.5" fill="#00B386" />
        </svg>
      );
    case 'swp':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="3" y="4" width="4" height="24" rx="1.5" fill="#D64545" />
          <rect x="10" y="10" width="4" height="18" rx="1.5" fill="#D64545" fillOpacity="0.75" />
          <rect x="17" y="16" width="4" height="12" rx="1.5" fill="#D64545" fillOpacity="0.55" />
          <rect x="24" y="22" width="4" height="6" rx="1.5" fill="#D64545" fillOpacity="0.35" />
        </svg>
      );
    case 'lumpsum':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="5" y="18" width="8" height="10" rx="2" fill="#2775E8" fillOpacity="0.4" />
          <rect x="19" y="6" width="8" height="22" rx="2" fill="#2775E8" />
          <path d="M14 20 L18 12" stroke="#2775E8" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 'cagr':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <path d="M4 26 C 12 26 18 10 28 6" stroke="#00B386" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="6" r="2.5" fill="#00B386" />
        </svg>
      );
    case 'brokerage':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="6" width="24" height="6" rx="2" fill="#7757D9" fillOpacity="0.3" />
          <rect x="4" y="14" width="18" height="6" rx="2" fill="#7757D9" fillOpacity="0.6" />
          <rect x="4" y="22" width="12" height="6" rx="2" fill="#7757D9" />
        </svg>
      );
    case 'margin':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="8" y="4" width="16" height="24" rx="3" fill="#D99A00" fillOpacity="0.2" />
          <rect x="8" y="16" width="16" height="12" rx="3" fill="#D99A00" />
        </svg>
      );
    case 'pe':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="8" width="8" height="18" rx="2" fill="#2775E8" fillOpacity="0.5" />
          <rect x="18" y="14" width="8" height="12" rx="2" fill="#2775E8" />
          <path d="M10 8 C 10 4, 22 4, 22 14" stroke="#2775E8" strokeWidth="1.5" strokeDasharray="3 2" fill="none" />
        </svg>
      );
    case 'goal':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="4" y="13" width="24" height="6" rx="3" fill="#00B386" fillOpacity="0.2" />
          <rect x="4" y="13" width="15" height="6" rx="3" fill="#00B386" />
          <path d="M26 8 L26 24" stroke="#00B386" strokeWidth="2" strokeLinecap="round" strokeDasharray="3 2" />
        </svg>
      );
    case 'retirement':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <line x1="2" y1="26" x2="30" y2="26" stroke="#7757D9" strokeWidth="2" strokeLinecap="round" />
          <rect x="5" y="18" width="5" height="8" rx="1.5" fill="#7757D9" fillOpacity="0.4" />
          <rect x="13" y="12" width="5" height="14" rx="1.5" fill="#7757D9" fillOpacity="0.7" />
          <rect x="21" y="6" width="5" height="20" rx="1.5" fill="#7757D9" />
        </svg>
      );
    case 'inflation':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <path d="M4 6 C 12 6, 18 22, 28 26" stroke="#D64545" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <circle cx="28" cy="26" r="2.5" fill="#D64545" />
        </svg>
      );
    case 'fd_rd':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="5" y="14" width="8" height="14" rx="2" fill="#00B386" fillOpacity="0.4" />
          <rect x="5" y="8" width="8" height="6" rx="2" fill="#00B386" fillOpacity="0.8" />
          <rect x="19" y="10" width="8" height="18" rx="2" fill="#00B386" fillOpacity="0.4" />
          <rect x="19" y="4" width="8" height="6" rx="2" fill="#00B386" />
        </svg>
      );
    case 'tax':
      return (
        <svg className="w-full h-full" viewBox="0 0 32 32" fill="none">
          <rect x="6" y="6" width="20" height="20" rx="4" fill="#D64545" fillOpacity="0.15" />
          <rect x="6" y="16" width="20" height="10" rx="4" fill="#D64545" />
          <line x1="10" y1="12" x2="22" y2="12" stroke="#D64545" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
};

const TOOLS_DIRECTORY = [
  {
    category: "Investment",
    tools: [
      { id: 'sip', title: 'SIP Calculator', desc: 'Estimate future returns from a systematic investment plan.' },
      { id: 'swp', title: 'SWP Calculator', desc: 'Estimate withdrawals and remaining corpus from a systematic withdrawal plan.' },
      { id: 'lumpsum', title: 'Lumpsum Calculator', desc: 'Estimate future value from a one-time investment.' },
      { id: 'cagr', title: 'CAGR Calculator', desc: 'Calculate annualized returns over an investment period.' },
    ]
  },
  {
    category: "Trading",
    tools: [
      { id: 'brokerage', title: 'Brokerage Calculator', desc: 'Estimate brokerage, taxes, and charges for your trades.' },
      { id: 'margin', title: 'Margin Calculator', desc: 'Estimate the balance required to buy or sell securities.' },
      { id: 'pe', title: 'P/E Calculator', desc: 'Understand valuation using earnings and market price.' },
    ]
  },
  {
    category: "Planning",
    tools: [
      { id: 'goal', title: 'Goal Calculator', desc: 'Estimate how much you need to invest to reach a financial goal.' },
      { id: 'retirement', title: 'Retirement Calculator', desc: 'Estimate your retirement corpus and required monthly investment.' },
      { id: 'inflation', title: 'Inflation Calculator', desc: 'See how inflation changes the purchasing power of money over time.' },
    ]
  },
  {
    category: "Savings & Tax",
    tools: [
      { id: 'fd_rd', title: 'FD / RD Calculator', desc: 'Estimate maturity value and interest from fixed or recurring deposits.' },
      { id: 'tax', title: 'Tax Calculator', desc: 'Estimate applicable taxes on your investments and income.' },
    ]
  }
];

const CALCULATORS: Record<string, { title: string; component: React.FC }> = {
  sip: { title: 'SIP Calculator', component: SIPCalculator },
  swp: { title: 'SWP Calculator', component: SWPCalculator },
  lumpsum: { title: 'Lumpsum Calculator', component: LumpsumCalculator },
  cagr: { title: 'CAGR Calculator', component: CAGRCalculator },
  brokerage: { title: 'Brokerage Calculator', component: BrokerageCalculator },
  margin: { title: 'Margin Calculator', component: MarginCalculator },
  pe: { title: 'P/E Calculator', component: PECalculator },
  goal: { title: 'Goal Calculator', component: GoalCalculator },
  retirement: { title: 'Retirement Calculator', component: RetirementCalculator },
  inflation: { title: 'Inflation Calculator', component: InflationCalculator },
  fd_rd: { title: 'FD / RD Calculator', component: FDRDCalculator },
  tax: { title: 'Tax Calculator', component: TaxCalculator },
};

/* ═══════════════════════════════════════════════════
   MAIN MODULE
   ═══════════════════════════════════════════════════ */

export const ToolsModule: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string | null>(null);

  // Calculator view
  if (activeTool && CALCULATORS[activeTool]) {
    const calc = CALCULATORS[activeTool];
    const CalcComponent = calc.component;
    return (
      <div className="w-full h-full bg-[#1E1E1E] text-white overflow-y-auto custom-scrollbar">
        <div className="max-w-[1100px] mx-auto p-8 lg:p-10 pb-20">
          <button
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-2 text-[#8A8F98] hover:text-white transition-colors mb-8 font-heading text-[14px] font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Tools
          </button>
          <h1 className="text-[30px] font-bold tracking-[-0.03em] text-white mb-8 font-heading">
            {calc.title}
          </h1>
          <CalcComponent />
        </div>
      </div>
    );
  }

  // Directory view
  return (
    <div className="w-full h-full bg-[#1E1E1E] text-white overflow-y-auto custom-scrollbar">
      <div className="max-w-[1400px] mx-auto p-8 lg:p-10 pb-20">

        {/* Page Heading */}
        <div className="mb-14">
          <h1 className="text-[34px] sm:text-[38px] font-bold tracking-[-0.035em] text-white mb-2 font-heading">
            Tools
          </h1>
          <p className="text-[16px] text-[#A1A1AA] font-body">
            Useful calculators and financial tools to help you make better decisions.
          </p>
        </div>

        {/* Tools Grid */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-12 space-y-12">
          {TOOLS_DIRECTORY.map((group, gIdx) => (
            <div key={gIdx} className="break-inside-avoid">
              <h2 className="text-[12px] font-bold tracking-widest uppercase text-[#7B8580] mb-5 pl-4 font-heading">
                {group.category}
              </h2>

              <div className="space-y-1">
                {group.tools.map((tool) => (
                  <button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    className="group w-full text-left cursor-pointer p-4 rounded-[20px] transition-all duration-[180ms] ease-out hover:bg-[#262626]"
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <h3 className="text-white font-bold text-[16px] mb-1.5 flex items-center gap-1.5 group-hover:text-white transition-colors font-heading">
                          {tool.title}
                          <span className="opacity-0 -translate-x-2 transition-all duration-[180ms] ease-out group-hover:opacity-100 group-hover:translate-x-0 text-[#7B8580] text-sm">
                            →
                          </span>
                        </h3>
                        <p className="text-[#8A8F98] text-[13px] leading-relaxed pr-2 font-body">
                          {tool.desc}
                        </p>
                      </div>

                      {/* Contextual Graphic */}
                      <div className="w-12 h-12 shrink-0 rounded-[14px] bg-[#161616] group-hover:bg-[#1A1A1A] transition-colors flex items-center justify-center p-2.5">
                        <ToolGraphic type={tool.id} />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
