import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { Sparkles, CheckCircle2, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';

export const SmartOffersView: React.FC = () => {
  const { offers, claimOffer, formatCurrency } = useFinance();
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Banking', 'Cashback', 'Utilities'];

  const filtered = offers.filter((o) =>
    selectedCategory === 'All' ? true : o.category === selectedCategory
  );

  const totalAnnualSavings = offers
    .filter((o) => o.isClaimed)
    .reduce((acc, o) => acc + o.annualSavingsEst, 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Smart Offers & Partner Yield Optimization</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Institutional banking perks, high-yield cash sweep guarantees, and automated contract discounts.
          </p>
        </div>

        {/* Claimed Savings Counter */}
        <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center gap-2.5">
          <Zap className="w-4 h-4 text-emerald-400" />
          <div className="text-xs font-mono">
            <span className="text-slate-400">Captured Annual Savings: </span>
            <span className="text-emerald-400 font-bold">{formatCurrency(totalAnnualSavings)}/yr</span>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex items-center gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
              selectedCategory === cat
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Offers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filtered.map((offer) => (
          <div
            key={offer.id}
            className={`p-5 rounded-xl bg-slate-900 border transition-all flex flex-col justify-between ${
              offer.isClaimed
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <div>
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                  {offer.category}
                </span>
                <span className="text-xs font-mono font-semibold text-emerald-400">
                  +{formatCurrency(offer.annualSavingsEst)}/yr
                </span>
              </div>

              <div className="mt-3">
                <h2 className="text-sm font-semibold text-white">{offer.title}</h2>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Provided by <span className="text-slate-200">{offer.provider}</span>
                </div>
              </div>

              <p className="text-xs text-slate-300 mt-3 leading-relaxed">
                {offer.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 mt-4 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                Expires in {offer.expiresInDays} days
              </span>

              {offer.isClaimed ? (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Activated</span>
                </div>
              ) : (
                <button
                  onClick={() => claimOffer(offer.id)}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1"
                >
                  <span>Claim Perk</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
