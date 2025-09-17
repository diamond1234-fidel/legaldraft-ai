import React, { useState } from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';

const DemoPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    const [submitted, setSubmitted] = useState(false);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);
    }
    
    return (
        <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
            <PublicHeader onNavigate={onNavigate} currentPage="demo" />
            <main className="container mx-auto px-4 pt-20 md:pt-28 pb-12 flex items-center justify-center">
                 <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-16 items-center">
                    <div className="hidden lg:block">
                        <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">See AI in Action</h1>
                        <p className="mt-4 text-slate-600 dark:text-slate-400">A personalized demo is the best way to see how LegalDraft AI can be tailored to your practice's specific needs.</p>
                        <ul className="mt-6 space-y-4">
                            <DemoBenefit point="Draft a state-specific contract in under 5 minutes." />
                            <DemoBenefit point="Analyze a complex document for risks instantly." />
                            <DemoBenefit point="Streamline your client intake and case management." />
                            <DemoBenefit point="Get your specific questions answered by an expert." />
                        </ul>
                    </div>
                     <div>
                        <div className="text-center lg:hidden mb-10">
                            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">Schedule a Live Demo</h1>
                            <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">See LegalDraft AI in action. Get a personalized tour of our platform and have your questions answered by our team.</p>
                        </div>
                        <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                            {submitted ? (
                                <div className="text-center py-12">
                                    <span className="text-5xl">🎉</span>
                                    <h2 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Thank You!</h2>
                                    <p className="text-slate-600 dark:text-slate-400 mt-2">Your demo request has been received. Our team will be in touch shortly to confirm a time.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <InputField label="First Name" id="firstName" required />
                                        <InputField label="Last Name" id="lastName" required />
                                    </div>
                                    <InputField label="Work Email" id="email" type="email" required />
                                    <InputField label="Company Name" id="company" />
                                    <InputField label="Phone Number" id="phone" type="tel" />
                                    <div>
                                        <label htmlFor="message" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Anything specific you'd like to see?</label>
                                        <textarea id="message" rows={3} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"></textarea>
                                    </div>
                                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700">
                                        Request Demo
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                 </div>
            </main>
        </div>
    );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400" />
    </div>
);

const DemoBenefit: React.FC<{ point: string }> = ({ point }) => (
     <li className="flex items-start">
         <svg className="h-6 w-6 text-green-500 mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
             <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
         </svg>
         <span className="text-slate-700 dark:text-slate-300">{point}</span>
     </li>
 );

export default DemoPage;