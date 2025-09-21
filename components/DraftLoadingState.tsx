import React, { useState, useEffect } from 'react';

const DraftLoadingState: React.FC = () => {
    const messages = [
        "Building legal framework...",
        "Incorporating state-specific clauses...",
        "Customizing party details...",
        "Formatting document for clarity...",
        "Finalizing the draft..."
    ];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        let index = 0;
        const intervalId = setInterval(() => {
            index = (index + 1) % messages.length;
            setMessage(messages[index]);
        }, 2500); // Change message every 2.5 seconds
        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8 min-h-[300px]">
            <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
            <p className="text-slate-600 dark:text-slate-300 font-medium">Drafting Your Document...</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{message}</p>
            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-700/50 rounded-lg text-xs text-yellow-800 dark:text-yellow-300 w-full max-w-md">
                <strong>Please be patient:</strong> Drafting complex legal documents can take several minutes. Please do not close or refresh this window.
            </div>
        </div>
    );
};

export default DraftLoadingState;