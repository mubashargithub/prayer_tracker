import React from 'react';
import Card from '../../../components/common/Card';
import { Flame, CalendarOff } from 'lucide-react';
import { format } from 'date-fns';

const StreakHistoryList = ({ streaks }) => {
  if (!streaks || streaks.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 dark:bg-charcoal-border rounded-full flex items-center justify-center mx-auto mb-4">
          <CalendarOff className="w-8 h-8 text-gray-400" />
        </div>
        <h4 className="font-bold text-gray-900 dark:text-white">No streaks yet</h4>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Complete all 5 prayers in a day to start your first streak!</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Streak History</h3>
      <div className="space-y-4">
        {streaks.map((streak, idx) => {
          const isCurrent = idx === 0 && new Date() - new Date(streak.end) < 48 * 60 * 60 * 1000;
          
          return (
            <div key={idx} className={`p-4 rounded-xl border flex items-center justify-between ${
              isCurrent 
                ? 'bg-amber-50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800/50' 
                : 'bg-gray-50 dark:bg-charcoal-surface border-gray-100 dark:border-charcoal-border'
            }`}>
              
              <div className="flex items-center space-x-4">
                <div className={`p-3 rounded-full ${
                  isCurrent ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-600' : 'bg-gray-200 dark:bg-charcoal-border text-gray-500'
                }`}>
                  <Flame className="w-6 h-6" />
                </div>
                
                <div>
                  <h4 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                    <span>{streak.length} Day Streak</span>
                    {isCurrent && (
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-2 py-0.5 rounded-full font-medium">
                        Active
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                    {format(new Date(streak.start), 'MMM d, yyyy')} — {format(new Date(streak.end), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </Card>
  );
};

export default StreakHistoryList;
