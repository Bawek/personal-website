import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    sparse: true,
  },
  description: {
    type: String,
    required: true,
  },
  techStack: {
    type: [String],
    default: [],
  },
  technologies: {
    type: [String],
    default: [],
  },
  liveUrl: {
    type: String,
    trim: true,
  },
  githubUrl: {
    type: String,
    trim: true,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    trim: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
}, {
  timestamps: true,
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
projectSchema.index({ slug: 1 });

export default mongoose.models.Project || mongoose.model('Project', projectSchema);
