import React, { useEffect, useState } from 'react';
import { Lightbulb, TrendingUp, TrendingDown, ChevronRight, Zap, Target, Search, AlertTriangle, CheckCircle2 } from 'lucide-react';
import api from '../services/api';
import type { Recommendation } from '../types';

const RecommendationsPage: React.FC = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                const res = await api.get('/analytics/recommendations');
                setRecommendations(res.data.recommendations);
            } catch (error) {
                console.error('Error fetching recommendations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRecommendations();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-full"><div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary-600"></div></div>;
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight flex items-center space-x-3">
                        <Lightbulb className="w-8 h-8 text-yellow-500 fill-yellow-50 dark:fill-yellow-900/20" />
                        <span>Insights & Tips</span>
                    </h1>
                    <p className="text-surface-500 dark:text-surface-400 mt-1">AI-powered recommendations based on your spending patterns.</p>
                </div>
            </div>

            {/* Featured Insight */}
            <div className="bg-gradient-to-br from-primary-600 to-indigo-700 dark:from-primary-700 dark:to-indigo-900 p-8 lg:p-12 rounded-[2rem] shadow-2xl shadow-primary-200 dark:shadow-none relative overflow-hidden text-white group">
                <div className="relative z-10">
                    <div className="flex items-center space-x-3 mb-6 bg-white/20 dark:bg-white/10 backdrop-blur-md w-fit px-4 py-2 rounded-full font-bold text-xs uppercase tracking-widest border border-white/20">
                         <Zap className="w-4 h-4 fill-white" />
                         <span>Smart Recommendation</span>
                    </div>
                    <div className="max-w-2xl">
                        <h2 className="text-3xl lg:text-4xl font-extrabold mb-6 leading-tight">
                            Reduce transportation 🚗 costs by 15% to reach your target ₹2,000 faster!
                        </h2>
                        <div className="flex flex-wrap gap-4 items-center">
                            <button className="px-8 py-4 bg-white text-primary-700 rounded-2xl font-bold text-lg hover:bg-surface-50 transition-all shadow-xl shadow-black/10 active:scale-95">
                                See Full Monthly Analysis
                            </button>
                            <button className="px-6 py-4 bg-primary-500/30 text-white rounded-2xl font-bold border border-white/30 hover:bg-primary-500/50 transition-all backdrop-blur-md">
                                Dismiss Insight
                            </button>
                        </div>
                    </div>
                </div>
                {/* Background Decorations */}
                <div className="absolute top-1/2 -right-10 w-64 h-64 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700"></div>
                <div className="absolute -bottom-10 right-20 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Categorized Recommendations */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-surface-900 dark:text-white px-2 flex items-center space-x-2">
                         <Search className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                         <span>Personalized Category Analysis</span>
                    </h3>
                    <div className="space-y-4">
                        {recommendations.length > 0 ? recommendations.map((rec, index) => (
                            <div key={index} className="bg-white dark:bg-surface-800 p-6 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm transition-all hover:shadow-md group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-4">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${rec.trend === 'UP' ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'}`}>
                                            {rec.trend === 'UP' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">{rec.category}</p>
                                            <p className="text-xl font-extrabold text-surface-900 dark:text-white mt-0.5 tracking-tight">₹{rec.currentAmount.toLocaleString('en-IN')}</p>
                                        </div>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full font-bold text-[10px] tracking-wider uppercase border ${rec.trend === 'UP' ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-100 dark:border-red-900/20' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-100 dark:border-green-900/20'}`}>
                                        {rec.trend} Trend
                                    </div>
                                </div>
                                <p className="text-surface-600 dark:text-surface-400 font-medium mb-6 text-sm">{rec.message}</p>
                                <div className="p-4 rounded-2xl bg-surface-50/50 dark:bg-surface-900/50 border border-surface-100 dark:border-surface-700 group-hover:bg-primary-50 dark:group-hover:bg-primary-900/10 group-hover:border-primary-100 dark:group-hover:border-primary-900/20 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-widest">Potential Savings</p>
                                            <p className="text-lg font-black text-primary-700 dark:text-primary-400">₹{rec.potentialSavings.toLocaleString('en-IN')}</p>
                                        </div>
                                        <button className="flex items-center text-sm font-bold text-primary-600 dark:text-primary-400 group-hover:translate-x-1 transition-transform">
                                            Start Saving <ChevronRight className="w-4 h-4 ml-0.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )) : (
                        <div className="bg-white dark:bg-surface-800 p-10 rounded-3xl border border-surface-100 dark:border-surface-700 text-center space-y-4">
                                <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
                                <p className="text-surface-600 dark:text-surface-400 font-bold text-lg">Your spending is perfectly balanced!</p>
                                <p className="text-surface-400 dark:text-surface-500 font-medium text-sm">We'll notify you when we find any savings opportunities.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Savings Strategy Card */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-surface-900 dark:text-white px-2 flex items-center space-x-2">
                         <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                         <span>Financial Strategy</span>
                    </h3>
                    <div className="bg-white dark:bg-surface-800 p-8 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-sm space-y-8">
                       <div className="flex items-start space-x-4">
                           <div className="p-3 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-xl">
                               <AlertTriangle className="w-6 h-6" />
                           </div>
                           <div>
                               <h4 className="font-extrabold text-surface-900 dark:text-white text-lg tracking-tight">Spending Outlier Detected</h4>
                               <p className="text-surface-500 dark:text-surface-400 text-sm mt-1 font-medium">Your Entertainment spending is 40% higher than your 3-month average. We suggest setting a temporary budget limit.</p>
                           </div>
                       </div>

                       <div className="space-y-4">
                           <h4 className="font-bold text-xs text-surface-400 dark:text-surface-500 uppercase tracking-widest px-1">Action items for this month</h4>
                           {[
                               "Reduce Restaurant dining by 15%",
                               "Look for a more affordable mobile data plan",
                               "Cancel 1 unused streaming subscription",
                               "Use public transit 2 days a week"
                           ].map((item, i) => (
                               <div key={i} className="flex items-center space-x-3 p-4 rounded-2xl bg-surface-50 dark:bg-surface-900/50 hover:bg-white dark:hover:bg-surface-700 hover:shadow-md transition-all border border-transparent hover:border-surface-100 dark:hover:border-surface-600 cursor-pointer group">
                                   <div className="w-6 h-6 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-600 flex items-center justify-center text-primary-600 dark:text-primary-400 group-hover:bg-primary-600 dark:group-hover:bg-primary-500 group-hover:text-white transition-colors">
                                       <ChevronRight className="w-4 h-4" />
                                   </div>
                                   <span className="text-sm font-bold text-surface-700 dark:text-surface-300">{item}</span>
                               </div>
                           ))}
                       </div>

                       <div className="bg-primary-600 p-6 rounded-2xl text-white">
                           <h4 className="font-bold text-center mb-1">Total Potential Optimized Savings</h4>
                           <p className="text-3xl font-black text-center tracking-tight">₹4,500/mo</p>
                           <button className="w-full py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl mt-4 font-bold text-sm transition-all border border-white/20">
                               Implement Savings Strategy
                           </button>
                       </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecommendationsPage;
