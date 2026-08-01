const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  markPrayer,
  getTodayPrayers,
  getHistory,
  updatePrayer,
  deletePrayer,
  getStats
} = require('../controllers/prayerController');

// All routes are protected
router.use(protect);

router.post('/mark', markPrayer);
router.get('/today', getTodayPrayers);
router.get('/history', getHistory);
router.get('/stats', getStats);

router.put('/:id', updatePrayer);
router.delete('/:id', deletePrayer);

module.exports = router;
