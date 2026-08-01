const PrayerLog = require('../models/PrayerLog');
const DuaCompletionLog = require('../models/DuaCompletionLog');
const UserStats = require('../models/UserStats');
const mongoose = require('mongoose');

// Helper to normalize dates
const startOfDay = (date) => new Date(new Date(date).setUTCHours(0,0,0,0));
const endOfDay = (date) => new Date(new Date(date).setUTCHours(23,59,59,999));

// 1 & 2. GET /api/history (with or without filters)
const getHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 20, startDate, endDate, type, status, search } = req.query;
    const skip = (page - 1) * limit;

    let prayerQuery = { userId };
    let duaQuery = { userId };

    if (startDate && endDate) {
      const dateFilter = { $gte: startOfDay(startDate), $lte: endOfDay(endDate) };
      prayerQuery.date = dateFilter;
      duaQuery.date = dateFilter;
    }

    if (status) {
      if (['completed', 'missed', 'qaza'].includes(status)) {
        prayerQuery.status = status;
      }
      if (['done', 'skipped'].includes(status)) {
        duaQuery.status = status;
      }
    }

    if (search) {
      // Very basic search, assuming search by prayer name or dua context
      prayerQuery.prayerName = { $regex: search, $options: 'i' };
      // Note: for Duas, we'd normally need to populate then filter, but simple logic here
    }

    let combinedLogs = [];

    // Fetch prayers if type is not specifically 'dua'
    if (!type || type === 'prayers') {
      const prayers = await PrayerLog.find(prayerQuery)
        .sort({ date: -1 })
        .lean();
      
      const mappedPrayers = prayers.map(p => ({
        ...p,
        itemType: 'prayer',
        timestamp: p.completedAt || p.date // Use completedAt for precise sorting if available
      }));
      combinedLogs = [...combinedLogs, ...mappedPrayers];
    }

    // Fetch duas if type is not specifically 'prayers'
    if (!type || type === 'duas') {
      const duas = await DuaCompletionLog.find(duaQuery)
        .populate('duaId', 'title arabicText')
        .sort({ date: -1 })
        .lean();

      const mappedDuas = duas.map(d => ({
        ...d,
        itemType: 'dua',
        timestamp: d.completedAt || d.date
      }));
      combinedLogs = [...combinedLogs, ...mappedDuas];
    }

    // Sort combined by timestamp descending
    combinedLogs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    // Manual Pagination (since we combine two collections in memory)
    // For large scale, we'd use aggregation, but this works well for individual user logs
    const paginatedLogs = combinedLogs.slice(skip, skip + parseInt(limit));
    const total = combinedLogs.length;

    res.json({
      logs: paginatedLogs,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 3. GET /api/history/day/:date
const getDayDetail = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date } = req.params; // Expects YYYY-MM-DD
    const queryDate = startOfDay(date);

    const prayers = await PrayerLog.find({ 
      userId, 
      date: { $gte: queryDate, $lte: endOfDay(date) } 
    });

    const duas = await DuaCompletionLog.find({
      userId,
      date: { $gte: queryDate, $lte: endOfDay(date) }
    }).populate('duaId');

    res.json({
      date: queryDate,
      prayers,
      duas
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 4. GET /api/history/monthly-summary/:year/:month (or /api/history/summary?startDate=X&endDate=Y)
const getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user._id || new mongoose.Types.ObjectId(req.user.id);
    let startDate, endDate;
    
    if (req.params.year && req.params.month) {
      const year = req.params.year;
      const month = req.params.month;
      startDate = new Date(Date.UTC(year, parseInt(month) - 1, 1));
      endDate = new Date(Date.UTC(year, parseInt(month), 0, 23, 59, 59));
    } else if (req.query.startDate && req.query.endDate) {
      startDate = new Date(req.query.startDate);
      endDate = new Date(req.query.endDate);
      endDate.setUTCHours(23, 59, 59, 999);
    } else {
      return res.status(400).json({ message: 'Must provide year/month params or startDate/endDate query.' });
    }

    const prayers = await PrayerLog.aggregate([
      { $match: { userId, date: { $gte: startDate, $lte: endDate } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } },
          total: { $sum: 1 }
        } 
      }
    ]);

    const duas = await DuaCompletionLog.aggregate([
      { $match: { userId, date: { $gte: startDate, $lte: endDate } } },
      { 
        $group: { 
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          completed: { $sum: { $cond: [{ $eq: ["$status", "done"] }, 1, 0] } },
          remindersCompletedCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ["$status", "done"] }, { $ne: ["$reminderId", null] }] }, 1, 0]
            }
          },
          total: { $sum: 1 }
        } 
      }
    ]);

    // Merge into a map
    const summaryMap = {};
    
    prayers.forEach(p => {
      summaryMap[p._id] = { 
        date: p._id, 
        prayersCompleted: p.completed, 
        prayersTotal: p.total,
        duasCompleted: 0,
        duasTotal: 0,
        remindersCompletedCount: 0
      };
    });

    duas.forEach(d => {
      if (!summaryMap[d._id]) {
        summaryMap[d._id] = { date: d._id, prayersCompleted: 0, prayersTotal: 0, remindersCompletedCount: 0 };
      }
      summaryMap[d._id].duasCompleted = d.completed;
      summaryMap[d._id].duasTotal = d.total;
      summaryMap[d._id].remindersCompletedCount = d.remindersCompletedCount;
    });

    // Calculate score
    const result = Object.values(summaryMap).map(day => {
      const totalPossible = day.prayersTotal + day.duasTotal;
      const totalCompleted = day.prayersCompleted + day.duasCompleted;
      const overallScore = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;
      
      // We assume 5 prayers total, but if user didn't log 5, we use prayersTotal. Wait, if they didn't log, it's out of 5!
      const prayerCompletionPercent = day.prayersTotal > 0 ? Math.round((day.prayersCompleted / 5) * 100) : 0; 
      const duaCompletionPercent = day.duasTotal > 0 ? Math.round((day.duasCompleted / day.duasTotal) * 100) : 0;
      const isPerfectDay = day.prayersCompleted === 5;

      return { 
        date: day.date, 
        prayerCompletionPercent, 
        duaCompletionPercent,
        overallScore,
        isPerfectDay,
        remindersCompletedCount: day.remindersCompletedCount
      };
    });

    // Fill missing days in the month/range to guarantee we return data for empty days
    const filledResult = [];
    let currDate = new Date(startDate);
    // Remove time portion for comparison and iteration
    currDate.setUTCHours(0, 0, 0, 0);
    const end = new Date(endDate);
    end.setUTCHours(0, 0, 0, 0);
    
    while (currDate <= end) {
      const dateStr = currDate.toISOString().split('T')[0];
      const existing = result.find(r => r.date === dateStr);
      if (existing) {
        filledResult.push(existing);
      } else {
        filledResult.push({
          date: dateStr,
          prayerCompletionPercent: 0,
          duaCompletionPercent: 0,
          overallScore: 0,
          isPerfectDay: false,
          remindersCompletedCount: 0
        });
      }
      currDate.setUTCDate(currDate.getUTCDate() + 1);
    }

    res.json(filledResult);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// 5. GET /api/history/streaks
const getStreaks = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Get all prayer logs grouped by date
    const dailyLogs = await PrayerLog.aggregate([
      { $match: { userId } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }
        }
      },
      { $sort: { _id: 1 } } // Ascending chronological order
    ]);

    // 2. Identify perfect days (5 prayers completed)
    const perfectDays = dailyLogs
      .filter(log => log.completedCount === 5)
      .map(log => log._id);

    // 3. Analyze sequences to build streaks
    const streaks = [];
    let currentStreak = { start: null, end: null, length: 0 };

    for (let i = 0; i < perfectDays.length; i++) {
      const dateStr = perfectDays[i];
      const dateObj = new Date(dateStr);

      if (currentStreak.length === 0) {
        // Start a new streak
        currentStreak = { start: dateStr, end: dateStr, length: 1 };
      } else {
        const prevDateObj = new Date(currentStreak.end);
        const diffTime = Math.abs(dateObj - prevDateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
          // Continue streak
          currentStreak.end = dateStr;
          currentStreak.length += 1;
        } else {
          // Streak broken
          streaks.push({ ...currentStreak });
          // Start a new one
          currentStreak = { start: dateStr, end: dateStr, length: 1 };
        }
      }
    }
    
    // Push the final streak if exists
    if (currentStreak.length > 0) {
      streaks.push(currentStreak);
    }

    // Sort descending (newest streak first)
    streaks.sort((a, b) => new Date(b.end) - new Date(a.end));

    // Top Summary Stats (to power the summary widget quickly)
    const stats = await UserStats.findOne({ userId });
    const totalDaysTracked = dailyLogs.length;
    let totalCompleted = 0;
    dailyLogs.forEach(d => totalCompleted += d.completedCount);
    const overallCompletionRate = totalDaysTracked > 0 
      ? Math.round((totalCompleted / (totalDaysTracked * 5)) * 100) 
      : 0;

    res.json({
      streaks,
      summary: {
        totalDaysTracked,
        overallCompletionRate,
        currentStreak: stats?.currentStreak || 0,
        bestStreak: stats?.longestStreak || 0
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getHistory,
  getDayDetail,
  getMonthlySummary,
  getStreaks
};
