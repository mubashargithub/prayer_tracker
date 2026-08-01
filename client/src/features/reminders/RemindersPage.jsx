import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, Calendar as CalendarIcon, Play, Pause } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useReminders } from './useReminders';
import { useDuas } from '../duas/useDuas'; // Need Duas to populate the dropdown
import SetReminderModal from './SetReminderModal';
import ErrorState from '../../components/common/ErrorState';
import PageTransition from '../../components/common/PageTransition';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const RemindersPage = () => {
  const {
    loading,
    error,
    reminders,
    fetchReminders,
    createReminder,
    updateReminder,
    deleteReminder,
    permission
  } = useReminders();

  const { duas, fetchDuas } = useDuas();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  useEffect(() => {
    fetchReminders();
    fetchDuas();
  }, [fetchReminders, fetchDuas]);

  const handleOpenAdd = () => {
    if (duas.length === 0) {
      alert('Please add a Dua first before setting a reminder.');
      return;
    }
    setEditingReminder(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleSubmit = async (formData) => {
    if (editingReminder) {
      await updateReminder(editingReminder._id, formData);
    } else {
      await createReminder(formData.duaId, formData);
    }
  };

  const toggleActive = (id, currentStatus) => {
    updateReminder(id, { isActive: !currentStatus });
  };

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center space-x-3">
            <span>Reminders</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Schedule times to recite your Duas.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Reminder</span>
        </Button>
      </div>

      {permission !== 'granted' && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3">
          <Bell className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Notifications Disabled</h4>
            <p className="text-sm opacity-90">Please enable browser notifications to receive alerts when it's time to recite.</p>
          </div>
        </div>
      )}

      {error && !loading && (
        <ErrorState 
          title="Failed to Load Reminders" 
          message={error} 
          onRetry={fetchReminders} 
        />
      )}

      {/* Reminders List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading && reminders.length === 0 ? (
          [1, 2].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-charcoal-border rounded-2xl animate-pulse"></div>)
        ) : reminders.length === 0 ? (
          <div className="col-span-full text-center py-16 bg-white dark:bg-charcoal-base rounded-3xl border border-gray-100 dark:border-charcoal-border shadow-sm flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <Bell className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Reminders Yet</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-4">Set up a reminder and we'll notify you when it's time to recite your Dua.</p>
            <Button onClick={handleOpenAdd}>Set your first reminder</Button>
          </div>
        ) : (
          reminders.map(reminder => (
            <Card key={reminder._id} className={`p-5 transition-opacity ${reminder.isActive ? 'opacity-100' : 'opacity-70 grayscale'}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate pr-4">
                    {reminder.type === 'prayer' ? `${reminder.prayerName} Prayer` : (reminder.dua?.title || 'Unknown Dua')}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mt-1">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">{reminder.time}</span>
                  </div>
                </div>
                
                {/* Toggle Active Switch */}
                <button 
                  onClick={() => toggleActive(reminder._id, reminder.isActive)}
                  aria-label={reminder.isActive ? "Pause Reminder" : "Resume Reminder"}
                  className={`p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    reminder.isActive 
                      ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-200 dark:hover:bg-emerald-900/60' 
                      : 'bg-gray-100 dark:bg-charcoal-border text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-charcoal-surface'
                  }`}
                  title={reminder.isActive ? "Pause Reminder" : "Resume Reminder"}
                >
                  {reminder.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
              </div>

              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
                <CalendarIcon className="w-4 h-4 text-gray-400" />
                <span>
                  {reminder.frequency === 'Daily' 
                    ? 'Every day' 
                    : reminder.daysOfWeek.map(d => WEEKDAYS[d]).join(', ')}
                </span>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-gray-50 dark:border-charcoal-border">
                <Button variant="secondary" onClick={() => handleOpenEdit(reminder)} className="px-3 py-1.5 text-sm" aria-label={`Edit ${reminder.type === 'prayer' ? reminder.prayerName : 'Dua'} reminder`}>
                  Edit
                </Button>
                <button 
                  onClick={() => deleteReminder(reminder._id)}
                  aria-label={`Delete ${reminder.type === 'prayer' ? reminder.prayerName : 'Dua'} reminder`}
                  className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))
        )}
      </div>

      <SetReminderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        initialData={editingReminder}
        duas={duas}
      />

      </div>
    </PageTransition>
  );
};

export default RemindersPage;
