import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from './authSlice';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { toast } from 'sonner';
import { Moon } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    const resultAction = await dispatch(loginUser({ email, password }));
    if (loginUser.fulfilled.match(resultAction)) {
      const res = resultAction.payload;
      if (res.user) {
        toast.success(`Assalamu Alaikum, ${res.user.name}!`);
        navigate('/dashboard', { replace: true });
      }
    } else {
      toast.error(resultAction.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-charcoal-base transition-colors duration-300 flex flex-col justify-center py-12 px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md flex flex-col items-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50 mb-4 shadow-sm">
          <Moon className="h-6 w-6 fill-emerald-600/10 dark:fill-emerald-400/10 rotate-12" />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Sign in to your account</h2>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Or{' '}
          <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors">
            create a new account
          </Link>
        </p>
      </div>

      <div className="mt-8 w-full sm:mx-auto sm:max-w-md">
        <Card className="py-8 px-4 sm:px-10 border border-gray-100 dark:border-charcoal-border mx-4 sm:mx-0">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <Input
              label="Email Address"
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={validationErrors.email || (error?.includes('email') ? error : null)}
              required
            />

            <div>
              <div className="flex items-center justify-between mb-1">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                    Forgot your password?
                  </Link>
                </div>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 text-gray-900 dark:text-gray-100 bg-white dark:bg-charcoal-base placeholder-gray-400 transition-all ${
                  validationErrors.password || (error?.includes('password') ? error : null)
                    ? 'border-red-300 dark:border-red-500/50 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900/50'
                    : 'border-gray-300 dark:border-charcoal-border focus:border-emerald-500 focus:ring-emerald-100 dark:focus:ring-emerald-900/30'
                }`}
                required
              />
              {(validationErrors.password || (error?.includes('password') ? error : null)) && (
                <span className="text-xs text-red-500 text-left block mt-1">
                  {validationErrors.password || error}
                </span>
              )}
            </div>

            {error && !error.includes('email') && !error.includes('password') && (
              <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 border border-red-100 dark:border-red-900/50">
                <div className="flex">
                  <div className="text-sm text-red-700 dark:text-red-400 font-medium">{error}</div>
                </div>
              </div>
            )}

            <div>
              <Button type="submit" className="w-full" isLoading={loading}>
                Sign In
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
