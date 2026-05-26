const express = require('express');
const router = express.Router();
const Education = require('../models/Education');
const auth = require('../middleware/auth');

// Get all education records (public)
router.get('/', async (req, res) => {
  try {
    const education = await Education.find()
      .sort({ startDate: -1 });
    res.json({ education });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching education records', error: error.message });
  }
});

// Get single education record by slug (public)
router.get('/slug/:slug', async (req, res) => {
  try {
    const education = await Education.findOne({ slug: req.params.slug });
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }
    res.json({ education });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching education record', error: error.message });
  }
});

// Create education record (protected)
router.post('/', auth, async (req, res) => {
  try {
    const education = new Education({
      ...req.body,
      createdBy: req.user._id
    });
    await education.save();
    res.status(201).json({ education });
  } catch (error) {
    res.status(400).json({ message: 'Error creating education record', error: error.message });
  }
});

// Update education record (protected)
router.put('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      { ...req.body },
      { new: true, runValidators: true }
    );
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }
    res.json({ education });
  } catch (error) {
    res.status(400).json({ message: 'Error updating education record', error: error.message });
  }
});

// Delete education record (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    if (!education) {
      return res.status(404).json({ message: 'Education record not found' });
    }
    res.json({ message: 'Education record deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting education record', error: error.message });
  }
});

module.exports = router;
