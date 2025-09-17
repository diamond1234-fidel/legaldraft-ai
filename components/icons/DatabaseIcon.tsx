import React from 'react';

const DatabaseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l7.5-7.5 7.5 7.5m-15 6l7.5-7.5 7.5 7.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 6v12m15-12v12" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12h15" />
  </svg>
);

export default DatabaseIcon;
