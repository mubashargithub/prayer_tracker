const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createDua,
  getDuas,
  getDua,
  updateDua,
  deleteDua,
  completeDua,
  getDuaHistory
} = require('../controllers/duaController');
const { createReminder } = require('../controllers/reminderController');

router.use(protect);

router.get('/history', getDuaHistory); // Specific route must go before /:id
router.post('/', createDua);
router.get('/', getDuas);
router.get('/:id', getDua);
router.put('/:id', updateDua);
router.delete('/:id', deleteDua);

// Dua-specific completion and reminders
router.post('/:id/complete', completeDua);
router.post('/:id/reminders', createReminder);

module.exports = router;
