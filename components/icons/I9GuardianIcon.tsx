import React from 'react';

const I9GuardianIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" {...props}>
    <defs>
      <linearGradient id="gradShield" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: 'rgb(59, 130, 246)', stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: 'rgb(37, 99, 235)', stopOpacity: 1 }} />
      </linearGradient>
    </defs>
    <rect width="100" height="100" className="fill-slate-100 dark:fill-slate-800" />

    {/* Document Icon */}
    <g transform="translate(15, 20) scale(0.6)">
      <path d="M10,0 L70,0 L85,15 L85,90 L10,90 Z" className="fill-white dark:fill-slate-700 stroke-slate-300 dark:stroke-slate-600" strokeWidth="3" />
      <path d="M70,0 L70,15 L85,15 Z" className="fill-slate-200 dark:fill-slate-600" />
      <line x1="20" y1="30" x2="60" y2="30" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="4" />
      <line x1="20" y1="45" x2="75" y2="45" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="4" />
      <line x1="20" y1="60" x2="50" y2="60" className="stroke-slate-300 dark:stroke-slate-500" strokeWidth="4" />
    </g>

    {/* Person Icon */}
    <g transform="translate(30, 45) scale(0.35)">
      <circle cx="30" cy="20" r="12" className="fill-slate-300 dark:fill-slate-500" />
      <path d="M10,55 A 20,20 0,0,1 50,55 Z" className="fill-slate-300 dark:fill-slate-500" />
    </g>

    {/* Shield Icon */}
    <g transform="translate(65, 55) scale(0.35)">
      <path d="M0 -25 L 30 0 C 30 15, 0 40, 0 40 S -30 15, -30 0 Z" fill="url(#gradShield)" />
      <path d="M-15 0 l 10 10 l 20 -20" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </g>
  </svg>
);

export default I9GuardianIcon;