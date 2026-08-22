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

replaceBlock(
  'src/components/chat/AiChatWidget.tsx',
  'const response = await ai.models.generateContent({',
  `timestamp: getFormattedTime() }]);\n        }`,
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
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'AI failed. All fallback models exhausted.', timestamp: getFormattedTime() }]);
      }`
);

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

