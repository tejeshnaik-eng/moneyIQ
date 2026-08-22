/**
 * Gemini-based financial health analysis service.
 * Sends the user's full risk profile form to Gemini and parses a structured JSON response.
 * Falls back to a deterministic heuristic analysis if the API call fails.
 */

export interface FinancialAnalysisResult {
  healthScore: number;          // 0–100
  healthBand: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
  dimensions: {
    assets:      number;        // 0–100
    debtControl: number;        // 0–100
    spendControl: number;       // 0–100
    riskProfile: number;        // 0–100
  };
  insights: string[];           // 2–4 short actionable sentences
  topRisk: string;              // single biggest financial risk
  suggestedAction: string;      // single clearest next action
}

// ── Deterministic heuristic fallback ──────────────────────────────
export function heuristicAnalysis(params: {
  assets: number;
  liabilities: number;
  leakage: number;
  hasProfile: boolean;
  monthlyIncome: number;
  emergencySavings: number;
  timeHorizon: string;
  primaryGoal: string;
  crashReaction: string;
}): FinancialAnalysisResult {
  const { assets, liabilities, leakage, hasProfile, monthlyIncome, emergencySavings, timeHorizon, primaryGoal, crashReaction } = params;

  // Dimension scores
  const assetScore   = assets > 0 ? Math.min(100, 60 + Math.floor(Math.log10(assets + 1) * 8)) : 0;
  const debtRatio    = liabilities > 0 ? liabilities / Math.max(assets, 1) : 0;
  const debtScore    = Math.max(0, Math.round(100 - debtRatio * 100));
  const leakRatio    = monthlyIncome > 0 ? leakage / Math.max(monthlyIncome, 1) : (leakage > 0 ? 0.5 : 0);
  const spendScore   = Math.max(0, Math.round(100 - leakRatio * 120));
  const riskScore    = hasProfile ? 100 : 0;

  // Weighted health score
  const healthScore  = Math.round((assetScore * 0.35 + debtScore * 0.25 + spendScore * 0.25 + riskScore * 0.15));
  const healthBand: FinancialAnalysisResult['healthBand'] =
    healthScore >= 80 ? 'Excellent' :
    healthScore >= 65 ? 'Good' :
    healthScore >= 45 ? 'Fair' : 'Needs Work';

  // Emergency fund coverage months
  const emergencyMonths = monthlyIncome > 0 ? emergencySavings / monthlyIncome : 0;

  // Build insights
  const insights: string[] = [];
  if (assets === 0)          insights.push('Start recording your holdings to unlock full portfolio analysis.');
  if (!hasProfile)           insights.push('Complete your risk profile to get a personalised investment mix.');
  if (leakage > 0)           insights.push(`₹${leakage.toLocaleString('en-IN')} monthly discretionary spend can be reallocated toward your ${primaryGoal.toLowerCase()} goal.`);
  if (emergencyMonths < 3 && monthlyIncome > 0) insights.push(`Your emergency fund covers ${emergencyMonths.toFixed(1)} months — aim for 6 months of expenses.`);
  if (debtRatio > 0.3)       insights.push(`Liabilities are ${Math.round(debtRatio * 100)}% of assets — focus on reducing high-interest debt first.`);
  if (insights.length === 0) insights.push('Your financial fundamentals look solid. Consider increasing your SIP contribution by 10% this year.');

  const topRisk =
    !hasProfile ? 'Unknown risk tolerance — your investment allocation may be inappropriate for your actual goals.' :
    debtRatio > 0.4 ? 'High debt-to-asset ratio is limiting your wealth-building capacity.' :
    leakRatio > 0.3 ? 'Excessive discretionary spending is reducing your monthly savings rate.' :
    emergencyMonths < 3 ? 'Insufficient emergency buffer exposes you to forced asset liquidation.' :
    assets === 0 ? 'No recorded assets means no visibility into your real financial position.' :
    'Concentration risk — ensure your portfolio is sufficiently diversified across asset classes.';

  const suggestedAction =
    !hasProfile ? 'Complete the Risk Profile questionnaire to get your personalised investment mix.' :
    assets === 0 ? 'Add your first holding in Portfolio to begin tracking real net worth.' :
    leakage > 0 ? 'Review Spend Analysis and set a monthly cap on discretionary categories.' :
    debtRatio > 0.3 ? 'Prioritise EMI prepayment this quarter to improve your debt-to-asset ratio.' :
    'Increase your monthly SIP by 10% and review goal progress quarterly.';

  return {
    healthScore,
    healthBand,
    dimensions: { assets: assetScore, debtControl: debtScore, spendControl: spendScore, riskProfile: riskScore },
    insights,
    topRisk,
    suggestedAction,
  };
}

// ── Gemini AI analysis ─────────────────────────────────────────────
const MODELS_TO_TRY = [
  'gemini-3.6-flash',
  'gemini-3.7-flash',
  'gemini-3.5-flash',
  'gemini-3.5-flash-lite'
];

export async function analyzeWithGemini(profileJson: Record<string, unknown>): Promise<FinancialAnalysisResult | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const apiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY as string | undefined;
  if (!apiKey) return null;

  const prompt = `You are a certified financial planner. Analyze this Indian investor's profile and return ONLY a valid JSON object — no markdown, no prose, no code fences.

PROFILE:
${JSON.stringify(profileJson, null, 2)}

Return exactly this JSON shape (all fields required):
{
  "healthScore": <integer 0-100>,
  "healthBand": <"Excellent"|"Good"|"Fair"|"Needs Work">,
  "dimensions": {
    "assets": <integer 0-100>,
    "debtControl": <integer 0-100>,
    "spendControl": <integer 0-100>,
    "riskProfile": <integer 0-100>
  },
  "insights": [<2-4 short actionable sentences specific to this profile>],
  "topRisk": "<single biggest financial risk sentence>",
  "suggestedAction": "<single clearest immediate next action>"
}

Rules: scores must reflect real financial principles. Penalise high EMI burden, inadequate emergency fund, no investment diversification. Reward long time horizons, stable income, disciplined spending. India-specific context.`;

  for (const model of MODELS_TO_TRY) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
      const res = await fetch(`${endpoint}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
        }),
      });

      if (!res.ok) {
        console.warn(`[Gemini analysis] ${model} API error: ${res.status}`);
        continue; // Try the next model
      }
      
      const data = await res.json();
      const rawText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

      // Strip any accidental markdown code fences
      const cleaned = rawText.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
      const parsed = JSON.parse(cleaned) as FinancialAnalysisResult;

      // Basic validation
      if (
        typeof parsed.healthScore === 'number' &&
        Array.isArray(parsed.insights) &&
        parsed.dimensions
      ) {
        return parsed; // Successfully parsed, return result
      }
      
      console.warn(`[Gemini analysis] ${model} returned invalid JSON structure`);
    } catch (e) {
      console.warn(`[Gemini analysis] ${model} failed, trying next...`, e);
    }
  }
  
  console.warn('[Gemini analysis] all models failed, using heuristic fallback');
  return null;
}
