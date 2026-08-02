import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import api from '../../../services/api';
import MonthGridCalendar from './MonthGridCalendar';
import DayDetailModal from '../../history/components/DayDetailModal';
import Button from '../../../components/common/Button';

// Local cache to prevent refetching during rapid navigation
const dataCache = {};

const ActivityHeatmap = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // 'YYYY-MM-DD'

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
      const endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
      const cacheKey = format(currentDate, 'yyyy-MM');

      if (dataCache[cacheKey]) {
        setFetchedData(dataCache[cacheKey]);
        setLoading(false);
        return;
      }

      const res = await api.get(`/history/summary?startDate=${startDate}&endDate=${endDate}`);
      dataCache[cacheKey] = res.data;
      setFetchedData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load activity data.');
    } finally {
      setLoading(false);
    }
  }, [currentDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const dataMap = useMemo(() => {
    const map = {};
    fetchedData.forEach(day => {
      map[day.date] = day;
    });
    return map;
  }, [fetchedData]);

  const handlePrevMonth = () => setCurrentDate(prev => subMonths(prev, 1));
  const handleNextMonth = () => setCurrentDate(prev => addMonths(prev, 1));
  const handleToday = () => setCurrentDate(new Date());

  const handleDayClick = (dateStr) => {
    setSelectedDay(dateStr);
  };

  const handleRecordUpdated = useCallback(() => {
    // Clear cache to force refetch
    Object.keys(dataCache).forEach(key => delete dataCache[key]);
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
          <span>Activity Heatmap</span>
        </h3>

        <div className="flex items-center space-x-3">
          <Button variant="secondary" className="px-2 py-1.5 h-8" onClick={handlePrevMonth}>
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <span className="text-base font-bold text-gray-900 dark:text-white min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <Button variant="secondary" className="px-2 py-1.5 h-8" onClick={handleNextMonth}>
            <ChevronRight className="w-5 h-5" />
          </Button>
          <Button variant="outline" className="px-3 py-1.5 h-8 text-xs ml-2" onClick={handleToday}>
            Today
          </Button>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {/* Calendar Area */}
      <div className="relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-charcoal-surface/50 backdrop-blur-sm rounded-xl">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <MonthGridCalendar 
          currentDate={currentDate} 
          dataMap={dataMap} 
          onDayClick={handleDayClick} 
        />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 mt-6 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-[#1F2D50] pt-4">
        <div className="flex items-center space-x-2">
          <span>Reminders Completed:</span>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span>Less</span>
          <div className="w-3.5 h-3.5 bg-gray-100 dark:bg-[#20293F] rounded-sm border border-gray-200 dark:border-charcoal-border" title="0%"></div>
          <div className="w-3.5 h-3.5 bg-emerald-50 dark:bg-emerald-900/10 rounded-sm border border-emerald-100 dark:border-emerald-900/30" title="1-40%"></div>
          <div className="w-3.5 h-3.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-sm border border-emerald-200 dark:border-emerald-800/40" title="41-70%"></div>
          <div className="w-3.5 h-3.5 bg-emerald-500 dark:bg-emerald-600 rounded-sm border border-emerald-600 dark:border-emerald-500" title="71-99%"></div>
          <div className="w-3.5 h-3.5 bg-amber-400 dark:bg-amber-600 rounded-sm border border-amber-300 dark:border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.4)]" title="Perfect Day"></div>
          <span>Perfect</span>
        </div>
      </div>

      {selectedDay && (
        <DayDetailModal 
          isOpen={!!selectedDay} 
          onClose={() => setSelectedDay(null)} 
          dateStr={selectedDay} 
          onRecordUpdated={handleRecordUpdated}
        />
      )}
    </div>
  );
};

export default ActivityHeatmap;
