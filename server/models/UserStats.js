const mongoose = require('mongoose');

const userStatsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  currentStreak: { type: Number, default: 0 },
  longestStreak: { type: Number, default: 0 },
  totalPrayersCompleted: { type: Number, default: 0 },
  lastPrayerDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('UserStats', userStatsSchema);
