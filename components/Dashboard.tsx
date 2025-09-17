
import React from 'react';
import { UserProfile, Page, Document, ResearchLog, Matter } from '../types';
import SearchIcon from './icons/SearchIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import TasksIcon from './icons/TasksIcon';

interface DashboardProps {
  user: UserProfile;
  onNavigate: (page: Page) => void;
  onViewDocument: (doc: Document) => void;
  onViewCase: (matter: Matter) => void;
}

const StatCard: React.FC<{ label: string; value: string | number; subtext?: string }> = ({ label, value, subtext }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
        <p className="text-3xl font-bold text-slate-800 dark:text-slate-100 mt-1">{value}</p>
        {subtext && <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtext}</p>}
    </div>
);

const QuickLink: React.FC<{title: string; description: string; onClick: () => void; icon: React.ReactNode }> = ({ title, description, onClick, icon }) => (
    <button onClick={onClick} className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm text-left hover:border-blue-500 hover:ring-1 hover:ring-blue-500 dark:hover:border-blue-500 transition-all duration-150 flex items-start space-x-4">
        <div className="flex-shrink-0 w-10 h-10 bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400 rounded-lg flex items-center justify-center">{icon}</div>
        <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">{title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{description}</p>
        </div>
    </button>
);

const HealthScore: React.FC<{ score: number }> = ({ score }) => {
    const getColor = () => {
        if (score >= 90) return 'text-green-600 bg-green-100 dark:text-green-300 dark:bg-green-500/20';
        if (score >= 80) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-300 dark:bg-yellow-500/20';
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-500/20';
    };
    return (
        <div className={`px-2 py-1 rounded-full text-xs font-semibold inline-flex items-center ${getColor()}`}>
            {score}
        </div>
    );
};

const formatResearchType = (type: string) => {
    return type
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, (str) => str.toUpperCase());
};

const Dashboard: React.FC<DashboardProps> = ({ user, onNavigate, onViewDocument, onViewCase }) => {
    const hasDraftedNDA = user.documents.some(d => d.type?.includes('NDA'));
    const upcomingTasks = user.tasks
        .filter(t => t.status === 'pending' && t.due_date)
        .sort((a, b) => new Date(a.due_date!).getTime() - new Date(b.due_date!).getTime())
        .slice(0, 5);

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-100">Welcome, {user.full_name?.split(' ')[0] || user.email?.split('@')[0]}</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Here's your command center for smarter case and contract management.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard label="Active Matters" value={user.matters.filter(m => m.status === 'open').length} />
                <StatCard label="Contracts Drafted" value={user.usage.drafted} />
                <StatCard label="Contracts Reviewed" value={user.usage.reviewed} />
                <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Subscription</p>
                    <p className={`text-3xl font-bold mt-1 ${user.subscription_status === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-orange-500 dark:text-orange-400'}`}>
                        {user.subscription_status === 'paid' ? 'Professional Plan' : 'Free Trial'}
                    </p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <QuickLink 
                    title="Start New Matter"
                    description="Begin client intake for a new case."
                    onClick={() => onNavigate('intake')}
                    icon={<BriefcaseIcon className="h-6 w-6" />}
                />
                 <QuickLink 
                    title="Draft New Contract"
                    description="Generate a compliant document from scratch."
                    onClick={() => onNavigate('draft')}
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002 2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                 {/* Upcoming Tasks */}
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Upcoming Tasks</h2>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                        {upcomingTasks.length > 0 ? (
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                {upcomingTasks.map((task) => {
                                    const matter = user.matters.find(m => m.id === task.matter_id);
                                    const isPastDue = task.due_date && new Date(task.due_date) < new Date();
                                    return (
                                        <li key={task.id} className="p-4">
                                            <p className="font-bold text-slate-800 dark:text-slate-100">{task.title}</p>
                                            <div className="flex justify-between items-center text-sm mt-1">
                                                <p className="text-slate-500 dark:text-slate-400">{matter?.matter_name || 'No Matter'}</p>
                                                <p className={`font-medium ${isPastDue ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>{new Date(task.due_date!).toLocaleDateString()}</p>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="text-center text-slate-500 dark:text-slate-400 p-8">
                                <TasksIcon className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                                <p>No upcoming tasks with due dates.</p>
                            </div>
                        )}
                        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
                             <button onClick={() => onNavigate('tasks')} className="w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                View All Tasks
                            </button>
                        </div>
                    </div>
                </div>

                 {/* Active Matters */}
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Active Matters</h2>
                    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        {user.matters.filter(m => m.status === 'open').length > 0 ? (
                            <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                                {user.matters.filter(m => m.status === 'open').slice(0, 5).map((matter) => {
                                    const client = user.clients.find(c => c.id === matter.client_id);
                                    return (
                                        <li key={matter.id} className="p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                            <div className="flex-1 mb-2 sm:mb-0">
                                                <p className="font-bold text-slate-800 dark:text-slate-100">{matter.matter_name}</p>
                                                <p className="text-sm text-slate-500 dark:text-slate-400">{client?.name || 'Unknown Client'}</p>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className="text-sm text-slate-500 dark:text-slate-400">Opened: {new Date(matter.created_at).toLocaleDateString()}</span>
                                                <button onClick={() => onViewCase(matter)} className="px-3 py-1 text-sm font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 rounded-md hover:bg-blue-200 dark:hover:bg-blue-800/60 flex-shrink-0">
                                                    View Matter
                                                </button>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                             <div className="text-center text-slate-500 dark:text-slate-400 p-8">
                                <p>No active matters found.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Documents */}
             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">Recent Documents</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                             <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Document Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Health Score</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Date</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {user.documents.slice(0, 3).map((doc) => (
                                    <tr key={doc.id} className="dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{doc.name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><HealthScore score={doc.health_score || 0} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${doc.status === 'drafted' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300' : 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300'}`}>{doc.status}</span></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(doc.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => onViewDocument(doc)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">View</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
        </div>
    )
};

export default Dashboard;