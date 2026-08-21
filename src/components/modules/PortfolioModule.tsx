import { getStorageKey } from '../../utils';
import React, { useState, useEffect } from 'react';
import { 
  PieChart, 
  AlertTriangle, 
  ArrowUpRight, 
  Building2, 
  ShieldCheck, 
  RefreshCw,
  Landmark,
  Plus,
  X
} from 'lucide-react';
import { PortfolioHolding } from '../../types';
import { MarketDataEngine, LiveHoldingValuation } from '../../services/marketDataEngine';

export const PortfolioModule: React.FC = () => {
  const [holdings, setHoldings] = useState<PortfolioHolding[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('finsight_portfolio_holdings'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveValuations, setLiveValuations] = useState<LiveHoldingValuation[]>([]);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHolding, setNewHolding] = useState<Partial<PortfolioHolding>>({
    name: '',
    ticker: '',
    category: 'Large Cap',
    platform: 'Zerodha',
    investedValue: 0,
    currentValue: 0,
  });

  useEffect(() => {
    localStorage.setItem(getStorageKey('finsight_portfolio_holdings'), JSON.stringify(holdings));
    if (holdings.length > 0) {
      loadLivePortfolioData();
    }
  }, [holdings]);

  const loadLivePortfolioData = async () => {
    if (holdings.length === 0) return;
    setIsRefreshing(true);
    try {
      const vals = await MarketDataEngine.evaluatePortfolio(holdings);
      setLiveValuations(vals);
      setLastUpdated(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (e) {
      console.error('Failed to evaluate live portfolio:', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  const displayedHoldings = liveValuations.length > 0 ? liveValuations : holdings.map(h => ({
    holding: h,
    livePriceOrNav: h.currentValue,
    currentValue: h.currentValue,
    unrealizedGain: h.currentValue - h.investedValue,
    unrealizedReturnPct: h.investedValue > 0 ? ((h.currentValue - h.investedValue) / h.investedValue) * 100 : 0,
    source: 'User Entry' as const,
    asOfDate: new Date().toISOString().split('T')[0],
  }));

  const filteredHoldings = selectedPlatform === 'all'
    ? displayedHoldings
    : displayedHoldings.filter(item => item.holding.platform.toLowerCase().includes(selectedPlatform.toLowerCase()));

  const totalInvested = displayedHoldings.reduce((acc, h) => acc + h.holding.investedValue, 0);
  const totalCurrent = displayedHoldings.reduce((acc, h) => acc + h.currentValue, 0);
  const netGain = totalCurrent - totalInvested;
  const returnPercent = totalInvested > 0 ? ((netGain / totalInvested) * 100).toFixed(1) : '0.0';

  const handleAddHolding = (e: React.FormEvent) => {
    e.preventDefault();
    const id = Date.now().toString();
    const returnsPercentage = newHolding.investedValue 
      ? ((Number(newHolding.currentValue) - Number(newHolding.investedValue)) / Number(newHolding.investedValue)) * 100 
      : 0;
      
    const holdingToAdd: PortfolioHolding = {
      id,
      name: newHolding.name || 'Unnamed Asset',
      ticker: newHolding.ticker || '',
      category: newHolding.category as any || 'Large Cap',
      platform: newHolding.platform as any || 'Zerodha',
      investedValue: Number(newHolding.investedValue) || 0,
      currentValue: Number(newHolding.currentValue) || 0,
      returnsPercentage,
      xirr: returnsPercentage,
    };

    setHoldings(prev => [...prev, holdingToAdd]);
    setShowAddModal(false);
    setNewHolding({
      name: '',
      ticker: '',
      category: 'Large Cap',
      platform: 'Zerodha',
      investedValue: 0,
      currentValue: 0,
    });
  };

  if (holdings.length === 0) {
    return (
      <div className="space-y-8 pb-12">
        <div className="p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#f7f9fb] flex items-center justify-center">
            <Landmark className="w-8 h-8 text-[#565e74]" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-bold text-[#191c1e]">No holdings yet</h3>
            <p className="text-sm text-[#565e74] mt-1 max-w-sm">
              Add your first investment to see portfolio analytics, live tracking, and insights.
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary mt-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Holding
          </button>
        </div>
        {showAddModal && <AddHoldingModal />}
      </div>
    );
  }

  function AddHoldingModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#191c1e]/50 backdrop-blur-sm">
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
          <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
            <h3 className="font-heading font-bold text-lg">Add Holding</h3>
            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[#f2f4f6] rounded">
              <X className="w-5 h-5 text-[#565e74]" />
            </button>
          </div>
          <form onSubmit={handleAddHolding} className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">Name / Scheme</label>
              <input type="text" required className="w-full input-field text-sm" value={newHolding.name} onChange={e => setNewHolding({...newHolding, name: e.target.value})} placeholder="e.g. UTI Nifty 50 Index Fund" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Ticker (Optional)</label>
                <input type="text" className="w-full input-field text-sm" value={newHolding.ticker} onChange={e => setNewHolding({...newHolding, ticker: e.target.value})} placeholder="e.g. NIFTYBEES" />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Platform</label>
                <select className="w-full input-field text-sm" value={newHolding.platform} onChange={e => setNewHolding({...newHolding, platform: e.target.value as any})}>
                  <option value="Zerodha">Zerodha</option>
                  <option value="Groww">Groww</option>
                  <option value="INDmoney">INDmoney</option>
                  <option value="EPFO">EPFO</option>
                  <option value="Direct Bank">Direct Bank</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#565e74] mb-1">Category</label>
              <select className="w-full input-field text-sm" value={newHolding.category} onChange={e => setNewHolding({...newHolding, category: e.target.value as any})}>
                <option value="Large Cap">Large Cap</option>
                <option value="Flexi Cap">Flexi Cap</option>
                <option value="Mid Cap">Mid Cap</option>
                <option value="Debt/EPF">Debt/EPF</option>
                <option value="Gold/SGB">Gold/SGB</option>
                <option value="Liquid Cash">Liquid Cash</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Invested Value (₹)</label>
                <input type="number" required min="0" step="1" className="w-full input-field text-sm" value={newHolding.investedValue || ''} onChange={e => setNewHolding({...newHolding, investedValue: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Current Value (₹)</label>
                <input type="number" required min="0" step="1" className="w-full input-field text-sm" value={newHolding.currentValue || ''} onChange={e => setNewHolding({...newHolding, currentValue: Number(e.target.value)})} />
              </div>
            </div>
            <div className="pt-4 flex gap-3">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 btn-secondary py-2 text-sm">Cancel</button>
              <button type="submit" className="flex-1 btn-primary py-2 text-sm">Save Holding</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Live Data Badge */}
        <div className="flex-1 flex items-center gap-3 p-4 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <div className="w-8 h-8 rounded-lg bg-[#00b090]/10 text-[#006b57] flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-heading font-bold text-[#191c1e]">
                Portfolio Data Feed
              </span>
              {liveValuations.length > 0 && (
                <span className="inline-block w-2 h-2 rounded-full bg-[#00b090] animate-pulse"></span>
              )}
            </div>
            <p className="text-[11px] text-[#565e74]">
              {liveValuations.length > 0 ? `Synced with market data. Last sync: ${lastUpdated || 'Loading...'}` : 'User-entered manual holdings data.'}
            </p>
          </div>
          {liveValuations.length > 0 && (
            <button
              onClick={loadLivePortfolioData}
              disabled={isRefreshing}
              className="ml-auto btn-secondary text-xs py-1.5 px-3 flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#006b57]' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Syncing...' : 'Refresh'}</span>
            </button>
          )}
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <label className="btn-secondary py-3 px-4 flex items-center gap-2 cursor-pointer">
            <input type="file" accept=".csv" className="hidden" onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const reader = new FileReader();
              reader.onload = (event) => {
                const text = event.target?.result as string;
                if (!text) return;
                const lines = text.split('\n');
                if (lines.length < 2) { alert('Invalid CSV format. Please provide headers and data rows.'); return; }
                const newImports: PortfolioHolding[] = [];
                for (let i = 1; i < lines.length; i++) {
                  const line = lines[i].trim();
                  if (!line) continue;
                  const parts = line.split(',');
                  newImports.push({
                    id: 'import-' + Date.now() + '-' + i,
                    name: parts[0] || 'Imported Holding',
                    ticker: parts[1] || '',
                    platform: (parts[2] || 'Direct Bank') as any,
                    category: (parts[3] || 'Large Cap') as any,
                    investedValue: parseFloat(parts[4]) || 0,
                    currentValue: parseFloat(parts[5]) || 0,
                    returnsPercentage: 0,
                    xirr: 0
                  });
                }
                setHoldings(prev => [...prev, ...newImports]);
              };
              reader.readAsText(file);
              e.target.value = '';
            }} />
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
            Import CSV
          </label>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary py-3 px-4 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Holding
          </button>
        </div>
      </div>

      {/* Portfolio Overview Banner */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Consolidated Value
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{totalCurrent.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#00b090] font-mono mt-1 block">
            Total Current Value
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Principal Invested
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{totalInvested.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#565e74] font-mono mt-1 block">
            Cost basis
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Unrealized Returns
          </span>
          <span className={`text-2xl font-heading font-extrabold font-mono mt-1 block ${netGain >= 0 ? 'text-[#00b090]' : 'text-[#ba1a1a]'}`}>
            {netGain >= 0 ? '+' : ''}₹{netGain.toLocaleString('en-IN')}
          </span>
          <span className={`text-[11px] font-mono mt-1 block ${netGain >= 0 ? 'text-[#00b090]' : 'text-[#ba1a1a]'}`}>
            {netGain >= 0 ? '+' : ''}{returnPercent}% absolute gain
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Holdings Count
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
            {holdings.length}
          </span>
          <span className="text-[11px] text-[#565e74] font-mono mt-1 block">
            Tracked Assets
          </span>
        </div>
      </div>

      {/* Holdings Ledger Table */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-bold text-base text-[#191c1e]">
              Consolidated Holdings Ledger
            </h4>
            <p className="text-xs text-[#565e74]">
              Real-time Net Asset Values & official exchange prices.
            </p>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            {['all', 'zerodha', 'groww', 'epfo', 'indmoney', 'direct bank'].map((b) => (
              <button
                key={b}
                onClick={() => setSelectedPlatform(b)}
                className={`text-xs px-3 py-1.5 rounded-lg border uppercase font-heading font-semibold transition-colors whitespace-nowrap ${
                  selectedPlatform === b
                    ? 'bg-[#006b57] text-white border-[#006b57]'
                    : 'bg-[#f7f9fb] text-[#565e74] border-[#E2E8F0] hover:bg-[#eceef0]'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#f7f9fb] border-b border-[#E2E8F0]">
                <th className="p-3.5 font-heading font-bold text-[#565e74]">Asset / Scheme</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74]">Platform</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Invested</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Current Value</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Live Gain / Return</th>
                <th className="p-3.5 font-heading font-bold text-[#565e74] text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {filteredHoldings.map((item) => (
                <tr key={item.holding.id} className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5">
                    <span className="font-heading font-bold text-[#191c1e] block">{item.holding.name}</span>
                    <span className="text-[10px] text-[#565e74] font-mono">
                      {item.source} • {item.holding.category}
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded bg-[#f2f4f6] text-[#565e74] font-mono text-[10px] uppercase">
                      {item.holding.platform}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono text-[#565e74]">
                    ₹{item.holding.investedValue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-[#191c1e]">
                    ₹{item.currentValue.toLocaleString('en-IN')}
                  </td>
                  <td className={`p-3.5 text-right font-mono font-bold ${item.unrealizedGain >= 0 ? 'text-[#00b090]' : 'text-[#ba1a1a]'}`}>
                    {item.unrealizedGain >= 0 ? '+' : ''}{item.unrealizedReturnPct.toFixed(1)}% 
                    ({item.unrealizedGain >= 0 ? '+' : ''}₹{item.unrealizedGain.toLocaleString('en-IN')})
                  </td>
                  <td className="p-3.5 text-center">
                    <button 
                      onClick={() => setHoldings(prev => prev.filter(h => h.id !== item.holding.id))}
                      className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1.5 rounded"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredHoldings.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#565e74]">
                    No holdings match the selected platform.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {showAddModal && <AddHoldingModal />}
    </div>
  );
};
