

import React, { useState } from 'react';
import { ResearchParams, ResearchType, SelectOption } from '../types';
// FIX: Module '"../constants"' has no exported member 'US_STATES'.
import { US_JURISDICTIONS } from '../constants';
import UploadIcon from './icons/UploadIcon';
import SearchIcon from './icons/SearchIcon';
import ErrorAlert from './ErrorAlert';

interface LegalResearchFormProps {
    isSearching: boolean;
    error: string | null;
    onSearch: (params: ResearchParams) => void;
}

const RESEARCH_TYPES: SelectOption[] = [
    { value: 'publicProfile', label: 'Public Profile Enrichment' },
    { value: 'reverseImage', label: 'Reverse Image Search' },
    { value: 'courtFilings', label: 'Court Filings Lookup' },
    { value: 'kyc', label: 'KYC Verification' },
];

const LegalResearchForm: React.FC<LegalResearchFormProps> = ({ isSearching, error, onSearch }) => {
    const [fullName, setFullName] = useState('');
    const [organization, setOrganization] = useState('');
    const [state, setState] = useState(US_JURISDICTIONS[0].value);
    const [researchType, setResearchType] = useState<ResearchType>('publicProfile');
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [reason, setReason] = useState('');
    const [consentGiven, setConsentGiven] = useState(false);
    
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            setResearchType('reverseImage'); // Automatically switch type
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isFormValid) return;
        onSearch({
            fullName,
            organization,
            state,
            researchType,
            image: image || undefined,
            reason,
            consentGiven
        });
    };

    const isFormValid = fullName.trim() && reason.trim() && consentGiven;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">New Research Query</h2>
            
            {error && <ErrorAlert message={error} title="Search Failed" />}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Full Name (Required)</label>
                    <input type="text" id="fullName" value={fullName} onChange={e => setFullName(e.target.value)} required className="w-full input-field" placeholder="e.g., John Doe" />
                </div>
                <div>
                    <label htmlFor="organization" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Organization / Company</label>
                    <input type="text" id="organization" value={organization} onChange={e => setOrganization(e.target.value)} className="w-full input-field" placeholder="e.g., Acme Inc." />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="researchType" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Research Type</label>
                    <select id="researchType" value={researchType} onChange={e => setResearchType(e.target.value as ResearchType)} className="w-full input-field">
                        {RESEARCH_TYPES.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="state" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">State / Jurisdiction</label>
                    <select id="state" value={state} onChange={e => setState(e.target.value)} className="w-full input-field" disabled={researchType === 'reverseImage'}>
                        {US_JURISDICTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Upload Image (for Reverse Image Search)</label>
                <label htmlFor="image-upload" className="w-full flex items-center px-4 py-3 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md cursor-pointer bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700">
                    <UploadIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mr-3" />
                    <span className="font-medium text-slate-600 dark:text-slate-300">{image ? image.name : 'Select an image file'}</span>
                </label>
                <input id="image-upload" type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 h-24 w-24 object-cover rounded-md" />}
            </div>

             <div>
                <label htmlFor="reason" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Reason for Lookup (Required, for internal audit)</label>
                <input type="text" id="reason" value={reason} onChange={e => setReason(e.target.value)} required className="w-full input-field" placeholder="e.g., Client intake for case #12345" />
            </div>

            <div className="bg-slate-100 dark:bg-slate-700/50 rounded-lg p-3">
                <div className="relative flex items-start">
                    <div className="flex h-6 items-center">
                        <input id="consent" name="consent" type="checkbox" checked={consentGiven} onChange={e => setConsentGiven(e.target.checked)} className="h-4 w-4 rounded border-slate-300 dark:border-slate-500 text-blue-600 focus:ring-blue-600" />
                    </div>
                    <div className="ml-3 text-sm leading-6">
                        <label htmlFor="consent" className="font-medium text-slate-800 dark:text-slate-200">Confirm Lawful Basis</label>
                        <p className="text-slate-600 dark:text-slate-400">I confirm I have a lawful basis and consent (where required) to perform this lookup.</p>
                    </div>
                </div>
            </div>

            <button type="submit" disabled={!isFormValid || isSearching} className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed">
                <SearchIcon className="w-5 h-5 mr-2" />
                {isSearching ? 'Searching...' : 'Perform Research'}
            </button>
        </form>
    );
};

// Add a shared style class to the global scope for inputs/selects for consistency
const style = document.createElement('style');
style.innerHTML = `
    .input-field {
        padding: 0.5rem 0.75rem;
        border-width: 1px;
        border-radius: 0.375rem;
        box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;
    }
    .dark .input-field {
        background-color: #334155; /* slate-700 */
        border-color: #475569; /* slate-600 */
        color: #e2e8f0; /* slate-200 */
    }
    .input-field:focus {
        outline: 2px solid transparent;
        outline-offset: 2px;
        border-color: #3b82f6; /* blue-500 */
        box-shadow: 0 0 0 2px #3b82f6; /* blue-500 ring */
    }
`;
document.head.appendChild(style);


export default LegalResearchForm;