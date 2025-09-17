import React from 'react';

const BillingIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h6m3-5.25h6m-6 2.25h6M3 12l6.03 6.03m0 0 6.03-6.03M9.03 18.03l-6.03-6.03" />
  </svg>
);

export default BillingIcon;
