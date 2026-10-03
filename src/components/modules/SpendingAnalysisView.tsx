import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  TrendingDown,
  TrendingUp,
  Store,
  Calendar,
  Layers,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

export const SpendingAnalysisView: React.FC = () => {
  const { merchants, budgets, formatCurrency } = useFinance();

  const totalSpent = budgets.reduce((acc, b) => acc + b.currentSpent, 0);

  // Day of week distribution mock
  const dayPatterns = [
    { day: 'Mon', percent: 8, amount: 240 },
    { day: 'Tue', percent: 9, amount: 270 },
    { day: 'Wed', percent: 11, amount: 330 },
    { day: 'Thu', percent: 14, amount: 420 },
    { day: 'Fri', percent: 24, amount: 720 },
    { day: 'Sat', percent: 22, amount: 660 },
    { day: 'Sun', percent: 12, amount: 360 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-emerald-400" />
          <span>Spending Analysis & Merchant Behavioral Insights</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Algorithmic analysis of transaction frequency, merchant concentration, and lifestyle creep velocity.
        </p>
      </div>

      {/* Behavioral Diagnostic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Weekend Concentration
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">58.0%</div>
          <div className="text-xs text-slate-400 mt-1">
            Fri–Sun accounts for bulk of discretionary wants
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Lifestyle Creep Velocity
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">+1.8%</div>
          <div className="text-xs text-slate-400 mt-1">
            Well below inflation; disciplined capital growth
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Top Category Burn
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">Housing & Util</div>
          <div className="text-xs text-slate-400 mt-1 font-mono">
            51.2% of total monthly outflow
          </div>
        </div>
      </div>

      {/* Day-of-Week Distribution Heatmap */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Day-of-Week Spending Heatmap</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Identifies emotional impulse peaks during the weekly cycle.
            </p>
          </div>
          <span className="text-xs text-slate-400 font-mono">Normalized past 90 days</span>
        </div>

        <div className="grid grid-cols-7 gap-2 pt-2">
          {dayPatterns.map((dp) => (
            <div key={dp.day} className="flex flex-col items-center gap-2">
              <div className="text-xs font-semibold text-slate-300 font-mono">{dp.day}</div>
              <div className="w-full bg-slate-950 h-32 rounded-lg flex flex-col justify-end p-1 overflow-hidden">
                <div
                  className={`w-full rounded transition-all ${
                    dp.percent > 20
                      ? 'bg-emerald-400'
                      : dp.percent > 12
                      ? 'bg-emerald-500/80'
                      : 'bg-emerald-500/40'
                  }`}
                  style={{ height: `${dp.percent * 3.8}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 font-mono">{dp.percent}%</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Merchants Matrix */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Store className="w-4 h-4 text-emerald-400" />
          <span>Top Vendor Concentration</span>
        </h2>

        <div className="divide-y divide-slate-800/80">
          {merchants.map((m) => (
            <div
              key={m.merchant}
              className="py-3 flex items-center justify-between text-xs hover:bg-slate-800/20 px-2 rounded transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-300">
                  <Store className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-semibold text-white">{m.merchant}</div>
                  <div className="text-[11px] text-slate-400 font-mono">
                    {m.category} · {m.transactionCount} transactions
                  </div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-white font-mono tabular-nums">
                  {formatCurrency(m.totalSpent)}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Trend:{' '}
                  <span
                    className={
                      m.trend === 'up'
                        ? 'text-amber-400'
                        : m.trend === 'down'
                        ? 'text-emerald-400'
                        : 'text-slate-400'
                    }
                  >
                    {m.trend}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
