import React, { useState, useCallback, useEffect } from 'react';
import { FormData, Page, Document } from '../types';
import { SUPPORTING_DOC_TYPES, US_JURISDICTIONS } from '../constants';
import DocumentForm from './DocumentForm';
import GeneratedDocument from './GeneratedDocument';
import { generateSupportingDocStream, generateClauseSuggestions, generateCustomDetailsPlaceholder } from '../services/geminiService';
import ErrorAlert from './ErrorAlert';
import DraftLoadingState from './DraftLoadingState';

interface DraftSupportingDocPageProps {
    isUsageLimitReached: boolean;
    onNavigate: (page: Page) => void;
    // FIX: Corrected the Omit type for addDocument to align with its definition in App.tsx.
    addDocument: (docData: Omit<Document, 'id' | 'created_at' | 'user_id' | 'version_history'>) => Promise<Document>;
    updateDocument: (doc: Document) => Promise<void>;
    onCreateTemplate: (doc: Document) => void;
}

const DraftSupportingDocPage: React.FC<DraftSupportingDocPageProps> = ({ isUsageLimitReached, onNavigate, addDocument, updateDocument, onCreateTemplate }) => {
    const [formData, setFormData] = useState<FormData>({
        documentType: SUPPORTING_DOC_TYPES[0],
        state: US_JURISDICTIONS[0].value,
        partyA_name: '', // Beneficiary
        partyA_address: '',
        partyB_name: '', // Petitioner
        partyB_address: '',
        effectiveDate: new Date().toISOString().split('T')[0],
        optionalClauses: { },
        customDetails: '',
    });
    
    const [streamingDocument, setStreamingDocument] = useState<Document | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [allClauses, setAllClauses] = useState<{ id: string; label: string; description: string; }[]>([]);
    const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
    const [customDetailsPlaceholder, setCustomDetailsPlaceholder] = useState("e.g., Specific facts of the case, relationship details, evidence to be included...");


    useEffect(() => {
        const fetchPlaceholder = async () => {
            try {
                const placeholder = await generateCustomDetailsPlaceholder(formData.documentType);
                setCustomDetailsPlaceholder(placeholder);
            } catch (e) {
                console.error("Failed to fetch custom details placeholder:", e);
            }
        };
        fetchPlaceholder();
    }, [formData.documentType]);

    const handleFormChange = useCallback((newFormData: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...newFormData }));
    }, []);

    const handleGetClauseSuggestions = async () => {
        // This feature may be less relevant for supporting docs, can be adapted later.
    };

    const handleGenerate = async () => {
        if (isUsageLimitReached) return;
        
        setIsGenerating(true);
        setError(null);
        
        const documentName = `${formData.documentType} for ${formData.partyA_name || 'Beneficiary'}`;
        
        const tempDoc: Document = {
            id: `temp-${Date.now()}`,
            created_at: new Date().toISOString(),
            user_id: '',
            name: documentName,
            type: formData.documentType,
            state: formData.state,
            status: 'draft',
            content: '',
            health_score: 80,
            signatories: [],
            signature_request_id: null,
            version_history: [],
            matter_id: null,
            file_url: null,
            source: 'generated',
            feedback_is_useful: null,
            feedback_comment: null,
        };
        setStreamingDocument(tempDoc);

        try {
            const onChunk = (chunk: string) => {
                setStreamingDocument(prevDoc => {
                    if (!prevDoc) return null;
                    return { ...prevDoc, content: (prevDoc.content || '') + chunk };
                });
            };
            
            const fullText = await generateSupportingDocStream(formData, onChunk);

            const finalDoc = await addDocument({
                name: documentName,
                type: formData.documentType,
                state: formData.state,
                status: 'draft',
                content: fullText,
                source: 'generated',
                // FIX: Add missing nullable properties to satisfy the Document type
                file_url: null,
                matter_id: null,
                health_score: null,
                signatories: null,
                signature_request_id: null,
                feedback_comment: null,
                feedback_is_useful: null,
            });
            
            setStreamingDocument(finalDoc);

        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(msg);
            setStreamingDocument(null);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReset = () => {
        setStreamingDocument(null);
        setError(null);
    };

    if (isUsageLimitReached) {
        return (
            <div className="text-center bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Trial Usage Limit Reached</h3>
                <p className="text-slate-500 dark:text-slate-400 mt-2">You have used all 3 of your free document drafts and reviews.</p>
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
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-4">Draft Supporting Document</h2>
                <DocumentForm 
                    formData={formData} 
                    onFormChange={handleFormChange} 
                    onSubmit={handleGenerate} 
                    isLoading={isGenerating} 
                    documentTypes={SUPPORTING_DOC_TYPES} 
                    usStates={US_JURISDICTIONS} 
                    optionalClauses={allClauses}
                    onGetSuggestions={handleGetClauseSuggestions}
                    isLoadingSuggestions={isLoadingSuggestions}
                    customDetailsPlaceholder={customDetailsPlaceholder}
                />
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[500px]">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Generated Document</h2>
                {error && <ErrorAlert message={error} />}

                {isGenerating && (!streamingDocument || !streamingDocument.content) ? (
                    <DraftLoadingState />
                ) : streamingDocument ? (
                    <GeneratedDocument 
                        document={streamingDocument} 
                        onReset={handleReset} 
                        onCreateTemplate={onCreateTemplate}
                        onUpdateDocument={async () => { console.warn("updateDocument not implemented for drafted docs"); }}
                    />
                ) : (
                    <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 h-full p-8">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p>Your generated document will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DraftSupportingDocPage;