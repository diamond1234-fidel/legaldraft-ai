
import React, { useState } from 'react';
import { Matter, UserProfile, Page, Document, Note, Task, TimeEntry, Client, Invoice } from '../types';
import Tabs from './Tabs';
import CaseOverviewTab from './CaseOverviewTab';
import CaseDocumentsTab from './CaseDocumentsTab';
import BriefcaseIcon from './icons/BriefcaseIcon';
import ClientUpdateTab from './ClientUpdateTab';
import CaseNotesTab from './CaseNotesTab';
import CaseTasksTab from './CaseTasksTab';
import TimeLogModal from './TimeLogModal';
import { useLanguage } from '../contexts/LanguageContext';
import CaseBillingTab from './CaseBillingTab';
import EditMatterModal from './EditMatterModal';

interface CaseDetailPageProps {
    matter: Matter;
    user: UserProfile;
    onNavigate: (page: Page) => void;
    onViewDocument: (doc: Document) => void;
    addNote: (noteData: Omit<Note, 'id' | 'created_at' | 'user_id'>) => Promise<Note>;
    onAddTask: (taskData: Omit<Task, 'id' | 'created_at' | 'user_id'>) => Promise<Task>;
    onUpdateTask: (taskData: Omit<Task, 'created_at' | 'user_id'>) => Promise<void>;
    onDeleteTask: (taskId: string) => Promise<void>;
    onLogTime: (entryData: Omit<TimeEntry, 'id' | 'created_at' | 'user_id' | 'is_billed'>) => Promise<void>;
    onUploadDocument: (file: File, matterId: string, description: string) => Promise<void>;
    onUpdateTimeEntry: (entryData: Omit<TimeEntry, 'created_at' | 'user_id'>) => Promise<void>;
    onUpdateMatter: (matter: Matter) => Promise<void>;
    onUpdateNote: (note: Note) => Promise<void>;
    onDeleteNote: (noteId: string) => Promise<void>;
    onDeleteTimeEntry: (entryId: string) => Promise<void>;
    onAddInvoice: (invoice: Invoice) => Promise<void>;
    onUpdateInvoice: (invoice: Invoice) => Promise<void>;
}

const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ matter, user, onNavigate, onViewDocument, addNote, onAddTask, onUpdateTask, onDeleteTask, onLogTime, onUploadDocument, onUpdateTimeEntry, onUpdateMatter, onUpdateNote, onDeleteNote, onDeleteTimeEntry, onAddInvoice, onUpdateInvoice }) => {
    const { t } = useLanguage();
    const [activeTab, setActiveTab] = useState(0);
    const [isTimeLogOpen, setIsTimeLogOpen] = useState(false);
    const [isEditMatterModalOpen, setIsEditMatterModalOpen] = useState(false);
    const client = user.clients.find(c => c.id === matter.client_id);
    
    if (!client) {
        return (
            <div>
                <p>Error: Client for this matter could not be found.</p>
                <button onClick={() => onNavigate('matters')}>Back to Matters</button>
            </div>
        );
    }
    
    const matterNotes = user.notes.filter(n => n.matter_id === matter.id);
    const matterTasks = user.tasks.filter(t => t.matter_id === matter.id);
    const matterTimeEntries = user.timeEntries.filter(t => t.matter_id === matter.id);
    const matterInvoices = user.invoices.filter(i => i.matter_id === matter.id);

    const handleUpload = async (file: File, description: string) => {
        await onUploadDocument(file, matter.id, description);
    };

    const tabs = [
        { label: t('caseDetailOverview'), content: <CaseOverviewTab matter={matter} client={client} /> },
        { label: t('caseDetailDocuments'), content: <CaseDocumentsTab documents={user.documents.filter(d => d.matter_id === matter.id)} onViewDocument={onViewDocument} onUpload={handleUpload} /> },
        { label: t('caseDetailNotes'), content: <CaseNotesTab matter={matter} notes={matterNotes} addNote={addNote} onUpdateNote={onUpdateNote} onDeleteNote={onDeleteNote} /> },
        { label: t('caseDetailTasks'), content: <CaseTasksTab matter={matter} tasks={matterTasks} onAddTask={onAddTask} onUpdateTask={onUpdateTask} onDeleteTask={onDeleteTask} /> },
        { label: t('caseDetailUpdates'), content: <ClientUpdateTab matter={matter} client={client as Client} documents={user.documents.filter(d => d.matter_id === matter.id)} tasks={user.tasks.filter(t => t.matter_id === matter.id)} notes={matterNotes} onAddNote={addNote} /> },
        { label: t('caseDetailEvidence'), content: <PlaceholderTab title={t('caseDetailEvidence')} /> },
        { label: t('caseDetailBilling'), content: <CaseBillingTab matter={matter} timeEntries={matterTimeEntries} invoices={matterInvoices} user={user} onUpdateTimeEntry={onUpdateTimeEntry} onDeleteTimeEntry={onDeleteTimeEntry} onAddInvoice={onAddInvoice} onUpdateInvoice={onUpdateInvoice} /> },
        { label: t('caseDetailResearch'), content: <PlaceholderTab title={t('caseDetailResearch')} /> },
    ];

    return (
        <div className="space-y-6">
            <div>
                <button onClick={() => onNavigate('matters')} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-2">
                    &larr; {t('caseDetailBack')}
                </button>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{matter.matter_name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{t('caseDetailClient')}: {client.name}</p>
                    </div>
                     <div className="flex items-center gap-2 self-start sm:self-center">
                        <button onClick={() => setIsEditMatterModalOpen(true)} className="px-4 py-2 text-sm border rounded-md shadow-sm bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">Edit Matter</button>
                        <button onClick={() => setIsTimeLogOpen(true)} className="px-4 py-2 text-sm border border-transparent rounded-md shadow-sm text-white bg-slate-600 hover:bg-slate-700">{t('caseDetailLogTime')}</button>
                        <span className={`capitalize px-3 py-2 text-sm font-semibold rounded-full ${matter.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>{matter.status}</span>
                     </div>
                </div>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
            <TimeLogModal isOpen={isTimeLogOpen} onClose={() => setIsTimeLogOpen(false)} onSave={onLogTime} matter={matter} />
             {isEditMatterModalOpen && (
                <EditMatterModal 
                    isOpen={isEditMatterModalOpen} 
                    onClose={() => setIsEditMatterModalOpen(false)} 
                    onSave={onUpdateMatter} 
                    matter={matter} 
                />
            )}
        </div>
    );
};

const PlaceholderTab: React.FC<{title: string}> = ({ title }) => {
    const { t } = useLanguage();
    return (
        <div className="text-center py-16 text-slate-500 dark:text-slate-400">
            <BriefcaseIcon className="w-12 h-12 mx-auto mb-2 text-slate-400" />
            <h3 className="font-semibold text-lg text-slate-600 dark:text-slate-300">{title}</h3>
            <p className="text-sm">{t('comingSoon')}</p>
        </div>
    );
};

export default CaseDetailPage;
