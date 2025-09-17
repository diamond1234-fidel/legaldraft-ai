import React from 'react';

const PaletteIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 0 0 5.304 0l6.401-6.402a3.75 3.75 0 0 0-.615-5.898L8.387 3.79a3.75 3.75 0 0 0-5.3 5.3l1.01 1.01" />
    <path strokeLinecap="round" strokeLinejoin="round" d="m15 12-6.402 6.402a3.75 3.75 0 0 0 5.304 0l3.19-3.19-3.19-3.19a.75.75 0 0 0-1.06 0l-1.06 1.06Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25A2.25 2.25 0 0 1 17.25 12a2.25 2.25 0 0 1 2.25-2.25" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 6.75A2.25 2.25 0 0 1 14.25 4.5a2.25 2.25 0 0 1 2.25-2.25" />
  </svg>
);

export default PaletteIcon;