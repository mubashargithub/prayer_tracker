import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarDays,
  UserRound,
  AlarmClock
} from 'lucide-react';
import KaabaIcon from '../icons/KaabaIcon';
import PrayingHandsIcon from '../icons/PrayingHandsIcon';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutGrid },
    { name: 'Prayers', path: '/prayers', icon: KaabaIcon },
    { name: 'Duas', path: '/duas', icon: PrayingHandsIcon },
    { name: 'Reminders', path: '/reminders', icon: AlarmClock },
    { name: 'History', path: '/history', icon: CalendarDays },
    { name: 'Profile', path: '/profile', icon: UserRound },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-charcoal-surface border-r border-gray-100 dark:border-charcoal-border flex-shrink-0 hidden md:flex flex-col min-h-[calc(100vh-4rem)] p-4 transition-colors duration-300">
      <nav className="space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border border-emerald-100/30 dark:border-emerald-800/50'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-charcoal-border hover:text-gray-900 dark:hover:text-gray-100 border border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
