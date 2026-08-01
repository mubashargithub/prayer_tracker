import React from 'react';
import { motion } from 'framer-motion';
import { Sunrise, Sun, Sunset, Moon, CloudMoon, Check, X, Clock } from 'lucide-react';

const ICONS = {
  Fajr: Sunrise,
  Dhuhr: Sun,
  Asr: Sunset,
  Maghrib: CloudMoon,
  Isha: Moon
};

const TIMES = {
  Fajr: 'Dawn',
  Dhuhr: 'Noon',
  Asr: 'Afternoon',
  Maghrib: 'Sunset',
  Isha: 'Night'
};

const STATUS_COLORS = {
  pending: 'bg-gray-50 dark:bg-charcoal-surface border-gray-200 dark:border-charcoal-border text-gray-500 dark:text-gray-400',
  completed: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-600 dark:text-emerald-400',
  qaza: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/50 text-amber-600 dark:text-amber-400',
  missed: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-600 dark:text-red-400'
};

const PrayerCard = ({ name, status = 'pending', onStatusChange }) => {
  const Icon = ICONS[name] || Sun;
  
  // Animation variants
  const cardVariants = {
    initial: { scale: 1 },
    tap: { scale: 0.98 },
    hover: { y: -2 }
  };

  const handleToggle = () => {
    // Cycle: pending -> completed -> qaza -> missed -> pending
    if (status === 'pending' || status === 'missed') onStatusChange(name, 'completed');
    else if (status === 'completed') onStatusChange(name, 'qaza');
    else if (status === 'qaza') onStatusChange(name, 'missed');
    else onStatusChange(name, 'pending');
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      className={`relative p-4 md:p-6 rounded-2xl border-2 transition-colors duration-300 flex items-center justify-between cursor-pointer shadow-sm ${STATUS_COLORS[status]}`}
      onClick={handleToggle}
    >
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full transition-colors duration-300 ${
          status === 'completed' ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400' :
          status === 'qaza' ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400' :
          status === 'missed' ? 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400' :
          'bg-gray-100 dark:bg-charcoal-border text-gray-600 dark:text-gray-400'
        }`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <p className={`text-sm opacity-80`}>{TIMES[name]}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={`flex items-center justify-center w-12 h-12 sm:w-11 sm:h-11 rounded-full border-2 transition-colors duration-300 ${
          status === 'completed' ? 'bg-emerald-500 dark:bg-emerald-600 border-emerald-500 dark:border-emerald-600 text-white' :
          status === 'qaza' ? 'bg-amber-500 dark:bg-amber-600 border-amber-500 dark:border-amber-600 text-white' :
          status === 'missed' ? 'bg-red-500 dark:bg-red-600 border-red-500 dark:border-red-600 text-white' :
          'bg-white dark:bg-charcoal-base border-gray-300 dark:border-charcoal-border text-transparent'
        }`}>
          {status === 'completed' && <Check className="w-5 h-5 sm:w-5 sm:h-5" />}
          {status === 'qaza' && <X className="w-5 h-5 sm:w-5 sm:h-5" />}
          {status === 'missed' && <X className="w-5 h-5 sm:w-5 sm:h-5" />}
          {status === 'pending' && <Clock className="w-5 h-5 sm:w-5 sm:h-5 text-gray-300 dark:text-gray-500" />}
        </div>
      </div>
    </motion.div>
  );
};

export default PrayerCard;
