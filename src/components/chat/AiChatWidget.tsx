import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';

import { 
  MessageSquare, 
  X, 
  Paperclip,
  Send,
  Calendar,
  CheckCheck,
  Bot
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: string;
}

export const AiChatWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePromptEvent = (e: Event) => {
      const customEvent = e as CustomEvent<{ prompt: string; autoSend?: boolean }>;
      setIsOpen(true);
      setInput(customEvent.detail.prompt);
      if (customEvent.detail.autoSend) {
        handleSend(customEvent.detail.prompt);
      }
    };
    window.addEventListener('ai-chat-prompt', handlePromptEvent as EventListener);
    return () => window.removeEventListener('ai-chat-prompt', handlePromptEvent as EventListener);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const getFormattedTime = () => {
    return new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: trimmed, timestamp: getFormattedTime() }]);
    setInput('');
    setIsTyping(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'Missing Gemini API Key in environment variables.', timestamp: getFormattedTime() }]);
        setIsTyping(false);
        return;
      }



// ... (in the component) ...
// (inside handleSend, replacing the fetch block)
      const ai = new GoogleGenAI({ apiKey });
      
      const contents = messages.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: trimmed }] });

      const promptSystemContext = "You are MoneyIQ AI assistant. Provide extremely detailed, comprehensive, and robust answers. Do not cut off mid-sentence. Provide full context.";
      
      
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
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'AI failed. Network or API error occurred.', timestamp: getFormattedTime() }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-[#E4E4E7] hover:bg-[#D4D4D8] text-[#080B0A] w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-105'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Slide-out Mobile-style Chat Panel */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[380px] h-[650px] max-h-[85vh] bg-[#0D1311] rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.4)] border border-[#111916] flex flex-col overflow-hidden transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) transform font-['Outfit'] ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3 border-b border-[#111916]">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-[#111916] flex items-center justify-center border border-[#6E7C75]/20">
              <img src="/favicon.png" alt="mIQ" className="w-5 h-5 object-contain" />
            </div>
            <h2 className="text-[18px] font-medium text-[#F2F7F4] tracking-tight">MoneyIQ AI</h2>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#111916] rounded-full text-xs font-medium text-[#A7B5AE] border border-[#6E7C75]/20">
              <Calendar className="w-3.5 h-3.5" /> Today
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-[#111916] hover:bg-[#1a2521] rounded-full text-[#A7B5AE] hover:text-[#F2F7F4] transition-colors border border-[#6E7C75]/20"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 custom-scrollbar bg-[#080B0A]">
          
          {/* Welcome Message */}
          {messages.length === 0 && (
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-8 h-8 rounded-full shrink-0 bg-[#111916] border border-[#6E7C75]/20 flex items-center justify-center">
                <img src="/favicon.png" alt="mIQ" className="w-4 h-4 object-contain" />
              </div>
              <div className="bg-[#111916] rounded-2xl rounded-tl-sm p-4 border border-[#6E7C75]/20">
                <p className="text-[15px] text-[#F2F7F4] leading-snug font-['Hedvig_Letters_Sans']">
                  Good morning, are you ready to review your finances?
                </p>
                <div className="flex justify-end items-center gap-1 mt-2">
                  <span className="text-[10px] font-medium text-[#6E7C75]">{getFormattedTime()}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#E4E4E7]/20 flex items-center justify-center">
                    <CheckCheck className="w-2.5 h-2.5 text-[#E4E4E7]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Messages */}
          {messages.map((msg, i) => (
            <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.role === 'user' ? (
                // User Bubble
                <div className="bg-[#2A2A2A] text-[#F2F7F4] rounded-[20px] rounded-tr-[4px] px-4 py-3 max-w-[85%] font-['Hedvig_Letters_Sans']">
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                // AI Bubble
                <div className="flex gap-3 max-w-[95%]">
                  <div className="w-8 h-8 rounded-full shrink-0 bg-[#111916] border border-[#6E7C75]/20 flex items-center justify-center">
                    <img src="/favicon.png" alt="mIQ" className="w-4 h-4 object-contain" />
                  </div>
                  <div className="bg-[#111916] rounded-2xl rounded-tl-sm p-4 border border-[#6E7C75]/20 font-['Hedvig_Letters_Sans'] overflow-hidden">
                    <div className="text-[15px] text-[#F2F7F4] leading-relaxed">
                      <ReactMarkdown 
                        components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => <strong className="font-bold text-white" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
                          li: ({node, ...props}) => <li className="mb-1" {...props} />,
                          h1: ({node, ...props}) => <h1 className="text-lg font-bold mb-2 text-[#E4E4E7]" {...props} />,
                          h2: ({node, ...props}) => <h2 className="text-base font-bold mb-2 text-[#E4E4E7]" {...props} />,
                          h3: ({node, ...props}) => <h3 className="text-sm font-bold mb-2 text-[#E4E4E7]" {...props} />,
                          a: ({node, ...props}) => <a className="text-[#E4E4E7] hover:underline" {...props} />
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                    <div className="flex justify-end items-center gap-1 mt-2">
                      <span className="text-[10px] font-medium text-[#6E7C75]">{msg.timestamp}</span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#E4E4E7]/20 flex items-center justify-center">
                        <CheckCheck className="w-2.5 h-2.5 text-[#E4E4E7]" />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-full shrink-0 bg-[#111916] border border-[#6E7C75]/20 flex items-center justify-center">
                <img src="/favicon.png" alt="mIQ" className="w-4 h-4 object-contain" />
              </div>
              <div className="bg-[#111916] rounded-2xl rounded-tl-sm p-4 border border-[#6E7C75]/20 flex items-center gap-1.5 h-[48px]">
                <div className="w-2 h-2 rounded-full bg-[#6E7C75] animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#6E7C75] animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-[#6E7C75] animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-[#0D1311] border-t border-[#111916] flex items-center gap-3">
          <button className="text-[#A7B5AE] hover:text-[#F2F7F4] transition-colors shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask MoneyIQ AI..."
              className="w-full bg-[#111916] border border-[#6E7C75]/30 text-[#F2F7F4] placeholder-[#6E7C75] rounded-full py-2.5 pl-4 pr-10 text-[15px] outline-none focus:border-[#E4E4E7]/50 transition-colors"
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-[#E4E4E7] hover:text-[#D4D4D8] disabled:text-[#6E7C75] disabled:cursor-not-allowed transition-colors p-1"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
