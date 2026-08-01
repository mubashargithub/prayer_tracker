import React from 'react';
import { Flame, BookHeart, Sun, Award } from 'lucide-react';

const iconMap = {
  Flame: Flame,
  BookHeart: BookHeart,
  Sun: Sun,
  Award: Award
};

const AchievementsGrid = ({ achievements }) => {
  if (!achievements || achievements.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No achievements loaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Your Achievements</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Unlock badges by staying consistent with your prayers and duas.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {achievements.map((badge) => {
          const IconComponent = iconMap[badge.icon] || Award;
          return (
            <div 
              key={badge.id}
              className={`p-4 rounded-xl border flex flex-col items-center text-center transition-all ${
                badge.unlocked 
                  ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800/50' 
                  : 'bg-gray-50 dark:bg-charcoal-border/30 border-gray-200 dark:border-charcoal-border opacity-70 grayscale'
              }`}
              title={badge.description}
            >
              <div className={`p-3 rounded-full mb-3 ${
                badge.unlocked 
                  ? 'bg-emerald-100 dark:bg-emerald-800/40 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400'
              }`}>
                <IconComponent className="w-8 h-8" />
              </div>
              <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                {badge.title}
              </h4>
              <p className="text-xs mt-1 text-gray-500 dark:text-gray-400 line-clamp-2">
                {badge.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AchievementsGrid;
