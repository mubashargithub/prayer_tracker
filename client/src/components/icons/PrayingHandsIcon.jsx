import React from 'react';

const PrayingHandsIcon = ({ className = '', ...props }) => {
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
      <path d="M12 18c-3.3 0-6-2.7-6-6V7c0-1.1.9-2 2-2s2 .9 2 2v5" />
      <path d="M12 18c3.3 0 6-2.7 6-6V7c0-1.1-.9-2-2-2s-2 .9-2 2v5" />
      <path d="M12 18v4" />
      <path d="M8 22h8" />
    </svg>
  );
};

export default PrayingHandsIcon;
