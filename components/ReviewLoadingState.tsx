import React, { useState, useEffect } from 'react';

interface ReviewLoadingStateProps {
    progress?: { processed: number; total: number; currentFile: string; } | null;
    ocrProgress?: { status: string; progress: number } | null;
}

const ReviewLoadingState: React.FC<ReviewLoadingStateProps> = ({ progress, ocrProgress }) => {
    const messages = [
        "Analyzing contract structure...",
        "Identifying key clauses and terms...",
        "Scanning for potential risks and ambiguities...",
        "Cross-referencing with jurisdiction-specific laws...",
        "Compiling the final analysis report...",
        "This can take over a minute for large documents. Please wait."
    ];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        if (ocrProgress || progress) return; // Don't cycle messages if specific progress is shown
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500); // Change message every 2.5 seconds
        return () => clearInterval(intervalId);
    }, [ocrProgress, progress]);

    if (ocrProgress) {
        const progressPercentage = (ocrProgress.progress * 100).toFixed(0);
        const statusText = ocrProgress.status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        return (
             <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
                <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-600 dark:text-slate-300 font-medium">Extracting Text from Image...</p>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{statusText}</p>
                 <div className="w-full max-w-md bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-width duration-300" style={{ width: `${progressPercentage}%` }}></div>
                </div>
                 <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-xs text-yellow-800 dark:text-yellow-300 w-full max-w-md">
                    <strong>Please be patient:</strong> High-resolution images can take some time to process. Please do not close or refresh this window.
                </div>
            </div>
        )
    }

    const title = progress ? `Analyzing File ${progress.processed} of ${progress.total}...` : 'Performing In-Depth AI Analysis...';
    const subtitle = progress ? progress.currentFile : message;

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">{title}</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 truncate max-w-full px-4">{subtitle}</p>
            {progress && progress.total > 0 && (
                <div className="w-full max-w-md bg-slate-200 dark:bg-slate-700 rounded-full h-2.5 mt-4">
                    <div className="bg-blue-600 h-2.5 rounded-full transition-width duration-300" style={{ width: `${(progress.processed / progress.total) * 100}%` }}></div>
                </div>
            )}
            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-xs text-yellow-800 dark:text-yellow-300 w-full max-w-md">
                <strong>Please be patient:</strong> Analysis of large or complex documents can take several minutes. Please do not close or refresh this window.
            </div>
        </div>
    );
};

export default ReviewLoadingState;