const fs = require('fs');

const file = 'src/components/chat/AiChatWidget.tsx';
let c = fs.readFileSync(file, 'utf8');

const oldStr = `const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents,
          config: {
            systemInstruction: promptSystemContext,
            temperature: 0.3,
          }
        });

        const aiResponse = response.text;
        
        if (aiResponse) {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: aiResponse, timestamp: getFormattedTime() }]);
        } else {
          setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'AI failed. Invalid API response format.', timestamp: getFormattedTime() }]);
        }`;

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
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'AI failed. All fallback models exhausted.', timestamp: getFormattedTime() }]);
      }`;

c = c.replace(oldStr, newStr);
fs.writeFileSync(file, c);
console.log('AiChatWidget patched successfully');
