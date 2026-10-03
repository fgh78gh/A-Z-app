import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import { PieChart, Sliders, CheckCircle, AlertCircle, ArrowUpRight } from 'lucide-react';

export const MoneyAllocationView: React.FC = () => {
  const { user, buckets, updateBucketPercentage, formatCurrency } = useFinance();

  const totalPercentage = buckets.reduce((sum, b) => sum + b.allocatedPercentage, 0);
  const isBalanced = totalPercentage === 100;

  const applyPreset = (preset: 'standard' | 'fire' | 'comfort') => {
    if (preset === 'standard') {
      updateBucketPercentage('b_needs', 50);
      updateBucketPercentage('b_wants', 30);
      updateBucketPercentage('b_savings', 10);
      updateBucketPercentage('b_emergency', 10);
    } else if (preset === 'fire') {
      updateBucketPercentage('b_needs', 40);
      updateBucketPercentage('b_wants', 15);
      updateBucketPercentage('b_savings', 35);
      updateBucketPercentage('b_emergency', 10);
    } else if (preset === 'comfort') {
      updateBucketPercentage('b_needs', 55);
      updateBucketPercentage('b_wants', 25);
      updateBucketPercentage('b_savings', 10);
      updateBucketPercentage('b_emergency', 10);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            <span>Money Allocation Framework</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Dynamic envelope budgeting architecture. Balance Fixed Needs, Discretionary Wants, and Wealth Preservation.
          </p>
        </div>

        {/* Total Sum Indicator */}
        <div className="flex items-center gap-2">
          {isBalanced ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
              <CheckCircle className="w-4 h-4" />
              <span>100% Balanced</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-mono font-semibold">
              <AlertCircle className="w-4 h-4" />
              <span>Total: {totalPercentage}% (Must equal 100%)</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Strategy Selectors */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <span className="text-xs font-medium text-slate-300">Quick Strategy Models:</span>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => applyPreset('standard')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700 font-mono"
          >
            Classic 50/30/20
          </button>
          <button
            onClick={() => applyPreset('fire')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700 font-mono"
          >
            Aggressive Wealth (40/15/35/10)
          </button>
          <button
            onClick={() => applyPreset('comfort')}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-colors border border-slate-700 font-mono"
          >
            Lifestyle Balance (55/25/10/10)
          </button>
        </div>
      </div>

      {/* Visual Multi-Segment Bar */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span>Allocation Spectrum</span>
          <span className="font-mono">Monthly Net Pay: {formatCurrency(user.monthlyNetSalary)}</span>
        </div>

        <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex">
          {buckets.map((b) => (
            <div
              key={b.id}
              style={{ width: `${b.allocatedPercentage}%` }}
              className={`h-full transition-all duration-300 ${
                b.type === 'needs'
                  ? 'bg-emerald-500'
                  : b.type === 'wants'
                  ? 'bg-indigo-500'
                  : b.id.includes('emergency')
                  ? 'bg-amber-500'
                  : 'bg-cyan-500'
              }`}
              title={`${b.name}: ${b.allocatedPercentage}%`}
            />
          ))}
        </div>
      </div>

      {/* Interactive Buckets Controller */}
      <div className="space-y-3">
        {buckets.map((bucket) => {
          const monthlyTarget = Math.round((user.monthlyNetSalary * bucket.allocatedPercentage) / 100);
          return (
            <div
              key={bucket.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 hover:border-slate-700 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{bucket.name}</span>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {bucket.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{bucket.description}</p>
                </div>

                <div className="text-right">
                  <div className="text-base font-bold text-white font-mono tabular-nums">
                    {formatCurrency(monthlyTarget)}
                    <span className="text-xs text-slate-500 font-normal"> /mo</span>
                  </div>
                  <div className="text-xs text-emerald-400 font-mono">
                    {bucket.allocatedPercentage}% of Net
                  </div>
                </div>
              </div>

              {/* Slider */}
              <div className="pt-2 flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="80"
                  step="1"
                  value={bucket.allocatedPercentage}
                  onChange={(e) => updateBucketPercentage(bucket.id, parseInt(e.target.value, 10))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="font-mono text-xs font-semibold text-slate-300 w-12 text-right">
                  {bucket.allocatedPercentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
