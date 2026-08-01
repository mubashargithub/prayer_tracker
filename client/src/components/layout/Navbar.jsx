import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import { Moon, LogOut, User as UserIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../common/ThemeToggle';

const Navbar = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  return (
    <header className="bg-white dark:bg-charcoal-surface border-b border-gray-100 dark:border-charcoal-border sticky top-0 z-40 transition-colors duration-300">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/50">
              <Moon className="h-5 w-5 fill-emerald-600/10 dark:fill-emerald-400/10 rotate-12" />
            </div>
            <Link to="/dashboard" className="text-xl font-bold tracking-tight text-gray-900 dark:text-white flex items-center gap-1.5">
              Deen<span className="text-emerald-600 dark:text-emerald-400">Tracker</span>
            </Link>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user && (
              <div className="flex items-center gap-3 border-r border-gray-100 dark:border-charcoal-border pr-2 sm:pr-4">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{user.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                </div>
                <Link to="/profile" className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors border border-emerald-100/50 dark:border-emerald-800/50 focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="User Profile">
                  <UserIcon className="h-4 w-4" />
                </Link>
              </div>
            )}
            
            <ThemeToggle />
            
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-lg p-2 text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-charcoal-border hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
