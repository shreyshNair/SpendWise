import React, { useEffect, useState } from 'react';
import { Target, TrendingUp, AlertCircle, CheckCircle2, Calendar as CalendarIcon, Save } from 'lucide-react';
import { format } from 'date-fns';
import api from '../services/api';
import type { SavingsGoal } from '../types';

const GoalsPage: React.FC = () => {
    const [goal, setGoal] = useState<SavingsGoal | null>(null);
    const [history, setHistory] = useState<SavingsGoal[]>([]);
    const [loading, setLoading] = useState(true);
    const [targetAmount, setTargetAmount] = useState('');
    const [saving, setSaving] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [currentRes, historyRes] = await Promise.all([
                api.get('/goals/current'),
                api.get('/goals'),
            ]);
            setGoal(currentRes.data.goal);
            setHistory(historyRes.data.goals);
            if (currentRes.data.goal) {
                setTargetAmount(currentRes.data.goal.targetAmount.toString());
            }
        } catch (error) {
            console.error('Error fetching goals:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSetGoal = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const now = new Date();
            await api.post('/goals', {
                month: now.getMonth() + 1,
                year: now.getFullYear(),
                targetAmount: parseFloat(targetAmount),
            });
            fetchData();
        } catch (error) {
            console.error('Error setting goal:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-600"></div></div>;
    }

    const progress = goal?.progress || 0;
    const status = progress >= 100 ? 'SUCCESS' : progress >= 50 ? 'ON_TRACK' : 'AT_RISK';

    return (
        <div className="space-y-8 pb-10">
            <div>
                <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Savings Goals</h1>
                <p className="text-surface-500 dark:text-surface-400 mt-1">Set targets and track your monthly savings progress.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Set Goal Card */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-surface-800 p-8 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm sticky top-8">
                        <div className="bg-primary-50 dark:bg-primary-900/20 w-12 h-12 rounded-2xl flex items-center justify-center text-primary-600 dark:text-primary-400 mb-6">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-2">Monthly Target</h3>
                        <p className="text-surface-500 dark:text-surface-400 text-sm mb-6 font-medium">How much would you like to save this month?</p>
                        
                        <form onSubmit={handleSetGoal} className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest px-1">Goal Amount (₹)</label>
                                <input 
                                    type="number"
                                    value={targetAmount}
                                    onChange={(e) => setTargetAmount(e.target.value)}
                                    placeholder="e.g. 10000"
                                    className="w-full px-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/20 text-2xl font-bold text-surface-900 dark:text-white"
                                    required
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={saving}
                                className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 transition-all flex items-center justify-center space-x-2 active:scale-95 disabled:opacity-50"
                            >
                                <Save className="w-5 h-5" />
                                <span>{saving ? 'Updating...' : goal ? 'Update Goal' : 'Set Savings Goal'}</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Progress Card */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-surface-800 p-8 lg:p-10 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-surface-900 dark:text-white">Current Progress</h3>
                                    <p className="text-surface-500 dark:text-surface-400 font-medium">Month: {format(new Date(), 'MMMM yyyy')}</p>
                                </div>
                                <div className={`
                                    px-4 py-2 rounded-full font-bold text-sm tracking-wide uppercase
                                    ${status === 'SUCCESS' ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400' : status === 'ON_TRACK' ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400' : 'bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400'}
                                `}>
                                    {status.replace('_', ' ')}
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-end justify-between">
                                    <div>
                                        <p className="text-sm font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Saved So Far</p>
                                        <p className="text-4xl font-black text-surface-900 dark:text-white mt-1 tracking-tight">₹{(goal?.currentSavings || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Target Goal</p>
                                        <p className="text-2xl font-bold text-surface-600 dark:text-surface-300 mt-1">₹{(goal?.targetAmount || 0).toLocaleString('en-IN')}</p>
                                    </div>
                                </div>

                                <div className="relative h-6 bg-surface-100 dark:bg-surface-700 rounded-full overflow-hidden shadow-inner">
                                    <div 
                                        className={`absolute inset-y-0 left-0 transition-all duration-1000 ease-out rounded-full shadow-lg ${status === 'SUCCESS' ? 'bg-green-500' : 'bg-primary-600'}`}
                                        style={{ width: `${Math.min(progress, 100)}%` }}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between text-sm font-bold text-surface-500 dark:text-surface-400">
                                    <span>{progress.toFixed(1)}% Completed</span>
                                    <span>{Math.max(0, (goal?.targetAmount || 0) - (goal?.currentSavings || 0)).toLocaleString('en-IN')} remaining</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-10 pt-10 border-t border-surface-50 dark:border-surface-700">
                                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-surface-50 dark:bg-surface-900/50">
                                    <div className="mt-1">
                                        {status === 'AT_RISK' ? <AlertCircle className="w-5 h-5 text-orange-500" /> : <CheckCircle2 className="w-5 h-5 text-green-500" />}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-surface-900 dark:text-white">System Status</h4>
                                        <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                                            {status === 'AT_RISK' 
                                                ? "You're currently below 50% of your goal. Try reducing non-essential expenses." 
                                                : "You're making great progress! Keep maintaining your current spending habits."}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-start space-x-4 p-4 rounded-2xl bg-surface-50 dark:bg-surface-900/50">
                                    <TrendingUp className="w-5 h-5 text-primary-500 mt-1" />
                                    <div>
                                        <h4 className="font-bold text-surface-900 dark:text-white">Projection</h4>
                                        <p className="text-sm text-surface-500 dark:text-surface-400 font-medium">
                                            Based on your current trajectory, you are {status === 'SUCCESS' ? 'exceeding' : 'approaching'} your target.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* History */}
                    <div className="bg-white dark:bg-surface-800 p-8 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm">
                        <h3 className="text-xl font-bold text-surface-900 dark:text-white mb-6 flex items-center space-x-2">
                             <CalendarIcon className="w-6 h-6 text-primary-600" />
                             <span>Goal History</span>
                        </h3>
                        <div className="space-y-4">
                            {history.length > 0 ? history.map((h) => (
                                <div key={h.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-50 dark:hover:bg-surface-900 transition-colors border border-transparent hover:border-surface-100 dark:hover:border-surface-700">
                                    <div>
                                        <p className="font-bold text-surface-900 dark:text-white">{format(new Date(h.year, h.month - 1), 'MMMM yyyy')}</p>
                                        <p className="text-xs font-medium text-surface-500 dark:text-surface-400">Target: ₹{h.targetAmount.toLocaleString('en-IN')}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-primary-600">View Details</p>
                                    </div>
                                </div>
                            )) : (
                                <p className="text-center text-surface-400 py-6">No goal history found.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GoalsPage;
