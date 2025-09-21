
import React, { useState, useMemo } from 'react';
import { Page } from '../types';
import { USCIS_FORMS } from '../constants';
import FormsIcon from './icons/FormsIcon';
import SearchIcon from './icons/SearchIcon';

interface FormsPageProps {
    onNavigate: (page: Page) => void;
}

const FormsPage: React.FC<FormsPageProps> = ({ onNavigate }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleStartFiling = (formId: string) => {
        sessionStorage.setItem('selectedFormId', formId);
        onNavigate('formFilling');
    };

    const filteredForms = useMemo(() => USCIS_FORMS.filter(form =>
        form.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        form.id.toLowerCase().includes(searchTerm.toLowerCase())
    ), [searchTerm]);

    const groupedForms = useMemo(() => {
        return filteredForms.reduce((acc, form) => {
            const category = (form as any).category || 'Other Common Forms';
            if (!acc[category]) {
                acc[category] = [];
            }
            acc[category].push(form);
            return acc;
        }, {} as Record<string, typeof USCIS_FORMS>);
    }, [filteredForms]);

    const categoryOrder = [
        'Family-Based',
        'Citizenship',
        'Employment-Based',
        'Humanitarian',
        'Other Common Forms'
    ];

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">USCIS Form Automation</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Select a form to begin the AI-powered intake and drafting process.</p>
            </div>

            <div className="sticky top-16 bg-slate-50 dark:bg-slate-900 py-4 z-10 -mx-4 md:-mx-8 px-4 md:px-8">
                <div className="relative max-w-2xl mx-auto">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search forms by name, number, or description..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-full shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        aria-label="Search forms"
                    />
                </div>
            </div>

            {Object.keys(groupedForms).length > 0 ? (
                <div className="space-y-8">
                    {categoryOrder.map(category => {
                        if (groupedForms[category]) {
                            return (
                                <div key={category}>
                                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">{category.replace(/([A-Z])/g, ' $1').trim()}</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {groupedForms[category].map(form => (
                                            <div key={form.id} className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 flex flex-col hover:border-blue-500 dark:hover:border-blue-400 transition-colors duration-200">
                                                <div className="flex items-center">
                                                    <FormsIcon className="w-8 h-8 text-blue-500 mr-4 flex-shrink-0" />
                                                    <div>
                                                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">{form.name}</h3>
                                                        <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{form.title}</p>
                                                    </div>
                                                </div>
                                                <p className="text-slate-500 dark:text-slate-400 mt-3 flex-grow text-sm">{form.description}</p>
                                                <div className="mt-6 flex justify-end">
                                                    <button 
                                                        onClick={() => handleStartFiling(form.id)}
                                                        className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700"
                                                    >
                                                        Start Filing
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )
                        }
                        return null;
                    })}
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                    <p className="font-semibold text-lg">No forms found for "{searchTerm}"</p>
                    <p>Try a different search term.</p>
                </div>
            )}
        </div>
    );
};

export default FormsPage;
