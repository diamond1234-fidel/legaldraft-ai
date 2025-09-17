import React, { useState } from 'react';
import { Page, SelectOption } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import { supabase } from '../services/supabaseClient';
import UserIcon from './icons/UserIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import { JURISDICTIONS, PRACTICE_AREAS } from '../constants';

interface SignupPageProps {
  onNavigate: (page: Page) => void;
}

const FIRM_SIZES: SelectOption[] = [
    { value: '1-5', label: '1-5 attorneys' },
    { value: '6-20', label: '6-20 attorneys' },
    { value: '21-50', label: '21-50 attorneys' },
    { value: '51+', label: '51+ attorneys' },
];

const SignupPage: React.FC<SignupPageProps> = ({ onNavigate }) => {
    const [step, setStep] = useState(1);
    const [accountType, setAccountType] = useState<'lawyer' | 'firm' | null>(null);
    
    // Credentials
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    
    // Lawyer fields
    const [fullName, setFullName] = useState('');
    const [barId, setBarId] = useState('');
    const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0].value);
    const [yearsExperience, setYearsExperience] = useState('');
    const [practiceAreas, setPracticeAreas] = useState<string[]>([]);

    // Firm fields
    const [firmName, setFirmName] = useState('');
    const [firmSize, setFirmSize] = useState(FIRM_SIZES[0].value);
    const [adminFullName, setAdminFullName] = useState('');

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    
    const handleSelectAccountType = (type: 'lawyer' | 'firm') => {
        setAccountType(type);
        setStep(2);
    };

    const handlePracticeAreaChange = (area: string) => {
        setPracticeAreas(prev => 
            prev.includes(area) ? prev.filter(a => a !== area) : [...prev, area]
        );
    };
    
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

        let userMetadata = {};
        if (accountType === 'lawyer') {
            userMetadata = {
                account_type: 'lawyer',
                full_name: fullName,
                bar_id: barId,
                jurisdiction,
                years_experience: parseInt(yearsExperience) || 0,
                practice_areas: practiceAreas,
            };
        } else if (accountType === 'firm') {
            userMetadata = {
                account_type: 'firm',
                firm_name: firmName,
                firm_size: firmSize,
                full_name: adminFullName, // The admin's name
                practice_areas: practiceAreas,
            };
        }

        // FIX: Corrected the `signUp` call to match the Supabase v2 signature with metadata.
        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: userMetadata,
            }
        });

        if (error) {
            setError(error.message);
        } else {
            setMessage("Success! Please check your email to confirm your account.");
            setStep(4); // Go to success step
        }
        setLoading(false);
    };

    const renderStepOne = () => (
        <>
            <h2 className="text-2xl font-semibold text-center text-slate-700 dark:text-slate-200 mb-1">Join as a Lawyer or Firm</h2>
            <p className="text-center text-slate-500 dark:text-slate-400 mb-6">Start your free trial today.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => handleSelectAccountType('lawyer')} className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-center">
                    <UserIcon className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold mt-4 text-slate-800 dark:text-slate-200">Individual Lawyer</h3>
                </button>
                <button onClick={() => handleSelectAccountType('firm')} className="p-6 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-500 transition-colors text-center">
                    <UserGroupIcon className="w-12 h-12 mx-auto text-blue-600 dark:text-blue-400" />
                    <h3 className="font-bold mt-4 text-slate-800 dark:text-slate-200">Law Firm</h3>
                </button>
            </div>
        </>
    );
    
    const renderStepTwo = () => (
        <div className="space-y-4">
             <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">&larr; Back</button>
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 pt-2">
                Tell us about your {accountType === 'lawyer' ? "practice" : "firm"}
            </h2>
            {accountType === 'lawyer' && (
                <>
                    <InputField label="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} required />
                    <InputField label="Bar ID (Optional)" value={barId} onChange={e => setBarId(e.target.value)} />
                    <SelectField label="Primary Jurisdiction" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} options={JURISDICTIONS} />
                    <InputField label="Years of Experience" type="number" value={yearsExperience} onChange={e => setYearsExperience(e.target.value)} />
                </>
            )}
            {accountType === 'firm' && (
                <>
                    <InputField label="Firm Name" value={firmName} onChange={e => setFirmName(e.target.value)} required />
                    <SelectField label="Firm Size" value={firmSize} onChange={e => setFirmSize(e.target.value)} options={FIRM_SIZES} />
                    <InputField label="Your Full Name (Admin)" value={adminFullName} onChange={e => setAdminFullName(e.target.value)} required />
                </>
            )}
             <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Primary Practice Areas</label>
                <div className="flex flex-wrap gap-2">
                    {PRACTICE_AREAS.map(area => (
                        <Chip key={area.value} label={area.label} selected={practiceAreas.includes(area.value)} onClick={() => handlePracticeAreaChange(area.value)} />
                    ))}
                </div>
            </div>
            <button onClick={() => setStep(3)} className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Continue
            </button>
        </div>
    );
    
    const renderStepThree = () => (
        <form onSubmit={handleSubmit} className="space-y-4">
            <button type="button" onClick={() => setStep(2)} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">&larr; Back</button>
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 pt-2">
                Create Your Account
            </h2>
            <InputField label="Email Address" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            <InputField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Minimum 8 characters" required />
            <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

            {error && <p className="text-sm text-red-600">{error}</p>}
            
            <button type="submit" disabled={loading} className="w-full mt-2 flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
                {loading ? 'Creating account...' : 'Create Account'}
            </button>
        </form>
    );

    const renderSuccessStep = () => (
        <div className="text-center">
            <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200">Success!</h2>
            <p className="mt-2 text-slate-500 dark:text-slate-400">{message}</p>
            <button onClick={() => onNavigate('login')} className="mt-6 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
                Go to Login
            </button>
        </div>
    );

    const renderStep = () => {
        switch(step) {
            case 1: return renderStepOne();
            case 2: return renderStepTwo();
            case 3: return renderStepThree();
            case 4: return renderSuccessStep();
            default: return renderStepOne();
        }
    }

    return (
         <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full">
                <div className="flex justify-center items-center mb-6 cursor-pointer" onClick={() => onNavigate('landing')}>
                    <DocumentIcon className="h-10 w-10 text-blue-600 mr-3" />
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">LegalDraft AI</h1>
                </div>
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    {renderStep()}
                    {step < 4 && (
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

const SelectField: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { label: string, options: SelectOption[] }> = ({ label, options, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <select {...props} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
        {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
    </select>
  </div>
);

const Chip: React.FC<{label: string, selected: boolean, onClick: () => void}> = ({ label, selected, onClick }) => (
    <button type="button" onClick={onClick} className={`px-3 py-1 text-sm font-medium rounded-full border ${selected ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600'}`}>
        {label}
    </button>
);

export default SignupPage;