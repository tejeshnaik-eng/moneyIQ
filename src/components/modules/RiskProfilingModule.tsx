import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Briefcase, 
  Wallet, 
  Target, 
  Compass, 
  Brain, 
  Edit3, 
  Lock, 
  Sparkles, 
  RotateCcw,
  AlertTriangle,
  PieChart as PieIcon
} from 'lucide-react';
import { 
  InvestorProfileForm, 
  WorkType, 
  IncomeStability, 
  IncomeChange3Years, 
  TimeHorizon, 
  PrimaryGoal, 
  InvestmentExperience, 
  DecisionStyle, 
  CrashReaction, 
  OutcomePreference, 
  LossProtectionPriority, 
  VolatilityComfort,
  ComprehensiveProfileResult
} from '../../types';
import { RiskProfileEngine } from '../../services/riskProfileEngine';

export const RiskProfilingModule: React.FC = () => {
  const hasProfile = RiskProfileEngine.hasCompletedProfile();
  const [formData, setFormData] = useState<InvestorProfileForm>(RiskProfileEngine.getStoredProfile());
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  // Start in questionnaire if user has never filled it, otherwise show result
  const [viewState, setViewState] = useState<'questionnaire' | 'review' | 'result'>(
    hasProfile ? 'result' : 'questionnaire'
  );
  const [result, setResult] = useState<ComprehensiveProfileResult | null>(
    hasProfile ? RiskProfileEngine.evaluateProfile(RiskProfileEngine.getStoredProfile()) : null
  );

  const handleUpdate = <K extends keyof InvestorProfileForm>(field: K, value: InvestorProfileForm[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleToggleMultiSelect = (item: string) => {
    const current = formData.currentInvestments;
    if (current.includes(item)) {
      setFormData(prev => ({ ...prev, currentInvestments: current.filter(i => i !== item) }));
    } else {
      setFormData(prev => ({ ...prev, currentInvestments: [...current, item] }));
    }
  };

  const handleCalculateProfile = () => {
    // Save structured JSON internally (without disclosing raw JSON to user)
    RiskProfileEngine.saveProfile(formData);
    const evaluated = RiskProfileEngine.evaluateProfile(formData);
    setResult(evaluated);
    setViewState('result');
  };

  const handleJumpToQuestion = (qIndex: number) => {
    setCurrentQuestionIndex(qIndex);
    setViewState('questionnaire');
  };

  const totalQuestions = 20;

  return (
    <div className="space-y-8 pb-12">
      {/* View State 1: Stitch Single-Question Focus Card */}
      {viewState === 'questionnaire' && (
        <div className="max-w-2xl mx-auto flex flex-col items-center justify-center space-y-6 pt-4">
          <div className="bg-white w-full rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
            {/* Progress Header */}
            <div className="p-6 border-b border-[#E2E8F0] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading font-bold text-[#565e74] uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="font-heading font-bold text-[#006b57]">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Completed
                </span>
              </div>
              <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[#00b090] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Body */}
            <div className="p-8 sm:p-10 space-y-6">
              {/* Q1: Age */}
              {currentQuestionIndex === 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    What is your current age?
                  </h2>
                  <p className="text-xs text-[#565e74]">
                    Your age helps establish your natural investment compounding timeline.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[#E2E8F0] rounded-xl bg-[#f7f9fb] max-w-sm focus-within:border-[#00b090] focus-within:bg-white">
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={formData.age}
                        onChange={(e) => handleUpdate('age', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[#191c1e]"
                        placeholder="25"
                      />
                      <span className="text-xs text-[#565e74] font-heading font-semibold">Years</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[22, 28, 35, 45].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => handleUpdate('age', a)}
                          className="px-3 py-1 rounded bg-[#f2f4f6] hover:bg-[#e6e8ea] text-xs font-heading font-semibold text-[#565e74]"
                        >
                          {a} Yrs
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Q2: Work Type */}
              {currentQuestionIndex === 1 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    What best describes your current occupation?
                  </h2>
                  <p className="text-xs text-[#565e74]">
                    Employment structure determines cash flow certainty.
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                    {(['Salaried employee', 'Business owner', 'Freelancer', 'Self-employed', 'Student', 'Homemaker', 'Retired', 'Currently unemployed', 'Other'] as WorkType[]).map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => handleUpdate('workType', w)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-heading transition-all ${
                          formData.workType === w
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        {w}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q3: Monthly Income */}
              {currentQuestionIndex === 2 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    What is your approximate monthly take-home income?
                  </h2>
                  <p className="text-xs text-[#565e74]">
                    Baseline take-home earnings credited each month.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[#E2E8F0] rounded-xl bg-[#f7f9fb] max-w-sm focus-within:border-[#00b090] focus-within:bg-white">
                      <span className="text-lg font-mono font-bold text-[#565e74] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        value={formData.monthlyIncome}
                        onChange={(e) => handleUpdate('monthlyIncome', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[#191c1e]"
                        placeholder="1,00,000"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[50000, 100000, 150000, 250000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleUpdate('monthlyIncome', amt)}
                          className="px-3 py-1 rounded bg-[#f2f4f6] hover:bg-[#e6e8ea] text-xs font-heading font-semibold text-[#565e74]"
                        >
                          ₹{(amt / 100000).toFixed(1)}L
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Q4: Total Savings */}
              {currentQuestionIndex === 3 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How much do you currently hold in savings and investments?
                  </h2>
                  <p className="text-xs text-[#565e74]">
                    Total cumulative savings across bank accounts, mutual funds, stocks, and FDs.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[#E2E8F0] rounded-xl bg-[#f7f9fb] max-w-sm focus-within:border-[#00b090] focus-within:bg-white">
                      <span className="text-lg font-mono font-bold text-[#565e74] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50000"
                        value={formData.totalSavingsInvestments}
                        onChange={(e) => handleUpdate('totalSavingsInvestments', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[#191c1e]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q5: Monthly Investment Capacity */}
              {currentQuestionIndex === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How much can you comfortably invest every month?
                  </h2>
                  <p className="text-xs text-[#565e74]">
                    Surplus amount designated for SIPs and long-term asset building.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[#E2E8F0] rounded-xl bg-[#f7f9fb] max-w-sm focus-within:border-[#00b090] focus-within:bg-white">
                      <span className="text-lg font-mono font-bold text-[#565e74] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="2000"
                        value={formData.monthlyInvestmentCapacity}
                        onChange={(e) => handleUpdate('monthlyInvestmentCapacity', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[#191c1e]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q6: Emergency Savings */}
              {currentQuestionIndex === 5 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How much emergency savings do you currently have?
                  </h2>
                  <p className="text-xs text-[#565e74]">
                    Liquid funds or sweep-in FDs set aside strictly for contingencies.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[#E2E8F0] rounded-xl bg-[#f7f9fb] max-w-sm focus-within:border-[#00b090] focus-within:bg-white">
                      <span className="text-lg font-mono font-bold text-[#565e74] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={formData.emergencySavings}
                        onChange={(e) => handleUpdate('emergencySavings', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[#191c1e]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q7: Investment Horizon */}
              {currentQuestionIndex === 6 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    When will you likely need most of the money you are investing?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['Within 1 year', '1–3 years', '3–5 years', '5–10 years', 'More than 10 years'] as TimeHorizon[]).map((h) => (
                      <button
                        key={h}
                        type="button"
                        onClick={() => handleUpdate('timeHorizon', h)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.timeHorizon === h
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{h}</span>
                        {formData.timeHorizon === h && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q8: Primary Goal */}
              {currentQuestionIndex === 7 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    What is your primary investment goal?
                  </h2>
                  <div className="grid grid-cols-2 gap-2.5 pt-2">
                    {(['Emergency fund', 'Education', 'Buying a vehicle', 'Buying a house', 'Retirement', 'Wealth creation', 'Starting a business', 'Other'] as PrimaryGoal[]).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => handleUpdate('primaryGoal', g)}
                        className={`p-3.5 rounded-xl border text-left text-xs font-heading transition-all ${
                          formData.primaryGoal === g
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q9: Investment Experience */}
              {currentQuestionIndex === 8 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How much investment experience do you have?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['None', 'Less than 1 year', '1–3 years', '3–5 years', 'More than 5 years'] as InvestmentExperience[]).map((exp) => (
                      <button
                        key={exp}
                        type="button"
                        onClick={() => handleUpdate('investmentExperience', exp)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.investmentExperience === exp
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{exp}</span>
                        {formData.investmentExperience === exp && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q10: Current Holdings */}
              {currentQuestionIndex === 9 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    Which investments do you currently hold?
                  </h2>
                  <p className="text-xs text-[#565e74]">Select all that apply.</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2">
                    {['Savings account', 'Fixed deposits', 'Recurring deposits', 'Mutual funds', 'Stocks', 'ETFs', 'Bonds', 'Gold', 'Crypto', 'Other'].map((opt) => {
                      const isSelected = formData.currentInvestments.includes(opt);
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => handleToggleMultiSelect(opt)}
                          className={`p-3 rounded-xl border text-center text-xs font-heading flex items-center justify-center gap-1.5 transition-all ${
                            isSelected
                              ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                              : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#00b090]" />}
                          <span>{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Q11: Income Stability */}
              {currentQuestionIndex === 10 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How stable is your current income?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['Very unstable', 'Somewhat unstable', 'Fairly stable', 'Stable', 'Very stable'] as IncomeStability[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => handleUpdate('incomeStability', s)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.incomeStability === s
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{s}</span>
                        {formData.incomeStability === s && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q12: Debt & Liabilities */}
              {currentQuestionIndex === 11 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    Do you currently have any loans or significant debt?
                  </h2>
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate('hasDebt', false)}
                      className={`flex-1 p-4 rounded-xl border text-center text-xs font-heading font-bold ${
                        !formData.hasDebt
                          ? 'bg-[#006b57] text-white border-[#006b57]'
                          : 'bg-[#f7f9fb] text-[#565e74] border-[#E2E8F0]'
                      }`}
                    >
                      No Debt
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdate('hasDebt', true)}
                      className={`flex-1 p-4 rounded-xl border text-center text-xs font-heading font-bold ${
                        formData.hasDebt
                          ? 'bg-[#ba1a1a] text-white border-[#ba1a1a]'
                          : 'bg-[#f7f9fb] text-[#565e74] border-[#E2E8F0]'
                      }`}
                    >
                      Yes, Have Loans / EMI
                    </button>
                  </div>

                  {formData.hasDebt && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[#E2E8F0]">
                      <div>
                        <label className="block text-[11px] font-heading font-bold text-[#565e74] mb-1">
                          Outstanding Debt (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.outstandingDebt}
                          onChange={(e) => handleUpdate('outstandingDebt', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-heading font-bold text-[#565e74] mb-1">
                          Monthly EMI (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.monthlyEmi}
                          onChange={(e) => handleUpdate('monthlyEmi', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Q13: Crash Reaction */}
              {currentQuestionIndex === 12 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    If your portfolio lost 20% during a market crash, what would you do?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['Sell everything', 'Sell some investments', 'Hold and wait', 'Continue my SIP/investments', 'Invest more'] as CrashReaction[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdate('crashReaction20', opt)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.crashReaction20 === opt
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.crashReaction20 === opt && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q14: Outcome Preference */}
              {currentQuestionIndex === 13 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    Which investment outcome would you prefer?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['₹1.2 lakh with very low risk', '₹1.4 lakh with low risk', '₹1.7 lakh with moderate risk', '₹2 lakh with high risk', '₹2.5 lakh with very high risk'] as OutcomePreference[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdate('outcomePreference', opt)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.outcomePreference === opt
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.outcomePreference === opt && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q15: Protecting Initial Investment */}
              {currentQuestionIndex === 14 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How important is protecting your initial investment?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['Extremely important', 'Very important', 'Moderately important', 'Slightly important', 'Not important'] as LossProtectionPriority[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdate('lossProtectionPriority', opt)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.lossProtectionPriority === opt
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.lossProtectionPriority === opt && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q16: Volatility Comfort */}
              {currentQuestionIndex === 15 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How comfortable are you with large fluctuations in value?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['Very uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very comfortable'] as VolatilityComfort[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdate('volatilityComfort', opt)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.volatilityComfort === opt
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.volatilityComfort === opt && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q17: Current Investment % */}
              {currentQuestionIndex === 16 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    What % of monthly income are you currently investing?
                  </h2>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[#E2E8F0] rounded-xl bg-[#f7f9fb] max-w-sm focus-within:border-[#00b090] focus-within:bg-white">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.currentInvestmentPct}
                        onChange={(e) => handleUpdate('currentInvestmentPct', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[#191c1e]"
                      />
                      <span className="text-xs text-[#565e74] font-heading font-bold">%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Q18: Emergency Withdrawal Need */}
              {currentQuestionIndex === 17 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How much would you need to withdraw from investments in an emergency?
                  </h2>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[#E2E8F0] rounded-xl bg-[#f7f9fb] max-w-sm focus-within:border-[#00b090] focus-within:bg-white">
                      <span className="text-lg font-mono font-bold text-[#565e74] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={formData.emergencyWithdrawalNeed}
                        onChange={(e) => handleUpdate('emergencyWithdrawalNeed', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[#191c1e]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q19: 3-Year Income Outlook */}
              {currentQuestionIndex === 18 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    Do you expect your income to change significantly in the next 3 years?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['Increase significantly', 'Increase slightly', 'Stay approximately the same', 'Decrease slightly', 'Decrease significantly', 'Not sure'] as IncomeChange3Years[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdate('incomeChange3Years', opt)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.incomeChange3Years === opt
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.incomeChange3Years === opt && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q20: Decision Style */}
              {currentQuestionIndex === 19 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[#191c1e]">
                    How do you usually make investment decisions?
                  </h2>
                  <div className="space-y-2 pt-2">
                    {(['Bank/financial advisor', 'Research and financial data', 'Friends/family', 'Social media/YouTube', 'News and market trends', 'My own experience', 'Combination of these'] as DecisionStyle[]).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleUpdate('decisionStyle', opt)}
                        className={`w-full p-4 rounded-xl border text-left text-xs font-heading flex items-center justify-between transition-all ${
                          formData.decisionStyle === opt
                            ? 'border-[#00b090] bg-[#00b090]/10 text-[#006b57] font-bold'
                            : 'border-[#E2E8F0] hover:bg-[#f7f9fb] text-[#565e74]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.decisionStyle === opt && <CheckCircle2 className="w-4 h-4 text-[#00b090]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-[#f7f9fb] border-t border-[#E2E8F0] flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1);
                  else setViewState('review');
                }}
                className="btn-secondary text-xs py-2.5 px-6 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              {currentQuestionIndex < totalQuestions - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setViewState('review')}
                  className="btn-primary text-xs py-2.5 px-6 flex items-center gap-1.5 shadow-sm"
                >
                  <span>Review Answers</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-[#565e74] text-xs">
            <Lock className="w-3.5 h-3.5 text-[#006b57]" />
            <span>Your financial data is encrypted and strictly confidential.</span>
          </div>
        </div>
      )}

      {/* View State 2: Stitch "Review Your Profile" Desktop / Visualized Canvas */}
      {viewState === 'review' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[#006b57]">
              Review Your Profile
            </h1>
            <p className="text-sm text-[#565e74]">
              Please review your answers carefully before calculating your final risk profile. A precise assessment ensures tailored investment strategies.
            </p>
          </header>

          <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
            {/* Category 1: Demographics */}
            <section className="space-y-4">
              <h2 className="text-base font-heading font-bold text-[#191c1e] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#006b57]" />
                <span>Demographics & Employment</span>
              </h2>

              <div className="divide-y divide-[#E2E8F0]">
                <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[#565e74] font-heading font-semibold">Primary Age</span>
                    <span className="col-span-2 font-mono font-bold text-[#191c1e]">{formData.age} Years</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(0)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[#565e74] font-heading font-semibold">Occupation</span>
                    <span className="col-span-2 font-heading font-bold text-[#191c1e]">{formData.workType}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(1)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[#565e74] font-heading font-semibold">Income Stability</span>
                    <span className="col-span-2 font-heading font-bold text-[#191c1e]">{formData.incomeStability}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(10)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Category 2: Income & Liquidity (with Visualized Donut) */}
            <section className="space-y-4">
              <h2 className="text-base font-heading font-bold text-[#191c1e] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[#006b57]" />
                <span>Income, Liquidity & Debt</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 divide-y divide-[#E2E8F0]">
                  <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                    <div className="grid grid-cols-3 flex-1 text-xs">
                      <span className="text-[#565e74] font-heading font-semibold">Monthly Income</span>
                      <span className="col-span-2 font-mono font-bold text-[#191c1e]">₹{formData.monthlyIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => handleJumpToQuestion(2)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                    <div className="grid grid-cols-3 flex-1 text-xs">
                      <span className="text-[#565e74] font-heading font-semibold">Total Savings</span>
                      <span className="col-span-2 font-mono font-bold text-[#191c1e]">₹{formData.totalSavingsInvestments.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => handleJumpToQuestion(3)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                    <div className="grid grid-cols-3 flex-1 text-xs">
                      <span className="text-[#565e74] font-heading font-semibold">Emergency Fund</span>
                      <span className="col-span-2 font-mono font-bold text-[#191c1e]">₹{formData.emergencySavings.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => handleJumpToQuestion(5)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Category 3: Experience & Strategy */}
            <section className="space-y-4">
              <h2 className="text-base font-heading font-bold text-[#191c1e] border-b border-[#E2E8F0] pb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[#006b57]" />
                <span>Investment Experience & Behavioral Composure</span>
              </h2>

              <div className="divide-y divide-[#E2E8F0]">
                <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[#565e74] font-heading font-semibold">Experience</span>
                    <span className="col-span-2 font-heading font-bold text-[#191c1e]">{formData.investmentExperience}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(8)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[#565e74] font-heading font-semibold">Holdings</span>
                    <span className="col-span-2 font-heading text-[#191c1e]">{formData.currentInvestments.join(', ')}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(9)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[#f7f9fb] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[#565e74] font-heading font-semibold">20% Crash Reaction</span>
                    <span className="col-span-2 font-heading font-bold text-[#006b57]">{formData.crashReaction20}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(12)} className="text-xs text-[#006b57] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </section>
          </div>

          {/* Calculate Profile CTA */}
          <div className="flex flex-col items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={handleCalculateProfile}
              className="btn-primary w-full py-3.5 px-6 font-heading font-bold text-sm flex items-center justify-center gap-2 shadow-sm"
            >
              <Sparkles className="w-4 h-4" />
              <span>Calculate My Risk Profile</span>
            </button>
            <button 
              onClick={() => handleJumpToQuestion(0)}
              className="text-xs text-[#565e74] hover:text-[#006b57] font-heading font-semibold"
            >
              Retake questionnaire from beginning
            </button>
          </div>
        </div>
      )}

      {/* View State 3: Visualized Diagnosis Screen */}
      {viewState === 'result' && !result && (
        <div className="max-w-2xl mx-auto text-center space-y-4 py-16">
          <Shield className="w-12 h-12 text-[#006b57] mx-auto" />
          <h3 className="text-xl font-heading font-extrabold text-[#191c1e]">
            No Risk Profile Yet
          </h3>
          <p className="text-sm text-[#565e74]">
            Complete the 20-question assessment to generate your personalized investor diagnosis.
          </p>
          <button
            onClick={() => { setCurrentQuestionIndex(0); setViewState('questionnaire'); }}
            className="btn-primary text-xs py-2.5 px-6 mx-auto"
          >
            Start Assessment
          </button>
        </div>
      )}
      {viewState === 'result' && result && (
        <div className="space-y-8">
          <div className="p-8 rounded-2xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
              <div>
                <span className="text-xs font-mono text-[#006b57] uppercase font-bold tracking-wider">
                  Quantitative Risk Diagnosis
                </span>
                <h4 className="text-2xl sm:text-3xl font-heading font-extrabold text-[#191c1e] mt-1">
                  {result.persona}
                </h4>
                <p className="text-xs text-[#565e74] mt-1">
                  Horizon: {result.investmentHorizonYears}+ Years • Monthly Capacity: ₹{result.monthlyCapacity.toLocaleString('en-IN')}
                </p>
              </div>

              <button
                onClick={() => setViewState('review')}
                className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Review / Edit Answers</span>
              </button>
            </div>

            {/* Score Breakdown (Capacity vs Tolerance) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                    Objective Risk Capacity
                  </span>
                  <span className="text-xl font-heading font-extrabold text-[#006b57] font-mono">
                    {result.riskCapacityScore} / 100
                  </span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#006b57] h-full rounded-full" style={{ width: `${result.riskCapacityScore}%` }} />
                </div>
                <p className="text-[11px] text-[#565e74]">
                  Driven by {result.emergencyRunwayMonths} months emergency runway, {result.savingsRatePct}% savings rate, and {result.debtToIncomeRatio}% DTI ratio.
                </p>
              </div>

              <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-3">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                    Psychological Risk Tolerance
                  </span>
                  <span className="text-xl font-heading font-extrabold text-[#00b090] font-mono">
                    {result.riskToleranceScore} / 100
                  </span>
                </div>
                <div className="w-full bg-[#E2E8F0] h-2 rounded-full overflow-hidden">
                  <div className="bg-[#00b090] h-full rounded-full" style={{ width: `${result.riskToleranceScore}%` }} />
                </div>
                <p className="text-[11px] text-[#565e74]">
                  Based on your reaction to a 20% crash ("{formData.crashReaction20}") and {formData.volatilityComfort.toLowerCase()} composure.
                </p>
              </div>
            </div>

            {/* Strategic Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="text-[11px] font-heading font-bold text-[#565e74] uppercase block">Suggested Approach</span>
                <span className="text-sm font-heading font-bold text-[#191c1e] mt-1 block">{result.suggestedApproach}</span>
              </div>
              <div className="p-4 rounded-lg bg-white border border-[#E2E8F0]">
                <span className="text-[11px] font-heading font-bold text-[#565e74] uppercase block">Main Consideration</span>
                <span className="text-xs text-[#565e74] mt-1 block leading-relaxed">{result.mainConsideration}</span>
              </div>
            </div>

            {/* Target Asset Allocation Matrix */}
            <div className="space-y-3 pt-4 border-t border-[#E2E8F0]">
              <h5 className="text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                Recommended Target Asset Allocation
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Equity (Index/Flexi)</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {result.recommendedMix.equity}%
                  </span>
                  <span className="text-[10px] text-[#565e74] mt-1 block">Long-term wealth driver</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Debt & EPFO</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {result.recommendedMix.debt}%
                  </span>
                  <span className="text-[10px] text-[#565e74] mt-1 block">Capital preservation</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Gold / SGB</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {result.recommendedMix.gold}%
                  </span>
                  <span className="text-[10px] text-[#565e74] mt-1 block">Inflation & currency hedge</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Liquid Cash</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {result.recommendedMix.liquid}%
                  </span>
                  <span className="text-[10px] text-[#565e74] mt-1 block">Emergency runway</span>
                </div>
              </div>
            </div>

            {/* Behavioral Caution */}
            <div className="p-4 rounded-xl bg-[#ffdad6] border-none flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#410002] shrink-0 mt-0.5" />
              <div className="text-xs text-[#410002]">
                <strong className="font-heading text-[#ba1a1a] block mb-0.5">Behavioral Caution</strong>
                {result.behavioralWarning}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
