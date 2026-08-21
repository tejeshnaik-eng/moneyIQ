import React, { useState, useEffect } from 'react';
import { calculateSipFutureValue } from '../../../services/financialMath';

export default function SipDecision() {
  const [currentSip, setCurrentSip] = useState(0);
  const [proposedIncrease, setProposedIncrease] = useState(0);
  const [rate, setRate] = useState(0.12);
  const [years, setYears] = useState(10);

  useEffect(() => {
    // Load defaults
    const userDataStr = localStorage.getItem('userData');
    if (userDataStr) {
      try {
        const userData = JSON.parse(userDataStr);
        if (userData.financials?.monthlyInvestment) {
          setCurrentSip(userData.financials.monthlyInvestment);
        }
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const fvCurrent = calculateSipFutureValue(currentSip, rate * 100, years);
  const fvProposed = calculateSipFutureValue(currentSip + proposedIncrease, rate * 100, years);
  const difference = fvProposed - fvCurrent;

  return (
    <div className="bg-white rounded-xl shadow-sm border p-4">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Increase SIP vs Keep Current SIP</h3>
      </div>
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Current Monthly SIP</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={currentSip} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentSip(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Proposed Increase</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={proposedIncrease} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProposedIncrease(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Expected Annual Return (%)</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={rate * 100} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRate(Number(e.target.value) / 100)} />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#565e74]">Time Horizon (Years)</label>
            <input className="input-field text-sm w-full p-2 border rounded" type="number" value={years} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setYears(Number(e.target.value))} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Current Future Value</div>
            <div className="text-xl font-bold">₹{fvCurrent.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Proposed Future Value</div>
            <div className="text-xl font-bold text-blue-600">₹{fvProposed.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-sm text-gray-500 mb-1">Additional Wealth</div>
            <div className="text-xl font-bold text-green-600">₹{difference.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
