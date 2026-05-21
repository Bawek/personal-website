const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      default: 'Hello, I am Baweke'
    },
    subtitle: {
      type: String,
      default: 'I love to learn new technologies'
    },
    description: {
      type: String,
      default: ''
    },
    imageUrl: {
      type: String,
      default: ''
    },
    lastUpdated: {
      type: Date
    }
  },
  whoAmI: {
    title: {
      type: String,
      default: 'Who I Am'
    },
    description: {
      type: String,
      default: 'I am a Software Engineer who\'s passionate & enthusiastic about creating web applications.'
    }
  },
  resume: {
    buttonText: {
      type: String,
      default: 'Download Resume'
    },
    fileUrl: {
      type: String,
      default: ''
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure only one about section per user
aboutSchema.index({ createdBy: 1 }, { unique: true });

module.exports = mongoose.model('About', aboutSchema);
