import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Paperclip,
  Send,
  Calendar,
  CheckCheck,
  MoreHorizontal
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

      const contents = messages.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: trimmed }] });

      const promptSystemContext = "You are FinSight AI assistant. Keep responses concise, helpful, and friendly. Use plain text or simple markdown.";
      
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: promptSystemContext }] },
          contents,
          generationConfig: { temperature: 0.3, maxOutputTokens: 800 }
        })
      });

      const data = await res.json();
      const aiResponse = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (aiResponse) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: aiResponse, timestamp: getFormattedTime() }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'AI failed. Invalid API response format.', timestamp: getFormattedTime() }]);
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
      {/* Floating Action Button (scales down when chat is open) */}
      <button 
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-40 bg-[#0F9D65] hover:bg-[#0C7D51] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 transform ${isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100 hover:scale-105'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Slide-out Mobile-style Chat Panel */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-[380px] h-[650px] max-h-[85vh] bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.12)] border border-gray-100 flex flex-col overflow-hidden transition-all duration-400 cubic-bezier(0.16, 1, 0.3, 1) transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-3">
          <h2 className="text-[22px] font-heading font-medium text-gray-900 tracking-tight">AI assistant</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
              <Calendar className="w-3.5 h-3.5" /> Today
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6 custom-scrollbar">
          
          {/* Welcome Message (shows if empty) */}
          {messages.length === 0 && (
            <div className="flex gap-3 max-w-[90%]">
              <div className="w-[42px] h-[42px] rounded-full shrink-0 bg-gradient-to-br from-[#8E8BFF] via-[#5D57FF] to-[#362DD9] shadow-inner flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-50"></div>
              </div>
              <div 
                className="bg-[#F8F9FA] rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100/50 relative overflow-hidden"
              >
                <div className="absolute inset-0 z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #F3F4F6, #F3F4F6 2px, transparent 2px, transparent 8px)' }}></div>
                <p className="text-[16px] text-gray-800 leading-snug font-body relative z-10">
                  Good morning, are you ready to review your finances?
                </p>
                <div className="flex justify-end items-center gap-1 mt-2 relative z-10">
                  <span className="text-[10px] font-medium text-gray-400">{getFormattedTime()}</span>
                  <div className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] flex items-center justify-center">
                    <CheckCheck className="w-2.5 h-2.5 text-white" />
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
                <div className="bg-[#7C3AED] text-white rounded-[20px] rounded-tr-[4px] px-4 py-3 shadow-sm max-w-[85%] font-body">
                  <p className="text-[15px] leading-relaxed">{msg.content}</p>
                </div>
              ) : (
                // AI Bubble
                <div className="flex gap-3 max-w-[90%]">
                  <div className="w-[42px] h-[42px] rounded-full shrink-0 bg-gradient-to-br from-[#8E8BFF] via-[#5D57FF] to-[#362DD9] shadow-inner flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-50"></div>
                  </div>
                  <div className="bg-[#F8F9FA] rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100/50 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #fff 25%, #fff 75%, #000 75%, #000)', backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px' }}></div>
                    <div className="text-[15px] text-gray-800 leading-relaxed font-body relative z-10 prose prose-sm prose-p:my-1 prose-headings:my-2 prose-a:text-[#7C3AED]">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <div className="flex justify-end items-center gap-1 mt-2 relative z-10">
                      <span className="text-[10px] font-medium text-gray-400">{msg.timestamp}</span>
                      <div className="w-3.5 h-3.5 rounded-full bg-[#7C3AED] flex items-center justify-center">
                        <CheckCheck className="w-2.5 h-2.5 text-white" />
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
              <div className="w-[42px] h-[42px] rounded-full shrink-0 bg-gradient-to-br from-[#8E8BFF] via-[#5D57FF] to-[#362DD9] shadow-inner flex items-center justify-center overflow-hidden relative">
                <div className="absolute inset-0 bg-white/20 blur-md rounded-full scale-50"></div>
              </div>
              <div className="bg-[#F8F9FA] rounded-2xl rounded-tl-sm p-4 shadow-sm border border-gray-100 flex items-center gap-1.5 h-[52px]">
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-white flex items-center gap-3">
          <button className="text-gray-400 hover:text-gray-600 transition-colors shrink-0">
            <Paperclip className="w-[22px] h-[22px]" />
          </button>
          <div className="flex-1 relative group">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full pl-4 pr-12 py-3.5 rounded-2xl border-[1.5px] border-[#D8B4FE] focus:border-[#A855F7] bg-white outline-none text-[15px] font-body text-gray-800 placeholder-gray-400 transition-colors shadow-[0_2px_10px_rgba(216,180,254,0.15)] focus:shadow-[0_2px_15px_rgba(168,85,247,0.2)]"
              placeholder="I'm prepared and eager to start..."
            />
            <button 
              onClick={() => handleSend(input)}
              disabled={!input.trim() || isTyping}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#84CC16] hover:text-[#65A30D] transition-colors disabled:opacity-50 disabled:hover:text-[#84CC16]"
            >
              <Send className="w-5 h-5 -rotate-12 translate-y-[-1px] translate-x-[1px]" />
            </button>
          </div>
        </div>

      </div>
      
      {/* Scrollbar & transition styling */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #E5E5EA; border-radius: 10px; }
        .duration-400 { transition-duration: 400ms; }
      `}</style>
    </>
  );
};
