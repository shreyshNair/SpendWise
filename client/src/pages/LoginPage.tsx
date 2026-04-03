import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import api from '../services/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      setToken(response.data.token);
      setUser(response.data.user);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white p-10 rounded-3xl border border-surface-100 shadow-xl shadow-surface-200/50">
          <div className="flex flex-col items-center mb-10">
             <div className="w-16 h-16 bg-primary-600 rounded-2xl flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-primary-200 mb-6">
              S
            </div>
            <h2 className="text-3xl font-bold text-surface-900 tracking-tight">Welcome back</h2>
            <p className="text-surface-500 mt-2 font-medium">Please enter your details</p>
          </div>

          {error && (
            <div className="flex items-start space-x-2 p-4 mb-6 rounded-xl bg-red-50 text-red-600 animate-in fade-in zoom-in duration-200 border border-red-100">
               <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
               <span className="text-sm font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-surface-700 tracking-wide uppercase">Email address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-50/50 border border-surface-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-surface-700 tracking-wide uppercase">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-surface-400 group-focus-within:text-primary-500 transition-colors" />
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-surface-50/50 border border-surface-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-primary-100 focus:border-primary-500 transition-all font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 bg-primary-600 text-white rounded-xl font-bold text-lg shadow-lg shadow-primary-200 hover:bg-primary-700 active:scale-[0.98] transition-all disabled:opacity-50 disabled:active:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                   <div className="animate-spin w-5 h-5 border-t-2 border-white rounded-full"></div>
                   <span>Logging in...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <LogIn className="w-5 h-5" />
                  <span>Log in</span>
                </div>
              )}
            </button>
          </form>

          <p className="mt-10 text-center text-surface-500 font-medium">
            Don't have an account?{' '}
            <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors underline-offset-4 hover:underline">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
