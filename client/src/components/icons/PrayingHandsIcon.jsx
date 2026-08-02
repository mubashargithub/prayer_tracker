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
      {/* Symmetrical cupped open hands (Dua gesture) */}
      
      {/* Left Hand */}
      <path d="M11.5 17c-2 0-4-1.5-4-4.5V8.5c0-1 .8-1.5 1.5-1.5s1.5.5 1.5 1.5V11" />
      <path d="M9 11V6.5C9 5.8 9.8 5 10.5 5S12 5.8 12 6.5V11" />
      <path d="M6 13.5V10c0-.8.7-1.5 1.5-1.5" />
      <path d="M12 11.5c.5-1 1-1.5 2-1.5" />
      
      {/* Right Hand */}
      <path d="M12.5 17c2 0 4-1.5 4-4.5V8.5c0-1-.8-1.5-1.5-1.5s-1.5.5-1.5 1.5V11" />
      <path d="M15 11V6.5c0-.7-.8-1.5-1.5-1.5S12 5.8 12 6.5V11" />
      <path d="M18 13.5V10c0-.8-.7-1.5-1.5-1.5" />
      <path d="M12 11.5c-.5-1-1-1.5-2-1.5" />
      
      {/* Rays of blessing / light in Islamic Gold */}
      <path d="M12 2v2" stroke="var(--color-islamic-gold, #C19371)" strokeWidth="1.5" />
      <path d="M9 3l1 1" stroke="var(--color-islamic-gold, #C19371)" strokeWidth="1.5" />
      <path d="M15 3l-1 1" stroke="var(--color-islamic-gold, #C19371)" strokeWidth="1.5" />
    </svg>
  );
};

export default PrayingHandsIcon;
