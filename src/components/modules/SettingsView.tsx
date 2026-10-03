import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import { CurrencyCode } from '../../types/finance';
import {
  Settings,
  Eye,
  EyeOff,
  Shield,
  Moon,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    togglePrivacyMode,
    resetToDefaults,
    user,
    totalNetWorth,
  } = useFinance();

  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [exportNotice, setExportNotice] = useState(false);

  const currencies: { code: CurrencyCode; label: string; symbol: string }[] = [
    { code: 'USD', label: 'US Dollar', symbol: '$' },
    { code: 'EUR', label: 'Euro', symbol: '€' },
    { code: 'GBP', label: 'British Pound', symbol: '£' },
    { code: 'JPY', label: 'Japanese Yen', symbol: '¥' },
    { code: 'INR', label: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', label: 'Canadian Dollar', symbol: 'CA$' },
    { code: 'AUD', label: 'Australian Dollar', symbol: 'AU$' },
  ];

  const handleExportData = () => {
    const backupData = {
      exportDate: new Date().toISOString(),
      user,
      settings,
      totalNetWorth,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SmartMoney_Backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-400" />
          <span>Application Settings & Global Preferences</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure security, privacy display parameters, and export full ledger snapshots.
        </p>
      </div>

      {/* General Configuration */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white">General & Currency</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Currency System</label>
            <select
              value={settings.currency}
              onChange={(e) => updateSettings({ currency: e.target.value as CurrencyCode })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500/50"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} ({c.symbol}) · {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1.5">Theme Palette</label>
            <div className="grid grid-cols-3 gap-2">
              {(['dark', 'midnight', 'light'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => updateSettings({ theme: t })}
                  className={`py-2 px-3 text-xs font-medium rounded-lg border capitalize transition-colors ${
                    settings.theme === t
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Privacy & Security */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white">Privacy & Security Safeguards</h2>

        <div className="divide-y divide-slate-800 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-medium">Privacy Masking Mode</div>
              <div className="text-slate-500">
                Obfuscates real net worth and transaction figures with dots for public screen viewing.
              </div>
            </div>
            <button
              onClick={togglePrivacyMode}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors flex items-center gap-1.5 ${
                settings.privacyMode
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {settings.privacyMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{settings.privacyMode ? 'Masked' : 'Visible'}</span>
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-medium">PIN Confirmation on Resume</div>
              <div className="text-slate-500">
                Prompt for 4-digit security PIN after 15 minutes of inactivity.
              </div>
            </div>
            <button
              onClick={() =>
                updateSettings({ requirePinOnLock: !settings.requirePinOnLock })
              }
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                settings.requirePinOnLock
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {settings.requirePinOnLock ? 'Enabled' : 'Disabled'}
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-medium">Overspend Alert Sensitivity Threshold</div>
              <div className="text-slate-500">
                Notify when category burn reaches {settings.overspendAlertThreshold}% of budget limit.
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="70"
                max="95"
                step="5"
                value={settings.overspendAlertThreshold}
                onChange={(e) =>
                  updateSettings({ overspendAlertThreshold: parseInt(e.target.value, 10) })
                }
                className="w-24 accent-emerald-500"
              />
              <span className="font-mono text-emerald-400 font-semibold w-10 text-right">
                {settings.overspendAlertThreshold}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Data Export & Reset Zone */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white">Data Management & Reset</h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <div className="text-xs font-medium text-slate-200">Export Complete JSON Backup</div>
            <div className="text-xs text-slate-500">
              Download your full profile, vault locks, and ledger for offline backup.
            </div>
          </div>
          <button
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors border border-slate-700 self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Snapshot</span>
          </button>
        </div>

        {exportNotice && (
          <div className="p-3 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>Financial backup downloaded successfully!</span>
          </div>
        )}

        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-medium text-rose-300">Reset to Factory Demo State</div>
            <div className="text-xs text-slate-500">
              Clears custom adjustments and resets all 21 modules to default demo profiles.
            </div>
          </div>

          {resetConfirmOpen ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  resetToDefaults();
                  setResetConfirmOpen(false);
                }}
                className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg transition-colors"
              >
                Confirm Reset
              </button>
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-2.5 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setResetConfirmOpen(true)}
              className="px-3 py-1.5 bg-slate-950 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 hover:border-rose-900/50 text-xs font-medium rounded-lg transition-colors self-start sm:self-auto"
            >
              Reset Data
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
