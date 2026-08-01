import { useState, useEffect, useCallback } from 'react';
import api from '../../services/api';

export const useHistory = () => {
  const [logs, setLogs] = useState([]);
  const [streaks, setStreaks] = useState([]);
  const [summary, setSummary] = useState(null);
  
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filters
  const [filters, setFilters] = useState({
    type: '', // '', 'prayers', 'duas'
    status: '', // '', 'completed', 'missed', 'qaza', 'done', 'skipped'
    startDate: '',
    endDate: '',
    search: ''
  });

  const fetchStreaks = useCallback(async () => {
    try {
      const response = await api.get('/history/streaks');
      setStreaks(response.data.streaks);
      setSummary(response.data.summary);
    } catch (err) {
      console.error('Failed to load streaks', err);
    }
  }, []);

  const fetchLogs = useCallback(async (isLoadMore = false) => {
    if (!isLoadMore) {
      setLoading(true);
      setPage(1); // Reset page on new filter
    } else {
      setLoadingMore(true);
    }
    setError(null);

    try {
      const currentPage = isLoadMore ? page + 1 : 1;
      
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20
      });

      if (filters.type) params.append('type', filters.type);
      if (filters.status) params.append('status', filters.status);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);
      if (filters.search) params.append('search', filters.search);

      const response = await api.get(`/history/filter?${params.toString()}`);
      
      const newLogs = response.data.logs;
      
      if (isLoadMore) {
         setLogs(prev => [...prev, ...newLogs]);
        setPage(currentPage);
      } else {
        setLogs(newLogs);
      }
      
      setHasMore(currentPage < response.data.totalPages);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load history');
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [filters, page]);

  // Debounced fetch for filters (especially search)
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLogs(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, fetchLogs]);

  useEffect(() => {
    fetchStreaks();
  }, [fetchStreaks]);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      fetchLogs(true);
    }
  };

  const getDayDetail = async (dateStr) => {
    try {
      const response = await api.get(`/history/day/${dateStr}`);
      return response.data;
    } catch (err) {
      console.error('Failed to load day detail', err);
      return null;
    }
  };

  return {
    logs,
    streaks,
    summary,
    loading,
    loadingMore,
    hasMore,
    error,
    filters,
    setFilters,
    loadMore,
    getDayDetail
  };
};
