import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { toast } from 'sonner';
import { Moon, ArrowLeft } from 'lucide-react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Email address is required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      setEmailSent(true);
      toast.success(response.data.message || 'Reset instructions sent!');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
      toast.error(err.response?.data?.message || 'Error processing request');
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
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Forgot Password</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          We will send you instructions to reset your password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <Card className="py-8 px-10 border border-gray-100 dark:border-charcoal-border">
          {emailSent ? (
            <div className="text-center space-y-4">
              <div className="rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 p-3 w-12 h-12 mx-auto flex items-center justify-center border border-emerald-100 dark:border-emerald-800/50 font-bold">
                ✓
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Check your email</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                We've sent password reset instructions to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>.
              </p>
              <div className="pt-2">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-500 gap-1.5">
                  <ArrowLeft size={16} /> Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
              <Input
                label="Email Address"
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {error && (
                <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/50">
                  <div className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</div>
                </div>
              )}

              <div className="flex flex-col gap-3">
                <Button type="submit" className="w-full" isLoading={loading}>
                  Send Reset Link
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

export default ForgotPasswordPage;
