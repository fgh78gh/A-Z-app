import React, { useState } from 'react';
import { useFinance } from '../../context/FinanceContext';
import {
  BellRing,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const SmartAlertsView: React.FC = () => {
  const { alerts, resolveAlert, dismissAlert, formatCurrency, setActiveModule } = useFinance();
  const [filter, setFilter] = useState<'all' | 'unresolved' | 'resolved'>('all');

  const filtered = alerts.filter((a) => {
    if (filter === 'unresolved') return !a.resolved;
    if (filter === 'resolved') return a.resolved;
    return true;
  });

  const unresolvedCount = alerts.filter((a) => !a.resolved).length;

  const handleActionClick = (alertId: string, alertType: string) => {
    resolveAlert(alertId);
    if (alertType === 'budget_warning') {
      setActiveModule('budget');
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <BellRing className="w-5 h-5 text-emerald-400" />
            <span>Smart Alerts & Anomaly Detection</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time fraud heuristics, duplicate billing guards, and velocity warnings.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'all'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All ({alerts.length})
          </button>
          <button
            onClick={() => setFilter('unresolved')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'unresolved'
                ? 'bg-slate-800 text-amber-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Action Required ({unresolvedCount})
          </button>
          <button
            onClick={() => setFilter('resolved')}
            className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
              filter === 'resolved'
                ? 'bg-slate-800 text-emerald-400 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Resolved ({alerts.length - unresolvedCount})
          </button>
        </div>
      </div>

      {/* Alert Feed */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-slate-900 border border-slate-800 rounded-xl space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h3 className="text-sm font-semibold text-white">No active alerts</h3>
            <p className="text-xs text-slate-400">All financial anomalies have been reviewed and reconciled.</p>
          </div>
        ) : (
          filtered.map((alert) => {
            const isHigh = alert.severity === 'high';
            const isResolved = alert.resolved;

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-xl border transition-all ${
                  isResolved
                    ? 'bg-slate-950/60 border-slate-800/60 opacity-60'
                    : isHigh
                    ? 'bg-slate-900 border-amber-500/30'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        isResolved
                          ? 'bg-slate-800 text-slate-400'
                          : isHigh
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {isResolved ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">{alert.title}</span>
                        <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {alert.severity} priority
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 mt-1">{alert.description}</p>
                      <div className="text-[11px] text-slate-500 font-mono mt-1.5 flex items-center gap-2">
                        <span>Triggered on {alert.date}</span>
                        {alert.amount !== undefined && (
                          <>
                            <span>·</span>
                            <span className="text-slate-300 font-semibold">
                              Impact: {formatCurrency(alert.amount)}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {!isResolved ? (
                      <button
                        onClick={() => handleActionClick(alert.id, alert.type)}
                        className="px-3.5 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                      >
                        <span>{alert.actionText || 'Resolve'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Resolved
                      </span>
                    )}

                    <button
                      onClick={() => dismissAlert(alert.id)}
                      className="p-1.5 text-slate-500 hover:text-rose-400 rounded transition-colors"
                      title="Dismiss alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
