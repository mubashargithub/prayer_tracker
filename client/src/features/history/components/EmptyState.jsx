import React from 'react';
import { History } from 'lucide-react';

const EmptyState = ({ isFilterState, clearFilters }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-20 h-20 bg-gray-100 dark:bg-charcoal-border rounded-full flex items-center justify-center mb-4">
        <History className="w-10 h-10 text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {isFilterState ? 'No matches found' : 'No history yet'}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
        {isFilterState 
          ? 'Try adjusting your filters or date range to find what you are looking for.' 
          : 'Your prayer and dua logs will appear here once you start tracking them on the Dashboard.'}
      </p>
      {isFilterState && (
        <button 
          onClick={clearFilters}
          className="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default EmptyState;
