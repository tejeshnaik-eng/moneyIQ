const fs = require('fs');

function patchAiChatWidget() {
  const file = 'src/components/chat/AiChatWidget.tsx';
  let c = fs.readFileSync(file, 'utf8');
  
  const oldBlock = /const response = await ai\.models\.generateContent\(\{[\s\S]*?if \(aiResponse\) \{[\s\S]*?\} else \{[\s\S]*?\}\n/m;
  
  const newBlock = `
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
          console.warn(\`Model \${modelName} failed, trying next...\`);
          continue;
        }
      }
      
      if (success && aiResponse) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: aiResponse, timestamp: getFormattedTime() }]);
      } else {
        throw new Error("All fallback models exhausted or rate limited.");
      }
`;
  
  c = c.replace(oldBlock, newBlock);
  fs.writeFileSync(file, c);
}

function patchPortfolioAnalyzer() {
  const file = 'src/components/modules/PortfolioAnalyzer.tsx';
  let c = fs.readFileSync(file, 'utf8');
  
  const oldBlock = /const response = await ai\.models\.generateContent\(\{[\s\S]*?if \(\!response\.text\) throw new Error\("Empty response from AI"\);\n\s*const parsed = JSON\.parse\(response\.text\);\n/m;
  
  const newBlock = `
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
                    allocation_breakdown: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          category: { type: Type.STRING },
                          value_pct: { type: Type.NUMBER },
                          amount: { type: Type.NUMBER }
                        }
                      }
                    },
                    sector_concentration: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          sector: { type: Type.STRING },
                          value_pct: { type: Type.NUMBER }
                        }
                      }
                    },
                    risk_alignment: {
                      type: Type.OBJECT,
                      properties: {
                        user_risk_category: { type: Type.STRING },
                        portfolio_risk_score: { type: Type.NUMBER },
                        alignment_status: { type: Type.STRING },
                        explanation: { type: Type.STRING }
                      }
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
                              factor: { type: Type.STRING },
                              status: { type: Type.STRING },
                              impact: { type: Type.STRING }
                            }
                          }
                        }
                      }
                    },
                    warnings: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          severity: { type: Type.STRING },
                          message: { type: Type.STRING }
                        }
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
            if (response.text) {
               aiResponseText = response.text;
               success = true;
               break;
            }
          } catch (e) {
            console.warn(\`Model \${modelName} failed, trying next...\`);
            continue;
          }
        }
        
        if (!success || !aiResponseText) throw new Error("All fallback models exhausted or rate limited.");
        const parsed = JSON.parse(aiResponseText);
`;

  c = c.replace(oldBlock, newBlock);
  fs.writeFileSync(file, c);
}

function patchAiService() {
  const file = 'src/services/aiService.ts';
  let c = fs.readFileSync(file, 'utf8');
  
  const oldBlock = /const response = await ai\.models\.generateContent\(\{[\s\S]*?if \(\!response\.text\) throw new Error\("Empty response from AI"\);\n\s*return JSON\.parse\(response\.text\);\n/m;
  
  const newBlock = `
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
        console.warn(\`Model \${modelName} failed, trying next...\`);
        continue;
      }
    }
    
    if (!success || !aiResponseText) throw new Error("All fallback models exhausted or rate limited.");
    return JSON.parse(aiResponseText);
`;

  c = c.replace(oldBlock, newBlock);
  fs.writeFileSync(file, c);
}

function patchServer() {
  const file = 'server/index.js';
  let c = fs.readFileSync(file, 'utf8');
  
  const oldBlock = /const model = genAI\.getGenerativeModel\(\{[\s\S]*?const responseText = result\.response\.text\(\);\n/m;
  
  const newBlock = `
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
        console.warn(\`Model \${modelName} failed, trying next...\`);
        continue;
      }
    }
    
    if (!success || !responseText) throw new Error("All fallback models exhausted or rate limited.");
`;

  c = c.replace(oldBlock, newBlock);
  fs.writeFileSync(file, c);
}

patchAiChatWidget();
patchPortfolioAnalyzer();
patchAiService();
patchServer();
