import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 30,
    sparse: true, // Allow null/undefined for unique constraint
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    select: false, // Don't include password by default in queries
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer', 'user'],
    default: 'user',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
  syncSettings: {
    autoSyncGithub: { type: Boolean, default: false },
    autoPostLinkedin: { type: Boolean, default: false },
    githubUsername: { type: String, default: '' },
    linkedinEnabled: { type: Boolean, default: false },
  },
}, {
  timestamps: true,
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

// Indexes for better performance
userSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model('User', userSchema);
