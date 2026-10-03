import React, { useState, useEffect } from 'react';
import { useFinance, ActiveModuleId } from '../../context/FinanceContext';
import {
  Search,
  X,
  PlusCircle,
  Shield,
  LifeBuoy,
  CreditCard,
  Bot,
  Lock,
  Eye,
  Sliders,
  Wallet,
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickExpense: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenQuickExpense,
}) => {
  const { setActiveModule, togglePrivacyMode, lockApp, executePaydaySweep } = useFinance();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const allItems: {
    id: string;
    label: string;
    category: string;
    action: () => void;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: 'act_expense',
      label: 'Log New Expense (+ Receipt)',
      category: 'Quick Actions',
      icon: PlusCircle,
      action: () => {
        onClose();
        onOpenQuickExpense();
      },
    },
    {
      id: 'act_payday',
      label: 'Simulate Salary Payday Inflow & Split',
      category: 'Quick Actions',
      icon: Wallet,
      action: () => {
        executePaydaySweep();
        onClose();
      },
    },
    {
      id: 'act_privacy',
      label: 'Toggle Privacy Mode (Obfuscate Numbers)',
      category: 'Quick Actions',
      icon: Eye,
      action: () => {
        togglePrivacyMode();
        onClose();
      },
    },
    {
      id: 'act_lock',
      label: 'Lock Session (Require PIN)',
      category: 'Quick Actions',
      icon: Lock,
      action: () => {
        lockApp();
        onClose();
      },
    },
    {
      id: 'mod_dashboard',
      label: 'Dashboard Overview',
      category: 'Navigation',
      icon: Sliders,
      action: () => {
        setActiveModule('dashboard');
        onClose();
      },
    },
    {
      id: 'mod_salary',
      label: 'Salary Management & Deductions',
      category: 'Navigation',
      icon: Wallet,
      action: () => {
        setActiveModule('salary');
        onClose();
      },
    },
    {
      id: 'mod_allocation',
      label: 'Money Allocation (50/30/20 Buckets)',
      category: 'Navigation',
      icon: Sliders,
      action: () => {
        setActiveModule('allocation');
        onClose();
      },
    },
    {
      id: 'mod_budget',
      label: 'Budget Control & Limits',
      category: 'Navigation',
      icon: Sliders,
      action: () => {
        setActiveModule('budget');
        onClose();
      },
    },
    {
      id: 'mod_savings',
      label: 'Protected Savings & Vaults (5.1% APY)',
      category: 'Navigation',
      icon: Shield,
      action: () => {
        setActiveModule('savings');
        onClose();
      },
    },
    {
      id: 'mod_emergency',
      label: 'Emergency Fund Runway',
      category: 'Navigation',
      icon: LifeBuoy,
      action: () => {
        setActiveModule('emergency');
        onClose();
      },
    },
    {
      id: 'mod_assistant',
      label: 'Financial Assistant (SmartMoney AI)',
      category: 'Navigation',
      icon: Bot,
      action: () => {
        setActiveModule('assistant');
        onClose();
      },
    },
    {
      id: 'mod_cards',
      label: 'Savings Cards & Round-Ups',
      category: 'Navigation',
      icon: CreditCard,
      action: () => {
        setActiveModule('cards');
        onClose();
      },
    },
    {
      id: 'mod_subscriptions',
      label: 'Subscriptions Audit & Waste Tracker',
      category: 'Navigation',
      icon: Sliders,
      action: () => {
        setActiveModule('subscriptions');
        onClose();
      },
    },
    {
      id: 'mod_reports',
      label: 'Reports & Statements',
      category: 'Navigation',
      icon: Sliders,
      action: () => {
        setActiveModule('reports');
        onClose();
      },
    },
  ];

  const filtered = allItems.filter(
    (item) =>
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-3 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Type a command or jump to module..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching modules or actions found.
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full flex items-center justify-between px-3 py-2 text-left rounded-lg hover:bg-slate-800/80 group transition-colors"
                >
                  <div className="flex items-center gap-3 truncate">
                    <div className="w-7 h-7 rounded-md bg-slate-800 flex items-center justify-center text-slate-300 group-hover:text-emerald-400 group-hover:bg-emerald-500/10 transition-colors">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-medium text-slate-200 group-hover:text-white truncate">
                      {item.label}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono tracking-wider">
                    {item.category}
                  </span>
                </button>
              );
            })
          )}
        </div>

        <div className="px-3 py-2 bg-slate-950/60 border-t border-slate-800/60 text-[10px] text-slate-500 flex items-center justify-between font-mono">
          <span>Navigate with mouse or keyboard</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
