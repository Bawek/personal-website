const express = require('express');
const Skill = require('../models/Skill');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/skills - Get all skills (public)
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find()
      .sort({ category: 1, level: 1, name: 1 });
    
    res.json({
      success: true,
      skills: skills
    });
  } catch (error) {
    console.error('Error fetching skills:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skills'
    });
  }
});

// GET /api/skills/:id - Get a single skill (public)
router.get('/:id', async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    res.json({
      success: true,
      skill: skill
    });
  } catch (error) {
    console.error('Error fetching skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch skill'
    });
  }
});

// POST /api/skills - Create a new skill
router.post('/', authenticate, async (req, res) => {
  try {
    const { name, category, level } = req.body;
    
    // Check if skill already exists for this user
    const existingSkill = await Skill.findOne({ 
      name: name, 
      createdBy: req.user.id 
    });
    
    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: 'Skill already exists'
      });
    }
    
    const skill = new Skill({
      name,
      category,
      level,
      createdBy: req.user.id
    });
    
    await skill.save();
    
    res.status(201).json({
      success: true,
      message: 'Skill created successfully',
      skill: skill
    });
  } catch (error) {
    console.error('Error creating skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create skill'
    });
  }
});

// PUT /api/skills/:id - Update a skill
router.put('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    const { name, category, level } = req.body;
    
    // Check if another skill with the same name exists
    if (name !== skill.name) {
      const existingSkill = await Skill.findOne({ 
        name: name, 
        createdBy: req.user.id,
        _id: { $ne: req.params.id }
      });
      
      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: 'Skill with this name already exists'
        });
      }
    }
    
    skill.name = name || skill.name;
    skill.category = category || skill.category;
    skill.level = level || skill.level;
    
    await skill.save();
    
    res.json({
      success: true,
      message: 'Skill updated successfully',
      skill: skill
    });
  } catch (error) {
    console.error('Error updating skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update skill'
    });
  }
});

// DELETE /api/skills/:id - Delete a skill
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const skill = await Skill.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    await Skill.deleteOne({ _id: req.params.id });
    
    res.json({
      success: true,
      message: 'Skill deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting skill:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete skill'
    });
  }
});

module.exports = router;
