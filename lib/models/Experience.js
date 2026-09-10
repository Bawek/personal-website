import mongoose from 'mongoose'

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, default: '' },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship'],
      default: 'full-time',
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, default: null },
    current: { type: Boolean, default: false },
    description: { type: String, required: true },
  },
  { timestamps: true }
)

const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema)

export default Experience
