import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  RefreshCw,
  AlertTriangle,
  PlusCircle,
  Calendar,
  X,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const SubscriptionView: React.FC = () => {
  const {
    subscriptions,
    toggleCancelSubscription,
    addSubscription,
    formatCurrency,
    user,
  } = useFinance();

  const [isAddingSub, setIsAddingSub] = useState(false);
  const [subName, setSubName] = useState('');
  const [subCost, setSubCost] = useState('');
  const [subCategory, setSubCategory] = useState<'Streaming' | 'Productivity' | 'Fitness' | 'Cloud' | 'News'>('Productivity');
  const [subCycle, setSubCycle] = useState<'monthly' | 'annual'>('monthly');

  const activeSubs = subscriptions.filter((s) => s.status !== 'cancelled');
  const monthlyTotal = activeSubs.reduce((acc, s) => acc + s.monthlyCost, 0);
  const annualTotal = monthlyTotal * 12;

  const dormantSubs = subscriptions.filter(
    (s) => s.lastUsedDaysAgo > 14 && s.status !== 'cancelled'
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cost = parseFloat(subCost);
    if (!subName.trim() || isNaN(cost) || cost <= 0) return;

    addSubscription({
      name: subName.trim(),
      monthlyCost: cost,
      billingCycle: subCycle,
      category: subCategory,
      nextBillingDate: '2026-11-01',
      status: 'active',
      lastUsedDaysAgo: 0,
      recentPriceHike: false,
      icon: 'Bot',
    });

    setSubName('');
    setSubCost('');
    setIsAddingSub(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-emerald-400" />
            <span>Subscription Audit & Recurring Waste Elimination</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Detect dormant SaaS, recurring gym memberships, stealth price hikes, and automatic cancellation reminders.
          </p>
        </div>

        <button
          onClick={() => setIsAddingSub(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add Subscription</span>
        </button>
      </div>

      {/* Aggregate Scoreboard */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Active Monthly Commitment
          </div>
          <div className="text-2xl font-bold text-white font-mono tabular-nums mt-1">
            {formatCurrency(monthlyTotal)}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {activeSubs.length} active recurring contracts
          </div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Annualized Drag
          </div>
          <div className="text-2xl font-bold text-slate-200 font-mono tabular-nums mt-1">
            {formatCurrency(annualTotal)}
          </div>
          <div className="text-xs text-slate-400 mt-1">Projected 12-month drain</div>
        </div>

        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
            Dormant Subscriptions Flag
          </div>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">
            {dormantSubs.length} Identified
          </div>
          <div className="text-xs text-rose-300 mt-1">
            {formatCurrency(dormantSubs.reduce((a, b) => a + b.monthlyCost, 0))}/mo potential savings
          </div>
        </div>
      </div>

      {/* Inactivity warning banner if any dormant */}
      {dormantSubs.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <div>
              <div className="text-xs font-semibold text-rose-200">
                Low-Utilization Service Alert: {dormantSubs[0].name}
              </div>
              <div className="text-xs text-rose-300/80 mt-0.5">
                No activity detected in {dormantSubs[0].lastUsedDaysAgo} days. Pausing or cancelling will save{' '}
                {formatCurrency(dormantSubs[0].monthlyCost * 12)}/yr.
              </div>
            </div>
          </div>
          <button
            onClick={() => toggleCancelSubscription(dormantSubs[0].id)}
            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-400 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap"
          >
            Cancel / Pause
          </button>
        </div>
      )}

      {/* Subscriptions Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white">Active Recurring Services</h2>
          <span className="text-xs text-slate-400 font-mono">{subscriptions.length} tracked</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {subscriptions.map((sub) => {
            const isCancelled = sub.status === 'cancelled';
            const isDormant = sub.lastUsedDaysAgo > 14 && !isCancelled;

            return (
              <div
                key={sub.id}
                className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                  isCancelled ? 'bg-slate-950/40 opacity-50' : 'hover:bg-slate-800/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                      isCancelled
                        ? 'bg-slate-800 text-slate-500'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {sub.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{sub.name}</span>
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                        {sub.category}
                      </span>
                      {isDormant && (
                        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                          Inactive {sub.lastUsedDaysAgo}d
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-1 flex items-center gap-2">
                      <span>Renews {sub.nextBillingDate}</span>
                      <span>·</span>
                      <span>Billed {sub.billingCycle}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 self-end sm:self-center">
                  <div className="text-right">
                    <div className="text-sm font-bold text-white font-mono tabular-nums">
                      {formatCurrency(sub.monthlyCost)}
                      <span className="text-xs font-normal text-slate-500">/mo</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {formatCurrency(sub.monthlyCost * 12)}/yr
                    </div>
                  </div>

                  <button
                    onClick={() => toggleCancelSubscription(sub.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                      isCancelled
                        ? 'bg-slate-800 text-slate-300 border-slate-700'
                        : 'bg-slate-950 hover:bg-rose-500/10 hover:border-rose-500/30 text-slate-400 hover:text-rose-300 border-slate-800'
                    }`}
                  >
                    {isCancelled ? 'Reactivate' : 'Cancel'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {isAddingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm"
            onClick={() => setIsAddingSub(false)}
          />
          <div className="relative z-10 w-full max-w-md bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">Track Recurring Subscription</h3>
              <button onClick={() => setIsAddingSub(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. GitHub Copilot, Bloomberg"
                  value={subName}
                  onChange={(e) => setSubName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    Cost ({user.currencySymbol})
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="19.99"
                    value={subCost}
                    onChange={(e) => setSubCost(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-emerald-500/50"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Category</label>
                  <select
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="Productivity">Productivity</option>
                    <option value="Streaming">Streaming</option>
                    <option value="Fitness">Fitness</option>
                    <option value="Cloud">Cloud</option>
                    <option value="News">News</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingSub(false)}
                  className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Save Subscription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
