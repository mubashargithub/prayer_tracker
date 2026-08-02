import React from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay,
  isToday
} from 'date-fns';
import { Tooltip } from 'react-tooltip';

const getColorClass = (percent, isPerfectDay) => {
  if (isPerfectDay) {
    return 'bg-amber-400 text-amber-950 dark:bg-amber-600 dark:text-amber-50 shadow-[0_0_10px_rgba(245,158,11,0.4)] border border-amber-300 dark:border-amber-500';
  }
  if (percent === 0) return 'bg-gray-100 text-gray-500 dark:bg-[#20293F] dark:text-gray-400 border border-gray-200/60 dark:border-charcoal-border';
  if (percent <= 40) return 'bg-emerald-50 text-emerald-800 dark:bg-emerald-900/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30';
  if (percent <= 70) return 'bg-emerald-100 text-emerald-900 dark:bg-emerald-900/30 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40';
  return 'bg-emerald-500 text-white dark:bg-emerald-600 dark:text-white border border-emerald-600 dark:border-emerald-500';
};

const MonthGridCalendar = ({ currentDate, dataMap, onDayClick }) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="w-full">
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1">
            {day}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd');
          const dayData = dataMap[dateStr] || {
            prayerCompletionPercent: 0,
            duaCompletionPercent: 0,
            overallScore: 0,
            isPerfectDay: false,
            remindersCompletedCount: 0
          };
          
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isCurrentDay = isToday(day);
          // If future date or not current month, it's non-interactive and faded. 
          const isFuture = day > new Date();

          let cellClasses = `
            relative flex flex-col items-center justify-center p-1 sm:p-2 rounded-lg sm:rounded-xl 
            min-h-[48px] sm:min-h-[64px] transition-all duration-200 select-none
          `;
          
          if (!isCurrentMonth) {
            cellClasses += " opacity-20 pointer-events-none";
          } else if (isFuture) {
            cellClasses += " opacity-40 cursor-not-allowed bg-gray-50 dark:bg-[#272C35] text-gray-300 dark:text-gray-600 border border-transparent";
          } else {
            cellClasses += " cursor-pointer hover:scale-105 hover:z-10 " + getColorClass(dayData.overallScore, dayData.isPerfectDay);
          }

          if (isCurrentDay) {
            cellClasses += " ring-2 ring-emerald-500 dark:ring-emerald-400 ring-offset-2 dark:ring-offset-charcoal-surface";
          }

          // Tooltip content
          let tooltipContent = "";
          if (!isFuture && isCurrentMonth) {
            tooltipContent = `
              <div class="text-sm">
                <p class="font-bold border-b border-white/20 pb-1 mb-1">${format(day, 'MMM d, yyyy')}</p>
                <p>Score: ${dayData.overallScore}%</p>
                <p>Prayers: ${dayData.prayerCompletionPercent}%</p>
                <p>Duas: ${dayData.duaCompletionPercent}%</p>
                ${dayData.remindersCompletedCount > 0 ? `<p class="text-amber-300">Reminders Completed: ${dayData.remindersCompletedCount}</p>` : ''}
                ${dayData.isPerfectDay ? `<p class="text-amber-400 font-bold mt-1 flex items-center gap-1">✨ Perfect Day!</p>` : ''}
              </div>
            `;
          }

          return (
            <div 
              key={day.toString()}
              className={cellClasses}
              onClick={() => !isFuture && isCurrentMonth && onDayClick(dateStr)}
              data-tooltip-id="calendar-tooltip"
              data-tooltip-html={tooltipContent}
            >
              <span className="text-sm font-semibold">{format(day, 'd')}</span>
              
              {/* Reminder Dots Container */}
              {!isFuture && isCurrentMonth && dayData.remindersCompletedCount > 0 && (
                <div className="absolute bottom-1 sm:bottom-1.5 flex gap-0.5">
                  {[...Array(Math.min(dayData.remindersCompletedCount, 3))].map((_, i) => (
                    <div key={i} className={`w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full ${dayData.isPerfectDay ? 'bg-amber-900 dark:bg-amber-100' : 'bg-current opacity-70'}`} />
                  ))}
                  {dayData.remindersCompletedCount > 3 && (
                    <span className="text-[8px] leading-none ml-0.5 opacity-70">+</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <Tooltip 
        id="calendar-tooltip" 
        className="z-50 !bg-gray-900 !text-white dark:!bg-gray-800 !rounded-lg !px-3 !py-2"
        globalEventOff="click"
      />
    </div>
  );
};

export default MonthGridCalendar;
