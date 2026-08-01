const mongoose = require('mongoose');

const prayerLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  prayerName: { 
    type: String, 
    enum: ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['completed', 'missed', 'qaza', 'pending'], 
    default: 'pending' 
  },
  completedAt: { type: Date },
  notes: { type: String, maxlength: 500 }
});

prayerLogSchema.index({ userId: 1, date: 1, prayerName: 1 }, { unique: true });

module.exports = mongoose.model('PrayerLog', prayerLogSchema);
