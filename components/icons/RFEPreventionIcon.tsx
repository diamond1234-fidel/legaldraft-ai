import React from 'react';

const RFEPreventionIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
     <defs>
        <linearGradient id="gradGreen" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgb(74, 222, 128)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgb(34, 197, 94)', stopOpacity: 1}} />
        </linearGradient>
    </defs>
    <rect width="100" height="100" className="fill-slate-100 dark:fill-slate-800" />
    
    <g transform="translate(10, 10) scale(0.8)">
        <path d="M15,5 L75,5 L90,20 L90,95 L15,95 Z" className="fill-white dark:fill-slate-700 stroke-slate-200 dark:stroke-slate-600" strokeWidth="2" />
        <path d="M75,5 L75,20 L90,20 Z" className="fill-slate-200 dark:fill-slate-600" />
        <line x1="25" y1="35" x2="75" y2="35" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="3" />
        <line x1="25" y1="45" x2="75" y2="45" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="3" />
        <line x1="25" y1="55" x2="60" y2="55" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="3" />
        <line x1="25" y1="65" x2="70" y2="65" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="3" />
        <line x1="55" y1="42" x2="70" y2="57" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
        <line x1="70" y1="42" x2="55" y2="57" stroke="#ef4444" strokeWidth="4" strokeLinecap="round" />
    </g>

    <g transform="translate(50, 45)">
        <path d="M0 -25 L 20 0 C 20 10, 0 25, 0 25 S -20 10, -20 0 Z" fill="url(#gradGreen)" />
        <path d="M-10 0 l 8 8 l 14 -14" stroke="white" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export default RFEPreventionIcon;
