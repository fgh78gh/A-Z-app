import React from 'react';
import { useFinance, ActiveModuleId } from '../../context/FinanceContext';
import {
  LayoutDashboard,
  Wallet,
  PieChart,
  Receipt,
  Sliders,
  Shield,
  LifeBuoy,
  Target,
  BellRing,
  TrendingDown,
  Sparkles,
  CreditCard,
  Award,
  RefreshCw,
  ListOrdered,
  FileBarChart,
  Bell,
  Bot,
  Settings,
  UserCheck,
  KeyRound,
  X,
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavGroup {
  title: string;
  items: {
    id: ActiveModuleId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    count?: number;
  }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeModule, setActiveModule, unreadCount, alerts } = useFinance();

  const unresolvedAlertsCount = alerts.filter((a) => !a.resolved).length;

  const navGroups: NavGroup[] = [
    {
      title: 'Command',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'transactions', label: 'Transactions', icon: ListOrdered },
        { id: 'reports', label: 'Reports & Analytics', icon: FileBarChart },
      ],
    },
    {
      title: 'Income & Budget',
      items: [
        { id: 'salary', label: 'Salary Management', icon: Wallet },
        { id: 'allocation', label: 'Money Allocation', icon: PieChart },
        { id: 'expenses', label: 'Expense Management', icon: Receipt },
        { id: 'budget', label: 'Budget Control', icon: Sliders },
      ],
    },
    {
      title: 'Wealth & Vaults',
      items: [
        { id: 'savings', label: 'Protected Savings', icon: Shield },
        { id: 'emergency', label: 'Emergency Fund', icon: LifeBuoy },
        { id: 'goals', label: 'Goals', icon: Target },
        { id: 'cards', label: 'Savings Cards', icon: CreditCard },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'assistant', label: 'Financial Assistant', icon: Bot },
        { id: 'alerts', label: 'Smart Alerts', icon: BellRing, count: unresolvedAlertsCount },
        { id: 'analysis', label: 'Spending Analysis', icon: TrendingDown },
        { id: 'subscriptions', label: 'Subscription', icon: RefreshCw },
      ],
    },
    {
      title: 'Ecosystem & Profile',
      items: [
        { id: 'offers', label: 'Smart Offers', icon: Sparkles },
        { id: 'rewards', label: 'Rewards & Loyalty', icon: Award },
        { id: 'profile', label: 'User Profile', icon: UserCheck },
        { id: 'notifications', label: 'Notifications', icon: Bell, count: unreadCount },
        { id: 'authentication', label: 'Authentication', icon: KeyRound },
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  const handleSelect = (id: ActiveModuleId) => {
    setActiveModule(id);
    onCloseMobile();
  };

  const content = (
    <div className="flex flex-col h-full bg-slate-950 border-r border-slate-900/90 w-64 select-none">
      {/* Mobile close header */}
      <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-900">
        <span className="text-sm font-semibold tracking-tight text-white">SmartMoney Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 text-slate-400 hover:text-white rounded-md hover:bg-slate-900"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
              {group.title}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeModule === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors group text-left ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <Icon
                        className={`w-4 h-4 shrink-0 transition-colors ${
                          isActive
                            ? 'text-emerald-400'
                            : 'text-slate-500 group-hover:text-slate-300'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </div>

                    {item.count !== undefined && item.count > 0 && (
                      <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Footer System Status */}
      <div className="p-3 border-t border-slate-900/80 text-[11px] text-slate-500 flex items-center justify-between">
        <span className="font-mono">v3.4.2 Secure</span>
        <span className="text-emerald-400/80 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          Encrypted
        </span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop permanent sidebar */}
      <aside className="hidden lg:block shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
