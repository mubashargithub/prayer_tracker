import React from 'react';

const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'h-6 w-6 border-2',
    md: 'h-10 w-10 border-3',
    lg: 'h-16 w-16 border-4',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-t-emerald-600 border-r-transparent border-b-transparent border-l-transparent ${sizes[size]}`}></div>
    </div>
  );
};

export default LoadingSpinner;
