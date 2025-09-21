import React from 'react';

const FormAutomationIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
        <linearGradient id="gradBlue" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: 'rgb(96, 165, 250)', stopOpacity: 1}} />
            <stop offset="100%" style={{stopColor: 'rgb(59, 130, 246)', stopOpacity: 1}} />
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
    </g>

    <g transform="translate(5, 5)">
        <path d="M60 70 l 5 15 l -15 5 l -5 -15 l 15 -5" fill="url(#gradBlue)" />
        <path d="M80 50 l 3 9 l -9 3 l -3 -9 l 9 -3" fill="url(#gradBlue)" opacity="0.8" />
        <path d="M75 85 l 2 6 l -6 2 l -2 -6 l 6 -2" fill="url(#gradBlue)" opacity="0.6" />
        <line x1="50" y1="60" x2="70" y2="40" stroke="url(#gradBlue)" strokeWidth="5" strokeLinecap="round" />
        <circle cx="70" cy="40" r="3" fill="white" />
    </g>
  </svg>
);

export default FormAutomationIcon;
