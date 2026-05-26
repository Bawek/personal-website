const express = require('express');
const router = express.Router();
const Certification = require('../models/Certification');
const auth = require('../middleware/auth');

// Get all certifications (public)
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find()
      .sort({ issueDate: -1 });
    res.json({ certifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certifications', error: error.message });
  }
});

// Get featured certifications (public)
router.get('/featured', async (req, res) => {
  try {
    const certifications = await Certification.find({ featured: true })
      .sort({ issueDate: -1 });
    res.json({ certifications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching featured certifications', error: error.message });
  }
});

// Get single certification by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const certification = await Certification.findOne({ slug: req.params.slug });
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.json({ certification });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching certification', error: error.message });
  }
});

// Create certification (protected)
router.post('/', auth, async (req, res) => {
  try {
    const certification = new Certification({
      ...req.body,
      createdBy: req.user._id
    });
    await certification.save();
    res.status(201).json({ certification });
  } catch (error) {
    res.status(400).json({ message: 'Error creating certification', error: error.message });
  }
});

// Update certification (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.json({ certification });
  } catch (error) {
    res.status(400).json({ message: 'Error updating certification', error: error.message });
  }
});

// Delete certification (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    if (!certification) {
      return res.status(404).json({ message: 'Certification not found' });
    }
    res.json({ message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting certification', error: error.message });
  }
});

module.exports = router;
