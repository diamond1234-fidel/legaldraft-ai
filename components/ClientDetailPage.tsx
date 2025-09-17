

import React, { useState } from 'react';
import { Client, Matter, Page } from '../types';
import EditClientModal from './EditClientModal';

interface ClientDetailPageProps {
    client: Client;
    matters: Matter[];
    onNavigate: (page: Page) => void;
    onUpdateClient: (client: Client) => Promise<void>;
}

const ClientDetailPage: React.FC<ClientDetailPageProps> = ({ client, matters, onNavigate, onUpdateClient }) => {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    
    const handleBack = () => {
        onNavigate('clients');
    };
    
    const handleAddNewMatter = () => {
        onNavigate('intake'); 
    };

    return (
        <div className="space-y-8">
            <div>
                <button onClick={handleBack} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 mb-2">
                    &larr; Back to Clients List
                </button>
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{client.name}</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">{client.email} &bull; {client.type}</p>
                    </div>
                     <button onClick={() => setIsEditModalOpen(true)} className="px-4 py-2 text-sm border rounded-md shadow-sm bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600">
                        Edit Client
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                <div className="lg:col-span-1 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Client Details</h2>
                    <div className="space-y-3 text-sm">
                        <InfoRow label="Full Name" value={client.name} />
                        <InfoRow label="Email" value={client.email} />
                        <InfoRow label="Phone" value={client.phone || 'N/A'} />
                        <InfoRow label="Address" value={client.address || 'N/A'} />
                        <InfoRow label="Client Since" value={new Date(client.created_at).toLocaleDateString()} />
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Associated Matters</h2>
                        <button onClick={handleAddNewMatter} className="px-4 py-2 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 self-start sm:self-center">
                            Add New Matter
                        </button>
                    </div>
                    
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Matter Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {matters.length > 0 ? matters.map(matter => (
                                        <tr key={matter.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{matter.matter_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm capitalize">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${matter.status === 'open' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300'}`}>{matter.status}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(matter.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={3} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                                No matters have been created for this client.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {isEditModalOpen && (
                <EditClientModal 
                    isOpen={isEditModalOpen} 
                    onClose={() => setIsEditModalOpen(false)} 
                    onSave={onUpdateClient} 
                    client={client} 
                />
            )}
        </div>
    );
};

const InfoRow: React.FC<{label: string; value: React.ReactNode}> = ({label, value}) => (
    <div>
        <dt className="text-xs font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="text-slate-800 dark:text-slate-200">{value}</dd>
    </div>
);

export default ClientDetailPage;