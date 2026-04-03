import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import api from '../services/api';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/register', formData);
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-surface-900 p-6">
      <div className="w-full max-w-lg">
        <div className="bg-white dark:bg-surface-800 p-10 rounded-3xl border border-surface-100 dark:border-surface-700 shadow-xl shadow-surface-200/50 dark:shadow-none">
          <div className="flex flex-col items-center mb-10 text-center">
             <div className="w-16 h-16 bg-gray-800 dark:bg-primary-600 rounded-2xl flex items-center justify-center text-primary-500 dark:text-white font-bold text-3xl shadow-xl shadow-gray-300 dark:shadow-primary-900/30 mb-6 transition-transform hover:scale-110 active:scale-95 cursor-pointer">
              S
            </div>
            <h2 className="text-3xl font-bold text-surface-900 dark:text-white tracking-tight">Create an account</h2>
            <p className="text-surface-500 dark:text-surface-400 mt-2 font-medium">Join SpendWise for personal finance tracking.</p>
          </div>

          {error && (
            <div className="flex items-start space-x-2 p-4 mb-6 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 animate-in slide-in-from-top-2">
               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">First Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="text" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all font-medium text-surface-900 dark:text-white"
                    placeholder="John"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Last Name</label>
                <div className="relative group">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                  <input 
                    type="text" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full pl-12 pr-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all font-medium text-surface-900 dark:text-white"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all font-medium text-surface-900 dark:text-white"
                  placeholder="john@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-surface-700 dark:text-surface-400 tracking-wide uppercase px-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="password" 
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-4 py-4 bg-surface-50/50 dark:bg-surface-900/50 border border-surface-200 dark:border-surface-700 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 dark:focus:ring-primary-900/30 focus:border-primary-500 transition-all font-medium text-surface-900 dark:text-white"
                  placeholder="•••••••• (min 8 chars)"
                  required
                  minLength={8}
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="relative w-full py-4 overflow-hidden bg-gray-800 text-white rounded-xl font-bold text-lg shadow-lg shadow-gray-300 dark:shadow-none hover:shadow-xl transition-all disabled:opacity-50 disabled:active:scale-100 active:scale-[0.98] group"
            >
              <span className="absolute inset-0 w-0 h-full bg-primary-600 transition-all duration-500 ease-out group-hover:w-full"></span>
              {loading ? (
                <div className="relative z-10 flex items-center justify-center space-x-2">
                   <div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full"></div>
                   <span>Creating account...</span>
                </div>
              ) : (
                <div className="relative z-10 flex items-center justify-center space-x-2">
                  <span>Sign Up</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-surface-500 dark:text-surface-400 font-medium">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors underline-offset-4 hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
