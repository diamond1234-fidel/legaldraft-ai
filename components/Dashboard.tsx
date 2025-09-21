import React from 'react';
import { UserProfile, Page, Document, DocumentStatus } from '../types';
import EyeIcon from './icons/EyeIcon';
import FolderIcon from './icons/FolderIcon';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (page: Page) => void;
  onViewDocument: (doc: Document) => void;
}

const PrimaryActionCard: React.FC<{ title: string; description: string; onClick: () => void; icon: React.ReactNode }> = ({ title, description, onClick, icon }) => (
    <button onClick={onClick} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-left hover:border-blue-500 hover:ring-1 hover:ring-blue-500 dark:hover:border-blue-500 transition-all duration-150 flex items-start space-x-4 w-full h-full">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400 rounded-lg flex items-center justify-center">{icon}</div>
        <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{description}</p>
        </div>
    </button>
);

const StatusBadge: React.FC<{ status: DocumentStatus | string | null }> = ({ status }) => {
    const statusMap: Record<string, { style: string, text: string }> = {
        analyzed: { style: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', text: 'Analyzed' },
        draft: { style: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300', text: 'Draft' },
        reviewed: { style: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', text: 'Analyzed' }, // backward compatibility
    };
    const currentStatus = status && statusMap[status] ? statusMap[status] : statusMap.draft;
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentStatus.style}`}>{currentStatus.text}</span>;
};


const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onViewDocument }) => {

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">Welcome, {user.full_name?.split(' ')[0] || user.email?.split('@')[0]}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Your command center for AI-powered contract analysis.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PrimaryActionCard 
                    title="Analyze a Contract"
                    description="Upload a document to get an instant AI-powered analysis of risks, missing clauses, and more."
                    onClick={() => onNavigate('review')}
                    icon={<EyeIcon className="h-6 w-6" />}
                />
                 <PrimaryActionCard 
                    title="View Saved Analyses"
                    description="Access and review all your previously analyzed contracts and reports."
                    onClick={() => onNavigate('documents')}
                    icon={<FolderIcon className="h-6 w-6" />}
                />
            </div>

            {/* Recent Documents */}
             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Analyses</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                             <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date Analyzed</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {user.documents.length > 0 ? user.documents.slice(0, 5).map((doc) => (
                                    <tr key={doc.id} className="dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{doc.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={doc.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => onViewDocument(doc)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                                        </td>
                                    </tr>
                                )) : (
                                     <tr>
                                        <td colSpan={5} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                            You haven't analyzed any documents yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                     <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                         <button onClick={() => onNavigate('documents')} className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                            View All Analyses
                        </button>
                    </div>
                </div>
             </div>
        </div>
    )
};

export default Dashboard;