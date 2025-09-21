import React, { useState } from 'react';
import { Page } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import { supabase } from '../services/supabaseClient';

interface ForgotPasswordPageProps {
  onNavigate: (page: Page) => void;
}

const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setError('');

    // FIX: Use `resetPasswordForEmail` from Supabase v2, which does not use the `.api` property.
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin, // URL to redirect to after password reset
    });

    if (error) {
        setError(error.message);
    } else {
        setSubmitted(true);
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
          {submitted ? (
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-2">Check your email</h2>
                <p className="text-slate-500 dark:text-slate-400">If an account with that email exists, we have sent a password reset link to it.</p>
                <button 
                    onClick={() => onNavigate('login')} 
                    className="mt-6 font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                    &larr; Back to Log In
                </button>
            </div>
          ) : (
            <>
                <h2 className="text-2xl font-semibold text-center text-slate-700 dark:text-slate-200 mb-1">Forgot Your Password?</h2>
                <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Enter your email and we'll send you a link to reset it.</p>
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
                        className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="you@example.com"
                    />
                    </div>
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400"
                    >
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                    </div>
                </form>
                 <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                    Remember your password?{' '}
                    <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Log in
                    </button>
                </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;