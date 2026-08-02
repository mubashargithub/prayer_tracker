import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import axios from 'axios';
import { toast } from 'sonner';

export const useReminders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const [customReminders, setCustomReminders] = useState([]);
  const [prayerReminders, setPrayerReminders] = useState([]);
  
  // Expose a unified array for the polling interval
  const reminders = [...prayerReminders, ...customReminders];
  
  const [permission, setPermission] = useState(Notification.permission);
  const [locationStatus, setLocationStatus] = useState('pending'); // pending, granted, denied

  // Request Notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().then(perm => {
        setPermission(perm);
        if (perm === 'granted') {
          toast.success('Notifications enabled!');
        }
      });
    }
  }, []);

  const fetchPrayerTimes = async (lat, lng) => {
    try {
      // Method 2 corresponds to ISNA (Islamic Society of North America)
      const res = await axios.get(`https://api.aladhan.com/v1/timings?latitude=${lat}&longitude=${lng}&method=2`);
      const timings = res.data.data.timings;
      
      const automatedPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => ({
        _id: `auto_${prayer}`,
        type: 'prayer',
        prayerName: prayer,
        time: timings[prayer], // Returns "HH:MM"
        frequency: 'Daily',
        daysOfWeek: [],
        isActive: true,
        isAutomated: true
      }));

      setPrayerReminders(automatedPrayers);
    } catch (err) {
      console.error('Failed to fetch automated prayer times:', err);
      toast.error("Couldn't calculate accurate prayer times");
    }
  };

  const initGeolocation = useCallback(() => {
    if (!('geolocation' in navigator)) {
      setLocationStatus('denied');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationStatus('granted');
        fetchPrayerTimes(position.coords.latitude, position.coords.longitude);
      },
      (err) => {
        console.warn('Geolocation denied or failed:', err);
        setLocationStatus('denied');
        // Fallback: Could use IP-based location or Makkah, but we'll leave it empty for now
        toast.info("Enable location for automated prayer reminders");
      },
      { timeout: 10000 }
    );
  }, []);

  // Poll for due reminders (in-app notifications)
  useEffect(() => {
    if (permission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      reminders.forEach(reminder => {
        if (!reminder.isActive || !reminder.time) return;

        // Parse time "HH:MM"
        const [hour, minute] = reminder.time.split(':').map(Number);
        
        if (hour === currentHour && minute === currentMinute) {
          const lastFiredStr = localStorage.getItem(`reminder_fired_${reminder._id}`);
          const lastFired = lastFiredStr ? new Date(lastFiredStr) : null;
          
          if (!lastFired || now - lastFired > 60000) {
            // Fire notification
            const title = reminder.type === 'prayer' ? `${reminder.prayerName} Prayer` : 'Dua Reminder';
            const body = reminder.type === 'prayer' 
              ? `It's time for ${reminder.prayerName} prayer.` 
              : `It's time to recite: ${reminder.dua?.title || 'your Dua'}`;

            new Notification(title, {
              body,
              icon: '/favicon.svg'
            });
            localStorage.setItem(`reminder_fired_${reminder._id}`, now.toISOString());
          }
        }
      });
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [reminders, permission]);

  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/reminders');
      // The API returns all custom reminders. We filter out any manually created prayer reminders
      // if we are fully replacing them with automated ones, but let's keep them separated.
      setCustomReminders(response.data.filter(r => r.type === 'dua'));
      
      // Initialize automated prayers
      initGeolocation();
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
      setError('Failed to load reminders.');
    } finally {
      setLoading(false);
    }
  }, [initGeolocation]);

  const createReminder = useCallback(async (duaId, reminderData) => {
    try {
      const endpoint = reminderData.type === 'prayer' ? '/reminders' : `/duas/${duaId}/reminders`;
      const response = await api.post(endpoint, reminderData);
      
      setCustomReminders(prev => [...prev, response.data]);
      toast.success('Reminder set successfully');
      return response.data;
    } catch (err) {
      console.error('Failed to create reminder:', err);
      toast.error('Failed to set reminder');
      throw err;
    }
  }, []);

  const updateReminder = useCallback(async (id, reminderData) => {
    try {
      const response = await api.put(`/reminders/${id}`, reminderData);
      setCustomReminders(prev => prev.map(r => r._id === id ? response.data : r));
      toast.success(reminderData.isActive !== undefined ? 
        (reminderData.isActive ? 'Reminder resumed' : 'Reminder paused') : 
        'Reminder updated'
      );
      return response.data;
    } catch (err) {
      console.error('Failed to update reminder:', err);
      toast.error('Failed to update reminder');
      throw err;
    }
  }, []);

  const deleteReminder = useCallback(async (id) => {
    try {
      await api.delete(`/reminders/${id}`);
      setCustomReminders(prev => prev.filter(r => r._id !== id));
      toast.success('Reminder deleted');
    } catch (err) {
      console.error('Failed to delete reminder:', err);
      toast.error('Failed to delete reminder');
      throw err;
    }
  }, []);

  return {
    loading,
    error,
    customReminders,
    prayerReminders,
    locationStatus,
    permission,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder
  };
};
