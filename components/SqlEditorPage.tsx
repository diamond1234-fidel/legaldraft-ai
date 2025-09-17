import React, { useState } from 'react';
import { supabase } from '../services/supabaseClient';
import ErrorAlert from './ErrorAlert';
import DatabaseIcon from './icons/DatabaseIcon';

const SqlEditorPage: React.FC = () => {
    const [query, setQuery] = useState('SELECT id, name, email, type FROM clients LIMIT 10;');
    const [results, setResults] = useState<any[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRunQuery = async () => {
        setIsLoading(true);
        setError(null);
        setResults(null);
        try {
            const { data, error: functionError } = await supabase.functions.invoke('execute-sql', {
                body: { query },
            });

            if (functionError) throw functionError;
            if (data.error) throw new Error(data.error);
            
            setResults(data);

        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const renderValue = (value: any) => {
        if (value === null) return <span className="text-slate-400 italic">NULL</span>;
        if (typeof value === 'object') return <pre className="text-xs bg-slate-100 dark:bg-slate-700 p-1 rounded-md max-w-xs overflow-auto"><code>{JSON.stringify(value, null, 2)}</code></pre>;
        return String(value);
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">SQL Editor</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">Run read-only `SELECT` queries against the database.</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 space-y-4">
                <div>
                    <label htmlFor="sql-query" className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">SQL Query</label>
                    <textarea 
                        id="sql-query"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        rows={6}
                        className="w-full p-3 font-mono text-sm border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                        placeholder="SELECT * FROM documents;"
                    />
                </div>
                <button
                    onClick={handleRunQuery}
                    disabled={isLoading}
                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-md shadow-sm hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                    {isLoading ? 'Running...' : 'Run Query'}
                </button>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 min-h-[300px]">
                <h2 className="text-xl font-bold text-slate-700 dark:text-slate-200 mb-4">Results</h2>
                {isLoading && (
                     <div className="flex items-center justify-center h-full p-8">
                        <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin"></div>
                    </div>
                )}
                {error && <ErrorAlert message={error} title="Query Failed" />}
                {results && (
                    results.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
                                <thead className="bg-slate-50 dark:bg-slate-700/50">
                                    <tr>
                                        {Object.keys(results[0]).map(header => (
                                            <th key={header} className="px-4 py-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                                    {results.map((row, rowIndex) => (
                                        <tr key={rowIndex}>
                                            {Object.values(row).map((cell, cellIndex) => (
                                                <td key={cellIndex} className="px-4 py-3 whitespace-nowrap text-sm text-slate-700 dark:text-slate-300">{renderValue(cell)}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center text-slate-500 dark:text-slate-400 p-8">
                            <p>Query executed successfully, but returned no rows.</p>
                        </div>
                    )
                )}
                 {!results && !isLoading && !error && (
                    <div className="text-center text-slate-500 dark:text-slate-400 p-8 flex flex-col items-center">
                        <DatabaseIcon className="w-12 h-12 text-slate-400 mb-2" />
                        <p>Your query results will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SqlEditorPage;
