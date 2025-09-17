



import React, { useState, useEffect } from 'react';
import { Page, Document } from '../types';
import { US_STATES } from '../constants';
import GeneratedDocument from './GeneratedDocument';
import LoadingSpinner from './LoadingSpinner';
import { reviewDocument } from '../services/geminiService';
import UploadIcon from './icons/UploadIcon';
import ErrorAlert from './ErrorAlert';

declare var pdfjsLib: any;

interface ReviewContractPageProps {
    isUsageLimitReached: boolean;
    onNavigate: (page: Page) => void;
    addDocument: (docData: Omit<Document, 'id' | 'created_at' | 'health_score' | 'signature_status' | 'signatories' | 'user_id' | 'version_history'>) => Promise<Document>;
    updateDocument: (doc: Document) => Promise<void>;
}

const ReviewContractPage: React.FC<ReviewContractPageProps> = ({ isUsageLimitReached, onNavigate, addDocument, updateDocument }) => {
    const [reviewText, setReviewText] = useState('');
    const [reviewState, setReviewState] = useState(US_STATES[0].value);
    const [reviewFileName, setReviewFileName] = useState('');
    const [savedAnalysis, setSavedAnalysis] = useState<Document | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isParsing, setIsParsing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (typeof pdfjsLib !== 'undefined') {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/pdf.worker.min.js`;
        }
    }, []);

    const handleReview = async () => {
        if (!reviewText.trim() || isUsageLimitReached) return;
        setIsLoading(true);
        setError(null);
        setSavedAnalysis(null);
        try {
            const reviewResult = await reviewDocument(reviewText, reviewState);
            const newDoc = await addDocument({
                name: `Analysis of ${reviewFileName || 'Pasted Text'}`,
                type: 'Contract Analysis',
                state: reviewState,
                status: 'reviewed',
                content: reviewResult,
                signature_request_id: null,
                matter_id: null,
                // FIX: Add missing properties to satisfy the Document type
                file_url: null,
                source: 'generated',
            });
            setSavedAnalysis(newDoc);
        } catch (err) {
            const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSavedAnalysis(null);
        setError(null);
        setReviewText('');
        setReviewFileName('');
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setError(null);
        setReviewText('');
        setReviewFileName('');
        setIsParsing(true);

        try {
            let text = '';
            const fileType = file.type;
            const fileName = file.name.toLowerCase();

            if (fileType === 'text/plain' || fileName.endsWith('.txt')) {
                text = await file.text();
            } else if (fileType === 'text/html' || fileName.endsWith('.html') || fileName.endsWith('.htm')) {
                const htmlContent = await file.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlContent, 'text/html');
                text = doc.body.textContent || '';
            } else if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
                if (typeof pdfjsLib === 'undefined') {
                    throw new Error("PDF processing library is not available. Please refresh the page and try again.");
                }
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
                let fullText = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items.map((item: any) => item.str).join(' ');
                    fullText += pageText + '\n\n';
                }
                text = fullText;
            } else {
                throw new Error('Unsupported file type. Please upload a .txt, .pdf, or .html file.');
            }

            setReviewText(text);
            setReviewFileName(file.name);
        } catch (e) {
            const msg = e instanceof Error ? e.message : 'Failed to read or parse the file.';
            setError(msg);
        } finally {
            setIsParsing(false);
            event.target.value = ''; // Allow re-uploading the same file
        }
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
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-6">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">AI Contract Review Assistant</h2>
                <div>
                    <label htmlFor="reviewState" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">State of Jurisdiction</label>
                    <select id="reviewState" name="reviewState" value={reviewState} onChange={(e) => setReviewState(e.target.value)} className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                        {US_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="reviewText" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Contract Text</label>
                    <textarea id="reviewText" rows={10} value={reviewText} onChange={(e) => {setReviewText(e.target.value); setReviewFileName('')}} placeholder="Paste the full text of the contract here..." className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:placeholder-slate-400" />
                </div>
                <div className="relative flex items-center"><div className="flex-grow border-t border-slate-200 dark:border-slate-600"></div><span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm">Or</span><div className="flex-grow border-t border-slate-200 dark:border-slate-600"></div></div>
                <div>
                    <label htmlFor="review-file-upload" className={`w-full flex justify-center items-center px-4 py-3 border-2 border-slate-300 dark:border-slate-600 border-dashed rounded-md bg-slate-50 dark:bg-slate-700/50 ${isParsing ? 'cursor-wait bg-slate-100 dark:bg-slate-700' : 'cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
                        <UploadIcon className="w-6 h-6 text-slate-500 dark:text-slate-400 mr-3" />
                        <span className="font-medium text-slate-600 dark:text-slate-300">
                            {isParsing ? 'Processing file...' : (reviewFileName || 'Upload .txt, .pdf, or .html')}
                        </span>
                    </label>
                    <input id="review-file-upload" type="file" className="sr-only" accept=".txt,.pdf,.html,.htm" onChange={handleFileChange} disabled={isParsing} />
                </div>
                <button type="button" onClick={handleReview} disabled={isLoading || !reviewText.trim() || isParsing} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400">
                    {isParsing ? 'Processing...' : isLoading ? 'Analyzing...' : 'Review Document'}
                </button>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[500px]">
                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Document Analysis</h2>
                {isLoading && <LoadingSpinner />}
                {error && !isLoading && <ErrorAlert message={error} title="Analysis Failed" />}
                {savedAnalysis && !isLoading && <GeneratedDocument document={savedAnalysis} onUpdateDocument={updateDocument} onReset={handleReset} />}
                {!savedAnalysis && !isLoading && !error && (
                    <div className="flex flex-col items-center justify-center text-center text-slate-400 dark:text-slate-500 h-full p-8">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        <p>Your contract analysis will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReviewContractPage;