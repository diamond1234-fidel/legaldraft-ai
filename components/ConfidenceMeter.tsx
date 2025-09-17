import React from 'react';

interface ConfidenceMeterProps {
  score: number;
  outcome: 'Likely to be Granted' | 'Likely to be Denied' | 'Uncertain';
}

const ConfidenceMeter: React.FC<ConfidenceMeterProps> = ({ score, outcome }) => {
  const getColor = () => {
    if (outcome === 'Uncertain') return 'bg-slate-400';
    if (score >= 75) return 'bg-green-500';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const outcomeConfig = {
    'Likely to be Granted': 'text-green-600 dark:text-green-400',
    'Likely to be Denied': 'text-red-600 dark:text-red-400',
    'Uncertain': 'text-slate-500 dark:text-slate-400',
  };

  return (
    <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-700">
        <p className={`text-2xl font-bold ${outcomeConfig[outcome]}`}>{outcome}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">AI Confidence Score</p>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4">
            <div
                className={`h-4 rounded-full transition-all duration-500 ${getColor()}`}
                style={{ width: `${score}%` }}
            ></div>
        </div>
        <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-2">{score}%</p>
    </div>
  );
};

export default ConfidenceMeter;