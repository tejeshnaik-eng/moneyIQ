const fs = require('fs');

const file = 'src/components/chat/AiChatWidget.tsx';
let c = fs.readFileSync(file, 'utf8');

const regex = /const response = await ai\.models\.generateContent\(\{[\s\S]*?AI failed\. Invalid API response format\.', timestamp: getFormattedTime\(\) \}\]\);\s*\}/m;

const newStr = `
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
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'AI failed. All fallback models exhausted or rate limited.', timestamp: getFormattedTime() }]);
      }`;

if (regex.test(c)) {
  c = c.replace(regex, newStr);
  fs.writeFileSync(file, c);
  console.log("Success! File replaced.");
} else {
  console.log("Regex did not match.");
}
