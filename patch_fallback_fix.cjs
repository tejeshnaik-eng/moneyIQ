const fs = require('fs');

function replaceBlock(file, startStr, endStr, newStr) {
  let c = fs.readFileSync(file, 'utf8');
  let s = c.indexOf(startStr);
  let e = c.indexOf(endStr, s);
  if (s === -1 || e === -1) {
    console.log('Failed for', file);
    return;
  }
  let toReplace = c.substring(s, e + endStr.length);
  c = c.replace(toReplace, newStr);
  fs.writeFileSync(file, c);
  console.log('Success for', file);
}

// 1. AiChatWidget
replaceBlock(
  'src/components/chat/AiChatWidget.tsx',
  'const response = await ai.models.generateContent({',
  `content: 'AI failed. Invalid API response format.', timestamp: getFormattedTime() }]);\n      }`,
  `
      const fallbackModels = [
        'gemini-3.5-flash-lite',
        'gemini-3.1-flash-lite',
        'gemini-2.5-flash-lite',
        'gemini-3.5-flash',
        'gemini-3-flash',
        'gemini-2.5-flash'
      ];
      
      let aiResponse = "";
      let success = false;
      
      for (const modelName of fallbackModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction: promptSystemContext,
              temperature: 0.3,
            }
          });
          if (response.text) {
             aiResponse = response.text;
             success = true;
             break;
          }
        } catch (e) {
          console.warn('Model ' + modelName + ' failed, trying next...');
          continue;
        }
      }
      
      if (success && aiResponse) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: aiResponse, timestamp: getFormattedTime() }]);
      } else {
        throw new Error("All fallback models exhausted or rate limited.");
      }`
);

// 2. PortfolioAnalyzer
replaceBlock(
  'src/components/modules/PortfolioAnalyzer.tsx',
  'const response = await ai.models.generateContent({',
  `const parsed = JSON.parse(response.text);`,
  `
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
                    allocation_breakdown: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { category: { type: Type.STRING }, value_pct: { type: Type.NUMBER }, amount: { type: Type.NUMBER } } } },
                    sector_concentration: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { sector: { type: Type.STRING }, value_pct: { type: Type.NUMBER } } } },
                    risk_alignment: { type: Type.OBJECT, properties: { user_risk_category: { type: Type.STRING }, portfolio_risk_score: { type: Type.NUMBER }, alignment_status: { type: Type.STRING }, explanation: { type: Type.STRING } } },
                    diversification_score: { type: Type.OBJECT, properties: { score: { type: Type.NUMBER }, components: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { factor: { type: Type.STRING }, status: { type: Type.STRING }, impact: { type: Type.STRING } } } } } },
                    warnings: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { severity: { type: Type.STRING }, message: { type: Type.STRING } } } },
                    summary: { type: Type.STRING }
                  },
                  required: ["allocation_breakdown", "sector_concentration", "risk_alignment", "diversification_score", "warnings", "summary"]
                }
              }
            });
            if (response.text) {
               aiResponseText = response.text;
               success = true;
               break;
            }
          } catch (e) {
            console.warn('Model ' + modelName + ' failed, trying next...');
            continue;
          }
        }
        
        if (!success || !aiResponseText) throw new Error("All fallback models exhausted or rate limited.");
        const parsed = JSON.parse(aiResponseText);`
);

// 3. aiService
replaceBlock(
  'src/services/aiService.ts',
  'const response = await ai.models.generateContent({',
  `return JSON.parse(response.text);`,
  `
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
              required: ["capacityScore", "toleranceScore", "profileClass", "personaName", "coreStrategy", "primaryConsideration", "equityPct", "debtPct", "goldPct", "cashPct"],
            },
          }
        });
        if (response.text) {
           aiResponseText = response.text;
           success = true;
           break;
        }
      } catch (e) {
        console.warn('Model ' + modelName + ' failed, trying next...');
        continue;
      }
    }
    
    if (!success || !aiResponseText) throw new Error("All fallback models exhausted or rate limited.");
    return JSON.parse(aiResponseText);`
);

// 4. server/index.js
replaceBlock(
  'server/index.js',
  'const model = genAI.getGenerativeModel({',
  `const responseText = result.response.text();`,
  `
    const fallbackModels = [
      'gemini-3.5-flash-lite',
      'gemini-3.1-flash-lite',
      'gemini-2.5-flash-lite',
      'gemini-3.5-flash',
      'gemini-3-flash',
      'gemini-2.5-flash'
    ];
    
    let responseText = "";
    let success = false;
    const userPrompt = \`Analyze this financial claim and return a structured audit: "\${claim.trim()}"\`;
    
    for (const modelName of fallbackModels) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: SYSTEM_PROMPT,
          generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: auditSchema,
            temperature: 0.3,
            maxOutputTokens: 1024,
          },
        });
        
        const result = await model.generateContent(userPrompt);
        if (result.response.text()) {
           responseText = result.response.text();
           success = true;
           break;
        }
      } catch (e) {
        console.warn('Model ' + modelName + ' failed, trying next...');
        continue;
      }
    }
    
    if (!success || !responseText) throw new Error("All fallback models exhausted or rate limited.");`
);
