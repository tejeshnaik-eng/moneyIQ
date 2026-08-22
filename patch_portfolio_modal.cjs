const fs = require('fs');
const file = 'src/components/modules/PortfolioModule.tsx';
let c = fs.readFileSync(file, 'utf8');

// 1. Remove the function definition of AddHoldingModal
const modalFuncRegex = /function AddHoldingModal\(\) \{[\s\S]*?document\.body\n\s*\);\n\s*\}/m;
c = c.replace(modalFuncRegex, '');

// 2. Define the new inline JSX to replace `{showAddModal && <AddHoldingModal />}`
const newInlineModal = `{showAddModal && createPortal(
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#161616] rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-[#333]">
            <div className="p-4 border-b border-[#333] flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">Add Holding</h3>
              <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-[#222] rounded transition-colors">
                <X className="w-5 h-5 text-[#8A8F98]" />
              </button>
            </div>
            <div className="p-4 bg-[#111] flex flex-col items-center justify-center gap-2 border-b border-[#333]">
              <span className="text-[11px] font-heading text-[#8A8F98] uppercase tracking-widest">Fastest Way:</span>
              <label className="border border-[#20EFA0]/30 text-[#20EFA0] py-2 px-4 rounded-lg flex items-center gap-2 cursor-pointer w-full justify-center bg-[#161616] hover:bg-[#20EFA0]/10 transition-colors">
                <input type="file" accept=".csv, .xlsx" className="hidden" onChange={(e) => {
                  handleFileUpload(e);
                  setShowAddModal(false);
                }} />
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
                Import Statement (XLSX/CSV)
              </label>
            </div>
            <form onSubmit={handleAddHolding} className="p-4 space-y-4">
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1">Name / Scheme</label>
                <input type="text" required className="w-full bg-[#111] border border-[#333] rounded-lg py-2 px-3 focus:outline-none focus:border-[#20EFA0] text-[14px] text-white" value={newHolding.name} onChange={e => setNewHolding({...newHolding, name: e.target.value})} placeholder="e.g. UTI Nifty 50 Index Fund" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1">Ticker (Optional)</label>
                  <input type="text" className="w-full bg-[#111] border border-[#333] rounded-lg py-2 px-3 focus:outline-none focus:border-[#20EFA0] text-[14px] text-white" value={newHolding.ticker} onChange={e => setNewHolding({...newHolding, ticker: e.target.value})} placeholder="e.g. NIFTYBEES" />
                </div>
                <div>
                  <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1">Platform</label>
                  <select className="w-full bg-[#111] border border-[#333] rounded-lg py-2 px-3 focus:outline-none focus:border-[#20EFA0] text-[14px] text-white" value={newHolding.platform} onChange={e => setNewHolding({...newHolding, platform: e.target.value as any})}>
                    <option value="Zerodha">Zerodha</option>
                    <option value="Groww">Groww</option>
                    <option value="INDmoney">INDmoney</option>
                    <option value="EPFO">EPFO</option>
                    <option value="Direct Bank">Direct Bank</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1">Category</label>
                <select className="w-full bg-[#111] border border-[#333] rounded-lg py-2 px-3 focus:outline-none focus:border-[#20EFA0] text-[14px] text-white" value={newHolding.category} onChange={e => setNewHolding({...newHolding, category: e.target.value as any})}>
                  <option value="Large Cap">Large Cap</option>
                  <option value="Flexi Cap">Flexi Cap</option>
                  <option value="Mid Cap">Mid Cap</option>
                  <option value="Debt/EPF">Debt/EPF</option>
                  <option value="Gold/SGB">Gold/SGB</option>
                  <option value="Liquid Cash">Liquid Cash</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1">Invested Value (₹)</label>
                  <input type="number" required min="0" step="1" className="w-full bg-[#111] border border-[#333] rounded-lg py-2 px-3 focus:outline-none focus:border-[#20EFA0] text-[14px] text-white" value={newHolding.investedValue || ''} onChange={e => setNewHolding({...newHolding, investedValue: Number(e.target.value)})} />
                </div>
                <div>
                  <label className="block text-[12px] font-heading font-medium text-[#8A8F98] mb-1">Current Value (₹)</label>
                  <input type="number" required min="0" step="1" className="w-full bg-[#111] border border-[#333] rounded-lg py-2 px-3 focus:outline-none focus:border-[#20EFA0] text-[14px] text-white" value={newHolding.currentValue || ''} onChange={e => setNewHolding({...newHolding, currentValue: Number(e.target.value)})} />
                </div>
              </div>
              <div className="flex justify-between items-center gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="py-2.5 px-4 rounded-lg bg-[#222] text-[#8A8F98] font-bold text-[13px] flex-1 text-center hover:bg-[#333] transition-colors">
                  Cancel
                </button>
                <button type="submit" className="py-2.5 px-4 rounded-lg bg-[#20EFA0] text-black font-bold text-[13px] flex-1 text-center hover:bg-[#1bc785] transition-colors">
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}`;

// Replace both instances of {showAddModal && <AddHoldingModal />}
// Because it appears in the empty state AND the bottom of the populated state
c = c.replace(/\{showAddModal && <AddHoldingModal \/>\}/g, newInlineModal);

fs.writeFileSync(file, c);
console.log('Portfolio AddHoldingModal inline patched for bugfix and dark theme styling.');
