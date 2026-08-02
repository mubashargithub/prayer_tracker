import React, { useState } from 'react';
import { useHistory } from './useHistory';
import HistoryStatsSummary from './components/HistoryStatsSummary';
import HistoryFilterBar from './components/HistoryFilterBar';
import HistoryTimeline from './components/HistoryTimeline';
import HistorySkeleton from './components/HistorySkeleton';
import EmptyState from './components/EmptyState';
import StreakHistoryList from './components/StreakHistoryList';
import DayDetailModal from './components/DayDetailModal';
import ErrorState from '../../components/common/ErrorState';
import PageTransition from '../../components/common/PageTransition';

const HistoryPage = () => {
  const {
    logs,
    streaks,
    summary,
    loading,
    loadingMore,
    hasMore,
    filters,
    setFilters,
    loadMore,
    error,
    fetchHistory
  } = useHistory();

  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (dateStr) => {
    setSelectedDate(dateStr);
    setIsModalOpen(true);
  };

  const hasActiveFilters = filters.type || filters.status || filters.startDate || filters.endDate || filters.search;
  
  const showEmptyState = !loading && logs.length === 0;

  if (error && !loading && logs.length === 0) {
    return (
      <div className="pt-12">
        <ErrorState 
          title="Failed to Load History" 
          message={error} 
          onRetry={fetchHistory} 
        />
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight text-left">History & Logs</h1>
          <p className="text-gray-500 dark:text-gray-400 text-left mt-1">Review your past performance and consistency.</p>
        </div>
      </div>

      {/* Top Stats */}
      <HistoryStatsSummary summary={summary} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* Main Timeline Column */}
        <div className="lg:col-span-2 space-y-6">
          <HistoryFilterBar filters={filters} setFilters={setFilters} />
          
          {loading && logs.length === 0 ? (
            <HistorySkeleton />
          ) : showEmptyState ? (
            <EmptyState 
              isFilterState={hasActiveFilters} 
              clearFilters={() => setFilters({ type: '', status: '', startDate: '', endDate: '', search: '' })} 
            />
          ) : (
            <HistoryTimeline 
              logs={logs} 
              hasMore={hasMore} 
              loadMore={loadMore} 
              loadingMore={loadingMore}
              onDateClick={handleDateClick}
            />
          )}
        </div>

        {/* Sidebar Column (Streaks) */}
        <div className="lg:col-span-1 space-y-6">
          <StreakHistoryList streaks={streaks} />
        </div>
      </div>

      {/* Detail Modal */}
      <DayDetailModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        dateStr={selectedDate}
        onRecordUpdated={fetchHistory}
      />
      
      </div>
    </PageTransition>
  );
};

export default HistoryPage;
