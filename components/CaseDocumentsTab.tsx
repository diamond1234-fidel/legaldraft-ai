import React, { useState } from 'react';
import { Document } from '../types';
import FolderIcon from './icons/FolderIcon';
import UploadDocumentModal from './UploadDocumentModal';
import { useLanguage } from '../contexts/LanguageContext';
import UploadIcon from './icons/UploadIcon';
import PencilIcon from './icons/PencilIcon';

interface CaseDocumentsTabProps {
    documents: Document[];
    onViewDocument: (doc: Document) => void;
    onUpload: (file: File, description: string) => Promise<void>;
}

const CaseDocumentsTab: React.FC<CaseDocumentsTabProps> = ({ documents, onViewDocument, onUpload }) => {
    const { t } = useLanguage();
    const [isUploadModalOpen, setUploadModalOpen] = useState(false);

    return (
        <div>
            <div className="flex justify-end mb-4">
                <button onClick={() => setUploadModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700">
                    {t('uploadDocumentButton')}
                </button>
            </div>

            {documents.length > 0 ? (
                <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
                    <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                        {documents.map(doc => (
                            <li key={doc.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div className="flex items-center flex-1 mb-2 sm:mb-0">
                                    <div className="mr-4 flex-shrink-0">
                                        {doc.source === 'uploaded' ? <UploadIcon className="w-6 h-6 text-slate-500" /> : <PencilIcon className="w-6 h-6 text-blue-500" />}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-800 dark:text-slate-100">{doc.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{doc.type} &bull; {t('createdOn')} {new Date(doc.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <button onClick={() => onViewDocument(doc)} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/60 flex-shrink-0 self-start sm:self-center">
                                    {t('viewDocument')}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ) : (
                <div className="text-center py-16 text-slate-500 dark:text-slate-400">
                    <FolderIcon className="w-12 h-12 mx-auto mb-2 text-slate-400" />
                    <h3 className="font-semibold text-lg text-slate-600 dark:text-slate-300">{t('noDocumentsTitle')}</h3>
                    <p className="text-sm">{t('noDocumentsSubtitle')}</p>
                </div>
            )}
            <UploadDocumentModal isOpen={isUploadModalOpen} onClose={() => setUploadModalOpen(false)} onUpload={onUpload} />
        </div>
    );
};

export default CaseDocumentsTab;