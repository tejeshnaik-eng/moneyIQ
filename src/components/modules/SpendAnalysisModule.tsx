import React, { useState, useEffect } from 'react';
import { 
  Receipt, 
  TrendingUp, 
  AlertCircle, 
  Search,
  Plus,
  X,
  Loader2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';

type Category = 'Income' | 'Needs' | 'Goals' | 'Discretionary/Leaks';

interface Transaction {
  id: string;
  user_id: string;
  date: string;
  merchant: string;
  category: Category;
  amount: number;
}

export const SpendAnalysisModule: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterQuery, setFilterQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTx, setNewTx] = useState({
    amount: '',
    date: new Date().toISOString().split('T')[0],
    merchant: '',
    category: 'Needs' as Category
  });

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('date', { ascending: false });
          
        if (error) throw error;
        if (data) {
          setTransactions(data as Transaction[]);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [user]);

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

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.amount || !newTx.merchant || !newTx.date || !user) return;

    const transaction = {
      id: crypto.randomUUID(),
      user_id: user.id,
      date: newTx.date,
      merchant: newTx.merchant,
      category: newTx.category,
      amount: parseFloat(newTx.amount)
    };

    // Optimistic UI update
    setTransactions(prev => [transaction as Transaction, ...prev]);
    setIsModalOpen(false);
    setNewTx({
      amount: '',
      date: new Date().toISOString().split('T')[0],
      merchant: '',
      category: 'Needs'
    });

    try {
      const { error } = await supabase
        .from('transactions')
        .insert([transaction]);
        
      if (error) throw error;
    } catch (error) {
      console.error('Error adding transaction:', error);
      // Revert on error can be handled here if needed
    }
  };

  const needsTotal = transactions.filter(t => t.category === 'Needs').reduce((sum, t) => sum + t.amount, 0);
  const totalBasis = totalMonthlyInflow > 0 ? totalMonthlyInflow : Math.max(totalMonthlyOutflow, 1);
  const needsPct = Math.round((needsTotal / totalBasis) * 100);
  const goalsPct = Math.round((investmentsCommitted / totalBasis) * 100);
  const leakPct = Math.round((identifiedLeakage / totalBasis) * 100);

  return (
    <div className="w-full h-full bg-[#1E1E1E] text-white p-8 lg:p-12 pb-20 overflow-y-auto custom-scrollbar">
      <div className="max-w-[1100px] mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <h1 className="text-[32px] sm:text-[40px] font-bold text-white flex items-center gap-3 font-heading tracking-tight">
              Spend Analysis
            </h1>
            <p className="text-[#8A8F98] text-[14px] mt-2 font-body">
              Expense leakage detection and systematic SIP reallocation.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <div className="bg-[#161616] border border-[#222] rounded-[10px] px-5 py-3 flex flex-col min-w-[110px]">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-1">Net Inflow</span>
              <span className="text-[22px] text-white font-bold leading-none">₹{(totalMonthlyInflow / 1000).toFixed(1)}k</span>
            </div>
            <div className="bg-[#161616] border border-[#222] rounded-[10px] px-5 py-3 flex flex-col min-w-[110px]">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-1">Net Outflow</span>
              <span className="text-[22px] text-[#A1A1AA] font-bold leading-none">₹{(totalMonthlyOutflow / 1000).toFixed(1)}k</span>
            </div>
          </div>
        </div>

        {/* Diagnostics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-10">
          {/* 01. EXPENDITURE DIAGNOSIS */}
          <div className="lg:col-span-3 bg-[#161616] border border-[#222] rounded-[16px] p-7 flex flex-col">
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-[11px] text-[#71717A] uppercase tracking-wider font-bold">01. Expenditure Diagnosis</h3>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#71717A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
            </div>
            
            <div className="space-y-8 flex-1 flex flex-col justify-center">
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h4 className="text-[17px] font-bold text-white mb-0.5">Living Expenses (Needs)</h4>
                    <p className="text-[13px] text-[#8A8F98]">Core survival and baseline lifestyle costs</p>
                  </div>
                  <div className="text-[36px] font-bold text-[#A1A1AA] leading-none tracking-tight">
                    {needsPct}<span className="text-[15px] text-[#71717A] font-medium">%</span>
                  </div>
                </div>
                <div className="h-[6px] w-full bg-[#262626] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#A1A1AA] rounded-full" style={{ width: `${needsPct}%` }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h4 className="text-[17px] font-bold text-white mb-0.5">Systematic SIPs & Goals</h4>
                    <p className="text-[13px] text-[#8A8F98]">Capital deployed towards wealth creation</p>
                  </div>
                  <div className="text-[36px] font-bold text-[#00E599] leading-none tracking-tight">
                    {goalsPct}<span className="text-[15px] text-[#71717A] font-medium">%</span>
                  </div>
                </div>
                <div className="h-[6px] w-full bg-[#262626] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#00E599] rounded-full" style={{ width: `${goalsPct}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <h4 className="text-[17px] font-bold text-white mb-0.5">Identified Leakage</h4>
                    <p className="text-[13px] text-[#8A8F98]">Discretionary and avoidable outflow</p>
                  </div>
                  <div className="text-[36px] font-bold text-[#EF4444] leading-none tracking-tight">
                    {leakPct}<span className="text-[15px] text-[#71717A] font-medium">%</span>
                  </div>
                </div>
                <div className="h-[6px] w-full bg-[#262626] rounded-full overflow-hidden flex">
                  <div className="h-full bg-[#EF4444] rounded-full" style={{ width: `${leakPct}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* 02. LEAKAGE OPPORTUNITY COST */}
          <div className="lg:col-span-2 bg-[#161616] border border-[#222] rounded-[16px] p-7 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-[11px] text-[#71717A] uppercase tracking-wider font-bold">02. Leakage Impact</h3>
              <TrendingUp className="w-4 h-4 text-[#71717A]" />
            </div>
            
            <div className="bg-[#111111] border border-[#1A1A1A] rounded-[12px] p-5 mb-6 text-center">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-2.5 block text-left">5-Year Opportunity Cost</span>
              <span className="text-[42px] font-bold text-[#00E599] leading-none tracking-tight block my-4">
                ₹{(compounded5Years / 100000).toFixed(2)}<span className="text-[20px] text-[#00E599]/70 ml-1">L</span>
              </span>
              <p className="text-[13px] text-[#8A8F98] leading-relaxed text-left">
                Future wealth lost to ₹{identifiedLeakage.toLocaleString('en-IN')}/mo leakage.
              </p>
            </div>
            
            <div className="mt-auto border-t border-[#222] pt-5">
              <span className="text-[10px] text-[#71717A] uppercase tracking-wider font-bold mb-2.5 block">Strategic Reallocation</span>
              <p className="text-[13px] text-[#8A8F98] leading-relaxed">
                Redirecting this leakage into an index fund generates <strong className="text-white">+₹{((compounded5Years - leakRedirectAmount * 60) / 100000).toFixed(2)}L</strong> in pure compound interest over 5 years.
              </p>
            </div>
          </div>
        </div>

        {/* 03. MONITORED LEDGER */}
        <div>
          <div className="flex justify-between items-end border-b border-[#222] pb-3 mb-5">
            <h3 className="text-[11px] text-[#71717A] uppercase tracking-wider font-bold">03. Monitored Ledger</h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-[12px] text-[#00E599] hover:text-[#00c282] flex items-center gap-1.5 transition-colors font-bold"
            >
              <Plus className="w-3.5 h-3.5" /> Add Transaction
            </button>
          </div>
          
          <div className="bg-[#161616] border border-[#222] rounded-[12px] overflow-hidden">
            <div className="p-4 border-b border-[#222] flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#1A1A1A]">
              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#71717A]" />
                <input
                  type="text"
                  placeholder="Filter transactions..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-[#111] border border-[#333] rounded-lg text-xs text-white outline-none focus:border-[#555]"
                />
              </div>
            </div>
            
            {isLoading ? (
              <div className="p-12 text-center flex flex-col items-center justify-center bg-[#161616]">
                <Loader2 className="w-8 h-8 text-[#00E599] animate-spin mb-4" />
                <p className="text-sm font-heading font-bold text-white">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center bg-[#161616]">
                <Receipt className="w-12 h-12 text-[#333] mb-4" />
                <p className="text-sm font-heading font-bold text-white">No transactions found</p>
                <p className="text-xs text-[#71717A] mt-1">Add your first transaction to see the analysis.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#111] border-b border-[#222]">
                      <th className="p-4 font-heading font-bold text-[#71717A] uppercase tracking-wider text-[10px]">Date</th>
                      <th className="p-4 font-heading font-bold text-[#71717A] uppercase tracking-wider text-[10px]">Merchant</th>
                      <th className="p-4 font-heading font-bold text-[#71717A] uppercase tracking-wider text-[10px]">Category</th>
                      <th className="p-4 font-heading font-bold text-[#71717A] uppercase tracking-wider text-[10px] text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#222]">
                    {filteredTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-[#1A1A1A] transition-colors">
                        <td className="p-4 font-mono text-[#71717A] text-[13px]">{tx.date}</td>
                        <td className="p-4 font-heading font-bold text-white text-[14px]">{tx.merchant}</td>
                        <td className="p-4">
                          {tx.category === 'Discretionary/Leaks' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#EF4444]/10 text-[#EF4444] text-[10px] font-heading font-bold border border-[#EF4444]/20">
                              <AlertCircle className="w-3 h-3" /> Discretionary Leak
                            </span>
                          ) : tx.category === 'Income' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#00E599]/10 text-[#00E599] text-[10px] font-heading font-bold border border-[#00E599]/20">
                              Inflow
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#333] text-[#A1A1AA] text-[10px] font-heading font-bold border border-[#444]">
                              {tx.category}
                            </span>
                          )}
                        </td>
                        <td className={`p-4 text-right font-mono font-bold text-[15px] ${tx.category === 'Income' ? 'text-[#00E599]' : tx.category === 'Discretionary/Leaks' ? 'text-[#EF4444]' : 'text-white'}`}>
                          {tx.category === 'Income' ? '+' : '-'} ₹{tx.amount.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Add Transaction Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-[#161616] border border-[#222] rounded-[16px] shadow-2xl w-full max-w-md overflow-hidden">
              <div className="p-5 border-b border-[#222] flex justify-between items-center">
                <h3 className="font-heading font-bold text-[18px] text-white">Add Transaction</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-[#71717A] hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleAddTransaction} className="p-5 space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Date</label>
                  <input
                    type="date"
                    required
                    value={newTx.date}
                    onChange={e => setNewTx({...newTx, date: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-[10px] text-[14px] text-white outline-none focus:border-[#555] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Merchant / Description</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Salary, Swiggy, Netflix"
                    value={newTx.merchant}
                    onChange={e => setNewTx({...newTx, merchant: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-[10px] text-[14px] text-white outline-none focus:border-[#555]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Category</label>
                  <select
                    value={newTx.category}
                    onChange={e => setNewTx({...newTx, category: e.target.value as Category})}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-[10px] text-[14px] text-white outline-none focus:border-[#555]"
                  >
                    <option value="Income">Income</option>
                    <option value="Needs">Needs</option>
                    <option value="Goals">Goals</option>
                    <option value="Discretionary/Leaks">Discretionary/Leaks</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-[#71717A] uppercase tracking-wider mb-2">Amount (₹)</label>
                  <input
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={newTx.amount}
                    onChange={e => setNewTx({...newTx, amount: e.target.value})}
                    className="w-full px-4 py-2.5 bg-[#111] border border-[#333] rounded-[10px] text-[14px] text-white outline-none focus:border-[#555] font-mono"
                  />
                </div>
                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 text-[13px] font-bold text-[#A1A1AA] hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 text-[13px] font-bold bg-[#00E599] text-[#111] rounded-[8px] hover:bg-[#00c282] transition-colors"
                  >
                    Save Transaction
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
