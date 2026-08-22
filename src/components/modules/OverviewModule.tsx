import { getStorageKey } from '../../utils';
import React, { useEffect, useState } from 'react';
import { 
  Wallet, 
  PieChart, 
  Flag, 
  Receipt, 
  Shield, 
  Scale
} from 'lucide-react';
import { ModuleId } from '../../types';
import {
  FinancialAnalysisResult,
  analyzeWithGemini,
} from '../../services/financialAnalysisService';

interface OverviewModuleProps {
  onNavigateModule: (module: ModuleId) => void;
}

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
  // Unused state variables kept for logical completeness
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource]   = useState<'ai' | 'failed' | null>(null);

  useEffect(() => {
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

  const runAnalysis = async () => {
    setAiLoading(true);
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

  const netWorth = assets - liabilities;
  
  // Base widget classes: solid background, no border, 24px radius, 24px padding, subtle shadow
  const widgetClass = "border-none rounded-[24px] p-6 shadow-[0_4px_18px_rgba(20,30,25,0.05)] flex flex-col";

  return (
    <div 
      className="w-full h-full bg-[#1E1E1E] text-white font-sans overflow-y-auto custom-scrollbar"
      style={{ fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}
    >
      <div className="max-w-[1400px] mx-auto p-8 lg:p-10 pb-20">
        
        {/* Page Heading */}
        <div className="mb-10">
          <h1 className="text-[34px] sm:text-[38px] font-bold tracking-[-0.035em] text-white mb-1">
            Financial Overview
          </h1>
          <p className="text-base text-[#A1A1AA] font-medium">
            Your financial position, portfolio, goals, and risk at a glance.
          </p>
        </div>

        {/* 3x2 Metric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 cursor-pointer">
          
          {/* Net Worth */}
          <div onClick={() => onNavigateModule('portfolio')} className={`${widgetClass} bg-[#DDF7EF]`}>
            <Wallet className="w-7 h-7 text-[#008F6B] mb-5" />
            <h3 className="text-[15px] font-medium text-[#58645F] mb-1">Net Worth</h3>
            <p className="text-[28px] leading-tight font-bold text-[#101413] mb-2">₹{netWorth.toLocaleString('en-IN')}</p>
            <p className="text-[13px] font-medium text-[#008F6B]">Across your active holdings</p>
          </div>

          {/* Total Assets */}
          <div onClick={() => onNavigateModule('portfolio')} className={`${widgetClass} bg-[#E6F0FF]`}>
            <PieChart className="w-7 h-7 text-[#2775E8] mb-5" />
            <h3 className="text-[15px] font-medium text-[#58645F] mb-1">Total Assets</h3>
            <p className="text-[28px] leading-tight font-bold text-[#101413] mb-2">₹{assets.toLocaleString('en-IN')}</p>
          </div>

          {/* Goal Targets */}
          <div onClick={() => onNavigateModule('goals')} className={`${widgetClass} bg-[#FFF3D6]`}>
            <Flag className="w-7 h-7 text-[#D99A00] mb-5" />
            <h3 className="text-[15px] font-medium text-[#58645F] mb-1">Goal Targets</h3>
            <p className="text-[28px] leading-tight font-bold text-[#101413] mb-2">{goals.length} Active Goals</p>
          </div>

          {/* Capital Leakage */}
          <div onClick={() => onNavigateModule('spend')} className={`${widgetClass} bg-[#FFE5E3]`}>
            <Receipt className="w-7 h-7 text-[#D64545] mb-5" />
            <h3 className="text-[15px] font-medium text-[#58645F] mb-1">Capital Leakage</h3>
            <p className="text-[28px] leading-tight font-bold text-[#101413] mb-2">₹{leakage.toLocaleString('en-IN')} <span className="text-[18px] text-[#58645F] font-semibold">/ mo</span></p>
          </div>

          {/* Risk Profile */}
          <div onClick={() => onNavigateModule('risk')} className={`${widgetClass} bg-[#EEE8FF]`}>
            <Shield className="w-7 h-7 text-[#7757D9] mb-5" />
            <h3 className="text-[15px] font-medium text-[#58645F] mb-1">Risk Profile</h3>
            <p className="text-[28px] leading-tight font-bold text-[#101413] mb-2">{hasProfile ? profile?.riskTolerance || 'Moderate' : 'Pending'}</p>
          </div>

          {/* Liability Burden */}
          <div className={`${widgetClass} bg-[#DDF6F5]`}>
            <Scale className="w-7 h-7 text-[#008F91] mb-5" />
            <h3 className="text-[15px] font-medium text-[#58645F] mb-1">Liability Burden</h3>
            <p className="text-[28px] leading-tight font-bold text-[#101413] mb-2">₹{liabilities.toLocaleString('en-IN')}</p>
          </div>

        </div>

        {/* Lower Dashboard Section (Financial Health, Portfolio, Crash, etc) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Content Column (Spans 2) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Financial Health Widget */}
            <div className={`border-none rounded-[24px] p-8 shadow-[0_4px_18px_rgba(20,30,25,0.05)] bg-[#DDF7EF] flex flex-col`}>
              <h2 className="text-[22px] font-bold text-[#101413] mb-6">Financial Health</h2>
              
              <div className="flex items-end gap-4 mb-10">
                <div className="flex items-baseline">
                  <span className="text-[52px] leading-none font-bold text-[#101413]">{analysis?.healthScore || 80}</span>
                  <span className="text-[28px] font-bold text-[#58645F] ml-2">/ 100</span>
                </div>
                <div className="bg-[#00B386] text-white px-5 py-1.5 rounded-full text-sm font-bold mb-2">
                  {analysis?.healthBand || 'Excellent'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <div className="flex justify-between items-end text-[14px] font-semibold text-[#101413] mb-2.5">
                    <span>Assets</span>
                    <span>100%</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-black/5"><div className="h-full bg-[#00B386] rounded-full w-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between items-end text-[14px] font-semibold text-[#101413] mb-2.5">
                    <span>Debt Control</span>
                    <span>100%</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-black/5"><div className="h-full bg-[#00B386] rounded-full w-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between items-end text-[14px] font-semibold text-[#101413] mb-2.5">
                    <span>Spend Control</span>
                    <span>100%</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-black/5"><div className="h-full bg-[#00B386] rounded-full w-full"></div></div>
                </div>
                <div>
                  <div className="flex justify-between items-end text-[14px] font-semibold text-[#101413] mb-2.5">
                    <span>Risk Profile</span>
                    <span>100%</span>
                  </div>
                  <div className="h-[6px] rounded-full bg-black/5"><div className="h-full bg-[#00B386] rounded-full w-full"></div></div>
                </div>
              </div>
            </div>

            {/* Split Row: Portfolio & Goals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Portfolio Widget */}
              <div onClick={() => onNavigateModule('portfolio')} className={`border-none rounded-[24px] p-6 shadow-[0_4px_18px_rgba(20,30,25,0.05)] bg-[#E6F0FF] flex flex-col justify-between cursor-pointer`}>
                <div>
                  <h2 className="text-[20px] font-bold text-[#101413] mb-5">Portfolio</h2>
                  <p className="text-[32px] leading-tight font-bold text-[#101413] mb-1">₹{assets.toLocaleString('en-IN')}</p>
                  <p className="text-[14px] font-medium text-[#2775E8] mb-8">
                    Top Holding<br/>
                    <span className="font-bold text-[#101413] mt-1 block">{holdings[0]?.ticker || 'INF204KIC1402'}</span>
                  </p>
                </div>
                <div className="w-full pt-4">
                  <svg className="w-full h-14 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                    <path d="M0,30 L15,22 L30,26 L45,15 L60,18 L75,8 L90,12 L100,0" fill="none" stroke="#2775E8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>

              {/* Goals Widget */}
              <div onClick={() => onNavigateModule('goals')} className={`border-none rounded-[24px] p-6 shadow-[0_4px_18px_rgba(20,30,25,0.05)] bg-[#DDF7EF] flex flex-col cursor-pointer`}>
                <h2 className="text-[20px] font-bold text-[#101413] mb-5">Goals</h2>
                <p className="text-[32px] leading-tight font-bold text-[#101413] mb-8">{goals.length} Active</p>
                
                <div className="space-y-5 mt-auto pb-4">
                  <div className="h-[6px] rounded-full bg-black/5"><div className="h-full bg-[#00B386] rounded-full w-[70%]"></div></div>
                  <div className="h-[6px] rounded-full bg-black/5"><div className="h-full bg-[#008F6B] rounded-full w-[45%]"></div></div>
                  <div className="h-[6px] rounded-full bg-black/5"><div className="h-full bg-[#008F91] rounded-full w-[85%]"></div></div>
                </div>
              </div>

            </div>
          </div>

          {/* Right Action Column */}
          <div className="space-y-6">
            
            {/* AI Insights */}
            <div className={`border-none rounded-[24px] p-6 shadow-[0_4px_18px_rgba(20,30,25,0.05)] bg-[#EEE8FF] flex flex-col`}>
              <h2 className="text-[20px] font-bold text-[#101413] mb-4">AI Insights</h2>
              <p className="text-[17px] font-bold text-[#7757D9] leading-snug mb-8">
                Your portfolio is ready for deeper analysis.
              </p>
              
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={() => onNavigateModule('learning')} 
                  className="w-full bg-[#F3F0FC] text-[#7757D9] border-none rounded-full px-5 py-3.5 font-semibold text-[14px] flex justify-between items-center transition-opacity hover:opacity-80"
                >
                  Financial Learning <span>→</span>
                </button>
                <button 
                  onClick={() => onNavigateModule('hypedetector')} 
                  className="w-full bg-[#F3F0FC] text-[#7757D9] border-none rounded-full px-5 py-3.5 font-semibold text-[14px] flex justify-between items-center transition-opacity hover:opacity-80"
                >
                  Hype Detector <span>→</span>
                </button>
              </div>
            </div>

            {/* Crash Simulation */}
            <div onClick={() => onNavigateModule('marketsim')} className={`border-none rounded-[24px] p-6 shadow-[0_4px_18px_rgba(20,30,25,0.05)] bg-[#FFE5E3] flex flex-col cursor-pointer`}>
              <h2 className="text-[20px] font-bold text-[#101413] mb-3">Crash Simulation</h2>
              <p className="text-[14px] font-medium text-[#D64545] mb-8 leading-relaxed">
                Stress-test your portfolio against historical corrections.
              </p>
              
              <div className="w-full mb-8">
                <svg className="w-full h-14 overflow-visible" viewBox="0 0 100 30" preserveAspectRatio="none">
                  <path d="M0,0 L20,10 L40,8 L60,25 L80,20 L100,35" fill="none" stroke="#D64545" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              
              <button className="bg-transparent border-none text-[#D64545] font-bold text-[15px] flex items-center gap-2 p-0">
                Run simulation <span>→</span>
              </button>
            </div>

            {/* Next Steps (Action Rows) */}
            <div className="space-y-3 pt-2">
              <div onClick={() => onNavigateModule('portfolio')} className="border-none rounded-[16px] bg-[#EDF9F5] p-5 flex justify-between items-center cursor-pointer transition-opacity hover:opacity-80">
                <div>
                  <h4 className="font-bold text-[#101413] text-[15px] mb-1">Portfolio setup</h4>
                  <p className="text-[13px] font-semibold text-[#008F6B]">{holdings.length} assets · ₹{assets.toLocaleString('en-IN')}</p>
                </div>
                <span className="text-[#008F6B] font-bold text-lg">→</span>
              </div>

              <div onClick={() => onNavigateModule('risk')} className="border-none rounded-[16px] bg-[#F3F0FC] p-5 flex justify-between items-center cursor-pointer transition-opacity hover:opacity-80">
                <div>
                  <h4 className="font-bold text-[#101413] text-[15px] mb-1">Risk profile</h4>
                  <p className="text-[13px] font-semibold text-[#7757D9]">{hasProfile ? 'Profile assessed' : 'Pending'}</p>
                </div>
                <span className="text-[#7757D9] font-bold text-lg">→</span>
              </div>

              <div onClick={() => onNavigateModule('spend')} className="border-none rounded-[16px] bg-[#FFF8E8] p-5 flex justify-between items-center cursor-pointer transition-opacity hover:opacity-80">
                <div>
                  <h4 className="font-bold text-[#101413] text-[15px] mb-1">Spend clean</h4>
                  <p className="text-[13px] font-semibold text-[#D99A00]">{txns.length > 0 ? `${txns.length} transactions` : 'No transactions yet'}</p>
                </div>
                <span className="text-[#D99A00] font-bold text-lg">→</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
