import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema(
  {
    // Contact form submission
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ['new', 'read', 'replied', 'archived'],
      default: 'new',
    },
    read: { type: Boolean, default: false },
    readAt: { type: Date, default: null },
    replied: { type: Boolean, default: false },
    repliedAt: { type: Date, default: null },
    adminNotes: { type: String, default: '' },
  },
  { timestamps: true }
);

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

export default Contact;
