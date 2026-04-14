const express = require('express');
const { body, validationResult } = require('express-validator');
const Content = require('../models/Content');
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Get all content (public access)
router.get('/', optionalAuth, async (req, res) => {
  try {
    const {
      type,
      status = 'published',
      language = 'en',
      page = 1,
      limit = 10,
      search,
      tags,
      categories,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    // Build query
    const query = { status };
    
    if (type) query.type = type;
    if (language) query.language = language;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } }
      ];
    }
    if (tags) {
      const tagArray = tags.split(',').map(tag => tag.trim());
      query.tags = { $in: tagArray };
    }
    if (categories) {
      const categoryArray = categories.split(',').map(cat => cat.trim());
      query.categories = { $in: categoryArray };
    }

    // Sort options
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const contents = await Content.find(query)
      .populate('author', 'username email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Content.countDocuments(query);

    res.json({
      contents,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ message: 'Server error while fetching content' });
  }
});

// Get content by slug
router.get('/:slug', optionalAuth, async (req, res) => {
  try {
    const { slug } = req.params;
    const { language = 'en' } = req.query;

    const content = await Content.findOne({ slug })
      .populate('author', 'username email');

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if content is published or user is author
    if (content.status !== 'published' && (!req.user || req.user._id.toString() !== content.author._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Increment view count
    if (content.status === 'published') {
      content.metadata.views += 1;
      await content.save();
    }

    // Return content with translation if requested
    let responseContent = content.toObject();
    
    if (language !== 'en' && content.translations) {
      const translation = content.translations.find(t => t.language === language);
      if (translation) {
        responseContent.title = translation.title;
        responseContent.content = translation.content;
        responseContent.excerpt = translation.excerpt;
      }
    }

    res.json(responseContent);
  } catch (error) {
    console.error('Get content by slug error:', error);
    res.status(500).json({ message: 'Server error while fetching content' });
  }
});

// Create new content (admin/editor only)
router.post('/', authenticate, authorize('admin', 'editor'), [
  body('title').notEmpty().trim().withMessage('Title is required'),
  body('type').isIn(['page', 'post', 'project', 'service', 'testimonial', 'skill']).withMessage('Invalid content type'),
  body('content').notEmpty().withMessage('Content is required'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('language').optional().isIn(['en', 'am', 'es', 'fr', 'de', 'zh']).withMessage('Invalid language')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const contentData = {
      ...req.body,
      author: req.user._id
    };

    // Check if slug already exists
    if (contentData.slug) {
      const existingContent = await Content.findOne({ slug: contentData.slug });
      if (existingContent) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    const content = new Content(contentData);
    await content.save();

    const populatedContent = await Content.findById(content._id)
      .populate('author', 'username email');

    res.status(201).json({
      message: 'Content created successfully',
      content: populatedContent
    });
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).json({ message: 'Server error while creating content' });
  }
});

// Update content (admin/editor only, or author)
router.put('/:id', authenticate, [
  body('title').optional().notEmpty().trim().withMessage('Title cannot be empty'),
  body('type').optional().isIn(['page', 'post', 'project', 'service', 'testimonial', 'skill']).withMessage('Invalid content type'),
  body('status').optional().isIn(['draft', 'published', 'archived']).withMessage('Invalid status'),
  body('language').optional().isIn(['en', 'am', 'es', 'fr', 'de', 'zh']).withMessage('Invalid language')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check permissions
    const canEdit = req.user.role === 'admin' || 
                   req.user.role === 'editor' || 
                   content.author.toString() === req.user._id.toString();

    if (!canEdit) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if new slug conflicts with existing content
    if (req.body.slug && req.body.slug !== content.slug) {
      const existingContent = await Content.findOne({ slug: req.body.slug });
      if (existingContent) {
        return res.status(400).json({ message: 'Slug already exists' });
      }
    }

    const updatedContent = await Content.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    ).populate('author', 'username email');

    res.json({
      message: 'Content updated successfully',
      content: updatedContent
    });
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).json({ message: 'Server error while updating content' });
  }
});

// Delete content (admin only)
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    await Content.findByIdAndDelete(id);

    res.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error while deleting content' });
  }
});

// Add translation to content
router.post('/:id/translations', authenticate, authorize('admin', 'editor'), [
  body('language').isIn(['am', 'es', 'fr', 'de', 'zh']).withMessage('Invalid language'),
  body('title').notEmpty().trim().withMessage('Translation title is required'),
  body('content').notEmpty().withMessage('Translation content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { language, title, content, excerpt } = req.body;

    const contentDoc = await Content.findById(id);
    if (!contentDoc) {
      return res.status(404).json({ message: 'Content not found' });
    }

    // Check if translation already exists
    const existingTranslation = contentDoc.translations.find(t => t.language === language);
    if (existingTranslation) {
      return res.status(400).json({ message: 'Translation for this language already exists' });
    }

    contentDoc.translations.push({
      language,
      title,
      content,
      excerpt
    });

    await contentDoc.save();

    res.json({
      message: 'Translation added successfully',
      content: contentDoc
    });
  } catch (error) {
    console.error('Add translation error:', error);
    res.status(500).json({ message: 'Server error while adding translation' });
  }
});

// Like content
router.post('/:id/like', optionalAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const content = await Content.findById(id);

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    if (content.status !== 'published') {
      return res.status(403).json({ message: 'Cannot like unpublished content' });
    }

    content.metadata.likes += 1;
    await content.save();

    res.json({
      message: 'Content liked successfully',
      likes: content.metadata.likes
    });
  } catch (error) {
    console.error('Like content error:', error);
    res.status(500).json({ message: 'Server error while liking content' });
  }
});

module.exports = router;
