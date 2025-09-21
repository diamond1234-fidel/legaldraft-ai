import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

interface Plan {
    name: string;
    price: number;
    description: string;
    features: string[];
    isFeatured?: boolean;
}

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const plans: { [key: string]: Plan } = {
    free: {
        name: 'Free Trial',
        price: 0,
        description: 'Get started for free and analyze your first few contracts.',
        features: ['5 contract analyses', 'PDF, DOCX, TXT support', 'AI summary & risk analysis', 'Downloadable reports'],
    },
    basic: {
        name: 'Basic',
        price: 49,
        description: 'For professionals, lawyers, and individuals who regularly handle contracts.',
        features: ['25 analyses per month', 'All Free features', 'Missing clause checker', 'Plain-language suggestions', 'Standard email support'],
        isFeatured: true
    },
    pro: {
        name: 'Pro',
        price: 99,
        description: 'For firms and businesses that need collaboration and higher volume.',
        features: ['100 analyses per month', 'All Basic features', 'Team collaboration (up to 5 users)', 'Shared template library', 'Priority support'],
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <PublicHeader onNavigate={onNavigate} currentPage="pricing" />
      <main className="container mx-auto px-4 py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 text-center tracking-tighter">Simple, Transparent Pricing</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-center text-slate-600 dark:text-slate-400">Choose the plan that fits your needs. All plans start with a free trial. No credit card required.</p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {Object.values(plans).map(plan => {
            return (
                <PricingCard
                  key={plan.name}
                  planName={plan.name}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  isFeatured={plan.isFeatured}
                  onSelect={() => onNavigate('signup')}
                />
            );
          })}
        </div>
        <FeatureComparisonTable />
        <FAQSection />
      </main>
    </div>
  );
};

const PricingCard: React.FC<{ planName: string, price: number, description: string, features: string[], isFeatured?: boolean, onSelect: () => void }> = ({ planName, price, description, features, isFeatured, onSelect }) => (
    <div className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border ${isFeatured ? 'border-2 border-blue-600 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700'} flex flex-col relative`}>
        {isFeatured && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"><span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full uppercase tracking-wider">Most Popular</span></div>}
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{planName}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 flex-grow">{description}</p>
        <p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 mt-6">
            {price > 0 ? `$${price}`: 'Free'}
            {price > 0 && <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/mo</span>}
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 h-5"></p>
        <ul className="space-y-3 mt-6 text-slate-600 dark:text-slate-300 flex-grow">
            {features.map(feat => <FeatureListItem key={feat} text={feat} />)}
        </ul>
        <button onClick={onSelect} className={`w-full mt-8 py-3 font-medium rounded-md ${isFeatured ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-blue-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
            {price > 0 ? `Choose ${planName}`: 'Start For Free'}
        </button>
    </div>
);

const FeatureListItem: React.FC<{ text: string }> = ({ text }) => (
    <div className="flex items-start">
        <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-slate-700 dark:text-slate-300">{text}</span>
    </div>
);

const CheckMark: React.FC = () => <svg className="h-6 w-6 text-green-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>;
const Dash: React.FC = () => <span className="text-slate-400 mx-auto text-lg">-</span>;

const FeatureComparisonTable: React.FC = () => {
    const features = [
        { name: 'Contract Analyses', free: '5 total', basic: '25 / month', pro: '100 / month' },
        { name: 'AI Risk Analysis', free: <CheckMark />, basic: <CheckMark />, pro: <CheckMark /> },
        { name: 'Missing Clause Detection', free: <Dash />, basic: <CheckMark />, pro: <CheckMark /> },
        { name: 'Team Collaboration', free: <Dash />, basic: <Dash />, pro: 'Up to 5 users' },
        { name: 'Shared Template Library', free: <Dash />, basic: <Dash />, pro: <CheckMark /> },
        { name: 'Support', free: <Dash />, basic: 'Standard', pro: 'Priority' },
    ];
    return (
        <div className="mt-20">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Compare Plans</h2>
            <div className="mt-8 max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-left">
                    <thead>
                        <tr>
                            <th className="p-4 w-1/2 text-sm font-semibold">Feature</th>
                            <th className="p-4 text-center text-sm font-semibold">Free</th>
                            <th className="p-4 text-center text-sm font-semibold">Basic</th>
                            <th className="p-4 text-center text-sm font-semibold">Pro</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                        {features.map(feature => (
                            <tr key={feature.name} className="dark:hover:bg-slate-700/50">
                                <td className="p-4 font-medium text-slate-700 dark:text-slate-200">{feature.name}</td>
                                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{feature.free}</td>
                                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{feature.basic}</td>
                                <td className="p-4 text-center text-slate-600 dark:text-slate-300">{feature.pro}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const FAQSection: React.FC = () => (
    <section className="py-20">
        <div className="container mx-auto px-4 max-w-3xl">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-4">
                <FAQItem question="What counts as one contract analysis?" answer="Each time you upload a document and receive an AI-generated report, it counts as one analysis." />
                <FAQItem question="Can I change my plan later?" answer="Yes, you can upgrade or downgrade your plan at any time from the billing section of your account." />
                 <FAQItem question="What happens if I cancel my subscription?" answer="You can cancel anytime. Your access to paid features will continue until the end of your current billing period." />
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
        <p className="text-slate-600 dark:text-slate-400 mt-2">{answer}</p>
    </details>
);

export default PricingPage;