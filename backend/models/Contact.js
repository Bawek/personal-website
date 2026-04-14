const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  hero: {
    title: {
      type: String,
      default: 'Get In Touch'
    },
    subtitle: {
      type: String,
      default: 'Let\'s Connect'
    }
  },
  form: {
    title: {
      type: String,
      default: 'Send us a message'
    },
    description: {
      type: String,
      default: 'We\'d love to hear from you...'
    }
  },
  social: {
    title: {
      type: String,
      default: 'Connect with me'
    },
    links: [{
      platform: {
        type: String,
        required: true
      },
      url: {
        type: String,
        required: true
      },
      id: {
        type: String,
        required: true
      }
    }]
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Ensure only one contact section per user
contactSchema.index({ createdBy: 1 }, { unique: true });

// Message sub-schema for contact form submissions
const messageSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

module.exports = { Contact: mongoose.model('Contact', contactSchema), Message };
