import React, { useState, useEffect, useRef } from 'react';
import { Send, Sparkles, Loader2, AlertTriangle, X, ShieldAlert } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { exampleHypeClaims } from '../../data/exampleHypeClaims';

interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
}

export const HypeDetectorModule: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'ai',
      content: "Hello. I am the FinSight Regulatory Auditor.\n\nPaste any viral social media claim, Telegram tip, or finfluencer pitch below. I will evaluate it against official SEBI & RBI regulatory realities, exposing hidden risks and mathematical facts."
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isAuditing, setIsAuditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: trimmed };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsAuditing(true);
    setErrorMessage(null);

    try {
      const apiKey = (import.meta as any).env.VITE_GEMINI_API_KEY || (import.meta as any).env.GEMINI_API_KEY;
      if (!apiKey) throw new Error("Gemini API key is missing from environment variables. Please check your .env file.");

      const prompt = `You are a strict Indian financial regulatory auditor (SEBI & RBI) acting as a conversational fact-checking assistant. 
The user has provided this financial claim or question: "${trimmed}".

Respond directly to the user in a professional, firm, and evidence-based tone.
1. Immediately state whether this is High Risk, Flawed, Verified, or requires Caution.
2. Provide the SEBI/RBI regulatory ground truth regarding this claim.
3. Expose the mathematical reality (hidden costs, taxes, probability of loss).
4. Suggest a rational, evidence-based alternative strategy.

Keep it concise, strictly structured, and use standard markdown for bolding/bullet points. Do not use generic pleasantries.`;

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
          }
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to fetch from Gemini API");
      }

      const textOutput = data.candidates[0].content.parts[0].text;
      
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: textOutput };
      setMessages(prev => [...prev, aiMsg]);
      
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setIsAuditing(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] pb-4">
      {errorMessage && (
        <div className="flex items-start gap-3 p-4 mb-4 rounded-xl bg-[#ba1a1a] text-white shadow-sm shrink-0">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-xs font-medium leading-relaxed flex-1">{errorMessage}</p>
          <button onClick={() => setErrorMessage(null)} className="hover:opacity-70 transition-opacity shrink-0">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-[var(--app-border)] pb-4 mb-4 shrink-0">
        <span className="text-xs font-mono text-[var(--primary-dim)] font-bold uppercase tracking-widest block">
          REGULATORY FACT VERIFICATION LAYER
        </span>
        <h3 className="text-2xl font-heading font-extrabold text-[var(--app-text)] mt-1.5 flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-[var(--primary-dim)]" />
          FinSight Hype Auditor
        </h3>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto pr-2 space-y-6 flex flex-col">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div 
              className={`max-w-[85%] rounded-2xl p-5 ${
                msg.role === 'user' 
                  ? 'bg-[var(--primary-dim)] text-white rounded-br-none' 
                  : 'bg-[var(--app-surface)] border border-[var(--app-border)] text-[var(--app-text)] rounded-bl-none shadow-sm'
              }`}
            >
              {msg.role === 'ai' && (
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-[var(--app-border)]">
                  <div className="w-6 h-6 rounded-full bg-[var(--primary-dim)]/10 flex items-center justify-center">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--primary-dim)]" />
                  </div>
                  <span className="text-[10px] font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-widest">
                    Auditor AI
                  </span>
                </div>
              )}
              
              <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${msg.role === 'user' ? 'text-white' : 'text-[var(--app-text)]'}`}>
                {msg.role === 'ai' ? (
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                ) : (
                  msg.content
                )}
              </div>
            </div>
          </div>
        ))}
        {isAuditing && (
          <div className="flex justify-start">
            <div className="bg-[var(--app-surface)] border border-[var(--app-border)] rounded-2xl rounded-bl-none p-5 flex items-center gap-3 shadow-sm">
              <Loader2 className="w-5 h-5 text-[var(--primary)] animate-spin" />
              <span className="text-xs font-medium text-[var(--app-text-muted)]">Analyzing regulatory records...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="pt-4 mt-auto shrink-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-[10px] font-heading font-bold text-[var(--app-text-muted)] uppercase tracking-wider block w-full">
            Quick Tests:
          </span>
          {exampleHypeClaims.slice(0, 3).map((claim) => (
            <button
              key={claim.id}
              type="button"
              onClick={() => handleSend(claim.quote)}
              className="text-[11px] px-3 py-1.5 rounded-full border border-[var(--app-border)] bg-[var(--app-surface)] text-[var(--app-text-muted)] hover:bg-[var(--app-surface-alt)] hover:border-[#bbcac3] transition-colors whitespace-nowrap"
            >
              {claim.title}
            </button>
          ))}
        </div>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(inputValue); }} 
          className="relative flex items-center"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            disabled={isAuditing}
            placeholder="Paste a viral claim, finfluencer tip, or trading strategy..."
            className="w-full pl-5 pr-14 py-4 bg-[var(--app-surface)] border border-[var(--app-border)] rounded-xl text-sm text-[var(--app-text)] placeholder-[#565e74]/50 focus:border-[var(--primary)] focus:ring-1 focus:ring-[#00b090] outline-none transition-all shadow-sm disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={isAuditing || !inputValue.trim()}
            className="absolute right-2 p-2 bg-[var(--primary-dim)] text-white rounded-lg hover:bg-[#005a49] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
