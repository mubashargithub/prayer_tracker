import { useState, useCallback } from 'react';
import api from '../../services/api';

export const useDashboard = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [summary, setSummary] = useState(null);
  const [calendar, setCalendar] = useState([]);
  const [trends, setTrends] = useState([]);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, trendsRes] = await Promise.all([
        api.get('/dashboard/summary'),
        api.get('/dashboard/trends?timeframe=monthly')
      ]);

      setSummary(summaryRes.data);
      setTrends(trendsRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
      setError('Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  }, []);

  const exportData = useCallback(() => {
    // Generate a simple CSV from trends and summary as a demonstration
    // Since we don't have a direct /export returning a file in the plan,
    // we'll do client-side CSV generation.
    if (!trends || trends.length === 0) return;

    const headers = ['Date', 'Prayers Completed', 'Duas Completed'];
    const rows = trends.map(t => `${t._id},${t.prayersCompleted || 0},${t.duasCompleted || 0}`);
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `deen_tracker_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [trends]);

  return {
    loading,
    error,
    summary,
    calendar,
    trends,
    fetchDashboardData,
    exportData
  };
};
