/**
 * Gemini-based financial health analysis service.
 * Sends the user's full risk profile form to Gemini and parses a structured JSON response.
 * Completely driven by real AI reasoning. No fake heuristics.
 */

export interface FinancialAnalysisResult {
  healthScore: number;          // 0-100
  healthBand: 'Excellent' | 'Good' | 'Fair' | 'Needs Work';
  dimensions: {
    assets:      number;        // 0-100
    debtControl: number;        // 0-100
    spendControl: number;       // 0-100
    riskProfile: number;        // 0-100
  };
  insights: string[];           // 2-4 short actionable sentences
  topRisk: string;              // single biggest financial risk
  suggestedAction: string;      // single clearest next action
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
  if (!apiKey) {
    console.error('[Gemini analysis] Missing VITE_GEMINI_API_KEY environment variable.');
    return null;
  }

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
  
  console.error('[Gemini analysis] All models failed. Returning null (no heuristic fallback).');
  return null;
}
