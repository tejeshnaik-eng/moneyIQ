import { getStorageKey } from '../../utils';
import React, { useEffect, useState } from 'react';
import { 
  ChevronRight, 
  Sparkles, 
  Wallet, 
  PieChart, 
  Flag, 
  Receipt, 
  Shield, 
  Scale, 
  Lightbulb, 
  Target, 
  Settings2,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { ModuleId } from '../../types';
import {
  FinancialAnalysisResult,
  analyzeWithGemini,
} from '../../services/financialAnalysisService';

interface OverviewModuleProps {
  onNavigateModule: (module: ModuleId) => void;
}

const ToggleSwitch = ({ active }: { active: boolean }) => (
  <div className={`w-8 h-[18px] rounded-full flex items-center px-0.5 transition-colors ${active ? 'bg-[#0F9D65]' : 'bg-gray-300'}`}>
    <div className={`w-3.5 h-3.5 rounded-full bg-white transition-transform ${active ? 'translate-x-[14px]' : 'translate-x-0'} shadow-sm`} />
  </div>
);

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
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSource, setAiSource]   = useState<'ai' | 'failed' | null>(null);
  const [mounted, setMounted]     = useState(false);

  useEffect(() => {
    setMounted(true);
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

  return (
    <div className="flex h-[calc(100vh-130px)] w-full gap-8 text-[#191c1e]">
      
      {/* Left/Main Column */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto custom-scrollbar pr-2 pb-4">
        
        {/* Header */}
        <div className="flex items-end justify-between mb-8 mt-2">
          <h1 className="text-4xl font-heading font-semibold text-gray-900 tracking-tight">Financial Overview</h1>
          <div className="flex bg-gray-100/80 p-1 rounded-full text-sm font-medium border border-gray-200/50">
            <button className="px-5 py-1.5 bg-white rounded-full shadow-sm text-gray-900 border border-gray-200/50">Metrics</button>
            <button className="px-5 py-1.5 text-gray-500 hover:text-gray-900 transition-colors">Insights</button>
          </div>
        </div>

        {/* Metric Grid (Cards) - Modeled after AI Studio */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
          
          <div 
            onClick={() => onNavigateModule('portfolio')}
            className="bg-[#f7f9fb] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all rounded-[20px] p-5 cursor-pointer group flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0">
              <Wallet className="text-blue-600 w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-gray-900 mb-1.5">Net Worth</h3>
            <p className="text-[13px] text-gray-500 font-body leading-relaxed line-clamp-3">
              {assets > 0 
                ? `Total estimated net worth of ₹${netWorth.toLocaleString('en-IN')}, aggregated across your live portfolio holdings.` 
                : 'Add holdings in the Portfolio module to calculate your live net worth.'}
            </p>
          </div>

          <div 
            onClick={() => onNavigateModule('portfolio')}
            className="bg-[#f7f9fb] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all rounded-[20px] p-5 cursor-pointer group flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0">
              <PieChart className="text-green-600 w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-gray-900 mb-1.5">Total Assets</h3>
            <p className="text-[13px] text-gray-500 font-body leading-relaxed line-clamp-3">
              {holdings.length > 0 
                ? `You have ₹${assets.toLocaleString('en-IN')} distributed across ${holdings.length} distinct financial instruments.`
                : 'No active assets tracked. Begin tracking to measure your wealth.'}
            </p>
          </div>

          <div 
            onClick={() => onNavigateModule('goals')}
            className="bg-[#f7f9fb] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all rounded-[20px] p-5 cursor-pointer group flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0">
              <Flag className="text-amber-600 w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-gray-900 mb-1.5">Goal Targets</h3>
            <p className="text-[13px] text-gray-500 font-body leading-relaxed line-clamp-3">
              {goals.length > 0
                ? `Tracking ${goals.length} active financial goals. Open the planner to review SIP progress and timelines.`
                : 'No financial goals defined. Create timelines for retirement or major purchases.'}
            </p>
          </div>

          <div 
            onClick={() => onNavigateModule('spend')}
            className="bg-[#f7f9fb] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all rounded-[20px] p-5 cursor-pointer group flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0">
              <Receipt className="text-red-600 w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-gray-900 mb-1.5">Capital Leakage</h3>
            <p className="text-[13px] text-gray-500 font-body leading-relaxed line-clamp-3">
              {leakage > 0
                ? `Detected ₹${leakage.toLocaleString('en-IN')} in monthly discretionary spending that could be redirected to SIPs.`
                : 'No significant capital leakage detected in your recent transaction history.'}
            </p>
          </div>

          <div 
            onClick={() => onNavigateModule('risk')}
            className="bg-[#f7f9fb] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all rounded-[20px] p-5 cursor-pointer group flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0">
              <Shield className="text-purple-600 w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-gray-900 mb-1.5">Risk Profile</h3>
            <p className="text-[13px] text-gray-500 font-body leading-relaxed line-clamp-3">
              {hasProfile
                ? `Profile registered. Your investment strategy should align with your identified risk tolerance.`
                : 'Pending risk assessment. Complete the diagnostic to calibrate your portfolio.'}
            </p>
          </div>

          <div 
            className="bg-[#f7f9fb] border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all rounded-[20px] p-5 cursor-default group flex flex-col"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform shrink-0">
              <Scale className="text-cyan-600 w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-gray-900 mb-1.5">Liability Burden</h3>
            <p className="text-[13px] text-gray-500 font-body leading-relaxed line-clamp-3">
              {liabilities > 0
                ? `Carrying ₹${liabilities.toLocaleString('en-IN')} in outstanding debt. Prioritize high-interest reduction.`
                : 'No outstanding liabilities registered in your financial profile.'}
            </p>
          </div>

        </div>

        {/* Bottom Prompt / Insight Banner */}
        <div className="mt-auto pt-2">
          {/* Warning/Info Strip */}
          <div className="bg-[#FFF8E6] border border-[#FDE68A] rounded-t-[20px] p-4 flex items-start gap-3 text-sm">
            <Lightbulb className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-medium text-amber-900">This agent generates institutional-grade insights based on your active configuration.</p>
              <div className="flex items-center gap-4 mt-1 text-[13px]">
                <button className="text-blue-600 hover:underline font-medium">Learn more</button>
                <button className="text-gray-500 hover:text-gray-700 font-medium bg-white/50 px-2 py-0.5 rounded border border-amber-200/50 transition-colors">Calibrate profile</button>
              </div>
            </div>
          </div>
          
          {/* Action / "Prompt" Area */}
          <div className="bg-white border border-gray-200 border-t-0 rounded-b-[20px] p-4 shadow-sm">
             <div className="flex items-center gap-2 mb-3">
               <span className={`w-2 h-2 rounded-full ${aiSource === 'ai' ? 'bg-green-500' : aiSource === 'failed' ? 'bg-red-500' : 'bg-gray-300 animate-pulse'}`} />
               <p className="text-sm font-medium text-gray-500">
                 {aiLoading ? 'Agent is analyzing your data...' : aiSource === 'ai' ? 'Actionable Intelligence' : aiSource === 'failed' ? 'Agent unavailable' : 'Awaiting initialization'}
               </p>
             </div>
             
             <div className="flex flex-wrap items-center gap-2">
                <button className="flex items-center gap-2 px-3 py-2 bg-[#f7f9fb] hover:bg-gray-100 border border-gray-200 transition-colors rounded-xl text-sm text-gray-700 font-medium">
                  <Settings2 className="w-4 h-4 text-gray-500" /> Grounding Tools
                </button>
                
                <div className={`flex-1 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border ${aiSource === 'ai' ? 'bg-blue-50 border-blue-100 text-blue-800' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                   {aiSource === 'ai' ? <Target className="w-4 h-4 shrink-0" /> : <Shield className="w-4 h-4 shrink-0 text-gray-400" />}
                   <span className="truncate">
                     {aiSource === 'ai' 
                       ? analysis?.suggestedAction 
                       : 'Run the analysis engine to generate a personalized action plan.'}
                   </span>
                </div>

                <button 
                  onClick={runAnalysis} 
                  disabled={aiLoading}
                  className="shrink-0 bg-gray-900 hover:bg-black text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4" /> Execute
                </button>
             </div>
          </div>
        </div>
      </div>

      {/* Right Column (Run Settings) */}
      <div className="w-80 shrink-0 border-l border-gray-200 pl-8 py-2 flex flex-col overflow-y-auto custom-scrollbar">
        
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-[13px] font-heading font-semibold text-gray-900">Analysis Settings</h2>
          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <ExternalLink className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Model */}
        <div className="mb-8">
          <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Target Model</p>
          <div className="flex items-center justify-between bg-white border border-gray-200 hover:border-gray-300 cursor-pointer transition-colors rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className={`w-[6px] h-[6px] rounded-full ${aiSource === 'ai' ? 'bg-green-500' : aiSource === 'failed' ? 'bg-red-500' : 'bg-[#0F9D65]'}`} />
              <span className="text-sm font-medium text-gray-900">Gemini 3.6 Flash</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* Health Score / System Instructions */}
        <div className="mb-8">
           <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Diagnostic Score</p>
           <div className="bg-[#f7f9fb] border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
             {analysis ? (
               <>
                 <div className="text-5xl font-heading font-bold text-gray-900 mb-2">{analysis.healthScore}</div>
                 <div className="text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-green-100 text-green-800 border border-green-200">
                   {analysis.healthBand}
                 </div>
               </>
             ) : (
               <p className="text-[13px] text-gray-500 font-medium">Pending execution.<br/>Run the agent to score.</p>
             )}
           </div>
        </div>

        {/* Grounding Data / Tools */}
        <div className="mb-8">
           <div className="flex items-center justify-between mb-4">
             <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Data Grounding</p>
             <ChevronRight className="w-3.5 h-3.5 text-gray-400 rotate-90" />
           </div>
           
           <div className="space-y-5">
             <div className="flex items-center justify-between group">
               <div>
                 <p className="text-sm font-medium text-gray-900 mb-0.5 group-hover:text-black transition-colors">Portfolio Context</p>
                 <p className="text-[11px] text-gray-500 font-medium">Source: Local Database</p>
               </div>
               <ToggleSwitch active={holdings.length > 0} />
             </div>
             <div className="flex items-center justify-between group">
               <div>
                 <p className="text-sm font-medium text-gray-900 mb-0.5 group-hover:text-black transition-colors">Spend Analytics</p>
                 <p className="text-[11px] text-gray-500 font-medium">Source: Local Transactions</p>
               </div>
               <ToggleSwitch active={txns.length > 0} />
             </div>
             <div className="flex items-center justify-between group">
               <div>
                 <p className="text-sm font-medium text-gray-900 mb-0.5 group-hover:text-black transition-colors">Risk Profile</p>
                 <p className="text-[11px] text-gray-500 font-medium">Source: Engine Variables</p>
               </div>
               <ToggleSwitch active={hasProfile} />
             </div>
           </div>
        </div>

      </div>
    </div>
  );
};
