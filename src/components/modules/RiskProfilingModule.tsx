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
          <div className="bg-[var(--app-surface)] w-full rounded-2xl border border-[var(--app-border)] shadow-sm overflow-hidden flex flex-col">
            {/* Progress Header */}
            <div className="p-6 border-b border-[var(--app-border)] space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider">
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="font-heading font-bold text-[var(--primary-dim)]">
                  {Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}% Completed
                </span>
              </div>
              <div className="w-full bg-[var(--app-surface-alt)] h-1.5 rounded-full overflow-hidden">
                <div 
                  className="bg-[var(--primary)] h-full rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Body */}
            <div className="p-8 sm:p-10 space-y-6">
              {/* Q1: Age */}
              {currentQuestionIndex === 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    What is your current age?
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Your age helps establish your natural investment compounding timeline.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[var(--app-border)] rounded-xl bg-[var(--app-surface-alt)] max-w-sm focus-within:border-[var(--primary)] focus-within:bg-[var(--app-surface)]">
                      <input
                        type="number"
                        min="18"
                        max="100"
                        value={formData.age}
                        onChange={(e) => handleUpdate('age', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[var(--app-text)]"
                        placeholder="25"
                      />
                      <span className="text-xs text-[var(--app-text-muted)] font-heading font-semibold">Years</span>
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[22, 28, 35, 45].map((a) => (
                        <button
                          key={a}
                          type="button"
                          onClick={() => handleUpdate('age', a)}
                          className="px-3 py-1 rounded bg-[var(--app-surface-alt)] hover:bg-[#e6e8ea] text-xs font-heading font-semibold text-[var(--app-text-muted)]"
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
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    What best describes your current occupation?
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
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
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    What is your approximate monthly take-home income?
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Baseline take-home earnings credited each month.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[var(--app-border)] rounded-xl bg-[var(--app-surface-alt)] max-w-sm focus-within:border-[var(--primary)] focus-within:bg-[var(--app-surface)]">
                      <span className="text-lg font-mono font-bold text-[var(--app-text-muted)] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="5000"
                        value={formData.monthlyIncome}
                        onChange={(e) => handleUpdate('monthlyIncome', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[var(--app-text)]"
                        placeholder="1,00,000"
                      />
                    </div>
                    <div className="flex gap-2 mt-3">
                      {[50000, 100000, 150000, 250000].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => handleUpdate('monthlyIncome', amt)}
                          className="px-3 py-1 rounded bg-[var(--app-surface-alt)] hover:bg-[#e6e8ea] text-xs font-heading font-semibold text-[var(--app-text-muted)]"
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
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    How much do you currently hold in savings and investments?
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Total cumulative savings across bank accounts, mutual funds, stocks, and FDs.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[var(--app-border)] rounded-xl bg-[var(--app-surface-alt)] max-w-sm focus-within:border-[var(--primary)] focus-within:bg-[var(--app-surface)]">
                      <span className="text-lg font-mono font-bold text-[var(--app-text-muted)] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50000"
                        value={formData.totalSavingsInvestments}
                        onChange={(e) => handleUpdate('totalSavingsInvestments', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[var(--app-text)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q5: Monthly Investment Capacity */}
              {currentQuestionIndex === 4 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    How much can you comfortably invest every month?
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Surplus amount designated for SIPs and long-term asset building.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[var(--app-border)] rounded-xl bg-[var(--app-surface-alt)] max-w-sm focus-within:border-[var(--primary)] focus-within:bg-[var(--app-surface)]">
                      <span className="text-lg font-mono font-bold text-[var(--app-text-muted)] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="2000"
                        value={formData.monthlyInvestmentCapacity}
                        onChange={(e) => handleUpdate('monthlyInvestmentCapacity', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[var(--app-text)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q6: Emergency Savings */}
              {currentQuestionIndex === 5 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    How much emergency savings do you currently have?
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">
                    Liquid funds or sweep-in FDs set aside strictly for contingencies.
                  </p>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[var(--app-border)] rounded-xl bg-[var(--app-surface-alt)] max-w-sm focus-within:border-[var(--primary)] focus-within:bg-[var(--app-surface)]">
                      <span className="text-lg font-mono font-bold text-[var(--app-text-muted)] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={formData.emergencySavings}
                        onChange={(e) => handleUpdate('emergencySavings', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[var(--app-text)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q7: Investment Horizon */}
              {currentQuestionIndex === 6 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{h}</span>
                        {formData.timeHorizon === h && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q8: Primary Goal */}
              {currentQuestionIndex === 7 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
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
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{exp}</span>
                        {formData.investmentExperience === exp && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q10: Current Holdings */}
              {currentQuestionIndex === 9 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    Which investments do you currently hold?
                  </h2>
                  <p className="text-xs text-[var(--app-text-muted)]">Select all that apply.</p>
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
                              ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                              : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                          }`}
                        >
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[var(--primary)]" />}
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
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{s}</span>
                        {formData.incomeStability === s && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q12: Debt & Liabilities */}
              {currentQuestionIndex === 11 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    Do you currently have any loans or significant debt?
                  </h2>
                  <div className="flex gap-4 pt-2">
                    <button
                      type="button"
                      onClick={() => handleUpdate('hasDebt', false)}
                      className={`flex-1 p-4 rounded-xl border text-center text-xs font-heading font-bold ${
                        !formData.hasDebt
                          ? 'bg-[var(--primary-dim)] text-white border-[var(--primary-dim)]'
                          : 'bg-[var(--app-surface-alt)] text-[var(--app-text-muted)] border-[var(--app-border)]'
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
                          : 'bg-[var(--app-surface-alt)] text-[var(--app-text-muted)] border-[var(--app-border)]'
                      }`}
                    >
                      Yes, Have Loans / EMI
                    </button>
                  </div>

                  {formData.hasDebt && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--app-border)]">
                      <div>
                        <label className="block text-[11px] font-heading font-bold text-[var(--app-text-muted)] mb-1">
                          Outstanding Debt (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.outstandingDebt}
                          onChange={(e) => handleUpdate('outstandingDebt', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-lg text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-heading font-bold text-[var(--app-text-muted)] mb-1">
                          Monthly EMI (₹)
                        </label>
                        <input
                          type="number"
                          value={formData.monthlyEmi}
                          onChange={(e) => handleUpdate('monthlyEmi', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-[var(--app-surface-alt)] border border-[var(--app-border)] rounded-lg text-xs font-mono"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Q13: Crash Reaction */}
              {currentQuestionIndex === 12 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.crashReaction20 === opt && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q14: Outcome Preference */}
              {currentQuestionIndex === 13 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.outcomePreference === opt && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q15: Protecting Initial Investment */}
              {currentQuestionIndex === 14 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.lossProtectionPriority === opt && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q16: Volatility Comfort */}
              {currentQuestionIndex === 15 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.volatilityComfort === opt && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q17: Current Investment % */}
              {currentQuestionIndex === 16 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    What % of monthly income are you currently investing?
                  </h2>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[var(--app-border)] rounded-xl bg-[var(--app-surface-alt)] max-w-sm focus-within:border-[var(--primary)] focus-within:bg-[var(--app-surface)]">
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={formData.currentInvestmentPct}
                        onChange={(e) => handleUpdate('currentInvestmentPct', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[var(--app-text)]"
                      />
                      <span className="text-xs text-[var(--app-text-muted)] font-heading font-bold">%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Q18: Emergency Withdrawal Need */}
              {currentQuestionIndex === 17 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
                    How much would you need to withdraw from investments in an emergency?
                  </h2>
                  <div className="pt-2">
                    <div className="flex items-center h-14 px-4 border border-[var(--app-border)] rounded-xl bg-[var(--app-surface-alt)] max-w-sm focus-within:border-[var(--primary)] focus-within:bg-[var(--app-surface)]">
                      <span className="text-lg font-mono font-bold text-[var(--app-text-muted)] mr-2">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="10000"
                        value={formData.emergencyWithdrawalNeed}
                        onChange={(e) => handleUpdate('emergencyWithdrawalNeed', Number(e.target.value))}
                        className="w-full bg-transparent border-none outline-none font-mono font-bold text-lg text-[var(--app-text)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Q19: 3-Year Income Outlook */}
              {currentQuestionIndex === 18 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.incomeChange3Years === opt && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Q20: Decision Style */}
              {currentQuestionIndex === 19 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-heading font-extrabold text-[var(--app-text)]">
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
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary-dim)] font-bold'
                            : 'border-[var(--app-border)] hover:bg-[var(--app-surface-alt)] text-[var(--app-text-muted)]'
                        }`}
                      >
                        <span>{opt}</span>
                        {formData.decisionStyle === opt && <CheckCircle2 className="w-4 h-4 text-[var(--primary)]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Footer */}
            <div className="p-6 bg-[var(--app-surface-alt)] border-t border-[var(--app-border)] flex justify-between items-center">
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

          <div className="flex items-center gap-2 text-[var(--app-text-muted)] text-xs">
            <Lock className="w-3.5 h-3.5 text-[var(--primary-dim)]" />
            <span>Your financial data is encrypted and strictly confidential.</span>
          </div>
        </div>
      )}

      {/* View State 2: Stitch "Review Your Profile" Desktop / Visualized Canvas */}
      {viewState === 'review' && (
        <div className="max-w-4xl mx-auto space-y-8">
          <header className="text-center max-w-2xl mx-auto space-y-2">
            <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-[var(--primary-dim)]">
              Review Your Profile
            </h1>
            <p className="text-sm text-[var(--app-text-muted)]">
              Please review your answers carefully before calculating your final risk profile. A precise assessment ensures tailored investment strategies.
            </p>
          </header>

          <div className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl p-6 sm:p-8 shadow-sm space-y-8">
            {/* Category 1: Demographics */}
            <section className="space-y-4">
              <h2 className="text-base font-heading font-bold text-[var(--app-text)] border-b border-[var(--app-border)] pb-2 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[var(--primary-dim)]" />
                <span>Demographics & Employment</span>
              </h2>

              <div className="divide-y divide-[#E2E8F0]">
                <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[var(--app-text-muted)] font-heading font-semibold">Primary Age</span>
                    <span className="col-span-2 font-mono font-bold text-[var(--app-text)]">{formData.age} Years</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(0)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[var(--app-text-muted)] font-heading font-semibold">Occupation</span>
                    <span className="col-span-2 font-heading font-bold text-[var(--app-text)]">{formData.workType}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(1)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[var(--app-text-muted)] font-heading font-semibold">Income Stability</span>
                    <span className="col-span-2 font-heading font-bold text-[var(--app-text)]">{formData.incomeStability}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(10)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Category 2: Income & Liquidity (with Visualized Donut) */}
            <section className="space-y-4">
              <h2 className="text-base font-heading font-bold text-[var(--app-text)] border-b border-[var(--app-border)] pb-2 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-[var(--primary-dim)]" />
                <span>Income, Liquidity & Debt</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div className="md:col-span-2 divide-y divide-[#E2E8F0]">
                  <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                    <div className="grid grid-cols-3 flex-1 text-xs">
                      <span className="text-[var(--app-text-muted)] font-heading font-semibold">Monthly Income</span>
                      <span className="col-span-2 font-mono font-bold text-[var(--app-text)]">₹{formData.monthlyIncome.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => handleJumpToQuestion(2)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                    <div className="grid grid-cols-3 flex-1 text-xs">
                      <span className="text-[var(--app-text-muted)] font-heading font-semibold">Total Savings</span>
                      <span className="col-span-2 font-mono font-bold text-[var(--app-text)]">₹{formData.totalSavingsInvestments.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => handleJumpToQuestion(3)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>

                  <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                    <div className="grid grid-cols-3 flex-1 text-xs">
                      <span className="text-[var(--app-text-muted)] font-heading font-semibold">Emergency Fund</span>
                      <span className="col-span-2 font-mono font-bold text-[var(--app-text)]">₹{formData.emergencySavings.toLocaleString('en-IN')}</span>
                    </div>
                    <button onClick={() => handleJumpToQuestion(5)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Category 3: Experience & Strategy */}
            <section className="space-y-4">
              <h2 className="text-base font-heading font-bold text-[var(--app-text)] border-b border-[var(--app-border)] pb-2 flex items-center gap-2">
                <Compass className="w-4 h-4 text-[var(--primary-dim)]" />
                <span>Investment Experience & Behavioral Composure</span>
              </h2>

              <div className="divide-y divide-[#E2E8F0]">
                <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[var(--app-text-muted)] font-heading font-semibold">Experience</span>
                    <span className="col-span-2 font-heading font-bold text-[var(--app-text)]">{formData.investmentExperience}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(8)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[var(--app-text-muted)] font-heading font-semibold">Holdings</span>
                    <span className="col-span-2 font-heading text-[var(--app-text)]">{formData.currentInvestments.join(', ')}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(9)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>
                </div>

                <div className="py-3 flex items-center justify-between hover:bg-[var(--app-surface-alt)] px-2 rounded-lg transition-colors">
                  <div className="grid grid-cols-3 flex-1 text-xs">
                    <span className="text-[var(--app-text-muted)] font-heading font-semibold">20% Crash Reaction</span>
                    <span className="col-span-2 font-heading font-bold text-[var(--primary-dim)]">{formData.crashReaction20}</span>
                  </div>
                  <button onClick={() => handleJumpToQuestion(12)} className="text-xs text-[var(--primary-dim)] hover:underline flex items-center gap-1 font-heading font-bold">
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
              className="text-xs text-[var(--app-text-muted)] hover:text-[var(--primary-dim)] font-heading font-semibold"
            >
              Retake questionnaire from beginning
            </button>
          </div>
        </div>
      )}

      {/* View State 3: Visualized Diagnosis Screen */}
      {viewState === 'result' && !result && (
        <div className="max-w-2xl mx-auto text-center space-y-4 py-16">
          <Shield className="w-12 h-12 text-[var(--primary-dim)] mx-auto" />
          <h3 className="text-xl font-heading font-extrabold text-[var(--app-text)]">
            No Risk Profile Yet
          </h3>
          <p className="text-sm text-[var(--app-text-muted)]">
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
        <div className="w-full h-full bg-[#1E1E1E] text-white p-8 lg:p-12 pb-20 overflow-y-auto custom-scrollbar">
          <div className="max-w-[1100px] mx-auto">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
              <div>
                <h1 className="text-[32px] sm:text-[40px] font-bold text-white flex items-center gap-3 font-heading tracking-tight">
                  {result.persona.includes('-') || result.persona.includes('—') ? (
                    <>
                      {result.persona.split(/[-—]/)[0].trim()} <span className="text-[#555]">—</span> {result.persona.split(/[-—]/)[1].trim()}
                    </>
                  ) : (
                    result.persona
                  )}
                </h1>
                <p className="text-[#8A8F98] text-[14px] mt-2 font-body">
                  Targeting balanced expansion with defined drawdown limits. Horizon: {result.investmentHorizonYears}-{result.investmentHorizonYears + 2} Years.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <div className="bg-[#161616] border border-[#222] rounded-[10px] px-5 py-3 flex flex-col min-w-[110px]">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-1">Inv. Horizon</span>
                  <span className="text-[22px] text-white font-bold leading-none">{result.investmentHorizonYears * 12} <span className="text-[13px] text-[#71717A] font-normal">Mo</span></span>
                </div>
                <div className="bg-[#161616] border border-[#222] rounded-[10px] px-5 py-3 flex flex-col min-w-[110px]">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-1">Mo. Capacity</span>
                  <span className="text-[22px] text-white font-bold leading-none">₹{(result.monthlyCapacity / 1000).toFixed(1)}k</span>
                </div>
              </div>
            </div>

            {/* Diagnostics & Posture Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
              {/* 01. QUANTITATIVE DIAGNOSIS */}
              <div className="lg:col-span-3 bg-[#161616] border border-[#222] rounded-[16px] p-7 flex flex-col">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-[11px] text-[#71717A] uppercase tracking-wider font-bold">01. Quantitative Diagnosis</h3>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
                </div>
                
                <div className="space-y-8 flex-1 flex flex-col justify-center">
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <h4 className="text-[17px] font-bold text-white mb-0.5">Objective Risk Capacity</h4>
                        <p className="text-[13px] text-[#8A8F98]">Financial ability to sustain drawdowns</p>
                      </div>
                      <div className="text-[36px] font-bold text-[#00E599] leading-none tracking-tight">
                        {result.riskCapacityScore}<span className="text-[15px] text-[#A1A1AA] font-medium">/100</span>
                      </div>
                    </div>
                    <div className="h-[6px] w-full bg-[#262626] rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#00E599] rounded-full" style={{ width: `${result.riskCapacityScore}%` }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-end mb-3">
                      <div>
                        <h4 className="text-[17px] font-bold text-white mb-0.5">Psychological Tolerance</h4>
                        <p className="text-[13px] text-[#8A8F98]">Stated willingness to endure volatility</p>
                      </div>
                      <div className="text-[36px] font-bold text-[#00E599] leading-none tracking-tight">
                        {result.riskToleranceScore}<span className="text-[15px] text-[#A1A1AA] font-medium">/100</span>
                      </div>
                    </div>
                    <div className="h-[6px] w-full bg-[#262626] rounded-full overflow-hidden flex">
                      <div className="h-full bg-[#00E599] rounded-full" style={{ width: `${result.riskToleranceScore}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 02. STRATEGIC POSTURE */}
              <div className="lg:col-span-2 bg-[#161616] border border-[#222] rounded-[16px] p-7 flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-[11px] text-[#71717A] uppercase tracking-wider font-bold">02. Strategic Posture</h3>
                  <Compass className="w-4 h-4 text-[#71717A]" />
                </div>
                
                <div className="bg-[#111111] border border-[#1A1A1A] rounded-[12px] p-5 mb-6">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-2.5 block">Core Strategy</span>
                  <p className="text-[18px] font-bold text-white leading-snug">
                    {result.suggestedApproach}
                  </p>
                </div>
                
                <div className="mt-auto border-t border-[#222] pt-5">
                  <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-2.5 block">Primary Consideration</span>
                  <p className="text-[13px] text-[#8A8F98] leading-relaxed">
                    {result.mainConsideration}
                  </p>
                </div>
              </div>
            </div>

            {/* 03. TARGET ALLOCATION MATRIX */}
            <div>
              <div className="flex justify-between items-end border-b border-[#222] pb-3 mb-5">
                <h3 className="text-[11px] text-[#71717A] uppercase tracking-wider font-bold">03. Target Allocation Matrix</h3>
                <button
                  onClick={() => setViewState('review')}
                  className="text-[12px] text-[#71717A] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Edit Answers
                </button>
              </div>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#161616] border border-[#222] rounded-[12px] p-5 flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"></polyline><polyline points="16 7 22 7 22 13"></polyline></svg>
                    <span className="text-[26px] font-bold text-white leading-none">{result.recommendedMix.equity}%</span>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-white mb-3">Equity</h4>
                    <div className="h-1 w-full bg-[#262626] rounded-full overflow-hidden">
                      <div className="h-full bg-[#00E599]" style={{ width: `${result.recommendedMix.equity}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#161616] border border-[#222] rounded-[12px] p-5 flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="19" width="18" height="2" rx="1"></rect><rect x="3" y="3" width="18" height="4" rx="1"></rect><line x1="6" y1="7" x2="6" y2="19"></line><line x1="10" y1="7" x2="10" y2="19"></line><line x1="14" y1="7" x2="14" y2="19"></line><line x1="18" y1="7" x2="18" y2="19"></line></svg>
                    <span className="text-[26px] font-bold text-white leading-none">{result.recommendedMix.debt}%</span>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-white mb-3">Debt / Fixed</h4>
                    <div className="h-1 w-full bg-[#262626] rounded-full overflow-hidden">
                      <div className="h-full bg-[#6366F1]" style={{ width: `${result.recommendedMix.debt}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#161616] border border-[#222] rounded-[12px] p-5 flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                    <span className="text-[26px] font-bold text-white leading-none">{result.recommendedMix.gold}%</span>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-white mb-3">Gold / Alts</h4>
                    <div className="h-1 w-full bg-[#262626] rounded-full overflow-hidden">
                      <div className="h-full bg-[#F59E0B]" style={{ width: `${result.recommendedMix.gold}%` }}></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-[#161616] border border-[#222] rounded-[12px] p-5 flex flex-col justify-between min-h-[140px]">
                  <div className="flex justify-between items-start mb-4">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>
                    <span className="text-[26px] font-bold text-white leading-none">{result.recommendedMix.liquid}%</span>
                  </div>
                  <div>
                    <h4 className="text-[15px] font-bold text-white mb-3">Liquid Cash</h4>
                    <div className="h-1 w-full bg-[#262626] rounded-full overflow-hidden">
                      <div className="h-full bg-[#A1A1AA]" style={{ width: `${result.recommendedMix.liquid}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {result.behavioralWarning && (
              <div className="mt-8 bg-[#161616] border border-[#222] rounded-[12px] p-5 flex items-start gap-4">
                <AlertTriangle className="w-5 h-5 text-[#F59E0B] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-bold text-white mb-1">Behavioral Caution</h4>
                  <p className="text-[13px] text-[#A1A1AA]">{result.behavioralWarning}</p>
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}
    </div>
  );
};
