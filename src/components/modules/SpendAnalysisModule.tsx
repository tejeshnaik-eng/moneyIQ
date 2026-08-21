import { getStorageKey } from '../../utils';
import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  Search,
  Plus,
  X
} from 'lucide-react';

type Category = 'Income' | 'Needs' | 'Goals' | 'Discretionary/Leaks';

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: Category;
  amount: number;
}

export const SpendAnalysisModule: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(getStorageKey('finsight_spend_transactions'));
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [filterQuery, setFilterQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Needs' as Category
  });

  useEffect(() => {
    localStorage.setItem(getStorageKey('finsight_spend_transactions'), JSON.stringify(transactions));
  }, [transactions]);

  const totalMonthlyInflow = transactions
    .filter(t => t.category === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalMonthlyOutflow = transactions
    .filter(t => t.category !== 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const investmentsCommitted = transactions
    .filter(t => t.category === 'Goals')
    .reduce((sum, t) => sum + t.amount, 0);

  const identifiedLeakage = transactions
    .filter(t => t.category === 'Discretionary/Leaks')
    .reduce((sum, t) => sum + t.amount, 0);

  const [leakRedirectAmount, setLeakRedirectAmount] = useState(0);

  useEffect(() => {
    setLeakRedirectAmount(identifiedLeakage);
  }, [identifiedLeakage]);

  const cagr = 0.125;
  const n = 60; // 5 years
  const r = cagr / 12;
  const compounded5Years = leakRedirectAmount > 0 ? Math.round(
    leakRedirectAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  ) : 0;

  const filteredTransactions = transactions.filter((tx) =>
    tx.merchant.toLowerCase().includes(filterQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.merchant || !newTx.date) return;

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      date: newTx.date,
      merchant: newTx.merchant,
      category: newTx.category,
      amount: parseFloat(newTx.amount)
    };

    setTransactions(prev => [transaction, ...prev]);
    setIsModalOpen(false);
    setNewTx({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      category: 'Needs'
    });
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Monthly Outflow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Net Monthly Inflow
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{totalMonthlyInflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#00b090] font-mono mt-1 block">
            Total Income
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Monthly Living Expenses
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{totalMonthlyOutflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#565e74] font-mono mt-1 block">
            Total Outflow
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Systematic SIPs & Goals
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#00b090] font-mono mt-1 block">
            ₹{investmentsCommitted.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#00b090] font-mono mt-1 block">
            Goal-directed capital
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Identified Leakage
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#ba1a1a] font-mono mt-1 block">
            ₹{identifiedLeakage.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#ba1a1a] font-mono mt-1 block">
            Discretionary Spends
          </span>
        </div>
      </div>

      {/* Interactive Leakage-to-SIP Converter */}
      <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm space-y-6">
        <div className="flex items-center gap-3 border-b border-[#E2E8F0] pb-4">
          <div className="w-10 h-10 rounded-xl bg-[#00b090]/10 text-[#006b57] flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-mono text-[#006b57] uppercase font-semibold">
              Algorithmic Wealth Transformation
            </span>
            <h4 className="text-xl font-heading font-extrabold text-[#191c1e] mt-0.5">
              Discretionary Leakage → 12.5% Index SIP Converter
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <p className="text-xs text-[#565e74] leading-relaxed">
              We identified <strong>₹{identifiedLeakage.toLocaleString('en-IN')} / month</strong> in discretionary leakage. Adjust below to see the 5-year opportunity value:
            </p>

            <div>
              <div className="flex justify-between text-xs font-heading font-bold text-[#191c1e] mb-2">
                <span>Monthly Reallocation Amount</span>
                <span className="text-[#006b57] font-mono text-sm">₹{leakRedirectAmount.toLocaleString('en-IN')}/mo</span>
              </div>
              <input
                type="range"
                min="0"
                max={Math.max(10000, identifiedLeakage * 2)}
                step="250"
                value={leakRedirectAmount}
                onChange={(e) => setLeakRedirectAmount(Number(e.target.value))}
                className="w-full accent-[#00b090] bg-[#e6e8ea] h-2 rounded cursor-pointer"
              />
            </div>
          </div>

          <div className="p-5 rounded-xl bg-[#f7f9fb] border border-[#E2E8F0] flex flex-col justify-between space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <span className="text-[11px] font-heading font-bold text-[#565e74] uppercase tracking-wider block">
                  5-Year Compounded Liquid Corpus
                </span>
                <span className="text-3xl font-heading font-extrabold text-[#006b57] font-mono mt-1 block">
                  ₹{(compounded5Years / 100000).toFixed(2)} Lakhs
                </span>
              </div>
              <TrendingUp className="w-8 h-8 text-[#00b090]" />
            </div>

            <p className="text-xs text-[#565e74] leading-relaxed border-t border-[#E2E8F0] pt-3">
              Redirecting this into the Nifty 50 Index Fund generates <strong>+₹{((compounded5Years - leakRedirectAmount * 60) / 100000).toFixed(2)}L</strong> pure compound interest.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction Ledger */}
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden space-y-4">
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="font-heading font-bold text-base text-[#191c1e]">
              Monitored Transaction Ledger
            </h4>
            <p className="text-xs text-[#565e74]">
              Auto-categorized bank and card entries with recurring leakage detection.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#565e74]" />
              <input
                type="text"
                placeholder="Filter transactions..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-[#f7f9fb] border border-[#E2E8F0] rounded-lg text-xs text-[#191c1e] outline-none focus:border-[#00b090]"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto px-4 py-1.5 bg-[#00b090] text-white text-xs font-bold rounded-lg hover:bg-[#009b7e] transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add Transaction
            </button>
          </div>
        </div>

        {transactions.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <Receipt className="w-12 h-12 text-[#E2E8F0] mb-4" />
            <p className="text-sm font-heading font-bold text-[#191c1e]">No transactions found</p>
            <p className="text-xs text-[#565e74] mt-1">Add your first transaction to see the analysis.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f7f9fb] border-b border-[#E2E8F0]">
                  <th className="p-3.5 font-heading font-bold text-[#565e74]">Date</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74]">Merchant</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74]">Category</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74]">Classification</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-[#f7f9fb] transition-colors">
                    <td className="p-3.5 font-mono text-[#565e74]">{tx.date}</td>
                    <td className="p-3.5 font-heading font-bold text-[#191c1e]">{tx.merchant}</td>
                    <td className="p-3.5 text-[#565e74] capitalize">{tx.category}</td>
                    <td className="p-3.5">
                      {tx.category === 'Discretionary/Leaks' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-heading font-bold">
                          <AlertCircle className="w-3 h-3" /> Discretionary Leak
                        </span>
                      ) : tx.category === 'Income' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#d3f7eb] text-[#006b57] text-[10px] font-heading font-medium">
                          Inflow
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#565e74] text-[10px] font-heading font-medium">
                          Standard Expense
                        </span>
                      )}
                    </td>
                    <td className={`p-3.5 text-right font-mono font-bold ${tx.category === 'Income' ? 'text-[#00b090]' : tx.category === 'Discretionary/Leaks' ? 'text-[#ba1a1a]' : 'text-[#191c1e]'}`}>
                      {tx.category === 'Income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-[#E2E8F0] flex justify-between items-center">
              <h3 className="font-heading font-bold text-lg text-[#191c1e]">Add Transaction</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-[#565e74] hover:text-[#191c1e]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddTransaction} className="p-4 space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={newTx.date}
                  onChange={e => setNewTx({...newTx, date: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#00b090]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Merchant / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salary, Swiggy, Netflix"
                  value={newTx.merchant}
                  onChange={e => setNewTx({...newTx, merchant: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#00b090]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Category</label>
                <select
                  value={newTx.category}
                  onChange={e => setNewTx({...newTx, category: e.target.value as Category})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#00b090] bg-white"
                >
                  <option value="Income">Income</option>
                  <option value="Needs">Needs</option>
                  <option value="Goals">Goals</option>
                  <option value="Discretionary/Leaks">Discretionary/Leaks</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[#565e74] mb-1">Amount (₹)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  value={newTx.amount}
                  onChange={e => setNewTx({...newTx, amount: e.target.value})}
                  className="w-full px-3 py-2 border border-[#E2E8F0] rounded-lg text-sm outline-none focus:border-[#00b090]"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-bold text-[#565e74] hover:bg-[#f7f9fb] rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-bold bg-[#00b090] text-white rounded-lg hover:bg-[#009b7e] transition-colors"
                >
                  Save Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
