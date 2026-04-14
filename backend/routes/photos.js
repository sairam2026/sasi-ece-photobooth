const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getPhotos,
  searchPhoto,
  uploadPhoto,
  uploadMultiplePhotos,
  deletePhoto,
} = require('../controllers/photoController');

// Public routes
router.get('/', getPhotos);
router.get('/search/:photoNumber', searchPhoto);

// Protected admin routes
router.post('/upload', protect, upload.single('photo'), uploadPhoto);
router.post('/upload-multiple', protect, upload.array('photos', 150), uploadMultiplePhotos);
router.delete('/:id', protect, deletePhoto);

module.exports = router;
