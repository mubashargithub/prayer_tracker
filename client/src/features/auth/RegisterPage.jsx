import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser, clearError } from './authSlice';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { toast } from 'sonner';
import { Moon } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate, dispatch]);

  const validate = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!name.trim()) {
      errors.name = 'Full name is required';
    }
    if (!email) {
      errors.email = 'Email is required';
    } else if (!emailRegex.test(email)) {
      errors.email = 'Please enter a valid email address';
    }
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resultAction = await dispatch(registerUser({ name, email, password, timezone }));
    if (registerUser.fulfilled.match(resultAction)) {
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } else {
      toast.error(resultAction.payload || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-charcoal-base transition-colors duration-300 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 mb-4 shadow-sm">
          <Moon className="h-6 w-6 fill-emerald-600/10 dark:fill-emerald-400/10 rotate-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 w-full sm:mx-auto sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10 border border-gray-100 dark:border-charcoal-border mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <Input
              label="Full Name"
              id="name"
              name="name"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={validationErrors.name}
              required
            />

            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email}
              required
            />

            <Input
              label="Password"
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={validationErrors.password}
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
              error={validationErrors.confirmPassword}
              required
            />

            <div className="flex flex-col gap-1 w-full">
              <label htmlFor="timezone" className="text-sm font-medium text-gray-700 dark:text-gray-300 text-left">
                Timezone
              </label>
              <select
                id="timezone"
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-charcoal-border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-0 text-gray-900 dark:text-gray-100 bg-white dark:bg-charcoal-base"
              >
                <option value="UTC">UTC</option>
                <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="Europe/London">Europe/London (GMT+1)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="Asia/Riyadh">Asia/Riyadh (Riyadh)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
              </select>
            </div>

            {error && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/50">
                <div className="flex">
                  <div className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Create Account
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
