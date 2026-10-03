import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Sliders,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  TrendingDown,
  Edit2,
  Check,
} from 'lucide-react';

export const BudgetControlView: React.FC = () => {
  const {
    budgets,
    updateBudgetLimit,
    toggleBudgetRollover,
    formatCurrency,
  } = useFinance();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLimitValue, setEditLimitValue] = useState('');

  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.monthlyLimit, 0);
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + b.currentSpent, 0);
  const overallPace = Math.round((totalBudgetSpent / totalBudgetLimit) * 100);

  const startEdit = (id: string, currentLimit: number) => {
    setEditingId(id);
    setEditLimitValue(currentLimit.toString());
  };

  const saveEdit = (id: string) => {
    const val = parseFloat(editLimitValue);
    if (!isNaN(val) && val > 0) {
      updateBudgetLimit(id, val);
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-emerald-400" />
            <span>Budget Control & Velocity Safeguards</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Enforce category-level spending ceilings, active burn-down projections, and rollover buffers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono">
            <span className="text-slate-400">Total Ceiling: </span>
            <span className="text-white font-semibold">{formatCurrency(totalBudgetLimit)}</span>
          </div>
        </div>
      </div>

      {/* Aggregate Burn-down Progress */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Overall Monthly Burn Pace</span>
          <span className="font-mono text-slate-400">
            {formatCurrency(totalBudgetSpent)} spent of {formatCurrency(totalBudgetLimit)} ({overallPace}%)
          </span>
        </div>

        <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              overallPace > 100 ? 'bg-rose-500' : overallPace > 85 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.min(overallPace, 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <span>Cycle Day: 18 of 30</span>
          <span>12 days remaining in cycle</span>
        </div>
      </div>

      {/* Category Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {budgets.map((b) => {
          const pct = Math.round((b.currentSpent / b.monthlyLimit) * 100);
          const isOver = b.currentSpent > b.monthlyLimit;
          const isNear = pct >= 85 && !isOver;

          return (
            <div
              key={b.id}
              className={`p-5 rounded-xl bg-slate-900 border transition-all ${
                isOver
                  ? 'border-rose-500/40 bg-rose-500/5'
                  : isNear
                  ? 'border-amber-500/40'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-semibold text-white flex items-center gap-2">
                    <span>{b.category}</span>
                    {isOver && <AlertTriangle className="w-4 h-4 text-rose-400" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Remaining:{' '}
                    <span className={`font-mono ${isOver ? 'text-rose-400' : 'text-slate-200'}`}>
                      {formatCurrency(b.monthlyLimit - b.currentSpent)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  {editingId === b.id ? (
                    <div className="flex items-center gap-1">
                      <input
                        type="number"
                        value={editLimitValue}
                        onChange={(e) => setEditLimitValue(e.target.value)}
                        className="w-20 px-2 py-0.5 bg-slate-950 border border-slate-700 rounded text-xs font-mono text-white text-right focus:outline-none"
                      />
                      <button
                        onClick={() => saveEdit(b.id)}
                        className="p-1 text-emerald-400 hover:bg-slate-800 rounded"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-mono font-semibold text-white tabular-nums">
                        {formatCurrency(b.monthlyLimit)}
                      </span>
                      <button
                        onClick={() => startEdit(b.id, b.monthlyLimit)}
                        className="text-slate-500 hover:text-slate-300 p-0.5"
                        title="Edit limit"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                    </div>
                  )}
                  <span
                    className={`text-[10px] font-mono font-semibold ${
                      isOver ? 'text-rose-400' : isNear ? 'text-amber-400' : 'text-emerald-400'
                    }`}
                  >
                    {pct}% spent
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    isOver ? 'bg-rose-500' : isNear ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>

              {/* Rollover Toggle */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-slate-400 flex items-center gap-1">
                  <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
                  <span>Rollover unused</span>
                </span>
                <button
                  onClick={() => toggleBudgetRollover(b.id)}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono transition-colors ${
                    b.rolloverEnabled
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'text-slate-500 hover:text-slate-400'
                  }`}
                >
                  {b.rolloverEnabled ? 'Rollover Enabled' : 'Off'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
