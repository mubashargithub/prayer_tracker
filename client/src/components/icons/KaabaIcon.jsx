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
      {/* Kaaba Cube Outline */}
      {/* Top Face */}
      <polygon points="12,3 21,7.5 12,12 3,7.5" stroke="currentColor" fill="none" />
      {/* Left Face */}
      <polygon points="3,7.5 12,12 12,21 3,16.5" stroke="currentColor" fill="none" />
      {/* Right Face */}
      <polygon points="12,12 21,7.5 21,16.5 12,21" stroke="currentColor" fill="none" />
      
      {/* Kiswa (Gold Belt) */}
      <path d="M3 10.5 L12 15 M12 15 L21 10.5" stroke="var(--color-islamic-gold, #C19371)" strokeWidth="1.5" />
      
      {/* Door of the Kaaba */}
      <polygon points="15,18 15,14.5 17,13.5 17,17" stroke="var(--color-islamic-gold, #C19371)" fill="var(--color-islamic-gold, #C19371)" fillOpacity="0.2" strokeWidth="1" />
    </svg>
  );
};

export default KaabaIcon;
