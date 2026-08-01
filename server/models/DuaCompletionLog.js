const mongoose = require('mongoose');

const duaCompletionLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duaId: { type: mongoose.Schema.Types.ObjectId, ref: 'Dua', required: true },
  reminderId: { type: mongoose.Schema.Types.ObjectId, ref: 'DuaReminder' },
  
  date: { type: Date, required: true },
  status: { type: String, enum: ['done', 'skipped'], required: true },
  completedAt: { type: Date }
});

duaCompletionLogSchema.index({ userId: 1, date: -1 });

module.exports = mongoose.model('DuaCompletionLog', duaCompletionLogSchema);
