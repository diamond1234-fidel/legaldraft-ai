import React, { useState } from 'react';
import { Page } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import { supabase } from '../services/supabaseClient';

interface LoginPageProps {
  onNavigate: (page: Page) => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // FIX: Use the `signInWithPassword` method from Supabase v2.
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });

    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full">
        <div className="flex justify-center items-center mb-6 cursor-pointer" onClick={() => onNavigate('landing')}>
            <DocumentIcon className="h-10 w-10 text-blue-600 mr-3" />
            <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">
            oddfalcon
            </h1>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
          <h2 className="text-2xl font-semibold text-center text-slate-700 dark:text-slate-200 mb-1">Welcome Back</h2>
          <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Log in to continue to your dashboard.</p>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline">
                <label htmlFor="password"className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
                  Password
                </label>
                <button type="button" onClick={() => onNavigate('forgotPassword')} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Forgot password?</button>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                placeholder="••••••••"
              />
            </div>
            
            {error && <p className="text-sm text-red-600">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400"
              >
                {loading ? 'Logging in...' : 'Log In'}
              </button>
            </div>
          </form>
           <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <button onClick={() => onNavigate('signup')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                Sign up for a free trial
            </button>
            </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;