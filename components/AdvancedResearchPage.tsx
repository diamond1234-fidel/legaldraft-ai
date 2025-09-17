import React, { useState } from 'react';
import Tabs from './Tabs';
import { analyzeCaseLaw, getPersonProfile, summarizeDocket } from '../services/geminiService';
import { CaseLawAnalysisResult, PersonProfileResult, DocketSummaryResult } from '../types';
import ErrorAlert from './ErrorAlert';
import SearchIcon from './icons/SearchIcon';
import PredictiveAnalyticsTab from './PredictiveAnalyticsTab';

declare var marked: any;

const AdvancedResearchPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);

    const tabs = [
        { label: 'Case Law Analysis', content: <CaseLawAnalysisTab /> },
        { label: 'Person Profile', content: <PersonProfileTab /> },
        { label: 'Docket Summary', content: <DocketSummaryTab /> },
        { label: 'Predictive Analytics', content: <PredictiveAnalyticsTab /> },
    ];
    
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Advanced Research</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                    Leverage CourtListener data and AI for in-depth analysis of opinions, dockets, and legal figures.
                </p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
                <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
            </div>
        </div>
    );
};

const LoadingSpinner = () => (
    <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
        <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-600 dark:text-slate-300 font-medium">Fetching Data & Generating Summary...</p>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">This may take a moment.</p>
    </div>
);

// Individual Tab Components

const CaseLawAnalysisTab: React.FC = () => {
    const [id, setId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<CaseLawAnalysisResult | null>(null);

    const handleSearch = async () => {
        if (!id.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await analyzeCaseLaw(id);
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <SearchForm id={id} setId={setId} onSearch={handleSearch} isLoading={isLoading} placeholder="Enter CourtListener Opinion ID..." />
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} />}
            {result && (
                <div className="space-y-4 pt-4">
                    <ResultCard title="AI Summary"><div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(result.aiSummary) }}></div></ResultCard>
                    <ResultCard title="Opinion Details">
                        <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded-md max-w-full overflow-auto"><code>{JSON.stringify(result.opinion, null, 2)}</code></pre>
                    </ResultCard>
                    <ResultCard title={`Cited By (${result.citedOpinions.length})`}>
                         <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded-md max-w-full overflow-auto"><code>{JSON.stringify(result.citedOpinions, null, 2)}</code></pre>
                    </ResultCard>
                </div>
            )}
        </div>
    );
};

const PersonProfileTab: React.FC = () => {
    const [id, setId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<PersonProfileResult | null>(null);

     const handleSearch = async () => {
        if (!id.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await getPersonProfile(id);
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <SearchForm id={id} setId={setId} onSearch={handleSearch} isLoading={isLoading} placeholder="Enter CourtListener Person ID..." />
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} />}
            {result && (
                 <div className="space-y-4 pt-4">
                    <ResultCard title="AI Summary"><div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(result.aiSummary) }}></div></ResultCard>
                    <ResultCard title="Full Profile Data">
                        <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded-md max-w-full overflow-auto"><code>{JSON.stringify(result.profile, null, 2)}</code></pre>
                    </ResultCard>
                </div>
            )}
        </div>
    );
};

const DocketSummaryTab: React.FC = () => {
    const [id, setId] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<DocketSummaryResult | null>(null);

     const handleSearch = async () => {
        if (!id.trim()) return;
        setIsLoading(true);
        setError(null);
        setResult(null);
        try {
            const data = await summarizeDocket(id);
            setResult(data);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <SearchForm id={id} setId={setId} onSearch={handleSearch} isLoading={isLoading} placeholder="Enter CourtListener Docket ID..." />
            {isLoading && <LoadingSpinner />}
            {error && <ErrorAlert message={error} />}
            {result && (
                 <div className="space-y-4 pt-4">
                    <ResultCard title="AI Summary"><div className="prose prose-slate dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: marked.parse(result.aiSummary) }}></div></ResultCard>
                    <ResultCard title="Docket Details">
                        <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded-md max-w-full overflow-auto"><code>{JSON.stringify(result.docket, null, 2)}</code></pre>
                    </ResultCard>
                     <ResultCard title={`Recent Entries (${result.entries.length})`}>
                         <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-2 rounded-md max-w-full overflow-auto"><code>{JSON.stringify(result.entries, null, 2)}</code></pre>
                    </ResultCard>
                </div>
            )}
        </div>
    );
};

const SearchForm: React.FC<{id: string, setId: (s:string) => void, onSearch: () => void, isLoading: boolean, placeholder: string}> = ({ id, setId, onSearch, isLoading, placeholder }) => (
    <form onSubmit={(e) => { e.preventDefault(); onSearch(); }} className="flex gap-2">
        <input 
            type="text" 
            value={id} 
            onChange={e => setId(e.target.value)} 
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition duration-150" 
            placeholder={placeholder} 
            required 
        />
        <button type="submit" disabled={isLoading} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-slate-400 flex-shrink-0 flex items-center">
            <SearchIcon className="w-5 h-5 mr-2" />
            {isLoading ? 'Searching...' : 'Search'}
        </button>
    </form>
);

const ResultCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-2">{title}</h3>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            {children}
        </div>
    </div>
);

export default AdvancedResearchPage;