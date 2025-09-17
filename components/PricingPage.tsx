import React, { useState } from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';
import ShieldCheckIcon from './icons/ShieldCheckIcon';
import SsoIcon from './icons/SsoIcon';
import ApiIcon from './icons/ApiIcon';

interface PricingPageProps {
  onNavigate: (page: Page) => void;
}

type BillingCycle = 'monthly' | 'annually';

const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');

  const plans = {
    solo: { name: 'Solo', price: { monthly: 39, annually: 390 }, description: 'For solo practitioners getting started.', features: ['10 AI contract drafts/mo', '10 AI document reviews/mo', 'Manage 5 active matters', '5GB document storage', 'Email support'] },
    pro: { name: 'Professional', price: { monthly: 99, annually: 990 }, description: 'For professionals with regular needs.', features: ['Unlimited AI drafting & review', 'AI legal research assistant', 'Case management dashboard', 'Client portal & billing tools', '50GB document storage', 'Priority support'] },
    firm: { name: 'Firm', price: { monthly: 399, annually: 3990 }, description: 'For teams of up to 5.', features: ['Everything in Professional', 'Multi-user roles & permissions', 'Discovery & evidence management', 'Firm analytics dashboard', 'Unlimited document storage', 'Dedicated account manager'] }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <PublicHeader onNavigate={onNavigate} currentPage="pricing" />
      <main className="container mx-auto px-4 py-20 md:py-28">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 text-center tracking-tighter">Find the plan that's right for you</h1>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-center text-slate-600 dark:text-slate-400">Simple, transparent pricing that scales with your practice. No hidden fees.</p>

        <div className="flex justify-center my-10">
          <div className="inline-flex items-center p-1 bg-slate-200 dark:bg-slate-800 rounded-lg">
            <button onClick={() => setBillingCycle('monthly')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${billingCycle === 'monthly' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}>Monthly</button>
            <button onClick={() => setBillingCycle('annually')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors relative ${billingCycle === 'annually' ? 'bg-white dark:bg-slate-700 shadow text-blue-600' : 'text-slate-600 dark:text-slate-300'}`}>
              Annually <span className="absolute -top-2 -right-2 text-xs bg-green-500 text-white px-1.5 py-0.5 rounded-full">Save 17%</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto items-stretch">
          {Object.values(plans).map(plan => (
            <PricingCard
              key={plan.name}
              planName={plan.name}
              price={billingCycle === 'monthly' ? plan.price.monthly : Math.round(plan.price.annually / 12)}
              description={plan.description}
              features={plan.features}
              isFeatured={plan.name === 'Professional'}
              onSelect={() => onNavigate('signup')}
              billingCycle={billingCycle}
            />
          ))}
          <EnterpriseCard onSelect={() => onNavigate('demo')} />
        </div>

        <FeatureComparisonTable />
        <PricingFAQ />
      </main>
    </div>
  );
};


const PricingCard: React.FC<{ planName: string, price: number, description: string, features: string[], isFeatured?: boolean, onSelect: () => void, billingCycle: BillingCycle }> = ({ planName, price, description, features, isFeatured, onSelect, billingCycle }) => (
    <div className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border ${isFeatured ? 'border-2 border-blue-600 dark:border-blue-500' : 'border-slate-200 dark:border-slate-700'} flex flex-col relative`}>
        {isFeatured && <div className="absolute top-0 -translate-y-1/2 left-1/2 -translate-x-1/2"><span className="px-3 py-1 bg-blue-600 text-white text-sm font-semibold rounded-full uppercase tracking-wider">Most Popular</span></div>}
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{planName}</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1 flex-grow">{description}</p>
        <p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 mt-6">${price}<span className="text-lg font-medium text-slate-500 dark:text-slate-400">/mo</span></p>
        <p className="text-sm text-slate-500 dark:text-slate-400">{planName !== "Firm" ? "per lawyer" : "up to 5 lawyers"}{billingCycle === 'annually' && ', billed annually'}</p>
        <ul className="space-y-3 mt-6 text-slate-600 dark:text-slate-300 flex-grow">
            {features.map(feat => <FeatureListItem key={feat} text={feat} />)}
        </ul>
        <button onClick={onSelect} className={`w-full mt-8 py-3 font-medium rounded-md ${isFeatured ? 'text-white bg-blue-600 hover:bg-blue-700' : 'text-blue-600 bg-slate-100 dark:bg-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600'}`}>
            Choose {planName}
        </button>
    </div>
);

const EnterpriseCard: React.FC<{ onSelect: () => void }> = ({ onSelect }) => (
  <div className="lg:col-span-3 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col md:flex-row md:items-center gap-8">
    <div className="md:w-1/3 text-center md:text-left">
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Enterprise</h2>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Custom solutions for large firms, legal departments, and government agencies.</p>
        <button onClick={onSelect} className="w-full md:w-auto mt-6 py-3 px-6 font-medium text-white bg-slate-800 dark:bg-slate-200 dark:text-slate-900 rounded-md hover:bg-slate-700 dark:hover:bg-slate-100">
            Contact Sales
        </button>
    </div>
    <div className="md:w-2/3 grid sm:grid-cols-2 gap-x-6 gap-y-4">
        <EnterpriseFeature icon={<SsoIcon className="w-5 h-5 text-blue-500" />} text="Single Sign-On (SSO)" />
        <EnterpriseFeature icon={<ShieldCheckIcon className="w-5 h-5 text-blue-500" />} text="Advanced security & compliance" />
        <EnterpriseFeature icon={<ApiIcon className="w-5 h-5 text-blue-500" />} text="API access & custom integrations" />
        <EnterpriseFeature icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} text="Onboarding & dedicated support" />
    </div>
  </div>
);

const EnterpriseFeature: React.FC<{ icon: React.ReactNode, text: string }> = ({ icon, text }) => (
  <div className="flex items-center">
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-slate-700 flex items-center justify-center">{icon}</div>
    <span className="ml-3 font-medium text-slate-700 dark:text-slate-200">{text}</span>
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

const FeatureComparisonTable: React.FC = () => {
  const features = [
    { category: 'AI Tools', items: [
      { name: 'AI Document Drafting', solo: '10/mo', pro: 'Unlimited', firm: 'Unlimited', ent: 'Unlimited' },
      { name: 'AI Document Review', solo: '10/mo', pro: 'Unlimited', firm: 'Unlimited', ent: 'Unlimited' },
      { name: 'AI Case Law Research', solo: false, pro: true, firm: true, ent: true },
      { name: 'Predictive Analytics', solo: false, pro: false, firm: true, ent: true },
    ]},
    { category: 'Case Management', items: [
      { name: 'Client & Matter Management', solo: '5 Matters', pro: 'Unlimited', firm: 'Unlimited', ent: 'Unlimited' },
      { name: 'Task & Deadline Tracking', solo: false, pro: true, firm: true, ent: true },
      { name: 'Smart Conflict Checks', solo: false, pro: true, firm: true, ent: true },
    ]},
    { category: 'Collaboration & Admin', items: [
      { name: 'Users Included', solo: '1', pro: '1', firm: '5', ent: 'Custom' },
      { name: 'Multi-user Roles', solo: false, pro: false, firm: true, ent: true },
      { name: 'Firm Analytics Dashboard', solo: false, pro: false, firm: true, ent: true },
      { name: 'Single Sign-On (SSO)', solo: false, pro: false, pro_addon: true, firm: true, ent: true },
    ]},
     { category: 'Support & Security', items: [
      { name: 'Email Support', solo: true, pro: true, firm: true, ent: true },
      { name: 'Priority Support', solo: false, pro: true, firm: true, ent: true },
      { name: 'Dedicated Account Manager', solo: false, pro: false, firm: true, ent: true },
      { name: 'Advanced Security & Compliance', solo: false, pro: false, pro_addon: true, firm: true, ent: true },
    ]},
  ];

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Compare All Features</h2>
      <div className="mt-8 max-w-6xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="text-left">
                <th className="p-4 w-2/5"></th>
                <th className="p-4 text-center font-bold text-slate-700 dark:text-slate-200">Solo</th>
                <th className="p-4 text-center font-bold text-blue-600 dark:text-blue-400">Professional</th>
                <th className="p-4 text-center font-bold text-slate-700 dark:text-slate-200">Firm</th>
                <th className="p-4 text-center font-bold text-slate-700 dark:text-slate-200">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              {features.map(category => (
                <React.Fragment key={category.category}>
                  <tr className="bg-slate-50 dark:bg-slate-800/50">
                    <td colSpan={5} className="px-4 py-2 font-bold text-slate-800 dark:text-slate-100">{category.category}</td>
                  </tr>
                  {category.items.map(item => (
                    <tr key={item.name} className="border-t border-slate-200 dark:border-slate-700">
                      <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{item.name}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-700 dark:text-slate-200">{typeof item.solo === 'boolean' ? (item.solo ? <Checkmark /> : <Cross />) : item.solo}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-700 dark:text-slate-200">{typeof item.pro === 'boolean' ? (item.pro ? <Checkmark /> : <Cross />) : item.pro}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-700 dark:text-slate-200">{typeof item.firm === 'boolean' ? (item.firm ? <Checkmark /> : <Cross />) : item.firm}</td>
                      <td className="px-4 py-3 text-sm text-center text-slate-700 dark:text-slate-200">{typeof item.ent === 'boolean' ? (item.ent ? <Checkmark /> : <Cross />) : item.ent}</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const PricingFAQ: React.FC = () => {
    const faqs = [
        { q: "Is there a free trial?", a: "Yes! All new users start with a 14-day free trial of our Professional plan, no credit card required. You can explore all our features to see how they fit your workflow." },
        { q: "Can I change my plan later?", a: "Absolutely. You can upgrade, downgrade, or cancel your plan at any time from your billing settings. Changes will be prorated." },
        { q: "What happens at the end of my trial?", a: "At the end of your trial, you can choose to upgrade to a paid plan. If you don't, your account will be moved to a limited free plan with basic access." }
    ];
    return (
        <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-slate-800 dark:text-slate-100">Pricing Questions</h2>
            <div className="mt-8 space-y-4">
                {faqs.map((faq, index) => (
                    <div key={index} className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{faq.q}</p>
                        <p className="text-slate-600 dark:text-slate-400 mt-2">{faq.a}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const Checkmark = () => <span className="text-green-500">✔</span>;
const Cross = () => <span className="text-slate-400">-</span>;

export default PricingPage;
