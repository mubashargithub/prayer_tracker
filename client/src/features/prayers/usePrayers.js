import { useState, useCallback } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';

export const usePrayers = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Default state for today's prayers
  const [todayPrayers, setTodayPrayers] = useState({
    Fajr: 'pending',
    Dhuhr: 'pending',
    Asr: 'pending',
    Maghrib: 'pending',
    Isha: 'pending'
  });

  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);

  const fetchTodayPrayers = useCallback(async (dateString) => {
    setLoading(true);
    setError(null);
    try {
      // Get today's date in YYYY-MM-DD if not provided
      const date = dateString || new Date().toISOString().split('T')[0];
      const response = await api.get(`/prayers/today?date=${date}`);
      
      const prayersArray = Array.isArray(response.data) 
        ? response.data 
        : (response.data?.prayers || []);

      if (prayersArray && prayersArray.length > 0) {
        const prayersMap = {
          Fajr: 'pending',
          Dhuhr: 'pending',
          Asr: 'pending',
          Maghrib: 'pending',
          Isha: 'pending'
        };
        
        prayersArray.forEach(p => {
          const name = p.prayerName || p.name;
          if (name && prayersMap[name] !== undefined) {
            prayersMap[name] = p.status;
          }
        });
        setTodayPrayers(prayersMap);
      }
    } catch (err) {
      console.error('Failed to fetch today prayers:', err);
      setError('Failed to load today\'s prayers.');
    } finally {
      setLoading(false);
    }
  }, []);
  const fetchPrayerHistory = useCallback(async (startDate, endDate, page = 1, limit = 10) => {
    setLoading(true);
    setError(null);
    try {
      let url = `/prayers/history?page=${page}&limit=${limit}`;
      if (startDate) url += `&startDate=${startDate}`;
      if (endDate) url += `&endDate=${endDate}`;
      
      const response = await api.get(url);
      setHistory(response.data);
      return response.data;
    } catch (err) {
      console.error('Failed to fetch history:', err);
      setError('Failed to load prayer history.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPrayerStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/prayers/stats');
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Failed to load prayer statistics.');
    } finally {
      setLoading(false);
    }
  }, []);


  const updatePrayerStatus = useCallback(async (prayerName, status, dateString) => {
    // Optimistic UI update
    setTodayPrayers(prev => ({
      ...prev,
      [prayerName]: status
    }));

    try {
      const date = dateString || new Date().toISOString().split('T')[0];
      await api.post('/prayers/mark', {
        prayerName,
        status,
        date
      });
      toast.success(`${prayerName} marked as ${status}`);
      
      // Real-time updates for history and stats
      fetchPrayerStats();
      fetchPrayerHistory();
    } catch (err) {
      console.error('Failed to update prayer status:', err);
      toast.error(`Failed to update ${prayerName}`);
      
      // Revert on failure by re-fetching
      fetchTodayPrayers(dateString);
    }
  }, [fetchTodayPrayers, fetchPrayerStats, fetchPrayerHistory]);



  return {
    loading,
    error,
    todayPrayers,
    history,
    stats,
    fetchTodayPrayers,
    updatePrayerStatus,
    fetchPrayerHistory,
    fetchPrayerStats
  };
};
