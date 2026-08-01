const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getHistory,
  getDayDetail,
  getMonthlySummary,
  getStreaks
} = require('../controllers/historyController');

router.use(protect);

router.get('/', getHistory);
router.get('/filter', getHistory); // Same handler manages query params
router.get('/day/:date', getDayDetail);
router.get('/summary', getMonthlySummary);
router.get('/monthly-summary/:year/:month', getMonthlySummary);
router.get('/streaks', getStreaks);

module.exports = router;
