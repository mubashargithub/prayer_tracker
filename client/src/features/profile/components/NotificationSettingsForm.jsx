import React, { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';
import Button from '../../../components/common/Button';

const NotificationSettingsForm = ({ profile }) => {
  const { updateNotificationSettings } = useProfile();
  
  const [settings, setSettings] = useState({
    pushEnabled: profile?.preferences?.notificationSettings?.pushEnabled ?? true,
    emailEnabled: profile?.preferences?.notificationSettings?.emailEnabled ?? false,
    reminderSound: profile?.preferences?.notificationSettings?.reminderSound ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updateNotificationSettings(settings);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Notification Settings</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage how and when you receive reminders.</p>
      </div>

      <div className="space-y-4">
        {/* Toggle Items */}
        {[
          { key: 'pushEnabled', label: 'Push Notifications', desc: 'Receive reminders in your browser' },
          { key: 'emailEnabled', label: 'Email Notifications', desc: 'Receive daily summaries via email' },
          { key: 'reminderSound', label: 'Reminder Sounds', desc: 'Play a sound when a reminder triggers' }
        ].map(({ key, label, desc }) => (
          <div key={key} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-charcoal-border/30 rounded-xl border border-gray-100 dark:border-charcoal-border">
            <div>
              <h4 className="text-sm font-medium text-gray-900 dark:text-white">{label}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{desc}</p>
            </div>
            <button
              type="button"
              onClick={() => handleToggle(key)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-charcoal-base ${
                settings[key] ? 'bg-emerald-500' : 'bg-gray-200 dark:bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings[key] ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? 'Saving...' : 'Save Settings'}
        </Button>
      </div>
    </form>
  );
};

export default NotificationSettingsForm;
