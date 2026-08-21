import React, { useState } from 'react';
import { 
  Shield, 
  ArrowRight, 
  RotateCcw, 
  AlertTriangle
} from 'lucide-react';
import { mockRiskQuestions, mockRiskResult } from '../../mock/riskProfileData';

export const RiskProfilingModule: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);

  const questions = mockRiskQuestions;
  const persona = mockRiskResult;

  const handleSelectOption = (questionId: number, score: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: score });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setCurrentStep(0);
    setIsCompleted(false);
  };

  const activeQuestion = questions[currentStep];
  const hasAnsweredCurrent = selectedAnswers[activeQuestion?.id] !== undefined;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <span className="text-xs font-mono text-[#006b57] font-semibold uppercase tracking-wider">
            Behavioral Risk Engineering
          </span>
          <h3 className="text-xl font-heading font-extrabold text-[#191c1e] mt-0.5">
            5-Pillar Investor Persona Assessment
          </h3>
          <p className="text-xs text-[#565e74] mt-0.5">
            Designed for Indian market dynamics to evaluate real loss reactions, job security, and emergency cushions.
          </p>
        </div>

        {isCompleted && (
          <button
            onClick={handleReset}
            className="btn-secondary text-xs py-2 px-4 flex items-center gap-1.5 self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Retake Assessment</span>
          </button>
        )}
      </div>

      {!isCompleted ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm space-y-6 max-w-3xl mx-auto">
          <div className="flex justify-between items-center border-b border-[#E2E8F0] pb-4">
            <span className="text-xs font-heading font-bold text-[#006b57] uppercase tracking-wider">
              Question {currentStep + 1} of {questions.length}
            </span>
            <div className="flex gap-1.5">
              {questions.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-6 rounded-full transition-all ${
                    idx === currentStep
                      ? 'bg-[#00b090]'
                      : idx < currentStep
                      ? 'bg-[#006b57]'
                      : 'bg-[#f2f4f6]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-lg font-heading font-bold text-[#191c1e] leading-snug">
              {activeQuestion.question}
            </h4>
            <p className="text-xs text-[#565e74]">{activeQuestion.context}</p>

            <div className="space-y-3 pt-2">
              {activeQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswers[activeQuestion.id] === opt.score;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(activeQuestion.id, opt.score)}
                    className={`w-full p-4 rounded-xl text-left border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'border-[#00b090] bg-[#00b090]/10 text-[#191c1e]'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#f7f9fb] text-[#565e74]'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-heading font-bold block text-[#191c1e]">{opt.label}</span>
                      <span className="text-[11px] text-[#565e74] block mt-0.5">{opt.description}</span>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border shrink-0 flex items-center justify-center ${
                        isSelected ? 'border-[#00b090] bg-[#00b090]' : 'border-[#E2E8F0]'
                      }`}
                    >
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-[#E2E8F0] flex justify-end">
            <button
              onClick={handleNext}
              disabled={!hasAnsweredCurrent}
              className="btn-primary text-xs py-2.5 px-6 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
            >
              <span>{currentStep === questions.length - 1 ? 'Generate Persona Report' : 'Next Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E2E8F0] pb-6">
              <div>
                <span className="text-xs font-mono text-[#006b57] uppercase font-bold tracking-wider">
                  Quantitative Diagnosis
                </span>
                <h4 className="text-2xl font-heading font-extrabold text-[#191c1e] mt-1">
                  Investor Persona: {persona.persona}
                </h4>
                <p className="text-xs text-[#565e74] mt-1">
                  Score: {persona.score}/100 • Key Trait: {persona.keyTrait}
                </p>
              </div>

              <div className="px-4 py-2 rounded-xl bg-[#00b090]/10 border border-[#00b090]/30 text-[#006b57] text-xs font-heading font-bold self-start sm:self-auto">
                Recommended Allocation Active
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#191c1e] leading-relaxed">
              {persona.description}
            </p>

            <div className="space-y-4 pt-4 border-t border-[#E2E8F0]">
              <h5 className="text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
                Target Asset Allocation Model
              </h5>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Equity (Index/Flexi)</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {persona.recommendedMix.equity}%
                  </span>
                  <span className="text-[11px] text-[#565e74] mt-1 block">Long-term wealth driver</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Debt & EPFO</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {persona.recommendedMix.debt}%
                  </span>
                  <span className="text-[11px] text-[#565e74] mt-1 block">Capital preservation</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Gold / SGB</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {persona.recommendedMix.gold}%
                  </span>
                  <span className="text-[11px] text-[#565e74] mt-1 block">Currency & geopolitical hedge</span>
                </div>

                <div className="p-4 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0]">
                  <span className="text-xs font-heading font-semibold text-[#565e74] block">Liquid Cash</span>
                  <span className="text-2xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                    {persona.recommendedMix.liquid}%
                  </span>
                  <span className="text-[11px] text-[#565e74] mt-1 block">Emergency runway</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#ffdad6]/20 border border-[#ba1a1a]/30 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#ba1a1a] shrink-0 mt-0.5" />
              <div className="text-xs text-[#191c1e]">
                <strong className="font-heading text-[#ba1a1a] block mb-0.5">Behavioral Risk Warning</strong>
                {persona.behavioralWarning}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
