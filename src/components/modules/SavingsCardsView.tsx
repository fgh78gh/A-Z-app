import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  CreditCard,
  Shield,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Sliders,
  Sparkles,
} from 'lucide-react';

export const SavingsCardsView: React.FC = () => {
  const { cards, toggleFreezeCard, updateCardMultiplier, updateCardLimit, formatCurrency } =
    useFinance();

  const [revealedCardId, setRevealedCardId] = useState<string | null>(null);

  const toggleReveal = (id: string) => {
    setRevealedCardId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-emerald-400" />
          <span>Virtual Savings Cards & Micro-Roundups</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Issue dedicated virtual cards isolated by spend category with automated round-up savings sweeps.
        </p>
      </div>

      {/* Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card) => {
          const isRevealed = revealedCardId === card.id;
          const isFrozen = card.isFrozen;

          return (
            <div
              key={card.id}
              className={`p-6 rounded-2xl border transition-all relative overflow-hidden flex flex-col justify-between ${
                isFrozen
                  ? 'bg-slate-900/60 border-slate-800 opacity-60'
                  : card.colorScheme === 'emerald'
                  ? 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-950 border-emerald-500/30'
                  : card.colorScheme === 'indigo'
                  ? 'bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border-indigo-500/30'
                  : 'bg-slate-900 border-slate-800'
              }`}
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 tracking-wider uppercase font-mono">
                    {card.type}
                  </span>
                  <div className="w-7 h-5 rounded bg-amber-400/20 border border-amber-400/40 flex items-center justify-center">
                    <div className="w-3 h-2 rounded-sm bg-amber-400/60" />
                  </div>
                </div>

                {/* Card Number */}
                <div className="mt-8 font-mono text-base tracking-widest text-white font-semibold">
                  {isRevealed ? `4532 8920 ${card.cardNumberMasked.slice(-4)} 1084` : `•••• •••• •••• ${card.cardNumberMasked.slice(-4)}`}
                </div>

                {/* Expiry & CVV */}
                <div className="mt-4 flex items-center justify-between text-xs font-mono text-slate-400">
                  <div>
                    <span className="text-[9px] uppercase block text-slate-500">Card Name</span>
                    <span className="text-white font-medium">{card.cardName}</span>
                  </div>
                  <div>
                    <span className="text-[9px] uppercase block text-slate-500">Exp / CVV</span>
                    <span className="text-white font-medium">
                      {card.expiry} / {isRevealed ? card.cvv : '•••'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 space-y-3">
                {/* Round Up Multiplier */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Round-Up Sweep</span>
                  </span>
                  <div className="flex items-center gap-1">
                    {([1, 2, 5] as const).map((m) => (
                      <button
                        key={m}
                        onClick={() => updateCardMultiplier(card.id, m)}
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                          card.roundUpMultiplier === m
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {m}x
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monthly spend progress */}
                <div>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <span>Spent: {formatCurrency(card.spentThisMonth)}</span>
                    <span>Limit: {formatCurrency(card.monthlyLimit)}</span>
                  </div>
                  <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden mt-1">
                    <div
                      className="bg-emerald-500 h-full"
                      style={{
                        width: `${Math.min(
                          100,
                          (card.spentThisMonth / card.monthlyLimit) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => toggleReveal(card.id)}
                    className="flex-1 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
                  >
                    {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{isRevealed ? 'Hide' : 'Reveal'}</span>
                  </button>

                  <button
                    onClick={() => toggleFreezeCard(card.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-center gap-1.5 ${
                      isFrozen
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:bg-rose-500/30'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isFrozen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    <span>{isFrozen ? 'Frozen' : 'Freeze'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
