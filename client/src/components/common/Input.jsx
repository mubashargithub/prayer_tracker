import React from 'react';

const Input = ({ label, id, name, type = 'text', placeholder = '', value, onChange, error, className = '', required = false, ...props }) => {
  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-gray-100 placeholder-gray-400 bg-white dark:bg-charcoal-base transition-all ${
          error
            ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50'
            : 'border-gray-300 dark:border-charcoal-border focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
        }`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 text-left mt-0.5">{error}</span>}
    </div>
  );
};

export default Input;
