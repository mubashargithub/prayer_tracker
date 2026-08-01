import React from 'react';
import Card from '../../../components/common/Card';

const ProfileSkeleton = () => {
  return (
    <div className="space-y-8 animate-pulse max-w-5xl mx-auto pb-12">
      {/* Header Skeleton */}
      <Card className="p-8 relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 dark:bg-charcoal-border rounded-full flex-shrink-0"></div>
          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="h-8 w-48 bg-gray-200 dark:bg-charcoal-border rounded mx-auto md:mx-0"></div>
            <div className="h-4 w-32 bg-gray-100 dark:bg-charcoal-surface rounded mx-auto md:mx-0"></div>
            <div className="h-4 w-64 bg-gray-100 dark:bg-charcoal-surface rounded mx-auto md:mx-0 mt-4"></div>
          </div>
        </div>
      </Card>

      {/* Layout Skeleton */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Skeleton */}
        <div className="w-full md:w-64 flex-shrink-0 flex md:flex-col overflow-x-auto gap-2">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-12 w-32 md:w-full bg-gray-200 dark:bg-charcoal-border rounded-xl flex-shrink-0"></div>
          ))}
        </div>

        {/* Content Skeleton */}
        <div className="flex-1 bg-white dark:bg-charcoal-base rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-charcoal-border">
          <div className="h-6 w-40 bg-gray-200 dark:bg-charcoal-border rounded mb-8"></div>
          <div className="space-y-6">
            <div>
              <div className="h-4 w-24 bg-gray-100 dark:bg-charcoal-surface rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-charcoal-border rounded-xl"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-100 dark:bg-charcoal-surface rounded mb-2"></div>
              <div className="h-10 w-full bg-gray-200 dark:bg-charcoal-border rounded-xl"></div>
            </div>
            <div>
              <div className="h-4 w-24 bg-gray-100 dark:bg-charcoal-surface rounded mb-2"></div>
              <div className="h-24 w-full bg-gray-200 dark:bg-charcoal-border rounded-xl"></div>
            </div>
            <div className="h-10 w-32 bg-gray-300 dark:bg-charcoal-border rounded-xl ml-auto mt-4"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
