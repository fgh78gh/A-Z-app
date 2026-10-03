export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'INR' | 'CAD' | 'AUD';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  phone: string;
  currency: CurrencyCode;
  currencySymbol: string;
  tier: 'Starter' | 'Growth' | 'Wealth Builder' | 'Private Client';
  healthScore: number; // 0 - 100
  riskTolerance: 'Conservative' | 'Moderate' | 'Aggressive';
  monthlyGrossSalary: number;
  monthlyNetSalary: number;
  joinedDate: string;
  pinCode: string;
  isBiometricsEnabled: boolean;
}

export interface SalaryDeduction {
  id: string;
  name: string;
  amount: number;
  percentage: number;
  category: 'Tax' | 'Retirement' | 'Insurance' | 'Social' | 'Other';
}

export interface SalaryRule {
  id: string;
  targetBucket: string;
  percentage: number;
  active: boolean;
  destinationAccount: string;
}

export interface MoneyBucket {
  id: string;
  name: string;
  type: 'needs' | 'wants' | 'savings' | 'debt' | 'investments';
  allocatedPercentage: number;
  monthlyBudget: number;
  spentSoFar: number;
  color: string;
  description: string;
}

export interface ExpenseItem {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  paymentMethod: string;
  tags: string[];
  isRecurring: boolean;
  notes?: string;
  receiptUrl?: string;
}

export interface CategoryBudget {
  id: string;
  category: string;
  monthlyLimit: number;
  currentSpent: number;
  rolloverEnabled: boolean;
  previousRollover: number;
  icon: string;
}

export interface ProtectedVault {
  id: string;
  name: string;
  currentBalance: number;
  targetBalance: number;
  apy: number;
  lockedUntil: string;
  lockPeriodMonths: number;
  penaltyRate: number; // early withdraw penalty %
  autoDepositMonthly: number;
  status: 'locked' | 'unlocked' | 'matured';
}

export interface EmergencyFundData {
  currentBalance: number;
  targetMonths: 3 | 6 | 12;
  monthlyEssentialBurn: number;
  tier1LiquidCash: number;
  tier2TreasuryReserves: number;
  autoSurplusDeposit: boolean;
}

export interface FinancialGoal {
  id: string;
  title: string;
  category: 'Property' | 'Travel' | 'Vehicle' | 'Education' | 'Retirement' | 'Family';
  targetAmount: number;
  currentAmount: number;
  deadlineDate: string;
  monthlyContribution: number;
  icon: string;
}

export interface SmartAlert {
  id: string;
  type: 'unusual_spend' | 'duplicate_charge' | 'budget_warning' | 'bill_due' | 'saving_milestone';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  amount?: number;
  date: string;
  resolved: boolean;
  actionText?: string;
  actionPayload?: string;
}

export interface MerchantSpend {
  merchant: string;
  category: string;
  totalSpent: number;
  transactionCount: number;
  trend: 'up' | 'down' | 'steady';
}

export interface SmartOffer {
  id: string;
  title: string;
  provider: string;
  category: 'Banking' | 'Cashback' | 'Credit' | 'Utilities' | 'Investing';
  annualSavingsEst: number;
  description: string;
  badge: string;
  expiresInDays: number;
  isClaimed: boolean;
  url: string;
}

export interface SavingsCard {
  id: string;
  cardName: string;
  cardNumberMasked: string;
  expiry: string;
  cvv: string;
  type: 'Virtual Spending' | 'Round-Up Vault' | 'Subscriptions Only' | 'Travel Pass';
  dailyLimit: number;
  monthlyLimit: number;
  spentThisMonth: number;
  isFrozen: boolean;
  roundUpMultiplier: 1 | 2 | 5;
  lockedMerchantCategory?: string;
  colorScheme: 'slate' | 'emerald' | 'indigo' | 'amber';
}

export interface RewardsLoyalty {
  pointsBalance: number;
  tier: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  streakMonths: number;
  nextTierPoints: number;
  benefits: string[];
  history: {
    id: string;
    description: string;
    points: number;
    date: string;
  }[];
}

export interface SubscriptionItem {
  id: string;
  name: string;
  monthlyCost: number;
  billingCycle: 'monthly' | 'annual';
  category: 'Streaming' | 'Productivity' | 'Fitness' | 'Cloud' | 'Gaming' | 'News';
  nextBillingDate: string;
  status: 'active' | 'review' | 'cancelled';
  lastUsedDaysAgo: number;
  recentPriceHike: boolean;
  icon: string;
}

export interface Transaction {
  id: string;
  date: string;
  title: string;
  merchant: string;
  amount: number;
  type: 'expense' | 'income' | 'transfer';
  category: string;
  account: string;
  status: 'cleared' | 'pending';
  receiptAttached?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'alert' | 'transaction' | 'system' | 'milestone';
  read: boolean;
}

export interface AppSettings {
  privacyMode: boolean; // hide real balances with dots/blurs
  currency: CurrencyCode;
  currencySymbol: string;
  theme: 'dark' | 'midnight' | 'light';
  requirePinOnLock: boolean;
  autoLockMinutes: number;
  pushNotifications: boolean;
  emailDigest: boolean;
  overspendAlertThreshold: number; // percentage, e.g. 85
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}
