import React from 'react';
import Card from '../../../components/common/Card';

const DashboardSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Daily Focus Skeleton */}
      <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-charcoal-surface ring-1 ring-inset ring-gray-100 dark:ring-white/5 p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="flex-1 w-full">
            <div className="h-4 w-24 bg-emerald-100 dark:bg-emerald-900/40 rounded mb-4"></div>
            <div className="h-10 w-3/4 bg-gray-200 dark:bg-charcoal-border rounded mb-6"></div>
            <div className="h-4 w-full max-w-lg bg-gray-100 dark:bg-charcoal-surface rounded mb-2"></div>
            <div className="h-4 w-2/3 max-w-sm bg-gray-100 dark:bg-charcoal-surface rounded"></div>
          </div>
          <div className="flex gap-4 self-stretch md:self-auto w-full md:w-auto">
            <div className="flex-1 md:flex-none h-24 w-full md:w-28 bg-gray-100 dark:bg-charcoal-surface rounded-2xl"></div>
            <div className="flex-1 md:flex-none h-24 w-full md:w-28 bg-gray-100 dark:bg-charcoal-surface rounded-2xl"></div>
          </div>
        </div>
      </div>

      {/* Heatmap Skeleton */}
      <Card className="p-6">
        <div className="h-6 w-40 bg-gray-200 dark:bg-charcoal-border rounded mb-6"></div>
        <div className="grid grid-cols-12 gap-2 h-48 bg-gray-50 dark:bg-charcoal-surface rounded-xl">
          {/* Mock grid cells for skeleton */}
        </div>
      </Card>

      {/* Chart Skeleton */}
      <Card className="p-6">
        <div className="h-6 w-40 bg-gray-200 dark:bg-charcoal-border rounded mb-6"></div>
        <div className="h-72 w-full bg-gray-50 dark:bg-charcoal-surface rounded-xl"></div>
      </Card>
    </div>
  );
};

export default DashboardSkeleton;
