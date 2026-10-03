import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode } from '../../types/finance';
import {
  UserCheck,
  Shield,
  Activity,
  CreditCard,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, updateUserProfile, updateSettings, totalNetWorth, formatCurrency } = useFinance();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', label: 'Australian Dollar', symbol: 'AU$' },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({ name, email, phone });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Profile Card */}
      <div className="p-6 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-16 h-16 rounded-full object-cover ring-2 ring-emerald-500/40"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">{user.name}</h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {user.tier}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-1 flex items-center gap-2">
              <span>{user.email}</span>
              <span>·</span>
              <span>Joined {user.joinedDate}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6 border-t md:border-t-0 md:border-l border-slate-800 pt-4 md:pt-0 md:pl-6">
          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Total Net Worth
            </div>
            <div className="text-xl font-bold text-white tabular-nums">
              {formatCurrency(totalNetWorth)}
            </div>
          </div>

          <div>
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-mono">
              Health Score
            </div>
            <div className="text-xl font-bold text-emerald-400 font-mono">
              {user.healthScore}
              <span className="text-xs text-slate-500">/100</span>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Score Matrix */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-400" />
            <span>Financial Health Diagnostic</span>
          </h2>
          <span className="text-xs text-emerald-400 font-mono">Top 8% in peer group</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="text-[11px] text-slate-400">Emergency Cushion</div>
            <div className="text-base font-semibold text-white mt-1">94% Robust</div>
            <div className="text-[10px] text-slate-500 mt-1">5.4 months essential burn</div>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="text-[11px] text-slate-400">Savings Velocity</div>
            <div className="text-base font-semibold text-white mt-1">28.4% Net</div>
            <div className="text-[10px] text-slate-500 mt-1">Exceeds 20% benchmark</div>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="text-[11px] text-slate-400">Debt-to-Income</div>
            <div className="text-base font-semibold text-emerald-400 mt-1">0.0% Zero</div>
            <div className="text-[10px] text-slate-500 mt-1">No revolving credit debt</div>
          </div>
          <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-lg">
            <div className="text-[11px] text-slate-400">Budget Adherence</div>
            <div className="text-base font-semibold text-white mt-1">86% On Track</div>
            <div className="text-[10px] text-slate-500 mt-1">7 month continuous streak</div>
          </div>
        </div>
      </div>

      {/* Form & Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Personal Details Form */}
        <form onSubmit={handleSaveProfile} className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Personal Information</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Full Legal Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Primary Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1">Mobile Phone (2FA)</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors"
            >
              Save Profile
            </button>
            {savedSuccess && (
              <span className="text-xs text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Updated
              </span>
            )}
          </div>
        </form>

        {/* Currency & Risk Profile */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <span>Currency & Risk Architecture</span>
          </h2>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Operating Currency
            </label>
            <select
              value={user.currency}
              onChange={(e) => updateSettings({ currency: e.target.value as CurrencyCode })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) - {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5">
              Risk Tolerance Model
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Conservative', 'Moderate', 'Aggressive'] as const).map((risk) => (
                <button
                  key={risk}
                  type="button"
                  onClick={() => updateUserProfile({ riskTolerance: risk })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border text-center transition-colors ${
                    user.riskTolerance === risk
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {risk}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Moderate allocates 65% liquid / protected vaults and 35% growth equities.
            </p>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Open Banking Sync</span>
              <span className="text-emerald-400 font-mono flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Chase Premier Linked
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
