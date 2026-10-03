import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { FinancialGoal } from '../../types/finance';
import {
  Target,
  PlusCircle,
  Calendar,
  CheckCircle2,
  TrendingUp,
  X,
  Sparkles,
} from 'lucide-react';

export const GoalsView: React.FC = () => {
  const { goals, contributeToGoal, addGoal, formatCurrency, user } = useFinance();

  const [contributeGoalId, setContributeGoalId] = useState<string | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');

  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [goalTitle, setGoalTitle] = useState('');
  const [goalCategory, setGoalCategory] = useState<FinancialGoal['category']>('Travel');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalDate, setGoalDate] = useState('2027-01-01');

  const totalGoalsTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalGoalsSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);

  const handleContributeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contributeGoalId) return;
    const amount = parseFloat(contributeAmount);
    if (!isNaN(amount) && amount > 0) {
      contributeToGoal(contributeGoalId, amount);
      setContributeAmount('');
      setContributeGoalId(null);
    }
  };

  const handleAddGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(goalTarget);
    if (!goalTitle.trim() || isNaN(target) || target <= 0) return;

    addGoal({
      title: goalTitle.trim(),
      category: goalCategory,
      targetAmount: target,
      deadlineDate: goalDate,
      monthlyContribution: Math.round(target / 12),
      icon: 'Target',
    });

    setGoalTitle('');
    setGoalTarget('');
    setIsAddingGoal(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-400" />
            <span>Financial Goals & Milestones</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Define forward-looking capital targets, calculate monthly commitments, and celebrate milestones.
          </p>
        </div>

        <button
          onClick={() => setIsAddingGoal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Aggregate Scorecard */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Total Capital In Flight
          </div>
          <div className="text-3xl font-bold text-white tabular-nums mt-1 font-mono">
            {formatCurrency(totalGoalsSaved)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Target sum:{' '}
            <span className="font-mono text-slate-200">{formatCurrency(totalGoalsTarget)}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-slate-500 text-[10px] uppercase">Active Targets</div>
            <div className="text-base font-bold text-white mt-0.5">{goals.length}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-slate-500 text-[10px] uppercase">Average Progress</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">
              {Math.round((totalGoalsSaved / (totalGoalsTarget || 1)) * 100)}%
            </div>
          </div>
        </div>
      </div>

      {/* Goals List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {goals.map((goal) => {
          const pct = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
          const isCompleted = goal.currentAmount >= goal.targetAmount;

          return (
            <div
              key={goal.id}
              className={`p-5 rounded-xl bg-slate-900 border transition-all flex flex-col justify-between ${
                isCompleted ? 'border-emerald-500/40 bg-emerald-500/5' : 'border-slate-800'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                    {goal.category}
                  </span>
                  {isCompleted && (
                    <span className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Funded
                    </span>
                  )}
                </div>

                <div className="mt-3">
                  <h2 className="text-sm font-semibold text-white">{goal.title}</h2>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>Target Date: {goal.deadlineDate}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    {formatCurrency(goal.currentAmount)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Goal: {formatCurrency(goal.targetAmount)} ({pct}%)
                  </div>
                </div>

                <div className="mt-2 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${isCompleted ? 'bg-emerald-400' : 'bg-emerald-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="mt-3 text-[11px] text-slate-400 font-mono">
                  Recommended: ~{formatCurrency(goal.monthlyContribution)}/month
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 mt-4">
                <button
                  onClick={() => setContributeGoalId(goal.id)}
                  disabled={isCompleted}
                  className="w-full py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 disabled:opacity-40 text-emerald-400 text-xs font-medium rounded-lg border border-emerald-500/30 transition-colors"
                >
                  {isCompleted ? 'Goal Fully Funded 🎉' : 'Contribute Funds'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Contribute Modal */}
      {contributeGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setContributeGoalId(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Contribute to Goal</h3>
            <form onSubmit={handleContributeSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Amount ({user.currencySymbol})
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="250.00"
                  value={contributeAmount}
                  onChange={(e) => setContributeAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setContributeGoalId(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Confirm Contribution
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Goal Modal */}
      {isAddingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsAddingGoal(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Define Target Milestone</h3>
              <button
                onClick={() => setIsAddingGoal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddGoalSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Goal Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master's Tuition / Sabbatical Fund"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Target Amount</label>
                  <input
                    type="number"
                    required
                    placeholder="8000"
                    value={goalTarget}
                    onChange={(e) => setGoalTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={goalCategory}
                    onChange={(e) => setGoalCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Property">Property</option>
                    <option value="Travel">Travel</option>
                    <option value="Vehicle">Vehicle</option>
                    <option value="Education">Education</option>
                    <option value="Retirement">Retirement</option>
                    <option value="Family">Family</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1">Target Date</label>
                <input
                  type="date"
                  required
                  value={goalDate}
                  onChange={(e) => setGoalDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingGoal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Initialize Goal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
