import { getStorageKey } from '../../utils';
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  ShieldCheck, 
  Home, 
  Plane, 
  X
} from 'lucide-react';
import { FinancialGoal } from '../../types';

export const GoalsModule: React.FC = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    try {
      const saved = localStorage.getItem(getStorageKey('finsight_goals'));
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(1000000);
  const [newCurrent, setNewCurrent] = useState(100000);
  const [newCategory, setNewCategory] = useState<'Security' | 'Milestone' | 'Retirement' | 'Discretionary'>('Milestone');
  const [newTargetYear, setNewTargetYear] = useState(2028);

  useEffect(() => {
    localStorage.setItem(getStorageKey('finsight_goals'), JSON.stringify(goals));
  }, [goals]);

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newGoal: FinancialGoal = {
      id: `goal-${Date.now()}`,
      title: newTitle,
      category: newCategory,
      targetAmount: newTarget,
      currentSaved: newCurrent,
      targetYear: newTargetYear,
      expectedInflation: 6.5,
      expectedCagr: 12.0,
      requiredMonthlySip: Math.round((newTarget - newCurrent) / 48),
      currentMonthlySip: 0,
      status: 'Attention Needed',
    };

    setGoals([...goals, newGoal]);
    setShowAddModal(false);
    setNewTitle('');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'On Track':
        return <span className="bg-[#00b090]/10 text-[#006b57] text-[11px] font-heading font-bold px-2 py-0.5 rounded">On Track</span>;
      case 'Attention Needed':
        return <span className="bg-[#f2f4f6] text-[#e59840] text-[11px] font-heading font-bold px-2 py-0.5 rounded">Review Needed</span>;
      default:
        return <span className="bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-heading font-bold px-2 py-0.5 rounded">Critical Gap</span>;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Security':
        return <ShieldCheck className="w-5 h-5 text-[#00b090]" />;
      case 'Milestone':
        return <Home className="w-5 h-5 text-[#505f76]" />;
      default:
        return <Plane className="w-5 h-5 text-[#006b57]" />;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E2E8F0] pb-4">
        <div>
          <span className="text-xs font-mono text-[#006b57] font-semibold uppercase tracking-wider">
            Capital Allocation Engine
          </span>
          <h3 className="text-xl font-heading font-extrabold text-[#191c1e] mt-0.5">
            Goal Planning Ledger
          </h3>
          <p className="text-xs text-[#565e74] mt-0.5">
            Strategic capital allocation tracking and milestone projections based on 6.5% inflation and 12% equity CAGR.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="btn-primary text-xs py-2.5 px-4 self-start sm:self-auto shrink-0 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goals Grid or Empty State */}
      {goals.length === 0 ? (
        <div className="bg-white rounded-xl border border-[#E2E8F0] p-12 flex flex-col items-center justify-center text-center shadow-sm">
          <div className="p-4 bg-[#f7f9fb] rounded-full mb-4">
            <Home className="w-8 h-8 text-[#565e74]" />
          </div>
          <h4 className="font-heading font-bold text-lg text-[#191c1e] mb-2">
            No goals yet. Set your first financial milestone.
          </h4>
          <p className="text-sm text-[#565e74] max-w-md mb-6">
            Start planning for your future by creating a new goal. Track your progress, manage your SIPs, and achieve your financial milestones.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs py-2 px-6"
          >
            Create First Goal
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {goals.map((goal) => {
            const progressPercent = Math.min(100, Math.max(0, Math.round((goal.currentSaved / goal.targetAmount) * 100)));
            const isHealthy = goal.status === 'On Track';

            return (
              <div
                key={goal.id}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-[#00b090]/10 rounded-lg">
                      {getCategoryIcon(goal.category)}
                    </div>
                    {getStatusBadge(goal.status)}
                  </div>

                  <h4 className="font-heading font-bold text-lg text-[#191c1e] mb-0.5">
                    {goal.title}
                  </h4>
                  <p className="text-xs text-[#565e74] mb-6">
                    {goal.category === 'Security' ? '6 months runway liquidity cushion' : 'Target milestone corpus'}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-baseline">
                      <span className="text-xl font-heading font-extrabold text-[#191c1e] font-mono">
                        ₹{goal.currentSaved.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-[#565e74] font-mono">
                        / ₹{goal.targetAmount.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="w-full bg-[#f2f4f6] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#00b090] h-full rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E2E8F0] space-y-1.5 text-xs">
                  <div className="flex justify-between text-[#565e74]">
                    <span>Target Year: {goal.targetYear}</span>
                    <span className={`font-heading font-semibold ${isHealthy ? 'text-[#00b090]' : 'text-[#e59840]'}`}>
                      {goal.status}
                    </span>
                  </div>
                  <div className="flex justify-between text-[#565e74] font-mono text-[11px]">
                    <span>Active SIP: ₹{goal.currentMonthlySip.toLocaleString('en-IN')}/mo</span>
                    <span>Needed: ₹{goal.requiredMonthlySip.toLocaleString('en-IN')}/mo</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Goal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-[#E2E8F0] max-w-md w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-3">
              <h4 className="text-base font-heading font-bold text-[#191c1e]">Add New Financial Milestone</h4>
              <button onClick={() => setShowAddModal(false)} className="text-[#565e74] hover:text-[#191c1e]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-4 text-xs">
              <div>
                <label className="block font-heading font-bold text-[#191c1e] mb-1">Milestone Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Higher Education or Parents Medical Reserve"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded text-[#191c1e] outline-none focus:border-[#00b090]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-heading font-bold text-[#191c1e] mb-1">Target Corpus (₹)</label>
                  <input
                    type="number"
                    min="50000"
                    step="50000"
                    value={newTarget}
                    onChange={(e) => setNewTarget(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded text-[#191c1e] outline-none focus:border-[#00b090]"
                  />
                </div>
                <div>
                  <label className="block font-heading font-bold text-[#191c1e] mb-1">Current Saved (₹)</label>
                  <input
                    type="number"
                    min="0"
                    step="10000"
                    value={newCurrent}
                    onChange={(e) => setNewCurrent(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded text-[#191c1e] outline-none focus:border-[#00b090]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-heading font-bold text-[#191c1e] mb-1">Target Achievement Year</label>
                <input
                  type="number"
                  min="2026"
                  max="2050"
                  value={newTargetYear}
                  onChange={(e) => setNewTargetYear(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#f7f9fb] border border-[#E2E8F0] rounded text-[#191c1e] outline-none focus:border-[#00b090]"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-[#E2E8F0]">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="btn-secondary text-xs py-2 px-4"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary text-xs py-2 px-5"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
