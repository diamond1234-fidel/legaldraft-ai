import React from 'react';
import { Page } from '../types';
import DocumentIcon from './icons/DocumentIcon';

interface FooterProps {
    onNavigate: (page: Page) => void;
    isAuthenticated: boolean;
}

const Footer: React.FC<FooterProps> = ({ onNavigate, isAuthenticated }) => {
    if (isAuthenticated) {
        return null;
    }

    return (
        <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 md:px-8 py-12">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="col-span-2 md:col-span-1">
                        <div className="flex items-center mb-4">
                            <DocumentIcon className="h-8 w-8 text-blue-600 mr-2" />
                            <span className="text-xl font-bold text-slate-800 dark:text-slate-200">LegalDraft AI</span>
                        </div>
                        <p className="text-sm text-slate-500 dark:text-slate-400">AI-Powered Legal Software.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">Product</h3>
                        <nav className="mt-4 space-y-2 text-sm">
                            <FooterLink onClick={() => onNavigate('features')}>Features</FooterLink>
                            <FooterLink onClick={() => onNavigate('pricing')}>Pricing</FooterLink>
                            <FooterLink onClick={() => onNavigate('demo')}>Book a Demo</FooterLink>
                        </nav>
                    </div>
                     <div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">Company</h3>
                        <nav className="mt-4 space-y-2 text-sm">
                            <FooterLink onClick={() => onNavigate('landing')}>About Us</FooterLink>
                            <FooterLink onClick={() => onNavigate('testimonials')}>Testimonials</FooterLink>
                            <FooterLink onClick={() => onNavigate('support')}>Contact</FooterLink>
                        </nav>
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-200">Legal</h3>
                        <nav className="mt-4 space-y-2 text-sm">
                           <FooterLink onClick={() => onNavigate('privacy')}>Privacy Policy</FooterLink>
                           <FooterLink onClick={() => onNavigate('terms')}>Terms of Service</FooterLink>
                           <FooterLink onClick={() => onNavigate('disclaimer')}>Disclaimer</FooterLink>
                        </nav>
                    </div>
                </div>
                <div className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500 border-t border-slate-200 dark:border-slate-800 pt-8">
                    &copy; {new Date().getFullYear()} LegalDraft AI. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

const FooterLink: React.FC<{onClick?: () => void, children: React.ReactNode}> = ({onClick, children}) => (
    <button onClick={onClick} className="block text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 text-left">
        {children}
    </button>
)

export default Footer;