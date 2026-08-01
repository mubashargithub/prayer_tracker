import React, { useState } from 'react';
import axios from 'axios';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { toast } from 'sonner';
import { Moon, ArrowLeft } from 'lucide-react';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      toast.error('Reset token is missing from the URL link');
      return;
    }
    if (!newPassword) {
      toast.error('New password is required');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');
      const response = await axios.post(`${API_BASE}/auth/reset-password`, {
        token,
        newPassword
      });
      setSuccess(true);
      toast.success(response.data.message || 'Password reset successfully!');
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Link is invalid or has expired.');
      toast.error(err.response?.data?.message || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-charcoal-base transition-colors duration-300 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 mb-4 shadow-sm">
          <Moon className="h-6 w-6 fill-emerald-600/10 dark:fill-emerald-400/10 rotate-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Reset Password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-10 border border-gray-100 dark:border-charcoal-border">
          {!token ? (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 w-12 h-12 mx-auto flex items-center justify-center border border-red-100 dark:border-red-900/50 font-bold">
                ✕
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Invalid Link</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                This password reset link is invalid or incomplete. Please check your email or request a new reset link.
              </p>
              <div className="pt-2">
                <Link to="/forgot-password" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 gap-1.5">
                  <ArrowLeft size={16} /> Request new link
                </Link>
              </div>
            </div>
          ) : success ? (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 w-12 h-12 mx-auto flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50">
                ✓
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Success!</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your password has been reset. Redirecting you to login...
              </p>
              <div className="pt-2">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 gap-1.5">
                  <ArrowLeft size={16} /> Go to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <Input
                label="New Password"
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="••••••••"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />

              <Input
                label="Confirm Password"
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/50">
                  <div className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" isLoading={loading}>
                  Reset Password
                </Button>
                <Link to="/login" className="inline-flex items-center justify-center text-sm font-medium text-emerald-600 hover:text-emerald-500 gap-1.5 pt-2">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
