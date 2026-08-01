const PrayerLog = require('../models/PrayerLog');
const mongoose = require('mongoose');

// @desc    Mark a specific prayer
// @route   POST /api/prayers/mark
// @access  Private
const markPrayer = async (req, res) => {
  try {
    const { date, prayerName, status, notes } = req.body;
    
    // Normalize date to start of the day (midnight UTC) to avoid time zone issues in basic matching
    const logDate = new Date(date);
    logDate.setUTCHours(0, 0, 0, 0);

    // Upsert (Update if exists, Create if not)
    const prayerLog = await PrayerLog.findOneAndUpdate(
      { userId: req.user._id, date: logDate, prayerName },
      { 
        status, 
        notes, 
        completedAt: status === 'completed' ? new Date() : null 
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(prayerLog);
  } catch (err) {
    res.status(500).json({ message: 'Error marking prayer', error: err.message });
  }
};

// @desc    Get today's prayer status (auto-create if missing)
// @route   GET /api/prayers/today
// @access  Private
const getTodayPrayers = async (req, res) => {
  try {
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    let prayers = await PrayerLog.find({ userId: req.user._id, date: today });
    const standardPrayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    // If less than 5 entries exist for today, create the missing ones as 'missed' initially
    if (prayers.length < 5) {
      const existingNames = prayers.map(p => p.prayerName);
      const missing = standardPrayers.filter(p => !existingNames.includes(p));

      const newEntries = missing.map(name => ({
        userId: req.user._id,
        date: today,
        prayerName: name,
        status: 'pending'
      }));

      if (newEntries.length > 0) {
        await PrayerLog.insertMany(newEntries);
        prayers = await PrayerLog.find({ userId: req.user._id, date: today });
      }
    }

    // Sort logically
    const order = { 'Fajr': 1, 'Dhuhr': 2, 'Asr': 3, 'Maghrib': 4, 'Isha': 5 };
    prayers.sort((a, b) => order[a.prayerName] - order[b.prayerName]);

    res.status(200).json(prayers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching today prayers', error: err.message });
  }
};

// @desc    Get prayer history with pagination and filters
// @route   GET /api/prayers/history
// @access  Private
const getHistory = async (req, res) => {
  try {
    const { startDate, endDate, prayerName, status, page = 1, limit = 10 } = req.query;
    
    let query = { userId: req.user._id };

    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (prayerName) query.prayerName = prayerName;
    if (status) query.status = status;

    const skip = (page - 1) * limit;

    const logs = await PrayerLog.find(query)
      .sort({ date: -1 })
      .skip(Number(skip))
      .limit(Number(limit));

    const total = await PrayerLog.countDocuments(query);

    res.status(200).json({
      logs,
      page: Number(page),
      pages: Math.ceil(total / limit),
      total
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
};

// @desc    Update a specific prayer log
// @route   PUT /api/prayers/:id
// @access  Private
const updatePrayer = async (req, res) => {
  try {
    const { status, notes } = req.body;
    const log = await PrayerLog.findOne({ _id: req.params.id, userId: req.user._id });

    if (!log) return res.status(404).json({ message: 'Prayer log not found' });

    log.status = status || log.status;
    log.notes = notes !== undefined ? notes : log.notes;
    
    if (status === 'completed' && log.status !== 'completed') {
      log.completedAt = new Date();
    }

    const updated = await log.save();
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating log', error: err.message });
  }
};

// @desc    Delete a wrong entry
// @route   DELETE /api/prayers/:id
// @access  Private
const deletePrayer = async (req, res) => {
  try {
    const log = await PrayerLog.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!log) return res.status(404).json({ message: 'Prayer log not found or unauthorized' });

    res.status(200).json({ message: 'Log deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting log', error: err.message });
  }
};

// @desc    Get aggregated stats (aggregation pipeline)
// @route   GET /api/prayers/stats
// @access  Private
const getStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // Aggregation 1: Overall completion rates and most missed prayer
    const overallStats = await PrayerLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      { 
        $group: {
          _id: "$prayerName",
          total: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          missed: { $sum: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] } }
        }
      }
    ]);

    // Aggregation 2: Fetch raw completed dates for streak calculation
    // Note: Doing complex sequential streak math purely in a pipeline is very difficult.
    // It's cleaner to pull distinct completed dates and calculate the streak in Node.js.
    const datesWithCompletedPrayers = await PrayerLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), status: 'completed' } },
      { $group: { _id: "$date", completedCount: { $sum: 1 } } },
      { $match: { completedCount: 5 } }, // Only count days where all 5 were completed (Strict Streak)
      { $sort: { _id: -1 } }
    ]);

    // Calculate Streaks
    const { streakCalculator } = require('../utils/streakCalculator');
    const { currentStreak, longestStreak } = streakCalculator(datesWithCompletedPrayers);

    // Find most missed
    let mostMissed = null;
    let maxMissed = -1;
    overallStats.forEach(stat => {
      if (stat.missed > maxMissed) {
        maxMissed = stat.missed;
        mostMissed = stat._id;
      }
    });

    // Calculate weekly stats
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setUTCHours(0, 0, 0, 0);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const weeklyStats = await PrayerLog.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId), date: { $gte: sevenDaysAgo } } },
      { 
        $group: {
          _id: null,
          totalWeekly: { $sum: 1 },
          completedWeekly: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
        }
      }
    ]);

    const totalWeekly = weeklyStats.length > 0 ? weeklyStats[0].totalWeekly : 0;
    const completedWeekly = weeklyStats.length > 0 ? weeklyStats[0].completedWeekly : 0;

    res.status(200).json({
      currentStreak,
      longestStreak,
      mostMissed,
      breakdown: overallStats,
      totalWeekly,
      completedWeekly
    });

  } catch (err) {
    res.status(500).json({ message: 'Error fetching stats', error: err.message });
  }
};

module.exports = {
  markPrayer,
  getTodayPrayers,
  getHistory,
  updatePrayer,
  deletePrayer,
  getStats
};
