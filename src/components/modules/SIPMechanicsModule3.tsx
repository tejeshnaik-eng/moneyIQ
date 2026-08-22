import React, { useState, useMemo } from 'react';
import { Calculator, TrendingUp, Zap, Clock, Info } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

export const SIPMechanicsModule3: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  // Tab 2 State
  const [sipAmount, setSipAmount] = useState(10000);
  const [years, setYears] = useState(15);
  const [cagr, setCagr] = useState(12);

  // Tab 3 State
  const [isStepUp, setIsStepUp] = useState(false);

  // --- Calculations for Tab 2 ---
  const compData = useMemo(() => {
    const data = [];
    const r = (cagr / 100) / 12;
    for (let y = 1; y <= years; y++) {
      const n = y * 12;
      const invested = sipAmount * 12 * y;
      const wealth = sipAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
      data.push({ 
        year: y, 
        invested: Math.round(invested), 
        wealth: Math.round(wealth),
        tippingPoint: wealth - invested > sipAmount * 12 // When annual gain > annual investment
      });
    }
    return data;
  }, [sipAmount, years, cagr]);

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  // --- RCA Data for Tab 1 ---
  const rcaData = [
    { m: 1, nav: 100, sip: 5000, units: 50.00, note: "Start" },
    { m: 2, nav: 80, sip: 5000, units: 62.50, note: "Market Dip" },
    { m: 3, nav: 60, sip: 5000, units: 83.33, note: "Market Crash!" },
    { m: 4, nav: 75, sip: 5000, units: 66.67, note: "Recovery begins" },
    { m: 5, nav: 90, sip: 5000, units: 55.56, note: "Recovery" },
    { m: 6, nav: 100, sip: 5000, units: 50.00, note: "Back to par" },
  ];
  const rcaTotalUnits = rcaData.reduce((acc, curr) => acc + curr.units, 0);
  const rcaTotalInvested = 30000;
  const rcaFinalValue = rcaTotalUnits * 100;
  const rcaAvgCost = rcaTotalInvested / rcaTotalUnits;
  
  const lumpsumUnits = 300; // 30k / 100
  const lumpsumValue = lumpsumUnits * 100;

  return (
    <div className="bg-[#121212] rounded-[24px] border border-[#333] p-4 lg:p-8 relative">
      <div className="mb-8">
        <h2 className="text-[24px] font-heading font-bold text-white mb-2">The Mechanics of SIP & Compounding</h2>
        <p className="text-[14px] text-[#A1A1AA]">Master Rupee Cost Averaging, exponential math, and the Groww execution lifecycle.</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 p-1 bg-[#1E1E1E] rounded-xl border border-[#333]">
        {[
          { id: 1, label: "Rupee Cost Averaging", icon: TrendingUp },
          { id: 2, label: "Compounding Engine", icon: Calculator },
          { id: 3, label: "Step-Up SIP", icon: Zap },
          { id: 4, label: "Order Lifecycle", icon: Clock },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[150px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-[13px] font-bold transition-all ${activeTab === tab.id ? 'bg-[#333] text-white shadow-sm' : 'text-[#A1A1AA] hover:text-white hover:bg-[#262626]'}`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        
        {/* TAB 1: RCA */}
        {activeTab === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-6 mb-6">
              <h3 className="text-white font-bold text-[18px] mb-4">6-Month Volatile Market Cycle</h3>
              <p className="text-[#A1A1AA] text-[14px] mb-6">Observe how a falling NAV allows the same ₹5,000 to accumulate more units.</p>
              
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-[#333] text-[#8A8F98] text-[12px] uppercase tracking-wider">
                      <th className="pb-3 pl-4">Month</th>
                      <th className="pb-3 text-right">NAV</th>
                      <th className="pb-3 text-right">SIP Amount</th>
                      <th className="pb-3 text-right">Units Allotted</th>
                      <th className="pb-3 pl-6">Market Context</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rcaData.map((r, idx) => (
                      <tr key={idx} className="border-b border-[#222] hover:bg-[#262626] transition-colors">
                        <td className="py-4 pl-4 text-white font-bold">{r.m}</td>
                        <td className="py-4 text-right text-white font-mono">₹{r.nav}</td>
                        <td className="py-4 text-right text-[#A1A1AA] font-mono">₹{r.sip.toLocaleString()}</td>
                        <td className="py-4 text-right text-[#00D09C] font-mono font-bold">+{r.units.toFixed(2)}</td>
                        <td className="py-4 pl-6 text-[#A1A1AA] text-[13px]">{r.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#121212] rounded-xl p-5 border border-[#333]">
                  <h4 className="text-[#A1A1AA] text-[13px] font-bold uppercase tracking-widest mb-4">Investor A: Lumpsum</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-[#71717A] text-[14px]">Invested (Day 1)</span><span className="text-white font-bold">₹30,000</span></div>
                    <div className="flex justify-between"><span className="text-[#71717A] text-[14px]">Total Units</span><span className="text-white font-bold">{lumpsumUnits.toFixed(2)}</span></div>
                    <div className="flex justify-between pt-3 border-t border-[#333]"><span className="text-white font-bold">Final Value (M6)</span><span className="text-white font-bold">₹{lumpsumValue.toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[#71717A] text-[14px]">Net Return</span><span className="text-[#8A8F98] font-bold">0.00%</span></div>
                  </div>
                </div>
                
                <div className="bg-[#00D09C]/10 rounded-xl p-5 border border-[#00D09C]/30 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D09C]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <h4 className="text-[#00D09C] text-[13px] font-bold uppercase tracking-widest mb-4">Investor B: SIP</h4>
                  <div className="space-y-3 relative z-10">
                    <div className="flex justify-between"><span className="text-[#71717A] text-[14px]">Invested (Spread)</span><span className="text-white font-bold">₹30,000</span></div>
                    <div className="flex justify-between"><span className="text-[#71717A] text-[14px]">Total Units</span><span className="text-[#00D09C] font-bold">{rcaTotalUnits.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-[#71717A] text-[14px]">Average Cost</span><span className="text-white font-bold">₹{rcaAvgCost.toFixed(2)} / unit</span></div>
                    <div className="flex justify-between pt-3 border-t border-[#00D09C]/20"><span className="text-white font-bold">Final Value (M6)</span><span className="text-white font-bold">₹{Math.round(rcaFinalValue).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-[#71717A] text-[14px]">Net Return</span><span className="text-[#00D09C] font-bold">+22.69%</span></div>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-[#2775E8]/10 text-[#2775E8] p-4 rounded-xl text-[14px] font-medium flex items-start gap-3 border border-[#2775E8]/20">
                <Info className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Core Takeaway:</strong> SIP turns market crashes into unit-accumulation opportunities. Because Investor B bought through the dip, their average purchase price dropped to ₹81.51, making them highly profitable when the market simply returned to par.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Compounding */}
        {activeTab === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#1E1E1E] border border-[#333] p-5 rounded-2xl">
                  <h3 className="text-white font-bold text-[16px] mb-6">Compounding Parameters</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[13px] text-[#A1A1AA]">Monthly SIP</label>
                        <span className="text-white font-bold font-mono">{formatCurrency(sipAmount)}</span>
                      </div>
                      <input type="range" min="500" max="100000" step="500" value={sipAmount} onChange={e => setSipAmount(Number(e.target.value))} className="w-full accent-[#00D09C]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[13px] text-[#A1A1AA]">Time Horizon</label>
                        <span className="text-white font-bold font-mono">{years} Years</span>
                      </div>
                      <input type="range" min="1" max="30" step="1" value={years} onChange={e => setYears(Number(e.target.value))} className="w-full accent-[#00D09C]" />
                    </div>

                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[13px] text-[#A1A1AA]">Expected CAGR</label>
                        <span className="text-white font-bold font-mono">{cagr}%</span>
                      </div>
                      <input type="range" min="8" max="20" step="1" value={cagr} onChange={e => setCagr(Number(e.target.value))} className="w-full accent-[#00D09C]" />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1E1E1E] border border-[#333] p-5 rounded-2xl">
                  <h4 className="text-[12px] font-heading font-bold text-[#8A8F98] uppercase tracking-widest mb-3">The Mathematics</h4>
                  <div className="bg-[#121212] p-4 rounded-xl border border-[#333] font-mono text-[13px] text-[#00D09C] overflow-x-auto whitespace-nowrap">
                    A = P × [((1 + i)ⁿ - 1) / i] × (1 + i)
                  </div>
                  <ul className="text-[12px] text-[#A1A1AA] mt-3 space-y-1.5">
                    <li><strong className="text-white">P</strong> = Monthly Installment</li>
                    <li><strong className="text-white">i</strong> = Monthly Return Rate</li>
                    <li><strong className="text-white">n</strong> = Total Installments</li>
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-2 bg-[#1E1E1E] border border-[#333] p-6 rounded-2xl flex flex-col">
                <h3 className="text-white font-bold text-[18px] mb-6">Time in Market Visualizer</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="bg-[#121212] p-4 rounded-xl border border-[#333]">
                    <p className="text-[#A1A1AA] text-[13px] mb-1">Total Invested</p>
                    <p className="text-white font-heading font-bold text-[24px]">{formatCurrency(compData[compData.length - 1].invested)}</p>
                  </div>
                  <div className="bg-[#00D09C]/10 p-4 rounded-xl border border-[#00D09C]/30">
                    <p className="text-[#00D09C] text-[13px] font-bold mb-1">Total Wealth Generated</p>
                    <p className="text-white font-heading font-bold text-[24px]">{formatCurrency(compData[compData.length - 1].wealth)}</p>
                  </div>
                </div>

                <div className="flex-1 min-h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={compData} margin={{ top: 10, right: 0, left: 20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorWealth" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#00D09C" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#00D09C" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                      <XAxis dataKey="year" stroke="#8A8F98" tick={{fontSize: 12}} tickFormatter={(v) => `Yr ${v}`} />
                      <YAxis stroke="#8A8F98" tick={{fontSize: 12}} tickFormatter={(v) => `₹${(v/100000).toFixed(0)}L`} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1E1E1E', borderColor: '#333', borderRadius: '12px', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(val: any, name: any) => [formatCurrency(Number(val)), String(name).charAt(0).toUpperCase() + String(name).slice(1)]}
                        labelFormatter={(l) => `Year ${l}`}
                      />
                      <Area type="monotone" dataKey="invested" stroke="#EB5B3C" strokeWidth={2} fill="transparent" />
                      <Area type="monotone" dataKey="wealth" stroke="#00D09C" strokeWidth={3} fillOpacity={1} fill="url(#colorWealth)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-center gap-6 text-[12px] text-[#A1A1AA]">
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#EB5B3C] rounded-sm"></div> Total Invested</div>
                  <div className="flex items-center gap-2"><div className="w-3 h-3 bg-[#00D09C] rounded-sm"></div> Total Wealth</div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 3: Step-Up SIP */}
        {activeTab === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-white font-bold text-[20px] mb-1">Step-Up SIP: The Wealth Accelerator</h3>
                  <p className="text-[#A1A1AA] text-[14px]">Increase your SIP by 10% annually inline with salary hikes.</p>
                </div>
                <div className="bg-[#121212] p-1.5 rounded-xl border border-[#333] flex items-center shrink-0">
                  <button onClick={() => setIsStepUp(false)} className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-colors ${!isStepUp ? 'bg-[#333] text-white' : 'text-[#A1A1AA]'}`}>Normal SIP</button>
                  <button onClick={() => setIsStepUp(true)} className={`px-4 py-2 rounded-lg text-[14px] font-bold transition-colors ${isStepUp ? 'bg-[#00D09C] text-black' : 'text-[#A1A1AA]'}`}>10% Step-Up</button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                
                <div className={`p-6 rounded-2xl border transition-all duration-500 ${!isStepUp ? 'bg-[#121212] border-[#00D09C] shadow-[0_0_30px_rgba(0,208,156,0.1)] scale-100' : 'bg-[#1A1A1A] border-[#333] scale-95 opacity-50 grayscale'}`}>
                  <h4 className="text-white font-bold text-[18px] mb-6">Static ₹10,000 / mo</h4>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[#A1A1AA] text-[13px] mb-1">Total Invested (15 Yrs)</p>
                      <p className="text-white font-heading font-bold text-[28px]">₹18.0L</p>
                    </div>
                    <div>
                      <p className="text-[#A1A1AA] text-[13px] mb-1">Estimated Wealth @ 12%</p>
                      <p className="text-[#00D09C] font-heading font-bold text-[36px]">₹50.5L</p>
                    </div>
                  </div>
                </div>

                <div className={`p-6 rounded-2xl border transition-all duration-500 ${isStepUp ? 'bg-[#121212] border-[#00D09C] shadow-[0_0_30px_rgba(0,208,156,0.1)] scale-100' : 'bg-[#1A1A1A] border-[#333] scale-95 opacity-50 grayscale'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <h4 className="text-white font-bold text-[18px]">Starts at ₹10,000 / mo</h4>
                    <span className="bg-[#00D09C]/10 text-[#00D09C] text-[11px] font-bold px-2 py-1 rounded border border-[#00D09C]/20">+10% Yearly</span>
                  </div>
                  <div className="space-y-6">
                    <div>
                      <p className="text-[#A1A1AA] text-[13px] mb-1">Total Invested (15 Yrs)</p>
                      <p className="text-white font-heading font-bold text-[28px]">₹38.1L</p>
                    </div>
                    <div>
                      <p className="text-[#A1A1AA] text-[13px] mb-1">Estimated Wealth @ 12%</p>
                      <p className="text-[#00D09C] font-heading font-bold text-[36px]">₹88.4L</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="mt-8 bg-[#121212] p-5 rounded-xl border border-[#333]">
                <h4 className="text-[#00D09C] font-bold text-[15px] mb-2 flex items-center gap-2"><Zap className="w-5 h-5" /> Pedagogical Insight</h4>
                <p className="text-[#C4C4C4] text-[14px] leading-relaxed">
                  By simply increasing your SIP by 10% every year (aligning it with your annual salary hike), you invest roughly double the principal over 15 years, but your final wealth explodes from <strong className="text-white">₹50.5L to ₹88.4L</strong>. It drastically cuts down the time needed to reach financial independence without feeling like a burden today.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: Groww Order Lifecycle */}
        {activeTab === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#1E1E1E] border border-[#333] rounded-2xl p-6 lg:p-10 mb-6">
              <h3 className="text-white font-bold text-[20px] mb-8">The Groww SIP Order Journey</h3>
              
              <div className="relative border-l-2 border-[#333] ml-4 space-y-10 pb-4">
                
                <div className="relative pl-8">
                  <div className="absolute w-8 h-8 bg-[#121212] border-2 border-[#00D09C] rounded-full left-[-17px] top-0 flex items-center justify-center font-bold text-[#00D09C] text-[14px]">1</div>
                  <h4 className="text-white font-bold text-[18px] mb-2">Mandate Creation (e-NACH)</h4>
                  <p className="text-[#A1A1AA] text-[14px] leading-relaxed mb-3">When you set up your first SIP, Groww registers a one-time mandate through NPCI with your bank via NetBanking or UPI Autopay. This grants permission for recurring automated deductions.</p>
                  <div className="bg-[#121212] p-3 rounded-lg border border-[#333] inline-block text-[12px] text-[#8A8F98]">No manual OTP required every month.</div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-8 h-8 bg-[#121212] border-2 border-[#00D09C] rounded-full left-[-17px] top-0 flex items-center justify-center font-bold text-[#00D09C] text-[14px]">2</div>
                  <h4 className="text-white font-bold text-[18px] mb-2">Auto-Debit Execution</h4>
                  <p className="text-[#A1A1AA] text-[14px] leading-relaxed mb-3">On your selected SIP date (e.g., 5th of every month), the bank automatically debits the chosen SIP amount and sends it to the clearing corporation.</p>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-8 h-8 bg-[#121212] border-2 border-[#00D09C] rounded-full left-[-17px] top-0 flex items-center justify-center font-bold text-[#00D09C] text-[14px]">3</div>
                  <h4 className="text-white font-bold text-[18px] mb-2">T+1 Settlement & Unit Allocation</h4>
                  <p className="text-[#A1A1AA] text-[14px] leading-relaxed mb-4">Mutual funds don't trade instantly like stocks. They are allocated based on daily NAV cut-off timings mandated by SEBI.</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#121212] p-4 rounded-xl border border-[#333]">
                      <span className="text-[#00D09C] font-bold text-[13px] block mb-1">Before 2:00 PM IST</span>
                      <span className="text-white text-[13px]">Money received by AMC early. You get the <strong>same day's</strong> closing NAV.</span>
                    </div>
                    <div className="bg-[#121212] p-4 rounded-xl border border-[#333]">
                      <span className="text-[#EB5B3C] font-bold text-[13px] block mb-1">After 2:00 PM IST</span>
                      <span className="text-white text-[13px]">Money hits AMC late. You get the <strong>next business day's</strong> closing NAV.</span>
                    </div>
                  </div>
                </div>

                <div className="relative pl-8">
                  <div className="absolute w-8 h-8 bg-[#121212] border-2 border-[#00D09C] rounded-full left-[-17px] top-0 flex items-center justify-center font-bold text-[#00D09C] text-[14px]">4</div>
                  <h4 className="text-white font-bold text-[18px] mb-2">CAS Generation</h4>
                  <p className="text-[#A1A1AA] text-[14px] leading-relaxed">Units reflect in your Groww dashboard within T+1 to T+2 days. A Consolidated Account Statement (CAS) is generated by registrars like CAMS or KFintech tracking your official ownership.</p>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
