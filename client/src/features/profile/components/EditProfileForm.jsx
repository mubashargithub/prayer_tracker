import React, { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';

const TIMEZONES = [
  'UTC', 'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Asia/Dubai', 'Asia/Karachi', 'Asia/Dhaka', 'Asia/Jakarta'
]; // Simplified list for brevity

const EditProfileForm = ({ profile }) => {
  const { updateProfile } = useProfile();
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    bio: profile?.bio || '',
    location: profile?.location || '',
    timezone: profile?.timezone || 'UTC'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    if (!formData.name.trim()) {
      toast.error('Name is required');
      setLoading(false);
      return;
    }

    const res = await updateProfile(formData);
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
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Personal Information</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Update your basic profile details.</p>
      </div>

      <div className="space-y-4">
        <Input
          label="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="e.g. Abdullah"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            maxLength={200}
            rows={3}
            placeholder="A short bio about yourself..."
            className="w-full px-4 py-2 border border-gray-200 dark:border-charcoal-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-charcoal-surface text-gray-900 dark:text-gray-100 placeholder-gray-400"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-right">
            {formData.bio.length}/200
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Location / City"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. London, UK"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Timezone
            </label>
            <select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 dark:border-charcoal-border rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none transition-all bg-white dark:bg-charcoal-surface text-gray-900 dark:text-gray-100"
            >
              {TIMEZONES.map(tz => (
                <option key={tz} value={tz}>{tz}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button type="submit" disabled={loading} className="w-full md:w-auto">
          {loading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};

export default EditProfileForm;
