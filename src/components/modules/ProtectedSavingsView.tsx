import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Shield,
  Lock,
  PlusCircle,
  TrendingUp,
  AlertTriangle,
  X,
  Sparkles,
  Calendar,
} from 'lucide-react';

export const ProtectedSavingsView: React.FC = () => {
  const {
    vaults,
    depositToVault,
    createVault,
    simulateEarlyWithdrawal,
    formatCurrency,
    user,
  } = useFinance();

  const [depositVaultId, setDepositVaultId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState('');

  const [withdrawVaultId, setWithdrawVaultId] = useState<string | null>(null);

  const [isCreatingVault, setIsCreatingVault] = useState(false);
  const [newVaultName, setNewVaultName] = useState('');
  const [newVaultTarget, setNewVaultTarget] = useState('');
  const [newVaultLockMonths, setNewVaultLockMonths] = useState(6);
  const [newVaultApy, setNewVaultApy] = useState(5.1);

  const totalVaultsBalance = vaults.reduce((acc, v) => acc + v.currentBalance, 0);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositVaultId) return;
    const amount = parseFloat(depositAmount);
    if (!isNaN(amount) && amount > 0) {
      depositToVault(depositVaultId, amount);
      setDepositAmount('');
      setDepositVaultId(null);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(newVaultTarget);
    if (!newVaultName.trim() || isNaN(target) || target <= 0) return;

    const lockDate = new Date();
    lockDate.setMonth(lockDate.getMonth() + newVaultLockMonths);

    createVault({
      name: newVaultName.trim(),
      targetBalance: target,
      apy: newVaultApy,
      lockedUntil: lockDate.toISOString().split('T')[0],
      lockPeriodMonths: newVaultLockMonths,
      penaltyRate: newVaultLockMonths >= 12 ? 2.5 : 1.5,
      autoDepositMonthly: Math.round(target / newVaultLockMonths),
    });

    setNewVaultName('');
    setNewVaultTarget('');
    setIsCreatingVault(false);
  };

  const activeWithdrawSim = withdrawVaultId ? simulateEarlyWithdrawal(withdrawVaultId) : null;
  const withdrawVaultObj = vaults.find((v) => v.id === withdrawVaultId);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" />
            <span>Protected Savings & Time-Locked Vaults</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            FDIC-secured high-yield interest vaults protected by time-lock discipline to prevent impulsive liquidation.
          </p>
        </div>

        <button
          onClick={() => setIsCreatingVault(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Protected Vault</span>
        </button>
      </div>

      {/* Aggregate Balance Card */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Total Locked Capital
          </div>
          <div className="text-3xl font-bold text-white tabular-nums mt-1">
            {formatCurrency(totalVaultsBalance)}
          </div>
          <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Generating ~${((totalVaultsBalance * 0.051) / 12).toFixed(2)}/mo in passive yield</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-slate-500 text-[10px] uppercase">Active Vaults</div>
            <div className="text-base font-bold text-white mt-0.5">{vaults.length}</div>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-center">
            <div className="text-slate-500 text-[10px] uppercase">Average APY</div>
            <div className="text-base font-bold text-emerald-400 mt-0.5">5.10%</div>
          </div>
        </div>
      </div>

      {/* Vaults Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vaults.map((vault) => {
          const progress = Math.round((vault.currentBalance / vault.targetBalance) * 100);
          return (
            <div
              key={vault.id}
              className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {vault.apy}% APY
                  </span>
                </div>

                <div className="mt-3">
                  <h2 className="text-sm font-semibold text-white">{vault.name}</h2>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>Locked until {vault.lockedUntil}</span>
                  </div>
                </div>

                <div className="mt-4">
                  <div className="text-2xl font-bold text-white font-mono tabular-nums">
                    {formatCurrency(vault.currentBalance)}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Target: {formatCurrency(vault.targetBalance)} ({progress}%)
                  </div>
                </div>

                <div className="mt-2 w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${Math.min(progress, 100)}%` }}
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => setDepositVaultId(vault.id)}
                  className="flex-1 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-medium rounded-lg transition-colors"
                >
                  Deposit
                </button>
                <button
                  onClick={() => setWithdrawVaultId(vault.id)}
                  className="px-2.5 py-1.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-rose-300 text-xs rounded-lg transition-colors border border-slate-800"
                  title="Simulate early unlock"
                >
                  Unlock
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Deposit Modal */}
      {depositVaultId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setDepositVaultId(null)}
          />
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <h3 className="text-sm font-semibold text-white mb-1">Deposit to Vault</h3>
            <p className="text-xs text-slate-400 mb-4">
              Funds will be transferred from Primary Checking into this time-locked vault.
            </p>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Deposit Amount ({user.currencySymbol})
                </label>
                <input
                  type="number"
                  step="1"
                  min="1"
                  required
                  placeholder="500.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDepositVaultId(null)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Confirm Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Early Withdrawal Penalty Simulation Modal */}
      {withdrawVaultId && withdrawVaultObj && activeWithdrawSim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setWithdrawVaultId(null)}
          />
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-amber-400">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <h3 className="text-sm font-semibold text-white">
                Early Liquidation Cool-Off Notice
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              "{withdrawVaultObj.name}" is locked until{' '}
              <span className="text-white font-mono">{withdrawVaultObj.lockedUntil}</span>. Liquidating
              prior to maturity incurs a statutory fee and relinquishes accrued compound interest.
            </p>

            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Vault Balance:</span>
                <span className="font-mono text-white tabular-nums">
                  {formatCurrency(withdrawVaultObj.currentBalance)}
                </span>
              </div>
              <div className="flex justify-between text-rose-400">
                <span>Early Penalty ({withdrawVaultObj.penaltyRate}%):</span>
                <span className="font-mono tabular-nums">
                  -{formatCurrency(activeWithdrawSim.penalty)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-800 flex justify-between font-semibold text-white">
                <span>Net Return to Checking:</span>
                <span className="font-mono tabular-nums text-emerald-400">
                  {formatCurrency(activeWithdrawSim.netPayout)}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setWithdrawVaultId(null)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg"
              >
                Keep Protected (Recommended)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Vault Modal */}
      {isCreatingVault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsCreatingVault(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white">Create Protected Time-Locked Vault</h3>
              <button
                onClick={() => setIsCreatingVault(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Vault Purpose Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Commercial Real Estate Reserve"
                  value={newVaultName}
                  onChange={(e) => setNewVaultName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Target Amount</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={newVaultTarget}
                    onChange={(e) => setNewVaultTarget(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Lock Duration</label>
                  <select
                    value={newVaultLockMonths}
                    onChange={(e) => setNewVaultLockMonths(parseInt(e.target.value, 10))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value={3}>3 Months (4.8% APY)</option>
                    <option value={6}>6 Months (5.1% APY)</option>
                    <option value={12}>12 Months (5.35% APY)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingVault(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Create & Lock Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
