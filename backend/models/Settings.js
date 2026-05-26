const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema({
  siteName: {
    type: String,
    default: 'Personal Website'
  },
  siteDescription: {
    type: String,
    default: 'Welcome to my personal website'
  },
  siteLogo: {
    type: String,
    default: ''
  },
  favicon: {
    type: String,
    default: ''
  },
  contactInfo: {
    email: String,
    phone: String,
    address: String,
    socialLinks: [{
      platform: String,
      url: String,
      icon: String
    }]
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
    googleAnalytics: String,
    googleSearchConsole: String
  },
  theme: {
    primaryColor: {
      type: String,
      default: '#3B82F6'
    },
    secondaryColor: {
      type: String,
      default: '#10B981'
    },
    fontFamily: {
      type: String,
      default: 'Inter'
    }
  },
  features: {
    blog: {
      enabled: {
        type: Boolean,
        default: true
      },
      postsPerPage: {
        type: Number,
        default: 6
      }
    },
    portfolio: {
      enabled: {
        type: Boolean,
        default: true
      },
      projectsPerPage: {
        type: Number,
        default: 9
      }
    },
    contact: {
      enabled: {
        type: Boolean,
        default: true
      },
      emailService: String
    },
    analytics: {
      enabled: {
        type: Boolean,
        default: false
      }
    }
  },
  widgets: {
    currentlyBuilding: { type: String, default: '' },
    currentlyReading: { type: String, default: '' },
    siteLastUpdated: { type: Date }
  },
  languages: {
    default: {
      type: String,
      default: 'en'
    },
    supported: [{
      code: String,
      name: String,
      flag: String
    }]
  },
  footer: {
    companyName: {
      type: String,
      default: 'Your Name'
    },
    copyrightText: {
      type: String,
      default: '© 2026 Your Name. All rights reserved.'
    },
    description: {
      type: String,
      default: 'Built with Next.js & Tailwind CSS'
    },
    links: [{
      label: String,
      url: String,
      category: String,
      order: Number
    }],
    socialLinks: [{
      platform: String,
      url: String,
      icon: String
    }],
    newsletter: {
      enabled: {
        type: Boolean,
        default: false
      },
      title: String,
      description: String
    },
    contact: {
      enabled: {
        type: Boolean,
        default: true
      },
      email: String,
      phone: String
    }
  }
}, {
  timestamps: true
});

// Create a singleton settings document
settingsSchema.statics.getSettings = async function() {
  let settings = await this.findOne();
  if (!settings) {
    settings = await this.create({});
  }
  return settings;
};

module.exports = mongoose.model('Settings', settingsSchema);
