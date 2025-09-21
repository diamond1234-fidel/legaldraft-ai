
import React, { useState } from 'react';
import { Client, Matter, Page } from '../types';
import SearchIcon from './icons/SearchIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import ErrorAlert from './ErrorAlert';

interface CaseListPageProps {
  matters: Matter[];
  clients: Client[];
  onViewCase: (matter: Matter) => void;
  onNavigate: (page: Page) => void;
  onDeleteMatter: (matterId: string) => Promise<void>;
}

const CaseListPage: React.FC<CaseListPageProps> = ({ matters, clients, onViewCase, onNavigate, onDeleteMatter }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const clientMap = new Map(clients.map(client => [client.id, client.name]));

    const filteredMatters = matters.filter(matter => {
        const clientName = clientMap.get(matter.client_id) || '';
        return matter.matter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
               clientName.toLowerCase().includes(searchTerm.toLowerCase());
    });
    
    const handleDelete = async (matter: Matter) => {
        setError(null);
        if (window.confirm(`Are you sure you want to delete the matter "${matter.matter_name}"? This will also delete all associated notes, tasks, and documents.`)) {
            try {
                await onDeleteMatter(matter.id);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
            }
        }
    };

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Matters</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all your cases and matters.</p>
            </div>
            <button onClick={() => onNavigate('intake')} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 self-start sm:self-center">
                New Matter
            </button>
        </div>
        
        {error && <div className="mb-4"><ErrorAlert message={error} title="Deletion Failed" /></div>}

        <div className="mb-4 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
                type="text"
                placeholder="Search matters by name or client..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search matters"
            />
        </div>
      
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matter Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Client</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Opened</th>
                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredMatters.length > 0 ? filteredMatters.map((matter) => (
                <tr key={matter.id} className="dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{matter.matter_name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{clientMap.get(matter.client_id) || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${matter.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>{matter.status}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(matter.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => onViewCase(matter)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View Details</button>
                     <button onClick={() => handleDelete(matter)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center py-12">
                         <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                            <BriefcaseIcon className="w-12 h-12 mb-2" />
                            <p className="font-semibold">{searchTerm ? 'No matters match your search' : 'No matters created yet'}</p>
                            {!searchTerm && <p className="text-sm">Create a new matter to get started.</p>}
                        </div>
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
export default CaseListPage;
