const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_FOLDERS = ['general', 'about', 'content', 'projects'];

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Use memory storage for multer
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

// POST /api/uploads?folder=about|content|general|projects
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }

    const folder = ALLOWED_FOLDERS.includes(req.query.folder) ? req.query.folder : 'general';

    // Upload to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `personal-website/${folder}`,
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto'
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return res.status(500).json({ success: false, message: 'Failed to upload image' });
        }

        res.status(201).json({
          success: true,
          url: result.secure_url,
          publicId: result.public_id,
          storage: 'cloudinary'
        });
      }
    );

    // Pipe the file buffer to Cloudinary
    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

// DELETE /api/uploads/:publicId - Delete image from Cloudinary
router.delete('/:publicId', authenticate, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({ success: false, message: 'Public ID is required' });
    }

    await cloudinary.uploader.destroy(publicId);

    res.json({
      success: true,
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete image' });
  }
});

module.exports = router;
