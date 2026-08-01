import React, { useState } from 'react';
import { useProfile } from '../useProfile';
import { toast } from 'sonner';
import Button from '../../../components/common/Button';
import Input from '../../../components/common/Input';
import { ShieldCheck } from 'lucide-react';

const ChangePasswordForm = () => {
  const { changePassword } = useProfile();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const res = await changePassword({
      currentPassword: formData.currentPassword,
      newPassword: formData.newPassword
    });

    if (res.success) {
      toast.success(res.message);
      setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center">
          <ShieldCheck className="w-5 h-5 mr-2 text-emerald-500" />
          Change Password
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Ensure your account is using a long, random password to stay secure.</p>
      </div>

      <div className="space-y-4 max-w-md">
        <Input
          label="Current Password"
          type="password"
          name="currentPassword"
          value={formData.currentPassword}
          onChange={handleChange}
          required
        />
        <Input
          label="New Password"
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />
        <Input
          label="Confirm New Password"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-start">
        <Button type="submit" disabled={loading}>
          {loading ? 'Updating...' : 'Update Password'}
        </Button>
      </div>
    </form>
  );
};

export default ChangePasswordForm;
