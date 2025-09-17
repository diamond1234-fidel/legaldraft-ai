

import React, { useState, useCallback } from 'react';
import { FormData, Page, Document, Matter } from '../types';
import { DOCUMENT_TYPES, US_STATES, OPTIONAL_CLAUSES } from '../constants';
import DocumentForm from './DocumentForm';
import GeneratedDocument from './GeneratedDocument';
import LoadingSpinner from './LoadingSpinner';
import { generateDocumentPrompt } from '../services/geminiService';
import ErrorAlert from './ErrorAlert';

interface DraftContractPageProps {
    isUsageLimitReached: boolean;
    onNavigate: (page: Page) => void;
    addDocument: (docData: Omit<Document, 'id' | 'created_at' | 'health_score' | 'signature_status' | 'signatories' | 'user_id' | 'version_history'>) => Promise<Document>;
    updateDocument: (doc: Document) => Promise<void>;
    onCreateTemplate: (doc: Document) => void;
    matters: Matter[];
}

const DraftContractPage: React.FC<DraftContractPageProps> = ({ isUsageLimitReached, onNavigate, addDocument, updateDocument, onCreateTemplate, matters }) => {
    const [formData, setFormData] = useState<FormData>({
        documentType: DOCUMENT_TYPES[0],
        state: US_STATES[0].value,
        partyA_name: '',
        partyA_address: '',
        partyB_name: '',
        partyB_address: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        optionalClauses: { arbitration: false, indemnification: false, confidentiality: false },
        customDetails: '',
    });
    
    const [selectedMatterId, setSelectedMatterId] = useState<string>('');
    const [savedDocument, setSavedDocument] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFormChange = useCallback((newFormData: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...newFormData }));
    }, []);

    const handleGenerate = async () => {
        if (isUsageLimitReached) return;
        setIsLoading(true);
        setError(null);
        setSavedDocument(null);
        try {
            const documentText = await generateDocumentPrompt(formData);
            const documentName = `${formData.partyA_name || 'Party A'} & ${formData.partyB_name || 'Party B'} ${formData.documentType}`;
            const newDoc = await addDocument({
                name: documentName,
                type: formData.documentType,
                state: formData.state,
                status: 'drafted',
                content: documentText,
                signature_request_id: null,
                matter_id: selectedMatterId || null,
                // FIX: Add missing properties to satisfy the Document type
                file_url: null,
                source: 'generated',
            });
            setSavedDocument(newDoc);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSavedDocument(null);
        setError(null);
    };

    if (isUsageLimitReached) {
        return (
            <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Free Trial Limit Reached</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">You have used all 3 of your free document actions.</p>
                <p className="text-slate-500 dark:text-slate-400 mt-1">Please upgrade to a Pro plan to continue drafting and reviewing documents.</p>
                <button 
                    onClick={() => onNavigate('billing')}
                    className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700"
                >
                    Upgrade to Pro
                </button>
            </div>
        )
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Document Details</h2>
                <div className="mb-6">
                    <label htmlFor="matter-select" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Associate with Matter (Optional)</label>
                    <select id="matter-select" value={selectedMatterId} onChange={e => setSelectedMatterId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150">
                        <option value="">-- No specific matter --</option>
                        {matters.map(matter => (
                            <option key={matter.id} value={matter.id}>{matter.matter_name}</option>
                        ))}
                    </select>
                </div>
                <DocumentForm formData={formData} onFormChange={handleFormChange} onSubmit={handleGenerate} isLoading={isLoading} documentTypes={DOCUMENT_TYPES} usStates={US_STATES} optionalClauses={OPTIONAL_CLAUSES} />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[500px]">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Generated Document</h2>
                {isLoading && <LoadingSpinner />}
                {error && <ErrorAlert message={error} />}
                {savedDocument && !isLoading && <GeneratedDocument document={savedDocument} onUpdateDocument={updateDocument} onReset={handleReset} onCreateTemplate={onCreateTemplate} />}
                {!savedDocument && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 h-full p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p>Your generated document will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraftContractPage;