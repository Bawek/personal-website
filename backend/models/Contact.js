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
    },
    responseTime: {
      type: String,
      default: 'I typically respond within 48 hours.'
    },
    placeholder: {
      type: String,
      default: 'Tell me about your project…'
    }
  },
  footer: {
    text: {
      type: String,
      default: 'Built with Next.js & Tailwind.'
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

// Conversation schema for two-way chat
const conversationSchema = new mongoose.Schema({
  visitorEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  visitorName: {
    type: String,
    required: true,
    trim: true
  },
  visitorPhone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['open', 'in-progress', 'resolved', 'closed'],
    default: 'open'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    enum: ['inquiry', 'support', 'collaboration', 'feedback', 'other'],
    default: 'inquiry'
  },
  adminAssignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  messages: [{
    sender: {
      type: String,
      enum: ['visitor', 'admin'],
      required: true
    },
    senderName: String,
    senderEmail: String,
    content: {
      type: String,
      required: true
    },
    attachments: [{
      url: String,
      filename: String,
      size: Number,
      type: String
    }],
    readAt: Date,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  lastMessageAt: {
    type: Date,
    default: Date.now
  },
  visitorLastReadAt: Date,
  adminLastReadAt: Date,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for efficient querying
conversationSchema.index({ visitorEmail: 1, createdBy: 1 });
conversationSchema.index({ status: 1, createdBy: 1 });
conversationSchema.index({ lastMessageAt: -1 });
conversationSchema.index({ adminAssignedTo: 1 });

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
  subject: {
    type: String,
    trim: true,
    default: ''
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
const Conversation = mongoose.model('Conversation', conversationSchema);

module.exports = { 
  Contact: mongoose.model('Contact', contactSchema), 
  Message,
  Conversation
};
