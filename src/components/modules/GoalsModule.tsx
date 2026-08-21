import React, { useState } from 'react';
import { 
  Lightbulb, 
  ArrowRight, 
  Plus, 
  ShieldCheck, 
  Home, 
  Plane, 
  CheckCircle2,
  X
} from 'lucide-react';
import { mockGoals } from '../../mock/goalsData';
import { FinancialGoal } from '../../types';

export const GoalsModule: React.FC = () => {
  const [goals, setGoals] = useState<FinancialGoal[]>(mockGoals);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState(1000000);
  const [newCurrent, setNewCurrent] = useState(100000);
  const [newCategory, setNewCategory] = useState<'Security' | 'Milestone' | 'Retirement' | 'Discretionary'>('Milestone');
  const [newTargetYear, setNewTargetYear] = useState(2028);

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

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((goal) => {
          const progressPercent = Math.min(100, Math.round((goal.currentSaved / goal.targetAmount) * 100));
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

      {/* Insights & Milestone Ledger Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* System Insight Callout (1 col) */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-[#E2E8F0] p-6 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 mb-4 border-b border-[#E2E8F0] pb-3">
              <Lightbulb className="w-5 h-5 text-[#00b090]" />
              <h4 className="font-heading font-bold text-base text-[#191c1e]">
                System Insight
              </h4>
            </div>

            <p className="text-xs text-[#565e74] leading-relaxed mb-4">
              Current portfolio yield exceeds initial baseline projections by <strong>1.2%</strong>. Reallocating this surplus directly to your <strong>Bengaluru Flat Down Payment</strong> goal accelerates target achievement by 4 months, minimizing exposure to interest rate fluctuations.
            </p>

            <div className="bg-[#f7f9fb] p-4 rounded-xl mb-4 border border-[#E2E8F0] space-y-2">
              <div className="flex justify-between items-center text-xs font-heading font-bold">
                <span className="text-[#191c1e]">Suggested Reallocation</span>
                <span className="text-[#00b090] font-mono">+₹4,500/mo</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-[#565e74]">
                <span className="bg-white border border-[#E2E8F0] px-2 py-0.5 rounded">Spend Leaks</span>
                <ArrowRight className="w-3 h-3 text-[#565e74]" />
                <span className="bg-white border border-[#E2E8F0] px-2 py-0.5 rounded">Flat Fund</span>
              </div>
            </div>
          </div>

          <button className="btn-outline text-xs py-2 w-full justify-center">
            <span>Apply Recommendation</span>
          </button>
        </div>

        {/* Milestone Ledger Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E2E8F0] overflow-hidden shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#E2E8F0] flex justify-between items-center">
            <h4 className="font-heading font-bold text-base text-[#191c1e]">
              Upcoming Milestone Ledger
            </h4>
            <span className="text-xs font-mono text-[#565e74]">FY 2026-27 Schedule</span>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#f7f9fb] border-b border-[#E2E8F0]">
                  <th className="p-3.5 font-heading font-bold text-[#565e74]">Date</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74]">Goal</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74]">Milestone</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Amount</th>
                  <th className="p-3.5 font-heading font-bold text-[#565e74] text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                <tr className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5 font-mono text-[#191c1e]">Oct 15, 2026</td>
                  <td className="p-3.5 font-medium text-[#191c1e]">Emergency Reserve</td>
                  <td className="p-3.5 text-[#565e74]">Reach 100% 6-mo Runway (₹4.5L)</td>
                  <td className="p-3.5 font-mono text-right text-[#191c1e]">₹30,000 needed</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#00b090]/10 text-[#006b57] text-[10px] font-heading font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#00b090]"></span> Pending
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5 font-mono text-[#191c1e]">Nov 01, 2026</td>
                  <td className="p-3.5 font-medium text-[#191c1e]">Flat Down Payment</td>
                  <td className="p-3.5 text-[#565e74]">Quarterly Top-Up SIP</td>
                  <td className="p-3.5 font-mono text-right text-[#191c1e]">₹75,000 scheduled</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#f2f4f6] text-[#565e74] text-[10px] font-heading font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#565e74]"></span> Scheduled
                    </span>
                  </td>
                </tr>

                <tr className="hover:bg-[#f7f9fb] transition-colors">
                  <td className="p-3.5 font-mono text-[#191c1e]">Dec 31, 2026</td>
                  <td className="p-3.5 font-medium text-[#191c1e]">Early Financial Independence</td>
                  <td className="p-3.5 text-[#565e74]">Year-End Bonus Allocation</td>
                  <td className="p-3.5 font-mono text-right text-[#191c1e]">₹1,50,000 projected</td>
                  <td className="p-3.5 text-right">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#dae2fd] text-[#006b57] text-[10px] font-heading font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#006b57]"></span> Projected
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

      </div>

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
