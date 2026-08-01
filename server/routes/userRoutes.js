const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/authMiddleware');
const {
  getProfile,
  updateProfile,
  updateNotificationSettings,
  updatePreferences,
  updateAvatar,
  changePassword,
  deleteAccount,
  getAchievements
} = require('../controllers/userController');

// Multer Config for Local Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure 'uploads' directory exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, req.user.id + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

router.use(protect);

router.route('/profile')
  .get(getProfile)
  .put(updateProfile);

router.put('/profile/preferences', updatePreferences);
router.put('/profile/avatar', upload.single('avatar'), updateAvatar);
router.put('/change-password', changePassword);
router.put('/notification-settings', updateNotificationSettings);
router.delete('/account', deleteAccount);
router.get('/profile/achievements', getAchievements);

module.exports = router;
