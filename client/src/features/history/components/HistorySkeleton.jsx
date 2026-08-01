import React from 'react';
import Card from '../../../components/common/Card';

const HistorySkeleton = () => {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4, 5].map((i) => (
        <Card key={i} className="p-4 flex items-start space-x-4">
          <div className="w-12 h-12 bg-gray-200 dark:bg-charcoal-border rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-4 bg-gray-200 dark:bg-charcoal-border rounded w-3/4" />
            <div className="h-3 bg-gray-200 dark:bg-charcoal-border rounded w-1/2" />
          </div>
          <div className="w-16 h-6 bg-gray-200 dark:bg-charcoal-border rounded-full" />
        </Card>
      ))}
    </div>
  );
};

export default HistorySkeleton;
