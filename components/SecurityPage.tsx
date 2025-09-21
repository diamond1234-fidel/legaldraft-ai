import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

const SecurityPage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} currentPage="security" />
            <main>
                <HeroSection />
                <PillarsSection />
                <FAQSection />
                <FinalCTASection onNavigate={onNavigate} />
            </main>
        </div>
    );
};

const HeroSection: React.FC = () => (
    <section className="relative text-center py-20 md:py-32 bg-slate-50 dark:bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 bg-grid-slate-200/50 dark:bg-grid-slate-700/25 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
        <div className="container mx-auto px-4 relative z-10">
            <div className="mx-auto w-fit bg-blue-100 dark:bg-blue-900/50 p-4 rounded-full mb-4">
                <ShieldCheckIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">
                Your Trust is Our Foundation
            </h1>
            <p className="mt-6 max-w-3xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                We are committed to protecting your firm's and your clients' information with enterprise-grade security and privacy-first principles.
            </p>
        </div>
    </section>
);

const PillarsSection: React.FC = () => {
    const pillars = [
        { icon: <LockClosedIcon className="w-8 h-8" />, title: "Data Encryption", description: "All data, both in transit and at rest, is encrypted using industry-standard protocols like TLS 1.3 and AES-256." },
        { icon: <EyeSlashIcon className="w-8 h-8" />, title: "Strict Confidentiality", description: "Your firm's and clients' confidential information is never used to train our AI models. Your data is your own." },
        { icon: <ServerStackIcon className="w-8 h-8" />, title: "Secure Infrastructure", description: "Our platform is built on robust, secure cloud infrastructure with strict access controls to ensure data segregation and protection." },
        { icon: <ShieldCheckIcon className="w-8 h-8" />, title: "Compliance Focused", description: "We design our systems with legal and regulatory compliance in mind to help you meet your professional obligations for data security." },
    ];

    return (
        <section className="py-20 md:py-28 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
                <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100">Our Security Pillars</h2>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
                        Our security program is built on core principles to ensure your data is always protected.
                    </p>
                </div>
                <div className="grid md:grid-cols-2 gap-8 mt-12 max-w-4xl mx-auto">
                    {pillars.map(pillar => (
                        <div key={pillar.title} className="flex items-start gap-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800">
                            <div className="flex-shrink-0 w-16 h-16 bg-blue-100 text-blue-600 dark:bg-slate-800 dark:text-blue-400 rounded-lg flex items-center justify-center">{pillar.icon}</div>
                            <div>
                                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{pillar.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 mt-1">{pillar.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

const FAQSection: React.FC = () => (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/70">
        <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Security Questions</h2>
            <div className="mt-8 space-y-4">
                <FAQItem
                    question="Where is my data stored?"
                    answer="Your data is stored securely on enterprise-grade cloud infrastructure. All data is encrypted at rest."
                />
                 <FAQItem
                    question="Who can see my data?"
                    answer="Access to customer data is strictly limited to a small number of authorized personnel for support and maintenance purposes only. We enforce strict access controls and audit trails."
                />
                <FAQItem
                    question="How do you handle payment information?"
                    answer="We do not store your full credit card information. All payments are processed by Stripe, a PCI DSS Level 1 certified payment processor, ensuring your billing details are handled with the highest level of security."
                />
            </div>
        </div>
    </section>
);

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
    <details className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer group">
        <summary className="font-semibold text-slate-800 dark:text-slate-200 flex justify-between items-center list-none">
            {question}
            <div className="ml-4 transition-transform transform group-open:rotate-180">
                <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
        </summary>
        <p className="text-slate-600 dark:text-slate-400 mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">{answer}</p>
    </details>
);

const FinalCTASection: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => (
    <section className="py-20 bg-blue-600">
        <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-white">Ready to Get Started?</h2>
            <p className="text-lg text-blue-200 mt-2 max-w-xl mx-auto">Experience the peace of mind that comes with a secure, AI-powered platform. Start your free trial today.</p>
            <button onClick={() => onNavigate('signup')} className="mt-8 px-8 py-3 font-semibold text-blue-600 bg-white rounded-lg hover:bg-slate-100 transition-transform hover:scale-105 shadow-2xl">
                Start My Free Trial
            </button>
        </div>
    </section>
);


// Dummy icons for Security Page
const LockClosedIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 0 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);
const EyeSlashIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.243 4.243-4.243-4.243" />
  </svg>
);
const ServerStackIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 7.5l3 2.25-3 2.25m4.5 0h3m-9 8.25h13.5A2.25 2.25 0 0 0 21 18V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v12a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>
);


export default SecurityPage;
