const express = require('express');
const { body, validationResult } = require('express-validator');
const Settings = require('../models/Settings');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Get settings (public access)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    res.json({ settings });
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ message: 'Server error while fetching settings' });
  }
});

// Update settings (admin only)
router.put('/', authenticate, authorize('admin'), [
  body('siteName').optional().trim().notEmpty().withMessage('Site name cannot be empty'),
  body('siteDescription').optional().trim().notEmpty().withMessage('Site description cannot be empty'),
  body('contactInfo.email').optional().isEmail().withMessage('Invalid email address'),
  body('theme.primaryColor').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Invalid color format'),
  body('theme.secondaryColor').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Invalid color format')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await Settings.getSettings();
    
    // Update settings with provided data
    Object.assign(settings, req.body);
    
    await settings.save();

    res.json({
      message: 'Settings updated successfully',
      settings
    });
  } catch (error) {
    console.error('Update settings error:', error);
    res.status(500).json({ message: 'Server error while updating settings' });
  }
});

// Update contact info (admin only)
router.put('/contact', authenticate, authorize('admin'), [
  body('email').optional().isEmail().withMessage('Invalid email address'),
  body('phone').optional().trim(),
  body('address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await Settings.getSettings();
    
    if (req.body.email || req.body.phone || req.body.address) {
      settings.contactInfo = {
        ...settings.contactInfo,
        ...req.body
      };
    }

    if (req.body.socialLinks) {
      settings.contactInfo.socialLinks = req.body.socialLinks;
    }

    await settings.save();

    res.json({
      message: 'Contact information updated successfully',
      contactInfo: settings.contactInfo
    });
  } catch (error) {
    console.error('Update contact info error:', error);
    res.status(500).json({ message: 'Server error while updating contact information' });
  }
});

// Update theme settings (admin only)
router.put('/theme', authenticate, authorize('admin'), [
  body('primaryColor').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Invalid primary color format'),
  body('secondaryColor').optional().matches(/^#[0-9A-Fa-f]{6}$/).withMessage('Invalid secondary color format'),
  body('fontFamily').optional().trim().notEmpty().withMessage('Font family cannot be empty')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await Settings.getSettings();
    
    settings.theme = {
      ...settings.theme,
      ...req.body
    };

    await settings.save();

    res.json({
      message: 'Theme settings updated successfully',
      theme: settings.theme
    });
  } catch (error) {
    console.error('Update theme error:', error);
    res.status(500).json({ message: 'Server error while updating theme settings' });
  }
});

// Update SEO settings (admin only)
router.put('/seo', authenticate, authorize('admin'), [
  body('metaTitle').optional().trim(),
  body('metaDescription').optional().trim(),
  body('keywords').optional().isArray().withMessage('Keywords must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await Settings.getSettings();
    
    settings.seo = {
      ...settings.seo,
      ...req.body
    };

    await settings.save();

    res.json({
      message: 'SEO settings updated successfully',
      seo: settings.seo
    });
  } catch (error) {
    console.error('Update SEO error:', error);
    res.status(500).json({ message: 'Server error while updating SEO settings' });
  }
});

// Update feature settings (admin only)
router.put('/features', authenticate, authorize('admin'), async (req, res) => {
  try {
    const settings = await Settings.getSettings();
    
    settings.features = {
      ...settings.features,
      ...req.body
    };

    await settings.save();

    res.json({
      message: 'Feature settings updated successfully',
      features: settings.features
    });
  } catch (error) {
    console.error('Update features error:', error);
    res.status(500).json({ message: 'Server error while updating feature settings' });
  }
});

// Update language settings (admin only)
router.put('/languages', authenticate, authorize('admin'), [
  body('default').optional().isIn(['en', 'am', 'es', 'fr', 'de', 'zh']).withMessage('Invalid default language'),
  body('supported').optional().isArray().withMessage('Supported languages must be an array')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const settings = await Settings.getSettings();
    
    settings.languages = {
      ...settings.languages,
      ...req.body
    };

    await settings.save();

    res.json({
      message: 'Language settings updated successfully',
      languages: settings.languages
    });
  } catch (error) {
    console.error('Update languages error:', error);
    res.status(500).json({ message: 'Server error while updating language settings' });
  }
});

module.exports = router;
