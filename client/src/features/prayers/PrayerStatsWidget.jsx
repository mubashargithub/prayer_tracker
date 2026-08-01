import React from 'react';
import Card from '../../components/common/Card';
import { RadialBarChart, RadialBar, ResponsiveContainer } from 'recharts';
import { Flame, Trophy } from 'lucide-react';

const PrayerStatsWidget = ({ stats, loading }) => {
  if (loading || !stats) {
    return (
      <Card className="h-full flex items-center justify-center min-h-[200px]">
        <div className="animate-pulse flex flex-col items-center space-y-4">
          <div className="w-24 h-24 bg-gray-200 dark:bg-charcoal-border rounded-full"></div>
          <div className="h-4 bg-gray-200 dark:bg-charcoal-border rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  // Calculate percentage (assuming stats contains completedPrayers and totalPrayers for the week)
  const percent = stats.totalWeekly > 0 
    ? Math.round((stats.completedWeekly / stats.totalWeekly) * 100) 
    : 0;

  const data = [
    {
      name: 'Background',
      value: 100,
      fill: 'var(--chart-grid)', // uses CSS variable for light/dark
    },
    {
      name: 'Completed',
      value: percent,
      fill: 'var(--chart-primary)', // emerald
    }
  ];

  return (
    <Card className="h-full p-6">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Weekly Overview</h3>
      
      <div className="flex flex-col items-center justify-center gap-6">
        
        {/* Radial Chart */}
        <div className="relative w-32 h-32 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <RadialBarChart 
              cx="50%" 
              cy="50%" 
              innerRadius="70%" 
              outerRadius="100%" 
              barSize={10} 
              data={data}
              startAngle={90}
              endAngle={-270}
            >
              <RadialBar
                minAngle={15}
                background={{ fill: 'transparent' }}
                clockWise
                dataKey="value"
                cornerRadius={10}
              />
            </RadialBarChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-gray-900 dark:text-gray-100">{percent}%</span>
            <span className="text-xs text-gray-500 dark:text-gray-400">Completed</span>
          </div>
        </div>

        {/* Streaks Info */}
        <div className="flex-1 w-full space-y-4">
          <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-100 dark:border-amber-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400 rounded-lg">
                <Flame className="w-5 h-5" />
              </div>
              <span className="font-semibold text-amber-900 dark:text-amber-100">Current Streak</span>
            </div>
            <span className="text-xl font-bold text-amber-700 dark:text-amber-400">{stats.currentStreak || 0} days</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-lg">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="font-semibold text-emerald-900 dark:text-emerald-100">Longest Streak</span>
            </div>
            <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{stats.longestStreak || 0} days</span>
          </div>
        </div>

      </div>
    </Card>
  );
};

export default PrayerStatsWidget;
