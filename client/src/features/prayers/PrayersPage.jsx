import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { usePrayers } from './usePrayers';
import PrayerCard from './PrayerCard';
import PrayerStatsWidget from './PrayerStatsWidget';
import PrayerHistoryTable from './PrayerHistoryTable';
import ErrorState from '../../components/common/ErrorState';
import PrayerCardsSkeleton from './components/PrayerCardsSkeleton';
import PageTransition from '../../components/common/PageTransition';

const PRAYERS_LIST = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

const PrayersPage = () => {
  const {
    loading,
    error,
    todayPrayers,
    history,
    stats,
    fetchTodayPrayers,
    updatePrayerStatus,
    fetchPrayerHistory,
    fetchPrayerStats
  } = usePrayers();

  useEffect(() => {
    // Fetch initial data
    fetchTodayPrayers();
    fetchPrayerHistory();
    fetchPrayerStats();
  }, [fetchTodayPrayers, fetchPrayerHistory, fetchPrayerStats]);

  const handleStatusChange = (prayerName, status) => {
    updatePrayerStatus(prayerName, status);
  };

  const currentDate = format(new Date(), 'EEEE, MMMM do, yyyy');

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Daily Prayers</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{currentDate}</p>
        </div>
      </div>

      {error && !loading && (
        <ErrorState 
          title="Failed to Load Prayers" 
          message={error} 
          onRetry={() => {
            fetchTodayPrayers();
            fetchPrayerStats();
          }} 
        />
      )}

      {/* Main Grid: Today's Prayers & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Today's Prayers Column */}
        <div className="lg:col-span-2 space-y-4">
          {loading && Object.keys(todayPrayers).length === 0 ? (
            <PrayerCardsSkeleton />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRAYERS_LIST.map((prayer) => (
                <PrayerCard
                  key={prayer}
                  name={prayer}
                  status={todayPrayers[prayer]}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Stats Column */}
        <div className="lg:col-span-1">
          <PrayerStatsWidget stats={stats} loading={loading} />
        </div>
        
      </div>

      {/* History Table */}
      <div className="mt-8">
        <PrayerHistoryTable history={history} loading={loading} />
      </div>

      </div>
    </PageTransition>
  );
};

export default PrayersPage;
