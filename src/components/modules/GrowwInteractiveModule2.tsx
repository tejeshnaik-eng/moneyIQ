import React, { useState } from 'react';
import { Info, Play, Compass, ChevronRight, BarChart3, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const GrowwInteractiveModule2: React.FC = () => {
  const [mode, setMode] = useState<'explore' | 'guide'>('explore');
  const [step, setStep] = useState(1);
  const [sipSim, setSipSim] = useState<'idle' | 'ordering' | 'success'>('idle');
  const [sipAmount, setSipAmount] = useState('5000');

  const guideSteps = {
    1: { title: "Header & Core Info", desc: "Notice 'Direct' and 'Growth'. Direct schemes cut out distributor commissions (boosting returns by 1-1.5%). Growth automatically reinvests profits." },
    2: { title: "Interactive NAV & Chart", desc: "NAV is the price per unit ((Total Assets - Liabilities) / Units). Unlike stocks, it's calculated only once per day after markets close." },
    3: { title: "Key Fundamentals Grid", desc: "Min SIP shows low entry barriers. Fund Size (AUM) indicates scale. Expense Ratio is the annual fee (lower is better!)." },
    4: { title: "Holdings Breakdown", desc: "Shows where the fund's money is invested. Sector allocation and top companies reveal diversification, shielding you from single-stock crashes." },
    5: { title: "Riskometer & SEBI Dial", desc: "SEBI's 6-tier risk scale. Small-cap funds are 'Very High Risk' due to extreme market volatility compared to Large caps." },
    6: { title: "Action Box & SIP Simulator", desc: "Use Lumpsum for surplus cash during market corrections. Use SIP for disciplined, automated averaging over time. Try clicking Start SIP!" }
  };

  const getHighlight = (s: number) => {
    if (mode === 'explore') return 'hover:ring-1 hover:ring-[#333] transition-all relative';
    if (mode === 'guide') {
      if (step === s) return 'ring-2 ring-[#00D09C] relative z-[60] bg-[#1e1e1e] shadow-2xl shadow-[#00D09C]/20 scale-[1.02] transition-all';
      return 'opacity-20 pointer-events-none transition-all';
    }
  };

  return (
    <div className="bg-[#121212] rounded-[24px] p-4 lg:p-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-[20px] font-heading font-bold text-white mb-1">Decoding the Mutual Fund Interface</h2>
          <p className="text-[13px] text-[#A1A1AA]">Learn how to analyze any fund on platforms like Groww.</p>
        </div>
        <div className="flex bg-[#1E1E1E] p-1 rounded-lg shrink-0">
          <button onClick={() => { setMode('explore'); setStep(0); }} className={`px-4 py-2 rounded-md text-[13px] font-bold transition-colors ${mode === 'explore' ? 'bg-[#00D09C] text-black' : 'text-[#A1A1AA] hover:text-white'}`}>Explore Mode</button>
          <button onClick={() => { setMode('guide'); setStep(1); setSipSim('idle'); }} className={`px-4 py-2 rounded-md text-[13px] font-bold transition-colors ${mode === 'guide' ? 'bg-[#00D09C] text-black' : 'text-[#A1A1AA] hover:text-white'}`}>Guided Tour</button>
        </div>
      </div>

      {/* Guide Overlay Panel - Fixed Position */}
      {mode === 'guide' && (
        <div className="fixed bottom-8 right-8 w-[340px] bg-[#222] border border-[#00D09C] p-6 rounded-2xl shadow-2xl z-[100] animate-in slide-in-from-bottom-8">
          <h3 className="text-[#00D09C] font-heading font-bold text-[18px] mb-2">{guideSteps[step as keyof typeof guideSteps].title}</h3>
          <p className="text-white text-[14px] leading-relaxed mb-6 font-body">{guideSteps[step as keyof typeof guideSteps].desc}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-1">
              {[1,2,3,4,5,6].map(i => (
                <div key={i} className={`w-2 h-2 rounded-full transition-colors ${i === step ? 'bg-[#00D09C]' : 'bg-[#444]'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button disabled={step === 1} onClick={() => setStep(s => s - 1)} className="px-3 py-1.5 rounded-md text-[13px] font-bold text-white bg-[#333] disabled:opacity-50 hover:bg-[#444]">Back</button>
              {step < 6 ? (
                <button onClick={() => { setStep(s => s + 1); if(step === 5) setSipSim('idle'); }} className="px-3 py-1.5 rounded-md text-[13px] font-bold text-black bg-[#00D09C] hover:bg-[#00b386]">Next</button>
              ) : (
                <button onClick={() => { setMode('explore'); setSipSim('idle'); }} className="px-3 py-1.5 rounded-md text-[13px] font-bold text-white bg-[#D64545] hover:bg-red-600">Finish</button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Desktop-Wide Groww Simulation Layout */}
      <div className="w-full mx-auto relative rounded-2xl p-6 bg-[#000000] border border-[#333]">
        {/* Background Guide Overlay Dimmer */}
        {mode === 'guide' && <div className="absolute inset-0 bg-black/60 z-50 rounded-2xl pointer-events-none transition-opacity" />}

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Column: Core Info, Chart, Holdings */}
          <div className="flex-1 space-y-8">
            
            {/* 1. Header */}
            <div className={`p-5 rounded-2xl border border-[#333] bg-[#1E1E1E] ${getHighlight(1)}`}>
              <div className="flex gap-4 items-center">
                 <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-red-600 font-bold text-2xl shrink-0 shadow-sm">NI</div>
                 <div>
                   <h3 className="text-white font-heading font-bold text-[22px] leading-tight">Nippon India Small Cap Fund Direct - Growth</h3>
                   <div className="flex gap-2 mt-2 flex-wrap">
                     <span className="text-[#00D09C] bg-[#00D09C]/10 px-2.5 py-1 rounded-md text-[12px] font-bold border border-[#00D09C]/20">Equity</span>
                     <span className="text-[#00D09C] bg-[#00D09C]/10 px-2.5 py-1 rounded-md text-[12px] font-bold border border-[#00D09C]/20">Small Cap</span>
                     <span className="text-red-400 bg-red-400/10 px-2.5 py-1 rounded-md text-[12px] font-bold border border-red-400/20">Very High Risk</span>
                   </div>
                 </div>
              </div>
            </div>

            {/* 2. NAV & Chart */}
            <div className={`p-6 rounded-2xl bg-[#1E1E1E] border border-[#333] ${getHighlight(2)}`}>
              <div className="flex justify-between items-start mb-8">
                <div>
                  <p className="text-[#A1A1AA] text-[13px] mb-1">NAV • 14 Aug</p>
                  <div className="flex items-baseline gap-3">
                    <p className="text-white font-heading font-bold text-[32px]">₹168.45</p>
                    <p className="text-[#00D09C] font-bold text-[15px]">+1.2% (1D)</p>
                  </div>
                </div>
                <div className="bg-[#262626] px-3 py-1.5 rounded-lg flex items-center gap-1.5 border border-[#333]">
                  <span className="text-[#00D09C] text-[15px]">★</span>
                  <span className="text-white font-bold text-[13px]">5</span>
                </div>
              </div>
              
              <div className="h-[200px] w-full relative mb-6">
                <svg width="100%" height="100%" viewBox="0 0 800 200" preserveAspectRatio="none">
                  <path d="M0 180 Q 100 150, 200 160 T 400 120 T 600 60 T 800 20" fill="none" stroke="#00D09C" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M0 180 Q 100 150, 200 160 T 400 120 T 600 60 T 800 20 L 800 200 L 0 200 Z" fill="url(#growwGrad)" opacity="0.15" />
                  <defs>
                    <linearGradient id="growwGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#00D09C" />
                      <stop offset="100%" stopColor="#00D09C" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              
              <div className="flex gap-2">
                {['1M','6M','1Y','3Y','5Y','ALL'].map((t, i) => (
                  <button key={t} className={`flex-1 text-[13px] font-bold py-2 rounded-lg transition-colors ${i === 3 ? 'text-[#00D09C] bg-[#00D09C]/10 border border-[#00D09C]/20' : 'text-[#A1A1AA] hover:bg-[#262626]'}`}>{t}</button>
                ))}
              </div>
            </div>

            {/* 4. Holdings */}
            <div className={`bg-[#1E1E1E] p-6 rounded-2xl border border-[#333] ${getHighlight(4)}`}>
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-white font-bold text-[18px]">Holdings (82)</h4>
                <button className="text-[#00D09C] text-[14px] font-bold hover:underline">See All</button>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between text-[12px] text-[#A1A1AA] mb-2 font-medium">
                  <span>Capital Goods</span>
                  <span>Financials</span>
                  <span>Tech</span>
                  <span>Cash</span>
                </div>
                <div className="w-full h-3 rounded-full overflow-hidden flex gap-0.5 bg-[#333]">
                  <div className="bg-[#00D09C] w-[18%]"></div>
                  <div className="bg-[#2775E8] w-[14%]"></div>
                  <div className="bg-[#7757D9] w-[11%]"></div>
                  <div className="bg-[#D99A00] w-[5%]"></div>
                  <div className="bg-[#444] flex-1"></div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-[#333] pb-3">
                  <div>
                    <p className="text-white text-[15px] font-bold">HDFC Bank Ltd.</p>
                    <p className="text-[#A1A1AA] text-[12px]">Financials</p>
                  </div>
                  <p className="text-white text-[15px] font-bold">4.2%</p>
                </div>
                <div className="flex justify-between items-center border-b border-[#333] pb-3">
                  <div>
                    <p className="text-white text-[15px] font-bold">ICICI Bank Ltd.</p>
                    <p className="text-[#A1A1AA] text-[12px]">Financials</p>
                  </div>
                  <p className="text-white text-[15px] font-bold">3.8%</p>
                </div>
                <div className="flex justify-between items-center pb-1">
                  <div>
                    <p className="text-white text-[15px] font-bold">Larsen & Toubro Ltd.</p>
                    <p className="text-[#A1A1AA] text-[12px]">Capital Goods</p>
                  </div>
                  <p className="text-white text-[15px] font-bold">3.1%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Actions, Grid, Riskometer */}
          <div className="w-full lg:w-[360px] shrink-0 space-y-6">
            
            {/* 6. Action Box (SIP Simulator) */}
            <div className={`bg-[#1E1E1E] rounded-2xl border border-[#333] p-6 shadow-xl ${getHighlight(6)}`}>
               {sipSim === 'idle' && (
                  <>
                     <div className="flex bg-[#121212] rounded-xl p-1 mb-8 border border-[#333]">
                        <button className="flex-1 py-2.5 text-[14px] font-bold text-[#00D09C] bg-[#1E1E1E] rounded-lg shadow-sm">SIP</button>
                        <button className="flex-1 py-2.5 text-[14px] font-bold text-[#A1A1AA] hover:text-white transition-colors">One-Time</button>
                     </div>
                     <div className="mb-8">
                        <div className="flex justify-between items-end mb-2">
                          <p className="text-[#A1A1AA] text-[13px] font-medium">Installment amount</p>
                          <p className="text-[#00D09C] text-[11px] font-bold">Min: ₹100</p>
                        </div>
                        <div className="flex items-center border-b border-[#00D09C] py-2">
                           <span className="text-[#00D09C] text-[24px] font-medium">₹</span>
                           <input 
                             type="text" 
                             value={sipAmount} 
                             onChange={(e) => setSipAmount(e.target.value.replace(/\D/g, ''))}
                             className="bg-transparent text-white font-heading font-bold text-[32px] outline-none w-full ml-2" 
                           />
                        </div>
                     </div>
                     <button onClick={() => setSipSim('ordering')} className="w-full bg-[#00D09C] text-black rounded-[14px] py-4 text-[16px] font-bold hover:bg-[#00D09C]/90 transition-all transform hover:scale-[1.02] shadow-lg shadow-[#00D09C]/20">
                       START SIP
                     </button>
                  </>
               )}
               {sipSim === 'ordering' && (
                  <div className="animate-in fade-in zoom-in-95 duration-200">
                     <h4 className="text-white font-bold text-[18px] mb-6">Complete SIP Setup</h4>
                     <div className="bg-[#121212] p-4 rounded-xl border border-[#333] mb-4">
                        <p className="text-[#A1A1AA] text-[13px] mb-1">Amount</p>
                        <p className="text-white font-heading font-bold text-[24px]">₹{Number(sipAmount).toLocaleString('en-IN')}</p>
                     </div>
                     <div className="bg-[#121212] p-4 rounded-xl border border-[#333] mb-8 flex justify-between items-center cursor-pointer hover:bg-[#1A1A1A] transition-colors">
                        <div>
                          <p className="text-[#A1A1AA] text-[13px] mb-1">SIP Date</p>
                          <p className="text-white font-bold text-[15px]">5th of every month</p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-[#A1A1AA]" />
                     </div>
                     <button onClick={() => {
                         setSipSim('success');
                         setTimeout(() => {
                           if (mode !== 'guide') setSipSim('idle');
                         }, 4000);
                     }} className="w-full bg-[#00D09C] text-black rounded-[14px] py-4 text-[16px] font-bold hover:bg-[#00D09C]/90 shadow-lg shadow-[#00D09C]/20 transition-transform hover:scale-[1.02]">
                       Pay & Setup SIP
                     </button>
                     <button onClick={() => setSipSim('idle')} className="w-full text-[#A1A1AA] hover:text-white text-[14px] mt-4 font-bold transition-colors">
                       Cancel
                     </button>
                  </div>
               )}
               {sipSim === 'success' && (
                   <div className="animate-in fade-in zoom-in duration-300 flex flex-col items-center justify-center py-8 text-center">
                       <div className="w-20 h-20 bg-[#00D09C]/10 rounded-full flex items-center justify-center mb-6 text-[#00D09C]">
                           <CheckCircle2 className="w-10 h-10 animate-bounce" />
                       </div>
                       <h4 className="text-white font-heading font-bold text-[22px] mb-2">SIP Started!</h4>
                       <p className="text-[#A1A1AA] text-[14px] leading-relaxed">
                         Your monthly mandate for <strong className="text-white">₹{Number(sipAmount).toLocaleString('en-IN')}</strong> has been registered successfully.
                       </p>
                       <button onClick={() => setSipSim('idle')} className="w-full text-[#00D09C] hover:text-white text-[14px] mt-8 font-bold transition-colors">
                         Done
                       </button>
                   </div>
               )}
            </div>

            {/* 3. Grid */}
            <div className={`grid grid-cols-2 gap-4 ${getHighlight(3)}`}>
              <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                <p className="text-[#A1A1AA] text-[12px] font-medium mb-1.5">Min. SIP</p>
                <p className="text-white font-bold text-[16px]">₹100</p>
              </div>
              <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                <p className="text-[#A1A1AA] text-[12px] font-medium mb-1.5">Fund Size</p>
                <p className="text-white font-bold text-[16px]">₹58,400 Cr</p>
              </div>
              <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                <p className="text-[#A1A1AA] text-[12px] font-medium mb-1.5">Expense Ratio</p>
                <p className="text-white font-bold text-[16px]">0.74%</p>
              </div>
              <div className="bg-[#1E1E1E] p-4 rounded-2xl border border-[#333]">
                <p className="text-[#A1A1AA] text-[12px] font-medium mb-1.5">Exit Load</p>
                <p className="text-white font-bold text-[15px]">1.0% <span className="text-[12px] font-normal text-[#A1A1AA]">(&le;1mo)</span></p>
              </div>
            </div>

            {/* 5. Riskometer */}
            <div className={`bg-[#1E1E1E] p-5 rounded-2xl border border-[#333] flex items-center justify-between ${getHighlight(5)}`}>
              <div>
                <h4 className="text-white font-bold text-[16px] mb-1">Riskometer</h4>
                <p className="text-[#A1A1AA] text-[13px]">SEBI mandated risk level</p>
              </div>
              <div className="flex flex-col items-center relative">
                <div className="w-[80px] h-[40px] relative overflow-hidden mb-1">
                  <div className="w-[80px] h-[80px] rounded-full border-8 border-r-[#D64545] border-t-orange-400 border-l-[#00D09C] border-b-transparent transform rotate-45"></div>
                  <div className="absolute bottom-0 left-1/2 w-1.5 h-7 bg-white origin-bottom transform translate-x-[-50%] rotate-45 rounded-full"></div>
                  <div className="absolute bottom-0 left-1/2 w-3.5 h-3.5 bg-white rounded-full transform -translate-x-1/2 translate-y-1/2 shadow-md"></div>
                </div>
                <span className="text-[#D64545] text-[12px] font-bold mt-1">Very High</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
