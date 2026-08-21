import { getStorageKey } from '../../utils';
import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle,
  Search,
  RefreshCw,
  Landmark,
  Layers
} from 'lucide-react';
import { mockCrisisCases } from '../../data/historicalCrisisData';
import { HistoricalCrisisCase } from '../../types';
import { MarketDataEngine } from '../../services/marketDataEngine';
import { StockQuote } from '../../services/alphaVantageService';
import { CrisisHistoryData } from '../../services/yahooFinanceService';

export const MarketSimModule: React.FC = () => {
  const [selectedCrisis, setSelectedCrisis] = useState<HistoricalCrisisCase>(mockCrisisCases[0]);
  const [userAction, setUserAction] = useState<'hold' | 'panic_sell' | null>(null);
  const [covidTimeline, setCovidTimeline] = useState<CrisisHistoryData | null>(null);
  
  // Real-time market sandbox — persisted to localStorage
  const [assetSymbol, setAssetSymbol] = useState('');
  const [assetQty, setAssetQty] = useState(1);
  const [liveQuote, setLiveQuote] = useState<StockQuote | null>(null);
  const [isSearchingQuote, setIsSearchingQuote] = useState(false);
  const [cashBalance, setCashBalance] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(getStorageKey('finsight_sandbox_cash'));
      return stored ? Number(stored) : 0;
    } catch { return 0; }
  });
  const [showCashInput, setShowCashInput] = useState(false);
  const [cashInputValue, setCashInputValue] = useState('');
  
  const [tradeLogs, setTradeLogs] = useState<Array<{
    id: string; asset: string; type: string; qty: number; price: number; total: number; time: string;
  }>>(() => {
    try {
      const stored = localStorage.getItem(getStorageKey('finsight_sandbox_trades'));
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  // Persist cash and trades to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(getStorageKey('finsight_sandbox_cash'), String(cashBalance));
  }, [cashBalance]);

  useEffect(() => {
    localStorage.setItem(getStorageKey('finsight_sandbox_trades'), JSON.stringify(tradeLogs));
  }, [tradeLogs]);

  // Fetch initial crisis data (no auto-quote since symbol is empty)
  const handleLookupQuote = async (sym: string) => {
    if (!sym.trim()) return;
    setIsSearchingQuote(true);
    try {
      const quote = await MarketDataEngine.getLiveQuote(sym);
      setLiveQuote(quote);
    } catch (e) {
      console.error('Failed to lookup quote:', e);
    } finally {
      setIsSearchingQuote(false);
    }
  };

  useEffect(() => {
    MarketDataEngine.getCovidCrisisData().then(data => setCovidTimeline(data));
  }, []);

  const handleSimulateTrade = (type: 'Buy' | 'Sell') => {
    if (!liveQuote) {
      alert('Search for a stock and get a live price before placing an order.');
      return;
    }
    if (cashBalance <= 0 && type === 'Buy') {
      alert('Set your virtual cash balance first using the "Set Cash" button.');
      return;
    }
    const price = liveQuote.price;
    const total = parseFloat((price * assetQty).toFixed(2));
    const sym = liveQuote.symbol;

    if (type === 'Buy') {
      if (cashBalance < total) {
        alert('Insufficient virtual cash balance for this order.');
        return;
      }
      setCashBalance(prev => prev - total);
    } else {
      setCashBalance(prev => prev + total);
    }

    setTradeLogs([
      {
        id: String(Date.now()),
        asset: sym,
        type,
        qty: assetQty,
        price,
        total,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      },
      ...tradeLogs,
    ]);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 2-Column Simulators Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Virtual Sandbox & Real-time Equity Order Execution (Left) */}
        <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#00b090]" />
              <h3 className="font-heading font-bold text-lg text-[#191c1e]">
                Live Market Sandbox
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#006b57] bg-[#f2f4f6] px-2.5 py-1 rounded">
                <span>Cash: ₹{cashBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
              </div>
              {showCashInput ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={cashInputValue}
                    onChange={(e) => setCashInputValue(e.target.value)}
                    placeholder="e.g. 500000"
                    className="w-28 px-2 py-1 text-xs bg-[#f7f9fb] border border-[#E2E8F0] rounded outline-none focus:border-[#00b090] font-mono"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      const val = Number(cashInputValue);
                      if (val > 0) { setCashBalance(val); setShowCashInput(false); setCashInputValue(''); }
                    }}
                    className="text-[10px] font-heading font-bold text-[#006b57] hover:underline"
                  >
                    Set
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowCashInput(true)}
                  className="text-[10px] font-heading font-bold text-[#006b57] hover:underline"
                >
                  {cashBalance === 0 ? 'Set Cash' : 'Adjust'}
                </button>
              )}
            </div>
          </div>

          <div className="space-y-4">
            {/* Asset Search */}
            <div className="space-y-2">
              <label className="block text-xs font-heading font-bold text-[#191c1e]">
                Search NSE Equity / ETF Symbol (yahoo-finance2 Live Feed):
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#565e74]" />
                  <input
                    type="text"
                    placeholder="e.g. RELIANCE, HDFCBANK, INFY, TCS, ICICIBANK..."
                    value={assetSymbol}
                    onChange={(e) => setAssetSymbol(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleLookupQuote(assetSymbol)}
                    className="w-full pl-9 pr-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs text-[#191c1e] outline-none focus:border-[#00b090]"
                  />
                </div>
                <button
                  onClick={() => handleLookupQuote(assetSymbol)}
                  disabled={isSearchingQuote}
                  className="btn-secondary text-xs py-2 px-4 shrink-0"
                >
                  {isSearchingQuote ? 'Fetching...' : 'Get Live Price'}
                </button>
              </div>
            </div>

            {/* Live Quote Card */}
            {liveQuote && (
              <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-3">
                {/* Header row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-heading font-bold text-sm text-[#191c1e]">{liveQuote.symbol}</span>
                      <span className={`text-[11px] font-mono font-semibold px-2 py-0.5 rounded ${
                        liveQuote.change >= 0 ? 'bg-[#00b090]/10 text-[#006b57]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                      }`}>
                        {liveQuote.change >= 0 ? '+' : ''}{liveQuote.changePercent}
                      </span>
                    </div>
                    {liveQuote.name && liveQuote.name !== liveQuote.symbol && (
                      <span className="text-[11px] text-[#565e74] block mt-0.5">{liveQuote.name}</span>
                    )}
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-heading font-extrabold text-[#191c1e] font-mono block">
                      ₹{liveQuote.price.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-[#565e74] font-mono">NSE Live • yahoo-finance2</span>
                  </div>
                </div>
                {/* 52W Range */}
                {(liveQuote.fiftyTwoWeekHigh || liveQuote.fiftyTwoWeekLow) && (
                  <div className="text-[11px] text-[#565e74]">
                    52W: ₹{liveQuote.fiftyTwoWeekLow?.toFixed(2)} – ₹{liveQuote.fiftyTwoWeekHigh?.toFixed(2)}
                  </div>
                )}
                {/* Fundamentals row */}
                {(liveQuote.trailingPE || liveQuote.marketCap || liveQuote.returnOnEquity) && (
                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#E2E8F0]">
                    {liveQuote.trailingPE != null && (
                      <div>
                        <div className="text-[10px] text-[#565e74] uppercase tracking-wider">P/E Ratio</div>
                        <div className="text-xs font-heading font-bold text-[#191c1e] font-mono">{liveQuote.trailingPE.toFixed(1)}x</div>
                      </div>
                    )}
                    {liveQuote.marketCap != null && (
                      <div>
                        <div className="text-[10px] text-[#565e74] uppercase tracking-wider">Mkt Cap</div>
                        <div className="text-xs font-heading font-bold text-[#191c1e] font-mono">
                          ₹{(liveQuote.marketCap / 1e12).toFixed(2)}T
                        </div>
                      </div>
                    )}
                    {liveQuote.returnOnEquity != null && (
                      <div>
                        <div className="text-[10px] text-[#565e74] uppercase tracking-wider">ROE</div>
                        <div className="text-xs font-heading font-bold text-[#191c1e] font-mono">
                          {(liveQuote.returnOnEquity * 100).toFixed(1)}%
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Order Controls */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-32">
                <label className="block text-[11px] font-heading font-bold text-[#565e74] mb-1">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={assetQty}
                  onChange={(e) => setAssetQty(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs text-[#191c1e] outline-none focus:border-[#00b090]"
                />
              </div>

              <div className="flex-1 flex gap-2 pt-5">
                <button
                  onClick={() => handleSimulateTrade('Buy')}
                  className="btn-primary flex-1 text-xs py-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>Buy @ Live Price</span>
                </button>
                <button
                  onClick={() => handleSimulateTrade('Sell')}
                  className="btn-secondary flex-1 text-xs py-2"
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>Sell</span>
                </button>
              </div>
            </div>

            {/* Trade History */}
            <div className="pt-4 border-t border-[#E2E8F0]">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider">
                  Simulated Execution Ledger
                </h4>
                {tradeLogs.length > 0 && (
                  <button
                    onClick={() => { setTradeLogs([]); }}
                    className="text-[10px] text-[#ba1a1a] font-heading font-bold hover:underline"
                  >
                    Clear History
                  </button>
                )}
              </div>
              {tradeLogs.length === 0 ? (
                <div className="text-center py-6 text-xs text-[#565e74] border border-[#E2E8F0] rounded-lg bg-[#f7f9fb]">
                  No trades yet. Search for a stock, set your virtual cash, and execute your first simulated order.
                </div>
              ) : (
              <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f7f9fb] border-b border-[#E2E8F0]">
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Asset</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Type</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Qty</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Price</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74] text-right">Total Outflow</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E2E8F0]">
                    {tradeLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-[#f7f9fb]">
                        <td className="p-2.5 font-heading font-bold text-[#191c1e]">{log.asset}</td>
                        <td className="p-2.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-heading font-bold ${
                            log.type === 'Buy' ? 'bg-[#00b090]/10 text-[#006b57]' : 'bg-[#ffdad6] text-[#ba1a1a]'
                          }`}>
                            {log.type}
                          </span>
                        </td>
                        <td className="p-2.5 text-[#565e74] font-mono">{log.qty}</td>
                        <td className="p-2.5 text-[#565e74] font-mono">₹{log.price.toFixed(2)}</td>
                        <td className="p-2.5 text-right font-mono font-bold text-[#191c1e]">
                          ₹{log.total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        </section>

        {/* Historical Crisis Replay Engine with Authentic Trajectories (Right) */}
        <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#ba1a1a]" />
              <h3 className="font-heading font-bold text-lg text-[#191c1e]">
                Authentic Crash Replay Engine
              </h3>
            </div>
            <span className="text-xs font-mono text-[#006b57] bg-[#f2f4f6] px-2 py-0.5 rounded">
              Yahoo Finance Historical Series
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {mockCrisisCases.map((crisis: HistoricalCrisisCase) => (
              <button
                key={crisis.id}
                onClick={() => {
                  setSelectedCrisis(crisis);
                  setUserAction(null);
                }}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedCrisis.id === crisis.id
                    ? 'bg-[#006b57] text-white border-[#006b57] font-bold'
                    : 'bg-[#f7f9fb] text-[#565e74] border-[#E2E8F0] hover:bg-[#eceef0]'
                }`}
              >
                {crisis.title.split(':')[0]}
              </button>
            ))}
          </div>

          {/* Crisis Details Card */}
          <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-3">
            <div className="flex justify-between items-baseline">
              <h4 className="font-heading font-bold text-base text-[#191c1e]">
                {selectedCrisis.title}
              </h4>
              <span className="text-sm font-heading font-extrabold text-[#ba1a1a] font-mono">
                -{selectedCrisis.drawdownPercentage}%
              </span>
            </div>

            <p className="text-xs text-[#565e74] leading-relaxed">
              {selectedCrisis.description}
            </p>

            {/* Authentic Timeline Data Points for Covid 2020 */}
            {selectedCrisis.id === 'covid-2020' && covidTimeline && (
              <div className="p-3 rounded-lg bg-white border border-[#E2E8F0] space-y-2">
                <span className="text-[11px] font-heading font-bold text-[#191c1e] block">
                  Authentic Nifty 50 Crisis Milestone Points:
                </span>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="p-2 rounded bg-[#f7f9fb]">
                    <span className="text-[10px] text-[#565e74] block">Pre-Crash Peak</span>
                    <span className="text-xs font-mono font-bold text-[#191c1e]">₹12,201.20</span>
                  </div>
                  <div className="p-2 rounded bg-[#ffdad6]/30">
                    <span className="text-[10px] text-[#ba1a1a] block">March 23 Bottom</span>
                    <span className="text-xs font-mono font-bold text-[#ba1a1a]">₹7,610.25</span>
                  </div>
                  <div className="p-2 rounded bg-[#00b090]/10">
                    <span className="text-[10px] text-[#006b57] block">Nov 2020 Recovery</span>
                    <span className="text-xs font-mono font-bold text-[#006b57]">₹12,968.95</span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="p-2.5 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#565e74] block">Period</span>
                <span className="font-heading font-bold text-[#191c1e] mt-0.5 block">{selectedCrisis.period}</span>
              </div>
              <div className="p-2.5 rounded bg-white border border-[#E2E8F0]">
                <span className="text-[#565e74] block">Recovery Timeline</span>
                <span className="font-heading font-bold text-[#00b090] mt-0.5 block">{selectedCrisis.recoveryMonths} Months</span>
              </div>
            </div>
          </div>

          {/* Interactive Decision Test */}
          <div className="space-y-3">
            <h4 className="text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
              Test Your Reaction: What would you do at the trough?
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setUserAction('panic_sell')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  userAction === 'panic_sell'
                    ? 'border-[#ba1a1a] bg-[#ffdad6]/20'
                    : 'border-[#E2E8F0] hover:border-[#ba1a1a]/50 bg-white'
                }`}
              >
                <span className="text-xs font-heading font-bold text-[#ba1a1a] block">Panic Sell & Exit</span>
                <span className="text-[11px] text-[#565e74] mt-1 block">Stop further losses and move into savings FD.</span>
              </button>

              <button
                onClick={() => setUserAction('hold')}
                className={`p-3 rounded-lg border text-left transition-all ${
                  userAction === 'hold'
                    ? 'border-[#00b090] bg-[#00b090]/10'
                    : 'border-[#E2E8F0] hover:border-[#00b090]/50 bg-white'
                }`}
              >
                <span className="text-xs font-heading font-bold text-[#006b57] block">Continue SIP Uninterrupted</span>
                <span className="text-[11px] text-[#565e74] mt-1 block">Accumulate cheap units systematically.</span>
              </button>
            </div>

            {userAction && (
              <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] space-y-2 mt-3">
                <div className="flex items-center gap-2">
                  {userAction === 'hold' ? (
                    <CheckCircle className="w-4 h-4 text-[#00b090]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-[#ba1a1a]" />
                  )}
                  <span className="text-xs font-heading font-bold text-[#191c1e]">
                    Empirical Historical Outcome:
                  </span>
                </div>
                <p className="text-xs text-[#565e74] leading-relaxed">
                  {userAction === 'hold'
                    ? selectedCrisis.continuedSipResult
                    : selectedCrisis.panicSoldResult}
                </p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
