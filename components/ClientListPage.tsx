import React, { useState } from 'react';
import { Client, Matter, Page } from '../types';
import SearchIcon from './icons/SearchIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import ErrorAlert from './ErrorAlert';

interface ClientListPageProps {
  clients: Client[];
  matters: Matter[];
  onViewClient: (client: Client) => void;
  onAddClient: () => void;
  onDeleteClient: (clientId: string) => Promise<void>;
}

const ClientListPage: React.FC<ClientListPageProps> = ({ clients, matters, onViewClient, onAddClient, onDeleteClient }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState<string | null>(null);

    const getMatterCount = (clientId: string) => {
        return matters.filter(matter => matter.client_id === clientId).length;
    };

    const filteredClients = clients.filter(client => 
        client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const handleDelete = async (client: Client) => {
        setError(null);
        if (window.confirm(`Are you sure you want to delete the client "${client.name}"? This action cannot be undone.`)) {
            try {
                await onDeleteClient(client.id);
            } catch (e) {
                setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
            }
        }
    };

  return (
    <div>
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Clients</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Manage your clients and their associated matters.</p>
            </div>
            <button onClick={onAddClient} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 self-start sm:self-center">
                Add New Client
            </button>
        </div>

        {error && <div className="mb-4"><ErrorAlert message={error} title="Deletion Failed" /></div>}

        <div className="mb-4 relative">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
                type="text"
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search clients"
            />
        </div>
      
      {/* Mobile Card View */}
      <div className="md:hidden space-y-4">
        {filteredClients.length > 0 ? filteredClients.map(client => (
          <div key={client.id} className="bg-white dark:bg-slate-800 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 p-4">
             <div className="flex justify-between items-start">
              <div className="flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 break-words">{client.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{client.email}</p>
              </div>
              <button onClick={() => onViewClient(client)} className="ml-4 px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-300 rounded-md hover:bg-blue-100">View</button>
            </div>
             <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 flex justify-between items-center text-sm">
                <div>
                    <p className="text-slate-500 dark:text-slate-400">Type: <span className="font-medium text-slate-700 dark:text-slate-300">{client.type}</span></p>
                    <p className="text-slate-500 dark:text-slate-400">Matters: <span className="font-medium text-slate-700 dark:text-slate-300">{getMatterCount(client.id)}</span></p>
                </div>
                <button onClick={() => handleDelete(client)} className="font-medium text-red-600 dark:text-red-400">Delete</button>
             </div>
          </div>
        )) : (
            <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <UserGroupIcon className="w-12 h-12 mx-auto mb-2" />
                <p className="font-semibold">{searchTerm ? 'No clients match your search' : 'No clients created yet'}</p>
                {!searchTerm && <p className="text-sm">Add a new client to get started.</p>}
            </div>
        )}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Type</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matters</th>
                <th scope="col" className="relative px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
              {filteredClients.length > 0 ? filteredClients.map((client) => (
                <tr key={client.id} className="dark:hover:bg-slate-700/50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{client.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{client.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{client.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{getMatterCount(client.id)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                    <button onClick={() => onViewClient(client)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View Details</button>
                    <button onClick={() => handleDelete(client)} className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300">Delete</button>
                  </td>
                </tr>
              )) : (
                <tr>
                    <td colSpan={5} className="text-center py-12">
                         <div className="flex flex-col items-center text-slate-500 dark:text-slate-400">
                            <UserGroupIcon className="w-12 h-12 mb-2" />
                            <p className="font-semibold">{searchTerm ? 'No clients match your search' : 'No clients created yet'}</p>
                            {!searchTerm && <p className="text-sm">Add a new client to get started.</p>}
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
export default ClientListPage;