import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY });

export async function generateRiskProfile(formData: any) {
  const prompt = `
You are a highly experienced quantitative financial advisor and wealth manager for Indian investors.
The user has completed a risk assessment questionnaire. Evaluate their profile objectively.

User Data:
${JSON.stringify(formData, null, 2)}

Provide a strict JSON response analyzing their risk profile. It must match the following schema exactly:
- capacityScore (number 0-100): Objective financial ability to sustain drawdowns based on age, income stability, debt, and emergency savings.
- toleranceScore (number 0-100): Psychological willingness to endure volatility based on crash reaction and preferences.
- profileClass (string): A short label like "Moderate", "Aggressive", "Conservative", "Balanced".
- personaName (string): A descriptive archetype like "Growth Seeker", "Capital Preserver", etc.
- coreStrategy (string): A 1-2 sentence description of their ideal investment strategy.
- primaryConsideration (string): A 1-2 sentence description of a key risk or consideration they should keep in mind.
- equityPct (number 0-100)
- debtPct (number 0-100)
- goldPct (number 0-100)
- cashPct (number 0-100)
Note: The sum of equity, debt, gold, and cash percentages must equal exactly 100.
`;

  try {
    
    const fallbackModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3-flash',
      'gemini-2.5-flash'
    ];
    
    let aiResponseText = "";
    let success = false;
    
    for (const modelName of fallbackModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                capacityScore: { type: Type.INTEGER },
                toleranceScore: { type: Type.INTEGER },
                profileClass: { type: Type.STRING },
                personaName: { type: Type.STRING },
                coreStrategy: { type: Type.STRING },
                primaryConsideration: { type: Type.STRING },
                equityPct: { type: Type.INTEGER },
                debtPct: { type: Type.INTEGER },
                goldPct: { type: Type.INTEGER },
                cashPct: { type: Type.INTEGER },
              },
              required: [
                "capacityScore",
                "toleranceScore",
                "profileClass",
                "personaName",
                "coreStrategy",
                "primaryConsideration",
                "equityPct",
                "debtPct",
                "goldPct",
                "cashPct"
              ],
            },
          }
        });
        if (response.text) {
           aiResponseText = response.text;
           success = true;
           break;
        }
      } catch (e) {
        console.warn(`Model ${modelName} failed, trying next...`);
        continue;
      }
    }
    
    if (!success || !aiResponseText) throw new Error("All fallback models exhausted or rate limited.");
    return JSON.parse(aiResponseText);
  } catch (error) {
    console.error("AI Evaluation failed:", error);
    throw error;
  }
}
