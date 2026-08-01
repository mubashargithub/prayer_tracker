import React from 'react';
import Card from '../../../components/common/Card';
import { Target, Flame, CalendarDays } from 'lucide-react';

const HistoryStatsSummary = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-5 flex items-center space-x-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white border-none shadow-md">
        <div className="p-3 bg-white/20 rounded-xl">
          <Target className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-emerald-100 font-medium text-sm">Overall Completion</p>
          <h3 className="text-2xl font-bold">{summary.overallCompletionRate}%</h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center space-x-4">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-xl">
          <Flame className="w-6 h-6 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Best Streak</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{summary.bestStreak} days</h3>
        </div>
      </Card>

      <Card className="p-5 flex items-center space-x-4">
        <div className="p-3 bg-blue-100 dark:bg-blue-900/40 rounded-xl">
          <CalendarDays className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Total Tracked Days</p>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{summary.totalDaysTracked}</h3>
        </div>
      </Card>
    </div>
  );
};

export default HistoryStatsSummary;
