const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String, required: true },
  timezone: { type: String, default: 'UTC' },
  avatarUrl: { type: String, default: '' },
  bio: { type: String, default: '', maxLength: 200 },
  location: { type: String, default: '' },
  lastLoginDate: { type: Date },
  
  preferences: {
    prayerCalculationMethod: { 
      type: String, 
      enum: ['MWL', 'ISNA', 'Egypt', 'Makkah', 'Karachi', 'Tehran', 'Jafari'],
      default: 'ISNA' 
    },
    madhab: {
      type: String,
      enum: ['Hanafi', 'Shafi', 'Maliki', 'Hanbali'],
      default: 'Shafi'
    },
    notificationSettings: {
      pushEnabled: { type: Boolean, default: true },
      emailEnabled: { type: Boolean, default: false },
      reminderSound: { type: Boolean, default: true }
    }
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date
}, { 
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
