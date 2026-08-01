const mongoose = require('mongoose');

const duaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  title: { type: String, required: true, trim: true },
  arabicText: { type: String, required: true },
  transliteration: { type: String },
  translation: { type: String, required: true },
  category: { type: String, index: true },
  tags: [{ type: String }],
  source: { type: String },
  isCustom: { type: Boolean, default: false }
}, { timestamps: true });

duaSchema.index({ userId: 1 });

module.exports = mongoose.model('Dua', duaSchema);
