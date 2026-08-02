import React, { useState, useEffect } from 'react';
import { Bell, Plus, Trash2, Clock, Calendar as CalendarIcon, Play, Pause, MapPin } from 'lucide-react';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useReminders } from './useReminders';
import { useDuas } from '../duas/useDuas'; 
import SetReminderModal from './SetReminderModal';
import ErrorState from '../../components/common/ErrorState';
import PageTransition from '../../components/common/PageTransition';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const RemindersPage = () => {
  const {
    loading,
    error,
    customReminders,
    prayerReminders,
    locationStatus,
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

  const renderReminderCard = (reminder, isAutomated = false) => (
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
        
        {/* Toggle Active Switch (Only for Custom Reminders) */}
        {!isAutomated && (
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
        )}
      </div>

      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-6">
        <CalendarIcon className="w-4 h-4 text-gray-400" />
        <span>
          {reminder.frequency === 'Daily' 
            ? 'Every day' 
            : reminder.daysOfWeek?.map(d => WEEKDAYS[d]).join(', ')}
        </span>
      </div>

      {!isAutomated ? (
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
      ) : (
        <div className="flex justify-end pt-4 border-t border-gray-50 dark:border-charcoal-border">
          <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">Automated Sync</span>
        </div>
      )}
    </Card>
  );

  return (
    <PageTransition>
      <div className="space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 tracking-tight flex items-center space-x-3">
            <span>Reminders</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automated prayer alerts and custom Dua schedules.</p>
        </div>
        <Button onClick={handleOpenAdd} className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Custom Reminder</span>
        </Button>
      </div>

      {permission !== 'granted' && (
        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-400 rounded-xl border border-amber-200 dark:border-amber-800/50 flex items-start space-x-3">
          <Bell className="w-5 h-5 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-sm">Notifications Disabled</h4>
            <p className="text-sm opacity-90">Please enable browser notifications to receive alerts when it's time to pray or recite.</p>
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

      {/* Automated Prayer Reminders */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center space-x-2">
            <span>Automated Prayer Reminders</span>
          </h2>
          {locationStatus === 'denied' && (
            <span className="text-xs text-red-500 flex items-center bg-red-50 dark:bg-red-900/20 px-2 py-1 rounded-md">
              <MapPin className="w-3 h-3 mr-1" /> Location Access Denied
            </span>
          )}
        </div>
        
        {loading && prayerReminders.length === 0 ? (
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             {[1, 2, 3].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-charcoal-border rounded-2xl animate-pulse"></div>)}
           </div>
        ) : prayerReminders.length === 0 ? (
          <div className="p-8 bg-gray-50 dark:bg-charcoal-surface border border-gray-100 dark:border-charcoal-border rounded-2xl text-center text-gray-500 dark:text-gray-400">
            {locationStatus === 'pending' ? 'Detecting your city for accurate prayer times...' : 'Could not load automated prayer times. Please ensure location services are enabled.'}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prayerReminders.map(r => renderReminderCard(r, true))}
          </div>
        )}
      </div>

      <hr className="border-gray-100 dark:border-charcoal-border" />

      {/* Custom Reminders */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Custom Dua Reminders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading && customReminders.length === 0 ? (
            [1, 2].map(i => <div key={i} className="h-32 bg-gray-100 dark:bg-charcoal-border rounded-2xl animate-pulse"></div>)
          ) : customReminders.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-white dark:bg-charcoal-base rounded-3xl border border-gray-100 dark:border-charcoal-border shadow-sm flex flex-col items-center">
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">No Custom Reminders</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-4">Set up a custom reminder to memorize or recite your Duas daily.</p>
              <Button onClick={handleOpenAdd}>Set your first reminder</Button>
            </div>
          ) : (
            customReminders.map(r => renderReminderCard(r, false))
          )}
        </div>
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
