const fs = require('fs');

let content = fs.readFileSync('src/components/modules/GoalsModule.tsx', 'utf8');

const PASTEL_THEMES = `
const PASTEL_THEMES = [
  { bg: 'bg-[#DDF7EF]', text: 'text-[#101413]', sub: 'text-[#008F6B]', border: 'border-[#008F6B]/20', accent: '#008F6B' },
  { bg: 'bg-[#E6F0FF]', text: 'text-[#101413]', sub: 'text-[#2775E8]', border: 'border-[#2775E8]/20', accent: '#2775E8' },
  { bg: 'bg-[#EEE8FF]', text: 'text-[#101413]', sub: 'text-[#7757D9]', border: 'border-[#7757D9]/20', accent: '#7757D9' },
  { bg: 'bg-[#FFE5E3]', text: 'text-[#101413]', sub: 'text-[#D64545]', border: 'border-[#D64545]/20', accent: '#D64545' },
  { bg: 'bg-[#FFF8E8]', text: 'text-[#101413]', sub: 'text-[#D99A00]', border: 'border-[#D99A00]/20', accent: '#D99A00' },
];
`;

content = content.replace("const GOAL_OPTIONS = [", PASTEL_THEMES + "\nconst GOAL_OPTIONS = [");

const newGrid = `<div className="w-full">
            {expandedGoalId ? (() => {
              const g = goals.find(x => x.id === expandedGoalId);
              if (!g) return null;
              const theme = PASTEL_THEMES[goals.findIndex(x => x.id === expandedGoalId) % PASTEL_THEMES.length];
              return (
                <div className="w-full space-y-6">
                  <div className="flex justify-between items-center mb-4">
                    <button onClick={() => setExpandedGoalId(null)} className="text-[#8A8F98] hover:text-white flex items-center gap-2 text-sm font-bold">
                      <ArrowLeft className="w-4 h-4" /> Back to Goals
                    </button>
                    <button onClick={() => handleDeleteGoal(g.id)} className="text-[#8A8F98] hover:text-red-500 flex items-center gap-2 text-sm font-bold">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                      <div className={\`\${theme.bg} p-8 rounded-[32px]\`}>
                        <h3 className={\`\${theme.sub} font-bold uppercase tracking-widest text-xs mb-1\`}>Goal</h3>
                        <h2 className={\`text-2xl font-heading font-extrabold \${theme.text} mb-8\`}>{g.title}</h2>
                        <div className="space-y-6">
                          <div className={\`flex justify-between items-end border-b \${theme.border} pb-4\`}>
                            <div>
                              <p className={\`\${theme.sub} text-sm mb-1\`}>Target</p>
                              <p className={\`\${theme.text} font-heading font-extrabold text-xl\`}>₹{Number(g.target_amount).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="text-right">
                              <p className={\`\${theme.sub} text-sm mb-1\`}>Year</p>
                              <p className={\`\${theme.text} font-heading font-extrabold text-xl\`}>{g.target_year}</p>
                            </div>
                          </div>
                          <div className={\`flex justify-between items-end border-b \${theme.border} pb-4\`}>
                            <div>
                              <p className={\`\${theme.sub} text-sm mb-1\`}>Current Savings</p>
                              <p className={\`\${theme.text} font-heading font-extrabold text-xl\`}>₹{Number(g.current_saved).toLocaleString('en-IN')}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className={\`\${theme.bg} p-8 rounded-[32px]\`}>
                        <div className="flex items-baseline gap-2 mb-2">
                          <span className={\`text-4xl font-heading font-extrabold \${theme.sub}\`}>{g.expected_cagr}%</span>
                        </div>
                        <p className={\`\${theme.sub} text-sm font-medium mb-2\`}>Expected annual return</p>
                      </div>
                    </div>
                    <div className={\`\${theme.bg} p-8 rounded-[32px] flex flex-col justify-between\`}>
                      <div>
                        <h3 className={\`text-xl font-heading font-bold \${theme.text} mb-8\`}>Required monthly investment</h3>
                        <div className={\`text-5xl font-heading font-extrabold \${theme.text} mb-2\`}>
                          ₹{Number(g.required_monthly_sip).toLocaleString('en-IN')}<span className="text-2xl opacity-50">/mo</span>
                        </div>
                        <div className={\`mt-8 p-4 rounded-xl flex items-start gap-3 bg-white/40 \${theme.text}\`}>
                          <div className="mt-0.5">
                            {g.status === 'On Track' ? <Check className="w-5 h-5" /> : <Settings2 className="w-5 h-5" />}
                          </div>
                          <div className="text-sm font-bold">
                            {g.status === 'On Track'
                              ? "You are on track! Your available monthly investment meets or exceeds the requirement."
                              : \`You're short by ₹\${(Number(g.required_monthly_sip) - Number(g.current_monthly_sip)).toLocaleString('en-IN')}/mo. Consider extending your timeline or increasing your savings.\`
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })() : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map((g, i) => {
                  const theme = PASTEL_THEMES[i % PASTEL_THEMES.length];
                  return (
                    <div key={g.id} className={\`\${theme.bg} p-6 rounded-[24px] flex flex-col relative group\`}>
                      <button 
                        onClick={() => handleDeleteGoal(g.id)} 
                        className={\`absolute top-6 right-16 \${theme.sub} hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all bg-white/40 hover:bg-white p-2 rounded-full\`}
                        title="Delete Goal"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => setExpandedGoalId(g.id)} 
                        className={\`absolute top-6 right-6 \${theme.sub} opacity-0 group-hover:opacity-100 transition-all bg-white/40 hover:bg-white p-2 rounded-full\`}
                        title="Expand Goal"
                      >
                        <Maximize2 className="w-4 h-4" />
                      </button>
                      <h3 className={\`text-lg font-heading font-bold \${theme.text} mb-1 pr-20\`}>{g.title}</h3>
                      <p className={\`text-sm \${theme.sub} mb-6\`}>Target: {g.target_year}</p>
                      
                      <div className="mb-6">
                        <p className={\`text-xs \${theme.sub} uppercase tracking-wider font-bold mb-1\`}>Target Amount</p>
                        <p className={\`text-2xl font-heading font-extrabold \${theme.text}\`}>₹{Number(g.target_amount).toLocaleString('en-IN')}</p>
                      </div>

                      <div className="space-y-4 mb-6 flex-1">
                        <div>
                          <div className="flex justify-between text-sm mb-1.5">
                            <span className={theme.sub}>Saved</span>
                            <span className={\`\${theme.text} font-bold\`}>₹{Number(g.current_saved).toLocaleString('en-IN')}</span>
                          </div>
                          <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
                            <div className={\`\${theme.bar} h-full rounded-full\`} style={{ width: \`\${Math.min(100, (Number(g.current_saved) / Number(g.target_amount)) * 100)}%\` }}></div>
                          </div>
                        </div>
                        <div className={\`pt-2 border-t \${theme.border}\`}>
                          <div className="flex justify-between text-sm">
                            <span className={theme.sub}>Monthly SIP Req.</span>
                            <span className={\`\${theme.text} font-bold\`}>₹{Number(g.required_monthly_sip).toLocaleString('en-IN')}</span>
                          </div>
                        </div>
                      </div>

                      <div className={\`p-3 rounded-xl text-center text-sm font-bold bg-white/40 \${theme.text}\`}>
                        {g.status}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
`;

content = content.replace(/<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?<\/div>\n\s*\)\}\n\s*<\/div>\n\s*\)/, newGrid + "\n      )");
fs.writeFileSync('src/components/modules/GoalsModule.tsx', content);
