const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getSummary,
  getCalendar,
  getTrends,
  exportData
} = require('../controllers/dashboardController');

router.use(protect);

router.get('/summary', getSummary);
router.get('/calendar', getCalendar);
router.get('/trends', getTrends);
router.get('/export', exportData);

module.exports = router;
