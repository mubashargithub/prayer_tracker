import React, { useMemo } from 'react';
import { format, subDays, startOfWeek, addDays, isSameDay } from 'date-fns';
import { Tooltip } from 'react-tooltip';

const getColorClass = (percent, isPerfectDay) => {
  if (isPerfectDay) return 'bg-amber-400 dark:bg-amber-500';
  if (percent === 0) return 'bg-gray-100 dark:bg-[#272C35]';
  if (percent <= 40) return 'bg-emerald-200 dark:bg-[#064e3b]';
  if (percent <= 70) return 'bg-emerald-400 dark:bg-[#065f46]';
  return 'bg-emerald-600 dark:bg-[#047857]';
};

const YearlyOverview = ({ dataMap, onDayClick }) => {
  const weeks = useMemo(() => {
    const today = new Date();
    // We want 52 weeks ago, starting from Sunday
    const startDate = startOfWeek(subDays(today, 364));
    const weeksArray = [];
    
    let currentDay = startDate;
    for (let w = 0; w < 53; w++) {
      const week = [];
      for (let d = 0; d < 7; d++) {
        week.push(currentDay);
        currentDay = addDays(currentDay, 1);
      }
      weeksArray.push(week);
      if (currentDay > today) break;
    }
    return weeksArray;
  }, []);

  return (
    <div className="w-full overflow-x-auto pb-4 pt-2 hide-scrollbar">
      <div className="inline-flex gap-1 mx-auto min-w-max">
        {weeks.map((week, wIdx) => (
          <div key={wIdx} className="flex flex-col gap-1">
            {week.map((day, dIdx) => {
              const dateStr = format(day, 'yyyy-MM-dd');
              const dayData = dataMap[dateStr] || {
                prayerCompletionPercent: 0,
                duaCompletionPercent: 0,
                overallScore: 0,
                isPerfectDay: false,
                remindersCompletedCount: 0
              };
              
              const isFuture = day > new Date();
              const isTodayDate = isSameDay(day, new Date());

              let cellClasses = `w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] transition-colors duration-200 ${getColorClass(dayData.overallScore, dayData.isPerfectDay)}`;
              
              if (isFuture) {
                cellClasses = "w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] bg-transparent"; // Hide future days completely in yearly view for cleaner look, or fade them. Let's make them transparent so grid stays intact.
              } else {
                cellClasses += " cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-emerald-500 dark:hover:ring-offset-charcoal-surface";
              }

              if (isTodayDate) {
                cellClasses += " ring-1 ring-offset-1 ring-gray-400 dark:ring-gray-500";
              }

              let tooltipContent = "";
              if (!isFuture) {
                tooltipContent = `
                  <div class="text-xs">
                    <p class="font-bold border-b border-white/20 pb-1 mb-1">${format(day, 'MMM d, yyyy')}</p>
                    <p>Score: ${dayData.overallScore}%</p>
                    <p>Prayers: ${dayData.prayerCompletionPercent}% | Duas: ${dayData.duaCompletionPercent}%</p>
                    ${dayData.remindersCompletedCount > 0 ? `<p class="text-amber-300">Reminders: ${dayData.remindersCompletedCount}</p>` : ''}
                    ${dayData.isPerfectDay ? `<p class="text-amber-400 font-bold mt-1">✨ Perfect Day!</p>` : ''}
                  </div>
                `;
              }

              return (
                <div
                  key={dIdx}
                  className={cellClasses}
                  onClick={() => !isFuture && onDayClick(dateStr)}
                  data-tooltip-id="yearly-tooltip"
                  data-tooltip-html={tooltipContent}
                />
              );
            })}
          </div>
        ))}
      </div>
      <Tooltip 
        id="yearly-tooltip" 
        className="z-50 !bg-gray-900 !text-white dark:!bg-gray-800 !rounded-lg !px-3 !py-2"
        globalEventOff="click"
      />
    </div>
  );
};

export default YearlyOverview;
