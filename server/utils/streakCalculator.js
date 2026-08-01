/**
 * Calculates current and longest streaks based on an array of dates where a user completed their goal.
 * @param {Array} dateObjects - Array of objects like { _id: Date } sorted descending (newest first).
 * @returns {Object} { currentStreak, longestStreak }
 */
const streakCalculator = (dateObjects) => {
  if (!dateObjects || dateObjects.length === 0) {
    return { currentStreak: 0, longestStreak: 0 };
  }

  // Convert to pure date strings (YYYY-MM-DD) for easy comparison
  const dates = dateObjects.map(d => d._id.toISOString().split('T')[0]);
  
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const todayStr = today.toISOString().split('T')[0];
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Check if streak is currently active (either prayed today or yesterday)
  let isStreakActive = dates[0] === todayStr || dates[0] === yesterdayStr;

  for (let i = 0; i < dates.length; i++) {
    const current = new Date(dates[i]);
    
    if (i === 0) {
      tempStreak = 1;
    } else {
      const previous = new Date(dates[i - 1]);
      // Difference in days between this date and the next most recent date
      const diffTime = Math.abs(previous - current);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        tempStreak++;
      } else if (diffDays > 1) {
        // Break in streak
        if (tempStreak > longestStreak) longestStreak = tempStreak;
        
        // If we are evaluating the very first cluster of dates, that determines the current streak
        if (isStreakActive && currentStreak === 0) {
          currentStreak = tempStreak;
        }
        
        tempStreak = 1; // reset for the next historical cluster
      }
    }
  }

  // Final check at the end of the loop
  if (tempStreak > longestStreak) longestStreak = tempStreak;
  if (isStreakActive && currentStreak === 0) {
    currentStreak = tempStreak;
  }

  return { currentStreak, longestStreak };
};

module.exports = { streakCalculator };
