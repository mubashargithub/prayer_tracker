const Dua = require('../models/Dua');
const DuaCompletionLog = require('../models/DuaCompletionLog');

// @desc    Create a custom Dua
// @route   POST /api/duas
// @access  Private
const createDua = async (req, res) => {
  try {
    const { title, arabicText, transliteration, translation, category, source, tags } = req.body;
    
    const dua = await Dua.create({
      userId: req.user._id,
      title,
      arabicText,
      transliteration,
      translation,
      category,
      source,
      tags,
      isCustom: true
    });

    res.status(201).json(dua);
  } catch (err) {
    res.status(500).json({ message: 'Error creating Dua', error: err.message });
  }
};

// @desc    Get all user's Duas (with filters)
// @route   GET /api/duas
// @access  Private
const getDuas = async (req, res) => {
  try {
    const { category, tag, search } = req.query;
    let query = { 
      $or: [{ userId: req.user._id }, { userId: null }] // Fetch custom + global app Duas
    };

    if (category) query.category = category;
    if (tag) query.tags = { $in: [tag] };
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    const duas = await Dua.find(query).sort({ createdAt: -1 });
    res.status(200).json(duas);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Duas', error: err.message });
  }
};

// @desc    Get single Dua
// @route   GET /api/duas/:id
// @access  Private
const getDua = async (req, res) => {
  try {
    const dua = await Dua.findById(req.params.id);
    if (!dua) return res.status(404).json({ message: 'Dua not found' });
    
    // Check if it belongs to user OR is a global Dua
    if (dua.userId && dua.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    res.status(200).json(dua);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching Dua', error: err.message });
  }
};

// @desc    Update a Dua
// @route   PUT /api/duas/:id
// @access  Private
const updateDua = async (req, res) => {
  try {
    const dua = await Dua.findOne({ _id: req.params.id, userId: req.user._id });
    if (!dua) return res.status(404).json({ message: 'Dua not found or unauthorized' });

    const updated = await Dua.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating Dua', error: err.message });
  }
};

// @desc    Delete a Dua
// @route   DELETE /api/duas/:id
// @access  Private
const deleteDua = async (req, res) => {
  try {
    const dua = await Dua.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!dua) return res.status(404).json({ message: 'Dua not found or unauthorized' });

    res.status(200).json({ message: 'Dua deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting Dua', error: err.message });
  }
};

// @desc    Mark today's scheduled Dua as completed
// @route   POST /api/duas/:id/complete
// @access  Private
const completeDua = async (req, res) => {
  try {
    const { reminderId, status = 'done' } = req.body;
    
    // Ensure date represents the logical day
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const log = await DuaCompletionLog.findOneAndUpdate(
      { userId: req.user._id, duaId: req.params.id, date: today },
      { 
        reminderId,
        status,
        completedAt: status === 'done' ? new Date() : null
      },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ message: 'Error completing Dua', error: err.message });
  }
};

// @desc    Get Dua completion history
// @route   GET /api/duas/history
// @access  Private
const getDuaHistory = async (req, res) => {
  try {
    const logs = await DuaCompletionLog.find({ userId: req.user._id })
      .populate('duaId', 'title category')
      .sort({ date: -1 })
      .limit(50); // basic pagination/limit

    res.status(200).json(logs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching history', error: err.message });
  }
};

module.exports = {
  createDua,
  getDuas,
  getDua,
  updateDua,
  deleteDua,
  completeDua,
  getDuaHistory
};
