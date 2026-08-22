const fs = require('fs');

const file = 'src/components/modules/QuantRiskModule.tsx';
let c = fs.readFileSync(file, 'utf8');

// Add Additional Context to inputs state
c = c.replace(/monthlyBudget: 25000\n  \}\);/, `monthlyBudget: 25000,\n    additionalContext: ''\n  });`);
// Interface update if needed
c = c.replace(/monthlyBudget: number;/, `monthlyBudget: number;\n  additionalContext?: string;`);

// Add Text Area in Form
c = c.replace(/\{\/\* 5\. Budget \*\/\}/, `{/* Additional Context */}
            <div>
              <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1.5">Additional Context for AI (Optional)</label>
              <textarea className="w-full bg-[#252525] border-none rounded-xl py-3 px-4 focus:outline-none focus:ring-1 focus:ring-[#00D09C] text-[14px] text-white resize-none" rows={2} value={inputs.additionalContext} onChange={e => setInputs({...inputs, additionalContext: e.target.value})} placeholder="e.g. I prefer ESG funds, or I have existing real estate investments..." />
            </div>

            {/* 5. Budget */}`);

// Remove glowing elements
// 1. bg-[#00D09C]/5 rounded-full blur-[80px]
c = c.replace(/<div className="absolute top-0 right-0 w-64 h-64 bg-\[#00D09C\]\/5 rounded-full blur-\[80px\].*?><\/div>/, '');

// Clean up basket items to match screenshot
const oldBasketRegex = /<div className="space-y-3">[\s\S]*?<\/div>\s*<\/div>\s*<\/>/;

const newBasket = `<div className="space-y-3">
                  {result.basket.map((fund, idx) => (
                    <div key={idx} className="bg-[#161616] rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={\`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider \${
                            fund.category === 'Equity' ? 'bg-[#1A3329] text-[#00E5AA]' :
                            fund.category === 'Debt' ? 'bg-[#1A2642] text-[#4D90FE]' :
                            'bg-[#33250A] text-[#FFB800]'
                          }\`}>
                            {fund.category} • {fund.subCategory}
                          </span>
                          <span className="text-[11px] text-[#555] bg-[#222] px-2 py-0.5 rounded font-mono font-medium">ID: {fund.schemeCode}</span>
                        </div>
                        <h4 className="text-[16px] font-bold text-white tracking-tight leading-tight">{fund.schemeName}</h4>
                      </div>
                      <div className="flex items-center md:flex-col md:items-end justify-between md:justify-center mt-2 md:mt-0">
                        <span className="text-[13px] text-[#A1A1AA] font-medium mb-0.5">{fund.weightagePercent.toFixed(1)}% Weight</span>
                        <span className="text-[22px] font-bold text-white tracking-tight">₹{fund.monthlySIPAmount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>`;

c = c.replace(oldBasketRegex, newBasket);

// Also remove Target Allocation bar gradient / glowing titles if any
c = c.replace(/className="h-6 w-full rounded-full overflow-hidden flex mb-6 shadow-inner bg-\[#111\]"/, `className="h-2 w-full rounded-full overflow-hidden flex mb-8 bg-[#2A2A2A]"`);

fs.writeFileSync(file, c);
console.log('Patched QuantRiskModule styling to match screenshot and added AI context input');
