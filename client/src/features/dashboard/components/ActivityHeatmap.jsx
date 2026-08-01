import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, subDays } from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Grid } from 'lucide-react';
import api from '../../../services/api';
import MonthGridCalendar from './MonthGridCalendar';
import YearlyOverview from './YearlyOverview';
import DayDetailModal from '../../history/components/DayDetailModal';
import Button from '../../../components/common/Button';

// Local cache to prevent refetching during rapid navigation
const dataCache = {};

const ActivityHeatmap = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState('monthly'); // 'monthly' | 'yearly'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fetchedData, setFetchedData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null); // 'YYYY-MM-DD'

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let startDate, endDate, cacheKey;
      
      if (viewMode === 'monthly') {
        startDate = format(startOfMonth(currentDate), 'yyyy-MM-dd');
        endDate = format(endOfMonth(currentDate), 'yyyy-MM-dd');
        cacheKey = format(currentDate, 'yyyy-MM');
      } else {
        const today = new Date();
        startDate = format(subDays(today, 365), 'yyyy-MM-dd');
        endDate = format(today, 'yyyy-MM-dd');
        cacheKey = 'yearly';
      }

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
  }, [currentDate, viewMode]);

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

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <div className="bg-gray-100 dark:bg-[#272C35] p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setViewMode('monthly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'monthly' 
                  ? 'bg-white dark:bg-charcoal-surface text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-1">
                <CalendarIcon className="w-4 h-4" />
                <span>Monthly</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode('yearly')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'yearly' 
                  ? 'bg-white dark:bg-charcoal-surface text-gray-900 dark:text-white shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              <div className="flex items-center space-x-1">
                <Grid className="w-4 h-4" />
                <span>Yearly</span>
              </div>
            </button>
          </div>
        </div>

        {viewMode === 'monthly' && (
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
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      
      {/* Calendar Area */}
      <div className="relative min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-charcoal-surface/50 backdrop-blur-sm rounded-xl">
            <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {viewMode === 'monthly' ? (
          <MonthGridCalendar 
            currentDate={currentDate} 
            dataMap={dataMap} 
            onDayClick={handleDayClick} 
          />
        ) : (
          <YearlyOverview 
            dataMap={dataMap} 
            onDayClick={handleDayClick} 
          />
        )}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-between sm:justify-end gap-4 mt-6 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-charcoal-border pt-4">
        <div className="flex items-center space-x-2">
          <span>Reminders Completed:</span>
          <div className="flex gap-0.5">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span>Less</span>
          <div className="w-3.5 h-3.5 bg-gray-100 dark:bg-[#272C35] rounded-sm border border-gray-200 dark:border-transparent"></div>
          <div className="w-3.5 h-3.5 bg-emerald-200 dark:bg-[#064e3b] rounded-sm"></div>
          <div className="w-3.5 h-3.5 bg-emerald-400 dark:bg-[#065f46] rounded-sm"></div>
          <div className="w-3.5 h-3.5 bg-emerald-600 dark:bg-[#047857] rounded-sm"></div>
          <div className="w-3.5 h-3.5 bg-amber-400 dark:bg-amber-600 rounded-sm shadow-[0_0_8px_rgba(251,191,36,0.5)]"></div>
          <span>Perfect</span>
        </div>
      </div>

      {selectedDay && (
        <DayDetailModal 
          isOpen={!!selectedDay} 
          onClose={() => setSelectedDay(null)} 
          date={selectedDay} 
        />
      )}
    </div>
  );
};

export default ActivityHeatmap;
