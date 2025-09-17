
import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8">
      <div className="w-12 h-12 border-4 border-t-blue-500 border-slate-200 dark:border-slate-600 rounded-full animate-spin mb-4"></div>
      <p className="text-slate-600 dark:text-slate-300 font-medium">Generating Document...</p>
      <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">This may take a moment. The AI is drafting your document.</p>
    </div>
  );
};

export default LoadingSpinner;