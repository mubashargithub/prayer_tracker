import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';

export const useReminders = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [permission, setPermission] = useState(Notification.permission);

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

  // Poll for due reminders (in-app notifications)
  useEffect(() => {
    if (permission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();

      reminders.forEach(reminder => {
        if (!reminder.isActive) return;

        // Parse time "HH:MM"
        const [hour, minute] = reminder.time.split(':').map(Number);
        
        // Simple check: if the reminder time matches the current minute (and we haven't fired it yet)
        // In a real robust app, we'd store lastFired timestamp to avoid firing multiple times in a minute
        if (hour === currentHour && minute === currentMinute) {
          const lastFiredStr = localStorage.getItem(`reminder_fired_${reminder._id}`);
          const lastFired = lastFiredStr ? new Date(lastFiredStr) : null;
          
          if (!lastFired || now - lastFired > 60000) {
            // Fire notification
            new Notification('Dua Reminder', {
              body: `It's time to recite: ${reminder.dua?.title || 'your Dua'}`,
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
      setReminders(response.data);
    } catch (err) {
      console.error('Failed to fetch reminders:', err);
      setError('Failed to load reminders.');
    } finally {
      setLoading(false);
    }
  }, []);

  const createReminder = useCallback(async (duaId, reminderData) => {
    try {
      const endpoint = reminderData.type === 'prayer' ? '/reminders' : `/duas/${duaId}/reminders`;
      const response = await api.post(endpoint, reminderData);
      
      // The backend might not fully populate the duaId immediately on creation if it's nested
      // But we can optimistically append or rely on the next fetch
      setReminders(prev => [...prev, response.data]);
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
      setReminders(prev => prev.map(r => r._id === id ? response.data : r));
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
      setReminders(prev => prev.filter(r => r._id !== id));
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
    reminders,
    permission,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder
  };
};
