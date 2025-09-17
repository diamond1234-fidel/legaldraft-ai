import React, { useState } from 'react';
import { ResearchResults } from '../types';

interface LegalResearchResultsProps {
  results: ResearchResults;
  onNewSearch: () => void;
}

type Tab = 'profile' | 'image' | 'filings' | 'kyc';

const LegalResearchResults: React.FC<LegalResearchResultsProps> = ({ results, onNewSearch }) => {
    const availableTabs: Tab[] = [];
    if (results.publicProfile) availableTabs.push('profile');
    if (results.imageResults) availableTabs.push('image');
    if (results.courtFilings) availableTabs.push('filings');
    if (results.kyc) availableTabs.push('kyc');
    
    const [activeTab, setActiveTab] = useState<Tab>(availableTabs[0] || 'profile');

    const handleExport = () => {
        // In a real app, this would generate a PDF. Here we just print.
        alert("Generating PDF report... (This is a placeholder)");
        window.print();
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200">Research Results</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm">Found {availableTabs.length} data source(s).</p>
                </div>
                <div className="flex-shrink-0 flex items-center space-x-2">
                    <button onClick={handleExport} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600">
                        Export to PDF
                    </button>
                     <button onClick={onNewSearch} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        New Search
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="border-b border-slate-200 dark:border-slate-700">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {availableTabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm capitalize ${
                                activeTab === tab
                                ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:border-slate-500'
                            }`}
                        >
                            {tab === 'image' ? 'Image Matches' : tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            {/* Tab Content */}
            <div className="pt-4">
                {activeTab === 'profile' && results.publicProfile && <ProfileResults data={results.publicProfile} />}
                {activeTab === 'image' && results.imageResults && <ImageResults data={results.imageResults} />}
                {activeTab === 'filings' && results.courtFilings && <FilingsResults data={results.courtFilings} />}
                {activeTab === 'kyc' && results.kyc && <KycResults data={results.kyc} />}
            </div>
        </div>
    );
};

const ProfileResults: React.FC<{data: NonNullable<ResearchResults['publicProfile']>}> = ({data}) => (
    <div className="space-y-4">
        <ResultCard title="Public Profile Enrichment">
            <InfoRow label="Full Name" value={data.fullName} />
            <InfoRow label="Title" value={data.title} />
            <InfoRow label="Company" value={data.company} />
            <InfoRow label="Location" value={data.location} />
            <InfoRow label="LinkedIn" value={<a href={data.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.linkedinUrl}</a>} />
            <InfoRow label="Company Domain" value={<a href={`https://${data.companyDomain}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{data.companyDomain}</a>} />
        </ResultCard>
    </div>
);

const ImageResults: React.FC<{data: NonNullable<ResearchResults['imageResults']>}> = ({data}) => (
    <div className="space-y-4">
         <p className="text-sm text-slate-500 dark:text-slate-400">Disclaimer: This does not identify individuals, only shows where this image appears online.</p>
        {data.map((item, index) => (
             <ResultCard key={index} title={`Match ${index + 1}: ${item.source}`}>
                <div className="flex items-start space-x-4">
                    <img src={item.thumbnailUrl} alt="Thumbnail match" className="w-24 h-24 object-cover rounded-md flex-shrink-0" />
                    <div>
                        <p className="font-semibold text-slate-700 dark:text-slate-300">{item.snippet}</p>
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline text-sm truncate block">{item.url}</a>
                    </div>
                </div>
            </ResultCard>
        ))}
    </div>
);

const FilingsResults: React.FC<{data: NonNullable<ResearchResults['courtFilings']>}> = ({data}) => (
    <div className="space-y-4">
       {data.map((item) => (
            <ResultCard key={item.docketNumber} title="Court Filing Match">
                <InfoRow label="Case Title" value={item.caseTitle} />
                <InfoRow label="Docket #" value={item.docketNumber} />
                <InfoRow label="Jurisdiction" value={item.jurisdiction} />
                <InfoRow label="Link" value={<a href={item.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Docket (External)</a>} />
            </ResultCard>
        ))}
    </div>
);

const KycResults: React.FC<{data: NonNullable<ResearchResults['kyc']>}> = ({data}) => (
    <div>
        <ResultCard title="KYC Verification Status">
             <div className="flex items-center space-x-3">
                 <span className={`px-3 py-1 rounded-full text-lg font-bold ${data.status === 'verified' ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-300' : 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-300'}`}>
                    {data.status.charAt(0).toUpperCase() + data.status.slice(1)}
                 </span>
                 <p className="text-slate-600 dark:text-slate-400">Identity verification complete.</p>
            </div>
            <div className="mt-4 border-t border-slate-200 dark:border-slate-700 pt-4">
                <InfoRow label="Verification ID" value={data.verificationId} />
                <InfoRow label="Checked At" value={new Date(data.checkedAt).toLocaleString()} />
            </div>
        </ResultCard>
    </div>
);

const ResultCard: React.FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
    <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">{title}</h3>
        {children}
    </div>
);

const InfoRow: React.FC<{label: string; value: React.ReactNode}> = ({label, value}) => (
    <div className="grid grid-cols-3 gap-4 text-sm py-1">
        <dt className="font-medium text-slate-500 dark:text-slate-400">{label}</dt>
        <dd className="col-span-2 text-slate-800 dark:text-slate-200">{value}</dd>
    </div>
);


export default LegalResearchResults;