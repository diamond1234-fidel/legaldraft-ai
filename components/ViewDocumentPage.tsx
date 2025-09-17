

import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, DocumentVersion, Json } from '../types';
import GeneratedDocument from './GeneratedDocument';
import HistoryIcon from './icons/HistoryIcon';
import VersionHistoryPanel from './VersionHistoryPanel';
import Modal from './Modal';
import ErrorAlert from './ErrorAlert';

declare const EasyMDE: any;
// FIX: Add declaration for marked to resolve 'Cannot find name' error.
declare var marked: any;

interface ViewDocumentPageProps {
    document: Document;
    updateDocument: (doc: Document) => Promise<void>;
    onNavigate: (page: Page) => void;
    onCreateTemplate: (doc: Document) => void;
}

const ViewDocumentPage: React.FC<ViewDocumentPageProps> = ({ document, updateDocument, onNavigate, onCreateTemplate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(document.content || '');
    const [isHistoryVisible, setIsHistoryVisible] = useState(false);
    const [viewingVersion, setViewingVersion] = useState<DocumentVersion | null>(null);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const easymdeInstance = useRef<any>(null);

     // Effect to handle editor initialization and cleanup
    useEffect(() => {
        if (isEditing && textareaRef.current && !easymdeInstance.current) {
            if (typeof EasyMDE !== 'undefined') {
                const easymde = new EasyMDE({
                    element: textareaRef.current,
                    initialValue: editedContent,
                    spellChecker: false,
                    minHeight: '500px',
                    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "|", "preview", "side-by-side", "fullscreen"],
                    status: ["lines", "words"],
                });
                easymde.codemirror.on('change', () => {
                    setEditedContent(easymde.value());
                });
                easymdeInstance.current = easymde;
            }
        }
        
        return () => {
            if (easymdeInstance.current) {
                easymdeInstance.current.toTextArea();
                easymdeInstance.current = null;
            }
        };
    }, [isEditing, editedContent]);
    
    // Sync state if the document prop changes (e.g., after a revert)
    useEffect(() => {
        setEditedContent(document.content || '');
    }, [document.content]);


    const handleBack = () => {
        onNavigate('documents');
    };

    const handleSave = async () => {
        const changeDescription = prompt("Please describe the changes you made:", "Updated terms.");
        if (changeDescription === null) return; // User cancelled

        setError(null);
        try {
            // FIX: Cast 'version_history' through 'unknown' to safely convert from 'Json' to 'DocumentVersion[]'.
            const documentVersions = (document.version_history as unknown as DocumentVersion[] | null) || [];
            const previousVersion: DocumentVersion = {
                version: documentVersions.length + 1,
                createdAt: new Date().toISOString(),
                content: document.content,
                description: changeDescription || 'General update',
            };

            const newHistory = [...documentVersions, previousVersion];

            const updatedDoc = {
                ...document,
                content: editedContent,
                version_history: newHistory as unknown as Json,
            };

            await updateDocument(updatedDoc);
            setIsEditing(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to save changes.');
        }
    };

    const handleRevert = async (version: DocumentVersion) => {
        if (!window.confirm(`Are you sure you want to revert to Version ${version.version}? This will become the new current version.`)) return;

        setError(null);
        try {
            // FIX: Cast 'version_history' through 'unknown' to safely convert from 'Json' to 'DocumentVersion[]'.
            const documentVersions = (document.version_history as unknown as DocumentVersion[] | null) || [];
            const revertDescription = `Reverted to Version ${version.version}.`;

            const previousVersion: DocumentVersion = {
                version: documentVersions.length + 1,
                createdAt: new Date().toISOString(),
                content: document.content,
                description: revertDescription,
            };
            const newHistory = [...documentVersions, previousVersion];

            const updatedDoc = {
                ...document,
                content: version.content,
                version_history: newHistory as unknown as Json,
            };

            await updateDocument(updatedDoc);
            alert("Document successfully reverted.");
            setIsHistoryVisible(false);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to revert document.');
        }
    };


    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
                <div className="flex-1">
                    <button onClick={handleBack} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-2">
                        &larr; Back to Documents
                    </button>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 break-words">{document.name}</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1">
                        {document.type} &bull; Created on {new Date(document.created_at).toLocaleDateString()}
                    </p>
                </div>
                {!isEditing && (
                    <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700">
                        Edit Document
                    </button>
                )}
            </div>
             {error && <div className="mb-4"><ErrorAlert message={error} /></div>}

            <div className="bg-white dark:bg-slate-800 p-2 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                {isEditing ? (
                    <div>
                        <textarea ref={textareaRef} />
                        <div className="flex justify-end gap-2 mt-4">
                            <button onClick={() => setIsEditing(false)} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-md hover:bg-slate-200">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Save Changes</button>
                        </div>
                    </div>
                ) : (
                    <GeneratedDocument 
                        document={document} 
                        onUpdateDocument={updateDocument} 
                        onReset={handleBack} 
                        onResetText="Back to Documents"
                        onCreateTemplate={onCreateTemplate} 
                    />
                )}
                
                 <div className="mt-4">
                    <button onClick={() => setIsHistoryVisible(!isHistoryVisible)} className="w-full text-left flex items-center p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-semibold">
                       <HistoryIcon className="w-5 h-5 mr-2" />
                        {isHistoryVisible ? 'Hide' : 'Show'} Version History
                    </button>
                    {isHistoryVisible && (
                        <VersionHistoryPanel 
                            // FIX: Cast 'version_history' through 'unknown' to safely convert from 'Json' to 'DocumentVersion[]'.
                            versions={(document.version_history as unknown as DocumentVersion[] | null) || []}
                            onView={(v) => setViewingVersion(v)}
                            onRevert={handleRevert}
                        />
                    )}
                 </div>
            </div>

            <Modal isOpen={!!viewingVersion} onClose={() => setViewingVersion(null)} title={`Viewing Version ${viewingVersion?.version}`}>
                {viewingVersion && (
                    <div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(viewingVersion.content || '') }}></div>
                )}
            </Modal>
        </div>
    );
};

export default ViewDocumentPage;
