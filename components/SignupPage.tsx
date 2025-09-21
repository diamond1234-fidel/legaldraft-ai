
import React, { useState } from 'react';
import { Page } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import { supabase } from '../services/supabaseClient';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (password.length < 8) {
            setError('Password must be at least 8 characters long.');
            return;
        }
        setLoading(true);
        setError('');
        setMessage('');

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                    subscription_status: 'trial',
                },
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Success! Please check your email to confirm your account.");
        }
        setLoading(false);
    };

    return (
         <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full">
                <div className="flex justify-center items-center mb-6 cursor-pointer" onClick={() => onNavigate('landing')}>
                    <DocumentIcon className="h-10 w-10 text-blue-600 mr-3" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">oddfalcon</h1>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {message ? (
                        <div className="text-center">
                            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Success!</h2>
                            <p className="mt-2 text-slate-500 dark:text-slate-400">{message}</p>
                            <button onClick={() => onNavigate('login')} className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                                Go to Login
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <h2 className="text-2xl font-semibold text-center text-slate-700 dark:text-slate-200 mb-1">Create Your Account</h2>
                            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Start your free trial today.</p>

                            <InputField label="Full Name" type="text" value={fullName} onChange={e => setFullName(e.target.value)} required />
                            <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                            <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
                            <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

                            {error && <p className="text-sm text-red-600">{error}</p>}
                            
                            <button type="submit" disabled={loading} className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
                                {loading ? 'Creating account...' : 'Create Account'}
                            </button>
                        </form>
                    )}
                    {!message && (
                        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
                            Already have an account?{' '}
                            <button onClick={() => onNavigate('login')} className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                Log in
                            </button>
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input {...props} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" />
  </div>
);

export default SignupPage;
