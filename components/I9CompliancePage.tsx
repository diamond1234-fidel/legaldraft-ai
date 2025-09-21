import React from 'react';
import { UserProfile, I9Record } from '../types';
import ShieldCheckIcon from './icons/ShieldCheckIcon';

interface I9CompliancePageProps {
    user: UserProfile;
    onStartNewI9: () => void;
    onViewI9Record: (record: I9Record) => void;
}

const StatCard: React.FC<{ title: string; value: number | string; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start space-x-4">
        <div className="flex-shrink-0 w-12 h-12 bg-blue-100 text-blue-600 dark:bg-slate-700 dark:text-blue-400 rounded-lg flex items-center justify-center">{icon}</div>
        <div>
            <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{value}</p>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        </div>
    </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const statusMap: Record<string, { style: string, text: string }> = {
        awaiting_employee: { style: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-300', text: 'Awaiting Employee' },
        awaiting_employer: { style: 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-300', text: 'Awaiting Employer' },
        pending_e_verify: { style: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-500/20 dark:text-indigo-300', text: 'Ready for E-Verify' },
        e_verify_authorized: { style: 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300', text: 'E-Verify Authorized' },
        e_verify_tnc: { style: 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300', text: 'E-Verify TNC' },
    };
    const currentStatus = statusMap[status] || { style: 'bg-slate-100 text-slate-800', text: 'Unknown' };
    return <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${currentStatus.style}`}>{currentStatus.text}</span>;
};


const I9CompliancePage: React.FC<I9CompliancePageProps> = ({ user, onStartNewI9, onViewI9Record }) => {

    const stats = {
        awaitingAction: user.i9Records.filter(r => r.status === 'awaiting_employee' || r.status === 'awaiting_employer').length,
        pendingEVerify: user.i9Records.filter(r => r.status === 'pending_e_verify').length,
        totalCompleted: user.i9Records.filter(r => r.status.startsWith('e_verify_')).length,
    };

    const getActionText = (status: string) => {
        switch(status) {
            case 'awaiting_employee': return 'Complete Section 1';
            case 'awaiting_employer': return 'Verify Section 2';
            case 'pending_e_verify': return 'Submit to E-Verify';
            default: return 'View Status';
        }
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">I-9 & E-Verify Compliance</h1>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">Manage employment eligibility verification for your clients.</p>
                </div>
                <button onClick={onStartNewI9} className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 self-start sm:self-center">
                    Start New Form I-9
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard title="Awaiting Action" value={stats.awaitingAction} icon={<PencilIcon className="w-6 h-6" />} />
                <StatCard title="Pending E-Verify" value={stats.pendingEVerify} icon={<EyeIcon className="w-6 h-6" />} />
                <StatCard title="Total Completed" value={stats.totalCompleted} icon={<ShieldCheckIcon className="w-6 h-6" />} />
            </div>

             <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-4">I-9 Records</h2>
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                             <thead className="bg-slate-50 dark:bg-slate-700/50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Employee Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Created On</th>
                                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Actions</span></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                {user.i9Records.length > 0 ? user.i9Records.map((record) => (
                                    <tr key={record.id} className="dark:hover:bg-slate-700/50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900 dark:text-slate-100">{record.employee_name || 'N/A'}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm"><StatusBadge status={record.status} /></td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">{new Date(record.created_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => onViewI9Record(record)} className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                                                {getActionText(record.status)}
                                            </button>
                                        </td>
                                    </tr>
                                )) : (
                                     <tr>
                                        <td colSpan={4} className="text-center py-12 text-slate-500 dark:text-slate-400">
                                            You haven't started any I-9 forms yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
             </div>
        </div>
    );
};

// Dummy icons for StatCard
const PencilIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);
const EyeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);


export default I9CompliancePage;