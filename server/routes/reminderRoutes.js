const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getReminders,
  updateReminder,
  deleteReminder,
  createReminder
} = require('../controllers/reminderController');

router.use(protect);

router.post('/', createReminder);
router.get('/', getReminders);
router.put('/:id', updateReminder);
router.delete('/:id', deleteReminder);

module.exports = router;
