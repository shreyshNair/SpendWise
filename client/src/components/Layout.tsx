import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Wallet, Target, Lightbulb, LogOut, Menu, X, Plus, Sun, Moon } from 'lucide-react';
import { useAuthStore } from '../store/auth.store';
import { useThemeStore } from '../store/theme.store';
import { useEffect } from 'react';

const SidebarItem = ({ to, icon: Icon, label, active, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
      active 
        ? 'bg-primary-600 text-white shadow-lg shadow-primary-200 dark:shadow-primary-900/20' 
        : 'text-surface-600 dark:text-surface-400 hover:bg-white dark:hover:bg-surface-800 hover:text-primary-600'
    }`}
  >
    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-primary-500 transition-colors'}`} />
    <span className="font-medium">{label}</span>
  </Link>
);

const Layout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const { isDarkMode, toggleDarkMode, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, []);

  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/expenses', icon: ReceiptText, label: 'Expenses' },
    { to: '/income', icon: Wallet, label: 'Income' },
    { to: '/goals', icon: Target, label: 'Savings Goals' },
    { to: '/recommendations', icon: Lightbulb, label: 'Insights & Tips' },
  ];

  return (
    <div className="flex h-screen bg-surface-50 dark:bg-surface-900 transition-colors duration-300">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button 
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="p-2 bg-white rounded-lg shadow-md hover:bg-surface-50 transition-colors"
        >
          {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-white/80 dark:bg-surface-800/80 backdrop-blur-xl border-r border-surface-200 dark:border-surface-700 transition-transform duration-300 transform lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full p-6">
          <div className="flex items-center justify-between mb-10 px-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-primary-200 dark:shadow-primary-900/20">
                S
              </div>
              <span className="text-xl font-bold text-surface-900 dark:text-white tracking-tight">SpendWise</span>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="p-2 text-surface-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-surface-700 rounded-lg transition-colors"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>

          <nav className="flex-1 space-y-2">
            {menuItems.map((item) => (
              <SidebarItem 
                key={item.to} 
                {...item} 
                active={location.pathname === item.to}
                onClick={() => setSidebarOpen(false)}
              />
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-surface-100 dark:border-surface-700">
            <div className="flex items-center space-x-3 px-4 py-3 mb-4 rounded-xl bg-surface-50/50 dark:bg-surface-900/50">
              <div className="w-10 h-10 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center justify-center text-surface-700 dark:text-surface-300 font-bold">
                {user?.firstName?.[0]}{user?.lastName?.[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-surface-900 dark:text-white">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center space-x-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all duration-200 font-medium"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="max-w-7xl mx-auto h-full">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
