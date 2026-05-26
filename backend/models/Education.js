const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  fieldOfStudy: {
    type: String,
    required: true,
    trim: true
  },
  thesisTopic: {
    type: String,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  gpa: {
    type: String,
    trim: true
  },
  honors: [{
    type: String,
    trim: true
  }],
  coursework: [{
    type: String,
    trim: true
  }],
  logoUrl: {
    type: String,
    trim: true
  },
  websiteUrl: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create slug from institution and degree before saving
educationSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = `${this.institution} ${this.degree}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better query performance
educationSchema.index({ createdBy: 1, startDate: -1 });
educationSchema.index({ slug: 1 });

module.exports = mongoose.model('Education', educationSchema);
