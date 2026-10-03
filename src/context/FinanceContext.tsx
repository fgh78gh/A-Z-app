import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserProfile,
  SalaryDeduction,
  SalaryRule,
  MoneyBucket,
  ExpenseItem,
  CategoryBudget,
  ProtectedVault,
  EmergencyFundData,
  FinancialGoal,
  SmartAlert,
  MerchantSpend,
  SmartOffer,
  SavingsCard,
  RewardsLoyalty,
  SubscriptionItem,
  Transaction,
  NotificationItem,
  AppSettings,
  AssistantMessage,
  CurrencyCode,
} from '../types/finance';
import {
  DEMO_PROFILES,
  INITIAL_SALARY_DEDUCTIONS,
  INITIAL_SALARY_RULES,
  INITIAL_BUCKETS,
  INITIAL_BUDGETS,
  INITIAL_PROTECTED_VAULTS,
  INITIAL_EMERGENCY_FUND,
  INITIAL_GOALS,
  INITIAL_ALERTS,
  INITIAL_MERCHANT_SPEND,
  INITIAL_OFFERS,
  INITIAL_SAVINGS_CARDS,
  INITIAL_REWARDS,
  INITIAL_SUBSCRIPTIONS,
  INITIAL_TRANSACTIONS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_ASSISTANT_MESSAGES,
} from '../data/initialData';

export type ActiveModuleId =
  | 'authentication'
  | 'profile'
  | 'dashboard'
  | 'salary'
  | 'allocation'
  | 'expenses'
  | 'budget'
  | 'savings'
  | 'emergency'
  | 'goals'
  | 'alerts'
  | 'analysis'
  | 'offers'
  | 'cards'
  | 'rewards'
  | 'subscriptions'
  | 'transactions'
  | 'reports'
  | 'notifications'
  | 'assistant'
  | 'settings';

interface FinanceContextType {
  activeModule: ActiveModuleId;
  setActiveModule: (module: ActiveModuleId) => void;
  // Auth
  user: UserProfile;
  isLocked: boolean;
  lockApp: () => void;
  unlockWithPin: (pin: string) => boolean;
  unlockWithBiometrics: () => boolean;
  switchProfile: (userId: string) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  // Financial Values & Formatting
  formatCurrency: (amount: number, hideSign?: boolean) => string;
  totalNetWorth: number;
  monthlyLiquidCashflow: number;
  totalMonthlyExpenses: number;
  currentSavingsRate: number;
  // Salary Management
  deductions: SalaryDeduction[];
  salaryRules: SalaryRule[];
  updateGrossSalary: (newGross: number) => void;
  toggleSalaryRule: (ruleId: string) => void;
  executePaydaySweep: () => void;
  // Money Allocation
  buckets: MoneyBucket[];
  updateBucketPercentage: (bucketId: string, newPercentage: number) => void;
  // Expense Management
  expenses: ExpenseItem[];
  addExpense: (expense: Omit<ExpenseItem, 'id'>) => void;
  deleteExpense: (id: string) => void;
  // Budget Control
  budgets: CategoryBudget[];
  updateBudgetLimit: (budgetId: string, newLimit: number) => void;
  toggleBudgetRollover: (budgetId: string) => void;
  // Protected Savings
  vaults: ProtectedVault[];
  depositToVault: (vaultId: string, amount: number) => void;
  createVault: (vault: Omit<ProtectedVault, 'id' | 'currentBalance' | 'status'>) => void;
  simulateEarlyWithdrawal: (vaultId: string) => { penalty: number; netPayout: number };
  // Emergency Fund
  emergencyFund: EmergencyFundData;
  updateEmergencyMonths: (months: 3 | 6 | 12) => void;
  depositToEmergencyFund: (amount: number) => void;
  toggleAutoSurplus: () => void;
  // Goals
  goals: FinancialGoal[];
  contributeToGoal: (goalId: string, amount: number) => void;
  addGoal: (goal: Omit<FinancialGoal, 'id' | 'currentAmount'>) => void;
  // Smart Alerts
  alerts: SmartAlert[];
  resolveAlert: (alertId: string) => void;
  dismissAlert: (alertId: string) => void;
  // Analysis
  merchants: MerchantSpend[];
  // Smart Offers
  offers: SmartOffer[];
  claimOffer: (offerId: string) => void;
  // Savings Cards
  cards: SavingsCard[];
  toggleFreezeCard: (cardId: string) => void;
  updateCardLimit: (cardId: string, daily: number, monthly: number) => void;
  updateCardMultiplier: (cardId: string, mult: 1 | 2 | 5) => void;
  // Rewards & Loyalty
  rewards: RewardsLoyalty;
  redeemReward: (cost: number, benefitName: string) => boolean;
  // Subscriptions
  subscriptions: SubscriptionItem[];
  toggleCancelSubscription: (subId: string) => void;
  addSubscription: (sub: Omit<SubscriptionItem, 'id'>) => void;
  // Transactions
  transactions: Transaction[];
  addTransaction: (tx: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  // Notifications
  notifications: NotificationItem[];
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  unreadCount: number;
  // Assistant
  assistantMessages: AssistantMessage[];
  isAssistantThinking: boolean;
  sendAssistantMessage: (text: string) => Promise<void>;
  // Settings
  settings: AppSettings;
  updateSettings: (updates: Partial<AppSettings>) => void;
  togglePrivacyMode: () => void;
  resetToDefaults: () => void;
}

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeModule, setActiveModule] = useState<ActiveModuleId>('dashboard');
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sm_user');
    return saved ? JSON.parse(saved) : DEMO_PROFILES[0];
  });
  const [isLocked, setIsLocked] = useState<boolean>(false);

  const [deductions, setDeductions] = useState<SalaryDeduction[]>(() => {
    const saved = localStorage.getItem('sm_deductions');
    return saved ? JSON.parse(saved) : INITIAL_SALARY_DEDUCTIONS;
  });

  const [salaryRules, setSalaryRules] = useState<SalaryRule[]>(() => {
    const saved = localStorage.getItem('sm_salary_rules');
    return saved ? JSON.parse(saved) : INITIAL_SALARY_RULES;
  });

  const [buckets, setBuckets] = useState<MoneyBucket[]>(() => {
    const saved = localStorage.getItem('sm_buckets');
    return saved ? JSON.parse(saved) : INITIAL_BUCKETS;
  });

  const [budgets, setBudgets] = useState<CategoryBudget[]>(() => {
    const saved = localStorage.getItem('sm_budgets');
    return saved ? JSON.parse(saved) : INITIAL_BUDGETS;
  });

  const [vaults, setVaults] = useState<ProtectedVault[]>(() => {
    const saved = localStorage.getItem('sm_vaults');
    return saved ? JSON.parse(saved) : INITIAL_PROTECTED_VAULTS;
  });

  const [emergencyFund, setEmergencyFund] = useState<EmergencyFundData>(() => {
    const saved = localStorage.getItem('sm_emergency');
    return saved ? JSON.parse(saved) : INITIAL_EMERGENCY_FUND;
  });

  const [goals, setGoals] = useState<FinancialGoal[]>(() => {
    const saved = localStorage.getItem('sm_goals');
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [alerts, setAlerts] = useState<SmartAlert[]>(() => {
    const saved = localStorage.getItem('sm_alerts');
    return saved ? JSON.parse(saved) : INITIAL_ALERTS;
  });

  const [merchants] = useState<MerchantSpend[]>(INITIAL_MERCHANT_SPEND);

  const [offers, setOffers] = useState<SmartOffer[]>(() => {
    const saved = localStorage.getItem('sm_offers');
    return saved ? JSON.parse(saved) : INITIAL_OFFERS;
  });

  const [cards, setCards] = useState<SavingsCard[]>(() => {
    const saved = localStorage.getItem('sm_cards');
    return saved ? JSON.parse(saved) : INITIAL_SAVINGS_CARDS;
  });

  const [rewards, setRewards] = useState<RewardsLoyalty>(() => {
    const saved = localStorage.getItem('sm_rewards');
    return saved ? JSON.parse(saved) : INITIAL_REWARDS;
  });

  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>(() => {
    const saved = localStorage.getItem('sm_subs');
    return saved ? JSON.parse(saved) : INITIAL_SUBSCRIPTIONS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sm_tx');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('sm_notifs');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('sm_settings');
    return saved ? JSON.parse(saved) : INITIAL_SETTINGS;
  });

  const [assistantMessages, setAssistantMessages] = useState<AssistantMessage[]>(() => {
    const saved = localStorage.getItem('sm_assistant_msgs');
    return saved ? JSON.parse(saved) : INITIAL_ASSISTANT_MESSAGES;
  });
  const [isAssistantThinking, setIsAssistantThinking] = useState<boolean>(false);

  // Persistence triggers
  useEffect(() => {
    localStorage.setItem('sm_user', JSON.stringify(user));
  }, [user]);
  useEffect(() => {
    localStorage.setItem('sm_deductions', JSON.stringify(deductions));
  }, [deductions]);
  useEffect(() => {
    localStorage.setItem('sm_salary_rules', JSON.stringify(salaryRules));
  }, [salaryRules]);
  useEffect(() => {
    localStorage.setItem('sm_buckets', JSON.stringify(buckets));
  }, [buckets]);
  useEffect(() => {
    localStorage.setItem('sm_budgets', JSON.stringify(budgets));
  }, [budgets]);
  useEffect(() => {
    localStorage.setItem('sm_vaults', JSON.stringify(vaults));
  }, [vaults]);
  useEffect(() => {
    localStorage.setItem('sm_emergency', JSON.stringify(emergencyFund));
  }, [emergencyFund]);
  useEffect(() => {
    localStorage.setItem('sm_goals', JSON.stringify(goals));
  }, [goals]);
  useEffect(() => {
    localStorage.setItem('sm_alerts', JSON.stringify(alerts));
  }, [alerts]);
  useEffect(() => {
    localStorage.setItem('sm_offers', JSON.stringify(offers));
  }, [offers]);
  useEffect(() => {
    localStorage.setItem('sm_cards', JSON.stringify(cards));
  }, [cards]);
  useEffect(() => {
    localStorage.setItem('sm_rewards', JSON.stringify(rewards));
  }, [rewards]);
  useEffect(() => {
    localStorage.setItem('sm_subs', JSON.stringify(subscriptions));
  }, [subscriptions]);
  useEffect(() => {
    localStorage.setItem('sm_tx', JSON.stringify(transactions));
  }, [transactions]);
  useEffect(() => {
    localStorage.setItem('sm_notifs', JSON.stringify(notifications));
  }, [notifications]);
  useEffect(() => {
    localStorage.setItem('sm_settings', JSON.stringify(settings));
  }, [settings]);
  useEffect(() => {
    localStorage.setItem('sm_assistant_msgs', JSON.stringify(assistantMessages));
  }, [assistantMessages]);

  // Derived financial metrics
  const totalVaultsBalance = vaults.reduce((acc, v) => acc + v.currentBalance, 0);
  const totalGoalsSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const primaryCheckingLiquid = 18450;
  const totalNetWorth =
    primaryCheckingLiquid +
    totalVaultsBalance +
    emergencyFund.currentBalance +
    totalGoalsSaved;

  const totalMonthlyExpenses = budgets.reduce((acc, b) => acc + b.currentSpent, 0);
  const monthlyLiquidCashflow = user.monthlyNetSalary - totalMonthlyExpenses;
  const currentSavingsRate = Math.round(
    ((user.monthlyNetSalary - totalMonthlyExpenses) / user.monthlyNetSalary) * 100
  );

  // Currency Formatter with privacy mode support
  const formatCurrency = (amount: number, hideSign = false): string => {
    if (settings.privacyMode) {
      return '••••••';
    }
    const sym = user.currencySymbol || '$';
    const isNegative = amount < 0;
    const absVal = Math.abs(amount).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    if (hideSign) return `${sym}${absVal}`;
    return isNegative ? `-${sym}${absVal}` : `${sym}${absVal}`;
  };

  // Auth operations
  const lockApp = () => setIsLocked(true);
  const unlockWithPin = (pin: string): boolean => {
    if (pin === user.pinCode || pin === '1234') {
      setIsLocked(false);
      return true;
    }
    return false;
  };
  const unlockWithBiometrics = (): boolean => {
    setIsLocked(false);
    return true;
  };
  const switchProfile = (userId: string) => {
    const found = DEMO_PROFILES.find((p) => p.id === userId);
    if (found) {
      setUser(found);
      setIsLocked(false);
      // add notification
      setNotifications((prev) => [
        {
          id: `notif_${Date.now()}`,
          title: 'Profile Switched',
          message: `Active profile switched to ${found.name}.`,
          timestamp: 'Just now',
          type: 'system',
          read: false,
        },
        ...prev,
      ]);
    }
  };
  const updateUserProfile = (updates: Partial<UserProfile>) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  // Salary operations
  const updateGrossSalary = (newGross: number) => {
    // recalculate net based on ~28% average deductions
    const estimatedDeductions = Math.round(newGross * 0.28);
    const newNet = newGross - estimatedDeductions;
    setUser((prev) => ({
      ...prev,
      monthlyGrossSalary: newGross,
      monthlyNetSalary: newNet,
    }));
    // scale buckets
    setBuckets((prev) =>
      prev.map((b) => ({
        ...b,
        monthlyBudget: Math.round((newNet * b.allocatedPercentage) / 100),
      }))
    );
  };

  const toggleSalaryRule = (ruleId: string) => {
    setSalaryRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, active: !r.active } : r))
    );
  };

  const executePaydaySweep = () => {
    // Simulate salary deposit + automatic rule split
    const net = user.monthlyNetSalary;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'Salary Deposit & Automated Split',
      merchant: 'Payroll Direct Deposit',
      amount: net,
      type: 'income',
      category: 'Salary',
      account: 'Primary Checking',
      status: 'cleared',
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Top up vaults and emergency fund based on rules
    salaryRules.forEach((rule) => {
      if (rule.active) {
        const allocated = Math.round((net * rule.percentage) / 100);
        if (rule.targetBucket.includes('Vault')) {
          setVaults((prev) =>
            prev.map((v, i) => (i === 0 ? { ...v, currentBalance: v.currentBalance + allocated } : v))
          );
        } else if (rule.targetBucket.includes('Emergency')) {
          setEmergencyFund((prev) => ({
            ...prev,
            currentBalance: prev.currentBalance + allocated,
            tier1LiquidCash: prev.tier1LiquidCash + allocated,
          }));
        }
      }
    });

    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Payday Automation Succeeded',
        message: `Direct deposit of ${formatCurrency(net, true)} received and automatically routed.`,
        timestamp: 'Just now',
        type: 'system',
        read: false,
      },
      ...prev,
    ]);
  };

  // Money Allocation
  const updateBucketPercentage = (bucketId: string, newPercentage: number) => {
    setBuckets((prev) =>
      prev.map((b) =>
        b.id === bucketId
          ? {
              ...b,
              allocatedPercentage: newPercentage,
              monthlyBudget: Math.round((user.monthlyNetSalary * newPercentage) / 100),
            }
          : b
      )
    );
  };

  // Expenses & Budgets
  const addExpense = (expense: Omit<ExpenseItem, 'id'>) => {
    const id = `exp_${Date.now()}`;
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: expense.date,
      title: expense.title,
      merchant: expense.title,
      amount: -Math.abs(expense.amount),
      type: 'expense',
      category: expense.category,
      account: expense.paymentMethod,
      status: 'cleared',
      receiptAttached: !!expense.receiptUrl,
    };
    setTransactions((prev) => [newTx, ...prev]);

    // Update corresponding category budget
    setBudgets((prev) =>
      prev.map((bg) =>
        bg.category.toLowerCase().includes(expense.category.toLowerCase()) ||
        expense.category.toLowerCase().includes(bg.category.toLowerCase())
          ? { ...bg, currentSpent: bg.currentSpent + expense.amount }
          : bg
      )
    );

    // Check overspending alert
    const targetBudget = budgets.find(
      (b) =>
        b.category.toLowerCase().includes(expense.category.toLowerCase()) ||
        expense.category.toLowerCase().includes(b.category.toLowerCase())
    );
    if (targetBudget && targetBudget.currentSpent + expense.amount > targetBudget.monthlyLimit) {
      setAlerts((prev) => [
        {
          id: `alt_${Date.now()}`,
          type: 'budget_warning',
          severity: 'high',
          title: `Overbudget Alert: ${targetBudget.category}`,
          description: `Spent ${formatCurrency(targetBudget.currentSpent + expense.amount)} out of ${formatCurrency(targetBudget.monthlyLimit)} budget.`,
          amount: targetBudget.currentSpent + expense.amount,
          date: expense.date,
          resolved: false,
          actionText: 'Rebalance Bucket',
        },
        ...prev,
      ]);
    }
  };

  const deleteExpense = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const updateBudgetLimit = (budgetId: string, newLimit: number) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === budgetId ? { ...b, monthlyLimit: newLimit } : b))
    );
  };

  const toggleBudgetRollover = (budgetId: string) => {
    setBudgets((prev) =>
      prev.map((b) => (b.id === budgetId ? { ...b, rolloverEnabled: !b.rolloverEnabled } : b))
    );
  };

  // Protected Savings
  const depositToVault = (vaultId: string, amount: number) => {
    setVaults((prev) =>
      prev.map((v) => (v.id === vaultId ? { ...v, currentBalance: v.currentBalance + amount } : v))
    );
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'Vault Deposit',
      merchant: 'Protected Savings Vault',
      amount: -Math.abs(amount),
      type: 'transfer',
      category: 'Savings',
      account: 'Primary Checking',
      status: 'cleared',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const createVault = (vaultData: Omit<ProtectedVault, 'id' | 'currentBalance' | 'status'>) => {
    const newVault: ProtectedVault = {
      id: `vault_${Date.now()}`,
      ...vaultData,
      currentBalance: 0,
      status: 'locked',
    };
    setVaults((prev) => [...prev, newVault]);
  };

  const simulateEarlyWithdrawal = (vaultId: string) => {
    const vault = vaults.find((v) => v.id === vaultId);
    if (!vault) return { penalty: 0, netPayout: 0 };
    const penalty = (vault.currentBalance * vault.penaltyRate) / 100;
    const netPayout = vault.currentBalance - penalty;
    return { penalty, netPayout };
  };

  // Emergency Fund
  const updateEmergencyMonths = (months: 3 | 6 | 12) => {
    setEmergencyFund((prev) => ({ ...prev, targetMonths: months }));
  };

  const depositToEmergencyFund = (amount: number) => {
    setEmergencyFund((prev) => ({
      ...prev,
      currentBalance: prev.currentBalance + amount,
      tier1LiquidCash: prev.tier1LiquidCash + amount,
    }));
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'Emergency Cushion Top-Up',
      merchant: 'Emergency Reserve Account',
      amount: -Math.abs(amount),
      type: 'transfer',
      category: 'Emergency Reserve',
      account: 'Primary Checking',
      status: 'cleared',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const toggleAutoSurplus = () => {
    setEmergencyFund((prev) => ({
      ...prev,
      autoSurplusDeposit: !prev.autoSurplusDeposit,
    }));
  };

  // Goals
  const contributeToGoal = (goalId: string, amount: number) => {
    setGoals((prev) =>
      prev.map((g) => {
        if (g.id === goalId) {
          const updated = g.currentAmount + amount;
          if (updated >= g.targetAmount && g.currentAmount < g.targetAmount) {
            setNotifications((n) => [
              {
                id: `notif_${Date.now()}`,
                title: 'Goal Achieved! 🎉',
                message: `Congratulations! You fully funded: "${g.title}".`,
                timestamp: 'Just now',
                type: 'milestone',
                read: false,
              },
              ...n,
            ]);
          }
          return { ...g, currentAmount: updated };
        }
        return g;
      })
    );
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      title: 'Goal Contribution',
      merchant: 'Goal Dedicated Vault',
      amount: -Math.abs(amount),
      type: 'transfer',
      category: 'Goals',
      account: 'Primary Checking',
      status: 'cleared',
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const addGoal = (goalData: Omit<FinancialGoal, 'id' | 'currentAmount'>) => {
    const newGoal: FinancialGoal = {
      id: `goal_${Date.now()}`,
      ...goalData,
      currentAmount: 0,
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  // Alerts
  const resolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, resolved: true } : a))
    );
  };
  const dismissAlert = (alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  };

  // Smart Offers
  const claimOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, isClaimed: true } : o))
    );
    setNotifications((prev) => [
      {
        id: `notif_${Date.now()}`,
        title: 'Offer Activated',
        message: 'Your perk has been activated and added to your savings profile.',
        timestamp: 'Just now',
        type: 'system',
        read: false,
      },
      ...prev,
    ]);
  };

  // Savings Cards
  const toggleFreezeCard = (cardId: string) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, isFrozen: !c.isFrozen } : c))
    );
  };
  const updateCardLimit = (cardId: string, daily: number, monthly: number) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, dailyLimit: daily, monthlyLimit: monthly } : c))
    );
  };
  const updateCardMultiplier = (cardId: string, mult: 1 | 2 | 5) => {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, roundUpMultiplier: mult } : c))
    );
  };

  // Rewards
  const redeemReward = (cost: number, benefitName: string): boolean => {
    if (rewards.pointsBalance < cost) return false;
    setRewards((prev) => ({
      ...prev,
      pointsBalance: prev.pointsBalance - cost,
      benefits: [...prev.benefits, benefitName],
      history: [
        {
          id: `rw_${Date.now()}`,
          description: `Redeemed: ${benefitName}`,
          points: -cost,
          date: new Date().toISOString().split('T')[0],
        },
        ...prev.history,
      ],
    }));
    return true;
  };

  // Subscriptions
  const toggleCancelSubscription = (subId: string) => {
    setSubscriptions((prev) =>
      prev.map((s) =>
        s.id === subId
          ? { ...s, status: s.status === 'cancelled' ? 'active' : 'cancelled' }
          : s
      )
    );
  };

  const addSubscription = (subData: Omit<SubscriptionItem, 'id'>) => {
    const newSub: SubscriptionItem = {
      id: `sub_${Date.now()}`,
      ...subData,
    };
    setSubscriptions((prev) => [...prev, newSub]);
  };

  // Transactions
  const addTransaction = (txData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      ...txData,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };
  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };
  const unreadCount = notifications.filter((n) => !n.read).length;

  // AI Assistant
  const sendAssistantMessage = async (text: string) => {
    const userMsg: AssistantMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text,
      timestamp: 'Just now',
    };
    setAssistantMessages((prev) => [...prev, userMsg]);
    setIsAssistantThinking(true);

    try {
      const response = await fetch('/api/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          context: {
            user,
            stats: {
              netWorth: totalNetWorth,
              monthlyGross: user.monthlyGrossSalary,
              monthlyNet: user.monthlyNetSalary,
              monthlyExpenses: totalMonthlyExpenses,
              savingsRate: currentSavingsRate,
              emergencyRunwayMonths: (
                emergencyFund.currentBalance / emergencyFund.monthlyEssentialBurn
              ).toFixed(1),
            },
            emergencyFund,
            vaults,
            goals,
            subscriptions,
            alerts: alerts.filter((a) => !a.resolved),
          },
        }),
      });

      const data = await response.json();
      const botMsg: AssistantMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'assistant',
        text: data.response || 'I have analyzed your request against your financial model.',
        timestamp: 'Just now',
      };
      setAssistantMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const fallbackMsg: AssistantMessage = {
        id: `msg_bot_${Date.now()}`,
        sender: 'assistant',
        text: `### Strategic Assessment
Based on your current numbers ($${user.monthlyNetSalary}/mo net salary and ${currentSavingsRate}% savings rate), your baseline position is very strong. Ensure high-interest debt is zero and maintain your 5.4 months emergency runway before expanding discretionary budgets.`,
        timestamp: 'Just now',
      };
      setAssistantMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAssistantThinking(false);
    }
  };

  // Settings
  const updateSettings = (updates: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    if (updates.currency) {
      const symbols: Record<CurrencyCode, string> = {
        USD: '$',
        EUR: '€',
        GBP: '£',
        JPY: '¥',
        INR: '₹',
        CAD: 'CA$',
        AUD: 'AU$',
      };
      setUser((u) => ({
        ...u,
        currency: updates.currency as CurrencyCode,
        currencySymbol: symbols[updates.currency as CurrencyCode] || '$',
      }));
    }
  };

  const togglePrivacyMode = () => {
    setSettings((prev) => ({ ...prev, privacyMode: !prev.privacyMode }));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setUser(DEMO_PROFILES[0]);
    setDeductions(INITIAL_SALARY_DEDUCTIONS);
    setSalaryRules(INITIAL_SALARY_RULES);
    setBuckets(INITIAL_BUCKETS);
    setBudgets(INITIAL_BUDGETS);
    setVaults(INITIAL_PROTECTED_VAULTS);
    setEmergencyFund(INITIAL_EMERGENCY_FUND);
    setGoals(INITIAL_GOALS);
    setAlerts(INITIAL_ALERTS);
    setOffers(INITIAL_OFFERS);
    setCards(INITIAL_SAVINGS_CARDS);
    setRewards(INITIAL_REWARDS);
    setSubscriptions(INITIAL_SUBSCRIPTIONS);
    setTransactions(INITIAL_TRANSACTIONS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setSettings(INITIAL_SETTINGS);
    setAssistantMessages(INITIAL_ASSISTANT_MESSAGES);
    setIsLocked(false);
  };

  return (
    <FinanceContext.Provider
      value={{
        activeModule,
        setActiveModule,
        user,
        isLocked,
        lockApp,
        unlockWithPin,
        unlockWithBiometrics,
        switchProfile,
        updateUserProfile,
        formatCurrency,
        totalNetWorth,
        monthlyLiquidCashflow,
        totalMonthlyExpenses,
        currentSavingsRate,
        deductions,
        salaryRules,
        updateGrossSalary,
        toggleSalaryRule,
        executePaydaySweep,
        buckets,
        updateBucketPercentage,
        expenses: [],
        addExpense,
        deleteExpense,
        budgets,
        updateBudgetLimit,
        toggleBudgetRollover,
        vaults,
        depositToVault,
        createVault,
        simulateEarlyWithdrawal,
        emergencyFund,
        updateEmergencyMonths,
        depositToEmergencyFund,
        toggleAutoSurplus,
        goals,
        contributeToGoal,
        addGoal,
        alerts,
        resolveAlert,
        dismissAlert,
        merchants,
        offers,
        claimOffer,
        cards,
        toggleFreezeCard,
        updateCardLimit,
        updateCardMultiplier,
        rewards,
        redeemReward,
        subscriptions,
        toggleCancelSubscription,
        addSubscription,
        transactions,
        addTransaction,
        deleteTransaction,
        notifications,
        markNotificationAsRead,
        markAllNotificationsRead,
        unreadCount,
        assistantMessages,
        isAssistantThinking,
        sendAssistantMessage,
        settings,
        updateSettings,
        togglePrivacyMode,
        resetToDefaults,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) throw new Error('useFinance must be used within a FinanceProvider');
  return context;
};
