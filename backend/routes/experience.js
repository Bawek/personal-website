const express = require('express');
const Experience = require('../models/Experience');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/experience - Get all experience entries (public)
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find()
      .sort({ current: -1, startDate: -1 });
    
    res.json({
      success: true,
      experiences: experiences
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experiences'
    });
  }
});

// GET /api/experience/:slug - Get a single experience entry by slug (public)
router.get('/:slug', async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.slug });
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    res.json({
      success: true,
      experience: experience
    });
  } catch (error) {
    console.error('Error fetching experience by slug:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch experience'
    });
  }
});

// POST /api/experience - Create a new experience entry
router.post('/', authenticate, async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      employmentType,
      startDate,
      endDate,
      current,
      description,
      responsibilities,
      achievements,
      technologies
    } = req.body;
    
    const experience = new Experience({
      title,
      company,
      location,
      employmentType,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : null,
      current: current || false,
      description,
      responsibilities: responsibilities || [],
      achievements: achievements || [],
      technologies: technologies || [],
      createdBy: req.user.id
    });
    
    await experience.save();
    
    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      experience: experience
    });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create experience'
    });
  }
});

// PUT /api/experience/:slug - Update an experience entry by slug
router.put('/:slug', authenticate, async (req, res) => {
  try {
    const experience = await Experience.findOne({ 
      slug: req.params.slug, 
      createdBy: req.user.id 
    });
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    const {
      title,
      company,
      location,
      employmentType,
      startDate,
      endDate,
      current,
      description,
      responsibilities,
      achievements,
      technologies
    } = req.body;
    
    experience.title = title || experience.title;
    experience.company = company || experience.company;
    experience.location = location || experience.location;
    experience.employmentType = employmentType || experience.employmentType;
    experience.startDate = startDate ? new Date(startDate) : experience.startDate;
    experience.endDate = endDate ? new Date(endDate) : experience.endDate;
    experience.current = current !== undefined ? current : experience.current;
    experience.description = description || experience.description;
    experience.responsibilities = responsibilities || experience.responsibilities;
    experience.achievements = achievements || experience.achievements;
    experience.technologies = technologies || experience.technologies;
    
    // If marked as current, clear end date
    if (experience.current) {
      experience.endDate = null;
    }
    
    await experience.save();
    
    res.json({
      success: true,
      message: 'Experience updated successfully',
      experience: experience
    });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update experience'
    });
  }
});

// DELETE /api/experience/:slug - Delete an experience entry by slug
router.delete('/:slug', authenticate, async (req, res) => {
  try {
    const experience = await Experience.findOne({ 
      slug: req.params.slug, 
      createdBy: req.user.id 
    });
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    await Experience.deleteOne({ slug: req.params.slug });
    
    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete experience'
    });
  }
});

module.exports = router;
