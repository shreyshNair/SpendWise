import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth.store';

import Dashboard from './pages/Dashboard';
import ExpensesPage from './pages/ExpensesPage';
import IncomePage from './pages/IncomePage';
import GoalsPage from './pages/GoalsPage';
import RecommendationsPage from './pages/RecommendationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Layout from './components/Layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-surface-900 text-surface-900 dark:text-white transition-colors duration-300">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/" />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="expenses" element={<ExpensesPage />} />
            <Route path="income" element={<IncomePage />} />
            <Route path="goals" element={<GoalsPage />} />
            <Route path="recommendations" element={<RecommendationsPage />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
};

export default App;
