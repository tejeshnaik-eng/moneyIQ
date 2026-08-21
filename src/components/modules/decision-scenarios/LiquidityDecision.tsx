import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { calculateLumpSum } from '../../../services/financialMath';

export default function LiquidityDecision() {
  const [cashBalance, setCashBalance] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [proposedInvestment, setProposedInvestment] = useState(0);
  const [rate, setRate] = useState(0.10);
  const [years, setYears] = useState(5);

  useEffect(() => {
    // Load defaults
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.financials?.cash) {
          setCashBalance(userData.financials.cash);
        }
        if (userData.financials?.monthlyExpenses) {
          setMonthlyExpenses(userData.financials.monthlyExpenses);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const remainingCash = cashBalance - proposedInvestment;
  const emergencyMonths = monthlyExpenses > 0 ? remainingCash / monthlyExpenses : 0;
  const warning = emergencyMonths < 6;

  const fvInvestment = calculateLumpSum(proposedInvestment, rate * 100, years);

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Invest More vs Keep Cash</h3>
        <p className="text-sm text-gray-500">Evaluate redirecting available savings into investments.</p>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Current Cash Balance</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={cashBalance} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCashBalance(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Monthly Expenses</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={monthlyExpenses} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMonthlyExpenses(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Proposed Investment Amount</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={proposedInvestment} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProposedInvestment(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Expected Return (%)</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={rate * 100} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRate(Number(e.target.value) / 100)} />
          </div>
        </div>

        {warning && proposedInvestment > 0 && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-start gap-3 border border-red-200">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div>
              <div className="font-semibold text-sm mb-1">Warning</div>
              <div className="text-sm">
                This investment will deplete your emergency savings below 6 months of expenses (Current: {emergencyMonths.toFixed(1)} months remaining).
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Remaining Emergency Fund</div>
            <div className={`text-xl font-bold ${warning ? 'text-red-600' : 'text-blue-600'}`}>
              {emergencyMonths.toFixed(1)} Months (₹{remainingCash.toLocaleString()})
            </div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Projected Value ({years} yrs)</div>
            <div className="text-xl font-bold text-green-600">
              ₹{fvInvestment.toLocaleString(undefined, { maximumFractionDigits: 0 })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
