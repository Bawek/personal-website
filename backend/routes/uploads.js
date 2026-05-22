const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

const ALLOWED_FOLDERS = ['general', 'about', 'content', 'projects'];

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const folder = ALLOWED_FOLDERS.includes(req.query.folder) ? req.query.folder : 'general';
    const uploadDir = path.join(__dirname, '../uploads', folder);
    fs.mkdirSync(uploadDir, { recursive: true });
    req.uploadFolder = folder;
    cb(null, uploadDir);
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || '.png';
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `img-${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter(req, file, cb) {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

// POST /api/uploads?folder=about|content|general|projects
router.post('/', authenticate, upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No image provided' });
    }
    const folder = req.uploadFolder || 'general';
    const baseUrl = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    const fullUrl = `${baseUrl}/uploads/${folder}/${req.file.filename}`;
    res.status(201).json({
      success: true,
      url: fullUrl,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Failed to upload image' });
  }
});

module.exports = router;
