import { useState, useCallback } from 'react';
import api from '../../services/api';

export const useProfile = () => {
  const [profile, setProfile] = useState(null);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/users/profile');
      setProfile(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAchievements = useCallback(async () => {
    try {
      const response = await api.get('/users/profile/achievements');
      setAchievements(response.data.badges || []);
    } catch (err) {
      console.error('Failed to load achievements', err);
    }
  }, []);

  const updateProfile = async (data) => {
    setError(null);
    try {
      const response = await api.put('/users/profile', data);
      setProfile(prev => ({ ...prev, ...response.data.user }));
      return { success: true, message: response.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updatePreferences = async (data) => {
    setError(null);
    try {
      const response = await api.put('/users/profile/preferences', data);
      setProfile(prev => ({ ...prev, preferences: { ...prev.preferences, ...response.data.preferences } }));
      return { success: true, message: response.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update preferences';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updateNotificationSettings = async (data) => {
    setError(null);
    try {
      const response = await api.put('/users/notification-settings', data);
      setProfile(prev => ({ 
        ...prev, 
        preferences: { 
          ...prev.preferences, 
          notificationSettings: response.data.settings 
        } 
      }));
      return { success: true, message: response.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update settings';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const updateAvatar = async (file) => {
    setError(null);
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      
      const response = await api.put('/users/profile/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setProfile(prev => ({ ...prev, avatarUrl: response.data.avatarUrl }));
      return { success: true, message: response.data.message, avatarUrl: response.data.avatarUrl };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to upload avatar';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const changePassword = async (data) => {
    setError(null);
    try {
      const response = await api.put('/users/change-password', data);
      return { success: true, message: response.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to change password';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  const deleteAccount = async () => {
    setError(null);
    try {
      const response = await api.delete('/users/account');
      return { success: true, message: response.data.message };
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete account';
      setError(msg);
      return { success: false, message: msg };
    }
  };

  return {
    profile,
    achievements,
    loading,
    error,
    fetchProfile,
    fetchAchievements,
    updateProfile,
    updatePreferences,
    updateNotificationSettings,
    updateAvatar,
    changePassword,
    deleteAccount
  };
};
