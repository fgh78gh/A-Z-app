import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  LifeBuoy,
  ShieldCheck,
  Zap,
  TrendingUp,
  PlusCircle,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const EmergencyFundView: React.FC = () => {
  const {
    emergencyFund,
    updateEmergencyMonths,
    depositToEmergencyFund,
    toggleAutoSurplus,
    formatCurrency,
    user,
  } = useFinance();

  const [depositInput, setDepositInput] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);

  const targetAmount = emergencyFund.monthlyEssentialBurn * emergencyFund.targetMonths;
  const currentRunway = (
    emergencyFund.currentBalance / emergencyFund.monthlyEssentialBurn
  ).toFixed(1);
  const fundedPercent = Math.min(
    100,
    Math.round((emergencyFund.currentBalance / targetAmount) * 100)
  );

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositInput);
    if (!isNaN(val) && val > 0) {
      depositToEmergencyFund(val);
      setDepositInput('');
      setShowDepositModal(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <LifeBuoy className="w-5 h-5 text-emerald-400" />
            <span>Emergency Fund & Runway Architecture</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Capital safety cushion configured to withstand job loss, health shocks, or macro liquidity volatility.
          </p>
        </div>

        <button
          onClick={() => setShowDepositModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Contribute to Cushion</span>
        </button>
      </div>

      {/* Runway Scoreboard */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Secured Survival Runway
            </div>
            <div className="text-3xl font-bold text-white tabular-nums mt-1 font-mono flex items-baseline gap-2">
              <span>{currentRunway}</span>
              <span className="text-sm font-normal text-slate-400">Months</span>
            </div>
            <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Above the 3-month survival baseline</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Total Emergency Reserve
            </div>
            <div className="text-3xl font-bold text-white tabular-nums mt-1 font-mono">
              {formatCurrency(emergencyFund.currentBalance)}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Target ({emergencyFund.targetMonths} Mo):{' '}
              <span className="font-mono text-slate-200">{formatCurrency(targetAmount)}</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Essential Monthly Burn
            </div>
            <div className="text-3xl font-bold text-white tabular-nums mt-1 font-mono">
              {formatCurrency(emergencyFund.monthlyEssentialBurn)}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Rent + Utilities + Groceries baseline
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Funding Completeness</span>
            <span className="font-mono text-emerald-400 font-semibold">{fundedPercent}% of goal</span>
          </div>
          <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-500"
              style={{ width: `${fundedPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Target Runway Selector */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Select Survival Target Duration</h2>
          <span className="text-xs text-slate-400">Based on industry volatility & family dependents</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { months: 3, label: '3 Months (Standard)', desc: 'Ideal for stable dual-income households' },
            { months: 6, label: '6 Months (Recommended)', desc: 'Optimal buffer for single earners or tech roles' },
            { months: 12, label: '12 Months (Conservative)', desc: 'Maximum fortress security for founders & contractors' },
          ].map((item) => (
            <button
              key={item.months}
              onClick={() => updateEmergencyMonths(item.months as 3 | 6 | 12)}
              className={`p-4 rounded-xl text-left border transition-all ${
                emergencyFund.targetMonths === item.months
                  ? 'bg-slate-800/80 border-emerald-500/40 text-white'
                  : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="text-xs font-semibold">{item.label}</div>
              <div className="text-base font-bold text-white font-mono mt-1">
                {formatCurrency(emergencyFund.monthlyEssentialBurn * item.months)}
              </div>
              <p className="text-[11px] text-slate-500 mt-2">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Liquid Tiering Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Tier 1 Instant Cash */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Tier 1: Instant Liquid Cash</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              0-Hour Access
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {formatCurrency(emergencyFund.tier1LiquidCash)}
          </div>
          <p className="text-xs text-slate-400">
            Stored in FDIC-insured High-Yield checking for instant debit card withdrawal or wire transfers.
          </p>
        </div>

        {/* Tier 2 Treasury Reserves */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white">Tier 2: Short-Term Treasury Bills</span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              5.2% Yield · 24h
            </span>
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums">
            {formatCurrency(emergencyFund.tier2TreasuryReserves)}
          </div>
          <p className="text-xs text-slate-400">
            Allocated into 4-week US Treasury bills to maximize real return while preserving absolute principal.
          </p>
        </div>
      </div>

      {/* Auto-Surplus Deposit Controller */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>End-of-Month Surplus Auto-Sweep</span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automatically sweep any unspent monthly budget surplus straight into your emergency cushion.
          </p>
        </div>

        <button
          onClick={toggleAutoSurplus}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            emergencyFund.autoSurplusDeposit
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              : 'bg-slate-800 text-slate-400'
          }`}
        >
          {emergencyFund.autoSurplusDeposit ? 'Enabled (Active)' : 'Disabled'}
        </button>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setShowDepositModal(false)}
          />
          <div className="relative z-10 w-full max-w-sm bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
            <h3 className="text-sm font-semibold text-white">Deposit to Emergency Buffer</h3>
            <p className="text-xs text-slate-400">
              Strengthen your survival runway by depositing liquid capital from Primary Checking.
            </p>
            <form onSubmit={handleDeposit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">
                  Amount ({user.currencySymbol})
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="500.00"
                  value={depositInput}
                  onChange={(e) => setDepositInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-white font-mono focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDepositModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Confirm Deposit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
