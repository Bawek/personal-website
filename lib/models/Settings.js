import mongoose from 'mongoose';

const SettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'My Portfolio' },
    siteDescription: { type: String, default: '' },
    siteUrl: { type: String, default: '' },
    seo: {
      metaTitle: { type: String, default: '' },
      metaDescription: { type: String, default: '' },
      keywords: [{ type: String }],
    },
    footer: {
      text: { type: String, default: '' },
      social: [
        {
          platform: { type: String },
          url: { type: String },
          icon: { type: String },
        },
      ],
      links: [
        {
          label: { type: String },
          url: { type: String },
        },
      ],
      newsletter: {
        enabled: { type: Boolean, default: false },
        description: { type: String, default: '' },
      },
    },
    widgets: {
      siteLastUpdated: { type: Date, default: Date.now },
      showTestimonials: { type: Boolean, default: true },
      showArticles: { type: Boolean, default: true },
      showContactForm: { type: Boolean, default: true },
    },
    contact: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      location: { type: String, default: '' },
    },
    analytics: {
      googleAnalyticsId: { type: String, default: '' },
      hotjarId: { type: String, default: '' },
    },
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);

export default Settings;
