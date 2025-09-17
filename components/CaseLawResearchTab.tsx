import React, { useState, useEffect } from 'react';
import { JURISDICTIONS, PRACTICE_AREAS } from '../constants';
import { performLegalResearch } from '../services/geminiService';
import { LegalResearchResult, Tables } from '../types';
import ErrorAlert from './ErrorAlert';
import SearchIcon from './icons/SearchIcon';
import StrengthMeter from './StrengthMeter';
import BookmarkIcon from './icons/BookmarkIcon';
import ScaleIcon from './icons/ScaleIcon';
import { supabase } from '../services/supabaseClient';

const LoadingState: React.FC = () => {
    const messages = [
        "Searching federal and state databases...",
        "Identifying relevant precedents...",
        "Analyzing case text with AI...",
        "Synthesizing legal arguments...",
        "Compiling your research memo..."
    ];
    const [message, setMessage] = useState(messages[0]);

    React.useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500);
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[400px]">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Performing AI Research...</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{message}</p>
        </div>
    );
};

type SavedQuery = Tables<'saved_queries'>;

const CaseLawResearchTab: React.FC = () => {
    const [query, setQuery] = useState('');
    const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<LegalResearchResult | null>(null);
    const [savedQueries, setSavedQueries] = useState<SavedQuery[]>([]);
    const [lastSearchedQuery, setLastSearchedQuery] = useState<{ query: string; jurisdiction: string } | null>(null);

    useEffect(() => {
        const fetchQueries = async () => {
            // FIX: Use the asynchronous `getUser()` method for Supabase v2.
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('saved_queries')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('created_at', { ascending: false });
                if (error) {
                    console.error('Error fetching saved queries:', error.message);
                } else {
                    setSavedQueries(data || []);
                }
            }
        };
        fetchQueries();
    }, []);

    const executeSearch = async (searchQuery: string, searchJurisdiction: string) => {
        if (!searchQuery.trim()) return;

        setIsLoading(true);
        setError(null);
        setResults(null);
        setLastSearchedQuery({ query: searchQuery, jurisdiction: searchJurisdiction });
        try {
            const res = await performLegalResearch(searchQuery, searchJurisdiction);
            setResults(res);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeSearch(query, jurisdiction);
    };
    
    const handlePracticeAreaClick = (areaLabel: string) => {
        const newQuery = `Key principles and landmark cases in ${areaLabel}`;
        setQuery(newQuery); // Update the UI to reflect the new query
        executeSearch(newQuery, jurisdiction);
    };

    const handleSaveSearch = async () => {
        const name = prompt("Enter a name for this search:");
        if (name && lastSearchedQuery) {
            // FIX: Use the asynchronous `getUser()` method for Supabase v2.
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                alert("You must be logged in to save a search.");
                return;
            }

            const newSavedQuery = {
                name,
                query: lastSearchedQuery.query,
                jurisdiction: lastSearchedQuery.jurisdiction,
                user_id: user.id,
            };

            const { data, error } = await supabase.from('saved_queries').insert(newSavedQuery).select().single();
            
            if (error) {
                alert(`Failed to save search: ${error.message}`);
            } else if (data) {
                setSavedQueries(prev => [data, ...prev]);
                alert(`Search "${name}" saved!`);
            }
        }
    };
    
    const handleLoadQuery = (savedQuery: SavedQuery) => {
        setQuery(savedQuery.query);
        setJurisdiction(savedQuery.jurisdiction);
    };

    const handleDeleteQuery = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this saved search?")) {
            const { error } = await supabase.from('saved_queries').delete().eq('id', id);
            if (error) {
                alert(`Failed to delete search: ${error.message}`);
            } else {
                setSavedQueries(prev => prev.filter(q => q.id !== id));
            }
        }
    };
    
    if (isLoading) {
        return <LoadingState />;
    }
    
    if (error) {
         return (
            <div className="p-4">
                <ErrorAlert message={error} title="Research Failed" />
                <button onClick={() => { setError(null); setIsLoading(false); }} className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                    Try New Search
                </button>
            </div>
        );
    }

    if (results) {
        return <ResultsDisplay results={results} onNewSearch={() => setResults(null)} onSaveSearch={handleSaveSearch} />;
    }

    return (
        <div className="py-8">
            <h2 className="text-2xl font-bold text-center text-slate-700 dark:text-slate-200">AI Case Law Assistant</h2>
            <p className="text-slate-500 dark:text-slate-400 text-center mt-1 max-w-2xl mx-auto">Enter a legal query to find relevant case law, get AI-powered summaries, and assess argument strength.</p>
            <form onSubmit={handleFormSubmit} className="mt-8 max-w-3xl mx-auto space-y-4">
                 <div>
                    <label htmlFor="legal-query" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Legal Query</label>
                    <textarea 
                        id="legal-query" 
                        rows={3}
                        value={query} 
                        onChange={e => setQuery(e.target.value)} 
                        className="w-full input-field"
                        placeholder="e.g., Standard for summary judgment in employment discrimination cases in California"
                    />
                </div>
                <div>
                    <label htmlFor="jurisdiction" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">Jurisdiction</label>
                    <select id="jurisdiction" value={jurisdiction} onChange={e => setJurisdiction(e.target.value)} className="w-full input-field">
                        {JURISDICTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
                <button type="submit" disabled={isLoading || !query.trim()} className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400">
                    <SearchIcon className="w-5 h-5 mr-2" />
                    {isLoading ? 'Researching...' : 'Perform AI Research'}
                </button>
            </form>
            <div className="mt-8 max-w-3xl mx-auto">
                <div className="relative flex py-2 items-center"><div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div><span className="flex-shrink mx-4 text-slate-400 dark:text-slate-500 text-sm">Or</span><div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div></div>
                <h3 className="text-lg font-bold text-center text-slate-700 dark:text-slate-200">Browse by Practice Area</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                    {PRACTICE_AREAS.filter(p => p.value !== 'other').map(area => (
                        <button 
                            key={area.value} 
                            onClick={() => handlePracticeAreaClick(area.label)} 
                            className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-sm hover:border-blue-500 hover:ring-1 hover:ring-blue-500 dark:hover:border-blue-400 transition-all text-center"
                        >
                            <ScaleIcon className="w-8 h-8 mx-auto mb-2 text-blue-500 dark:text-blue-400"/>
                            <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">{area.label}</span>
                        </button>
                    ))}
                </div>
            </div>
            <SavedQueriesList queries={savedQueries} onLoad={handleLoadQuery} onDelete={handleDeleteQuery} />
        </div>
    );
};

const SavedQueriesList: React.FC<{
    queries: SavedQuery[];
    onLoad: (query: SavedQuery) => void;
    onDelete: (id: string) => void;
}> = ({ queries, onLoad, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (queries.length === 0) {
        return (
             <div className="mt-8 text-center text-sm text-slate-400 dark:text-slate-500 max-w-3xl mx-auto">
                <p>Save complex searches for easy access later.</p>
            </div>
        );
    }
    return (
        <div className="mt-8 max-w-3xl mx-auto">
            <button onClick={() => setIsExpanded(!isExpanded)} className="w-full flex justify-between items-center text-left p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-700/50">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">Saved Searches ({queries.length})</h3>
                <svg className={`w-5 h-5 text-slate-500 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            {isExpanded && (
                <ul className="space-y-2 mt-2">
                    {queries.map(q => (
                        <li key={q.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-100 dark:bg-slate-900/50 rounded-lg border border-slate-200 dark:border-slate-700">
                            <div className="flex-1 mb-2 sm:mb-0 mr-4">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{q.name}</p>
                                <p className="text-xs text-slate-500 dark:text-slate-400 italic truncate max-w-md">"{q.query}"</p>
                            </div>
                            <div className="flex gap-2 self-end sm:self-center flex-shrink-0">
                                <button onClick={() => onLoad(q)} className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 dark:bg-blue-900/50 dark:text-blue-200 rounded-md hover:bg-blue-200">Load</button>
                                <button onClick={() => onDelete(q.id)} className="px-3 py-1 text-xs font-medium text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-200 rounded-md hover:bg-red-200">Delete</button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};


const ResultsDisplay: React.FC<{results: LegalResearchResult, onNewSearch: () => void, onSaveSearch: () => void}> = ({ results, onNewSearch, onSaveSearch }) => {
    const sortedCases = [...results.relevantCases].sort((a, b) => new Date(a.decisionDate).getTime() - new Date(b.decisionDate).getTime());
    
    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Research Memo</h2>
                <div className="flex gap-2">
                    <button onClick={onSaveSearch} className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-md hover:bg-slate-50 dark:hover:bg-slate-600 flex items-center">
                        <BookmarkIcon className="w-4 h-4 mr-2" />
                        Save Search
                    </button>
                    <button onClick={onNewSearch} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700">
                        Start New Search
                    </button>
                </div>
            </div>
            
            <ResultCard title="AI Summary of Law">
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{results.summary}</p>
            </ResultCard>

            <ResultCard title="Argument Strength Analysis">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    <div className="pr-4">
                        <StrengthMeter assessment={results.argumentStrength.assessment} />
                    </div>
                    <p className="text-slate-700 dark:text-slate-300">{results.argumentStrength.reasoning}</p>
                </div>
            </ResultCard>
            
            <ResultCard title="Suggested Precedents">
                <ul className="space-y-4">
                    {results.suggestedPrecedents.map(p => (
                        <li key={p.citation}>
                            <p className="font-semibold text-slate-800 dark:text-slate-100">{p.caseName} ({p.citation})</p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 italic">"{p.reasoning}"</p>
                        </li>
                    ))}
                </ul>
            </ResultCard>
            
            <div>
                 <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Case Progression Timeline ({sortedCases.length})</h3>
                 <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-700">
                    {sortedCases.map((c) => (
                        <div key={c.citation} className="mb-8 relative last:mb-0">
                             <div className="absolute -left-[33px] top-1 h-4 w-4 bg-blue-500 rounded-full border-4 border-white dark:border-slate-800"></div>
                             <p className="text-sm font-semibold text-blue-600 dark:text-blue-400 mb-1">{new Date(c.decisionDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                             <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                               <div className="flex justify-between items-start">
                                 <div>
                                    <h4 className="font-bold text-slate-800 dark:text-slate-100">{c.caseName}</h4>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">{c.citation} &bull; {c.court}</p>
                                 </div>
                                 <a href={`https://www.courtlistener.com${c.url}`} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue-600 hover:underline flex-shrink-0 ml-4">View Full Case</a>
                               </div>
                               <p className="text-sm text-slate-600 dark:text-slate-300 mt-2"><strong>AI Summary:</strong> {c.aiSummary}</p>
                               <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 bg-slate-100 dark:bg-slate-700/50 p-2 rounded-md"><strong>Snippet:</strong> {c.snippet}</p>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
        </div>
    )
}

const ResultCard: React.FC<{ title: string, children: React.ReactNode }> = ({ title, children }) => (
    <div>
        <h3 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-3">{title}</h3>
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            {children}
        </div>
    </div>
);


export default CaseLawResearchTab;
