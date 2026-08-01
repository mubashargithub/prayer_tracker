import React, { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';
import Button from '../../../components/common/Button';

const CALC_METHODS = ['MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi', 'Tehran', 'Jafari'];
const MADHABS = ['Hanafi', 'Shafi', 'Maliki', 'Hanbali'];

const PreferencesForm = ({ profile }) => {
  const { updatePreferences } = useProfile();
  const [formData, setFormData] = useState({
    prayerCalculationMethod: profile?.preferences?.prayerCalculationMethod || 'ISNA',
    madhab: profile?.preferences?.madhab || 'Shafi'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await updatePreferences(formData);
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
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Prayer Preferences</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Configure how your prayer times are calculated.</p>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Calculation Method
          </label>
          <select
            name="prayerCalculationMethod"
            value={formData.prayerCalculationMethod}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-charcoal-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-charcoal-surface text-gray-900 dark:text-gray-100"
          >
            {CALC_METHODS.map(method => (
              <option key={method} value={method}>{method}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Different regions use different conventions for calculating Fajr and Isha.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Preferred Madhab (Asr Calculation)
          </label>
          <select
            name="madhab"
            value={formData.madhab}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-200 dark:border-charcoal-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-charcoal-surface text-gray-900 dark:text-gray-100"
          >
            {MADHABS.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            Hanafi method delays Asr time later than other madhabs.
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </form>
  );
};

export default PreferencesForm;
