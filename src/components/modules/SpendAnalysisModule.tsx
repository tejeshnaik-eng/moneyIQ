import React, { useState } from 'react';
import { 
  Receipt, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle, 
  Sparkles,
  Search,
  CheckCircle2
} from 'lucide-react';
import { mockSpendCategories, mockTransactions, mockSpendOverview } from '../../mock/spendData';

export const SpendAnalysisModule: React.FC = () => {
  const overview = mockSpendOverview;
  const [leakRedirectAmount, setLeakRedirectAmount] = useState(4850);
  const [filterQuery, setFilterQuery] = useState('');

  const cagr = 0.125;
  const n = 60; // 5 years
  const r = cagr / 12;
  const compounded5Years = Math.round(
    leakRedirectAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r)
  );

  const filteredTransactions = mockTransactions.filter((tx) =>
    tx.merchant.toLowerCase().includes(filterQuery.toLowerCase()) ||
    tx.category.toLowerCase().includes(filterQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12">
      {/* Top Monthly Outflow Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Net Monthly Inflow
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{overview.totalMonthlyInflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#00b090] font-mono mt-1 block">
            Primary Tech Salary
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Monthly Living Expenses
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#191c1e] font-mono mt-1 block">
            ₹{overview.totalMonthlyOutflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#565e74] font-mono mt-1 block">
            Needs & Lifestyle (51.1%)
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Systematic SIPs
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#00b090] font-mono mt-1 block">
            ₹{overview.investmentsCommitted.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#00b090] font-mono mt-1 block">
            Goal-directed capital (34.5%)
          </span>
        </div>

        <div className="p-6 rounded-xl bg-white border border-[#E2E8F0] shadow-sm">
          <span className="text-xs font-heading font-bold text-[#565e74] uppercase tracking-wider block">
            Identified Leakage
          </span>
          <span className="text-2xl font-heading font-extrabold text-[#ba1a1a] font-mono mt-1 block">
            ₹{overview.identifiedLeakage.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-[#ba1a1a] font-mono mt-1 block">
            Unnoticed subscriptions & food delivery (4.4%)
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
              We identified <strong>₹4,850 / month</strong> in recurring food delivery markups, gym memberships unused for 60+ days, and duplicated OTT streaming plans. Adjust below to see the 5-year opportunity value:
            </p>

            <div>
              <div className="flex justify-between text-xs font-heading font-bold text-[#191c1e] mb-2">
                <span>Monthly Reallocation Amount</span>
                <span className="text-[#006b57] font-mono text-sm">₹{leakRedirectAmount.toLocaleString('en-IN')}/mo</span>
              </div>
              <input
                type="range"
                min="1000"
                max="10000"
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
        </div>

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
                    {tx.isDiscretionary ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ffdad6] text-[#ba1a1a] text-[10px] font-heading font-bold">
                        <AlertCircle className="w-3 h-3" /> Discretionary Leak
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#565e74] text-[10px] font-heading font-medium">
                        Standard Expense
                      </span>
                    )}
                  </td>
                  <td className={`p-3.5 text-right font-mono font-bold ${tx.isDiscretionary ? 'text-[#ba1a1a]' : 'text-[#191c1e]'}`}>
                    - ₹{tx.amount.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
