import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Wallet,
  Calendar,
  Layers,
  CheckCircle2,
  TrendingDown,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const SalaryManagementView: React.FC = () => {
  const {
    user,
    formatCurrency,
    deductions,
    salaryRules,
    toggleSalaryRule,
    executePaydaySweep,
    updateGrossSalary,
  } = useFinance();

  const [grossInput, setGrossInput] = useState(user.monthlyGrossSalary.toString());
  const [isEditingGross, setIsEditingGross] = useState(false);

  const totalDeductionsAmount = deductions.reduce((acc, d) => acc + d.amount, 0);
  const effectiveTaxRate = (
    (deductions
      .filter((d) => d.category === 'Tax')
      .reduce((a, b) => a + b.amount, 0) /
      user.monthlyGrossSalary) *
    100
  ).toFixed(1);

  const handleSaveGross = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(grossInput);
    if (!isNaN(val) && val > 0) {
      updateGrossSalary(val);
      setIsEditingGross(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-400" />
            <span>Salary Management & Payday Splitting</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Automated Gross-to-Net waterfall, statutory deductions, and zero-touch direct deposit routing.
          </p>
        </div>

        <button
          onClick={executePaydaySweep}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Execute Payday Sweep</span>
        </button>
      </div>

      {/* Salary Overview Card */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Monthly Gross Pay
            </div>
            {isEditingGross ? (
              <form onSubmit={handleSaveGross} className="mt-1 flex items-center gap-2">
                <input
                  type="number"
                  value={grossInput}
                  onChange={(e) => setGrossInput(e.target.value)}
                  className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded text-base font-bold text-white tabular-nums w-32 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-semibold rounded"
                >
                  Save
                </button>
              </form>
            ) : (
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-bold text-white tabular-nums">
                  {formatCurrency(user.monthlyGrossSalary)}
                </span>
                <button
                  onClick={() => setIsEditingGross(true)}
                  className="text-xs text-emerald-400 hover:underline"
                >
                  Edit
                </button>
              </div>
            )}
            <div className="text-xs text-slate-400 mt-1">
              Annualized: {formatCurrency(user.monthlyGrossSalary * 12)}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Total Deductions & Taxes
            </div>
            <div className="text-2xl font-bold text-rose-400 tabular-nums mt-1">
              -{formatCurrency(totalDeductionsAmount, true)}
            </div>
            <div className="text-xs text-slate-400 mt-1 font-mono">
              Effective tax: {effectiveTaxRate}% of gross
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Net Take-Home Pay
            </div>
            <div className="text-2xl font-bold text-emerald-400 tabular-nums mt-1">
              {formatCurrency(user.monthlyNetSalary)}
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>Next deposit: Oct 15 (in 12 days)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deductions Waterfall */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span>Statutory & Voluntary Deductions Waterfall</span>
        </h2>

        <div className="divide-y divide-slate-800/80">
          {deductions.map((ded) => (
            <div
              key={ded.id}
              className="py-3 flex items-center justify-between text-xs hover:bg-slate-800/20 px-2 rounded transition-colors"
            >
              <div>
                <div className="font-medium text-slate-200">{ded.name}</div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {ded.category} · {ded.percentage}% of gross
                </div>
              </div>
              <div className="font-mono text-slate-300 tabular-nums">
                -{formatCurrency(ded.amount, true)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Payday Splitting Rules */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Zero-Touch Automated Splitting Rules</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              When payroll hits checking, SmartMoney instantly segments your net pay into destination accounts.
            </p>
          </div>
          <span className="text-xs text-emerald-400 font-mono font-semibold">100% Routed</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {salaryRules.map((rule) => {
            const amountAllocated = Math.round((user.monthlyNetSalary * rule.percentage) / 100);
            return (
              <div
                key={rule.id}
                className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">{rule.targetBucket}</span>
                  <button
                    onClick={() => toggleSalaryRule(rule.id)}
                    className={`text-xs px-2.5 py-0.5 rounded font-mono font-medium transition-colors ${
                      rule.active
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {rule.active ? 'Active Rule' : 'Paused'}
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Destination:</span>
                  <span className="text-slate-200 font-mono text-[11px] truncate max-w-[200px]">
                    {rule.destinationAccount}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-semibold">{rule.percentage}% of Net</span>
                  <span className="font-mono font-bold text-white tabular-nums">
                    {formatCurrency(amountAllocated)}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
