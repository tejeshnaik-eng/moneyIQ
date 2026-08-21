import React, { useState } from 'react';
import { 
  Flame, 
  Search, 
  ShieldAlert, 
  CheckCircle, 
  Scale
} from 'lucide-react';
import { mockHypeClaims } from '../../data/hypeClaimsReference';
import { HypeClaim } from '../../types';

export const HypeDetectorModule: React.FC = () => {
  const [claimInput, setClaimInput] = useState('');
  const [activeClaim, setActiveClaim] = useState<HypeClaim>(mockHypeClaims[0]);
  const [isAuditing, setIsAuditing] = useState(false);

  const handleTestPreset = (claim: HypeClaim) => {
    setActiveClaim(claim);
    setClaimInput(claim.quote);
  };

  const handleAuditCustomClaim = (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimInput.trim()) return;

    setIsAuditing(true);
    setTimeout(() => {
      const match = mockHypeClaims.find(c => claimInput.toLowerCase().includes('option') || claimInput.toLowerCase().includes('f&o'))
        || mockHypeClaims.find(c => claimInput.toLowerCase().includes('real estate') || claimInput.toLowerCase().includes('property'))
        || mockHypeClaims[0];

      setActiveClaim(match);
      setIsAuditing(false);
    }, 400);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="border-b border-[#E2E8F0] pb-4">
        <span className="text-xs font-mono text-[#006b57] font-semibold uppercase tracking-wider">
          Regulatory Fact Verification Layer
        </span>
        <h3 className="text-xl font-heading font-extrabold text-[#191c1e] mt-0.5">
          Hype-to-Data Detector (SEBI & RBI Ground-Truth Auditor)
        </h3>
        <p className="text-xs text-[#565e74] mt-0.5 max-w-2xl">
          Paste any viral social media claim, telegram tip, or finfluencer pitch to evaluate empirical probabilities against official regulatory datasets.
        </p>
      </div>

      {/* Input Box & Presets */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-4">
        <form onSubmit={handleAuditCustomClaim} className="space-y-3">
          <label className="block text-xs font-heading font-bold text-[#191c1e]">
            Paste Claim or Investment Pitch to Fact-Check:
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#565e74]" />
              <input
                type="text"
                value={claimInput}
                onChange={(e) => setClaimInput(e.target.value)}
                placeholder="e.g. 'Options trading with ₹10k capital gives 20% weekly returns...'"
                className="w-full pl-9 pr-3 py-2.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs text-[#191c1e] placeholder-[#565e74]/60 focus:border-[#00b090] outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={isAuditing}
              className="btn-primary text-xs py-2.5 px-5 self-start sm:self-auto shrink-0 shadow-sm"
            >
              <Flame className="w-4 h-4" />
              <span>{isAuditing ? 'Auditing against SEBI...' : 'Audit Claim'}</span>
            </button>
          </div>
        </form>

        {/* Preset Chips */}
        <div>
          <span className="text-[11px] font-heading font-bold text-[#565e74] uppercase tracking-wider block mb-2">
            Or select a viral financial claim to test:
          </span>
          <div className="flex flex-wrap gap-2">
            {mockHypeClaims.map((claim) => (
              <button
                key={claim.id}
                onClick={() => handleTestPreset(claim)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors text-left ${
                  activeClaim.id === claim.id
                    ? 'bg-[#006b57] text-white border-[#006b57] font-bold'
                    : 'bg-[#f7f9fb] text-[#565e74] border-[#E2E8F0] hover:bg-[#eceef0]'
                }`}
              >
                <span>{claim.title.split(' Guarantees')[0].split(' and Never')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Audit Verdict Card */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E2E8F0] pb-4">
          <div>
            <span className="text-xs font-mono text-[#565e74] uppercase tracking-wider">
              Source: {activeClaim.sourceType}
            </span>
            <h4 className="text-lg font-heading font-bold text-[#191c1e] mt-0.5">
              "{activeClaim.quote}"
            </h4>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-heading font-bold self-start sm:self-auto bg-[#ffdad6] text-[#ba1a1a] border border-[#ba1a1a]/30">
            {activeClaim.verdict}
          </span>
        </div>

        {/* 3 Analysis Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* SEBI Data */}
          <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#ba1a1a]">
              <ShieldAlert className="w-4 h-4 text-[#ba1a1a]" />
              <span>Official Regulatory Ground Truth</span>
            </div>
            <p className="text-xs text-[#191c1e] leading-relaxed">
              {activeClaim.sebiGroundTruth}
            </p>
          </div>

          {/* Mathematical Reality */}
          <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#006b57]">
              <Scale className="w-4 h-4 text-[#00b090]" />
              <span>Mathematical Reality & Friction</span>
            </div>
            <p className="text-xs text-[#565e74] leading-relaxed">
              {activeClaim.mathematicalReality}
            </p>
          </div>

          {/* Recommended Action */}
          <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] space-y-2">
            <div className="flex items-center gap-2 text-xs font-heading font-bold text-[#006b57]">
              <CheckCircle className="w-4 h-4 text-[#00b090]" />
              <span>FinSight Evidence-Based Strategy</span>
            </div>
            <p className="text-xs text-[#191c1e] leading-relaxed">
              {activeClaim.recommendedAction}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};
