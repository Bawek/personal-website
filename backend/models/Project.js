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
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Generate slug before validation (required field must exist when validators run)
projectSchema.pre('validate', function(next) {
  if (this.title && !this.slug) {
    this.slug = slugifyTitle(this.title);
  }
  next();
});

// Index for better query performance
projectSchema.index({ featured: -1, createdAt: -1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ slug: 1 });

module.exports = mongoose.model('Project', projectSchema);
