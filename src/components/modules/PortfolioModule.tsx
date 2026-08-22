import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { 
  Plus,
  X,
  Trash2,
  Landmark
} from 'lucide-react';
import { PortfolioHolding } from '../../types';
import { MarketDataEngine, LiveHoldingValuation } from '../../services/marketDataEngine';
import { PortfolioAnalyzer } from './PortfolioAnalyzer';

export const PortfolioModule: React.FC = () => {
  const { user } = useAuth();
  const [holdings, setHoldings] = useState<PortfolioHolding[]>([]);
  const [isLoadingDb, setIsLoadingDb] = useState(true);

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
    async function fetchHoldings() {
      if (!user) {
        setHoldings([]);
        setIsLoadingDb(false);
        return;
      }
      setIsLoadingDb(true);
      try {
        const { data, error } = await supabase
          .from('portfolios')
          .select('*')
          .eq('user_id', user.id);
          
        if (error) throw error;
        
        if (data) {
          const mapped: PortfolioHolding[] = data.map((d: any) => ({
            id: d.id,
            name: d.name,
            ticker: d.ticker || '',
            category: d.category,
            platform: d.platform,
            investedValue: Number(d.invested),
            currentValue: Number(d.current),
            returnsPercentage: d.invested ? ((Number(d.current) - Number(d.invested)) / Number(d.invested)) * 100 : 0,
            xirr: d.invested ? ((Number(d.current) - Number(d.invested)) / Number(d.invested)) * 100 : 0,
          }));
          setHoldings(mapped);
        }
      } catch (err) {
        console.error('Error fetching portfolios:', err);
      } finally {
        setIsLoadingDb(false);
      }
    }
    
    fetchHoldings();
  }, [user]);

  useEffect(() => {
    if (holdings.length > 0) {
      loadLivePortfolioData();
    }
  }, [holdings.length]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = event.target?.result;
      if (!data) return;
      
      try {
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        
        const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];
        
        let headerIndex = -1;
        for (let i = 0; i < rows.length; i++) {
          if (rows[i] && rows[i][0] === 'Stock Name' && rows[i][1] === 'ISIN') {
            headerIndex = i;
            break;
          }
        }
        
        const newImports: PortfolioHolding[] = [];
        
        if (headerIndex !== -1) {
          for (let i = headerIndex + 1; i < rows.length; i++) {
            const row = rows[i];
            if (!row || !row[0] || !row[1]) continue; 
            
            const name = row[0];
            const isin = row[1];
            const investedValue = parseFloat(row[4]) || 0;
            const currentValue = parseFloat(row[6]) || 0;
            
            newImports.push({
              id: 'import-' + Date.now() + '-' + i,
              name: name,
              ticker: isin,
              platform: 'Zerodha',
              category: 'Large Cap',
              investedValue: investedValue,
              currentValue: currentValue,
              returnsPercentage: 0,
              xirr: 0
            });
          }
        } else {
          const lines = (data as string).split('\n');
          if (lines.length > 1) {
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
          }
        }
        
        if (newImports.length > 0) {
          if (user) {
            const rowsToInsert = newImports.map(h => ({
              user_id: user.id,
              name: h.name,
              ticker: h.ticker,
              category: h.category,
              platform: h.platform,
              invested: h.investedValue,
              current: h.currentValue
            }));
            const { data, error } = await supabase.from('portfolios').insert(rowsToInsert).select();
            if (!error && data) {
              const mapped: PortfolioHolding[] = data.map((d: any) => ({
                id: d.id,
                name: d.name,
                ticker: d.ticker || '',
                category: d.category,
                platform: d.platform,
                investedValue: Number(d.invested),
                currentValue: Number(d.current),
                returnsPercentage: d.invested ? ((Number(d.current) - Number(d.invested)) / Number(d.invested)) * 100 : 0,
                xirr: d.invested ? ((Number(d.current) - Number(d.invested)) / Number(d.invested)) * 100 : 0,
              }));
              setHoldings(prev => [...prev, ...mapped]);
            }
          }
        } else {
          alert('No valid holdings found in the file.');
        }
      } catch (err) {
        console.error("Failed to parse file", err);
        alert('Error parsing file.');
      }
    };
    
    if (file.name.endsWith('.csv')) {
      reader.readAsText(file);
    } else {
      reader.readAsBinaryString(file);
    }
    
    e.target.value = '';
  };

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

  const handleAddHolding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert('Please log in to add holdings.');
      return;
    }
    const returnsPercentage = newHolding.investedValue 
      ? ((Number(newHolding.currentValue) - Number(newHolding.investedValue)) / Number(newHolding.investedValue)) * 100 
      : 0;
      
    try {
      const { data, error } = await supabase.from('portfolios').insert({
        user_id: user.id,
        name: newHolding.name || 'Unnamed Asset',
        ticker: newHolding.ticker || '',
        category: newHolding.category || 'Large Cap',
        platform: newHolding.platform || 'Zerodha',
        invested: Number(newHolding.investedValue) || 0,
        current: Number(newHolding.currentValue) || 0
      }).select().single();

      if (error) throw error;

      const holdingToAdd: PortfolioHolding = {
        id: data.id,
        name: data.name,
        ticker: data.ticker || '',
        category: data.category as any,
        platform: data.platform as any,
        investedValue: Number(data.invested),
        currentValue: Number(data.current),
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
    } catch (err) {
      console.error('Error adding holding:', err);
      alert('Failed to add holding.');
    }
  };

  function AddHoldingModal() {
    return createPortal(
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#1a1c1d]/50 backdrop-blur-sm">
        <div className="bg-surface-container-lowest rounded-xl shadow-xl w-full max-w-md overflow-hidden border border-outline-variant/30">
          <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
            <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Add Holding</h3>
            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-surface-variant rounded">
              <X className="w-5 h-5 text-on-surface-variant" />
            </button>
          </div>
          <div className="p-4 bg-surface flex flex-col items-center justify-center gap-2 border-b border-outline-variant/30">
            <span className="text-xs font-label-md text-tertiary uppercase tracking-widest">Fastest Way:</span>
            <label className="border border-primary text-primary py-2 px-4 rounded-lg flex items-center gap-2 cursor-pointer w-full justify-center bg-surface-container-lowest hover:bg-surface-variant/50 transition-colors">
              <input type="file" accept=".csv, .xlsx" className="hidden" onChange={(e) => {
                handleFileUpload(e);
                setShowAddModal(false);
              }} />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              Import Statement (XLSX/CSV)
            </label>
          </div>
          <form onSubmit={handleAddHolding} className="p-4 space-y-4">
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Name / Scheme</label>
              <input type="text" required className="w-full bg-surface border border-outline-variant/50 rounded-lg py-2 px-3 focus:outline-none focus:border-primary text-body-sm" value={newHolding.name} onChange={e => setNewHolding({...newHolding, name: e.target.value})} placeholder="e.g. UTI Nifty 50 Index Fund" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Ticker (Optional)</label>
                <input type="text" className="w-full bg-surface border border-outline-variant/50 rounded-lg py-2 px-3 focus:outline-none focus:border-primary text-body-sm" value={newHolding.ticker} onChange={e => setNewHolding({...newHolding, ticker: e.target.value})} placeholder="e.g. NIFTYBEES" />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Platform</label>
                <select className="w-full bg-surface border border-outline-variant/50 rounded-lg py-2 px-3 focus:outline-none focus:border-primary text-body-sm" value={newHolding.platform} onChange={e => setNewHolding({...newHolding, platform: e.target.value as any})}>
                  <option value="Zerodha">Zerodha</option>
                  <option value="Groww">Groww</option>
                  <option value="INDmoney">INDmoney</option>
                  <option value="EPFO">EPFO</option>
                  <option value="Direct Bank">Direct Bank</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Category</label>
              <select className="w-full bg-surface border border-outline-variant/50 rounded-lg py-2 px-3 focus:outline-none focus:border-primary text-body-sm" value={newHolding.category} onChange={e => setNewHolding({...newHolding, category: e.target.value as any})}>
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
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Invested Value (₹)</label>
                <input type="number" required min="0" step="1" className="w-full bg-surface border border-outline-variant/50 rounded-lg py-2 px-3 focus:outline-none focus:border-primary text-body-sm" value={newHolding.investedValue || ''} onChange={e => setNewHolding({...newHolding, investedValue: Number(e.target.value)})} />
              </div>
              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-1">Current Value (₹)</label>
                <input type="number" required min="0" step="1" className="w-full bg-surface border border-outline-variant/50 rounded-lg py-2 px-3 focus:outline-none focus:border-primary text-body-sm" value={newHolding.currentValue || ''} onChange={e => setNewHolding({...newHolding, currentValue: Number(e.target.value)})} />
              </div>
            </div>
            <div className="flex justify-between items-center gap-4 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="py-2 px-4 rounded-lg bg-surface-variant text-on-surface-variant font-label-md flex-1 text-center hover:bg-outline-variant/40">
                Cancel
              </button>
              <button type="submit" className="py-2 px-4 rounded-lg bg-primary text-on-primary font-label-md flex-1 text-center hover:bg-primary/90">
                Save Asset
              </button>
            </div>
          </form>
        </div>
      </div>,
      document.body
    );
  }

  if (isLoadingDb) {
    return (
      <div className="flex-1 flex items-center justify-center pt-8 pb-12">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
          <p className="text-on-surface-variant font-body-md">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto pt-8">
        <div className="p-12 rounded-2xl bg-surface-container-lowest border border-outline-variant/30 shadow-sm flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-surface-variant flex items-center justify-center">
            <Landmark className="w-8 h-8 text-on-surface-variant" />
          </div>
          <div>
            <h3 className="text-xl font-headline-md font-bold text-on-surface">No holdings yet</h3>
            <p className="text-sm font-body-sm text-on-surface-variant mt-2 max-w-sm">
              Add your first investment to see portfolio analytics, live tracking, and insights.
            </p>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all your portfolio holdings?')) {
                if (user) {
                  supabase.from('portfolios').delete().eq('user_id', user.id).then(() => {
                    setHoldings([]);
                  });
                }
              }
            }}
            className="btn-secondary py-3 px-4 flex items-center gap-2 text-[#ba1a1a] border-[#ba1a1a] hover:bg-[#ffdad6]"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-primary text-on-primary font-label-md py-3 px-6 rounded-lg flex items-center gap-2 mt-6 hover:bg-primary/90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Holding
          </button>
        </div>
        {showAddModal && <AddHoldingModal />}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full pt-8 pb-12">
      {/* Top Summary (Hero Panel) */}
      <section className="bg-[#0b1c30] text-white rounded-[2rem] p-12 shadow-xl mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="grid grid-cols-4 gap-8 relative z-10">
          <div className="col-span-4 md:col-span-1 flex flex-col">
            <span className="font-label-md text-label-md text-tertiary-fixed-dim uppercase tracking-widest mb-2 opacity-80">Consolidated Value</span>
            <span className="text-6xl font-display-lg font-light tracking-tight mt-1">
              ₹{(totalCurrent / 100000).toFixed(2)}L
            </span>
          </div>
          <div className="col-span-4 md:col-span-3 grid grid-cols-3 gap-8 md:pl-12 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
            <div className="flex flex-col justify-center">
              <span className="font-label-md text-label-md text-tertiary-fixed-dim uppercase tracking-widest mb-1 opacity-80">Principal</span>
              <span className="font-headline-lg text-headline-lg mt-auto">₹{(totalInvested / 100000).toFixed(2)}L</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-label-md text-label-md text-tertiary-fixed-dim uppercase tracking-widest mb-1 opacity-80">Unrealized Returns</span>
              <span className={`font-headline-lg text-headline-lg mt-auto font-medium ${netGain >= 0 ? 'text-[#77d4e5]' : 'text-error-container'}`}>
                {netGain >= 0 ? '+' : ''}{returnPercent}% <span className="text-xl opacity-80 font-normal ml-1">({netGain >= 0 ? '+' : '-'}₹{(Math.abs(netGain) / 100000).toFixed(2)}L)</span>
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-label-md text-label-md text-tertiary-fixed-dim uppercase tracking-widest mb-1 opacity-80">Active Holdings</span>
              <span className="font-headline-lg text-headline-lg mt-auto">{holdings.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="flex gap-8 mb-8 relative border-b border-outline-variant/30">
        {['ALL', 'ZERODHA', 'GROWW', 'INDMONEY'].map(platform => {
          const isActive = (selectedPlatform === platform.toLowerCase() || (selectedPlatform === 'all' && platform === 'ALL'));
          return (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform.toLowerCase())}
              className={`font-label-md text-label-md uppercase tracking-wider pb-4 relative group ${
                isActive ? 'text-primary' : 'text-on-surface-variant hover:text-primary transition-colors'
              }`}
            >
              {platform}
              <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-primary transition-transform origin-left ${
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}></div>
            </button>
          );
        })}
        <div className="ml-auto flex items-center gap-4 pb-4">
          <button 
            onClick={() => {
              if (window.confirm('Are you sure you want to clear all your portfolio holdings?')) {
                if (user) {
                  supabase.from('portfolios').delete().eq('user_id', user.id).then(() => {
                    setHoldings([]);
                  });
                }
              }
            }}
            className="font-label-md text-label-md uppercase tracking-wider text-error hover:underline flex items-center gap-1"
          >
            Clear Data
          </button>
          <button onClick={() => setShowAddModal(true)} className="font-label-md text-label-md uppercase tracking-wider text-primary hover:underline flex items-center gap-1">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </section>

      {/* Main Ledger */}
      <section className="flex-1 mb-12">
        <div className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 border-b border-outline-variant/40 bg-surface-container-lowest/50 px-6 py-4 text-label-md font-label-md text-tertiary uppercase tracking-widest">
            <div className="col-span-2">Asset / Scheme</div>
            <div className="text-right">Platform</div>
            <div className="text-right">Avg Cost</div>
            <div className="text-right">LTP</div>
            <div className="text-right">P&L</div>
          </div>
          
          {/* Table Rows */}
          <div className="space-y-0 divide-y divide-outline-variant/30">
            {filteredHoldings.map((item) => {
              const h = item.holding;
              const gain = item.unrealizedGain;
              const isPositive = gain >= 0;
              return (
                <div key={h.id} className="grid grid-cols-6 px-6 py-5 hover:bg-surface-variant/20 transition-colors group relative cursor-default">
                  <div className="col-span-2 flex flex-col justify-center">
                    <span className="font-headline-sm text-headline-sm font-semibold tracking-tight text-on-surface">
                      {h.ticker || h.name.split(' ')[0]}
                    </span>
                    <span className="font-label-md text-label-md text-tertiary mt-0.5">{h.name}</span>
                  </div>
                  <div className="text-right font-body-md text-body-md flex items-center justify-end text-on-surface-variant">
                    {h.platform}
                  </div>
                  <div className="text-right font-body-md text-body-md flex items-center justify-end text-on-surface-variant">
                    ₹{h.investedValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-right font-body-md text-body-md flex items-center justify-end font-medium text-on-surface">
                    ₹{item.currentValue.toLocaleString('en-IN')}
                  </div>
                  <div className={`text-right font-body-md text-body-md flex flex-col items-end justify-center font-medium ${isPositive ? 'text-status-positive' : 'text-status-risk'}`}>
                    <span>{isPositive ? '+' : '-'}₹{Math.abs(gain).toLocaleString('en-IN')}</span>
                    <span className="text-sm opacity-80">({isPositive ? '+' : ''}{item.unrealizedReturnPct.toFixed(1)}%)</span>
                  </div>
                  
                  {!isPositive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-status-risk rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" title="Loss Making Asset"></div>
                  )}
                  <button 
                    onClick={async () => { if (user) { await supabase.from('portfolios').delete().eq('id', h.id); setHoldings(prev => prev.filter(x => x.id !== h.id)); } }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-error hover:bg-error-container/50 rounded-full"
                    title="Remove Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            
            {filteredHoldings.length === 0 && (
              <div className="px-6 py-12 text-center font-body-md text-tertiary">
                No holdings match the selected filter.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Analysis Grid (Replaces old PortfolioAnalyzer location, but we inject PortfolioAnalyzer here for AI) */}
      <section className="mb-xl bg-surface-container-lowest rounded-2xl shadow-sm border border-outline-variant/20 p-8">
        <div className="mb-6">
          <h3 className="font-label-md text-label-md text-tertiary uppercase tracking-widest mb-1">AI Insights</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Generate automated insights based on your portfolio constraints and market reality.</p>
        </div>
        <PortfolioAnalyzer 
          holdings={holdings}
          totals={{
            consolidatedValue: totalCurrent,
            principalInvested: totalInvested,
            unrealizedReturns: netGain,
            returnPct: Number(returnPercent)
          }}
        />
      </section>
      
      {showAddModal && <AddHoldingModal />}
    </div>
  );
};
