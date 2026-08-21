import React, { useState, useEffect } from 'react';

export default function SpendingRedirectDecision() {
  const [discretionarySpend, setDiscretionarySpend] = useState<number>(0);
  const [redirectAmount, setRedirectAmount] = useState<number>(0);
  const [goals, setGoals] = useState<any[]>([]);
  const [selectedGoal, setSelectedGoal] = useState<string>('');
  const [futureValue, setFutureValue] = useState<number>(0);
  
  useEffect(() => {
    // Fetch transactions and goals from local storage
    try {
      const storedTxns = localStorage.getItem('finsight_spend_transactions');
      if (storedTxns) {
        const txns = JSON.parse(storedTxns);
        // Basic heuristic: assume dining, entertainment, shopping are discretionary
        const discTxns = txns.filter((t: any) => 
          ['Dining', 'Entertainment', 'Shopping'].includes(t.category)
        );
        const totalDisc = discTxns.reduce((sum: number, t: any) => sum + t.amount, 0);
        // Monthly average (assuming 3 months of data)
        setDiscretionarySpend(Math.round(totalDisc / 3));
        setRedirectAmount(Math.round(totalDisc / 3 / 2)); // Default redirect 50%
      }

      const storedGoals = localStorage.getItem('finsight_goals');
      if (storedGoals) {
        const parsedGoals = JSON.parse(storedGoals);
        setGoals(parsedGoals);
        if (parsedGoals.length > 0) {
          setSelectedGoal(parsedGoals[0].id);
        }
      } else {
        // Fallback goals
        setGoals([
          { id: '1', name: 'Emergency Fund' },
          { id: '2', name: 'Vacation' },
          { id: '3', name: 'Retirement' }
        ]);
        setSelectedGoal('1');
      }
    } catch (e) {
      console.error("Error reading from localStorage", e);
    }
  }, []);

  useEffect(() => {
    // Calculate future value of redirected monthly amount after 5 years at 8%
    const rate = 0.08 / 12;
    const months = 5 * 12;
    const fv = redirectAmount * ((Math.pow(1 + rate, months) - 1) / rate);
    setFutureValue(Math.round(fv));
  }, [redirectAmount]);

  return (
    <div className="space-y-6">
      <div className="bg-[var(--app-surface)] rounded-xl shadow-sm border p-4">
        <div className="mb-4">
          <h3 className="font-heading text-2xl text-purple-900">Redirect Spending to Goals</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
              <p className="text-sm text-gray-600 mb-1">Estimated Monthly Discretionary Spend</p>
              <p className="font-sans font-bold text-3xl text-purple-700">₹{discretionarySpend.toLocaleString()}</p>
              <p className="text-xs text-purple-600 mt-2">Based on your recent transactions</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block font-sans font-medium text-gray-700 mb-2">
                  Amount to Redirect (Monthly)
                </label>
                <input 
                  type="number" 
                  value={redirectAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRedirectAmount(Number(e.target.value))}
                  className="input-field w-full p-2 border rounded font-sans text-lg"
                />
              </div>

              <div>
                <label className="block font-sans font-medium text-gray-700 mb-2">
                  Target Goal
                </label>
                <select 
                  value={selectedGoal} 
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedGoal(e.target.value)}
                  className="input-field w-full p-2 border rounded"
                >
                  <option value="" disabled>Select a goal</option>
                  {goals.map(g => (
                    <option key={g.id || g.name} value={g.id || g.name}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center p-8 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 text-center">
            <h3 className="font-heading text-xl text-indigo-900 mb-4">The Magic of Redirecting</h3>
            <p className="font-sans text-gray-600 mb-6">
              If you invest ₹{redirectAmount.toLocaleString()} every month instead of spending it, 
              in 5 years (at 8% expected return) you will have:
            </p>
            <div className="w-48 h-48 rounded-full bg-[var(--app-surface)] shadow-xl flex items-center justify-center border-4 border-purple-200">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-1">Future Value</p>
                <p className="font-heading text-3xl font-bold text-purple-700">
                  ₹{futureValue >= 100000 ? `${(futureValue/100000).toFixed(2)}L` : futureValue.toLocaleString()}
                </p>
              </div>
            </div>
            
            <button className="mt-8 bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded w-full">
              Apply Change to Plan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
