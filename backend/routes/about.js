const express = require('express');
const About = require('../models/About');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/about - Get about section for the authenticated user
router.get('/', authenticate, async (req, res) => {
  try {
    let about = await About.findOne({ createdBy: req.user.id });
    
    // If no about section exists, create a default one
    if (!about) {
      about = new About({
        createdBy: req.user.id
      });
      await about.save();
    }
    
    res.json({
      success: true,
      about: about
    });
  } catch (error) {
    console.error('Error fetching about data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch about data'
    });
  }
});

// PUT /api/about - Update about section
router.put('/', authenticate, async (req, res) => {
  try {
    let about = await About.findOne({ createdBy: req.user.id });
    
    if (!about) {
      // Create if doesn't exist
      about = new About({
        ...req.body,
        createdBy: req.user.id
      });
    } else {
      // Update existing
      Object.assign(about, req.body);
    }
    
    await about.save();
    
    res.json({
      success: true,
      message: 'About section updated successfully',
      about: about
    });
  } catch (error) {
    console.error('Error updating about data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update about data'
    });
  }
});

module.exports = router;
