const cron = require('node-cron');
const moment = require('moment-timezone');
const DuaReminder = require('../models/DuaReminder');
const User = require('../models/User');

const initScheduler = () => {
  // Run every minute
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Cron triggered: Checking for due Dua reminders...');
      
      // Get all active reminders
      const activeReminders = await DuaReminder.find({ isActive: true }).populate('userId', 'timezone notificationSettings');

      const nowUtc = moment().utc(); // Current exact minute in UTC
      
      for (let reminder of activeReminders) {
        if (!reminder.userId) continue;

        // 1. Timezone Handling
        // Convert current UTC time to the user's specific timezone to check if it's their "morning", etc.
        const userTimezone = reminder.userId.timezone || 'UTC';
        const userCurrentTime = nowUtc.clone().tz(userTimezone);
        
        // 2. Prevent Duplicate Triggers
        // We only want to trigger once per logical period (e.g. once per day for daily reminders).
        // If lastTriggeredAt exists, and it was triggered today (in user's timezone), skip.
        if (reminder.lastTriggeredAt) {
          const lastTriggered = moment(reminder.lastTriggeredAt).tz(userTimezone);
          if (lastTriggered.isSame(userCurrentTime, 'day') && reminder.frequency !== 'custom') {
            continue; // Already triggered today
          }
        }

        let isDue = false;

        // 3. Frequency Logic
        if (reminder.frequency === 'daily' && reminder.reminderTime) {
          // reminderTime format e.g. "08:00"
          const currentHHMM = userCurrentTime.format('HH:mm');
          if (currentHHMM === reminder.reminderTime) {
            isDue = true;
          }
        } 
        else if (reminder.frequency === 'weekly' && reminder.reminderTime && reminder.daysOfWeek) {
          const currentHHMM = userCurrentTime.format('HH:mm');
          const currentDay = userCurrentTime.day(); // 0-6 (Sun-Sat)
          
          if (currentHHMM === reminder.reminderTime && reminder.daysOfWeek.includes(currentDay)) {
            isDue = true;
          }
        }
        // *Custom cron logic handling would go here using parser libs like cron-parser

        // 4. Trigger Notification & Update DB
        if (isDue) {
          console.log(`Triggering reminder for User ${reminder.userId._id}, Dua: ${reminder.duaId}`);
          
          // --> PLUG IN REAL NOTIFICATIONS HERE <--
          // If using Web Push (PWA), you would fetch the user's pushSubscription from the DB here 
          // and call: webpush.sendNotification(subscription, payload)
          // If using Firebase: admin.messaging().sendToDevice(fcmToken, payload)

          // Update lastTriggeredAt to ensure it doesn't fire again for this cycle
          reminder.lastTriggeredAt = new Date();
          await reminder.save();
        }
      }
    } catch (err) {
      console.error('Error in cron scheduler:', err);
    }
  });
};

module.exports = initScheduler;
