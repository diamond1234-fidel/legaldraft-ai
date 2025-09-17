import React from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface BillingPageProps {
  onChoosePlan: (planId: string) => void;
  user: UserProfile;
}

const BillingPage: React.FC<BillingPageProps> = ({ onChoosePlan, user }) => {
    const { t } = useLanguage();
    const plans = {
        solo: { id: 'price_solo_monthly', name: 'Solo', price: 39, features: ['10 AI contract drafts/mo', '10 AI document reviews/mo', 'Manage 5 active matters'] },
        pro: { id: 'price_pro_monthly', name: 'Professional', price: 99, features: ['Unlimited AI drafting & review', 'AI legal research assistant', 'Client portal & billing tools'] },
        firm: { id: 'price_firm_monthly', name: 'Firm', price: 399, features: ['Everything in Professional', 'Multi-user roles & permissions', 'Firm analytics dashboard'] }
    };
    
    const currentPlanId = user.subscription_plan; // e.g. 'price_pro_monthly'
    const subscriptionStatus = user.subscription_status;

  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">{t('billingTitle')}</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-center">
            {subscriptionStatus === 'paid' ? t('billingSubtitlePaid', { plan: currentPlanId }) : t('billingSubtitleTrial')}
        </p>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
             {Object.values(plans).map(plan => (
                <PricingCard
                    key={plan.id}
                    planName={plan.name}
                    price={plan.price}
                    features={plan.features}
                    isCurrentPlan={currentPlanId === plan.id}
                    onSelect={() => onChoosePlan(plan.id)}
                    t={t}
                />
             ))}
        </div>
        <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-4">
            {t('billingStripeNotice')}
        </p>
    </div>
  );
};

const PricingCard: React.FC<{ planName: string, price: number, features: string[], isCurrentPlan: boolean, onSelect: () => void, t: (key: string) => string }> = ({ planName, price, features, isCurrentPlan, onSelect, t }) => (
    <div className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border ${isCurrentPlan ? 'border-2 border-blue-600' : 'border-slate-200 dark:border-slate-700'} flex flex-col`}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{planName}</h2>
        <p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 mt-6">${price}<span className="text-lg font-medium text-slate-500 dark:text-slate-400">/{t('billingMonth')}</span></p>
        <ul className="space-y-3 mt-6 text-slate-600 dark:text-slate-300 flex-grow">
            {features.map(feat => <FeatureListItem key={feat} text={feat} />)}
        </ul>
        <button 
            onClick={onSelect} 
            disabled={isCurrentPlan}
            className="w-full mt-8 py-3 font-medium rounded-md text-white disabled:cursor-default transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-green-600"
        >
            {isCurrentPlan ? t('billingCurrentPlan') : t('billingChoosePlan')}
        </button>
    </div>
);

const FeatureListItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span className="text-slate-700 dark:text-slate-300">{text}</span>
  </div>
);

export default BillingPage;