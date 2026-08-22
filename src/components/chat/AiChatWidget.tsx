import React, { useState, useRef, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Plus, 
  ChevronDown,
  Paperclip,
  Upload,
  Send,
  LineChart,
  Activity,
  ShieldAlert,
  Target
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
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

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setMessages(prev => [...prev, { id: Date.now().toString(), role: 'user', content: trimmed }]);
    setInput('');
    setIsTyping(true);

    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'Missing Gemini API Key in environment variables.' }]);
        setIsTyping(false);
        return;
      }

      // Build context from previous messages
      const contents = messages.map(msg => ({
        role: msg.role === 'ai' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));
      contents.push({ role: 'user', parts: [{ text: trimmed }] });

      const promptSystemContext = "You are FinSight AI, an institutional-grade financial co-pilot. Keep responses concise, professional, and evidence-based. Use markdown for readability.";
      
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
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: aiResponse }]);
      } else {
        setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'Sorry, I encountered an error generating a response.' }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ai', content: 'Network or API error occurred.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  const handlePromptClick = (prompt: string) => {
    handleSend(prompt);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-[#00f0bb] hover:bg-[#00d5a6] text-[#0D1117] w-14 h-14 rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,240,187,0.3)] transition-transform hover:scale-105"
      >
        <MessageSquare className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm">
      <main className="w-full max-w-5xl flex flex-col bg-[#0D1117] rounded-3xl overflow-hidden h-[90vh] relative shadow-[0_8px_30px_rgb(0,0,0,0.5)] border border-[#30363D]">
        
        {/* Header */}
        <header className="flex justify-between items-center w-full p-6 border-b border-[#21262D]">
          <div className="flex items-center space-x-2 text-[#8B949E] text-sm font-medium hover:text-[#F0F6FC] cursor-pointer transition-colors font-heading">
            <span>FinSight V1.0</span>
            <ChevronDown className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMessages([])}
              className="bg-[#00f0bb] hover:bg-[#00d5a6] text-[#0D1117] font-heading font-semibold py-2 px-4 rounded-full flex items-center space-x-2 transition-colors shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>New Chat</span>
            </button>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-[#8B949E] hover:text-[#F0F6FC] transition-colors p-2 rounded-full hover:bg-[#21262D]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Chat Area / Hero */}
        <div className="flex-1 overflow-y-auto p-6 flex flex-col custom-scrollbar">
          {messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center pt-10 pb-16">
              {/* Hero Content */}
              <section className="flex flex-col items-center text-center space-y-6">
                <div className="w-16 h-16 bg-[#161B22] rounded-2xl flex items-center justify-center shadow-md mb-2">
                  <LineChart className="text-[#00f0bb] w-8 h-8" />
                </div>
                <div className="space-y-3">
                  <h1 className="text-4xl sm:text-5xl font-heading font-bold tracking-tight text-[#F0F6FC]">
                    Welcome to <span className="text-[#00f0bb]">FinSight AI Chat</span> —<br/>Your Financial Co-pilot.
                  </h1>
                  <p className="text-[#8B949E] text-lg max-w-2xl mx-auto font-body">
                    Analyze markets, diagnose portfolios, or strategize your next move with institutional precision.
                  </p>
                </div>
              </section>

              {/* Prompt Cards */}
              <section className="w-full max-w-4xl mx-auto mt-12 pb-12">
                <h2 className="text-[#F0F6FC] font-heading font-semibold text-xl mb-6">Explore Financial Strategies</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { title: 'Market Analysis', icon: <LineChart className="w-4 h-4 text-white" />, color: 'bg-blue-600', desc: 'Analyze current market trends, macroeconomic indicators, and sector performance.', prompt: 'Give me a brief macro analysis of the current Indian equity market.' },
                    { title: 'Portfolio Health', icon: <Activity className="w-4 h-4 text-white" />, color: 'bg-amber-500', desc: 'Assess asset allocation, diversification, and overall performance metrics of your holdings.', prompt: 'What are the key signs of an unhealthy portfolio asset allocation?' },
                    { title: 'Risk Diagnosis', icon: <ShieldAlert className="w-4 h-4 text-white" />, color: 'bg-red-600', desc: 'Identify potential vulnerabilities, stress test scenarios, and measure volatility.', prompt: 'How do I stress test my portfolio against a potential market crash?' },
                    { title: 'Strategic Planning', icon: <Target className="w-4 h-4 text-white" />, color: 'bg-emerald-600', desc: 'Develop long-term investment strategies, retirement planning, and goal setting.', prompt: 'Draft a 10-year retirement accumulation strategy for a moderate risk investor.' }
                  ].map((card, i) => (
                    <div 
                      key={i} 
                      onClick={() => handlePromptClick(card.prompt)}
                      className="bg-[#161B22] rounded-2xl p-6 shadow-md cursor-pointer hover:bg-[#21262D] transition-colors border border-transparent hover:border-[#30363D] flex flex-col justify-between h-48 group"
                    >
                      <div className={`w-10 h-10 rounded-full ${card.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                        {card.icon}
                      </div>
                      <div>
                        <h3 className="text-[#F0F6FC] font-heading font-medium mb-1">{card.title}</h3>
                        <p className="text-[#8B949E] text-xs font-body line-clamp-3">{card.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          ) : (
            <div className="flex-1 w-full max-w-4xl mx-auto space-y-6 pb-6">
              {messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] rounded-2xl p-4 ${msg.role === 'user' ? 'bg-[#00f0bb] text-[#0D1117] font-body' : 'bg-[#161B22] border border-[#30363D] text-[#F0F6FC] font-body prose prose-invert prose-p:leading-relaxed prose-pre:bg-[#0D1117] prose-pre:border prose-pre:border-[#30363D]'}`}>
                    {msg.role === 'user' ? msg.content : <ReactMarkdown>{msg.content}</ReactMarkdown>}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#161B22] border border-[#30363D] rounded-2xl p-4 flex gap-1.5 items-center">
                    <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-[#8B949E] animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="w-full bg-[#0D1117] p-6 border-t border-[#21262D]">
          <div className="w-full max-w-4xl mx-auto">
            <div className="bg-[#161B22] rounded-3xl p-2 shadow-sm border border-[#30363D] flex flex-col focus-within:border-[#00f0bb] transition-colors duration-200">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full bg-transparent text-[#F0F6FC] placeholder-[#6E7681] resize-none border-none focus:ring-0 p-4 h-28 custom-scrollbar text-lg font-body" 
                placeholder="Ask about market trends, portfolio risk, or financial strategies..."
              />
              
              <div className="flex justify-between items-center p-2 mt-2">
                {/* Tools */}
                <div className="flex items-center space-x-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
                  <button className="flex items-center space-x-2 text-sm text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] px-3 py-1.5 rounded-full transition-colors border border-[#21262D] whitespace-nowrap font-body">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>Attach</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] px-3 py-1.5 rounded-full transition-colors border border-[#21262D] whitespace-nowrap font-body">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload Data</span>
                  </button>
                  <button className="flex items-center space-x-2 text-sm text-[#8B949E] hover:text-[#F0F6FC] hover:bg-[#21262D] px-3 py-1.5 rounded-full transition-colors border border-[#21262D] whitespace-nowrap font-body">
                    <span>Strategy Styles</span>
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Send Button */}
                <button 
                  onClick={() => handleSend(input)}
                  disabled={!input.trim() || isTyping}
                  className="bg-[#00f0bb] hover:bg-[#00d5a6] disabled:opacity-50 disabled:cursor-not-allowed text-[#0D1117] w-10 h-10 rounded-full flex items-center justify-center transition-colors shadow-sm ml-4 shrink-0 focus:outline-none focus:ring-2 focus:ring-[#00f0bb] focus:ring-offset-2 focus:ring-offset-[#161B22]"
                >
                  <Send className="w-4 h-4 translate-x-[-1px] translate-y-[1px]" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </main>
      
      {/* Scrollbar styling specifically for this component */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background-color: #30363D; border-radius: 10px; }
      `}</style>
    </div>
  );
};
