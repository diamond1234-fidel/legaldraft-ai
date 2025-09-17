import React, { useState, useEffect } from 'react';
import { UserProfile, PaymentSettings } from '../types';
import ErrorAlert from './ErrorAlert';
import StripeIcon from './icons/StripeIcon';
import PaypalIcon from './icons/PaypalIcon';
import BankIcon from './icons/BankIcon';

interface PaymentSettingsPageProps {
    user: UserProfile;
    onUpdateSettings: (settings: PaymentSettings) => Promise<void>;
}

const PaymentSettingsPage: React.FC<PaymentSettingsPageProps> = ({ user, onUpdateSettings }) => {
    const [settings, setSettings] = useState<PaymentSettings>({
        stripe: { connected: false, publishableKey: '' },
        paypal: { connected: false, clientId: '' },
        bankTransfer: { enabled: false, instructions: '' },
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    useEffect(() => {
        if (user.payment_settings) {
            setSettings(user.payment_settings);
        }
    }, [user]);

    const handleSave = async () => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            await onUpdateSettings(settings);
            setSuccessMessage("Settings saved successfully!");
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (e) {
            setError(e instanceof Error ? e.message : "Failed to save settings.");
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Payment Settings</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your payment gateways to accept payments from clients.</p>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-8">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-4">Payment Gateways</h2>
                {error && <ErrorAlert message={error} title="Save Failed" />}
                {successMessage && <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-md text-sm">{successMessage}</div>}

                {/* Stripe */}
                <GatewayCard 
                    title="Stripe" 
                    icon={<StripeIcon />} 
                    connected={settings.stripe.connected}
                    onToggle={() => setSettings(s => ({ ...s, stripe: { ...s.stripe, connected: !s.stripe.connected } }))}
                >
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Connect Stripe to accept credit cards, debit cards, and mobile payments like Apple Pay and Google Pay.</p>
                    <InputField 
                        label="Stripe Public API Key" 
                        value={settings.stripe.publishableKey || ''} 
                        onChange={e => setSettings(s => ({ ...s, stripe: { ...s.stripe, publishableKey: e.target.value } }))} 
                        placeholder="pk_test_..."
                    />
                </GatewayCard>

                {/* PayPal */}
                <GatewayCard 
                    title="PayPal" 
                    icon={<PaypalIcon className="w-6 h-6" />} 
                    connected={settings.paypal.connected}
                    onToggle={() => setSettings(s => ({ ...s, paypal: { ...s.paypal, connected: !s.paypal.connected } }))}
                >
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Connect your PayPal Business account to allow clients to pay via PayPal.</p>
                    <InputField 
                        label="PayPal Client ID" 
                        value={settings.paypal.clientId || ''} 
                        onChange={e => setSettings(s => ({ ...s, paypal: { ...s.paypal, clientId: e.target.value } }))} 
                        placeholder="Your PayPal Client ID"
                    />
                </GatewayCard>

                {/* Bank Transfer */}
                <GatewayCard 
                    title="Bank Transfer" 
                    icon={<BankIcon className="w-6 h-6" />} 
                    connected={settings.bankTransfer.enabled}
                    onToggle={() => setSettings(s => ({ ...s, bankTransfer: { ...s.bankTransfer, enabled: !s.bankTransfer.enabled } }))}
                    isToggle
                >
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Enable this to show bank transfer/wire instructions to your clients on their invoices.</p>
                    <textarea 
                        value={settings.bankTransfer.instructions || ''}
                        onChange={e => setSettings(s => ({ ...s, bankTransfer: { ...s.bankTransfer, instructions: e.target.value } }))}
                        rows={4}
                        className="w-full input-field"
                        placeholder="Bank Name: ...&#10;Account Number: ...&#10;Routing Number: ..."
                    />
                </GatewayCard>
                
                <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                    <button onClick={handleSave} disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400">
                        {isLoading ? "Saving..." : "Save Settings"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const GatewayCard: React.FC<{
    title: string;
    icon: React.ReactNode;
    connected: boolean;
    onToggle: () => void;
    children: React.ReactNode;
    isToggle?: boolean;
}> = ({ title, icon, connected, onToggle, children, isToggle }) => (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-3">
                {icon}
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">{title}</h3>
                <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${connected ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>
                    {connected ? 'Active' : 'Inactive'}
                </span>
            </div>
            <button onClick={onToggle} className={`px-4 py-1.5 text-sm rounded-md font-medium ${connected ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                {isToggle ? (connected ? 'Disable' : 'Enable') : (connected ? 'Disconnect' : 'Connect')}
            </button>
        </div>
        {connected && <div>{children}</div>}
    </div>
);

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      {...props}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150 input-field"
    />
  </div>
);


export default PaymentSettingsPage;