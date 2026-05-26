const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  issuingOrganization: {
    type: String,
    required: true,
    trim: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  expirationDate: {
    type: Date
  },
  credentialId: {
    type: String,
    trim: true
  },
  credentialUrl: {
    type: String,
    trim: true
  },
  logoUrl: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
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

// Create slug from name and organization before saving
certificationSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = `${this.name} ${this.issuingOrganization}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Index for better query performance
certificationSchema.index({ createdBy: 1, issueDate: -1 });
certificationSchema.index({ featured: -1, issueDate: -1 });
certificationSchema.index({ slug: 1 });

module.exports = mongoose.model('Certification', certificationSchema);
