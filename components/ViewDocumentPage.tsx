import React from 'react';
import { Document, Page, ContractAnalysis } from '../types';
import AnalysisReport from './GeneratedDocument'; // Re-using this component, which is now AnalysisReport
import ErrorAlert from './ErrorAlert';

interface ViewDocumentPageProps {
    document: Document;
    updateDocument: (doc: Document) => Promise<void>;
    onNavigate: (page: Page) => void;
    onCreateTemplate: (doc: Document) => void;
}

const ViewDocumentPage: React.FC<ViewDocumentPageProps> = ({ document, updateDocument, onNavigate, onCreateTemplate }) => {
    const handleBack = () => {
        onNavigate('documents');
    };

    // FIX: Safely parse content string into a JSON object.
    let analysis: ContractAnalysis | null = null;
    try {
      analysis = document.content ? JSON.parse(document.content) as ContractAnalysis : null;
    } catch(e) {
      console.error("Failed to parse document content", e);
    }


    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex-1">
                    <button onClick={handleBack} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-2">
                        &larr; Back to Saved Analyses
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 break-words">{document.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        Analyzed on {new Date(document.created_at).toLocaleDateString()}
                    </p>
                </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {analysis ? (
                    <AnalysisReport 
                        analysis={analysis}
                        document={document}
                        onReset={handleBack} 
                        onCreateTemplate={onCreateTemplate}
                        onUpdateDocument={updateDocument}
                    />
                ) : (
                    <ErrorAlert 
                        title="Analysis Not Found"
                        message="The analysis data for this document could not be loaded. It may be in an old format or corrupted."
                    />
                )}
            </div>
        </div>
    );
};

export default ViewDocumentPage;