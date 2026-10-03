import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Award, Flame, CheckCircle2, Gift, TrendingUp } from 'lucide-react';

export const RewardsLoyaltyView: React.FC = () => {
  const { rewards, redeemReward, formatCurrency } = useFinance();
  const [redeemSuccess, setRedeemSuccess] = useState<string | null>(null);

  const perksStore = [
    {
      id: 'rw_boost',
      title: '+0.50% APY Vault Booster',
      cost: 5000,
      description: 'Applies an additional 0.50% annual yield boost to your primary protected savings vault for 6 months.',
    },
    {
      id: 'rw_wire',
      title: 'Zero-Fee International Wire Pass',
      cost: 2500,
      description: 'Waives institutional SWIFT wire transfer fees for up to 3 cross-border transactions.',
    },
    {
      id: 'rw_subs',
      title: '1-Month Streaming Subs Credit',
      cost: 4000,
      description: 'Credits up to $25 towards your next recurring digital software or entertainment billing.',
    },
  ];

  const handleRedeem = (cost: number, name: string) => {
    const success = redeemReward(cost, name);
    if (success) {
      setRedeemSuccess(`Successfully redeemed: ${name}`);
      setTimeout(() => setRedeemSuccess(null), 3500);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-emerald-400" />
          <span>Rewards & Financial Discipline Loyalty</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Earn points through positive cashflow discipline, budget streaks, and vault preservation.
        </p>
      </div>

      {/* Scorecard */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Reward Points Balance
            </div>
            <div className="text-3xl font-bold text-white tabular-nums mt-1 font-mono">
              {rewards.pointsBalance.toLocaleString()}
            </div>
            <div className="text-xs text-emerald-400 mt-2 font-mono flex items-center gap-1.5">
              <span>Next tier: Platinum at {rewards.nextTierPoints.toLocaleString()} pts</span>
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Current Membership Tier
            </div>
            <div className="text-3xl font-bold text-amber-400 font-mono mt-1">
              {rewards.tier}
            </div>
            <div className="text-xs text-slate-400 mt-2">
              Top 5% disciplined members
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Budget Adherence Streak
            </div>
            <div className="text-3xl font-bold text-white font-mono mt-1 flex items-center gap-2">
              <span>{rewards.streakMonths} Months</span>
              <Flame className="w-6 h-6 text-amber-500" />
            </div>
            <div className="text-xs text-slate-400 mt-2 font-mono">
              +1,500 pts awarded each month
            </div>
          </div>
        </div>

        {/* Tier Progress bar */}
        <div className="mt-6 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Tier Progress (Gold → Platinum)</span>
            <span className="font-mono text-emerald-400 font-semibold">
              {Math.round((rewards.pointsBalance / rewards.nextTierPoints) * 100)}%
            </span>
          </div>
          <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-amber-400 h-full"
              style={{
                width: `${Math.min(
                  100,
                  (rewards.pointsBalance / rewards.nextTierPoints) * 100
                )}%`,
              }}
            />
          </div>
        </div>
      </div>

      {redeemSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{redeemSuccess}</span>
        </div>
      )}

      {/* Rewards Store */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white flex items-center gap-2">
          <Gift className="w-4 h-4 text-emerald-400" />
          <span>Redeemable Wealth Boosters</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {perksStore.map((perk) => {
            const canAfford = rewards.pointsBalance >= perk.cost;
            return (
              <div
                key={perk.id}
                className="p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-3 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-white">{perk.title}</span>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {perk.cost.toLocaleString()} pts
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    {perk.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => handleRedeem(perk.cost, perk.title)}
                    disabled={!canAfford}
                    className="w-full py-1.5 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
                  >
                    {canAfford ? 'Redeem Booster' : 'Insufficient Points'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* History Ledger */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
        <h2 className="text-sm font-semibold text-white">Points Activity Ledger</h2>
        <div className="divide-y divide-slate-800/80">
          {rewards.history.map((h) => (
            <div key={h.id} className="py-2.5 flex items-center justify-between text-xs">
              <div>
                <div className="text-slate-200 font-medium">{h.description}</div>
                <div className="text-[11px] text-slate-500 font-mono">{h.date}</div>
              </div>
              <div
                className={`font-mono font-bold ${
                  h.points > 0 ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {h.points > 0 ? `+${h.points}` : h.points} pts
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
