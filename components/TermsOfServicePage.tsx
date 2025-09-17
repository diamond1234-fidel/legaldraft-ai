
import React from 'react';
import { Page } from '../types';
import { PublicHeader } from './PublicHeader';

const TermsOfServicePage: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
    return (
        <div className="bg-white dark:bg-slate-900">
            <PublicHeader onNavigate={onNavigate} />
            <main className="container mx-auto px-4 py-20 md:py-28">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tighter">Terms of Service</h1>
                    <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">Last Updated: {new Date().toLocaleDateString()}</p>
                    
                    <div className="prose prose-lg dark:prose-invert mt-12 max-w-none">
                        <p>Welcome to LegalDraft AI. These Terms of Service ("Terms") govern your use of our website, services, and applications (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these Terms.</p>
                        
                        <h2>1. Use of Service</h2>
                        <p>LegalDraft AI provides an AI-powered document drafting and analysis tool. You agree to use the Service in compliance with all applicable laws and regulations and not for any unlawful purpose. You must be a licensed legal professional or under the supervision of one to use this service for professional purposes.</p>
                        
                        <h2>2. No Legal Advice</h2>
                        <p>The Service, including any documents or analysis generated, does not constitute legal advice. It is an informational tool designed to assist legal professionals. You are solely responsible for the professional review and accuracy of any documents. Always consult a licensed attorney in your jurisdiction for advice on your specific situation.</p>
                        
                        <h2>3. User Accounts</h2>
                        <p>You are responsible for maintaining the confidentiality of your account information, including your password. You agree to notify us immediately of any unauthorized use of your account. We are not liable for any loss or damage arising from your failure to protect your account.</p>
                        
                        <h2>4. Subscriptions and Billing</h2>
                        <p>Some parts of the Service are billed on a subscription basis. You will be billed in advance on a recurring, periodic basis. Your subscription will automatically renew at the end of each billing cycle unless you cancel it through your account management page. You may cancel your subscription at any time, and your access will continue until the end of the current billing period.</p>

                        <h2>5. Intellectual Property</h2>
                        <p>The Service and its original content, features, and functionality are and will remain the exclusive property of LegalDraft AI and its licensors. Our trademarks may not be used in connection with any product or service without our prior written consent.</p>
                        
                        <h2>6. User-Generated Content</h2>
                        <p>You retain all rights to the documents and information you upload or generate ("User Content"). You grant us a limited, non-exclusive license to use, process, and transmit your User Content solely for the purpose of providing the Service to you. We will not use your User Content to train our AI models without your explicit consent.</p>
                        
                        <h2>7. Termination</h2>
                        <p>We may terminate or suspend your access to our Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will cease immediately.</p>
                        
                        <h2>8. Disclaimer of Warranties & Limitation of Liability</h2>
                        <p>The Service is provided on an "AS IS" and "AS AVAILABLE" basis. We do not warrant that the service will be uninterrupted, secure, or error-free. In no event shall LegalDraft AI, nor its directors, employees, or partners, be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the Service.</p>
                        
                        <h2>9. Governing Law</h2>
                        <p>These Terms shall be governed by the laws of the State of Delaware, United States, without regard to its conflict of law provisions.</p>
                        
                        <h2>10. Changes to Terms</h2>
                        <p>We reserve the right to modify or replace these Terms at any time. We will provide at least 30 days' notice before any new terms take effect. By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms.</p>
                        
                        <h2>Contact Us</h2>
                        <p>If you have any questions about these Terms, please <a href="#" onClick={(e) => { e.preventDefault(); onNavigate('support'); }}>contact us</a>.</p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TermsOfServicePage;