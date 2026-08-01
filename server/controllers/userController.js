const User = require('../models/User');
const PrayerLog = require('../models/PrayerLog');
const Dua = require('../models/Dua');
const DuaReminder = require('../models/DuaReminder');
const DuaCompletionLog = require('../models/DuaCompletionLog');
const UserStats = require('../models/UserStats');
const bcrypt = require('bcryptjs');

// Get current user profile
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash -resetPasswordToken -resetPasswordExpire');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Profile info
const updateProfile = async (req, res) => {
  try {
    const { name, bio, location, timezone } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;
    if (timezone) user.timezone = timezone;

    await user.save();
    res.json({ message: 'Profile updated successfully', user: { name: user.name, bio: user.bio, location: user.location, timezone: user.timezone } });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Notification Settings
const updateNotificationSettings = async (req, res) => {
  try {
    const { pushEnabled, emailEnabled, reminderSound } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (pushEnabled !== undefined) user.preferences.notificationSettings.pushEnabled = pushEnabled;
    if (emailEnabled !== undefined) user.preferences.notificationSettings.emailEnabled = emailEnabled;
    if (reminderSound !== undefined) user.preferences.notificationSettings.reminderSound = reminderSound;

    await user.save();
    res.json({ message: 'Notification settings updated', settings: user.preferences.notificationSettings });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Preferences (Madhab, Calc Method)
const updatePreferences = async (req, res) => {
  try {
    const { prayerCalculationMethod, madhab } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (prayerCalculationMethod) user.preferences.prayerCalculationMethod = prayerCalculationMethod;
    if (madhab) user.preferences.madhab = madhab;

    await user.save();
    res.json({ message: 'Preferences updated', preferences: user.preferences });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update Avatar
const updateAvatar = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    /*
     * CLOUDINARY INTEGRATION (Recommended for production):
     * 1. Install packages: npm install cloudinary multer-storage-cloudinary
     * 2. Configure in a separate file (e.g., cloudinary.js):
     *    const cloudinary = require('cloudinary').v2;
     *    cloudinary.config({ cloud_name: 'xxx', api_key: 'yyy', api_secret: 'zzz' });
     * 3. Set up multer:
     *    const { CloudinaryStorage } = require('multer-storage-cloudinary');
     *    const storage = new CloudinaryStorage({ cloudinary, params: { folder: 'avatars' } });
     * 4. In this controller, `req.file.path` will be the Cloudinary URL.
     */

    // For local development: req.file.filename will be the saved file name.
    // Assuming express is serving /uploads statically.
    user.avatarUrl = `/uploads/${req.file.filename}`;
    await user.save();

    res.json({ message: 'Avatar updated', avatarUrl: user.avatarUrl });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password' });
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(newPassword, salt);
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Account
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    // Cascade delete everything related to the user
    await PrayerLog.deleteMany({ user: userId });
    await Dua.deleteMany({ user: userId });
    await DuaReminder.deleteMany({ user: userId });
    await DuaCompletionLog.deleteMany({ user: userId });
    await UserStats.deleteOne({ user: userId });
    
    // Finally delete user
    await User.findByIdAndDelete(userId);

    // Clear refresh token cookie
    res.cookie('refreshToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      expires: new Date(0)
    });

    res.json({ message: 'Account and all associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Achievements
const getAchievements = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await UserStats.findOne({ user: userId });
    const duaCount = await Dua.countDocuments({ user: userId });

    const badges = [
      { id: 'streak_3', title: '3-Day Streak', description: 'Log prayers for 3 consecutive days', unlocked: stats?.longestStreak >= 3, icon: 'Flame' },
      { id: 'streak_7', title: '7-Day Streak', description: 'Log prayers for 7 consecutive days', unlocked: stats?.longestStreak >= 7, icon: 'Flame' },
      { id: 'streak_30', title: '30-Day Streak', description: 'Log prayers for 30 consecutive days', unlocked: stats?.longestStreak >= 30, icon: 'Flame' },
      { id: 'dua_1', title: 'First Dua', description: 'Add your first Dua', unlocked: duaCount >= 1, icon: 'BookHeart' },
      { id: 'dua_10', title: 'Dua Collector', description: 'Add 10 Duas', unlocked: duaCount >= 10, icon: 'BookHeart' },
      { id: 'early_bird', title: 'Early Bird', description: 'Joined early', unlocked: true, icon: 'Sun' },
    ];

    res.json({ badges });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateNotificationSettings,
  updatePreferences,
  updateAvatar,
  changePassword,
  deleteAccount,
  getAchievements
};
