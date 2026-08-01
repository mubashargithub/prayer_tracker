import { useState, useCallback } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';

export const useDuas = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [duas, setDuas] = useState([]);

  const fetchDuas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/duas');
      setDuas(response.data);
    } catch (err) {
      console.error('Failed to fetch duas:', err);
      setError('Failed to load Duas.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createDua = useCallback(async (duaData) => {
    try {
      const response = await api.post('/duas', duaData);
      setDuas(prev => [response.data, ...prev]);
      toast.success('Dua added successfully');
      return response.data;
    } catch (err) {
      console.error('Failed to create dua:', err);
      toast.error('Failed to add Dua');
      throw err;
    }
  }, []);

  const updateDua = useCallback(async (id, duaData) => {
    try {
      const response = await api.put(`/duas/${id}`, duaData);
      setDuas(prev => prev.map(d => d._id === id ? response.data : d));
      toast.success('Dua updated successfully');
      return response.data;
    } catch (err) {
      console.error('Failed to update dua:', err);
      toast.error('Failed to update Dua');
      throw err;
    }
  }, []);

  const deleteDua = useCallback(async (id) => {
    try {
      await api.delete(`/duas/${id}`);
      setDuas(prev => prev.filter(d => d._id !== id));
      toast.success('Dua deleted');
    } catch (err) {
      console.error('Failed to delete dua:', err);
      toast.error('Failed to delete Dua');
      throw err;
    }
  }, []);

  const completeDua = useCallback(async (id) => {
    try {
      // Optimistic update for tracking completion (if we had a local 'completed today' flag)
      // Usually, completion adds to history. 
      const response = await api.post(`/duas/${id}/complete`);
      toast.success('Marked as done for today!');
      return response.data;
    } catch (err) {
      console.error('Failed to complete dua:', err);
      toast.error('Failed to mark Dua as done');
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    duas,
    fetchDuas,
    createDua,
    updateDua,
    deleteDua,
    completeDua
  };
};
