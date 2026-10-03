import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { DEMO_PROFILES } from '../../data/initialData';
import {
  KeyRound,
  Fingerprint,
  ShieldCheck,
  UserCheck,
  Lock,
  Unlock,
  CheckCircle2,
} from 'lucide-react';

export const AuthenticationView: React.FC = () => {
  const {
    user,
    switchProfile,
    isLocked,
    unlockWithPin,
    unlockWithBiometrics,
    lockApp,
    updateUserProfile,
  } = useFinance();

  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState(false);
  const [newPin, setNewPin] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);

  const handlePinUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockWithPin(enteredPin);
    if (success) {
      setEnteredPin('');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSaveNewPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPin.length === 4) {
      updateUserProfile({ pinCode: newPin });
      setNewPin('');
      setPinChangeSuccess(true);
      setTimeout(() => setPinChangeSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white">Authentication & Security</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage zero-trust identity verification, biometric authentication, and access credentials.
        </p>
      </div>

      {/* Lock Screen simulation banner */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                isLocked
                  ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
              }`}
            >
              {isLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
            </div>
            <div>
              <div className="text-sm font-semibold text-white">
                Session Status: {isLocked ? 'Locked' : 'Active & Authenticated'}
              </div>
              <div className="text-xs text-slate-400">
                {isLocked
                  ? 'PIN or biometric confirmation required to view balances.'
                  : `Authenticated as ${user.name} (${user.email})`}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isLocked ? (
              <button
                onClick={unlockWithBiometrics}
                className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors"
              >
                <Fingerprint className="w-4 h-4" />
                <span>Simulate Face/Touch ID</span>
              </button>
            ) : (
              <button
                onClick={lockApp}
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700"
              >
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Lock Session Now</span>
              </button>
            )}
          </div>
        </div>

        {/* PIN Entry if locked */}
        {isLocked && (
          <form onSubmit={handlePinUnlock} className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-3">
            <input
              type="password"
              maxLength={4}
              placeholder="Enter 4-digit PIN (Default: 1234)"
              value={enteredPin}
              onChange={(e) => {
                setEnteredPin(e.target.value);
                setPinError(false);
              }}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-center tracking-widest font-mono text-white focus:outline-none focus:border-emerald-500/50 w-64"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Verify PIN
            </button>
            {pinError && (
              <span className="text-xs text-rose-400">Invalid PIN code. Try default: 1234</span>
            )}
          </form>
        )}
      </div>

      {/* Switch Demo Profiles */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-sm font-semibold text-white flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>Switch Financial Persona</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Test how SmartMoney adapts to different income tiers, risk profiles, and currencies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {DEMO_PROFILES.map((profile) => {
            const isSelected = profile.id === user.id;
            return (
              <button
                key={profile.id}
                onClick={() => switchProfile(profile.id)}
                className={`p-4 rounded-xl text-left border transition-all ${
                  isSelected
                    ? 'bg-slate-800/80 border-emerald-500/40 shadow-sm'
                    : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={profile.avatar}
                    alt={profile.name}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <div className="truncate">
                    <div className="text-xs font-semibold text-white truncate flex items-center gap-1.5">
                      <span>{profile.name}</span>
                      {isSelected && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {profile.currencySymbol}
                      {profile.monthlyGrossSalary.toLocaleString()}/mo Gross
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
                  <span>{profile.tier}</span>
                  <span className="font-mono text-emerald-400">Score {profile.healthScore}/100</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Security Credentials & PIN Management */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Update PIN */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-emerald-400" />
            <span>4-Digit Security PIN</span>
          </h3>
          <p className="text-xs text-slate-400">
            Current PIN is <span className="font-mono text-emerald-400">{user.pinCode}</span>. Change it anytime for quick biometric fallback.
          </p>

          <form onSubmit={handleSaveNewPin} className="flex items-center gap-2">
            <input
              type="password"
              maxLength={4}
              placeholder="New 4-digit PIN"
              value={newPin}
              onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sm text-center font-mono text-white focus:outline-none focus:border-emerald-500/50 w-36"
            />
            <button
              type="submit"
              disabled={newPin.length !== 4}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-medium rounded-lg transition-colors"
            >
              Update PIN
            </button>
          </form>

          {pinChangeSuccess && (
            <div className="text-xs text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>PIN updated successfully!</span>
            </div>
          )}
        </div>

        {/* Biometric Toggle & Compliance */}
        <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Biometric Protection</span>
          </h3>
          <p className="text-xs text-slate-400">
            Use WebAuthn biometric enclave for passwordless authorization on wire transfers and vault releases.
          </p>

          <div className="flex items-center justify-between pt-2">
            <span className="text-xs text-slate-300">Biometrics Status</span>
            <button
              onClick={() =>
                updateUserProfile({ isBiometricsEnabled: !user.isBiometricsEnabled })
              }
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                user.isBiometricsEnabled
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {user.isBiometricsEnabled ? 'Enabled (Touch/Face ID)' : 'Disabled'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
