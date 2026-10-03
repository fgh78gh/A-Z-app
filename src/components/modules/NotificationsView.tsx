import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  Bell,
  CheckCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Sparkles,
} from 'lucide-react';

export const NotificationsView: React.FC = () => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsRead,
    settings,
    updateSettings,
  } = useFinance();

  const [selectedType, setSelectedType] = useState('All');

  const types = ['All', 'transaction', 'alert', 'system', 'milestone'];

  const filtered = notifications.filter(
    (n) => selectedType === 'All' || n.type === selectedType
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-emerald-400" />
            <span>Notifications & Operational Dispatch</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time audit alerts, automated salary sweeps, milestone unlocks, and security dispatches.
          </p>
        </div>

        <button
          onClick={markAllNotificationsRead}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-lg text-xs font-medium transition-colors self-start sm:self-auto"
        >
          <CheckCheck className="w-4 h-4 text-emerald-400" />
          <span>Mark All Read</span>
        </button>
      </div>

      {/* Type Filter Buttons */}
      <div className="flex items-center gap-1.5 flex-wrap">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => setSelectedType(type)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${
              selectedType === type
                ? 'bg-slate-800 text-white border border-slate-700'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden divide-y divide-slate-800/80">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            No notifications in this view.
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationAsRead(item.id)}
              className={`p-4 flex items-start justify-between gap-4 cursor-pointer transition-colors ${
                item.read ? 'bg-slate-900/40 hover:bg-slate-800/30' : 'bg-slate-900/90 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                    item.read ? 'bg-transparent' : 'bg-emerald-400'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{item.title}</span>
                    <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">{item.message}</p>
                  <span className="text-[10px] text-slate-500 font-mono mt-1.5 block">
                    {item.timestamp}
                  </span>
                </div>
              </div>

              {!item.read && (
                <span className="text-[10px] font-mono text-emerald-400 shrink-0">Unread</span>
              )}
            </div>
          ))
        )}
      </div>

      {/* Granular Notification Channels */}
      <div className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-4">
        <h2 className="text-sm font-semibold text-white">Channel Dispatch Preferences</h2>

        <div className="divide-y divide-slate-800 text-xs">
          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-medium">Real-Time Mobile Push Alerts</div>
              <div className="text-slate-500">Alert immediately on expenses exceeding $100</div>
            </div>
            <button
              onClick={() =>
                updateSettings({ pushNotifications: !settings.pushNotifications })
              }
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                settings.pushNotifications
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {settings.pushNotifications ? 'Active' : 'Muted'}
            </button>
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <div className="text-slate-200 font-medium">Weekly Executive Wealth Digest</div>
              <div className="text-slate-500">Receive cashflow report every Sunday at 8 PM</div>
            </div>
            <button
              onClick={() => updateSettings({ emailDigest: !settings.emailDigest })}
              className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                settings.emailDigest
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                  : 'bg-slate-800 text-slate-500'
              }`}
            >
              {settings.emailDigest ? 'Active' : 'Muted'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
