
import React from 'react';
import { DISCLAIMER } from '../constants';
import { Page } from '../types';

interface DisclaimerBannerProps {
  onNavigate: (page: Page) => void;
}

const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-800 dark:bg-black text-white p-2 text-center z-30">
      <p className="text-xs">
        <strong>Disclaimer:</strong> {DISCLAIMER}{' '}
        <button onClick={() => onNavigate('disclaimer')} className="underline hover:text-blue-300">Read More</button>
      </p>
    </div>
  );
};

export default DisclaimerBanner;