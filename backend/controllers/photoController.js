const streamifier = require('streamifier');
const cloudinary = require('../config/cloudinary');
const Photo = require('../models/Photo');

const FOLDER = process.env.CLOUDINARY_FOLDER || 'sasi_ece_farewell';

// Helper: stream buffer to Cloudinary
const uploadToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: FOLDER,
        transformation: [{ quality: 'auto', fetch_format: 'auto' }],
        ...options,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

// Generate thumbnail URL from Cloudinary public_id
const getThumbnailUrl = (publicId) =>
  cloudinary.url(publicId, {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  });

// GET /api/photos
const getPhotos = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const [photos, total] = await Promise.all([
      Photo.find().sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Photo.countDocuments(),
    ]);

    res.json({
      success: true,
      data: photos,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: skip + photos.length < total,
      },
    });
  } catch (error) {
    console.error('getPhotos error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch photos' });
  }
};

// GET /api/photos/search/:photoNumber
const searchPhoto = async (req, res) => {
  try {
    const { photoNumber } = req.params;
    const query = photoNumber.toUpperCase();

    const photos = await Photo.find({
      photoNumber: { $regex: query, $options: 'i' },
    })
      .sort({ photoNumber: 1 })
      .limit(50)
      .lean();

    res.json({ success: true, data: photos, count: photos.length });
  } catch (error) {
    console.error('searchPhoto error:', error);
    res.status(500).json({ success: false, message: 'Search failed' });
  }
};

// POST /api/photos/upload  (single)
const uploadPhoto = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file provided' });
    }

    const result = await uploadToCloudinary(req.file.buffer, {
      resource_type: 'image',
    });

    // Get next photo number
    const count = await Photo.countDocuments();
    const photoNumber = `ECE${String(count + 1).padStart(3, '0')}`;

    const photo = await Photo.create({
      photoNumber,
      publicId: result.public_id,
      url: result.secure_url,
      thumbnailUrl: getThumbnailUrl(result.public_id),
      originalName: req.file.originalname,
      format: result.format,
      width: result.width,
      height: result.height,
      size: result.bytes,
      uploadedBy: req.admin?.username || 'admin',
    });

    res.status(201).json({ success: true, data: photo });
  } catch (error) {
    console.error('uploadPhoto error:', error);
    res.status(500).json({ success: false, message: 'Upload failed: ' + error.message });
  }
};

// POST /api/photos/upload-multiple
const uploadMultiplePhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files provided' });
    }

    const startCount = await Photo.countDocuments();
    const results = [];
    const errors = [];

    // Upload concurrently in batches of 5
    const batchSize = 5;
    for (let i = 0; i < req.files.length; i += batchSize) {
      const batch = req.files.slice(i, i + batchSize);
      const batchResults = await Promise.allSettled(
        batch.map(async (file, idx) => {
          const result = await uploadToCloudinary(file.buffer);
          const photoNumber = `ECE${String(startCount + i + idx + 1).padStart(3, '0')}`;

          return Photo.create({
            photoNumber,
            publicId: result.public_id,
            url: result.secure_url,
            thumbnailUrl: getThumbnailUrl(result.public_id),
            originalName: file.originalname,
            format: result.format,
            width: result.width,
            height: result.height,
            size: result.bytes,
            uploadedBy: req.admin?.username || 'admin',
          });
        })
      );

      batchResults.forEach((r, idx) => {
        if (r.status === 'fulfilled') results.push(r.value);
        else errors.push({ file: batch[idx].originalname, error: r.reason?.message });
      });
    }

    res.status(201).json({
      success: true,
      uploaded: results.length,
      failed: errors.length,
      data: results,
      errors,
    });
  } catch (error) {
    console.error('uploadMultiplePhotos error:', error);
    res.status(500).json({ success: false, message: 'Bulk upload failed: ' + error.message });
  }
};

// DELETE /api/photos/:id
const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(photo.publicId);

    // Delete from MongoDB
    await photo.deleteOne();

    res.json({ success: true, message: `Photo ${photo.photoNumber} deleted successfully` });
  } catch (error) {
    console.error('deletePhoto error:', error);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};

module.exports = { getPhotos, searchPhoto, uploadPhoto, uploadMultiplePhotos, deletePhoto };
