const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  company: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    trim: true
  },
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'internship', 'freelance'],
    default: 'full-time'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    default: null // null for current position
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    required: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  achievements: [{
    type: String,
    trim: true
  }],
  technologies: [{
    type: String,
    trim: true
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create slug from title and company before saving
experienceSchema.pre('save', function(next) {
  if (this.isModified('title') || this.isModified('company')) {
    if (!this.slug) {
      this.slug = `${this.title} ${this.company}`
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    }
  }
  next();
});

// Index for better query performance
experienceSchema.index({ createdBy: 1, startDate: -1 });
experienceSchema.index({ createdBy: 1, current: -1, startDate: -1 });
experienceSchema.index({ slug: 1 });

module.exports = mongoose.model('Experience', experienceSchema);
