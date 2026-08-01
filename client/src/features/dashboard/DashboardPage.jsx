import React, { useEffect } from 'react';
import ActivityHeatmap from './components/ActivityHeatmap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from 'recharts';
import { Download, TrendingUp, Target, Activity, Loader } from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useDashboard } from './useDashboard';
import { format, subMonths } from 'date-fns';
import ErrorState from '../../components/common/ErrorState';
import DashboardSkeleton from './components/DashboardSkeleton';
import PageTransition from '../../components/common/PageTransition';

const DashboardPage = () => {
  const {
    loading,
    error,
    summary,
    calendar,
    trends,
    fetchDashboardData,
    exportData
  } = useDashboard();

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);


  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">Analytics Dashboard</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Track your spiritual journey over time.</p>
        </div>
        <Button onClick={exportData} variant="secondary" className="flex items-center space-x-2 bg-white dark:bg-charcoal-surface">
          <Download className="w-4 h-4" />
          <span>Export CSV</span>
        </Button>
      </div>

      {error && !loading && (
        <ErrorState 
          title="Failed to Load Dashboard" 
          message={error} 
          onRetry={fetchDashboardData} 
        />
      )}

      {loading && !summary ? (
        <DashboardSkeleton />
      ) : summary && !error ? (
        <>
          {/* Daily Focus Widget */}
          <div className="relative overflow-hidden rounded-3xl bg-white dark:bg-charcoal-surface ring-1 ring-inset ring-gray-100 dark:ring-white/5 p-6 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
            {/* Subtle radial glow */}
            <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 rounded-full bg-emerald-100 dark:bg-emerald-900/10 blur-3xl opacity-50 pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="flex-1">
                <p className="text-emerald-600 dark:text-emerald-400 font-medium tracking-wider text-xs uppercase mb-2">Today's Focus</p>
                <h2 className="font-serif text-3xl md:text-4xl text-gray-900 dark:text-gray-100 font-medium leading-tight">
                  {summary?.prayerStreak > 0 
                    ? `Alhamdulillah, you're on a ${summary.prayerStreak} day streak.` 
                    : 'Bismillah. Start your daily routine today.'}
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-4 max-w-lg text-sm md:text-base leading-relaxed">
                  "Indeed, prayer prohibits immorality and wrongdoing, and the remembrance of Allah is greater." <br className="hidden md:block"/>— (Quran 29:45)
                </p>
              </div>
              
              <div className="flex gap-4 self-stretch md:self-auto w-full md:w-auto">
                <div className="flex-1 md:flex-none bg-emerald-50/50 dark:bg-charcoal-border/50 backdrop-blur-sm p-4 rounded-2xl text-center min-w-[110px] ring-1 ring-inset ring-emerald-100/50 dark:ring-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Prayers</p>
                  <p className="text-3xl font-semibold text-emerald-700 dark:text-emerald-300">{summary?.todayPrayerPercent || 0}%</p>
                </div>
                <div className="flex-1 md:flex-none bg-amber-50/50 dark:bg-charcoal-border/50 backdrop-blur-sm p-4 rounded-2xl text-center min-w-[110px] ring-1 ring-inset ring-amber-100/50 dark:ring-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">Duas</p>
                  <p className="text-3xl font-semibold text-amber-700 dark:text-amber-300">{summary?.activeDuas || 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Heatmap */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Activity Heatmap</h3>
            <ActivityHeatmap />
          </Card>

          {/* Trends Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Completion Trends</h3>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trends} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--chart-grid)" />
                  <XAxis 
                    dataKey="_id" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--chart-text)', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '8px', 
                      border: 'none', 
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'var(--chart-tooltip-bg)',
                      color: 'var(--chart-tooltip-text)'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="prayersCompleted" 
                    name="Prayers"
                    stroke="var(--chart-primary)" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="duasCompleted" 
                    name="Duas"
                    stroke="var(--chart-secondary)" 
                    strokeWidth={3} 
                    dot={{ r: 4, strokeWidth: 2 }}
                    activeDot={{ r: 6 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </>
      ) : null}



      </div>
    </PageTransition>
  );
};

export default DashboardPage;
