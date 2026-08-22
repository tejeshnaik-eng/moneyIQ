import React, { useState } from 'react';
import { Loader2, AlertTriangle, Activity, Flame } from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { PortfolioHolding } from '../../types';
import { getStorageKey } from '../../utils';
import { GoogleGenAI, Type } from '@google/genai';

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
  const [analysisResult, setAnalysisResult] = useState<any>(() => {
    const saved = localStorage.getItem('finsight_ai_analysis');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) { return null; }
    }
    return null;
  });
  const [error, setError] = useState<string | null>(null);

  const runAnalysis = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key missing.");

      const ai = new GoogleGenAI({ apiKey });

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

      const prompt = `You are an elite quantitative portfolio manager and risk analyst. Perform a highly detailed, robust, and rigorous diagnostic audit on the provided portfolio data.

Your goal is to uncover hidden structural flaws, dangerous sector concentrations, platform exposure risks, and severe deviations from the user's stated risk profile. Evaluate if their true asset allocation matches their intentions.

CRITICAL: You MUST generate at least 2 or 3 'warnings' in the JSON response pointing out structural risks or flaws (e.g. overlap, high fees, concentration). Do not return an empty warnings array.

DO NOT invent data. ONLY use the provided holdings and totals.
Explanations must be clinical, precise, and brutally honest. Avoid generic advice or buzzwords. Label assumptions clearly.

Input Data:
${JSON.stringify(inputPayload, null, 2)}
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              allocation_breakdown: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    value_pct: { type: Type.NUMBER },
                    amount: { type: Type.NUMBER }
                  },
                  required: ["category", "value_pct", "amount"]
                }
              },
              sector_concentration: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sector: { type: Type.STRING },
                    value_pct: { type: Type.NUMBER }
                  },
                  required: ["sector", "value_pct"]
                }
              },
              risk_alignment: {
                type: Type.OBJECT,
                properties: {
                  user_risk_category: { type: Type.STRING },
                  portfolio_risk_score: { type: Type.NUMBER },
                  alignment_status: { type: Type.STRING },
                  explanation: { type: Type.STRING }
                },
                required: ["user_risk_category", "portfolio_risk_score", "alignment_status", "explanation"]
              },
              diversification_score: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  components: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        label: { type: Type.STRING },
                        score: { type: Type.NUMBER }
                      },
                      required: ["label", "score"]
                    }
                  }
                },
                required: ["score", "components"]
              },
              warnings: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    severity: { type: Type.STRING },
                    message: { type: Type.STRING }
                  },
                  required: ["severity", "message"]
                }
              },
              summary: { type: Type.STRING }
            },
            required: [
              "allocation_breakdown",
              "sector_concentration",
              "risk_alignment",
              "diversification_score",
              "warnings",
              "summary"
            ]
          }
        }
      });

      if (!response.text) throw new Error("Empty response from AI");
      const parsed = JSON.parse(response.text);
      
      setAnalysisResult(parsed); localStorage.setItem('finsight_ai_analysis', JSON.stringify(parsed));
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
      <div className="bg-[#161616] rounded-xl p-8 text-white relative overflow-hidden mt-8 border border-[#222]">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <h3 className="text-xl font-heading font-extrabold mb-2 text-white">AI Portfolio Diagnostics</h3>
            <p className="text-sm text-[#71717A] font-body leading-relaxed mb-6">
              Run a deep structural audit of your holdings against your computed risk profile. Identifies hidden overlap, platform concentration risks, and true asset allocation.
            </p>
            <button
              onClick={runAnalysis}
              className="bg-[#20EFA0] hover:bg-[#1bd98f] text-[#080B0A] font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2 text-sm"
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
      <div className="bg-[#161616] border border-[#222] rounded-xl p-12 flex flex-col items-center justify-center space-y-4 mt-8">
        <Loader2 className="w-8 h-8 text-[#20EFA0] animate-spin" />
        <p className="text-sm font-heading font-bold text-white tracking-widest uppercase">
          Synthesizing Portfolio Matrix...
        </p>
        <p className="text-xs text-[#71717A]">Correlating holdings with risk parameters.</p>
      </div>
    );
  }

  const COLORS = ['#20EFA0', '#2775E8', '#7757D9', '#D99A00', '#D64545', '#00B386'];

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-heading font-extrabold text-white">Diagnostic Report</h3>
        <button onClick={runAnalysis} className="text-xs text-[#20EFA0] font-bold hover:underline flex items-center gap-1">
          <Activity className="w-3.5 h-3.5" /> Recalculate
        </button>
      </div>
      
      {error && (
        <div className="bg-[#111111] border border-[#ff4444] text-[#ff4444] p-4 rounded-lg flex items-start gap-3 text-sm">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Summary & Risk */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#161616] p-6 rounded-xl">
            <h4 className="text-[10px] font-heading font-bold text-[#71717A] uppercase tracking-widest mb-3">Executive Summary</h4>
            <p className="text-sm text-white leading-relaxed font-body">
              {analysisResult.summary}
            </p>
          </div>

          <div className="bg-[#161616] border border-[#222] p-6 rounded-xl flex flex-col md:flex-row gap-6">
            <div className="flex-1">
              <h4 className="text-[10px] font-heading font-bold text-[#71717A] uppercase tracking-widest mb-3">Risk Alignment</h4>
              <div className="flex items-center gap-3 mb-2">
                <span className={`px-3 py-1 text-xs font-bold rounded-full \${
                  analysisResult.risk_alignment.alignment_status === 'aligned' ? 'bg-[#20EFA0] text-[#080B0A]' :
                  analysisResult.risk_alignment.alignment_status === 'over-exposed' ? 'bg-[#ff4444] text-white' :
                  'bg-[#f4a261] text-[#080B0A]'
                }`}>
                  {analysisResult.risk_alignment.alignment_status.toUpperCase()}
                </span>
                <span className="text-sm font-medium text-white">
                  Target: {analysisResult.risk_alignment.user_risk_category}
                </span>
              </div>
              <p className="text-xs text-[#71717A] leading-relaxed mt-4">
                {analysisResult.risk_alignment.explanation}
              </p>
            </div>
            <div className="w-[120px] shrink-0 flex flex-col items-center justify-center bg-[#111111] p-4 rounded-lg border border-[#222]">
              <span className="text-3xl font-heading font-extrabold text-white">
                {analysisResult.risk_alignment.portfolio_risk_score}
              </span>
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mt-1 text-center">Realized<br/>Risk Score</span>
            </div>
          </div>

          {/* Warnings */}
            {analysisResult.warnings && analysisResult.warnings.length > 0 && (
              <div className="bg-[#161616] p-6 rounded-xl">
                <h4 className="text-[10px] font-heading font-bold text-[#71717A] uppercase tracking-widest mb-6">Structural Warnings</h4>
                <div className="space-y-6">
                  {analysisResult.warnings.map((w: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-4">
                      <div className={`shrink-0 mt-0.5 ${
                        w.severity === 'high' ? 'text-[#D64545]' :
                        w.severity === 'medium' ? 'text-[#D99A00]' :
                        'text-[#71717A]'
                      }`}>
                        {w.severity === 'high' ? <Flame className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                      </div>
                      <p className="font-body text-[13px] text-[#E4E4E7] leading-relaxed">{w.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Col: Charts & Diversification */}
        <div className="space-y-6">
          <div className="bg-[#161616] p-6 rounded-xl">
            <h4 className="text-[10px] font-heading font-bold text-[#71717A] uppercase tracking-widest mb-4">Allocation Breakdown</h4>
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
                      <Cell key={`cell-\${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: any) => [`\${value}%`, 'Allocation']}
                    contentStyle={{ backgroundColor: '#111111', borderRadius: '8px', border: '1px solid #222', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2">
              {analysisResult.allocation_breakdown.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                    <span className="font-medium text-white">{item.category}</span>
                  </div>
                  <span className="font-mono text-[#71717A]">{item.value_pct}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#161616] p-6 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-heading font-bold text-[#71717A] uppercase tracking-widest">Diversification</h4>
              <span className="text-lg font-heading font-extrabold text-[#20EFA0]">{analysisResult.diversification_score.score}/100</span>
            </div>
            <div className="space-y-4">
              {analysisResult.diversification_score.components.map((comp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span className="text-[#71717A] font-medium">{comp.label}</span>
                    <span className="font-mono font-bold text-white">{comp.score}/100</span>
                  </div>
                  <div className="w-full bg-[#111111] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#20EFA0] h-full rounded-full" style={{ width: `\${comp.score}%` }}></div>
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
