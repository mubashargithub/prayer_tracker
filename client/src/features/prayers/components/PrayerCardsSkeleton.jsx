import React from 'react';

const PrayerCardsSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-pulse">
      {[1, 2, 3, 4, 5].map(i => (
        <div key={i} className="p-4 md:p-6 rounded-2xl border-2 border-gray-100 dark:border-charcoal-border bg-white dark:bg-charcoal-base flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gray-200 dark:bg-charcoal-border rounded-full"></div>
            <div>
              <div className="w-20 h-5 bg-gray-200 dark:bg-charcoal-border rounded mb-2"></div>
              <div className="w-14 h-3 bg-gray-100 dark:bg-charcoal-surface rounded"></div>
            </div>
          </div>
          <div className="w-12 h-12 sm:w-11 sm:h-11 bg-gray-200 dark:bg-charcoal-border rounded-full"></div>
        </div>
      ))}
    </div>
  );
};

export default PrayerCardsSkeleton;
