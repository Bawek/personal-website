const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  entryType: {
    type: String,
    enum: ['work', 'education', 'certification', 'award', 'talk'],
    default: 'work',
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  company: {
    type: String,
    required: true,
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    required: true,
  },
  responsibilities: [{
    type: String,
    trim: true,
  }],
  achievements: [{
    type: String,
    trim: true,
  }],
  technologies: [{
    type: String,
    trim: true,
  }],
  // Education
  fieldOfStudy: { type: String, trim: true },
  degree: { type: String, trim: true },
  thesisTopic: { type: String, trim: true },
  // Certification
  credentialId: { type: String, trim: true },
  credentialUrl: { type: String, trim: true },
  // Talk / event
  eventUrl: { type: String, trim: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true,
});

function slugifyEntry(title, company) {
  return `${title || ''} ${company || ''}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

experienceSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = slugifyEntry(this.title, this.company);
  }
  if (this.entryType !== 'work') {
    this.current = false;
  }
  if (this.current) {
    this.endDate = null;
  }
  next();
});

experienceSchema.index({ createdBy: 1, startDate: -1 });
experienceSchema.index({ createdBy: 1, entryType: 1, startDate: -1 });
experienceSchema.index({ slug: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
