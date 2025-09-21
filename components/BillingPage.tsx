
import React, { useState } from 'react';
import { UserProfile } from '../types';
import ErrorAlert from './ErrorAlert';

interface BillingPageProps {
  onChoosePlan: (planId: string) => Promise<void>;
  user: UserProfile;
  onCancelSubscription: () => Promise<void>;
}

const FeatureListItem: React.FC<{ text: string }> = ({ text }) => (
  <div className="flex items-center">
    <svg className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
    <span className="text-slate-700 dark:text-slate-300">{text}</span>
  </div>
);

const BillingPage: React.FC<BillingPageProps> = ({ onChoosePlan, user, onCancelSubscription }) => {
    const [isCancelling, setIsCancelling] = useState(false);
    const [checkoutPlanId, setCheckoutPlanId] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const isSpecialUser = user.email === 'wokomafidel@gmail.com';

    if (isSpecialUser) {
        return (
             <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Subscription</h1>
                <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-2 border-blue-600">
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Lifetime Access</h2>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">You have unlimited access to all features.</p>
                    <ul className="space-y-3 mt-6 text-slate-600 dark:text-slate-300 text-left max-w-sm mx-auto">
                        <FeatureListItem text="Unlimited analyses" />
                        <FeatureListItem text="All current and future features" />
                        <FeatureListItem text="Priority support" />
                    </ul>
                </div>
            </div>
        )
    }

    const plans = {
        basic: {
            id: 'PLN_z1w5q750xin2lzw',
            name: 'Basic',
            price: 49,
            features: ['25 analyses per month', 'PDF, DOCX, TXT support', 'AI contract analysis', 'Downloadable reports', 'Standard support'],
        },
        pro: {
            id: 'PLN_conare4agxfkmqf',
            name: 'Pro',
            price: 99,
            features: ['100 analyses per month', 'All Basic features', 'Team collaboration (up to 5 users)', 'Priority support'],
        },
    };
    
    const subscriptionStatus = user.subscription_status;

    const handlePlanSelect = async (planId: string) => {
        setError(null);
        setCheckoutPlanId(planId);
        try {
            await onChoosePlan(planId);
        } catch (e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setCheckoutPlanId(null);
        }
    };

    const handleCancel = async () => {
        setError(null);
        setIsCancelling(true);
        try {
            await onCancelSubscription();
        } catch(e) {
            setError(e instanceof Error ? e.message : String(e));
        } finally {
            setIsCancelling(false);
        }
    };

    let statusMessage = 'Upgrade your plan to unlock more features.';
    if (subscriptionStatus === 'basic' || subscriptionStatus === 'pro' || subscriptionStatus === 'paid') {
        statusMessage = `You are currently on the ${subscriptionStatus} plan.`;
    } else if (subscriptionStatus === 'non-renewing') {
        statusMessage = `Your plan is active but will not renew. Your access will continue until the end of the current billing period.`;
    }


  return (
    <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 text-center">Manage Your Subscription</h1>
        <p className="text-slate-600 dark:text-slate-400 mt-2 text-center">
            {statusMessage}
        </p>

        {error && <div className="mt-6"><ErrorAlert message={error} /></div>}

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
             {Object.values(plans).map(plan => {
                const isCurrentPlan = subscriptionStatus === plan.name.toLowerCase();
                const isLoading = checkoutPlanId === plan.id;

                return (
                    <PricingCard
                        key={plan.name}
                        planName={plan.name}
                        price={plan.price}
                        features={plan.features}
                        isCurrentPlan={isCurrentPlan}
                        isLoading={isLoading}
                        onSelect={() => handlePlanSelect(plan.id)}
                    />
                );
             })}
        </div>

        <div className="mt-8 text-center text-xs text-slate-400 dark:text-slate-500">
            { (subscriptionStatus === 'basic' || subscriptionStatus === 'pro' || subscriptionStatus === 'paid') ? (
                <button
                    onClick={handleCancel}
                    disabled={isCancelling}
                    className="text-sm text-slate-500 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 disabled:opacity-50"
                >
                    {isCancelling ? 'Cancelling...' : 'Cancel Subscription'}
                </button>
            ) : subscriptionStatus !== 'non-renewing' && (
                 <p>You will be redirected to our payment provider for secure payment processing.</p>
            )}
        </div>
    </div>
  );
};

const PricingCard: React.FC<{ planName: string, price: number, features: string[], isCurrentPlan: boolean, isLoading: boolean, onSelect: () => void }> = ({ planName, price, features, isCurrentPlan, isLoading, onSelect }) => (
    <div className={`bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border ${isCurrentPlan ? 'border-2 border-blue-600' : 'border-slate-200 dark:border-slate-700'} flex flex-col`}>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{planName}</h2>
        <p className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 mt-6">
            ${price}
            <span className="text-lg font-medium text-slate-500 dark:text-slate-400">/mo</span>
        </p>
        <p className="text-sm text-slate-500 dark:text-slate-400 h-5 mt-1"></p>
        <ul className="space-y-3 mt-6 text-slate-600 dark:text-slate-300 flex-grow">
            {features.map(feat => <FeatureListItem key={feat} text={feat} />)}
        </ul>
        <button 
            onClick={onSelect} 
            disabled={isCurrentPlan || isLoading}
            className="w-full mt-8 py-3 font-medium rounded-md text-white disabled:cursor-default transition-colors bg-blue-600 hover:bg-blue-700 disabled:bg-green-600"
        >
            {isLoading ? 'Processing...' : isCurrentPlan ? 'Current Plan' : 'Choose Plan'}
        </button>
    </div>
);

export default BillingPage;
