import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  ShieldAlert,
  CheckCircle2,
  Scale,
  Sparkles,
  Loader2,
  Flame,
  ArrowRight,
  AlertTriangle,
  X,
} from 'lucide-react';
import { mockHypeClaims } from '../../data/hypeClaimsReference';
import { HypeClaim, AuditResult } from '../../types';

// ─── Loading Stage Messages (cycling during API call) ───────────────────────
const LOADING_STAGES = [
  'Initializing SEBI & RBI regulatory audit layer...',
  'Scanning historical F&O data & retail performance metrics...',
  'Correlating with Metropolitan House Price Index (HPI) registries...',
  'Calculating time decay, transaction costs, and tax drag...',
  'Formulating evidence-based capital reallocation strategy...',
];

// ─── Toast Component ─────────────────────────────────────────────────────────
interface ToastProps {
  message: string;
  onClose: () => void;
}

const ErrorToast: React.FC<ToastProps> = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-start gap-3 p-4 rounded-xl bg-[#ba1a1a] text-white shadow-xl max-w-sm animate-[fadeIn_0.25s_ease-out]">
    <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
    <p className="text-xs font-medium leading-relaxed flex-1">{message}</p>
    <button onClick={onClose} className="hover:opacity-70 transition-opacity shrink-0">
      <X className="w-4 h-4" />
    </button>
  </div>
);

// ─── Card Skeleton ────────────────────────────────────────────────────────────
const CardSkeleton: React.FC<{ accentColor: string }> = ({ accentColor }) => (
  <div
    className={`p-5 rounded-xl bg-[#f8fafc] border border-[#E2E8F0] border-l-4 ${accentColor} flex flex-col space-y-3`}
  >
    <div className="h-3 w-2/3 bg-[#E2E8F0] rounded-full animate-pulse" />
    <div className="space-y-2">
      <div className="h-2.5 w-full bg-[#E2E8F0] rounded-full animate-pulse" />
      <div className="h-2.5 w-5/6 bg-[#E2E8F0] rounded-full animate-pulse" />
      <div className="h-2.5 w-4/5 bg-[#E2E8F0] rounded-full animate-pulse" />
      <div className="h-2.5 w-3/4 bg-[#E2E8F0] rounded-full animate-pulse" />
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
export const HypeDetectorModule: React.FC = () => {
  const [currentClaim, setCurrentClaim] = useState(mockHypeClaims[0].quote);
  const [activePreset, setActivePreset] = useState<HypeClaim>(mockHypeClaims[0]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [loadingStage, setLoadingStage] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [auditedClaim, setAuditedClaim] = useState<string>('');

  // Cycle loading stage messages while auditing
  useEffect(() => {
    let interval: any;
    if (isAuditing) {
      interval = setInterval(() => {
        setLoadingStage((prev) => (prev < LOADING_STAGES.length - 1 ? prev + 1 : prev));
      }, 600);
    } else {
      setLoadingStage(0);
    }
    return () => clearInterval(interval);
  }, [isAuditing]);

  const handleTestPreset = (claim: HypeClaim) => {
    setActivePreset(claim);
    setCurrentClaim(claim.quote);
    setAuditResult(null); // clear previous result
  };

  const handleAuditClaim = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = currentClaim.trim();
      if (!trimmed) return;

      setIsAuditing(true);
      setAuditResult(null);
      setErrorMessage(null);
      setAuditedClaim(trimmed);

      try {
        const response = await fetch('/api/audit-claim', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ claim: trimmed }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || `Server error: ${response.status}`);
        }

        setAuditResult(data as AuditResult);
      } catch (err: any) {
        const msg =
          err.message === 'Failed to fetch'
            ? 'Cannot connect to the FinSight API server. Make sure it is running (npm run dev).'
            : err.message || 'An unexpected error occurred. Please try again.';
        setErrorMessage(msg);
      } finally {
        setIsAuditing(false);
      }
    },
    [currentClaim]
  );

  const isHighRisk =
    auditResult?.risk_assessment_badge?.toLowerCase().includes('high risk') ||
    auditResult?.risk_assessment_badge?.toLowerCase().includes('flawed');

  return (
    <div className="space-y-8 pb-12">
      {/* Error Toast */}
      {errorMessage && (
        <ErrorToast message={errorMessage} onClose={() => setErrorMessage(null)} />
      )}

      {/* ── Auditor Header ── */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <span className="text-xs font-mono text-[#006b57] font-bold uppercase tracking-widest block">
          REGULATORY FACT VERIFICATION LAYER
        </span>
        <h3 className="text-2xl font-heading font-extrabold text-[#191c1e] mt-1.5">
          Hype-to-Data Detector (SEBI & RBI Ground-Truth Auditor)
        </h3>
        <p className="text-xs text-[#565e74] mt-1 max-w-3xl leading-relaxed">
          Paste any viral social media claim, telegram tip, or finfluencer pitch. Our AI auditor
          evaluates it against official SEBI & RBI regulatory datasets in real-time.
        </p>
      </div>

      {/* ── Input & Quick Selector Card ── */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-5">
        <form onSubmit={handleAuditClaim} className="space-y-4">
          <label className="block text-xs font-heading font-bold text-[#191c1e] uppercase tracking-wider">
            Paste Claim or Investment Pitch to Fact-Check:
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#565e74]" />
              <input
                type="text"
                value={currentClaim}
                onChange={(e) => setCurrentClaim(e.target.value)}
                placeholder="e.g. 'Options trading with ₹10k capital gives 20% weekly returns...'"
                className="w-full pl-10 pr-4 py-3 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs text-[#191c1e] placeholder-[#565e74]/50 focus:border-[#00b090] focus:ring-1 focus:ring-[#00b090] outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={isAuditing || !currentClaim.trim()}
              className="btn-primary text-xs py-3 px-6 self-start sm:self-auto shrink-0 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAuditing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Auditing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Audit Claim</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Quick Selector Pills */}
        <div className="pt-2 border-t border-[#f2f4f6]">
          <span className="text-[10px] font-heading font-bold text-[#565e74] uppercase tracking-wider block mb-3">
            OR SELECT A VIRAL FINANCIAL CLAIM TO TEST:
          </span>
          <div className="flex flex-wrap gap-2.5">
            {mockHypeClaims.map((claim) => {
              const isActive = activePreset.id === claim.id;
              return (
                <button
                  key={claim.id}
                  type="button"
                  onClick={() => handleTestPreset(claim)}
                  className={`text-xs px-4 py-2 rounded-lg border font-medium transition-all duration-150 text-left ${isActive
                      ? 'bg-[#006b57] text-white border-[#006b57] shadow-sm font-semibold'
                      : 'bg-white text-[#565e74] border-[#E2E8F0] hover:bg-[#f7f9fb] hover:border-[#bbcac3]'
                    }`}
                >
                  {claim.title}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Loading State (real API call) ── */}
      {isAuditing && (
        <div className="p-8 rounded-xl bg-white border border-[#E2E8F0] shadow-sm flex flex-col items-center justify-center space-y-5 py-14">
          <div className="relative">
            <Loader2 className="w-12 h-12 text-[#00b090] animate-spin" />
            <Flame className="w-5 h-5 text-[#ba1a1a] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center space-y-1.5 max-w-md">
            <h4 className="text-sm font-heading font-bold text-[#191c1e] uppercase tracking-wide">
              AI Regulatory Auditor Running
            </h4>
            <p className="text-xs text-[#565e74] min-h-[1.5rem] font-medium italic transition-all">
              {LOADING_STAGES[loadingStage]}
            </p>
          </div>
          <div className="w-64 bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#00b090] h-full rounded-full transition-all duration-500"
              style={{ width: `${((loadingStage + 1) / LOADING_STAGES.length) * 100}%` }}
            />
          </div>

          {/* Skeleton Preview while waiting */}
          <div className="w-full mt-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CardSkeleton accentColor="border-l-[#ba1a1a]" />
            <CardSkeleton accentColor="border-l-[#00b090]" />
            <CardSkeleton accentColor="border-l-[#006b57]" />
          </div>
        </div>
      )}

      {/* ── Empty State Prompt ── */}
      {!auditResult && !isAuditing && (
        <div className="p-10 rounded-xl bg-white border border-[#E2E8F0] shadow-sm text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-[#006b57]/10 flex items-center justify-center text-[#006b57]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div className="max-w-md space-y-1">
            <h4 className="text-sm font-heading font-bold text-[#191c1e]">
              Ready for Real-Time Regulatory Audit
            </h4>
            <p className="text-xs text-[#565e74] leading-relaxed">
              Select a viral claim from the presets above or type your own financial pitch, then click{' '}
              <strong className="text-[#006b57]">Audit Claim</strong> to generate a live SEBI &amp; RBI compliance audit powered by Gemini.
            </p>
          </div>
        </div>
      )}

      {/* ── Live AI Results Section ── */}
      {auditResult && !isAuditing && (
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
          {/* Header Row: Claim + Verdict Badge */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 border-b border-[#f2f4f6] pb-5">
            <div className="flex-1">
              <span className="text-[10px] font-mono text-[#006b57] font-bold uppercase tracking-wider block">
                {auditResult.source_type ? `SOURCE: ${auditResult.source_type.toUpperCase()}` : 'REGULATORY AUDIT RESULT'}
              </span>
              <h4 className="text-base font-heading font-extrabold text-[#191c1e] mt-1 italic leading-snug">
                "{auditedClaim}"
              </h4>
            </div>
            <span
              className={`px-4 py-1.5 rounded-full text-xs font-heading font-bold self-start shrink-0 ${isHighRisk
                  ? 'bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30'
                  : 'bg-amber-50 text-amber-800 border border-amber-500/20'
                }`}
            >
              {auditResult.risk_assessment_badge}
            </span>
          </div>

          {/* 3-Column Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Card 1 — Official Regulatory Ground Truth (Red accent) */}
            <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#E2E8F0] border-l-4 border-l-[#ba1a1a] flex flex-col space-y-3 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#ba1a1a]">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span className="uppercase tracking-wider">
                  {auditResult.regulatory_ground_truth?.title || 'SEBI / RBI Regulatory Truth'}
                </span>
              </div>
              <p className="text-xs text-[#191c1e] leading-relaxed font-medium">
                {auditResult.regulatory_ground_truth?.description}
              </p>
            </div>

            {/* Card 2 — Mathematical Reality & Friction (Teal accent) */}
            <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#E2E8F0] border-l-4 border-l-[#00b090] flex flex-col space-y-3 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#006b57]">
                <Scale className="w-4 h-4 shrink-0 text-[#00b090]" />
                <span className="uppercase tracking-wider">
                  {auditResult.mathematical_reality?.title || 'Mathematical Reality'}
                </span>
              </div>
              <p className="text-xs text-[#565e74] leading-relaxed font-medium">
                {auditResult.mathematical_reality?.description}
              </p>
            </div>

            {/* Card 3 — FinSight Evidence-Based Strategy (Green accent) */}
            <div className="p-5 rounded-xl bg-[#f8fafc] border border-[#E2E8F0] border-l-4 border-l-[#006b57] flex flex-col space-y-3 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#006b57]">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#006b57]" />
                <span className="uppercase tracking-wider">
                  {auditResult.evidence_based_strategy?.title || 'Evidence-Based Strategy'}
                </span>
              </div>
              <p className="text-xs text-[#191c1e] leading-relaxed font-medium">
                {auditResult.evidence_based_strategy?.description}
              </p>
            </div>

          </div>

          {/* Action Callout */}
          <div className="mt-2 p-4 rounded-lg bg-[#00b090]/5 border border-[#00b090]/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <span className="text-xs text-[#003b2f] font-medium">
              Want to see how regular index SIP investments compare to speculative trades for your specific goals?
            </span>
            <button
              type="button"
              className="text-xs text-[#006b57] font-bold flex items-center gap-1 hover:underline shrink-0"
              onClick={() => { window.location.hash = '#goals'; }}
            >
              <span>Go to Goal Planning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
