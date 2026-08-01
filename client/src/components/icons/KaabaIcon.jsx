import React from 'react';

const KaabaIcon = ({ className = '', ...props }) => {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="1.5" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
      {...props}
    >
      <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
      <path d="M3 21h18" />
      <path d="M5 8h14" />
      <path d="M5 12h14" />
      <path d="M10 8v4" />
      <path d="M14 8v4" />
    </svg>
  );
};

export default KaabaIcon;
