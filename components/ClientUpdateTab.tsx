
import React, { useState } from 'react';
import { Matter, Client, Document, Task, Note } from '../types';
import { generateClientUpdate } from '../services/geminiService';
import ErrorAlert from './ErrorAlert';
import MailIcon from './icons/MailIcon';

interface ClientUpdateTabProps {
    matter: Matter;
    client: Client;
    documents: Document[];
    tasks: Task[];
    notes: Note[];
    onAddNote: (noteData: Omit<Note, 'id' | 'created_at' | 'user_id'>) => Promise<Note>;
}

const LoadingState: React.FC = () => {
    const messages = [
        "Analyzing case timeline...",
        "Summarizing recent documents...",
        "Checking upcoming deadlines...",
        "Drafting client-friendly update...",
        "Finalizing summary..."
    ];
    const [message, setMessage] = useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Generating AI Update...</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{message}</p>
        </div>
    );
};


const ClientUpdateTab: React.FC<ClientUpdateTabProps> = ({ matter, client, documents, tasks, notes, onAddNote }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [updateText, setUpdateText] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const handleGenerateUpdate = async () => {
        setIsLoading(true);
        setError(null);
        setUpdateText('');
        setSaveSuccess(false);

        try {
            const caseData = {
                clientName: client.name,
                matterName: matter.matter_name,
                matterStatus: matter.status,
                recentDocuments: documents.slice(0, 5).map(d => ({ name: d.name || 'Untitled', created_at: d.created_at, type: d.type || 'Document'})),
                openTasks: tasks.filter(t => t.status === 'pending').map(t => ({ title: t.title, due_date: t.due_date || '' })),
                recentNotes: notes.slice(0, 5).map(n => ({ content: n.content, created_at: n.created_at })),
            };
            const result = await generateClientUpdate(caseData);
            setUpdateText(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveToNotes = async () => {
        if (!updateText) return;
        setIsSaving(true);
        setError(null);
        setSaveSuccess(false);
        try {
            const noteContent = `--- AI-Generated Client Update ---\n\n${updateText}`;
            await onAddNote({ content: noteContent, matter_id: matter.id });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000); // Hide success message after 3s
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save update to notes.');
        } finally {
            setIsSaving(false);
        }
    };
    
    const handleSend = () => {
        // Mock sending functionality
        alert(`Email draft prepared for ${client.email}.\n\n(This is a demo. In a real app, this would open a pre-filled email client.)`);
    }

    if (isLoading) {
        return <LoadingState />;
    }

    if (error) {
        return (
            <div className="p-4">
                <ErrorAlert message={error} title="Update Generation Failed" />
                <button onClick={handleGenerateUpdate} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Try Again
                </button>
            </div>
        );
    }
    
    if (updateText) {
        return (
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Generated Update Draft</h3>
                <textarea 
                    value={updateText}
                    onChange={(e) => setUpdateText(e.target.value)}
                    rows={15}
                    className="w-full p-3 font-sans text-sm border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                />
                 {saveSuccess && <p className="text-sm text-green-600 dark:text-green-400">Successfully saved to case notes!</p>}
                <div className="flex flex-col sm:flex-row gap-2 justify-end">
                    <button onClick={handleGenerateUpdate} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500">Regenerate</button>
                    <button onClick={handleSaveToNotes} disabled={isSaving} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-600 rounded-md hover:bg-slate-200 dark:hover:bg-slate-500 disabled:bg-slate-300">
                        {isSaving ? 'Saving...' : 'Save to Case Notes'}
                    </button>
                    <button onClick={handleSend} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">Send to Client</button>
                </div>
            </div>
        )
    }

    return (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
            <MailIcon className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <h3 className="font-semibold text-lg text-slate-600 dark:text-slate-300">AI-Generated Client Updates</h3>
            <p className="text-sm max-w-md mx-auto mt-1">
                Let AI summarize recent case activity—new documents, upcoming deadlines, and notes—into a clear, client-friendly email update.
            </p>
            <button 
                onClick={handleGenerateUpdate} 
                className="mt-6 px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700"
            >
                Generate Client Update
            </button>
        </div>
    );
};

export default ClientUpdateTab;
