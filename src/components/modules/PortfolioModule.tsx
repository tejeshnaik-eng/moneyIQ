import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import * as XLSX from 'xlsx';
import { Plus, X, Trash2, Landmark, RefreshCw } from 'lucide-react';
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
    let isMounted = true;
    async function fetchHoldings() {
      if (!user) return;
      setIsLoadingDb(true);
      try {
        const { data, error } = await supabase.from('portfolios').select('*').eq('user_id', user.id);
        if (error) throw error;
        
        if (isMounted && data) {
          const mapped: PortfolioHolding[] = data.map(row => ({
            id: row.id,
            name: row.name,
            ticker: row.ticker,
            category: row.category as any,
            platform: row.platform as any,
            investedValue: Number(row.invested),
            currentValue: Number(row.current),
            returnsPercentage: row.invested ? ((row.current - row.invested) / row.invested) * 100 : 0,
            xirr: 0,
          }));
          setHoldings(mapped);
        }
      } catch (error) {
        console.error("Error fetching portfolios:", error);
      } finally {
        if (isMounted) setIsLoadingDb(false);
      }
    }
    fetchHoldings();
    return () => { isMounted = false; };
  }, [user]);

  useEffect(() => {
    async function loadLiveValuations() {
      if (holdings.length === 0) return;
      setIsRefreshing(true);
      const vals = await MarketDataEngine.evaluatePortfolio(holdings);
      setLiveValuations(vals);
      setLastUpdated(new Date().toLocaleTimeString());
      setIsRefreshing(false);
    }
    loadLiveValuations();
  }, [holdings]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: 'binary' });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
      
      const newImports: PortfolioHolding[] = [];
      data.forEach((row: any, i) => {
        if (i === 0 || !row[0]) return; // skip header or empty rows
        
        // Simple heuristic parser for demo
        const isZerodha = (row[0] as string).toLowerCase().includes('zerodha');
        const isGroww = (row[0] as string).toLowerCase().includes('groww');
        
        let platform: any = 'Zerodha';
        if (isGroww) platform = 'Groww';
        else if ((row[0] as string).toLowerCase().includes('epfo')) platform = 'EPFO';
        
        if (typeof row[0] === 'string') {
          const parts = row[0].split('-');
          newImports.push({
            id: 'import-' + Date.now() + '-' + i,
            name: parts[0] || 'Imported Holding',
            ticker: parts[1]?.trim() || '',
            category: 'Flexi Cap',
            platform: platform,
            investedValue: Number(row[1]) || 0,
            currentValue: Number(row[2]) || Number(row[1]) || 0,
            returnsPercentage: 0,
            xirr: 0
          });
        }
      });
      
      if (newImports.length > 0 && user) {
        try {
          const rowsToInsert = newImports.map(h => ({
            user_id: user.id,
            name: h.name,
            ticker: h.ticker,
            category: h.category,
            platform: h.platform,
            invested: h.investedValue,
            current: h.currentValue
          }));
          
          const { data: insertedData, error } = await supabase.from('portfolios').insert(rowsToInsert).select();
          if (error) throw error;
          
          const mapped: PortfolioHolding[] = insertedData.map(row => ({
            id: row.id,
            name: row.name,
            ticker: row.ticker,
            category: row.category as any,
            platform: row.platform as any,
            investedValue: Number(row.invested),
            currentValue: Number(row.current),
            returnsPercentage: row.invested ? ((row.current - row.invested) / row.invested) * 100 : 0,
            xirr: 0,
          }));
          
          setHoldings(prev => [...prev, ...mapped]);
          alert(`Successfully imported ${newImports.length} holdings!`);
        } catch (err) {
          console.error(err);
          alert('Failed to save imported holdings to database.');
        }
      }
    };
    reader.readAsBinaryString(file);
  };

  const displayedHoldings = liveValuations.length > 0 ? liveValuations : holdings.map(h => ({
    holding: h,
    livePriceOrNav: h.currentValue,
    currentValue: h.currentValue,
    unrealizedGain: h.currentValue - h.investedValue,
    unrealizedReturnPct: h.investedValue > 0 ? ((h.currentValue - h.investedValue) / h.investedValue) * 100 : 0
  }));

  const filteredHoldings = selectedPlatform === 'all' 
    ? displayedHoldings
    : displayedHoldings.filter(item => item.holding.platform.toLowerCase().includes(selectedPlatform.toLowerCase()));

  const totalInvested = displayedHoldings.reduce((acc, h) => acc + (h.holding.investedValue || 0), 0);
  const totalCurrent = displayedHoldings.reduce((acc, h) => acc + (h.currentValue || 0), 0);
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
        ticker: data.ticker,
        category: data.category as any,
        platform: data.platform as any,
        investedValue: Number(data.invested),
        currentValue: Number(data.current),
        returnsPercentage: data.invested ? ((data.current - data.invested) / data.invested) * 100 : 0,
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
      console.error(err);
      alert('Failed to add holding.');
    }
  };

  const AddModal = () => {
    if (!showAddModal) return null;
    return createPortal(
      <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-[#1C1C1C] rounded-[24px] shadow-[0_24px_64px_rgba(0,0,0,0.5)] w-full max-w-lg overflow-hidden border-none text-white">
          <div className="p-6 pb-4 flex items-center justify-between border-none">
            <div>
              <h3 className="font-heading text-xl font-bold text-white mb-1">Add Asset</h3>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#1A3329] text-[#00D09C] text-[10px] font-bold tracking-wider uppercase">Equity</span>
                <span className="px-2 py-0.5 rounded-md bg-[#1A3329] text-[#00D09C] text-[10px] font-bold tracking-wider uppercase">Manual Entry</span>
              </div>
            </div>
            <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-[#2A2A2A] rounded-full transition-colors">
              <X className="w-5 h-5 text-[#8A8F98]" />
            </button>
          </div>
          
          <div className="px-6 pb-2">
            <label className="text-[#00D09C] py-2.5 px-4 rounded-xl flex items-center gap-2 cursor-pointer w-full justify-center bg-[#00D09C]/10 hover:bg-[#00D09C]/20 transition-colors font-bold text-[13px] border-none">
              <input type="file" accept=".csv, .xlsx" className="hidden" onChange={(e) => {
                handleFileUpload(e);
                setShowAddModal(false);
              }} />
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
              Import Statement (XLSX/CSV)
            </label>
          </div>

          <form onSubmit={handleAddHolding} className="p-6 space-y-5 pt-4">
            <div>
              <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Asset Name</label>
              <input type="text" required className="w-full bg-[#252525] border-none rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" value={newHolding.name} onChange={e => setNewHolding({...newHolding, name: e.target.value})} placeholder="e.g. Nippon India Small Cap Fund" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Ticker (Optional)</label>
                <input type="text" className="w-full bg-[#252525] border-none rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" value={newHolding.ticker} onChange={e => setNewHolding({...newHolding, ticker: e.target.value})} placeholder="e.g. NIFTYBEES" />
              </div>
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Platform</label>
                <select className="w-full bg-[#252525] border-none rounded-xl py-3.5 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white" value={newHolding.platform} onChange={e => setNewHolding({...newHolding, platform: e.target.value as any})}>
                  <option value="Zerodha">Zerodha</option>
                  <option value="Groww">Groww</option>
                  <option value="INDmoney">INDmoney</option>
                  <option value="EPFO">EPFO</option>
                  <option value="Direct Bank">Direct Bank</option>
                </select>
              </div>
            </div>
            
            <div className="bg-[#111111] p-4 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-[#222] pb-4">
                 <div className="text-[12px] font-medium text-[#8A8F98]">Category</div>
                 <select className="bg-transparent border-none focus:outline-none text-[#00D09C] font-bold text-right text-[14px]" value={newHolding.category} onChange={e => setNewHolding({...newHolding, category: e.target.value as any})}>
                  <option value="Large Cap">Large Cap</option>
                  <option value="Flexi Cap">Flexi Cap</option>
                  <option value="Mid Cap">Mid Cap</option>
                  <option value="Small Cap">Small Cap</option>
                  <option value="Debt/EPF">Debt/EPF</option>
                  <option value="Gold/SGB">Gold/SGB</option>
                  <option value="Liquid Cash">Liquid Cash</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-[11px] font-heading font-medium text-[#8A8F98] mb-1">Invested Amount</label>
                  <div className="flex items-center">
                    <span className="text-[#00D09C] font-bold text-xl mr-1">₹</span>
                    <input type="number" required min="0" step="1" className="w-full bg-transparent border-none p-0 focus:ring-0 text-xl font-bold text-white placeholder-[#444]" value={newHolding.investedValue || ''} onChange={e => setNewHolding({...newHolding, investedValue: Number(e.target.value)})} placeholder="5000" />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-heading font-medium text-[#8A8F98] mb-1">Current Value</label>
                  <div className="flex items-center">
                    <span className="text-[#00D09C] font-bold text-xl mr-1">₹</span>
                    <input type="number" required min="0" step="1" className="w-full bg-transparent border-none p-0 focus:ring-0 text-xl font-bold text-white placeholder-[#444]" value={newHolding.currentValue || ''} onChange={e => setNewHolding({...newHolding, currentValue: Number(e.target.value)})} placeholder="5500" />
                  </div>
                </div>
              </div>
            </div>
            
            <button type="submit" className="w-full bg-[#00D09C] text-black font-extrabold tracking-wide text-[15px] py-4 rounded-xl hover:bg-[#00E5AA] shadow-[0_4px_24px_rgba(0,208,156,0.25)] transition-all mt-4">
              SAVE ASSET
            </button>
          </form>
        </div>
      </div>,
      document.body
    );
  };

  if (isLoadingDb) {
    return (
      <div className="flex-1 flex items-center justify-center pt-8 pb-12">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-[#00D09C] border-t-transparent animate-spin"></div>
          <p className="text-[#8A8F98] font-body-md">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (holdings.length === 0) {
    return (
      <div className="space-y-8 pb-12 w-full max-w-7xl mx-auto pt-8 px-6 lg:px-10">
        <div className="p-12 rounded-[24px] bg-[#161616] border border-[#2A2A2A] shadow-xl flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-[#2A2A2A] flex items-center justify-center shadow-inner">
            <Landmark className="w-8 h-8 text-[#8A8F98]" />
          </div>
          <div>
            <h3 className="text-2xl font-heading font-bold text-white mb-2">No holdings yet</h3>
            <p className="text-[15px] text-[#8A8F98] max-w-sm mx-auto">
              Add your first investment to see portfolio analytics, live tracking, and insights.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 w-full max-w-md">
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to load demo data? This will clear current holdings.')) {
                  if (user) {
                    supabase.from('portfolios').delete().eq('user_id', user.id).then(() => {
                      setHoldings([]);
                    });
                  }
                }
              }}
              className="py-3.5 px-4 flex-1 items-center justify-center gap-2 text-[#D64545] font-bold text-[14px] hover:bg-[#D64545]/10 rounded-xl transition-colors border-none text-center"
            >
              Clear Data
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#00D09C] shadow-[0_4px_24px_rgba(0,208,156,0.3)] text-black font-extrabold text-[15px] py-3.5 px-8 rounded-xl flex-1 flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform"
            >
              <Plus className="w-5 h-5" />
              Add Asset
            </button>
          </div>
        </div>
        <AddModal />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full pt-8 pb-12 px-6 lg:px-10">
      {/* Top Summary (Hero Panel) */}
      <section className="bg-[#0b1c30] text-white rounded-[2rem] p-12 shadow-xl mb-16 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4"></div>
        <div className="grid grid-cols-4 gap-8 relative z-10">
          <div className="col-span-4 md:col-span-1 flex flex-col">
            <span className="font-label-md text-[11px] text-[#8A8F98] uppercase tracking-widest mb-2 opacity-80">Consolidated Value</span>
            <span className="text-6xl font-display-lg font-light tracking-tight mt-1 text-white">
              ₹{(totalCurrent / 100000).toFixed(2)}L
            </span>
          </div>
          <div className="col-span-4 md:col-span-3 grid grid-cols-3 gap-8 md:pl-12 border-t md:border-t-0 md:border-l border-white/10 pt-6 md:pt-0">
            <div className="flex flex-col justify-center">
              <span className="font-label-md text-[11px] text-[#8A8F98] uppercase tracking-widest mb-1 opacity-80">Principal</span>
              <span className="font-headline-lg text-2xl font-bold mt-auto text-white">₹{(totalInvested / 100000).toFixed(2)}L</span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-label-md text-[11px] text-[#8A8F98] uppercase tracking-widest mb-1 opacity-80">Unrealized Returns</span>
              <span className={`font-headline-lg text-2xl mt-auto font-medium ${netGain >= 0 ? 'text-[#00D09C]' : 'text-[#D64545]'}`}>
                {netGain >= 0 ? '+' : ''}{returnPercent}% <span className="text-[16px] opacity-80 font-normal ml-1">({netGain >= 0 ? '+' : '-'}₹{(Math.abs(netGain) / 100000).toFixed(2)}L)</span>
              </span>
            </div>
            <div className="flex flex-col justify-center">
              <span className="font-label-md text-[11px] text-[#8A8F98] uppercase tracking-widest mb-1 opacity-80">Active Holdings</span>
              <span className="font-headline-lg text-2xl font-bold mt-auto text-white">{holdings.length}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="flex gap-8 mb-8 relative border-b border-[#333]">
        {['ALL', 'ZERODHA', 'GROWW', 'INDMONEY'].map(platform => {
          const isActive = (selectedPlatform === platform.toLowerCase() || (selectedPlatform === 'all' && platform === 'ALL'));
          return (
            <button
              key={platform}
              onClick={() => setSelectedPlatform(platform.toLowerCase())}
              className={`font-label-md text-[11px] font-bold uppercase tracking-wider pb-4 relative group ${
                isActive ? 'text-[#00D09C]' : 'text-[#8A8F98] hover:text-[#00D09C] transition-colors'
              }`}
            >
              {platform}
              <div className={`absolute bottom-0 left-0 w-full h-[2px] bg-[#00D09C] transition-transform origin-left ${
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
            className="text-[11px] font-bold uppercase tracking-wider text-[#D64545] hover:bg-[#D64545]/10 px-3 py-1.5 rounded transition-colors flex items-center gap-1"
          >
            Clear Data
          </button>
          <button onClick={() => setShowAddModal(true)} className="text-[11px] font-bold uppercase tracking-wider text-black bg-[#00D09C] hover:bg-[#00E5AA] shadow-sm px-4 py-1.5 rounded flex items-center gap-1 transition-colors">
            <Plus className="w-4 h-4" /> Add Asset
          </button>
        </div>
      </section>

      {/* Main Ledger */}
      <section className="flex-1 mb-12">
        <div className="w-full bg-[#1C1C1C] rounded-[24px] shadow-2xl border-none overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-6 border-b border-[#2A2A2A] bg-[#111111] px-6 py-4 text-[10px] font-heading font-extrabold text-[#8A8F98] uppercase tracking-widest">
            <div className="col-span-2">Asset / Scheme</div>
            <div className="text-right">Platform</div>
            <div className="text-right">Avg Cost</div>
            <div className="text-right">LTP</div>
            <div className="text-right">P&L</div>
          </div>
          
          {/* Table Rows */}
          <div className="space-y-0 divide-y divide-[#2A2A2A]">
            {filteredHoldings.map((item) => {
              const h = item.holding;
              const gain = item.unrealizedGain;
              const isPositive = gain >= 0;
              return (
                <div key={h.id} className="grid grid-cols-6 px-6 py-4 hover:bg-[#252525] transition-colors group relative cursor-default">
                  <div className="col-span-2 flex flex-col justify-center">
                    <span className="text-[14px] font-heading font-bold text-white mb-1">
                      {h.ticker || h.name.split(' ')[0]}
                    </span>
                    <div className="flex gap-2 items-center">
                       <span className="text-[12px] text-[#8A8F98]">{h.name}</span>
                       <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-[#1A3329] text-[#00D09C]">{h.category}</span>
                    </div>
                  </div>
                  <div className="text-right text-[13px] font-body flex items-center justify-end text-[#A7B5AE] font-medium">
                    {h.platform}
                  </div>
                  <div className="text-right text-[13px] font-body flex items-center justify-end text-[#A7B5AE] font-medium">
                    ₹{h.investedValue.toLocaleString('en-IN')}
                  </div>
                  <div className="text-right text-[13px] font-body flex items-center justify-end font-bold text-white">
                    ₹{item.currentValue.toLocaleString('en-IN')}
                  </div>
                  <div className={`text-right text-[13px] flex flex-col items-end justify-center font-bold ${isPositive ? "text-[#00D09C]" : "text-[#D64545]"}`}>
                    <span>{isPositive ? '+' : '-'}₹{Math.abs(gain).toLocaleString('en-IN')}</span>
                    <span className="text-[11px] opacity-80 mt-0.5">({isPositive ? '+' : ''}{item.unrealizedReturnPct.toFixed(1)}%)</span>
                  </div>
                  
                  {!isPositive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-10 bg-[#D64545] rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" title="Loss Making Asset"></div>
                  )}
                  <button 
                    onClick={async () => { if (user) { await supabase.from('portfolios').delete().eq('id', h.id); setHoldings(prev => prev.filter(x => x.id !== h.id)); } }}
                    className="absolute right-6 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity text-[#D64545] hover:bg-[#D64545]/10 rounded-full"
                    title="Remove Asset"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
            
            {filteredHoldings.length === 0 && (
              <div className="px-6 py-16 text-center font-body-md text-[#8A8F98]">
                No holdings match the selected filter.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Analysis Grid */}
      <section className="mb-12 bg-[#1C1C1C] rounded-[24px] shadow-2xl border-none p-8">
        <div className="mb-6">
          <h3 className="text-[11px] font-bold text-[#8A8F98] uppercase tracking-widest mb-2">AI Insights</h3>
          <p className="text-[14px] text-[#A7B5AE]">Generate automated insights based on your portfolio constraints and market reality.</p>
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
      
      <AddModal />
    </div>
  );
};
