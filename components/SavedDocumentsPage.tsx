import React, { useState, useEffect } from 'react';
import { Document, DocumentStatus } from '../types';
import ErrorAlert from './ErrorAlert';
import SearchIcon from './icons/SearchIcon';

interface SavedDocumentsPageProps {
  documents: Document[];
  onViewDocument: (doc: Document) => void;
  onDeleteDocument: (docId: string) => Promise<void>;
}

const StatusBadge: React.FC<{ status: DocumentStatus | string | null }> = ({ status }) => {
    const statusMap: Record<string, { style: string, text: string }> = {
        analyzed: { style: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', text: 'Analyzed' },
        draft: { style: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300', text: 'Draft' },
        reviewed: { style: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', text: 'Analyzed' },
    };
    const currentStatus = status && statusMap[status] ? statusMap[status] : statusMap.draft;
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentStatus.style}`}>{currentStatus.text}</span>;
};


const SavedDocumentsPage: React.FC<SavedDocumentsPageProps> = ({ documents, onViewDocument, onDeleteDocument }) => {
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleDelete = async (doc: Document) => {
    setError(null);
    if (window.confirm(`Are you sure you want to delete the analysis for "${doc.name}"? This action cannot be undone.`)) {
        setDeletingId(doc.id);
        try {
            await onDeleteDocument(doc.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unexpected error occurred while deleting the document.');
        } finally {
            setDeletingId(null);
        }
    }
  };

  const filteredDocuments = documents.filter(doc => {
      return (doc.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (doc.type || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Saved Analyses</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-1">A list of all contracts you have analyzed.</p>
      
      <div className="my-4">
        <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
                type="text"
                placeholder="Search by filename..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search analyses"
            />
        </div>
      </div>
      
      {error && <div className="my-4"><ErrorAlert message={error} title="Deletion Failed" /></div>}

      <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Analyzed</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredDocuments.length > 0 ? filteredDocuments.map((doc) => (
                <tr key={doc.id} className="dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <StatusBadge status={doc.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onViewDocument(doc)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                    <button onClick={() => handleDelete(doc)} disabled={deletingId === doc.id} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 disabled:text-slate-400 disabled:cursor-not-allowed">
                        {deletingId === doc.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                        <p>{searchTerm ? 'No analyses match your search.' : "You haven't analyzed any documents yet."}</p>
                    </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SavedDocumentsPage;