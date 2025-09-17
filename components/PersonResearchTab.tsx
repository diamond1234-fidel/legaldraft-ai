
import React, { useState } from 'react';
import { ResearchLog, ResearchParams, ResearchResults } from '../types';
import { performResearch } from '../services/researchService';
import LegalResearchForm from './LegalResearchForm';
import LegalResearchResults from './LegalResearchResults';

interface PersonResearchTabProps {
  researchLogs: ResearchLog[];
  addResearchLog: (params: ResearchParams) => void;
}

const PersonResearchTab: React.FC<PersonResearchTabProps> = ({ researchLogs, addResearchLog }) => {
  const [results, setResults] = useState<ResearchResults | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isRateLimited = () => {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentSearches = researchLogs.filter(log => new Date(log.timestamp).getTime() > oneHourAgo);
    return recentSearches.length >= 5;
  };

  const handleSearch = async (searchParams: ResearchParams) => {
    if (isRateLimited()) {
        setError("You have reached the search limit (5 per hour). Please try again later.");
        return;
    }
    setIsSearching(true);
    setError(null);
    setResults(null);
    try {
      const apiResults = await performResearch(searchParams);
      setResults(apiResults);
      addResearchLog(searchParams);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(msg);
    } finally {
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setResults(null);
    setError(null);
  };

  return (
     <div>
        <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 p-4 my-4" role="alert">
            <p className="font-bold">Disclaimer</p>
            <p className="text-sm">This tool surfaces public and third-party information for lawful professional use only. Do not use for harassment, surveillance, or any unlawful purpose.</p>
        </div>
        
        {!results && !isSearching && (
          <LegalResearchForm
            onSearch={handleSearch}
            isSearching={isSearching}
            error={error}
          />
        )}
        {isSearching && (
            <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Performing Research...</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">This may take a moment while we query third-party sources.</p>
            </div>
        )}
        {results && !isSearching && (
          <LegalResearchResults results={results} onNewSearch={handleReset} />
        )}
         {error && !isSearching && !results && (
            <div className="text-center py-4">
                 <button onClick={handleReset} className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Start a new search
                </button>
            </div>
         )}
      </div>
  );
};

export default PersonResearchTab;
