const DuaReminder = require('../models/DuaReminder');
const mongoose = require('mongoose');

// @desc    Create a reminder for a Dua
// @route   POST /api/duas/:id/reminders  (Mapped via duaRoutes usually, or reminderRoutes)
// @access  Private
const createReminder = async (req, res) => {
  try {
    const { frequency, cronExpression, reminderTime, daysOfWeek, type, prayerName } = req.body;
    const duaId = req.params.id || req.body.duaId;

    const reminder = await DuaReminder.create({
      userId: req.user._id,
      type: type || (duaId ? 'dua' : 'prayer'),
      duaId: type === 'prayer' ? undefined : duaId,
      prayerName: type === 'prayer' ? prayerName : undefined,
      frequency,
      cronExpression,
      reminderTime,
      daysOfWeek
    });

    res.status(201).json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Error creating reminder', error: err.message });
  }
};

// @desc    Get all active reminders for logged-in user
// @route   GET /api/reminders
// @access  Private
const getReminders = async (req, res) => {
  try {
    const reminders = await DuaReminder.find({ userId: req.user._id })
      .populate('duaId', 'title category');
    res.status(200).json(reminders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching reminders', error: err.message });
  }
};

// @desc    Update / pause / resume a reminder
// @route   PUT /api/reminders/:id
// @access  Private
const updateReminder = async (req, res) => {
  try {
    const reminder = await DuaReminder.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.status(200).json(reminder);
  } catch (err) {
    res.status(500).json({ message: 'Error updating reminder', error: err.message });
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/reminders/:id
// @access  Private
const deleteReminder = async (req, res) => {
  try {
    const reminder = await DuaReminder.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });
    res.status(200).json({ message: 'Reminder deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting reminder', error: err.message });
  }
};

module.exports = {
  createReminder,
  getReminders,
  updateReminder,
  deleteReminder
};
