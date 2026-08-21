import React, { useState } from 'react';
import { 
  Clock,
  Briefcase,
  ChevronRight,
  RotateCcw
} from 'lucide-react';

interface SimStep {
  month: string;
  price: number;
  news: string;
  financials: {
    peRatio: string;
    eps: string;
    sentiment: 'Positive' | 'Negative' | 'Panic' | 'Recovery';
  };
}

const HDFC_COVID_TIMELINE: SimStep[] = [
  {
    month: "January 2020",
    price: 1270,
    news: "Markets at all-time highs. Whispers of a new virus in China, but Indian economy appears robust. HDFC Bank reports strong Q3 credit growth.",
    financials: { peRatio: "26.5", eps: "48.2", sentiment: "Positive" }
  },
  {
    month: "February 2020",
    price: 1180,
    news: "Global supply chains hit. FIIs start pulling out of emerging markets. India reports first few cases.",
    financials: { peRatio: "24.1", eps: "48.2", sentiment: "Negative" }
  },
  {
    month: "March 23, 2020",
    price: 770,
    news: "NATIONWIDE LOCKDOWN ANNOUNCED. Complete panic on Dalal Street. RBI announces loan moratoriums. Fears of massive NPA crisis for banks.",
    financials: { peRatio: "15.8", eps: "48.2 (Trailing)", sentiment: "Panic" }
  },
  {
    month: "July 2020",
    price: 1050,
    news: "Economy unlocking. Moratorium extended but management commentary suggests NPAs will be lower than worst-case estimates.",
    financials: { peRatio: "21.0", eps: "44.5", sentiment: "Recovery" }
  },
  {
    month: "December 2020",
    price: 1430,
    news: "Vaccine approved! Massive FII inflows return to India. HDFC Bank reports excellent Q2 margins despite the pandemic year.",
    financials: { peRatio: "28.5", eps: "51.0", sentiment: "Positive" }
  }
];

export const MarketSimModule: React.FC = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [cash, setCash] = useState(1000000); // 10 Lakh starting cash
  const [shares, setShares] = useState(0);
  const [tradeAmount, setTradeAmount] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const currentStep = HDFC_COVID_TIMELINE[stepIndex];
  const portfolioValue = cash + (shares * currentStep.price);
  
  const handleBuy = () => {
    if (tradeAmount <= 0 || tradeAmount > cash) return;
    const qty = Math.floor(tradeAmount / currentStep.price);
    if (qty > 0) {
      setCash(prev => prev - (qty * currentStep.price));
      setShares(prev => prev + qty);
      setTradeAmount(0);
    }
  };

  const handleSell = () => {
    if (tradeAmount <= 0) return;
    const qtyToSell = Math.floor(tradeAmount / currentStep.price);
    const actualQty = Math.min(qtyToSell, shares);
    if (actualQty > 0) {
      setShares(prev => prev - actualQty);
      setCash(prev => prev + (actualQty * currentStep.price));
      setTradeAmount(0);
    }
  };

  const handleNextStep = () => {
    if (stepIndex < HDFC_COVID_TIMELINE.length - 1) {
      setStepIndex(prev => prev + 1);
      setTradeAmount(0);
    } else {
      setGameOver(true);
    }
  };

  const handleReset = () => {
    setStepIndex(0);
    setCash(1000000);
    setShares(0);
    setTradeAmount(0);
    setGameOver(false);
  };

  const getSentimentColor = (s: string) => {
    switch(s) {
      case 'Positive': return 'text-status-positive bg-status-positive/10';
      case 'Panic': return 'text-error bg-error-container';
      case 'Negative': return 'text-orange-600 bg-orange-100';
      case 'Recovery': return 'text-primary bg-primary/10';
      default: return 'text-tertiary bg-surface-variant';
    }
  };

  return (
    <div className="space-y-8 pb-12 w-full max-w-5xl mx-auto pt-8">
      {/* Header */}
      <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-2xl font-headline-md font-bold text-on-surface flex items-center gap-2">
            <Clock className="w-6 h-6 text-primary" />
            Historical Crisis Simulator
          </h2>
          <p className="text-on-surface-variant font-body-sm mt-1 max-w-2xl">
            Test your emotional discipline with real historical financials. 
            Scenario: <strong>The 2020 Covid-19 Crash</strong> | Asset: <strong>HDFC Bank (HDFCBANK.NS)</strong>
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className="font-label-md text-tertiary uppercase tracking-widest text-[10px]">Your Net Worth</span>
          <span className={`text-3xl font-mono font-bold ${portfolioValue < 1000000 ? 'text-error' : 'text-primary'}`}>
            ₹{(portfolioValue/100000).toFixed(2)}L
          </span>
          <span className="font-mono text-[11px] text-on-surface-variant">
            {shares} shares • ₹{(cash/100000).toFixed(2)}L cash
          </span>
        </div>
      </div>

      {!gameOver ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Situation Context (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-2xl border border-outline-variant/30 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
              
              <div className="flex items-center justify-between mb-6">
                <span className="bg-surface-variant text-on-surface px-4 py-1.5 rounded-full font-mono text-sm font-bold border border-outline-variant/50">
                  {currentStep.month}
                </span>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getSentimentColor(currentStep.financials.sentiment)}`}>
                  Market Mood: {currentStep.financials.sentiment}
                </span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-label-md text-tertiary uppercase tracking-widest mb-2">Macro Context & News</h3>
                  <p className="font-body-lg text-on-surface leading-relaxed border-l-4 border-primary pl-4">
                    "{currentStep.news}"
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-outline-variant/20">
                  <div>
                    <span className="block font-label-md text-tertiary uppercase tracking-widest mb-1">Stock Price</span>
                    <span className="text-2xl font-mono font-bold text-on-surface">₹{currentStep.price}</span>
                  </div>
                  <div>
                    <span className="block font-label-md text-tertiary uppercase tracking-widest mb-1">P/E Ratio</span>
                    <span className="text-xl font-mono font-bold text-on-surface">{currentStep.financials.peRatio}</span>
                  </div>
                  <div>
                    <span className="block font-label-md text-tertiary uppercase tracking-widest mb-1">Trailing EPS</span>
                    <span className="text-xl font-mono font-bold text-on-surface">₹{currentStep.financials.eps}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex justify-between items-center">
              <span className="font-body-sm text-on-surface-variant">Make your decision, then advance time.</span>
              <button 
                onClick={handleNextStep}
                className="bg-on-surface text-surface py-3 px-6 rounded-xl font-label-md flex items-center gap-2 hover:bg-on-surface-variant transition-colors shadow-md"
              >
                Advance Time (Next Month) <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Trade Execution (Right Col) */}
          <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant/30 shadow-sm flex flex-col h-full">
            <h3 className="font-headline-sm font-bold text-on-surface mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              Trade Desk
            </h3>

            <div className="space-y-6 flex-1">
              <div className="space-y-2">
                <label className="font-label-md text-tertiary uppercase tracking-widest">Order Value (₹)</label>
                <input 
                  type="number" 
                  value={tradeAmount || ''} 
                  onChange={(e) => setTradeAmount(Number(e.target.value))}
                  placeholder="e.g. 50000"
                  className="w-full bg-surface border border-outline-variant/50 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-body-md font-mono"
                />
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setTradeAmount(Math.floor(cash))} className="text-[10px] bg-surface-variant px-2 py-1 rounded text-on-surface-variant font-bold hover:bg-outline-variant/40">Max Buy</button>
                  <button onClick={() => setTradeAmount(Math.floor(shares * currentStep.price))} className="text-[10px] bg-surface-variant px-2 py-1 rounded text-on-surface-variant font-bold hover:bg-outline-variant/40">Max Sell</button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={handleBuy}
                  disabled={tradeAmount <= 0 || tradeAmount > cash}
                  className="bg-status-positive/10 text-status-positive border border-status-positive/30 py-3 rounded-xl font-label-md font-bold disabled:opacity-50 hover:bg-status-positive/20 transition-colors"
                >
                  BUY
                </button>
                <button 
                  onClick={handleSell}
                  disabled={tradeAmount <= 0 || (tradeAmount/currentStep.price) > shares}
                  className="bg-error-container text-error border border-error/30 py-3 rounded-xl font-label-md font-bold disabled:opacity-50 hover:bg-error-container/80 transition-colors"
                >
                  SELL
                </button>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-outline-variant/30 text-center">
              <span className="font-body-sm text-tertiary block mb-1">If you Buy now:</span>
              <span className="font-mono text-sm text-on-surface-variant">Will get ~{tradeAmount > 0 ? Math.floor(tradeAmount / currentStep.price) : 0} shares</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-container-lowest p-12 rounded-2xl border border-outline-variant/30 shadow-sm text-center max-w-2xl mx-auto space-y-6 relative overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
          
          <h2 className="text-3xl font-headline-lg font-bold text-on-surface relative z-10">Simulation Complete</h2>
          <p className="font-body-md text-on-surface-variant relative z-10">
            The year is 2021. The market has recovered and entered a massive bull run. Let's see how your emotional discipline paid off.
          </p>

          <div className="grid grid-cols-2 gap-4 py-6 relative z-10">
            <div className="p-6 bg-surface-variant/30 rounded-xl border border-outline-variant/30">
              <span className="block font-label-md text-tertiary uppercase tracking-widest mb-2">Your Final Portfolio</span>
              <span className={`text-3xl font-mono font-bold ${portfolioValue >= 1000000 ? 'text-status-positive' : 'text-error'}`}>
                ₹{(portfolioValue/100000).toFixed(2)}L
              </span>
              <span className="block text-sm font-bold mt-2">
                {portfolioValue >= 1000000 ? '+' : ''}{(((portfolioValue - 1000000) / 1000000) * 100).toFixed(1)}% Return
              </span>
            </div>
            
            <div className="p-6 bg-surface-variant/30 rounded-xl border border-outline-variant/30">
              <span className="block font-label-md text-tertiary uppercase tracking-widest mb-2">Buy & Hold (Do Nothing)</span>
              <span className="text-3xl font-mono font-bold text-on-surface">
                ₹11.25L
              </span>
              <span className="block text-sm font-bold mt-2 text-on-surface-variant">
                +12.5% Return
              </span>
            </div>
          </div>

          <p className="font-body-sm text-on-surface-variant border-l-4 border-primary pl-4 text-left relative z-10">
            <strong>Lesson:</strong> Most retail investors panic-sold in March 2020 at P/E 15, locking in a 40% loss. 
            The optimal mathematical move was to buy heavily during peak panic, but behaviorally, doing nothing (Buy & Hold) still outperformed panic selling.
          </p>

          <button 
            onClick={handleReset}
            className="bg-primary text-on-primary py-3 px-8 rounded-xl font-label-md inline-flex items-center gap-2 hover:bg-primary/90 transition-colors relative z-10 mt-4 mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Try Again
          </button>
        </div>
      )}
    </div>
  );
};
