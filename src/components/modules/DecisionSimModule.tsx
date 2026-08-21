import React, { useState } from 'react';
import SipDecision from './decision-scenarios/SipDecision';
import LiquidityDecision from './decision-scenarios/LiquidityDecision';
import AllocationDecision from './decision-scenarios/AllocationDecision';
import SpendingRedirectDecision from './decision-scenarios/SpendingRedirectDecision';
import LumpSumDecision from './decision-scenarios/LumpSumDecision';
import HistoricalReplay from './decision-scenarios/HistoricalReplay';

export function DecisionSimModule() {
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const decisions = [
    { id: 'SipDecision', title: 'Increase SIP', description: 'Analyze the impact of increasing your monthly SIP' },
    { id: 'LiquidityDecision', title: 'Invest Cash', description: 'Evaluate redirecting spare cash to investments' },
    { id: 'AllocationDecision', title: 'Asset Allocation', description: 'Adjust your debt vs equity mix' },
    { id: 'SpendingRedirectDecision', title: 'Redirect Spending', description: 'See how cutting expenses boosts wealth' },
    { id: 'LumpSumDecision', title: 'Lump Sum Investment', description: 'Simulate injecting a one-time bonus' },
    { id: 'HistoricalReplay', title: 'Historical Replay', description: 'See how past investments would have performed' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Decision Simulator</h2>
        {selectedDecision && (
          <button 
            className="border px-4 py-2 rounded hover:bg-gray-100" 
            onClick={() => setSelectedDecision(null)}
          >
            &larr; Back to Decisions
          </button>
        )}
      </div>
      
      {!selectedDecision ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {decisions.map(d => (
            <div 
              key={d.id} 
              className="bg-[var(--app-surface)] rounded-xl shadow-sm border p-4 transition-colors cursor-pointer hover:border-blue-500" 
              onClick={() => setSelectedDecision(d.id)}
            >
              <div className="mb-2">
                <h3 className="text-lg font-semibold">{d.title}</h3>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-4">{d.description}</p>
                <button 
                  className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                >
                  Simulate
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {selectedDecision === 'SipDecision' && <SipDecision />}
          {selectedDecision === 'LiquidityDecision' && <LiquidityDecision />}
          {selectedDecision === 'AllocationDecision' && <AllocationDecision />}
          {selectedDecision === 'SpendingRedirectDecision' && <SpendingRedirectDecision />}
          {selectedDecision === 'LumpSumDecision' && <LumpSumDecision />}
          {selectedDecision === 'HistoricalReplay' && <HistoricalReplay />}
        </div>
      )}
    </div>
  );
}
