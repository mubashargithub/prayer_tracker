import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutGrid,
  CalendarDays,
  UserRound
} from 'lucide-react';
import KaabaIcon from '../icons/KaabaIcon';
import PrayingHandsIcon from '../icons/PrayingHandsIcon';

const BottomNavBar = () => {
  const menuItems = [
    { name: 'Home', path: '/dashboard', icon: LayoutGrid },
    { name: 'Prayers', path: '/prayers', icon: KaabaIcon },
    { name: 'Duas', path: '/duas', icon: PrayingHandsIcon },
    { name: 'History', path: '/history', icon: CalendarDays },
    { name: 'Profile', path: '/profile', icon: UserRound },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-charcoal-surface border-t border-gray-100 dark:border-charcoal-border z-50 px-2 sm:px-6 py-2 transition-colors duration-300 pb-safe">
      <ul className="flex justify-between items-center w-full">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.path} className="flex-1">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex flex-col items-center justify-center gap-1 p-2 rounded-xl transition-all min-h-[44px] min-w-[44px] active:scale-95 active:bg-gray-100 dark:active:bg-gray-800 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2px]' : 'stroke-[1.5px]'}`} />
                    <span className={`text-[10px] sm:text-xs font-medium ${isActive ? 'font-bold' : ''}`}>
                      {item.name}
                    </span>
                  </>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default BottomNavBar;
