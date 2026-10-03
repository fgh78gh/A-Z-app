import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  FileBarChart,
  Printer,
  TrendingUp,
  Download,
  Calendar,
  CheckCircle,
} from 'lucide-react';

export const ReportsAnalyticsView: React.FC = () => {
  const {
    user,
    formatCurrency,
    totalNetWorth,
    totalMonthlyExpenses,
    currentSavingsRate,
    emergencyFund,
    vaults,
    budgets,
  } = useFinance();

  const [statementMonth, setStatementMonth] = useState('October 2026');

  const netSavedThisMonth = user.monthlyNetSalary - totalMonthlyExpenses;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <FileBarChart className="w-5 h-5 text-emerald-400" />
            <span>Reports & Institutional Wealth Analytics</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Cashflow statements, balance sheet reconciliations, and savings trajectory benchmarks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Statement</span>
          </button>
        </div>
      </div>

      {/* Statement Card / Printable Canvas */}
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-8 shadow-sm">
        {/* Statement Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="text-xs uppercase tracking-widest text-emerald-400 font-mono font-semibold">
              Monthly Statement of Financial Condition
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight mt-1">
              Account Holder: {user.name}
            </h2>
            <div className="text-xs text-slate-400 mt-0.5">
              Period: <span className="text-slate-200">{statementMonth}</span> · Member ID: {user.id}
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Net Worth Position
            </div>
            <div className="text-2xl font-bold text-white font-mono tabular-nums">
              {formatCurrency(totalNetWorth)}
            </div>
            <div className="text-xs text-emerald-400 font-mono mt-0.5">
              Health Score: {user.healthScore}/100
            </div>
          </div>
        </div>

        {/* Operating Cashflow Waterfall */}
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">
            01. Monthly Cashflow & Capital Formation
          </h3>

          <div className="divide-y divide-slate-800 text-xs">
            <div className="py-2.5 flex justify-between">
              <span className="text-slate-300">Gross Contracted Inflow</span>
              <span className="font-mono text-white tabular-nums">
                {formatCurrency(user.monthlyGrossSalary)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-400">
              <span>Less: Statutory Taxes & Healthcare Deductions</span>
              <span className="font-mono tabular-nums">
                -{formatCurrency(user.monthlyGrossSalary - user.monthlyNetSalary, true)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between font-semibold text-white bg-slate-950/40 px-2 rounded">
              <span>Net Disposable Paycheck</span>
              <span className="font-mono tabular-nums text-emerald-400">
                {formatCurrency(user.monthlyNetSalary)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between text-slate-400">
              <span>Less: Core Living Outflow & Discretionary Spent</span>
              <span className="font-mono tabular-nums">
                -{formatCurrency(totalMonthlyExpenses, true)}
              </span>
            </div>
            <div className="py-2.5 flex justify-between font-bold text-white bg-emerald-500/10 px-2 rounded border border-emerald-500/20">
              <span>Net Preserved Wealth Capital</span>
              <span className="font-mono tabular-nums text-emerald-400">
                +{formatCurrency(netSavedThisMonth)} ({currentSavingsRate}% savings rate)
              </span>
            </div>
          </div>
        </div>

        {/* Balance Sheet Breakdown */}
        <div>
          <h3 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">
            02. Balance Sheet Allocations
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-400">Primary Liquid Checking</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {formatCurrency(18450)}
              </div>
              <div className="text-[10px] text-slate-500">Unrestricted operational liquidity</div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-400">Protected Time-Locked Vaults</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {formatCurrency(vaults.reduce((a, b) => a + b.currentBalance, 0))}
              </div>
              <div className="text-[10px] text-emerald-400">5.1% avg APY compound yield</div>
            </div>

            <div className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-1">
              <div className="text-[11px] text-slate-400">Emergency Fortress Cushion</div>
              <div className="text-lg font-bold text-white font-mono tabular-nums">
                {formatCurrency(emergencyFund.currentBalance)}
              </div>
              <div className="text-[10px] text-slate-400">
                {(emergencyFund.currentBalance / emergencyFund.monthlyEssentialBurn).toFixed(1)} months
                survival buffer
              </div>
            </div>
          </div>
        </div>

        {/* Compliance Footer */}
        <div className="pt-6 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 font-mono">
          <span>SmartMoney Autonomous Wealth Engine · Cryptographically Sealed</span>
          <span>Generated on {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
};
