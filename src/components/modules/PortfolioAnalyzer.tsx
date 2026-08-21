import React, { useState } from 'react';
import { Loader2, AlertTriangle, ShieldCheck, Target, Activity, Flame, CheckCircle2, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PortfolioHolding } from '../../types';
import { getStorageKey } from '../../utils';

interface PortfolioAnalyzerProps {
  holdings: PortfolioHolding[];
  totals: {
    consolidatedValue: number;
    principalInvested: number;
    unrealizedReturns: number;
    returnPct: number;
  };
}

export const PortfolioAnalyzer: React.FC<PortfolioAnalyzerProps> = ({ holdings, totals }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key missing.");

      const storedRiskProfile = localStorage.getItem(getStorageKey('finsight_investor_profile'));
      const riskProfile = storedRiskProfile ? JSON.parse(storedRiskProfile) : { category: 'Moderate', score: 50 };

      const inputPayload = {
        risk_profile: riskProfile,
        holdings: holdings.map(h => ({
          asset: h.name,
          category: h.category,
          platform: h.platform,
          invested: h.investedValue,
          current_value: h.currentValue
        })),
        computed_totals: {
          consolidated_value: totals.consolidatedValue,
          principal_invested: totals.principalInvested,
          unrealized_returns: totals.unrealizedReturns,
          return_pct: totals.returnPct
        }
      };

      const prompt = `You are an expert quantitative portfolio analyst. Analyze the following portfolio data.
DO NOT invent data. ONLY use the provided holdings and totals.
Explanations must be plain, active-voice sentences. No buzzwords like "leverage," "optimize," or "unlock."
Label forward-looking statements as assumptions, not guarantees.

Input Data:
${JSON.stringify(inputPayload, null, 2)}

Respond ONLY with a raw JSON object matching this schema exactly (no markdown formatting, no backticks, no preamble):
{
  "allocation_breakdown": [
    { "category": "String", "value_pct": Number, "amount": Number }
  ],
  "sector_concentration": [
    { "sector": "String", "value_pct": Number }
  ],
  "risk_alignment": {
    "user_risk_category": "String",
    "portfolio_risk_score": Number (0-100),
    "alignment_status": "aligned" | "over-exposed" | "under-exposed",
    "explanation": "String"
  },
  "diversification_score": {
    "score": Number (0-100),
    "components": [
      { "label": "Asset Diversity", "score": Number (0-25) },
      { "label": "Platform Concentration", "score": Number (0-25) },
      { "label": "Sector Concentration", "score": Number (0-25) },
      { "label": "Overlap Risk", "score": Number (0-25) }
    ]
  },
  "warnings": [
    { "severity": "low" | "medium" | "high", "message": "String" }
  ],
  "summary": "String"
}`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.1, responseMimeType: "application/json" }
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error?.message || "Failed to analyze portfolio");

      const textOutput = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(textOutput);
      
      // Basic schema validation
      if (!parsed.allocation_breakdown || !parsed.risk_alignment) {
        throw new Error("AI returned malformed schema.");
      }
      
      setAnalysisResult(parsed);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
      
      // Fallback
      if (!analysisResult) {
        setAnalysisResult({
          allocation_breakdown: [
            { category: "Equity", value_pct: 100, amount: totals.consolidatedValue }
          ],
          sector_concentration: [],
          risk_alignment: {
            user_risk_category: "Unknown",
            portfolio_risk_score: 50,
            alignment_status: "aligned",
            explanation: "Fallback rule-based summary since AI analysis failed."
          },
          diversification_score: {
            score: 50,
            components: []
          },
          warnings: [
            { severity: "medium", message: "AI analysis failed. Showing structural defaults." }
          ],
          summary: "This is a fallback summary generated because the AI connection failed or returned invalid data."
        });
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  if (!analysisResult && !isAnalyzing) {
    return (
      <div className="bg-[#191c1e] rounded-xl p-8 text-white relative overflow-hidden mt-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#00b090] opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-heading font-extrabold mb-2">AI Portfolio Diagnostics</h3>
            <p className="text-sm text-gray-300 font-body leading-relaxed mb-6">
              Run a deep structural audit of your holdings against your computed risk profile. Identifies hidden overlap, platform concentration risks, and true asset allocation.
            </p>
            <button
              onClick={runAnalysis}
              className="bg-[#00b090] hover:bg-[#009b7e] text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 text-sm"
            >
              <Activity className="w-4 h-4" />
              Generate Diagnostic Report
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isAnalyzing) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 flex flex-col items-center justify-center space-y-4 mt-8">
        <Loader2 className="w-8 h-8 text-[#00b090] animate-spin" />
        <p className="text-sm font-heading font-bold text-[#191c1e] tracking-widest uppercase">
          Synthesizing Portfolio Matrix...
        </p>
        <p className="text-xs text-[#565e74]">Correlating holdings with risk parameters.</p>
      </div>
    );
  }

  const COLORS = ['#006b57', '#00b090', '#f4a261', '#e76f51', '#264653'];

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-heading font-extrabold text-[#191c1e]">Diagnostic Report</h3>
        <button onClick={runAnalysis} className="text-xs text-[#006b57] font-bold hover:underline flex items-center gap-1">
          <Activity className="w-3.5 h-3.5" /> Recalculate
        </button>
      </div>
      
      {error && (
        <div className="bg-[#ffdad6] text-[#ba1a1a] p-4 rounded-lg flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Summary & Risk */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-sm">
            <h4 className="text-[10px] font-heading font-bold text-[#565e74] uppercase tracking-widest mb-3">Executive Summary</h4>
            <p className="text-sm text-[#191c1e] leading-relaxed font-body">
              {analysisResult.summary}
            </p>
          </div>

          <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h4 className="text-[10px] font-heading font-bold text-[#565e74] uppercase tracking-widest mb-3">Risk Alignment</h4>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full ${
                  analysisResult.risk_alignment.alignment_status === 'aligned' ? 'bg-[#00b090]/10 text-[#006b57]' :
                  analysisResult.risk_alignment.alignment_status === 'over-exposed' ? 'bg-[#ffdad6] text-[#ba1a1a]' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {analysisResult.risk_alignment.alignment_status.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-[#191c1e]">
                  Target: {analysisResult.risk_alignment.user_risk_category}
                </span>
              </div>
              <p className="text-xs text-[#565e74] leading-relaxed mt-4">
                {analysisResult.risk_alignment.explanation}
              </p>
            </div>
            <div className="w-[120px] shrink-0 flex flex-col items-center justify-center bg-[#f8fafc] p-4 rounded-lg border border-[#E2E8F0]">
              <span className="text-3xl font-heading font-extrabold text-[#191c1e]">
                {analysisResult.risk_alignment.portfolio_risk_score}
              </span>
              <span className="text-[10px] text-[#565e74] uppercase tracking-wider font-bold mt-1 text-center">Realized<br/>Risk Score</span>
            </div>
          </div>

          {/* Warnings */}
          {analysisResult.warnings && analysisResult.warnings.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-heading font-bold text-[#565e74] uppercase tracking-widest">Structural Warnings</h4>
              {analysisResult.warnings.map((w: any, idx: number) => (
                <div key={idx} className={`p-4 rounded-lg flex items-start gap-3 ${
                  w.severity === 'high' ? 'bg-error-container text-on-error-container border-none' :
                  w.severity === 'medium' ? 'bg-secondary-container text-on-secondary-container border-none' :
                  'bg-tertiary-container text-on-tertiary-container border-none'
                }`}>
                  {w.severity === 'high' ? <Flame className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
                  <p className="font-body-sm text-body-sm">{w.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Col: Charts & Diversification */}
        <div className="space-y-6">
          <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-sm">
            <h4 className="text-[10px] font-heading font-bold text-[#565e74] uppercase tracking-widest mb-4">Allocation Breakdown</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analysisResult.allocation_breakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value_pct"
                    nameKey="category"
                  >
                    {analysisResult.allocation_breakdown.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`${value}%`, 'Allocation']}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {analysisResult.allocation_breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="font-medium text-[#191c1e]">{item.category}</span>
                  </div>
                  <span className="font-mono text-[#565e74]">{item.value_pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white border border-[#E2E8F0] p-6 rounded-xl shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-heading font-bold text-[#565e74] uppercase tracking-widest">Diversification</h4>
              <span className="text-lg font-heading font-extrabold text-[#006b57]">{analysisResult.diversification_score.score}/100</span>
            </div>
            <div className="space-y-4">
              {analysisResult.diversification_score.components.map((comp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#565e74] font-medium">{comp.label}</span>
                    <span className="font-mono font-bold text-[#191c1e]">{comp.score}/25</span>
                  </div>
                  <div className="w-full bg-[#f2f4f6] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00b090] h-full rounded-full" style={{ width: `${(comp.score / 25) * 100}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
