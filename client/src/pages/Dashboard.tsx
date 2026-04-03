import React, { useEffect, useState } from 'react';
import { 
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend 
} from 'recharts';
import { Wallet, TrendingUp, TrendingDown, Clock, ChevronRight, Plus, ArrowUpRight, ArrowDownRight, ReceiptText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import api from '../services/api';
import type { DashboardSummary, CategoryBreakdown, DailyTrend, Expense } from '../types';

const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [categories, setCategories] = useState<CategoryBreakdown[]>([]);
  const [trend, setTrend] = useState<DailyTrend[]>([]);
  const [recentExpenses, setRecentExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dashboardRes, expensesRes] = await Promise.all([
          api.get('/analytics/dashboard'),
          api.get('/expenses?limit=5'),
        ]);
        setSummary(dashboardRes.data.summary);
        setCategories(dashboardRes.data.categoryBreakdown);
        setTrend(dashboardRes.data.dailyTrend);
        setRecentExpenses(expensesRes.data.expenses.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ['#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Overview</h1>
          <p className="text-surface-500 dark:text-surface-400 mt-1">Review your financial health and spending patterns.</p>
        </div>
        <Link to="/expenses" className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 dark:shadow-primary-900/20 hover:bg-primary-700 transition-all active:scale-95 w-fit">
          <Plus className="w-5 h-5" />
          <span>Add Expense</span>
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-surface-100 dark:border-surface-700 shadow-sm transition-all hover:shadow-md">
          <div className="bg-green-50 dark:bg-green-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Income</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">₹{summary?.totalIncome?.toLocaleString('en-IN')}</p>
          <div className="flex items-center mt-3 text-xs text-green-600 font-semibold space-x-1">
             <ArrowUpRight className="w-4 h-4" />
             <span>Income this month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-surface-100 dark:border-surface-700 shadow-sm transition-all hover:shadow-md">
          <div className="bg-red-50 dark:bg-red-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
            <TrendingDown className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Total Expenses</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">₹{summary?.totalExpenses?.toLocaleString('en-IN')}</p>
          <div className="flex items-center mt-3 text-xs text-red-600 font-semibold space-x-1">
             <ArrowDownRight className="w-4 h-4" />
             <span>Expenses recorded</span>
          </div>
        </div>

        <div className="bg-white dark:bg-surface-800 p-6 rounded-2xl border border-surface-100 dark:border-surface-700 shadow-sm transition-all hover:shadow-md">
          <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-surface-500 dark:text-surface-400">Available Savings</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">₹{summary?.remainingSavings?.toLocaleString('en-IN')}</p>
          <div className="flex items-center mt-3 text-xs text-primary-600 font-semibold space-x-1">
             <span className="uppercase">{summary?.daysRemaining} days left in month</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Spending Trend */}
        <div className="bg-white dark:bg-surface-800 p-6 lg:p-8 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm overflow-hidden min-h-[400px]">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-8 px-2 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-primary-600" />
            <span>Daily Spending Trend</span>
          </h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dx={-10} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                  formatter={(value) => [`₹${value}`, 'Spending']}
                />
                <Line 
                    type="monotone" 
                    dataKey="amount" 
                    stroke="#0ea5e9" 
                    strokeWidth={4} 
                    dot={{fill: '#0ea5e9', strokeWidth: 2, scale: 1.5}} 
                    activeDot={{r: 8, strokeWidth: 0}}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white dark:bg-surface-800 p-6 lg:p-8 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm min-h-[400px]">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-8 px-2 flex items-center space-x-2">
            <ReceiptText className="w-6 h-6 text-primary-600" />
            <span>Spending by Category</span>
          </h3>
          <div className="h-[300px] w-full flex items-center justify-center">
            {categories.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={categories}
                            cx="50%"
                            cy="50%"
                            innerRadius={70}
                            outerRadius={100}
                            paddingAngle={8}
                            dataKey="amount"
                            nameKey="category"
                        >
                            {categories.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} 
                            formatter={(value) => [`₹${value}`, 'Total']}
                        />
                        <Legend iconType="circle" />
                    </PieChart>
                </ResponsiveContainer>
            ) : (
                <div className="text-surface-400 text-center">No categories found for this period.</div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Expenses Table */}
      <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm overflow-hidden">
        <div className="p-6 lg:p-8 border-b border-surface-50 dark:border-surface-700 flex items-center justify-between">
          <h3 className="text-xl font-bold text-surface-900 dark:text-white">Recent Transactions</h3>
          <Link to="/expenses" className="text-primary-600 dark:text-primary-400 font-semibold flex items-center hover:text-primary-700">
            View All <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-900/50">
                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Date</th>
                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Category</th>
                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Description</th>
                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-50 dark:divide-surface-700">
              {recentExpenses.length > 0 ? recentExpenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-surface-50/50 transition-colors group">
                  <td className="px-8 py-5 text-sm text-surface-600 font-medium">
                    {format(new Date(expense.date), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-8 py-5 text-sm">
                    <span className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-bold uppercase tracking-wider">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-sm text-surface-500 truncate max-w-xs">{expense.description || '-'}</td>
                  <td className="px-8 py-5 text-sm font-bold text-surface-900 text-right">₹{expense.amount.toLocaleString('en-IN')}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-8 py-10 text-center text-surface-400">
                    No transactions found. Get started by adding your first expense!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
