import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile, InvoiceSettings, Invoice, TimeEntry, Client } from '../types';
import ErrorAlert from './ErrorAlert';
import InvoicePreview from './InvoicePreview';
import { useLanguage } from '../contexts/LanguageContext';

interface InvoiceSettingsPageProps {
    user: UserProfile;
    onUpdateSettings: (settings: InvoiceSettings) => Promise<void>;
}

const InvoiceSettingsPage: React.FC<InvoiceSettingsPageProps> = ({ user, onUpdateSettings }) => {
    const [settings, setSettings] = useState<InvoiceSettings>(user.invoice_settings);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const { t } = useLanguage();

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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSettings(s => ({ ...s, logoUrl: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    // Create a mock invoice for preview purposes
    const mockInvoice: Invoice = {
        id: 'INV-PREVIEW',
        matter_id: 'matter-preview',
        client_id: 'client-preview',
        amount: 375.00,
        status: 'draft',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        issuedDate: new Date().toISOString().split('T')[0],
        lineItems: [
            { id: '1', hours: 1.5, description: 'Legal Research on precedents', date: new Date().toISOString() } as TimeEntry,
            { id: '2', hours: 1.0, description: 'Client meeting re: strategy', date: new Date().toISOString() } as TimeEntry,
        ],
        url: ''
    };
    
    const mockClient: Client = user.clients[0] || {
        id: 'client-preview',
        name: 'Sample Client Inc.',
        email: 'contact@sampleclient.com',
        address: '456 Business Rd.\nCommerce City, CS 67890',
    } as Client;


    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Invoice Settings</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Customize the appearance of your invoices.</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                    {error && <ErrorAlert message={error} title="Save Failed" />}
                    {successMessage && <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 rounded-md text-sm">{successMessage}</div>}
                    
                    <div>
                        <h3 className="text-lg font-semibold mb-2">Invoice Template</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <TemplateOption name="modern" current={settings.template} onSelect={t => setSettings(s => ({...s, template: t}))} />
                            <TemplateOption name="classic" current={settings.template} onSelect={t => setSettings(s => ({...s, template: t}))} />
                            <TemplateOption name="simple" current={settings.template} onSelect={t => setSettings(s => ({...s, template: t}))} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                        <InputField label="Accent Color" type="color" value={settings.accentColor} onChange={e => setSettings(s => ({...s, accentColor: e.target.value}))} className="w-full !p-1 h-10" />
                        <div>
                            <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Company Logo</label>
                            <input type="file" accept="image/*" onChange={handleLogoUpload} className="text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                    </div>

                    <TextAreaField label="'From' Address" value={settings.fromAddress} onChange={e => setSettings(s => ({...s, fromAddress: e.target.value}))} rows={4} placeholder="Your Firm Name&#10;123 Law Lane&#10;Legal City, LS 54321" />
                    <TextAreaField label="Default Invoice Notes" value={settings.notes} onChange={e => setSettings(s => ({...s, notes: e.target.value}))} rows={3} placeholder="e.g., Thank you for your business." />

                     <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
                        <button onClick={handleSave} disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400">
                            {isLoading ? t('saving') : "Save Settings"}
                        </button>
                    </div>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2 text-center lg:text-left">Live Preview</h3>
                    <div className="transform scale-[0.9] origin-top lg:scale-100">
                        <InvoicePreview invoice={mockInvoice} settings={settings} client={mockClient} user={user} />
                    </div>
                </div>
            </div>
        </div>
    );
};


const TemplateOption: React.FC<{name: 'modern' | 'classic' | 'simple', current: string, onSelect: (name: 'modern' | 'classic' | 'simple') => void}> = ({ name, current, onSelect }) => {
    const isSelected = name === current;
    const previews = {
        modern: <div className="h-full bg-slate-100 dark:bg-slate-700 rounded-sm p-1 flex flex-col justify-between"><div className="h-2 w-1/3 bg-blue-400 rounded-sm"></div><div className="h-1 w-full bg-slate-300 dark:bg-slate-500 rounded-sm"></div><div className="h-1 w-full bg-slate-300 dark:bg-slate-500 rounded-sm"></div><div className="h-2 w-1/4 self-end bg-slate-400 dark:bg-slate-600 rounded-sm"></div></div>,
        classic: <div className="h-full bg-slate-100 dark:bg-slate-700 rounded-sm p-1 flex flex-col"><div className="h-2 w-full bg-slate-400 dark:bg-slate-600 rounded-sm mb-1"></div><div className="h-1 w-full bg-slate-300 dark:bg-slate-500 rounded-sm mb-0.5"></div><div className="h-1 w-full bg-slate-300 dark:bg-slate-500 rounded-sm"></div></div>,
        simple: <div className="h-full bg-slate-100 dark:bg-slate-700 rounded-sm p-1"><div className="h-1.5 w-1/2 bg-slate-500 dark:bg-slate-400 rounded-sm mb-1"></div><div className="h-1 w-full bg-slate-300 dark:bg-slate-500 rounded-sm mb-0.5"></div><div className="h-1 w-5/6 bg-slate-300 dark:bg-slate-500 rounded-sm"></div></div>
    };

    return (
        <button onClick={() => onSelect(name)} className={`block border-2 rounded-lg p-2 text-center transition-colors ${isSelected ? 'border-blue-500' : 'border-slate-200 dark:border-slate-600 hover:border-blue-400'}`}>
            <div className="w-full h-16 mb-1">{previews[name]}</div>
            <span className={`text-sm font-medium capitalize ${isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300'}`}>{name}</span>
        </button>
    );
};

const InputField: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <input
      {...props}
      className={`w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150 input-field ${props.className || ''}`}
    />
  </div>
);

const TextAreaField: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
  <div>
    <label htmlFor={props.id || props.name} className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">{label}</label>
    <textarea
      {...props}
      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400 transition duration-150 input-field"
    />
  </div>
);

export default InvoiceSettingsPage;