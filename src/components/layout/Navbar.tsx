import React from 'react';
import { useFinance, ActiveModuleId } from '../../context/FinanceContext';
import { Eye, EyeOff, Lock, Bell, Search, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onOpenCommand: () => void;
  onToggleMobileMenu: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCommand, onToggleMobileMenu }) => {
  const {
    user,
    activeModule,
    setActiveModule,
    settings,
    togglePrivacyMode,
    lockApp,
    unreadCount,
    totalNetWorth,
    formatCurrency,
  } = useFinance();

  const primaryNavItems: { id: ActiveModuleId; label: string }[] = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'salary', label: 'Salary' },
    { id: 'allocation', label: 'Allocation' },
    { id: 'savings', label: 'Vaults' },
    { id: 'assistant', label: 'AI Coach' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-40 h-16 w-full border-b border-slate-800/80 bg-slate-950/90 backdrop-blur-md px-4 lg:px-8 flex items-center justify-between transition-colors">
      {/* Zone 1: Single text element Brand Zone */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-900 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <a
          href="#dashboard"
          onClick={(e) => {
            e.preventDefault();
            setActiveModule('dashboard');
          }}
          className="text-lg font-bold tracking-tight text-white flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
            $
          </div>
          <span className="font-semibold tracking-tight">SmartMoney</span>
        </a>
      </div>

      {/* Zone 2: Clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
        {primaryNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveModule(item.id)}
            className={`transition-colors text-xs uppercase tracking-wider py-1 ${
              activeModule === item.id
                ? 'text-emerald-400 font-semibold border-b-2 border-emerald-400'
                : 'hover:text-slate-200'
            }`}
          >
            {item.label}
          </button>
        ))}

        {/* Quick Search affordance */}
        <button
          onClick={onOpenCommand}
          className="flex items-center gap-2 px-2.5 py-1 text-xs text-slate-400 bg-slate-900/80 hover:bg-slate-900 border border-slate-800 rounded-md transition-colors"
          title="Search modules & actions (Cmd+K)"
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Search</span>
          <kbd className="text-[10px] font-mono px-1 py-0.5 bg-slate-800 rounded text-slate-400">⌘K</kbd>
        </button>
      </nav>

      {/* Zone 3: 1-2 primary actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Net Worth subtle ticker */}
        <div className="hidden xl:flex flex-col items-end mr-2">
          <span className="text-[10px] text-slate-500 uppercase tracking-wider font-mono">Net Worth</span>
          <span className="text-sm font-semibold tabular-nums text-slate-200">
            {formatCurrency(totalNetWorth)}
          </span>
        </div>

        {/* Privacy toggle */}
        <button
          onClick={togglePrivacyMode}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
          title={settings.privacyMode ? 'Reveal numbers' : 'Hide numbers (Privacy Mode)'}
          aria-label="Toggle privacy mode"
        >
          {settings.privacyMode ? (
            <EyeOff className="w-4 h-4 text-amber-400" />
          ) : (
            <Eye className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {/* Notifications */}
        <button
          onClick={() => setActiveModule('notifications')}
          className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full ring-2 ring-slate-950" />
          )}
        </button>

        {/* Lock App */}
        <button
          onClick={lockApp}
          className="p-2 text-slate-400 hover:text-rose-300 hover:bg-slate-900 rounded-lg transition-colors"
          title="Lock App Session"
          aria-label="Lock App Session"
        >
          <Lock className="w-4 h-4" />
        </button>

        {/* Profile Avatar Trigger */}
        <button
          onClick={() => setActiveModule('profile')}
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-lg hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-all text-left"
          title="Open User Profile"
        >
          <img
            src={user.avatar}
            alt={user.name}
            className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-700"
          />
          <div className="hidden sm:block text-xs">
            <div className="font-medium text-slate-200 leading-none truncate max-w-[100px]">
              {user.name.split(' ')[0]}
            </div>
            <div className="text-[10px] text-emerald-400 font-mono leading-tight">
              {user.tier}
            </div>
          </div>
        </button>
      </div>
    </header>
  );
};
