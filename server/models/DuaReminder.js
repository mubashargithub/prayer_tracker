const mongoose = require('mongoose');

const duaReminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['dua', 'prayer'], default: 'dua' },
  duaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dua' },
  prayerName: { type: String, enum: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] },
  
  frequency: { 
    type: String, 
    enum: ['daily', 'weekly', 'custom'], 
    required: true 
  },
  cronExpression: { type: String }, 
  reminderTime: { type: String }, 
  daysOfWeek: [{ type: Number, min: 0, max: 6 }], 
  
  isActive: { type: Boolean, default: true },
  lastTriggeredAt: { type: Date }
}, { timestamps: true });

duaReminderSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('DuaReminder', duaReminderSchema);
