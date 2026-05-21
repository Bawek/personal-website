const express = require('express');
const Experience = require('../models/Experience');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

function pickTimelineFields(body) {
  const entryType = body.entryType || 'work';
  const fields = {
    entryType,
    title: body.title,
    company: body.company,
    location: body.location,
    employmentType: entryType === 'work' ? (body.employmentType || 'full-time') : undefined,
    startDate: body.startDate ? new Date(body.startDate) : undefined,
    endDate: body.endDate ? new Date(body.endDate) : null,
    current: body.entryType === 'work' ? Boolean(body.current) : false,
    description: body.description,
    responsibilities: body.responsibilities || [],
    achievements: body.achievements || [],
    technologies: body.technologies || [],
    fieldOfStudy: body.fieldOfStudy,
    degree: body.degree,
    thesisTopic: body.thesisTopic,
    credentialId: body.credentialId,
    credentialUrl: body.credentialUrl,
    eventUrl: body.eventUrl,
  };
  if (entryType !== 'work') delete fields.employmentType;
  return fields;
}

// GET /api/experience - public timeline (optional ?type=education)
router.get('/', async (req, res) => {
  try {
    const query = {};
    if (req.query.type) query.entryType = req.query.type;

    const experiences = await Experience.find(query).sort({ startDate: -1 });

    res.json({ success: true, experiences });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch timeline' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.slug });
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    res.json({ success: true, experience });
  } catch (error) {
    console.error('Error fetching experience by slug:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch entry' });
  }
});

router.post('/', authenticate, async (req, res) => {
  try {
    const fields = pickTimelineFields(req.body);
    const experience = new Experience({
      ...fields,
      createdBy: req.user.id,
    });
    await experience.save();
    res.status(201).json({ success: true, message: 'Timeline entry created', experience });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({
      success: false,
      message: error.code === 11000 ? 'Duplicate entry slug — change title or organization' : 'Failed to create entry',
    });
  }
});

router.put('/:slug', authenticate, async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.slug, createdBy: req.user.id });
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }

    const fields = pickTimelineFields(req.body);
    Object.assign(experience, fields);
    if (experience.current) experience.endDate = null;

    await experience.save();
    res.json({ success: true, message: 'Timeline entry updated', experience });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(500).json({ success: false, message: 'Failed to update entry' });
  }
});

router.delete('/:slug', authenticate, async (req, res) => {
  try {
    const experience = await Experience.findOne({ slug: req.params.slug, createdBy: req.user.id });
    if (!experience) {
      return res.status(404).json({ success: false, message: 'Entry not found' });
    }
    await Experience.deleteOne({ slug: req.params.slug });
    res.json({ success: true, message: 'Entry deleted' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ success: false, message: 'Failed to delete entry' });
  }
});

module.exports = router;
