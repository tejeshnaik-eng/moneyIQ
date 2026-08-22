import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import { Plus, ArrowRight, Settings2, Loader2, ArrowLeft, Check, Edit2, Trash2, Maximize2, Minimize2 } from 'lucide-react';


const PASTEL_THEMES = [
  { bg: 'bg-[#DDF7EF]', text: 'text-[#101413]', sub: 'text-[#008F6B]', border: 'border-[#008F6B]/20', accent: '#008F6B' },
  { bg: 'bg-[#E6F0FF]', text: 'text-[#101413]', sub: 'text-[#2775E8]', border: 'border-[#2775E8]/20', accent: '#2775E8' },
  { bg: 'bg-[#EEE8FF]', text: 'text-[#101413]', sub: 'text-[#7757D9]', border: 'border-[#7757D9]/20', accent: '#7757D9' },
  { bg: 'bg-[#FFE5E3]', text: 'text-[#101413]', sub: 'text-[#D64545]', border: 'border-[#D64545]/20', accent: '#D64545' },
  { bg: 'bg-[#FFF8E8]', text: 'text-[#101413]', sub: 'text-[#D99A00]', border: 'border-[#D99A00]/20', accent: '#D99A00' },
];

const GOAL_OPTIONS = [
  'Buying a house',
  'Buying a vehicle',
  'Education',
  'Marriage',
  'Travel',
  'Retirement',
  'Building wealth',
  'Starting a business',
  'Other'
];

const INVEST_TYPES = [
  'Mutual funds',
  'Stocks',
  'Fixed deposits',
  'Bonds',
  'Gold',
  'Combination',
  'Not decided'
];

const STEP_UPS = [
  { label: 'No increase', value: 0 },
  { label: '5% annually', value: 5 },
  { label: '10% annually', value: 10 },
  { label: '15% annually', value: 15 }
];

export const GoalsModule: React.FC = () => {
  const { user } = useAuth();
  const [viewState, setViewState] = useState<'dashboard' | 'wizard' | 'result'>('dashboard');
  const [goals, setGoals] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Wizard State
  const [step, setStep] = useState(1);
  const [wGoal, setWGoal] = useState('');
  const [wCustomGoal, setWCustomGoal] = useState('');
  const [wCostToday, setWCostToday] = useState(5000000);
  const [wTargetYear, setWTargetYear] = useState(new Date().getFullYear() + 5);
  const [wCurrentSavings, setWCurrentSavings] = useState(0);
  const [wMonthlyInvest, setWMonthlyInvest] = useState(10000);
  const [wInvestType, setWInvestType] = useState('Mutual funds');
  const [wStepUp, setWStepUp] = useState(0);

  // Result State
  const [assumedReturn, setAssumedReturn] = useState(10);
  const [isEditingReturn, setIsEditingReturn] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [resultId, setResultId] = useState<string | null>(null);
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  useEffect(() => {
    fetchGoals();
  }, [user]);

  const fetchGoals = async () => {
    if (!user) return;
    try {
      setIsLoading(true);
      const { data } = await supabase.from('goals').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      if (data) {
        const mapped = data.map(dbGoal => {
          let extra = { type: 'Milestone', cagr: 10, stepUp: 0, monthlyInvest: 0 };
          try {
            if (dbGoal.risk_profile && dbGoal.risk_profile.startsWith('{')) {
              extra = JSON.parse(dbGoal.risk_profile);
            }
          } catch (e) {}

          const targetYear = new Date().getFullYear() + (dbGoal.timeline_years || 5);
          const years = Math.max(1, dbGoal.timeline_years || 5);
          const reqSip = calculateRequiredSip(dbGoal.target, dbGoal.current, extra.cagr, years, extra.stepUp);

          return {
            id: dbGoal.id,
            title: dbGoal.title,
            target_amount: dbGoal.target,
            current_saved: dbGoal.current,
            target_year: targetYear,
            expected_cagr: extra.cagr,
            required_monthly_sip: reqSip,
            current_monthly_sip: extra.monthlyInvest,
            status: reqSip > extra.monthlyInvest ? 'Attention Needed' : 'On Track'
          };
        });
        setGoals(mapped);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const getBaseReturnForType = (type: string) => {
    switch (type) {
      case 'Stocks': return 12;
      case 'Mutual funds': return 10;
      case 'Combination': return 10;
      case 'Gold': return 8;
      case 'Bonds': return 7;
      case 'Fixed deposits': return 6;
      default: return 8;
    }
  };

  const handleStartWizard = () => {
    setStep(1);
    setViewState('wizard');
    // reset
    setWGoal('');
    setWCustomGoal('');
    setWCostToday(5000000);
    setWTargetYear(new Date().getFullYear() + 5);
    setWCurrentSavings(0);
    setWMonthlyInvest(10000);
    setWInvestType('Mutual funds');
    setWStepUp(0);
  };

  const handleFinishWizard = () => {
    setAssumedReturn(getBaseReturnForType(wInvestType));
    setViewState('result');
  };

  const calculateRequiredSip = (targetFV: number, currentPV: number, cagr: number, years: number, annualStepUp: number) => {
    const r = cagr / 100;
    const g = annualStepUp / 100;
    const fvOfPv = currentPV * Math.pow(1 + r, years);
    const shortfall = targetFV - fvOfPv;
    
    if (shortfall <= 0) return 0;

    let low = 0;
    let high = shortfall;
    let startingSip = 0;

    for (let iter = 0; iter < 100; iter++) {
      const mid = (low + high) / 2;
      let simulatedFv = 0;
      let currentMonthly = mid;

      for (let y = 0; y < years; y++) {
        for (let m = 0; m < 12; m++) {
          simulatedFv += currentMonthly;
          simulatedFv *= Math.pow(1 + r, 1/12);
        }
        currentMonthly *= (1 + g);
      }

      if (simulatedFv < shortfall) {
        low = mid;
      } else {
        high = mid;
        startingSip = mid;
      }
    }
    return Math.round(startingSip);
  };

  const inflationRate = 0.06;
  const years = Math.max(1, wTargetYear - new Date().getFullYear());
  const inflatedTarget = Math.round(wCostToday * Math.pow(1 + inflationRate, years));
  const requiredSip = calculateRequiredSip(inflatedTarget, wCurrentSavings, assumedReturn, years, wStepUp);
  
  const finalTitle = wGoal === 'Other' ? wCustomGoal : wGoal;

  const handleDeleteGoal = async (id: string) => {
    if (!user) return;
    try {
      await supabase.from('goals').delete().eq('id', id);
      await fetchGoals();
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveGoal = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      const extraData = JSON.stringify({
        type: wInvestType,
        cagr: assumedReturn,
        stepUp: wStepUp,
        monthlyInvest: wMonthlyInvest
      });

      const newGoal = {
        user_id: user.id,
        title: finalTitle,
        target: inflatedTarget,
        current: wCurrentSavings,
        timeline_years: years,
        risk_profile: extraData
      };
      
      const { error } = await supabase.from('goals').insert([newGoal]);
      if (error) {
        console.error("Supabase Insert Error:", error);
      }
      await fetchGoals();
      setViewState('dashboard');
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  // --- Renders ---

  if (viewState === 'dashboard') {
    return (
      <div className="max-w-7xl mx-auto space-y-6 pt-6">
        <div className="flex justify-between items-end mb-8">
          <div>
            
            
          </div>
          <button 
            onClick={handleStartWizard}
            className="bg-[#A855F7] text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 hover:bg-[#9333EA] transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Goal
          </button>
        </div>

        {isLoading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#A855F7] animate-spin" />
          </div>
        ) : goals.length === 0 ? (
          <div className="bg-[#161616] rounded-2xl p-6 text-center flex flex-col items-center justify-center border border-[#222]">
            <div className="w-12 h-12 bg-[#A855F7]/10 rounded-full flex items-center justify-center mb-3">
              <Plus className="w-6 h-6 text-[#A855F7]" />
            </div>
            <h2 className="text-lg font-heading font-bold text-white mb-1">No Active Goals</h2>
            <p className="text-[#8A8F98] text-sm max-w-sm mb-4">Create a goal to see how much you need to save and invest to reach it.</p>
            <button 
              onClick={handleStartWizard}
              className="bg-[#A855F7] text-white font-bold py-2 px-6 rounded-full text-sm transition-colors hover:bg-[#9333EA]"
            >
              Start Planning
            </button>
          </div>
        ) : (
          <div className="w-full">
            {expandedGoalId ? (() => {
              const g = goals.find(x => x.id === expandedGoalId);
              if (!g) return null;
              
              const PASTEL_THEMES = [
                { bg: 'bg-[#DDF7EF]', text: 'text-[#101413]', sub: 'text-[#008F6B]', border: 'border-[#008F6B]/20', accent: '#008F6B' },
                { bg: 'bg-[#E6F0FF]', text: 'text-[#101413]', sub: 'text-[#2775E8]', border: 'border-[#2775E8]/20', accent: '#2775E8' },
                { bg: 'bg-[#EEE8FF]', text: 'text-[#101413]', sub: 'text-[#7757D9]', border: 'border-[#7757D9]/20', accent: '#7757D9' },
                { bg: 'bg-[#FFE5E3]', text: 'text-[#101413]', sub: 'text-[#D64545]', border: 'border-[#D64545]/20', accent: '#D64545' },
                { bg: 'bg-[#FFF8E8]', text: 'text-[#101413]', sub: 'text-[#D99A00]', border: 'border-[#D99A00]/20', accent: '#D99A00' },
              ];
              const theme = PASTEL_THEMES[goals.findIndex(x => x.id === expandedGoalId) % PASTEL_THEMES.length];
              
              return (
                <div className="w-full max-w-4xl mx-auto space-y-6">
                  <div className="flex justify-between items-center mb-2">
                    <button onClick={() => setExpandedGoalId(null)} className="text-[#8A8F98] hover:text-white flex items-center gap-2 text-sm font-bold">
                      <ArrowLeft className="w-4 h-4" /> Back to Goals
                    </button>
                    <button onClick={() => handleDeleteGoal(g.id)} className="text-[#8A8F98] hover:text-red-500 flex items-center gap-2 text-sm font-bold">
                      <Trash2 className="w-4 h-4" /> Delete Goal
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className={`${theme.bg} p-8 rounded-[32px]`}>
                        <h3 className={`${theme.sub} font-bold uppercase tracking-widest text-xs mb-1`}>Goal</h3>
                        <h2 className={`text-2xl font-heading font-extrabold ${theme.text} mb-8`}>{g.title}</h2>
                        <div className="space-y-6">
                          <div className={`flex justify-between items-end border-b ${theme.border} pb-4`}>
                            <div>
                              <p className={`${theme.sub} text-sm mb-1`}>Target Amount</p>
                              <p className={`${theme.text} font-heading font-extrabold text-xl`}>₹{Number(g.target_amount).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-right">
                              <p className={`${theme.sub} text-sm mb-1`}>Target Year</p>
                              <p className={`${theme.text} font-heading font-extrabold text-xl`}>{g.target_year}</p>
                            </div>
                          </div>
                          <div className={`flex justify-between items-end border-b ${theme.border} pb-4`}>
                            <div>
                              <p className={`${theme.sub} text-sm mb-1`}>Current Savings</p>
                              <p className={`${theme.text} font-heading font-extrabold text-xl`}>₹{Number(g.current_saved).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={`${theme.bg} p-8 rounded-[32px]`}>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className={`text-4xl font-heading font-extrabold ${theme.sub}`}>{g.expected_cagr}%</span>
                        </div>
                        <p className={`${theme.sub} text-sm font-medium mb-2`}>Expected annual return</p>
                      </div>
                    </div>
                    <div className={`${theme.bg} p-8 rounded-[32px] flex flex-col justify-between relative overflow-hidden`}>
                      <div>
                        <h3 className={`text-xl font-heading font-bold ${theme.text} mb-8`}>Required monthly investment</h3>
                        <div className={`text-5xl font-heading font-extrabold ${theme.text} mb-2`}>
                          ₹{Number(g.required_monthly_sip).toLocaleString('en-IN')}<span className="text-2xl opacity-50">/mo</span>
                        </div>
                        <div className={`mt-8 p-4 rounded-xl flex items-start gap-3 bg-white/40 ${theme.text}`}>
                          <div className="mt-0.5">
                            {g.status === 'On Track' ? <Check className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
                          </div>
                          <div className="text-sm font-bold">
                            {g.status === 'On Track'
                              ? "You are on track! Your available monthly investment meets or exceeds the requirement."
                              : `You're short by ₹${(Number(g.required_monthly_sip) - Number(g.current_monthly_sip)).toLocaleString('en-IN')}/mo. Consider extending your timeline or increasing your savings.`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((g, i) => {
                  const PASTEL_THEMES = [
                    { bg: 'bg-[#DDF7EF]', text: 'text-[#101413]', sub: 'text-[#008F6B]', bar: 'bg-[#008F6B]', badgeBg: 'bg-[#008F6B]/10' },
                    { bg: 'bg-[#E6F0FF]', text: 'text-[#101413]', sub: 'text-[#2775E8]', bar: 'bg-[#2775E8]', badgeBg: 'bg-[#2775E8]/10' },
                    { bg: 'bg-[#EEE8FF]', text: 'text-[#101413]', sub: 'text-[#7757D9]', bar: 'bg-[#7757D9]', badgeBg: 'bg-[#7757D9]/10' },
                    { bg: 'bg-[#FFE5E3]', text: 'text-[#101413]', sub: 'text-[#D64545]', bar: 'bg-[#D64545]', badgeBg: 'bg-[#D64545]/10' },
                    { bg: 'bg-[#FFF8E8]', text: 'text-[#101413]', sub: 'text-[#D99A00]', bar: 'bg-[#D99A00]', badgeBg: 'bg-[#D99A00]/10' },
                  ];
                  const theme = PASTEL_THEMES[i % PASTEL_THEMES.length];
                  
                  return (
                    <div key={g.id} className={`${theme.bg} p-6 rounded-[24px] flex flex-col relative group cursor-pointer hover:-translate-y-1 transition-transform`} onClick={() => setExpandedGoalId(g.id)}>
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDeleteGoal(g.id); }} 
                        className={`absolute top-6 right-16 ${theme.sub} hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white/40 hover:bg-white p-2 rounded-full`}
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setExpandedGoalId(g.id); }} 
                        className={`absolute top-6 right-6 ${theme.sub} opacity-0 group-hover:opacity-100 transition-all bg-white/40 hover:bg-white p-2 rounded-full`}
                        title="Expand Goal"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <h3 className={`text-lg font-heading font-bold ${theme.text} mb-1 pr-20`}>{g.title}</h3>
                      <p className={`text-sm ${theme.sub} mb-6`}>Target: {g.target_year}</p>
                      
                      <div className="mb-6">
                        <p className={`text-xs ${theme.sub} uppercase tracking-wider font-bold mb-1`}>Target Amount</p>
                        <p className={`text-2xl font-heading font-extrabold ${theme.text}`}>₹{Number(g.target_amount).toLocaleString('en-IN')}</p>
                      </div>

                      <div className="space-y-4 mb-6 flex-1">
                        <div>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className={theme.sub}>Saved</span>
                            <span className={`${theme.text} font-bold`}>₹{Number(g.current_saved).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                            <div className={`${theme.bar} h-full rounded-full`} style={{ width: `${Math.min(100, (Number(g.current_saved) / Number(g.target_amount)) * 100)}%` }}></div>
                          </div>
                        </div>
                        <div className={`pt-2 border-t border-black/10`}>
                          <div className="flex justify-between text-sm">
                            <span className={theme.sub}>Monthly SIP Req.</span>
                            <span className={`${theme.text} font-bold`}>₹{Number(g.required_monthly_sip).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className={`p-3 rounded-xl text-center text-sm font-bold ${theme.badgeBg} ${theme.sub}`}>
                        {g.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  if (viewState === 'wizard') {
    return (
      <div className="max-w-2xl mx-auto pt-12 pb-24">
        <div className="mb-8 flex items-center justify-between">
          <button onClick={() => setViewState('dashboard')} className="text-[#8A8F98] hover:text-white flex items-center gap-2 text-sm font-bold">
            <ArrowLeft className="w-4 h-4" /> Cancel
          </button>
          <span className="text-xs font-bold text-[#A855F7] tracking-widest uppercase">Step {step} of 7</span>
        </div>

        <div className="bg-[#161616] rounded-[24px] p-8 md:p-12 min-h-[400px] flex flex-col">
          {step === 1 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-6">What are you planning for?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {GOAL_OPTIONS.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => {
                      setWGoal(opt);
                      if (opt !== 'Other') setStep(2);
                    }}
                    className={`p-4 rounded-xl text-left font-bold transition-colors ${wGoal === opt ? 'bg-[#A855F7] text-white' : 'bg-[#111111] text-[#8A8F98] hover:bg-[#222] hover:text-white'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              {wGoal === 'Other' && (
                <div className="mt-6 flex gap-3">
                  <input 
                    type="text" 
                    placeholder="Custom goal name"
                    value={wCustomGoal}
                    onChange={e => setWCustomGoal(e.target.value)}
                    className="flex-1 bg-[#111111] text-white border border-[#333] rounded-xl px-4 py-3 focus:outline-none focus:border-[#A855F7] font-bold"
                    autoFocus
                  />
                  <button onClick={() => { if (wCustomGoal.trim()) setStep(2); }} className="bg-[#A855F7] text-white px-6 rounded-xl font-bold">Next</button>
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-2">Target Amount</h2>
              <p className="text-[#8A8F98] mb-8 font-medium">What would this goal cost today?</p>
              
              <div className="relative">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-[#8A8F98]">₹</span>
                <input 
                  type="number"
                  value={wCostToday || ''}
                  onChange={e => setWCostToday(Number(e.target.value))}
                  className="w-full bg-[#111111] text-white text-3xl font-heading font-extrabold rounded-2xl py-6 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  autoFocus
                />
              </div>
              
              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(1)} className="text-[#8A8F98] font-bold px-4 py-2 hover:text-white">Back</button>
                <button onClick={() => setStep(3)} className="bg-[#A855F7] text-white font-bold px-8 py-3 rounded-full hover:bg-[#9333EA]">Next</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-2">Target Date</h2>
              <p className="text-[#8A8F98] mb-8 font-medium">When do you want to achieve this goal?</p>
              
              <input 
                type="number"
                value={wTargetYear || ''}
                onChange={e => setWTargetYear(Number(e.target.value))}
                className="w-full bg-[#111111] text-white text-3xl font-heading font-extrabold rounded-2xl py-6 px-6 focus:outline-none focus:ring-2 focus:ring-[#A855F7] text-center"
              />
              
              <div className="text-center mt-6">
                <span className="inline-block bg-[#A855F7]/10 text-[#A855F7] font-bold px-6 py-2 rounded-full">
                  {Math.max(0, wTargetYear - new Date().getFullYear())} years from now
                </span>
              </div>
              
              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(2)} className="text-[#8A8F98] font-bold px-4 py-2 hover:text-white">Back</button>
                <button onClick={() => setStep(4)} className="bg-[#A855F7] text-white font-bold px-8 py-3 rounded-full hover:bg-[#9333EA]">Next</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-2">Current Savings</h2>
              <p className="text-[#8A8F98] mb-8 font-medium">How much have you already invested or saved for this?</p>
              
              <div className="relative mb-6">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-[#8A8F98]">₹</span>
                <input 
                  type="number"
                  value={wCurrentSavings === 0 ? '' : wCurrentSavings}
                  onChange={e => setWCurrentSavings(Number(e.target.value))}
                  placeholder="0"
                  className="w-full bg-[#111111] text-white text-3xl font-heading font-extrabold rounded-2xl py-6 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                  autoFocus
                />
              </div>

              <button 
                onClick={() => { setWCurrentSavings(0); setStep(5); }}
                className="w-full p-4 bg-[#111111] text-[#8A8F98] hover:text-white rounded-xl font-bold transition-colors"
              >
                I haven't started saving yet
              </button>
              
              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(3)} className="text-[#8A8F98] font-bold px-4 py-2 hover:text-white">Back</button>
                <button onClick={() => setStep(5)} className="bg-[#A855F7] text-white font-bold px-8 py-3 rounded-full hover:bg-[#9333EA]">Next</button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-2">Monthly Investment</h2>
              <p className="text-[#8A8F98] mb-8 font-medium">How much can you invest every month toward this goal?</p>
              
              <div className="relative mb-8">
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-extrabold text-[#8A8F98]">₹</span>
                <input 
                  type="number"
                  value={wMonthlyInvest || ''}
                  onChange={e => setWMonthlyInvest(Number(e.target.value))}
                  className="w-full bg-[#111111] text-white text-3xl font-heading font-extrabold rounded-2xl py-6 pl-14 pr-6 focus:outline-none focus:ring-2 focus:ring-[#A855F7]"
                />
              </div>

              <input 
                type="range" 
                min="0" max="100000" step="1000"
                value={wMonthlyInvest}
                onChange={e => setWMonthlyInvest(Number(e.target.value))}
                className="w-full accent-[#A855F7]"
              />
              <div className="flex justify-between mt-2 text-xs text-[#8A8F98] font-bold">
                <span>₹0</span>
                <span>₹1,00,000+</span>
              </div>
              
              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(4)} className="text-[#8A8F98] font-bold px-4 py-2 hover:text-white">Back</button>
                <button onClick={() => setStep(6)} className="bg-[#A855F7] text-white font-bold px-8 py-3 rounded-full hover:bg-[#9333EA]">Next</button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-2">Investment Type</h2>
              <p className="text-[#8A8F98] mb-8 font-medium">How do you plan to invest for this goal?</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {INVEST_TYPES.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => {
                      setWInvestType(opt);
                      setStep(7);
                    }}
                    className={`p-4 rounded-xl text-left font-bold transition-colors ${wInvestType === opt ? 'bg-[#A855F7] text-white' : 'bg-[#111111] text-[#8A8F98] hover:bg-[#222] hover:text-white'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
              
              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(5)} className="text-[#8A8F98] font-bold px-4 py-2 hover:text-white">Back</button>
                <button onClick={() => setStep(7)} className="bg-[#A855F7] text-white font-bold px-8 py-3 rounded-full hover:bg-[#9333EA]">Next</button>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="flex-1 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-heading font-extrabold text-white mb-2">Annual Increase</h2>
              <p className="text-[#8A8F98] mb-8 font-medium">Can you increase your monthly investment every year?</p>
              
              <div className="grid grid-cols-1 gap-3">
                {STEP_UPS.map(opt => (
                  <button 
                    key={opt.label}
                    onClick={() => {
                      setWStepUp(opt.value);
                      handleFinishWizard();
                    }}
                    className={`p-5 rounded-xl text-left font-bold transition-colors flex justify-between items-center ${wStepUp === opt.value ? 'bg-[#A855F7] text-white' : 'bg-[#111111] text-[#8A8F98] hover:bg-[#222] hover:text-white'}`}
                  >
                    <span>{opt.label}</span>
                    {wStepUp === opt.value && <Check className="w-5 h-5" />}
                  </button>
                ))}
              </div>
              
              <div className="mt-12 flex justify-between">
                <button onClick={() => setStep(6)} className="text-[#8A8F98] font-bold px-4 py-2 hover:text-white">Back</button>
                <button onClick={handleFinishWizard} className="bg-[#A855F7] text-white font-bold px-8 py-3 rounded-full hover:bg-[#9333EA]">View Plan</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Result State
  return (
    <div className="max-w-4xl mx-auto pt-8 pb-24">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-heading font-extrabold text-white">Your Goal Plan</h1>
        <button onClick={() => setViewState('dashboard')} className="text-[#8A8F98] hover:text-white font-bold text-sm">
          Cancel
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Col: Details */}
        <div className="space-y-6">
          <div className="bg-[#161616] p-8 rounded-[32px]">
            <h3 className="text-[#8A8F98] font-bold uppercase tracking-widest text-xs mb-1">Goal</h3>
            <h2 className="text-2xl font-heading font-extrabold text-white mb-8">{finalTitle}</h2>
            
            <div className="space-y-6">
              <div className="flex justify-between items-end border-b border-[#222] pb-4">
                <div>
                  <p className="text-[#8A8F98] text-sm mb-1">Target (Adjusted for 6% inflation)</p>
                  <p className="text-white font-heading font-extrabold text-xl">₹{inflatedTarget.toLocaleString('en-IN')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[#8A8F98] text-sm mb-1">Year</p>
                  <p className="text-white font-heading font-extrabold text-xl">{wTargetYear}</p>
                </div>
              </div>

              <div className="flex justify-between items-end border-b border-[#222] pb-4">
                <div>
                  <p className="text-[#8A8F98] text-sm mb-1">Current Savings</p>
                  <p className="text-white font-heading font-extrabold text-xl">₹{wCurrentSavings.toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#161616] p-8 rounded-[32px]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white font-heading font-bold text-lg">Expected annual return</h3>
              <button 
                onClick={() => setIsEditingReturn(!isEditingReturn)}
                className="text-[#A855F7] p-2 hover:bg-[#A855F7]/10 rounded-full transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-4xl font-heading font-extrabold text-[#A855F7]">{assumedReturn}%</span>
            </div>
            <p className="text-[#8A8F98] text-sm font-medium mb-6">ⓘ This is an illustrative assumption, not a guaranteed return.</p>

            {isEditingReturn && (
              <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-[#222]">
                <button onClick={() => { setAssumedReturn(8); setIsEditingReturn(false); }} className={`py-2 rounded-xl text-sm font-bold ${assumedReturn === 8 ? 'bg-[#A855F7] text-white' : 'bg-[#111] text-[#8A8F98] hover:bg-[#222]'}`}>
                  Conservative (8%)
                </button>
                <button onClick={() => { setAssumedReturn(10); setIsEditingReturn(false); }} className={`py-2 rounded-xl text-sm font-bold ${assumedReturn === 10 ? 'bg-[#A855F7] text-white' : 'bg-[#111] text-[#8A8F98] hover:bg-[#222]'}`}>
                  Moderate (10%)
                </button>
                <button onClick={() => { setAssumedReturn(12); setIsEditingReturn(false); }} className={`py-2 rounded-xl text-sm font-bold ${assumedReturn === 12 ? 'bg-[#A855F7] text-white' : 'bg-[#111] text-[#8A8F98] hover:bg-[#222]'}`}>
                  Aggressive (12%)
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Col: Result */}
        <div className="bg-[#161616] p-8 rounded-[32px] flex flex-col justify-between border-2 border-[#A855F7]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A855F7]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
          
          <div>
            <h3 className="text-xl font-heading font-bold text-white mb-8">Required monthly investment</h3>
            
            <div className="text-5xl font-heading font-extrabold text-white mb-2">
              ₹{requiredSip.toLocaleString('en-IN')}<span className="text-2xl text-[#8A8F98]">/mo</span>
            </div>
            
            <p className="text-[#8A8F98] text-sm mt-8 leading-relaxed border-l-2 border-[#333] pl-4 py-1">
              Based on an assumed annual return of <strong className="text-white">{assumedReturn}%</strong> and a <strong className="text-white">{wStepUp}%</strong> annual SIP increase.
            </p>

            <div className={`mt-8 p-4 rounded-xl flex items-start gap-3 ${wMonthlyInvest >= requiredSip ? 'bg-[#20EFA0]/10 text-[#20EFA0]' : 'bg-red-500/10 text-red-500'}`}>
              <div className="mt-0.5">
                {wMonthlyInvest >= requiredSip ? <Check className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
              </div>
              <div className="text-sm font-bold">
                {wMonthlyInvest >= requiredSip 
                  ? "You are on track! Your available monthly investment meets or exceeds the requirement."
                  : `You're short by ₹${(requiredSip - wMonthlyInvest).toLocaleString('en-IN')}/mo. Consider extending your timeline or increasing your savings.`
                }
              </div>
            </div>
          </div>

          <button 
            onClick={handleSaveGoal}
            disabled={isSaving}
            className="w-full mt-10 bg-[#A855F7] text-white font-bold py-4 rounded-full text-lg hover:bg-[#9333EA] transition-colors disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : "Save Goal"}
          </button>
        </div>

      </div>
    </div>
  );
};
