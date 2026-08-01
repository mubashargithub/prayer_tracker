import React from 'react';

const Card = ({ children, className = '', ...props }) => {
  return (
    <div className={`bg-white dark:bg-charcoal-surface rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] ring-1 ring-inset ring-gray-100 dark:ring-white/5 transition-colors duration-300 p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
