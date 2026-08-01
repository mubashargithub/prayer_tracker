const PrayerLog = require('../models/PrayerLog');
const DuaCompletionLog = require('../models/DuaCompletionLog');
const DuaReminder = require('../models/DuaReminder');
const mongoose = require('mongoose');
const { Parser } = require('json2csv');

// SECURITY EXPLANATION:
// All endpoints explicitly strictly match `userId: new mongoose.Types.ObjectId(req.user._id)` (or simple req.user._id for queries).
// This guarantees that data is isolated per tenant, preventing data leakage between users.
// The protect middleware sets req.user from the verified JWT.

// @desc    Get combined overview summary
// @route   GET /api/dashboard/summary
// @access  Private
const getSummary = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // 1. Today's prayer completion %
    const todayPrayers = await PrayerLog.find({ userId, date: today });
    const completedPrayers = todayPrayers.filter(p => p.status === 'completed').length;
    const todayCompletionPercent = (completedPrayers / 5) * 100;

    // 2. Active Dua Reminders count
    const activeReminders = await DuaReminder.countDocuments({ userId, isActive: true });

    // 3. Current & Longest Streaks (Prayer + Dua)
    const { streakCalculator } = require('../utils/streakCalculator');

    // Prayer Streak: Consecutive days where all 5 prayers were completed
    const datesWithCompletedPrayers = await PrayerLog.aggregate([
      { $match: { userId, status: 'completed' } },
      { $group: { _id: "$date", completedCount: { $sum: 1 } } },
      { $match: { completedCount: 5 } },
      { $sort: { _id: -1 } }
    ]);
    const { currentStreak: prayerStreak, longestStreak: longestPrayerStreak } = streakCalculator(datesWithCompletedPrayers);

    // Dua Streak: Consecutive days where at least 1 dua was completed
    const datesWithCompletedDuas = await DuaCompletionLog.aggregate([
      { $match: { userId, status: 'done' } },
      { $group: { _id: "$date", completedCount: { $sum: 1 } } },
      { $sort: { _id: -1 } }
    ]);
    const { currentStreak: duaStreak, longestStreak: longestDuaStreak } = streakCalculator(datesWithCompletedDuas);

    // 4. Weekly comparison (This rolling week vs Last rolling week)
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const fourteenDaysAgo = new Date(today);
    fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

    // Prayer weekly comparison aggregation
    const prayerComparison = await PrayerLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: fourteenDaysAgo },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: null,
          thisWeekCount: {
            $sum: { $cond: [{ $gte: ["$date", sevenDaysAgo] }, 1, 0] }
          },
          lastWeekCount: {
            $sum: { $cond: [{ $lt: ["$date", sevenDaysAgo] }, 1, 0] }
          }
        }
      }
    ]);
    const prayerComparisonData = prayerComparison[0] || { thisWeekCount: 0, lastWeekCount: 0 };

    // Dua weekly comparison aggregation
    const duaComparison = await DuaCompletionLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: fourteenDaysAgo },
          status: 'done'
        }
      },
      {
        $group: {
          _id: null,
          thisWeekCount: {
            $sum: { $cond: [{ $gte: ["$date", sevenDaysAgo] }, 1, 0] }
          },
          lastWeekCount: {
            $sum: { $cond: [{ $lt: ["$date", sevenDaysAgo] }, 1, 0] }
          }
        }
      }
    ]);
    const duaComparisonData = duaComparison[0] || { thisWeekCount: 0, lastWeekCount: 0 };

    res.status(200).json({
      todayCompletionPercent,
      activeReminders,
      streaks: {
        prayer: {
          current: prayerStreak,
          longest: longestPrayerStreak
        },
        dua: {
          current: duaStreak,
          longest: longestDuaStreak
        }
      },
      weeklyComparison: {
        prayers: {
          thisWeek: prayerComparisonData.thisWeekCount,
          lastWeek: prayerComparisonData.lastWeekCount
        },
        duas: {
          thisWeek: duaComparisonData.thisWeekCount,
          lastWeek: duaComparisonData.lastWeekCount
        }
      },
      // Keep backward compatibility
      prayerStreak,
      completedToday: completedPrayers
    });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching summary', error: err.message });
  }
};

// @desc    Get calendar heatmap data
// @route   GET /api/dashboard/calendar
// @access  Private
const getCalendar = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const today = new Date();
    const year = parseInt(req.query.year) || today.getUTCFullYear();
    const month = parseInt(req.query.month) || (today.getUTCMonth() + 1);

    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 1));

    // Aggregate prayer completions per day
    // INDEX USED: prayerLogSchema.index({ userId: 1, date: 1, prayerName: 1 })
    const prayerDaily = await PrayerLog.aggregate([
      { 
        $match: { 
          userId, 
          date: { $gte: startDate, $lt: endDate } 
        } 
      },
      {
        $group: {
          _id: "$date",
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          missed: { $sum: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] } },
          qaza: { $sum: { $cond: [{ $eq: ["$status", "qaza"] }, 1, 0] } }
        }
      }
    ]);

    // Aggregate dua completions per day
    // INDEX USED: duaCompletionLogSchema.index({ userId: 1, date: -1 })
    const duaDaily = await DuaCompletionLog.aggregate([
      { 
        $match: { 
          userId, 
          date: { $gte: startDate, $lt: endDate },
          status: 'done'
        } 
      },
      {
        $group: {
          _id: "$date",
          completed: { $sum: 1 }
        }
      }
    ]);

    // Format for frontend heatmaps (like GitHub contribution graph)
    const dailyMap = {};
    const numDays = new Date(year, month, 0).getDate();
    for (let d = 1; d <= numDays; d++) {
      const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      dailyMap[dateStr] = {
        date: dateStr,
        completedPrayers: 0,
        completedDuas: 0,
        totalCount: 0,
        intensity: 0
      };
    }

    prayerDaily.forEach(p => {
      const dateStr = p._id.toISOString().split('T')[0];
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].completedPrayers = p.completed;
        dailyMap[dateStr].totalCount += p.completed;
      }
    });

    duaDaily.forEach(d => {
      const dateStr = d._id.toISOString().split('T')[0];
      if (dailyMap[dateStr]) {
        dailyMap[dateStr].completedDuas = d.completed;
        dailyMap[dateStr].totalCount += d.completed;
      }
    });

    // Determine intensity (0 to 4) for heatmap colors
    Object.values(dailyMap).forEach(day => {
      const total = day.totalCount;
      if (total === 0) day.intensity = 0;
      else if (total <= 2) day.intensity = 1;
      else if (total <= 4) day.intensity = 2;
      else if (total <= 5) day.intensity = 3;
      else day.intensity = 4;
    });

    const result = Object.values(dailyMap).sort((a, b) => a.date.localeCompare(b.date));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching calendar heatmap', error: err.message });
  }
};

// @desc    Get trend data for charts
// @route   GET /api/dashboard/trends
// @access  Private
const getTrends = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const { range = 'week' } = req.query;
    const limitDays = range === 'month' ? 30 : 7;

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const cutoffDate = new Date(today);
    cutoffDate.setDate(cutoffDate.getDate() - limitDays + 1);

    // Aggregate prayer trends
    const prayerTrends = await PrayerLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: cutoffDate, $lte: today }
        }
      },
      {
        $group: {
          _id: "$date",
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          missed: { $sum: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] } },
          qaza: { $sum: { $cond: [{ $eq: ["$status", "qaza"] }, 1, 0] } }
        }
      }
    ]);

    // Aggregate dua trends
    const duaTrends = await DuaCompletionLog.aggregate([
      {
        $match: {
          userId,
          date: { $gte: cutoffDate, $lte: today },
          status: 'done'
        }
      },
      {
        $group: {
          _id: "$date",
          completed: { $sum: 1 }
        }
      }
    ]);

    // Fill missing dates to avoid gaps in chart visualization
    const trendsMap = {};
    for (let i = 0; i < limitDays; i++) {
      const d = new Date(cutoffDate);
      d.setDate(d.getDate() + i);
      const dateStr = d.toISOString().split('T')[0];
      trendsMap[dateStr] = {
        date: dateStr,
        prayer: { completed: 0, missed: 0, qaza: 0 },
        dua: { completed: 0 }
      };
    }

    prayerTrends.forEach(t => {
      const dateStr = t._id.toISOString().split('T')[0];
      if (trendsMap[dateStr]) {
        trendsMap[dateStr].prayer = {
          completed: t.completed,
          missed: t.missed,
          qaza: t.qaza
        };
      }
    });

    duaTrends.forEach(t => {
      const dateStr = t._id.toISOString().split('T')[0];
      if (trendsMap[dateStr]) {
        trendsMap[dateStr].dua = {
          completed: t.completed
        };
      }
    });

    const result = Object.values(trendsMap).sort((a, b) => a.date.localeCompare(b.date));
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trends', error: err.message });
  }
};

// @desc    Export combined history data to CSV
// @route   GET /api/dashboard/export
// @access  Private
const exportData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch prayer logs & dua completion logs
    const prayerLogs = await PrayerLog.find({ userId }).sort({ date: -1 }).lean();
    const duaLogs = await DuaCompletionLog.find({ userId })
      .populate('duaId', 'title')
      .sort({ date: -1 })
      .lean();

    const exportRows = [];

    // Map prayer logs
    prayerLogs.forEach(log => {
      exportRows.push({
        date: log.date ? log.date.toISOString().split('T')[0] : '',
        type: 'Prayer',
        name: log.prayerName,
        status: log.status,
        notes: log.notes || '',
        completedAt: log.completedAt ? log.completedAt.toISOString() : ''
      });
    });

    // Map dua completion logs
    duaLogs.forEach(log => {
      exportRows.push({
        date: log.date ? log.date.toISOString().split('T')[0] : '',
        type: 'Dua',
        name: log.duaId ? log.duaId.title : 'Deleted Dua',
        status: log.status,
        notes: '',
        completedAt: log.completedAt ? log.completedAt.toISOString() : ''
      });
    });

    // Sort descending by date, then by type
    exportRows.sort((a, b) => {
      if (a.date !== b.date) {
        return b.date.localeCompare(a.date);
      }
      return a.type.localeCompare(b.type);
    });

    // Generate CSV using json2csv (preferred for low memory footprint, non-blocking and sheet compatibility)
    const fields = ['date', 'type', 'name', 'status', 'notes', 'completedAt'];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(exportRows);

    res.header('Content-Type', 'text/csv');
    res.attachment('deen_tracker_history.csv');
    return res.send(csv);
  } catch (err) {
    res.status(500).json({ message: 'Error exporting data', error: err.message });
  }
};

module.exports = {
  getSummary,
  getCalendar,
  getTrends,
  exportData
};
