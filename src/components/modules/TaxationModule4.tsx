import React, { useState } from 'react';
import { FileText, Calculator, ArrowDown, Download, CheckCircle2, Info, Layers, Scale, Flame, AlertTriangle } from 'lucide-react';

export const TaxationModule4: React.FC = () => {
  const [activeTab, setActiveTab] = useState(1);

  // Tab 2 State (FIFO)
  const [redeemMonths, setRedeemMonths] = useState(9); // Redeem 50% = 9 months

  // Tab 3 State (Harvesting)
  const [unrealizedGains, setUnrealizedGains] = useState(250000);
  const taxSaved = Math.min(unrealizedGains, 125000) * 0.125;

  const formatCurrency = (val: number) => '₹' + val.toLocaleString('en-IN', { maximumFractionDigits: 0 });

  return (
    <div className="bg-[#121212] rounded-[24px] p-4 lg:p-8 relative">
      <div className="mb-8">
        <h2 className="text-[24px] font-heading font-bold text-white mb-2">Mutual Fund Taxation & Redemption Engineering</h2>
        <p className="text-[14px] text-[#A1A1AA]">Master tax classifications, FIFO rules, and smart redemption strategies to maximize net returns.</p>
      </div>

      {/* Tabs - No borders, simple solid background toggle */}
      <div className="flex flex-wrap gap-2 mb-8 bg-[#161616] p-1 rounded-xl">
        {[
          { id: 1, label: "Tax Classification", icon: Scale },
          { id: 2, label: "FIFO Simulator", icon: Layers },
          { id: 3, label: "Tax Harvesting", icon: Calculator },
          { id: 4, label: "Exit Load Waterfall", icon: ArrowDown },
          { id: 5, label: "ITR Guide", icon: FileText },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-[12px] font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-[#222222] text-white shadow-sm' 
                : 'text-[#A1A1AA] hover:text-white hover:bg-[#1A1A1A]'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="min-h-[450px]">
        
        {/* TAB 1: TAX CLASSIFICATION MATRIX */}
        {activeTab === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
            <h3 className="text-white font-bold text-[18px]">Asset Class Tax Matrix (FY 2024-25)</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Equity */}
              <div className="bg-[#161616] rounded-2xl p-6">
                <h4 className="text-white font-bold text-[16px] mb-2">Equity-Oriented Funds</h4>
                <p className="text-[#A1A1AA] text-[12px] mb-6">≥65% invested in domestic equity.</p>
                
                <div className="space-y-4">
                  <div className="bg-[#111111] p-4 rounded-xl">
                    <div className="text-[#A1A1AA] font-bold text-[13px] mb-1">STCG (≤ 12 Months)</div>
                    <div className="text-white text-[20px] font-mono font-bold">20.0%</div>
                    <div className="text-[#71717A] text-[11px] mt-1">Flat rate (Section 111A)</div>
                  </div>
                  <div className="bg-[#111111] p-4 rounded-xl">
                    <div className="text-[#A1A1AA] font-bold text-[13px] mb-1">LTCG (&gt; 12 Months)</div>
                    <div className="text-white text-[20px] font-mono font-bold">12.5%</div>
                    <div className="text-white text-[11px] mt-2 font-bold bg-[#222222] inline-block px-2 py-1 rounded">First ₹1.25L is Tax-Free</div>
                  </div>
                </div>
              </div>

              {/* Debt */}
              <div className="bg-[#161616] rounded-2xl p-6">
                <h4 className="text-white font-bold text-[16px] mb-2">Pure Debt Funds</h4>
                <p className="text-[#A1A1AA] text-[12px] mb-6">≤35% equity (Purchased after Apr '23).</p>
                
                <div className="space-y-4">
                  <div className="bg-[#111111] p-4 rounded-xl h-full flex flex-col justify-center">
                    <div className="text-[#A1A1AA] font-bold text-[13px] mb-1">Taxed at Slab Rate</div>
                    <div className="text-[#E4E4E7] text-[14px] leading-relaxed mt-2 mb-3">Added directly to your taxable income regardless of holding duration.</div>
                    <div className="text-white text-[11px] mt-auto font-bold bg-[#222222] inline-block px-2 py-1 rounded self-start">No Indexation Benefit</div>
                  </div>
                </div>
              </div>

              {/* Hybrid */}
              <div className="bg-[#161616] rounded-2xl p-6">
                <h4 className="text-white font-bold text-[16px] mb-2">Specified Hybrid</h4>
                <p className="text-[#A1A1AA] text-[12px] mb-6">35% to 65% domestic equity.</p>
                
                <div className="space-y-4">
                  <div className="bg-[#111111] p-4 rounded-xl">
                    <div className="text-[#A1A1AA] font-bold text-[13px] mb-1">STCG (≤ 24 Months)</div>
                    <div className="text-white text-[16px] font-bold">Income Slab Rate</div>
                  </div>
                  <div className="bg-[#111111] p-4 rounded-xl">
                    <div className="text-[#A1A1AA] font-bold text-[13px] mb-1">LTCG (&gt; 24 Months)</div>
                    <div className="text-white text-[20px] font-mono font-bold">12.5%</div>
                    <div className="text-[#71717A] text-[11px] mt-1">No indexation</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: FIFO SIMULATOR */}
        {activeTab === 2 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#161616] rounded-2xl p-6 lg:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                  <h3 className="text-white font-bold text-[20px] mb-2">FIFO SIP Redemption Simulator</h3>
                  <p className="text-[#A1A1AA] text-[14px] max-w-2xl">When redeeming units from an ongoing SIP, the AMC sells your oldest units first (First-In, First-Out). This directly impacts your tax liability.</p>
                </div>
                <div className="bg-[#111111] p-4 rounded-xl min-w-[200px]">
                  <p className="text-[#A1A1AA] text-[12px] mb-3">Redeem Units: <strong className="text-white">{redeemMonths} Months</strong></p>
                  <input 
                    type="range" min="1" max="18" value={redeemMonths} 
                    onChange={e => setRedeemMonths(Number(e.target.value))}
                    className="w-full accent-white" 
                  />
                </div>
              </div>

              <div className="bg-[#111111] rounded-xl p-6 mb-6 overflow-x-auto">
                <div className="flex items-center gap-6 mb-6 min-w-[600px]">
                  <div className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><div className="w-3 h-3 bg-[#222222] rounded-sm"></div> LTCG Eligible (&gt;12m)</div>
                  <div className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><div className="w-3 h-3 bg-[#1A1A1A] rounded-sm"></div> STCG Vulnerable (&le;12m)</div>
                  <div className="flex items-center gap-2 text-[12px] text-white ml-auto"><div className="w-3 h-3 bg-white rounded-sm"></div> Redeemed</div>
                </div>

                <div className="grid grid-cols-6 md:grid-cols-9 gap-3 min-w-[600px]">
                  {Array.from({ length: 18 }).map((_, i) => {
                    const monthNumber = i + 1;
                    const isLtcg = monthNumber <= 12; // Oldest 12 months
                    const isRedeemed = monthNumber <= redeemMonths; // Redeemed from oldest first

                    return (
                      <div 
                        key={i} 
                        className={`relative h-20 rounded-lg flex flex-col items-center justify-center transition-all duration-300 ${
                          isRedeemed 
                            ? 'bg-white' 
                            : isLtcg 
                              ? 'bg-[#222222]' 
                              : 'bg-[#1A1A1A]'
                        }`}
                      >
                        <span className={`text-[11px] font-bold uppercase tracking-wider ${isRedeemed ? 'text-black' : 'text-[#71717A]'}`}>M-{monthNumber}</span>
                        <span className={`text-[10px] mt-1 ${isRedeemed ? 'text-[#333333]' : 'text-[#555555]'}`}>
                          {isLtcg ? 'LTCG' : 'STCG'}
                        </span>
                        
                        {isRedeemed && (
                          <div className="absolute -top-2 -right-2 bg-black rounded-full p-0.5">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#111111] rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[#A1A1AA] text-[12px] uppercase tracking-wider mb-1">Units Sold triggering LTCG</p>
                    <p className="text-white font-bold text-[20px]">{Math.min(redeemMonths, 12)} Months</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#71717A] max-w-[120px]">Taxed at 12.5% (post ₹1.25L limit)</p>
                  </div>
                </div>
                <div className="bg-[#111111] rounded-xl p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[#A1A1AA] text-[12px] uppercase tracking-wider mb-1">Units Sold triggering STCG</p>
                    <p className="text-white font-bold text-[20px]">{Math.max(0, redeemMonths - 12)} Months</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] text-[#71717A] max-w-[120px]">Taxed heavily at flat 20.0%</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: TAX HARVESTING */}
        {activeTab === 3 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="bg-[#161616] rounded-2xl p-6 lg:p-8 mb-6">
                <h3 className="text-white font-bold text-[20px] mb-2">Tax-Gain Harvesting Playground</h3>
                <p className="text-[#A1A1AA] text-[14px] mb-8">Sell and immediately repurchase units every financial year to realize exactly ₹1.25L of Long-Term gains completely tax-free, artificially resetting your acquisition cost base.</p>
                
                <div className="bg-[#111111] rounded-xl p-6 md:p-8">
                  <div className="flex flex-col md:flex-row justify-between mb-8 gap-6">
                    <div className="flex-1">
                      <label className="text-[#A1A1AA] text-[13px] uppercase tracking-wider font-bold mb-3 block">Unrealized Long-Term Gains</label>
                      <div className="text-white font-mono text-[32px] font-bold mb-4">{formatCurrency(unrealizedGains)}</div>
                      <input 
                        type="range" min="0" max="500000" step="5000" 
                        value={unrealizedGains} 
                        onChange={e => setUnrealizedGains(Number(e.target.value))}
                        className="w-full accent-white" 
                      />
                    </div>

                    <div className="md:w-[2px] bg-[#1A1A1A] hidden md:block"></div>

                    <div className="flex-1 space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-[#222222]">
                        <span className="text-[#A1A1AA] text-[14px]">Tax without Harvesting</span>
                        <span className="text-white font-mono font-bold text-[18px]">
                          {formatCurrency(Math.max(0, unrealizedGains - 125000) * 0.125)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pb-4 border-b border-[#222222]">
                        <span className="text-[#A1A1AA] text-[14px]">Tax with Harvesting (₹1.25L booked)</span>
                        <span className="text-white font-mono font-bold text-[18px]">
                          {formatCurrency(Math.max(0, unrealizedGains - 125000 - 125000) * 0.125 > 0 ? Math.max(0, unrealizedGains - 125000 - 125000) * 0.125 : 0)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center bg-[#222222] p-4 rounded-lg">
                        <span className="text-white font-bold text-[14px]">Absolute Tax Saved</span>
                        <span className="text-white font-mono font-bold text-[20px]">+{formatCurrency(taxSaved)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111111] p-5 rounded-xl">
                    <h4 className="text-white font-bold text-[14px] mb-2 flex items-center gap-2">
                      <ArrowDown className="w-4 h-4 text-[#A1A1AA]" /> STCL (Short-Term Capital Loss)
                    </h4>
                    <p className="text-[#A1A1AA] text-[12px] leading-relaxed">Highly versatile. Can be used to offset and neutralize both Short-Term Capital Gains (STCG) AND Long-Term Capital Gains (LTCG) in the same financial year.</p>
                  </div>
                  <div className="bg-[#111111] p-5 rounded-xl">
                    <h4 className="text-white font-bold text-[14px] mb-2 flex items-center gap-2">
                      <ArrowDown className="w-4 h-4 text-[#A1A1AA]" /> LTCL (Long-Term Capital Loss)
                    </h4>
                    <p className="text-[#A1A1AA] text-[12px] leading-relaxed">Restrictive. Can strictly ONLY be used to offset Long-Term Capital Gains (LTCG). Cannot be used against STCG or regular income.</p>
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* TAB 4: PAYOUT WATERFALL */}
        {activeTab === 4 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#161616] rounded-2xl p-6 lg:p-10 mb-6">
              <h3 className="text-white font-bold text-[20px] mb-8">Exit Load & Final Payout Waterfall</h3>
              
              <div className="max-w-2xl mx-auto">
                <div className="bg-[#111111] rounded-2xl p-6 mb-4">
                  
                  {/* Step 1 */}
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <p className="text-white font-bold text-[16px]">Gross Redemption Value</p>
                      <p className="text-[#71717A] text-[12px]">Total NAV × Units Sold</p>
                    </div>
                    <p className="text-white font-mono font-bold text-[20px]">₹1,00,000.00</p>
                  </div>

                  {/* Deductions */}
                  <div className="space-y-6 pl-6 border-l-2 border-[#222222] ml-2 mb-8">
                    <div className="flex justify-between items-center relative">
                      <div className="absolute w-2 h-2 rounded-full bg-[#555555] -left-[29px] top-1/2 -translate-y-1/2"></div>
                      <div>
                        <p className="text-[#E4E4E7] text-[14px]">Exit Load <span className="bg-[#222222] text-[#A1A1AA] text-[10px] px-1.5 py-0.5 rounded ml-1">1.0%</span></p>
                        <p className="text-[#71717A] text-[11px]">(Sold within 365 days)</p>
                      </div>
                      <p className="text-[#A1A1AA] font-mono text-[14px]">- ₹1,000.00</p>
                    </div>

                    <div className="flex justify-between items-center relative">
                      <div className="absolute w-2 h-2 rounded-full bg-[#555555] -left-[29px] top-1/2 -translate-y-1/2"></div>
                      <div>
                        <p className="text-[#E4E4E7] text-[14px]">STT (Securities Txn Tax)</p>
                        <p className="text-[#71717A] text-[11px]">0.001% on equity redemption</p>
                      </div>
                      <p className="text-[#A1A1AA] font-mono text-[14px]">- ₹1.00</p>
                    </div>

                    <div className="flex justify-between items-center relative">
                      <div className="absolute w-2 h-2 rounded-full bg-[#555555] -left-[29px] top-1/2 -translate-y-1/2"></div>
                      <div>
                        <p className="text-[#E4E4E7] text-[14px]">TDS Deduction</p>
                        <p className="text-[#71717A] text-[11px]">0% for Resident Indians</p>
                      </div>
                      <p className="text-[#A1A1AA] font-mono text-[14px]">- ₹0.00</p>
                    </div>
                  </div>

                  {/* Final Net */}
                  <div className="border-t border-[#222222] pt-6 flex justify-between items-center">
                    <div>
                      <p className="text-white font-bold text-[18px]">Net Bank Credit</p>
                      <p className="text-[#A1A1AA] text-[12px]">T+2 Working Days Settlement</p>
                    </div>
                    <p className="text-white font-mono font-bold text-[28px]">₹98,999.00</p>
                  </div>
                </div>

                <div className="bg-[#1A1A1A] p-4 rounded-xl text-[13px] flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#A1A1AA] shrink-0 mt-0.5" />
                  <p className="text-[#A1A1AA]"><strong>Note:</strong> Stamp duty (0.005%) is levied only during purchase (allotment), not during redemption. Exit loads are deducted from the applicable NAV prior to multiplying by your redeemed units.</p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 5: ITR GUIDE */}
        {activeTab === 5 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-[#161616] rounded-2xl p-6 lg:p-8 mb-6">
              <div className="flex justify-between items-center mb-8 border-b border-[#222222] pb-6">
                <div>
                  <h3 className="text-white font-bold text-[20px] mb-2">Groww Tax Report & ITR Filing</h3>
                  <p className="text-[#A1A1AA] text-[14px]">How to report your capital gains legally and accurately.</p>
                </div>
                <button className="bg-white text-black px-4 py-2 rounded-lg font-bold text-[13px] flex items-center gap-2 hover:bg-[#E4E4E7] transition-colors">
                  <Download className="w-4 h-4" /> Download P&L
                </button>
              </div>

              <div className="bg-[#1A1A1A] rounded-xl p-5 mb-8 flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-[#A1A1AA] shrink-0 mt-1" />
                <div>
                  <h4 className="text-white font-bold text-[15px] mb-1">CRITICAL WARNING</h4>
                  <p className="text-[#A1A1AA] text-[13px] leading-relaxed">
                    <strong>ITR-1 (Sahaj) CANNOT be filed</strong> if you have ANY capital gains income from mutual funds or stocks, even if the gains are under the ₹1.25L tax-free threshold. Filing ITR-1 with capital gains is an immediate compliance violation.
                  </p>
                </div>
              </div>

              <h4 className="text-white font-bold text-[16px] mb-4">Which Form Should You File?</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="bg-[#111111] rounded-xl p-5 relative">
                  <div className="absolute top-0 right-0 bg-[#222222] text-[#A1A1AA] text-[10px] font-bold px-2 py-1 rounded-bl-lg rounded-tr-xl">Most Common</div>
                  <h5 className="text-white font-bold text-[24px] font-heading mb-2">ITR-2</h5>
                  <p className="text-[#A1A1AA] text-[13px] leading-relaxed">
                    File this if you have Salaried Income + Capital Gains (Mutual Funds/Stocks), but NO business or professional income.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><CheckCircle2 className="w-4 h-4 text-[#555555]" /> Salary / Pension</li>
                    <li className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><CheckCircle2 className="w-4 h-4 text-[#555555]" /> STCG & LTCG</li>
                    <li className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><CheckCircle2 className="w-4 h-4 text-[#555555]" /> House Property</li>
                  </ul>
                </div>

                <div className="bg-[#111111] rounded-xl p-5">
                  <h5 className="text-white font-bold text-[24px] font-heading mb-2">ITR-3</h5>
                  <p className="text-[#A1A1AA] text-[13px] leading-relaxed">
                    File this if you have Business Income, Professional Freelance Income, or engage in Intraday / F&O trading.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><CheckCircle2 className="w-4 h-4 text-[#555555]" /> Everything in ITR-2</li>
                    <li className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><CheckCircle2 className="w-4 h-4 text-[#555555]" /> Intraday Trading (Speculative)</li>
                    <li className="flex items-center gap-2 text-[12px] text-[#A1A1AA]"><CheckCircle2 className="w-4 h-4 text-[#555555]" /> F&O (Non-Speculative Business)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
