import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
// (No need to import calculateCompoundInterest if not used, but let's keep it or remove it)
export default function AllocationDecision() {
  const [equity, setEquity] = useState(60);
  const [debt, setDebt] = useState(30);
  const [cash, setCash] = useState(10);
  const [projection, setProjection] = useState<any[]>([]);

  useEffect(() => {
    // Basic projection calculation based on allocation
    const years = 10;
    const initialAmount = 100000;
    const equityReturn = 0.12;
    const debtReturn = 0.07;
    const cashReturn = 0.04;

    const blendedReturn = (equity / 100) * equityReturn + (debt / 100) * debtReturn + (cash / 100) * cashReturn;
    
    const newProjection = [];
    let currentAmount = initialAmount;
    
    for (let year = 0; year <= years; year++) {
      newProjection.push({
        year: `Year ${year}`,
        amount: Math.round(currentAmount),
      });
      currentAmount = currentAmount * (1 + blendedReturn);
    }
    
    setProjection(newProjection);
  }, [equity, debt, cash]);

  const handleEquityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEquity = Number(e.target.value);
    const diff = newEquity - equity;
    
    if (debt - diff >= 0) {
      setEquity(newEquity);
      setDebt(debt - diff);
    } else if (cash - diff >= 0) {
      setEquity(newEquity);
      setCash(cash - diff);
    }
  };

  const expectedReturn = ((equity * 12 + debt * 7 + cash * 4) / 100).toFixed(1);
  const volatility = ((equity * 15 + debt * 4 + cash * 1) / 100).toFixed(1);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="mb-4">
          <h3 className="font-heading text-2xl text-blue-900">Portfolio Allocation Decision</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-sans font-medium text-gray-700">Equity ({equity}%)</label>
                <span className="text-sm text-gray-500">Target: 12% Return</span>
              </div>
              <input
                type="range"
                value={equity}
                max={100}
                step={1}
                onChange={handleEquityChange}
                className="w-full"
              />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-sans font-medium text-gray-700">Debt ({debt}%)</label>
                <span className="text-sm text-gray-500">Target: 7% Return</span>
              </div>
              <input
                type="range"
                value={debt}
                max={100}
                step={1}
                disabled
                className="w-full opacity-70"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-sans font-medium text-gray-700">Cash ({cash}%)</label>
                <span className="text-sm text-gray-500">Target: 4% Return</span>
              </div>
              <input
                type="range"
                value={cash}
                max={100}
                step={1}
                disabled
                className="w-full opacity-70"
              />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mt-6">
              <h4 className="font-heading text-lg text-blue-900 mb-2">Risk/Return Profile</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Expected Annual Return</p>
                  <p className="font-sans font-bold text-xl text-green-600">{expectedReturn}%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estimated Volatility</p>
                  <p className="font-sans font-bold text-xl text-orange-500">{volatility}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="h-80">
            <h4 className="font-sans font-medium text-gray-700 mb-4 text-center">10-Year Growth Projection (₹100,000 Initial)</h4>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projection}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip 
                  formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Value']}
                />
                <Line 
                  type="monotone" 
                  dataKey="amount" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
