import React, { useState } from 'react';
import { FinanceProvider, useFinance, ActiveModuleId } from './context/FinanceContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { CommandPalette } from './components/layout/CommandPalette';
import { QuickExpenseModal } from './components/modals/QuickExpenseModal';

// 21 Modules
import { AuthenticationView } from './components/modules/AuthenticationView';
import { UserProfileView } from './components/modules/UserProfileView';
import { DashboardView } from './components/modules/DashboardView';
import { SalaryManagementView } from './components/modules/SalaryManagementView';
import { MoneyAllocationView } from './components/modules/MoneyAllocationView';
import { ExpenseManagementView } from './components/modules/ExpenseManagementView';
import { BudgetControlView } from './components/modules/BudgetControlView';
import { ProtectedSavingsView } from './components/modules/ProtectedSavingsView';
import { EmergencyFundView } from './components/modules/EmergencyFundView';
import { GoalsView } from './components/modules/GoalsView';
import { SmartAlertsView } from './components/modules/SmartAlertsView';
import { SpendingAnalysisView } from './components/modules/SpendingAnalysisView';
import { SmartOffersView } from './components/modules/SmartOffersView';
import { SavingsCardsView } from './components/modules/SavingsCardsView';
import { RewardsLoyaltyView } from './components/modules/RewardsLoyaltyView';
import { SubscriptionView } from './components/modules/SubscriptionView';
import { TransactionsView } from './components/modules/TransactionsView';
import { ReportsAnalyticsView } from './components/modules/ReportsAnalyticsView';
import { NotificationsView } from './components/modules/NotificationsView';
import { FinancialAssistantView } from './components/modules/FinancialAssistantView';
import { SettingsView } from './components/modules/SettingsView';

const MainContent: React.FC = () => {
  const { activeModule, isLocked } = useFinance();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickExpenseOpen, setQuickExpenseOpen] = useState(false);

  const renderModule = () => {
    // If locked, prioritize showing Authentication PIN screen
    if (isLocked) {
      return <AuthenticationView />;
    }

    switch (activeModule) {
      case 'authentication':
        return <AuthenticationView />;
      case 'profile':
        return <UserProfileView />;
      case 'dashboard':
        return <DashboardView onOpenQuickExpense={() => setQuickExpenseOpen(true)} />;
      case 'salary':
        return <SalaryManagementView />;
      case 'allocation':
        return <MoneyAllocationView />;
      case 'expenses':
        return <ExpenseManagementView onOpenQuickExpense={() => setQuickExpenseOpen(true)} />;
      case 'budget':
        return <BudgetControlView />;
      case 'savings':
        return <ProtectedSavingsView />;
      case 'emergency':
        return <EmergencyFundView />;
      case 'goals':
        return <GoalsView />;
      case 'alerts':
        return <SmartAlertsView />;
      case 'analysis':
        return <SpendingAnalysisView />;
      case 'offers':
        return <SmartOffersView />;
      case 'cards':
        return <SavingsCardsView />;
      case 'rewards':
        return <RewardsLoyaltyView />;
      case 'subscriptions':
        return <SubscriptionView />;
      case 'transactions':
        return <TransactionsView />;
      case 'reports':
        return <ReportsAnalyticsView />;
      case 'notifications':
        return <NotificationsView />;
      case 'assistant':
        return <FinancialAssistantView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onOpenQuickExpense={() => setQuickExpenseOpen(true)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/20 selection:text-emerald-400">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenCommand={() => setCommandPaletteOpen(true)}
        onToggleMobileMenu={() => setMobileMenuOpen(!mobileMenuOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Work Area */}
        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
          {renderModule()}
        </main>
      </div>

      {/* Global Command Palette (Cmd+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onOpenQuickExpense={() => setQuickExpenseOpen(true)}
      />

      {/* Quick Record Expense Modal */}
      <QuickExpenseModal
        isOpen={quickExpenseOpen}
        onClose={() => setQuickExpenseOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <FinanceProvider>
      <MainContent />
    </FinanceProvider>
  );
}
