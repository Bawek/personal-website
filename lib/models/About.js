import mongoose from 'mongoose';

const AboutSchema = new mongoose.Schema(
  {
    hero: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      imageUrl: { type: String, default: '' },
      cta: { type: String, default: '' },
      ctaUrl: { type: String, default: '' },
    },
    whoAmI: {
      title: { type: String, default: '' },
      description: { type: String, default: '' },
      highlights: [{ type: String }],
    },
    stats: [
      {
        label: { type: String },
        value: { type: String },
      },
    ],
    resumeUrl: { type: String, default: '' },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const About = mongoose.models.About || mongoose.model('About', AboutSchema);

export default About;
