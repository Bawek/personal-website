const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Project = require('../models/Project');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/projects');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// GET /api/projects - Get all projects (public)
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find()
      .sort({ featured: -1, createdAt: -1 });
    
    res.json({
      success: true,
      projects: projects
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// GET /api/projects/:id - Get a single project (public)
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      project: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project'
    });
  }
});

// POST /api/projects - Create a new project
router.post('/', authenticate, upload.single('image'), async (req, res) => {
  try {
    let projectData;
    
    if (req.file) {
      // Handle file upload
      const imageUrl = `/uploads/projects/${req.file.filename}`;
      projectData = {
        ...JSON.parse(req.body.data),
        imageUrl: imageUrl,
        createdBy: req.user.id
      };
    } else {
      // Handle URL-based image
      projectData = {
        ...req.body,
        createdBy: req.user.id
      };
    }
    
    const project = new Project(projectData);
    await project.save();
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error cleaning up file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create project'
    });
  }
});

// PUT /api/projects/:id - Update a project
router.put('/:id', authenticate, upload.single('image'), async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    let updateData;
    
    if (req.file) {
      // Handle file upload
      const imageUrl = `/uploads/projects/${req.file.filename}`;
      updateData = {
        ...JSON.parse(req.body.data),
        imageUrl: imageUrl
      };
      
      // Delete old image file if it exists
      if (project.imageUrl && project.imageUrl.startsWith('/uploads/')) {
        const oldImagePath = path.join(__dirname, '..', project.imageUrl);
        if (fs.existsSync(oldImagePath)) {
          fs.unlink(oldImagePath, (err) => {
            if (err) console.error('Error deleting old image:', err);
          });
        }
      }
    } else {
      // Handle URL-based image or no image change
      updateData = req.body;
    }
    
    Object.assign(project, updateData);
    await project.save();
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      project: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    
    // Clean up uploaded file if there was an error
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error cleaning up file:', err);
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// PATCH /api/projects/:id/toggle-featured - Toggle featured status
router.patch('/:id/toggle-featured', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    project.featured = !project.featured;
    await project.save();
    
    res.json({
      success: true,
      message: `Project ${project.featured ? 'marked as' : 'unmarked as'} featured`,
      project: project
    });
  } catch (error) {
    console.error('Error toggling featured status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update project'
    });
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', authenticate, async (req, res) => {
  try {
    const project = await Project.findOne({ 
      _id: req.params.id, 
      createdBy: req.user.id 
    });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    // Delete associated image file if it exists
    if (project.imageUrl && project.imageUrl.startsWith('/uploads/')) {
      const imagePath = path.join(__dirname, '..', project.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlink(imagePath, (err) => {
          if (err) console.error('Error deleting image file:', err);
        });
      }
    }
    
    await Project.deleteOne({ _id: req.params.id });
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete project'
    });
  }
});

module.exports = router;
