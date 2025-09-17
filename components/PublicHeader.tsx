import React, { useState } from 'react';
import { Page } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';
import LanguageSelector from './LanguageSelector';
import { useLanguage } from '../contexts/LanguageContext';

interface PublicHeaderProps {
  onNavigate: (page: Page) => void;
  currentPage?: Page;
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onNavigate, currentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { t } = useLanguage();

    const handleNav = (page: Page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    }
    
    const navLinks = [
        { page: 'features' as Page, label: t('headerProduct') },
        { page: 'pricing' as Page, label: t('headerPricing') },
        { page: 'testimonials' as Page, label: t('headerTestimonials') },
    ];

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-20 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNav('landing')}>
                        <DocumentIcon className="h-8 w-8 text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">LegalDraft AI</span>
                    </div>
                    
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {navLinks.map(link => (
                            <button key={link.page} onClick={() => handleNav(link.page)} className={`hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === link.page ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-2">
                        <LanguageSelector />
                        <button onClick={() => handleNav('login')} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{t('headerLogin')}</button>
                        <button onClick={() => onNavigate('demo')} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{t('headerBookDemo')}</button>
                        <button onClick={() => handleNav('signup')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">{t('headerStartTrial')}</button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-lg">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        {navLinks.map(link => (
                             <button key={link.page} onClick={() => handleNav(link.page)} className={`w-full text-left block px-3 py-2 rounded-md text-base font-medium ${currentPage === link.page ? 'bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}>
                                {link.label}
                            </button>
                        ))}
                    </div>
                    <div className="pt-4 pb-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="px-5 flex flex-col space-y-3">
                             <button onClick={() => handleNav('signup')} className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">{t('headerStartTrial')}</button>
                             <button onClick={() => onNavigate('demo')} className="w-full px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{t('headerBookDemo')}</button>
                             <button onClick={() => handleNav('login')} className="w-full px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{t('headerLogin')}</button>
                             <div className="pt-2 flex justify-center"><LanguageSelector /></div>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};