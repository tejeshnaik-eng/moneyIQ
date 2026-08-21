import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function LumpSumDecision() {
  const [amount, setAmount] = useState(500000);
  const [horizonYears, setHorizonYears] = useState(5);
  
  const returns = useMemo(() => {
    const lowRiskRate = 0.05; // FD / Savings
    const highRiskRate = 0.12; // Equity MF
    
    let lowRiskValue = amount;
    let highRiskValue = amount;
    
    const data = [];
    
    for (let i = 0; i <= horizonYears; i++) {
      if (i > 0) {
        lowRiskValue *= (1 + lowRiskRate);
        highRiskValue *= (1 + highRiskRate);
      }
      
      data.push({
        year: `Year ${i}`,
        'Low Risk (FD - 5%)': Math.round(lowRiskValue),
        'High Risk (Equity - 12%)': Math.round(highRiskValue),
      });
    }
    
    return data;
  }, [amount, horizonYears]);

  const finalDiff = returns[returns.length - 1]['High Risk (Equity - 12%)'] - returns[returns.length - 1]['Low Risk (FD - 5%)'];

  return (
    <div className="space-y-6">
      <div className="bg-[var(--app-surface)] rounded-xl shadow-sm border p-4">
        <div className="mb-4">
          <h3 className="font-heading text-2xl text-emerald-900">Invest Lump Sum vs Low-Risk Option</h3>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6 lg:col-span-1">
            <div>
              <label className="block font-sans font-medium text-gray-700 mb-2">
                Lump Sum Amount (₹)
              </label>
              <input 
                type="number" 
                value={amount}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAmount(Number(e.target.value))}
                className="input-field w-full p-2 border rounded font-sans text-lg"
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="font-sans font-medium text-gray-700">Time Horizon (Years)</label>
                <span className="font-bold text-emerald-700">{horizonYears}</span>
              </div>
              <input
                type="range"
                value={horizonYears}
                min={1}
                max={20}
                step={1}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHorizonYears(Number(e.target.value))}
                className="w-full"
              />
            </div>
            
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-100 mt-8">
              <h4 className="font-heading text-lg text-emerald-900 mb-2">Opportunity Cost</h4>
              <p className="text-sm text-gray-600 mb-3">
                By keeping your money in a low-risk option instead of investing it for {horizonYears} years, you could potentially miss out on:
              </p>
              <p className="font-sans font-bold text-3xl text-emerald-600">
                ₹{finalDiff.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="h-96 lg:col-span-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={returns} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="year" axisLine={false} tickLine={false} />
                <YAxis 
                  tickFormatter={(value: number) => `₹${(value / 100000).toFixed(1)}L`}
                  axisLine={false} 
                  tickLine={false} 
                />
                <Tooltip formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, '']} />
                <Legend />
                <Bar dataKey="Low Risk (FD - 5%)" fill="#94a3b8" radius={[4, 4, 0, 0]} />
                <Bar dataKey="High Risk (Equity - 12%)" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
