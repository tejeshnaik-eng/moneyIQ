import { getStorageKey } from '../../utils';
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  Home, 
  Plane, 
  X,
  Sparkles,
  Link2,
  RefreshCw
} from 'lucide-react';
import { FinancialGoal } from '../../types';
import { analyzeWithGemini } from '../../services/financialAnalysisService';

export const GoalsModule: React.FC = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>([]);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(1000000);
  const [newCategory, setNewCategory] = useState<'Security' | 'Milestone' | 'Retirement' | 'Discretionary'>('Milestone');
  const [newTargetYear, setNewTargetYear] = useState(new Date().getFullYear() + 5);
  const [selectedHoldings, setSelectedHoldings] = useState<string[]>([]);
  
  // AI State
  const [aiLoading, setAiLoading] = useState<string | null>(null);
  const [aiInsights, setAiInsights] = useState<Record<string, string>>({});

  useEffect(() => {
    try {
      const savedGoals = localStorage.getItem(getStorageKey('finsight_goals'));
      if (savedGoals) setGoals(JSON.parse(savedGoals));

      const savedHoldings = localStorage.getItem(getStorageKey('finsight_portfolio_holdings'));
      if (savedHoldings) setHoldings(JSON.parse(savedHoldings));
    } catch {
      //
    }
  }, []);

  useEffect(() => {
    // Whenever goals change, save to localStorage
    if (goals.length > 0) {
      localStorage.setItem(getStorageKey('finsight_goals'), JSON.stringify(goals));
    }
  }, [goals]);

  // Dynamically calculate current saved based on linked assets
  const calculateCurrentSaved = (linkedAssets: string[] = []) => {
    if (!linkedAssets || linkedAssets.length === 0) return 0;
    return holdings
      .filter(h => linkedAssets.includes(h.id))
      .reduce((sum, h) => sum + (Number(h.currentValue) || 0), 0);
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

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const currentSaved = calculateCurrentSaved(selectedHoldings);
    const { sip, cagr } = calculateRequiredSip(newTarget, currentSaved, newTargetYear);

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      targetAmount: newTarget,
      currentSaved: currentSaved,
      targetYear: newTargetYear,
      expectedInflation: 6.5,
      expectedCagr: cagr,
      requiredMonthlySip: sip,
      currentMonthlySip: 0,
      status: sip > 0 ? 'Attention Needed' : 'On Track',
      linkedAssets: selectedHoldings
    };

    setGoals([...goals, newGoal]);
    setShowAddModal(false);
    
    // Reset
    setNewTitle('');
    setSelectedHoldings([]);
    setNewTarget(1000000);
    setNewTargetYear(new Date().getFullYear() + 5);
  };

  const deleteGoal = (id: string) => {
    const updated = goals.filter(g => g.id !== id);
    setGoals(updated);
    if (updated.length === 0) localStorage.removeItem(getStorageKey('finsight_goals'));
  };

  const handleAiAnalysis = async (goal: FinancialGoal) => {
    setAiLoading(goal.id);
    const currentSaved = calculateCurrentSaved(goal.linkedAssets);
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
      case 'Security': return <ShieldCheck className="w-5 h-5 text-[var(--primary)]" />;
      case 'Retirement': return <Home className="w-5 h-5 text-[var(--primary)]" />;
      case 'Discretionary': return <Plane className="w-5 h-5 text-[var(--primary)]" />;
      default: return <Home className="w-5 h-5 text-[var(--primary)]" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-heading font-semibold text-[var(--app-text-muted)] uppercase tracking-widest">
            Capital Allocation Engine
          </span>
          <h3 className="text-xl font-heading font-extrabold text-[var(--app-text)] mt-1">Goal Planning Ledger</h3>
          <p className="text-xs text-[var(--app-text-muted)] mt-1 max-w-xl">
            Link real portfolio assets to life milestones. Smart projections automatically adjust expected CAGR based on your time horizon (Debt for short-term, Equity for long-term).
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs py-2 px-4 shrink-0 flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="bg-[var(--app-surface)] rounded-xl border border-[var(--app-border)] p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-4 bg-[var(--app-surface-alt)] rounded-full mb-4">
            <Home className="w-8 h-8 text-[var(--app-text-muted)]" />
          </div>
          <h4 className="font-heading font-bold text-lg text-[var(--app-text)] mb-2">
            No goals yet. Set your first financial milestone.
          </h4>
          <p className="text-sm text-[var(--app-text-muted)] max-w-md mb-6">
            Link your live portfolio assets to specific goals and let the engine calculate exactly how much you need to invest monthly to succeed.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs py-2 px-6 flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Create Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const currentSaved = calculateCurrentSaved(goal.linkedAssets);
            const { sip, cagr } = calculateRequiredSip(goal.targetAmount, currentSaved, goal.targetYear);
            const progressPercent = Math.min(100, Math.max(0, Math.round((currentSaved / goal.targetAmount) * 100)));
            const isHealthy = progressPercent >= 100 || (goal.currentMonthlySip >= sip && sip > 0);
            
            return (
              <div
                key={goal.id}
                className="bg-[var(--app-surface)] rounded-xl border border-[var(--app-border)] p-6 flex flex-col shadow-sm"
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex gap-3 items-center">
                    <div className="p-2.5 bg-[var(--primary)]/10 rounded-lg shrink-0">
                      {getCategoryIcon(goal.category)}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-lg text-[var(--app-text)] mb-0.5">{goal.title}</h4>
                      <p className="text-[10px] text-[var(--app-text-muted)] font-mono">
                        Target Year: {goal.targetYear} · Assumed CAGR: {cagr}%
                      </p>
                    </div>
                  </div>
                  <button onClick={() => deleteGoal(goal.id)} className="text-[var(--app-text-muted)] hover:text-[#ba1a1a]">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Progress */}
                <div className="space-y-2 mb-4 bg-[var(--app-surface-alt)] p-4 rounded-lg">
                  <div className="flex justify-between items-baseline">
                    <span className="text-2xl font-heading font-extrabold text-[var(--app-text)] font-mono tracking-tight">
                      ₹{currentSaved.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-[var(--app-text-muted)] font-mono">
                      / ₹{goal.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="w-full bg-[#E5E5EA] h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#006D44] h-full rounded-full transition-all duration-1000"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-[var(--app-text-muted)] pt-1">
                    <span>{progressPercent}% Funded</span>
                    {goal.linkedAssets?.length ? (
                      <span className="flex items-center gap-1 text-[#004E9F] font-semibold"><Link2 className="w-3 h-3" /> {goal.linkedAssets.length} Assets Linked</span>
                    ) : (
                      <span>No assets linked</span>
                    )}
                  </div>
                </div>

                {/* SIP Math */}
                <div className="pt-3 border-t border-[var(--app-border)] space-y-2 text-xs mb-4">
                  <div className="flex justify-between items-center text-[var(--app-text-muted)]">
                    <span className="font-heading font-semibold text-[var(--app-text)]">Monthly Action Required</span>
                    <span className={`font-heading font-semibold px-2 py-0.5 rounded-full text-[10px] ${isHealthy ? 'bg-[#006D44]/10 text-[#006D44]' : 'bg-[#883700]/10 text-[#883700]'}`}>
                      {isHealthy ? 'On Track' : 'Attention Needed'}
                    </span>
                  </div>
                  <div className="flex justify-between text-[var(--app-text-muted)] font-mono text-[11px] bg-[#FFFFFF] p-2 rounded border border-[var(--app-border)]">
                    <span>Active SIP: ₹{goal.currentMonthlySip.toLocaleString('en-IN')}/mo</span>
                    <span className="font-bold text-[var(--app-text)]">Target SIP: ₹{sip.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
                
                {/* AI Advice Block */}
                <div className="mt-auto">
                  {aiInsights[goal.id] ? (
                    <div className="p-3 bg-[#F2EEFA] rounded-lg border border-[#7E57C2]/20">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#7E57C2]" />
                        <span className="text-[10px] font-heading font-semibold text-[#7E57C2] uppercase tracking-wider">AI Strategy</span>
                      </div>
                      <p className="text-[11px] text-[var(--app-text)] leading-relaxed">{aiInsights[goal.id]}</p>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleAiAnalysis(goal)}
                      disabled={aiLoading === goal.id}
                      className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-lg border border-[#E5E5EA] text-[11px] font-heading font-semibold hover:bg-[var(--app-surface-alt)] transition-colors text-[#1D1D1F]"
                    >
                      {aiLoading === goal.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#7E57C2]" /> : <Sparkles className="w-3.5 h-3.5 text-[#7E57C2]" />}
                      {aiLoading === goal.id ? 'Analyzing Portfolio Fit...' : 'Generate AI Goal Strategy'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-[var(--app-surface)] rounded-xl border border-[var(--app-border)] max-w-md w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-[var(--app-border)] pb-3">
              <h4 className="text-base font-heading font-bold text-[var(--app-text)]">Create Smart Goal</h4>
              <button onClick={() => setShowAddModal(false)} className="text-[var(--app-text-muted)] hover:text-[var(--app-text)]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading font-bold text-[var(--app-text)] mb-1">Goal Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Downpayment 2028"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded text-[var(--app-text)] outline-none focus:border-[var(--primary)]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold text-[var(--app-text)] mb-1">Target Corpus (₹)</label>
                  <input
                    type="number"
                    min="50000"
                    step="50000"
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded text-[var(--app-text)] outline-none focus:border-[var(--primary)]"
                  />
                </div>
                <div>
                  <label className="block font-heading font-bold text-[var(--app-text)] mb-1">Target Year</label>
                  <input
                    type="number"
                    min={new Date().getFullYear()}
                    max={2060}
                    value={newTargetYear}
                    onChange={(e) => setNewTargetYear(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded text-[var(--app-text)] outline-none focus:border-[var(--primary)]"
                  />
                </div>
              </div>
              
              <div>
                <label className="block font-heading font-bold text-[var(--app-text)] mb-2 flex items-center justify-between">
                  <span>Link Existing Portfolio Assets</span>
                  <span className="font-normal text-[10px] text-[#004E9F] bg-[#004E9F]/10 px-2 py-0.5 rounded">Optional</span>
                </label>
                {holdings.length === 0 ? (
                  <div className="text-[11px] text-[var(--app-text-muted)] bg-[var(--app-surface-alt)] p-3 rounded">
                    You have no assets in your portfolio to link.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[120px] overflow-y-auto pr-2">
                    {holdings.map(h => (
                      <label key={h.id} className="flex items-center gap-2 p-2 rounded border border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-[var(--primary)] focus:ring-0"
                          checked={selectedHoldings.includes(h.id)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedHoldings([...selectedHoldings, h.id]);
                            else setSelectedHoldings(selectedHoldings.filter(id => id !== h.id));
                          }}
                        />
                        <div className="flex-1">
                          <div className="font-heading font-semibold text-[var(--app-text)]">{h.ticker || h.name}</div>
                          <div className="text-[10px] text-[var(--app-text-muted)]">₹{(Number(h.currentValue)||0).toLocaleString('en-IN')}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[var(--app-border)]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Create Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
