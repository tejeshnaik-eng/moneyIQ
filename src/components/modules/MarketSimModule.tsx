import React, { useState } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle,
  Search
} from 'lucide-react';
import { mockCrisisCases } from '../../mock/marketSimData';
import { HistoricalCrisisCase } from '../../types';

export const MarketSimModule: React.FC = () => {
  const [selectedCrisis, setSelectedCrisis] = useState<HistoricalCrisisCase>(mockCrisisCases[0]);
  const [userAction, setUserAction] = useState<'hold' | 'panic_sell' | null>(null);
  
  const [assetSymbol, setAssetSymbol] = useState('');
  const [assetQty, setAssetQty] = useState(10);
  const [tradeLogs, setTradeLogs] = useState([
    { id: '1', asset: 'NIFTYBEES', type: 'Buy', qty: 25, price: 245.5, total: 6137.5 },
    { id: '2', asset: 'GOLDBEES', type: 'Buy', qty: 100, price: 62.0, total: 6200.0 },
    { id: '3', asset: 'HDFCBANK', type: 'Buy', qty: 10, price: 1620.0, total: 16200.0 },
  ]);

  const handleSimulateTrade = (type: 'Buy' | 'Sell') => {
    if (!assetSymbol.trim()) return;
    const price = 250.0;
    const total = price * assetQty;
    setTradeLogs([
      { id: String(Date.now()), asset: assetSymbol.toUpperCase(), type, qty: assetQty, price, total },
      ...tradeLogs,
    ]);
    setAssetSymbol('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 2-Column Simulators Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* Virtual Sandbox & Order Execution (Left) */}
        <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E2E8F0]">
            <Activity className="w-5 h-5 text-[#00b090]" />
            <h3 className="font-heading font-bold text-lg text-[#191c1e]">
              Virtual Paper Sandbox
            </h3>
            <span className="text-xs font-mono text-[#006b57] ml-auto bg-[#f2f4f6] px-2.5 py-1 rounded">
              Balance: ₹1,00,000
            </span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="w-4 h-4 absolute left-3 top-3 text-[#565e74]" />
                <input
                  type="text"
                  placeholder="Asset Symbol (e.g. NIFTYBEES, GOLDBEES, INFY)..."
                  value={assetSymbol}
                  onChange={(e) => setAssetSymbol(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs text-[#191c1e] outline-none focus:border-[#00b090]"
                />
              </div>
              <div className="w-full sm:w-28">
                <input
                  type="number"
                  min="1"
                  value={assetQty}
                  onChange={(e) => setAssetQty(Number(e.target.value))}
                  placeholder="Qty"
                  className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs text-[#191c1e] outline-none focus:border-[#00b090]"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleSimulateTrade('Buy')}
                className="btn-primary flex-1 text-xs py-2"
              >
                <TrendingUp className="w-4 h-4" />
                <span>Simulate Buy</span>
              </button>
              <button
                onClick={() => handleSimulateTrade('Sell')}
                className="btn-secondary flex-1 text-xs py-2"
              >
                <TrendingDown className="w-4 h-4" />
                <span>Simulate Sell</span>
              </button>
            </div>

            {/* Trade History */}
            <div className="pt-2">
              <h4 className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider mb-2">
                Virtual Trade History Ledger
              </h4>
              <div className="overflow-x-auto border border-[#E2E8F0] rounded-lg">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#f7f9fb] border-b border-[#E2E8F0]">
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Asset</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Type</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Qty</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74]">Price</th>
                      <th className="p-2.5 font-heading font-bold text-[#565e74] text-right">Total</th>
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
                          ₹{log.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Historical Crisis Replay Engine (Right) */}
        <section className="bg-white border border-[#E2E8F0] rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#ba1a1a]" />
              <h3 className="font-heading font-bold text-lg text-[#191c1e]">
                Historical Crash Replay Engine
              </h3>
            </div>
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

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
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
              Test Your Emotional Reaction: What would you do at the bottom?
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
                    Historical Outcome:
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
