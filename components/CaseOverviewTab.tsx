
import React from 'react';
import { Matter, Client, OpposingParty } from '../types';

interface CaseOverviewTabProps {
    matter: Matter;
    client: Client;
}

const CaseOverviewTab: React.FC<CaseOverviewTabProps> = ({ matter, client }) => {
    const opposingParties = (matter.opposing_parties as unknown as OpposingParty[]) || [];

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-4">
                <InfoCard title="Client Information">
                    <InfoRow label="Name" value={client.name} />
                    <InfoRow label="Email" value={client.email || 'N/A'} />
                    <InfoRow label="Phone" value={client.phone || 'N/A'} />
                    <InfoRow label="Type" value={client.type} />
                </InfoCard>
                <InfoCard title="Matter Details">
                    <InfoRow label="Matter Name" value={matter.matter_name} />
                    <InfoRow label="Status" value={<span className="capitalize">{matter.status}</span>} />
                    <InfoRow label="Date Opened" value={new Date(matter.created_at).toLocaleDateString()} />
                </InfoCard>
            </div>
             <div className="lg:col-span-2">
                 <InfoCard title="Opposing Parties">
                     {opposingParties.length > 0 ? (
                        <div className="space-y-4">
                            {opposingParties.map((party, index) => (
                                <div key={index} className="p-3 bg-slate-100 dark:bg-slate-700/50 rounded-md">
                                    <InfoRow label="Party Name" value={party.name} />
                                    <InfoRow label="Counsel" value={party.counsel || 'N/A'} />
                                </div>
                            ))}
                        </div>
                     ) : (
                        <p className="text-sm text-slate-500 dark:text-slate-400">No opposing parties have been added for this matter.</p>
                     )}
                 </InfoCard>
            </div>
        </div>
    );
};


const InfoCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">{title}</h3>
        <div className="space-y-2">
            {children}
        </div>
    </div>
);

const InfoRow: React.FC<{ label: string, value: React.ReactNode }> = ({ label, value }) => (
    <div className="text-sm">
        <p className="font-semibold text-slate-600 dark:text-slate-300">{label}</p>
        <p className="text-slate-800 dark:text-slate-100 break-words">{value}</p>
    </div>
);

export default CaseOverviewTab;
