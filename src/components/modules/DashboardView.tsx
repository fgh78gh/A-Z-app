import React from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  TrendingUp,
  TrendingDown,
  Shield,
  Wallet,
  PlusCircle,
  Sparkles,
  Bot,
  AlertTriangle,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';

interface DashboardViewProps {
  onOpenQuickExpense: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onOpenQuickExpense }) => {
  const {
    user,
    formatCurrency,
    totalNetWorth,
    totalMonthlyExpenses,
    currentSavingsRate,
    executePaydaySweep,
    setActiveModule,
    buckets,
    budgets,
    vaults,
    alerts,
    transactions,
    emergencyFund,
    resolveAlert,
  } = useFinance();

  const unresolvedAlerts = alerts.filter((a) => !a.resolved);
  const emergencyMonths = (
    emergencyFund.currentBalance / emergencyFund.monthlyEssentialBurn
  ).toFixed(1);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Welcome & Quick Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
            Executive Financial Cockpit
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time balance, automated allocation, and wealth preservation engine.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onOpenQuickExpense}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Record Expense</span>
          </button>

          <button
            onClick={executePaydaySweep}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium rounded-lg transition-colors"
            title="Simulate paycheck deposit and automatic bucket distribution"
          >
            <Wallet className="w-4 h-4 text-emerald-400" />
            <span>Simulate Payday Sweep</span>
          </button>

          <button
            onClick={() => setActiveModule('assistant')}
            className="flex items-center gap-2 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-xs font-medium rounded-lg transition-colors"
          >
            <Bot className="w-4 h-4 text-indigo-400" />
            <span>AI Coach</span>
          </button>
        </div>
      </div>

      {/* Urgent Alerts Banner (if any) */}
      {unresolvedAlerts.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-semibold text-amber-200">
                {unresolvedAlerts[0].title}
              </div>
              <div className="text-xs text-amber-300/80 mt-0.5">
                {unresolvedAlerts[0].description}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 self-end md:self-center">
            <button
              onClick={() => resolveAlert(unresolvedAlerts[0].id)}
              className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-md transition-colors"
            >
              {unresolvedAlerts[0].actionText || 'Acknowledge'}
            </button>
            <button
              onClick={() => setActiveModule('alerts')}
              className="text-xs text-amber-300 hover:underline px-2"
            >
              View all ({unresolvedAlerts.length})
            </button>
          </div>
        </div>
      )}

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Net Worth */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Total Net Worth
          </div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">
            {formatCurrency(totalNetWorth)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 mt-2 font-mono">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+$2,480.00 (+3.4% MTD)</span>
          </div>
        </div>

        {/* Monthly Inflow (Net Salary) */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Monthly Inflow (Net)
          </div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">
            {formatCurrency(user.monthlyNetSalary)}
          </div>
          <div className="text-xs text-slate-400 mt-2">
            Gross: <span className="font-mono text-slate-300">{formatCurrency(user.monthlyGrossSalary)}</span>
          </div>
        </div>

        {/* Monthly Outflow */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Spent This Billing Cycle
          </div>
          <div className="text-2xl font-bold text-white tabular-nums mt-1">
            {formatCurrency(totalMonthlyExpenses)}
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
            <span>Burn rate: 58% of cycle</span>
          </div>
        </div>

        {/* Savings Rate & Runway */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Savings Velocity & Runway
          </div>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">
            {currentSavingsRate}%
          </div>
          <div className="text-xs text-slate-400 mt-2 flex items-center justify-between">
            <span>Runway:</span>
            <span className="font-mono text-white">{emergencyMonths} months safe</span>
          </div>
        </div>
      </div>

      {/* Money Allocation & 50/30/20 Distribution Visualizer */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white">Monthly Allocation Framework</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Disciplined envelope architecture: Essentials, Discretionary, Protected Wealth & Buffer.
            </p>
          </div>
          <button
            onClick={() => setActiveModule('allocation')}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-medium"
          >
            <span>Adjust Split</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Multi-segment progress bar */}
        <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden flex">
          {buckets.map((b) => (
            <div
              key={b.id}
              style={{ width: `${b.allocatedPercentage}%` }}
              className={`h-full ${
                b.type === 'needs'
                  ? 'bg-emerald-500'
                  : b.type === 'wants'
                  ? 'bg-indigo-500'
                  : b.type === 'savings' && b.id.includes('emergency')
                  ? 'bg-amber-500'
                  : 'bg-cyan-500'
              }`}
              title={`${b.name}: ${b.allocatedPercentage}%`}
            />
          ))}
        </div>

        {/* Buckets summary grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {buckets.map((bucket) => {
            const pctUsed = Math.round((bucket.spentSoFar / bucket.monthlyBudget) * 100);
            return (
              <div
                key={bucket.id}
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-1.5"
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-200 truncate">{bucket.name}</span>
                  <span className="font-mono text-slate-400">{bucket.allocatedPercentage}%</span>
                </div>
                <div className="text-sm font-semibold text-white tabular-nums">
                  {formatCurrency(bucket.spentSoFar)}{' '}
                  <span className="text-xs text-slate-500 font-normal">
                    / {formatCurrency(bucket.monthlyBudget)}
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${pctUsed > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(pctUsed, 100)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Two Column Grid: Protected Vaults & Recent Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Protected Savings Vaults */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>High-Yield Protected Vaults</span>
            </h2>
            <button
              onClick={() => setActiveModule('savings')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Manage Vaults
            </button>
          </div>

          <div className="space-y-3">
            {vaults.map((vault) => {
              const progress = Math.round((vault.currentBalance / vault.targetBalance) * 100);
              return (
                <div
                  key={vault.id}
                  className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-white">{vault.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Locked until {vault.lockedUntil}
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {vault.apy}% APY
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="tabular-nums font-semibold text-white">
                      {formatCurrency(vault.currentBalance)}
                    </span>
                    <span className="tabular-nums">Target: {formatCurrency(vault.targetBalance)}</span>
                  </div>

                  <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Transactions Feed */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <span>Recent Transactions</span>
            </h2>
            <button
              onClick={() => setActiveModule('transactions')}
              className="text-xs text-emerald-400 hover:text-emerald-300 font-medium"
            >
              Full Ledger
            </button>
          </div>

          <div className="space-y-2">
            {transactions.slice(0, 5).map((tx) => (
              <div
                key={tx.id}
                className="p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-lg flex items-center justify-between gap-3 text-xs"
              >
                <div className="truncate">
                  <div className="font-medium text-slate-200 truncate">{tx.title}</div>
                  <div className="text-[11px] text-slate-500 flex items-center gap-2">
                    <span>{tx.date}</span>
                    <span>·</span>
                    <span>{tx.account}</span>
                  </div>
                </div>

                <div
                  className={`font-mono font-semibold tabular-nums whitespace-nowrap ${
                    tx.type === 'income' ? 'text-emerald-400' : 'text-slate-200'
                  }`}
                >
                  {tx.type === 'income' ? '+' : ''}
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
