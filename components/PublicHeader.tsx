
import React, { useState } from 'react';
import { Page } from '../types';
import DocumentIcon from './icons/DocumentIcon';
import MenuIcon from './icons/MenuIcon';
import XIcon from './icons/XIcon';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface PublicHeaderProps {
  onNavigate: (page: Page) => void;
  currentPage?: Page;
}

const ProductDropdown: React.FC<{ onNavigate: (page: Page) => void, closeMenu: () => void }> = ({ onNavigate, closeMenu }) => {
    const handleNav = (page: Page) => {
        onNavigate(page);
        closeMenu();
    }
    return (
        <div className="absolute top-full -left-4 mt-2 w-64 bg-white dark:bg-slate-800 rounded-md shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-20">
            <div className="p-2">
                <a onClick={() => handleNav('features')} className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                    <strong className="font-semibold">AI Risk Analysis</strong>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Identify red flags and one-sided clauses.</span>
                </a>
                <a onClick={() => handleNav('features')} className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                    <strong className="font-semibold">Missing Clause Detection</strong>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Ensure your contracts have critical protections.</span>
                </a>
                 <a onClick={() => handleNav('features')} className="block px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                    <strong className="font-semibold">Plain-Language Summaries</strong>
                    <span className="block text-xs text-slate-500 dark:text-slate-400">Understand complex legal text quickly.</span>
                </a>
                <div className="my-1 border-t border-slate-200 dark:border-slate-700"></div>
                <a onClick={() => handleNav('features')} className="block px-3 py-2 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md">
                    View All Features &rarr;
                </a>
            </div>
        </div>
    );
};

export const PublicHeader: React.FC<PublicHeaderProps> = ({ onNavigate, currentPage }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProductDropdownOpen, setProductDropdownOpen] = useState(false);

    const handleNav = (page: Page) => {
        onNavigate(page);
        setIsMenuOpen(false);
    }
    
    const navLinks = [
        { page: 'features' as Page, label: 'Features' },
        { page: 'pricing' as Page, label: 'Pricing' },
        { page: 'roadmap' as Page, label: 'Roadmap' },
        { page: 'testimonials' as Page, label: 'Testimonials' },
    ];

    return (
        <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg fixed top-0 left-0 right-0 z-20 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => handleNav('landing')}>
                        <DocumentIcon className="h-8 w-8 text-blue-600 mr-2" />
                        <span className="text-xl font-bold text-slate-800 dark:text-slate-200 tracking-tight">oddfalcon</span>
                    </div>
                    
                    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-slate-600 dark:text-slate-300">
                        {navLinks.map(link => (
                            <button key={link.page} onClick={() => handleNav(link.page)} className={`hover:text-blue-600 dark:hover:text-blue-400 ${currentPage === link.page ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                                {link.label}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center space-x-2">
                        <button onClick={() => handleNav('login')} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Log In</button>
                        <button onClick={() => handleNav('signup')} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">Start Free Trial</button>
                    </div>

                    <div className="md:hidden flex items-center">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-md text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
                            <span className="sr-only">Open main menu</span>
                            {isMenuOpen ? <XIcon className="block h-6 w-6" /> : <MenuIcon className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

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
                             <button onClick={() => handleNav('signup')} className="w-full px-4 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors shadow-sm">Start Free Trial</button>
                             <button onClick={() => handleNav('login')} className="w-full px-4 py-2 text-base font-medium text-slate-700 dark:text-slate-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">Log In</button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};
