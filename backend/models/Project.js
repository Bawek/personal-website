const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
  description: {
    type: String,
    required: true
  },
  // Case study fields for PRD compliance
  problemStatement: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  responsibilities: [{
    type: String,
    trim: true
  }],
  approach: {
    type: String,
    trim: true
  },
  methodologies: [{
    type: String,
    trim: true
  }],
  outcomes: {
    type: String,
    trim: true
  },
  metrics: [{
    label: String,
    value: String,
    improvement: String
  }],
  // Original fields
  techStack: {
    type: [String],
    required: true
  },
  liveUrl: {
    type: String,
    trim: true
  },
  githubUrl: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    enum: ['personal', 'professional', 'open-source', 'research', 'freelance'],
    default: 'personal'
  },
  domain: [{
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

// Create slug from title before saving
projectSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better query performance
projectSchema.index({ featured: -1, createdAt: -1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ slug: 1 });
projectSchema.index({ category: 1 });

module.exports = mongoose.model('Project', projectSchema);
