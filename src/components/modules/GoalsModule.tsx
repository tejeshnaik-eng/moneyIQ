import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  Home, 
  Plane, 
  X,
  Sparkles,
  Link2,
  RefreshCw,
  Loader2
} from 'lucide-react';
import { FinancialGoal } from '../../types';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

export const GoalsModule: React.FC = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(true);
  
  // We keep holdings as empty array since localStorage is removed and no new DB table was specified.
  const [holdings, setHoldings] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(1000000);
  const [newCategory, setNewCategory] = useState<'Security' | 'Milestone' | 'Retirement' | 'Discretionary'>('Milestone');
  const [newTargetYear, setNewTargetYear] = useState(new Date().getFullYear() + 5);
  const [selectedHoldings, setSelectedHoldings] = useState<string[]>([]);
  
  // AI State
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) {
        setIsLoadingGoals(false);
        return;
      }
      setIsLoadingGoals(true);
      try {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id);
          
        if (data && !error) {
          const mapped: FinancialGoal[] = data.map(dbGoal => {
            const targetYear = new Date().getFullYear() + dbGoal.timeline_years;
            return {
              id: dbGoal.id,
              title: dbGoal.title,
              category: dbGoal.risk_profile,
              targetAmount: dbGoal.target,
              currentSaved: dbGoal.current,
              targetYear: targetYear,
              expectedInflation: 6.5,
              expectedCagr: 10,
              requiredMonthlySip: 0,
              currentMonthlySip: 0,
              status: 'On Track',
              linkedAssets: []
            };
          });
          setGoals(mapped);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
      } finally {
        setIsLoadingGoals(false);
      }
    };
    
    fetchGoals();
  }, [user]);

  const calculateCurrentSaved = (goal: FinancialGoal) => {
    return goal.currentSaved;
  };

  // Smart required SIP calculation based on time horizon
  const calculateRequiredSip = (target: number, current: number, targetYear: number) => {
    const years = Math.max(0.5, targetYear - new Date().getFullYear());
    
    // Smart Expected CAGR based on horizon
    let annualRate = 7; // < 3 years (Debt)
    if (years >= 3 && years <= 7) annualRate = 10; // Hybrid
    if (years > 7) annualRate = 12; // Equity

    const months = years * 12;
    const monthlyRate = (annualRate / 100) / 12;
    
    // Future value of current savings
    const fvCurrent = current * Math.pow(1 + (annualRate / 100), years);
    const shortfall = target - fvCurrent;

    if (shortfall <= 0) return { sip: 0, cagr: annualRate };

    const sip = (shortfall * monthlyRate) / ((Math.pow(1 + monthlyRate, months) - 1) * (1 + monthlyRate));
    return { sip: Math.round(sip), cagr: annualRate };
  };

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !user) return;

    setIsAdding(true);
    
    const timelineYears = Math.max(1, newTargetYear - new Date().getFullYear());
    const currentSaved = 0;

    const newGoalRow = {
      user_id: user.id,
      title: newTitle,
      target: newTarget,
      current: currentSaved,
      timeline_years: timelineYears,
      risk_profile: newCategory
    };

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert(newGoalRow)
        .select()
        .single();

      if (data && !error) {
        const addedGoal: FinancialGoal = {
          id: data.id,
          title: data.title,
          category: data.risk_profile,
          targetAmount: data.target,
          currentSaved: data.current,
          targetYear: new Date().getFullYear() + data.timeline_years,
          expectedInflation: 6.5,
          expectedCagr: 10,
          requiredMonthlySip: 0,
          currentMonthlySip: 0,
          status: 'On Track',
          linkedAssets: []
        };
        
        setGoals([...goals, addedGoal]);
        setShowAddModal(false);
        
        // Reset
        setNewTitle('');
        setSelectedHoldings([]);
        setNewTarget(1000000);
        setNewTargetYear(new Date().getFullYear() + 5);
        setNewCategory('Milestone');
      }
    } catch (err) {
      console.error('Error creating goal:', err);
    } finally {
      setIsAdding(false);
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);
        
      if (!error) {
        setGoals(goals.filter(g => g.id !== id));
      }
    } catch (err) {
      console.error('Error deleting goal:', err);
    }
  };

  const handleAiAnalysis = async (goal: FinancialGoal) => {
    setAiLoading(goal.id);
    const currentSaved = calculateCurrentSaved(goal);
    const linkedHoldingsData = holdings.filter(h => goal.linkedAssets?.includes(h.id));
    
    const promptData = {
      goal_name: goal.title,
      target_amount: goal.targetAmount,
      current_saved: currentSaved,
      years_remaining: Math.max(0.5, goal.targetYear - new Date().getFullYear()),
      linked_assets: linkedHoldingsData.map(h => ({ name: h.name, type: h.category, value: h.currentValue }))
    };

    const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setAiInsights(prev => ({ ...prev, [goal.id]: "Gemini API key missing. Cannot generate strategy." }));
      setAiLoading(null);
      return;
    }

    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `You are a strict SEBI-registered financial planner. Analyze this specific goal data: ${JSON.stringify(promptData)}. In exactly 2-3 short sentences, tell the user if their asset allocation matches their time horizon (e.g. equity is bad for <3 years), and give a specific recommendation on where to allocate their required monthly SIP.` }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 250 }
        })
      });
      
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) {
        setAiInsights(prev => ({ ...prev, [goal.id]: text }));
      }
    } catch (e) {
      setAiInsights(prev => ({ ...prev, [goal.id]: "Failed to generate AI strategy. Please try again." }));
    }
    setAiLoading(null);
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Security': return <ShieldCheck className="w-6 h-6" />;
      case 'Retirement': return <Home className="w-6 h-6" />;
      case 'Discretionary': return <Plane className="w-6 h-6" />;
      default: return <Home className="w-6 h-6" />;
    }
  };

  const activeGoalsCount = goals.length;
  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalFunded = goals.reduce((sum, g) => sum + calculateCurrentSaved(g), 0);
  const totalRequiredSip = goals.reduce((sum, g) => sum + calculateRequiredSip(g.targetAmount, calculateCurrentSaved(g), g.targetYear).sip, 0);

  if (isLoadingGoals) {
    return (
      <div className="w-full h-full bg-[#1E1E1E] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#20EFA0] animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-[#1E1E1E] text-[#F2F7F4] p-8 lg:p-12 pb-20 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1200px] mx-auto space-y-12">
        
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-[32px] sm:text-[40px] font-bold text-white font-heading tracking-tight">Goal Planning</h1>
            <p className="text-[#A7B5AE] text-[14px] mt-2 font-body">Turn your financial goals into measurable investment plans.</p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-[#20EFA0] text-[#04100B] text-[13px] font-bold py-3 px-6 rounded-full hover:bg-[#1bd18a] transition-colors flex items-center gap-2 shrink-0 border-none"
          >
            <Plus className="w-4 h-4" /> Create Goal
          </button>
        </div>

        {/* 2. Goal Overview Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Active Goals', value: activeGoalsCount.toString() },
            { label: 'Total Target', value: `₹${(totalTarget/100000).toFixed(2)}L` },
            { label: 'Total Funded', value: `₹${totalFunded > 10000 ? (totalFunded/100000).toFixed(2) + 'L' : totalFunded.toLocaleString('en-IN')}` },
            { label: 'Required Monthly SIP', value: `₹${totalRequiredSip.toLocaleString('en-IN')}` }
          ].map((metric, i) => (
            <div key={i} className="bg-[#111916] rounded-2xl p-5 flex flex-col justify-center border-none">
              <span className="text-[11px] text-[#A7B5AE] uppercase tracking-wider font-bold mb-1.5">{metric.label}</span>
              <span className="text-[22px] font-bold text-white font-mono">{metric.value}</span>
            </div>
          ))}
        </div>

        {/* 3. Goal Cards */}
        {goals.length === 0 ? (
          <div className="bg-[#0D1311] rounded-[22px] p-12 flex flex-col items-center justify-center text-center shadow-[0_10px_35px_rgba(0,0,0,0.20)]">
            <div className="p-4 bg-[#111916] rounded-full mb-4">
              <Home className="w-8 h-8 text-[#6E7C75]" />
            </div>
            <h4 className="font-heading font-bold text-lg text-white mb-2">
              No goals yet. Set your first financial milestone.
            </h4>
            <p className="text-sm text-[#A7B5AE] max-w-md mb-6">
              Link your live portfolio assets to specific goals and let the engine calculate exactly how much you need to invest monthly to succeed.
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-[#20EFA0] text-[#04100B] text-[13px] font-bold py-3 px-6 rounded-full hover:bg-[#1bd18a] transition-colors flex items-center gap-2 border-none"
            >
              <Plus className="w-4 h-4" /> Create Goal
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {goals.map(goal => {
              const currentSaved = calculateCurrentSaved(goal);
              const { sip, cagr } = calculateRequiredSip(goal.targetAmount, currentSaved, goal.targetYear);
              const pct = Math.min(100, Math.max(0, Math.round((currentSaved / goal.targetAmount) * 100)));
              const isHealthy = pct >= 100 || (goal.currentMonthlySip >= sip && sip > 0);
              const isBehind = !isHealthy && currentSaved === 0 && sip > 0;
              
              let statusBadge = null;
              if (isHealthy) {
                statusBadge = <div className="bg-[#0D2B21] text-[#20EFA0] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">On Track</div>;
              } else if (isBehind) {
                statusBadge = <div className="bg-[#2B1313] text-[#FF5B5B] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">Behind Target</div>;
              } else {
                statusBadge = <div className="bg-[#2B2113] text-[#FFB454] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block">Attention Needed</div>;
              }
              
              return (
                <div key={goal.id} className="bg-[#0D1311] rounded-[22px] p-7 shadow-[0_10px_35px_rgba(0,0,0,0.20)] flex flex-col relative border-none">
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-4 items-center">
                      <div className="text-[#20EFA0]">
                        {getCategoryIcon(goal.category)}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-white leading-tight">{goal.title}</h3>
                        <p className="text-[13px] text-[#A7B5AE] mt-1 font-mono">Target Year {goal.targetYear} · Assumed CAGR {cagr}%</p>
                      </div>
                    </div>
                    <button onClick={() => deleteGoal(goal.id)} className="text-[#6E7C75] hover:text-[#FF5B5B] transition-colors p-1">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Progress & Target */}
                  <div className="flex flex-col mb-4">
                    <div className="flex justify-between items-end mb-3">
                      <div className="text-[36px] font-mono font-bold text-white leading-none">₹{currentSaved.toLocaleString('en-IN')}</div>
                      <div className="text-[15px] text-[#A7B5AE] font-mono">₹{(goal.targetAmount/100000).toFixed(2)}L target</div>
                    </div>
                    <div className="h-[8px] bg-[#1B2621] rounded-full overflow-hidden mb-2">
                      <div className="h-full bg-[#20EFA0]" style={{ width: `${pct}%` }}></div>
                    </div>
                    <div className="flex justify-between text-[12px] text-[#6E7C75]">
                      <span>{pct}% Funded</span>
                      {goal.linkedAssets?.length ? (
                        <span>{goal.linkedAssets.length} Assets Linked</span>
                      ) : (
                        <span>No assets linked</span>
                      )}
                    </div>
                  </div>

                  {/* Projection Chart */}
                  <div className="h-16 w-full mb-6">
                    <svg width="100%" height="100%" viewBox="0 0 100 40" preserveAspectRatio="none">
                      <path d={`M0,40 C30,35 60,${40 - (pct/100)*35} 100,5`} fill="none" stroke="#20EFA0" strokeWidth="2" strokeDasharray="4 2" />
                      <circle cx="100" cy="5" r="3" fill="#20EFA0" />
                      <circle cx="0" cy="40" r="3" fill="#0D2B21" stroke="#20EFA0" strokeWidth="1" />
                    </svg>
                  </div>

                  {/* Monthly Action Required */}
                  <div className="bg-[#111916] rounded-[14px] p-4 mb-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <span className="text-[11px] text-[#A7B5AE] uppercase tracking-wider font-bold block mb-1.5">Active SIP</span>
                      <span className="text-[16px] text-white font-mono font-bold">₹{goal.currentMonthlySip.toLocaleString('en-IN')} <span className="text-[#6E7C75] text-[12px]">/ mo</span></span>
                    </div>
                    <div className="text-right space-y-1">
                      <div className="mb-1.5">{statusBadge}</div>
                      <div className="text-[16px] text-white font-mono font-bold">₹{sip.toLocaleString('en-IN')} <span className="text-[#6E7C75] text-[12px]">/ mo</span></div>
                    </div>
                  </div>

                  {/* Linked Assets */}
                  {goal.linkedAssets && goal.linkedAssets.length > 0 ? (
                    <div className="bg-[#111916] rounded-[14px] p-4 mb-4">
                      <div className="flex items-center gap-2 mb-2 text-[#20EFA0]">
                        <Link2 className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-bold uppercase tracking-wider">{goal.linkedAssets.length} Asset Linked</span>
                      </div>
                      <div className="space-y-2">
                        {goal.linkedAssets.map(assetId => {
                          const asset = holdings.find(h => h.id === assetId);
                          if (!asset) return null;
                          return (
                            <div key={assetId} className="flex justify-between items-center border-t border-[#16201C] pt-2 mt-2 first:border-0 first:pt-0 first:mt-0">
                              <span className="text-[12px] text-[#A7B5AE] font-mono">{asset.ticker || asset.name}</span>
                              <span className="text-[12px] text-white font-mono">₹{Number(asset.currentValue).toLocaleString('en-IN')}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[#111916] rounded-[14px] p-4 mb-4 flex justify-between items-center">
                      <div>
                        <div className="text-[13px] font-bold text-white mb-0.5">No assets linked</div>
                        <div className="text-[11px] text-[#6E7C75]">Connect investments contributing toward this goal.</div>
                      </div>
                      <button 
                        onClick={() => setShowAddModal(true)}
                        className="text-[11px] font-bold text-[#20EFA0] hover:text-white transition-colors flex items-center gap-1 bg-[#0D2B21] px-3 py-2 rounded-full border-none"
                      >
                        Link assets <Sparkles className="w-3 h-3" />
                      </button>
                    </div>
                  )}

                  {/* AI Strategy Button */}
                  <div className="mt-auto">
                    <button 
                      onClick={() => handleAiAnalysis(goal)}
                      disabled={aiLoading === goal.id}
                      className="w-full bg-[#0D2B21] hover:bg-[#15392D] text-[#20EFA0] rounded-full py-3.5 text-[13px] font-bold transition-colors flex items-center justify-center gap-2 border-none mt-2"
                    >
                      {aiLoading === goal.id ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      ✦ Generate AI Goal Strategy
                    </button>
                    {aiInsights[goal.id] && (
                      <div className="mt-4 p-4 bg-[#111916] rounded-[14px] text-[13px] text-[#A7B5AE] border border-[#20EFA0]/20 leading-relaxed">
                        {aiInsights[goal.id]}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom Dashboard Sections (Only show if there are goals) */}
        {goals.length > 0 && (
          <>
            {/* Goal Insights Panel */}
            <div className="bg-[#111916] rounded-[22px] p-6 lg:p-8 flex flex-col md:flex-row justify-between items-center gap-6 mt-12 border border-[#16201C] shadow-[0_10px_35px_rgba(0,0,0,0.20)]">
              <div>
                <h4 className="text-[#20EFA0] text-[11px] font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" /> Goal Insights
                </h4>
                <p className="text-[16px] text-white font-medium">Your current SIP contribution is below the amount required for your targets.</p>
                <p className="text-[14px] text-[#A7B5AE] mt-1">Increase monthly SIP by ₹{totalRequiredSip.toLocaleString('en-IN')} across all goals to stay on track.</p>
              </div>
              <button className="bg-[#20EFA0] text-[#04100B] px-6 py-3 rounded-full text-[13px] font-bold whitespace-nowrap hover:bg-[#1bd18a] transition-colors border-none">
                Adjust SIP →
              </button>
            </div>

            {/* Goal Comparison & Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
              {/* Goal Progress Bars */}
              <div className="bg-[#0D1311] rounded-[22px] p-8 shadow-[0_10px_35px_rgba(0,0,0,0.20)] border-none">
                <h3 className="text-[18px] font-bold text-white mb-8">Goal Progress</h3>
                <div className="space-y-6">
                  {goals.map(g => {
                    const pct = Math.min(100, Math.round((calculateCurrentSaved(g) / g.targetAmount) * 100));
                    return (
                      <div key={g.id}>
                        <div className="flex justify-between text-[13px] mb-2 font-medium">
                          <span className="text-white">{g.title}</span>
                          <span className="text-[#A7B5AE] font-mono">{pct}%</span>
                        </div>
                        <div className="h-[8px] bg-[#16201C] rounded-full overflow-hidden">
                          <div className="h-full bg-[#20EFA0]" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-[#0D1311] rounded-[22px] p-8 shadow-[0_10px_35px_rgba(0,0,0,0.20)] border-none">
                <h3 className="text-[18px] font-bold text-white mb-8">Goal Timeline</h3>
                <div className="relative pt-6 pb-2 min-h-[160px]">
                  {/* Horizontal line */}
                  <div className="absolute top-[35px] left-0 w-full h-[2px] bg-[#16201C]"></div>
                  
                  <div className="flex justify-between relative z-10 w-full">
                    {[2026, 2027, 2028, 2029, 2030].map((year) => (
                      <div key={year} className="flex flex-col items-center flex-1">
                        <span className="text-[11px] text-[#6E7C75] font-mono mb-3">{year}</span>
                        <div className="w-2.5 h-2.5 rounded-full bg-[#20EFA0] border-2 border-[#0D1311] shadow-[0_0_10px_rgba(32,239,160,0.4)]"></div>
                        
                        {/* Draw goals for this year */}
                        <div className="mt-4 flex flex-col items-center space-y-2 relative -left-4">
                          {goals.filter(g => g.targetYear === year).map(g => (
                            <div key={g.id} className="flex items-center gap-2 whitespace-nowrap bg-[#111916] px-2 py-1 rounded-md border border-[#16201C]">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#20EFA0]"></div>
                              <span className="text-[11px] text-[#A7B5AE] font-medium">{g.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Add Goal Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#080B0A]/80 backdrop-blur-sm">
            <div className="bg-[#0D1311] rounded-[22px] max-w-md w-full p-8 shadow-[0_20px_60px_rgba(0,0,0,0.40)] max-h-[90vh] overflow-y-auto custom-scrollbar border-none">
              <div className="flex items-center justify-between mb-8">
                <h4 className="text-[22px] font-heading font-bold text-white">Create Goal</h4>
                <button onClick={() => setShowAddModal(false)} className="text-[#6E7C75] hover:text-white transition-colors p-2 bg-[#111916] rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateGoal} className="space-y-6 text-sm">
                <div>
                  <label className="block text-[11px] font-bold text-[#A7B5AE] uppercase tracking-wider mb-2">Goal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Downpayment 2028"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    className="w-full px-4 py-3 bg-[#111916] border border-[#16201C] rounded-[14px] text-white outline-none focus:border-[#20EFA0] transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-[#A7B5AE] uppercase tracking-wider mb-2">Category / Risk Profile</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className="w-full px-4 py-3 bg-[#111916] border border-[#16201C] rounded-[14px] text-white outline-none focus:border-[#20EFA0] transition-colors"
                  >
                    <option value="Milestone">Milestone (Medium Term)</option>
                    <option value="Security">Security (Short Term)</option>
                    <option value="Retirement">Retirement (Long Term)</option>
                    <option value="Discretionary">Discretionary (Flexible)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-[#A7B5AE] uppercase tracking-wider mb-2">Target Corpus (₹)</label>
                    <input
                      type="number"
                      min="50000"
                      step="50000"
                      value={newTarget}
                      onChange={(e) => setNewTarget(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#111916] border border-[#16201C] rounded-[14px] text-white outline-none focus:border-[#20EFA0] transition-colors font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#A7B5AE] uppercase tracking-wider mb-2">Target Year</label>
                    <input
                      type="number"
                      min={new Date().getFullYear()}
                      max={2060}
                      value={newTargetYear}
                      onChange={(e) => setNewTargetYear(Number(e.target.value))}
                      className="w-full px-4 py-3 bg-[#111916] border border-[#16201C] rounded-[14px] text-white outline-none focus:border-[#20EFA0] transition-colors font-mono"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[11px] font-bold text-[#A7B5AE] uppercase tracking-wider mb-3 flex items-center justify-between">
                    <span>Link Existing Portfolio Assets</span>
                    <span className="font-normal text-[9px] text-[#20EFA0] bg-[#0D2B21] px-2 py-0.5 rounded-full">Optional</span>
                  </label>
                  {holdings.length === 0 ? (
                    <div className="text-[12px] text-[#6E7C75] bg-[#111916] p-4 rounded-[14px] border border-[#16201C]">
                      You have no assets in your portfolio to link.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                      {holdings.map(h => (
                        <label key={h.id} className="flex items-center gap-3 p-3 rounded-[14px] border border-[#16201C] hover:bg-[#111916] cursor-pointer transition-colors bg-[#0D1311]">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-[#20EFA0] border-[#6E7C75] focus:ring-0 focus:ring-offset-0 bg-[#16201C] accent-[#20EFA0]"
                            checked={selectedHoldings.includes(h.id)}
                            onChange={(e) => {
                              if (e.target.checked) setSelectedHoldings([...selectedHoldings, h.id]);
                              else setSelectedHoldings(selectedHoldings.filter(id => id !== h.id));
                            }}
                          />
                          <div className="flex-1 flex justify-between items-center">
                            <div className="font-medium text-white text-[13px]">{h.ticker || h.name}</div>
                            <div className="text-[12px] text-[#A7B5AE] font-mono">₹{(Number(h.currentValue)||0).toLocaleString('en-IN')}</div>
                          </div>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-6 flex justify-end gap-3 mt-8">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    disabled={isAdding}
                    className="bg-[#111916] text-[#A7B5AE] text-[13px] font-bold py-3 px-6 rounded-full hover:bg-[#16201C] hover:text-white transition-colors border-none disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isAdding}
                    className="bg-[#20EFA0] text-[#04100B] text-[13px] font-bold py-3 px-6 rounded-full hover:bg-[#1bd18a] transition-colors border-none disabled:opacity-50 flex items-center gap-2"
                  >
                    {isAdding && <RefreshCw className="w-4 h-4 animate-spin" />}
                    Create Goal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
