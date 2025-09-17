
import React from 'react';

interface StrengthMeterProps {
  assessment: 'Strong' | 'Moderate' | 'Weak' | 'Uncertain';
}

const StrengthMeter: React.FC<StrengthMeterProps> = ({ assessment }) => {
  const strengthConfig = {
    Strong: {
      color: 'bg-green-500',
      textColor: 'text-green-600 dark:text-green-400',
      width: '100%',
      label: 'Strong',
    },
    Moderate: {
      color: 'bg-yellow-500',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      width: '66%',
      label: 'Moderate',
    },
    Weak: {
      color: 'bg-red-500',
      textColor: 'text-red-600 dark:text-red-400',
      width: '33%',
      label: 'Weak',
    },
    Uncertain: {
      color: 'bg-slate-400',
      textColor: 'text-slate-500 dark:text-slate-400',
      width: '50%',
      label: 'Uncertain',
    },
  };

  const config = strengthConfig[assessment] || strengthConfig.Uncertain;

  return (
    <div className="w-full">
        <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">Argument Strength</span>
            <span className={`text-sm font-bold ${config.textColor}`}>{config.label}</span>
        </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${config.color}`}
          style={{ width: config.width }}
        ></div>
      </div>
    </div>
  );
};

export default StrengthMeter;
