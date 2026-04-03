export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl?: string;
  currencyPreference: string;
}

export interface Expense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  subcategory?: string;
  description?: string;
  date: string;
  receiptUrl?: string;
  tags?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface Income {
  id: string;
  userId: string;
  source: string;
  amount: number;
  date: string;
  frequency: 'one-time' | 'weekly' | 'monthly';
  category: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  month: number;
  year: number;
  targetAmount: number;
  currentSavings?: number;
  progress?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingSavings: number;
  daysRemaining: number;
}

export interface CategoryBreakdown {
  category: string;
  amount: number;
  percentage: number;
}

export interface DailyTrend {
  date: string;
  amount: number;
}

export interface Recommendation {
  category: string;
  currentAmount: number;
  trend: 'UP' | 'DOWN' | 'STABLE';
  message: string;
  potentialSavings: number;
  action: string;
}
