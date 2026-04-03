import React, { useEffect, useState } from 'react';
import { Plus, Wallet, Trash2, Edit3, X, Calendar as CalendarIcon, ChevronDown, ArrowUpRight } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import type { Income } from '../types';

const INCOME_CATEGORIES = ['Employment', 'Freelance', 'Investment', 'Gift', 'Other'];

const IncomePage: React.FC = () => {
    const [incomes, setIncomes] = useState<Income[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [editingIncome, setEditingIncome] = useState<Income | null>(null);
    const [newIncome, setNewIncome] = useState({
        source: '',
        amount: '',
        category: INCOME_CATEGORIES[0],
        date: format(new Date(), 'yyyy-MM-dd'),
        frequency: 'one-time',
        notes: '',
    });

    const fetchIncomes = async () => {
        setLoading(true);
        try {
            const res = await api.get('/income');
            setIncomes(res.data.incomes);
        } catch (error) {
            console.error('Error fetching incomes:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIncomes();
    }, []);

    const handleAddIncome = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingIncome) {
                await api.put(`/income/${editingIncome.id}`, newIncome);
            } else {
                await api.post('/income', newIncome);
            }
            setAddModalOpen(false);
            setEditingIncome(null);
            setNewIncome({
                source: '',
                amount: '',
                category: INCOME_CATEGORIES[0],
                date: format(new Date(), 'yyyy-MM-dd'),
                frequency: 'one-time',
                notes: '',
            });
            fetchIncomes();
        } catch (error) {
            console.error('Error saving income:', error);
        }
    };

    const handleEditClick = (income: Income) => {
        setEditingIncome(income);
        setNewIncome({
            source: income.source,
            amount: income.amount.toString(),
            category: income.category,
            date: format(new Date(income.date), 'yyyy-MM-dd'),
            frequency: income.frequency || 'one-time',
            notes: income.notes || '',
        });
        setAddModalOpen(true);
    };

    const handleDeleteIncome = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this record?')) return;
        try {
            await api.delete(`/income/${id}`);
            fetchIncomes();
        } catch (error) {
            console.error('Error deleting income:', error);
        }
    };

    const totalIncome = incomes.reduce((acc, curr) => acc + curr.amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Income Sources</h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">Manage your earnings and revenue streams.</p>
                </div>
                <button 
                    onClick={() => {
                        setEditingIncome(null);
                        setNewIncome({
                            source: '',
                            amount: '',
                            category: INCOME_CATEGORIES[0],
                            date: format(new Date(), 'yyyy-MM-dd'),
                            frequency: 'one-time',
                            notes: '',
                        });
                        setAddModalOpen(true);
                    }}
                    className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-xl font-semibold shadow-lg shadow-green-200 dark:shadow-green-900/20 hover:bg-green-700 transition-all active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Income</span>
                </button>
            </div>

            <div className="bg-white dark:bg-surface-800 p-8 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm flex items-center space-x-6">
                <div className="bg-green-100 dark:bg-green-900/20 p-4 rounded-2xl text-green-600 dark:text-green-400">
                    <Wallet className="w-8 h-8" />
                </div>
                <div>
                    <p className="text-sm font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest px-1">Total Career Income</p>
                    <p className="text-4xl font-extrabold text-surface-900 dark:text-white mt-1 tracking-tight">₹{totalIncome.toLocaleString('en-IN')}</p>
                </div>
            </div>

            <div className="bg-white dark:bg-surface-800 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-surface-50 dark:bg-surface-900/50">
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Date</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Source</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest">Category</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest text-right">Amount</th>
                                <th className="px-8 py-4 text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-widest text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-surface-50 dark:divide-surface-700">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="px-8 py-10 text-center">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
                                    </td>
                                </tr>
                            ) : incomes.length > 0 ? incomes.map((income) => (
                                <tr key={income.id} className="hover:bg-surface-50/50 transition-colors group">
                                    <td className="px-8 py-5 text-sm text-surface-600 font-medium">
                                        {format(new Date(income.date), 'MMM dd, yyyy')}
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-surface-800">
                                        {income.source}
                                    </td>
                                    <td className="px-8 py-5 text-sm">
                                        <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-xs font-bold uppercase tracking-wider">
                                            {income.category}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-sm font-bold text-green-600 font-mono text-right">+₹{income.amount.toLocaleString('en-IN')}</td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => handleEditClick(income)}
                                                className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                            >
                                                <Edit3 className="w-5 h-5" />
                                            </button>
                                            <button 
                                                onClick={() => handleDeleteIncome(income.id)}
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
                                        No income records found. Add your first paycheck!
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
                            <h3 className="text-xl font-bold text-surface-900 dark:text-white">{editingIncome ? 'Edit Income' : 'Record New Income'}</h3>
                            <button 
                                onClick={() => {
                                    setAddModalOpen(false);
                                    setEditingIncome(null);
                                }} 
                                className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-xl transition-colors"
                            >
                                <X className="w-6 h-6 text-surface-400" />
                            </button>
                        </div>
                        <form onSubmit={handleAddIncome} className="p-8 space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Source Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={newIncome.source}
                                    onChange={(e) => setNewIncome({...newIncome, source: e.target.value})}
                                    placeholder="e.g. Salary, Dividend, Bonus"
                                    className="w-full px-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 font-bold text-surface-900 dark:text-white"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Amount (₹)</label>
                                <input 
                                    type="number" 
                                    required
                                    value={newIncome.amount}
                                    onChange={(e) => setNewIncome({...newIncome, amount: e.target.value})}
                                    placeholder="0.00"
                                    className="w-full px-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 text-2xl font-bold text-surface-900 dark:text-white"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-surface-700 tracking-wide uppercase px-1">Category</label>
                                    <div className="relative group">
                                        <select 
                                            required
                                            value={newIncome.category}
                                            onChange={(e) => setNewIncome({...newIncome, category: e.target.value})}
                                            className="w-full pl-4 pr-10 py-4 bg-surface-50/50 border border-surface-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 appearance-none font-medium"
                                        >
                                            {INCOME_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-surface-700 tracking-wide uppercase px-1">Date</label>
                                    <div className="relative group">
                                        <CalendarIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400" />
                                        <input 
                                            type="date" 
                                            required
                                            value={newIncome.date}
                                            onChange={(e) => setNewIncome({...newIncome, date: e.target.value})}
                                            className="w-full pl-12 pr-4 py-4 bg-surface-50/50 border border-surface-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 flex space-x-3">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setAddModalOpen(false);
                                        setEditingIncome(null);
                                    }}
                                    className="flex-1 py-4 bg-white dark:bg-surface-800 text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 rounded-xl font-bold hover:bg-surface-50 dark:hover:bg-surface-700 transition-all font-sans"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-2 py-4 px-8 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-200 dark:shadow-green-900/20 hover:bg-green-700 transition-all active:scale-95 flex items-center justify-center space-x-2"
                                >
                                    <span>{editingIncome ? 'Update Income' : 'Add Income'}</span>
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default IncomePage;
