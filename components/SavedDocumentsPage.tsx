
import React, { useState } from 'react';
import { Document, SignatureStatus } from '../types';
import ErrorAlert from './ErrorAlert';

interface SavedDocumentsPageProps {
  documents: Document[];
  onViewDocument: (doc: Document) => void;
  onDeleteDocument: (docId: string) => Promise<void>;
}

const SignatureStatusBadge: React.FC<{ status: SignatureStatus }> = ({ status }) => {
  const styles: Record<string, string> = {
    none: 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300',
    out_for_signature: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300',
    signed: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300',
    declined: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300',
  };
  const text: Record<string, string> = {
      none: 'Not Sent',
      out_for_signature: 'Out for Signature',
      signed: 'Signed',
      declined: 'Declined',
  }
  return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${styles[status] || styles.none}`}>{text[status] || 'Unknown'}</span>;
};


const SavedDocumentsPage: React.FC<SavedDocumentsPageProps> = ({ documents, onViewDocument, onDeleteDocument }) => {
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (doc: Document) => {
    setError(null);
    if (window.confirm(`Are you sure you want to delete the document "${doc.name}"? This action cannot be undone.`)) {
        try {
            await onDeleteDocument(doc.id);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unexpected error occurred while deleting the document.');
        }
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Your Documents</h1>
      <p className="text-slate-600 dark:text-slate-400 mt-1">A list of all contracts you have drafted or reviewed.</p>
      
      {error && <div className="my-4"><ErrorAlert message={error} title="Deletion Failed" /></div>}

      {/* Mobile Card View */}
      <div className="mt-6 md:hidden space-y-4">
        {documents.length > 0 ? documents.map(doc => (
          <div key={doc.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 break-words">{doc.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{doc.type}</p>
                <div className="mt-2">
                    <SignatureStatusBadge status={(doc.signature_status as SignatureStatus) || 'none'} />
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-sm">
              <p className="text-slate-500 dark:text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</p>
              <div className="flex items-center space-x-4">
                <button onClick={() => onViewDocument(doc)} className="font-medium text-blue-600 dark:text-blue-400">View</button>
                <button onClick={() => handleDelete(doc)} className="font-medium text-red-600 dark:text-red-400">Delete</button>
              </div>
            </div>
          </div>
        )) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                You haven't created any documents yet.
            </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="mt-8 hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Signature Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Created</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {documents.length > 0 ? documents.map((doc) => (
                <tr key={doc.id} className="dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{doc.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{doc.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <SignatureStatusBadge status={(doc.signature_status as SignatureStatus) || 'none'} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => onViewDocument(doc)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                    <button onClick={() => handleDelete(doc)} className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                        You haven't created any documents yet.
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
