import React, { useEffect, useState } from 'react';
import { Plus, Search, Filter, Download as DownloadIcon, ChevronDown, Trash2, Edit3, X, Calendar as CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import type { Expense } from '../types';

const CATEGORIES = [
  'Food & Dining', 'Transportation', 'Utilities & Bills', 'Entertainment', 
  'Health & Wellness', 'Personal Care', 'Education', 'Shopping & Miscellaneous'
];

const ExpensesPage: React.FC = () => {
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [newExpense, setNewExpense] = useState({
        amount: '',
        category: CATEGORIES[0],
        description: '',
        date: format(new Date(), 'yyyy-MM-dd'),
    });

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/expenses?category=${filterCategory}`);
            setExpenses(res.data.expenses);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [filterCategory]);

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingExpense) {
                await api.put(`/expenses/${editingExpense.id}`, newExpense);
            } else {
                await api.post('/expenses', newExpense);
            }
            setAddModalOpen(false);
            setEditingExpense(null);
            setNewExpense({
                amount: '',
                category: CATEGORIES[0],
                description: '',
                date: format(new Date(), 'yyyy-MM-dd'),
            });
            fetchExpenses();
        } catch (error) {
            console.error('Error saving expense:', error);
        }
    };

    const handleEditClick = (expense: Expense) => {
        setEditingExpense(expense);
        setNewExpense({
            amount: expense.amount.toString(),
            category: expense.category,
            description: expense.description || '',
            date: format(new Date(expense.date), 'yyyy-MM-dd'),
        });
        setAddModalOpen(true);
    };

    const handleDeleteExpense = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this expense?')) return;
        try {
            await api.delete(`/expenses/${id}`);
            fetchExpenses();
        } catch (error) {
            console.error('Error deleting expense:', error);
        }
    };

    const filteredExpenses = expenses.filter(e => 
        (e.description?.toLowerCase().includes(search.toLowerCase()) || 
        e.category.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Expenses</h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">Manage and track your daily spending.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-3 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-xl font-semibold hover:bg-surface-50 dark:hover:bg-surface-700 transition-all">
                        <DownloadIcon className="w-5 h-5" />
                        <span className="hidden sm:inline">Export CSV</span>
                    </button>
                    <button 
                        onClick={() => {
                            setEditingExpense(null);
                            setNewExpense({
                                amount: '',
                                category: CATEGORIES[0],
                                description: '',
                                date: format(new Date(), 'yyyy-MM-dd'),
                            });
                            setAddModalOpen(true);
                        }}
                        className="flex items-center space-x-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold shadow-lg shadow-primary-200 dark:shadow-primary-900/20 hover:bg-primary-700 transition-all active:scale-95"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Add Expense</span>
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-surface-800 p-4 rounded-2xl border border-surface-100 dark:border-surface-700 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search expenses..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 text-surface-900 dark:text-white transition-all"
                    />
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <div className="relative group min-w-[200px]">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500" />
                        <select 
                            value={filterCategory}
                            onChange={(e) => setFilterCategory(e.target.value)}
                            className="w-full pl-12 pr-10 py-3 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 appearance-none font-medium text-surface-700 dark:text-surface-300"
                        >
                            <option value="">All Categories</option>
                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-50 dark:bg-surface-900/50">
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Description</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-50 dark:divide-surface-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : filteredExpenses.length > 0 ? filteredExpenses.map((expense) => (
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
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEditClick(expense)}
                                                className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteExpense(expense.id)}
                                                className="p-2 text-surface-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center text-surface-400 font-medium">
                                        No expenses found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-surface-900/40 dark:bg-surface-950/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-surface-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-6 border-b border-surface-50 dark:border-surface-700 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-surface-900 dark:text-white">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</h3>
                            <button 
                                onClick={() => {
                                    setAddModalOpen(false);
                                    setEditingExpense(null);
                                }} 
                                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-surface-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddExpense} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    required
                                    value={newExpense.amount}
                                    onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                                    placeholder="0.00"
                                    className="w-full px-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 text-2xl font-bold text-surface-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Category</label>
                                    <div className="relative group">
                                        <select 
                                            required
                                            value={newExpense.category}
                                            onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                                            className="w-full pl-4 pr-10 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 appearance-none font-medium text-surface-900 dark:text-white"
                                        >
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Date</label>
                                    <div className="relative group">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                        <input 
                                            type="date" 
                                            required
                                            value={newExpense.date}
                                            onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                                            className="w-full pl-12 pr-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 font-medium text-surface-900 dark:text-white"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Description (Optional)</label>
                                <textarea 
                                    maxLength={200}
                                    value={newExpense.description}
                                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                                    placeholder="Add notes about this expense..."
                                    className="w-full px-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 font-medium resize-none h-32 text-surface-900 dark:text-white"
                                />
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setAddModalOpen(false);
                                        setEditingExpense(null);
                                    }}
                                    className="flex-1 py-4 bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 rounded-xl font-bold hover:bg-surface-50 dark:hover:bg-surface-700 transition-all"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-2 py-4 px-8 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 dark:shadow-primary-900/20 hover:bg-primary-700 transition-all active:scale-95"
                                >
                                    {editingExpense ? 'Update Transaction' : 'Save Transaction'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ExpensesPage;
