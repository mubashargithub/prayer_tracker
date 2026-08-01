import React, { useState, useEffect } from 'react';
import Modal from '../../components/common/Modal';
import Button from '../../components/common/Button';
import { Clock, Info } from 'lucide-react';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const SetReminderModal = ({ isOpen, onClose, onSubmit, duas = [], initialData = null }) => {
  const [formData, setFormData] = useState({
    type: 'dua',
    duaId: '',
    prayerName: 'Fajr',
    time: '09:00',
    frequency: 'Daily',
    daysOfWeek: [],
    isActive: true
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        type: initialData.type || 'dua',
        duaId: initialData.dua?._id || '',
        prayerName: initialData.prayerName || 'Fajr',
        time: initialData.time || '09:00',
        frequency: initialData.frequency || 'Daily',
        daysOfWeek: initialData.daysOfWeek || [],
        isActive: initialData.isActive !== undefined ? initialData.isActive : true
      });
    } else {
      setFormData({
        type: 'dua',
        duaId: duas.length > 0 ? duas[0]._id : '',
        prayerName: 'Fajr',
        time: '09:00',
        frequency: 'Daily',
        daysOfWeek: [],
        isActive: true
      });
    }
  }, [initialData, isOpen, duas]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const toggleDay = (dayIndex) => {
    setFormData(prev => {
      const days = [...prev.daysOfWeek];
      if (days.includes(dayIndex)) {
        return { ...prev, daysOfWeek: days.filter(d => d !== dayIndex) };
      } else {
        return { ...prev, daysOfWeek: [...days, dayIndex].sort() };
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.frequency === 'Specific Days' && formData.daysOfWeek.length === 0) {
      alert('Please select at least one day.');
      return;
    }
    onSubmit(formData);
    onClose();
  };

  // Get local timezone string (e.g., "America/New_York")
  const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? "Edit Reminder" : "Set New Reminder"}>
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Type Selection (Only when creating new) */}
        {!initialData && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reminder Type</label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="dua"
                  checked={formData.type === 'dua'}
                  onChange={handleChange}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Dua</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="type"
                  value="prayer"
                  checked={formData.type === 'prayer'}
                  onChange={handleChange}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Prayer</span>
              </label>
            </div>
          </div>
        )}

        {/* Dynamic Selection (Only when creating new) */}
        {!initialData && formData.type === 'dua' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Dua</label>
            <select
              name="duaId"
              value={formData.duaId}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-charcoal-border bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required={formData.type === 'dua'}
            >
              {duas.map(dua => (
                <option key={dua._id} value={dua._id}>{dua.title}</option>
              ))}
            </select>
          </div>
        )}

        {!initialData && formData.type === 'prayer' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Select Prayer</label>
            <select
              name="prayerName"
              value={formData.prayerName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 dark:border-charcoal-border bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required={formData.type === 'prayer'}
            >
              {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map(prayer => (
                <option key={prayer} value={prayer}>{prayer}</option>
              ))}
            </select>
          </div>
        )}

        {/* Time Picker */}
        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Time</label>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-charcoal-border bg-white dark:bg-charcoal-base text-gray-900 dark:text-gray-100 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
              required
            />
          </div>
          <div className="flex items-center space-x-1 mt-1 text-xs text-gray-500 dark:text-gray-400">
            <Info className="w-3 h-3" />
            <span>Time is set in your local timezone ({localTimezone})</span>
          </div>
        </div>

        {/* Frequency */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Frequency</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="frequency"
                value="Daily"
                checked={formData.frequency === 'Daily'}
                onChange={handleChange}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Daily</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                name="frequency"
                value="Specific Days"
                checked={formData.frequency === 'Specific Days'}
                onChange={handleChange}
                className="text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">Specific Days</span>
            </label>
          </div>
        </div>

        {/* Weekday selector (conditionally rendered) */}
        {formData.frequency === 'Specific Days' && (
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Days</label>
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((day, index) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => toggleDay(index)}
                  className={`w-10 h-10 rounded-full text-sm font-medium transition-colors ${
                    formData.daysOfWeek.includes(index)
                      ? 'bg-emerald-500 dark:bg-emerald-600 text-white'
                      : 'bg-gray-100 dark:bg-charcoal-border text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-charcoal-surface'
                  }`}
                >
                  {day[0]}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="pt-4 flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} type="button">Cancel</Button>
          <Button variant="primary" type="submit">{initialData ? 'Update Reminder' : 'Set Reminder'}</Button>
        </div>
      </form>
    </Modal>
  );
};

export default SetReminderModal;
