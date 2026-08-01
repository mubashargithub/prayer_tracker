import React from 'react';

const Button = ({ children, type = 'button', variant = 'primary', size = 'md', className = '', isLoading = false, disabled = false, ...props }) => {
  const baseStyle = 'inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm focus:ring-emerald-500 active:bg-emerald-800',
    secondary: 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm focus:ring-amber-500 active:bg-amber-700',
    outline: 'border border-gray-300 dark:border-charcoal-border hover:bg-gray-50 dark:hover:bg-charcoal-border text-gray-700 dark:text-gray-300 focus:ring-emerald-500',
    text: 'text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 focus:ring-emerald-500 p-0',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm md:text-base',
    lg: 'px-6 py-3 text-base md:text-lg',
  };

  return (
    <button
      type={type}
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
