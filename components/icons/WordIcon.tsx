
import React from 'react';

const WordIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2H12v2.5A1.5 1.5 0 0 0 13.5 6H16v2.5A1.5 1.5 0 0 0 17.5 10H20v9.5a1.5 1.5 0 0 1-1.5 1.5H3.5A1.5 1.5 0 0 1 2 19.5v-16zM13 2.29V5h2.71L13 2.29zM8 12v5h2v-2.5l2 2.5v-5h-2v2.5l-2-2.5H8z"/>
    </svg>
);

export default WordIcon;
