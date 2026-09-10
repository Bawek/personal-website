import mongoose from 'mongoose';

const ConversationSchema = new mongoose.Schema(
  {
    visitorName: { type: String, required: true },
    visitorEmail: { type: String, required: true },
    subject: { type: String, required: true },
    category: {
      type: String,
      enum: ['support', 'inquiry', 'project', 'other'],
      default: 'other',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    messages: [
      {
        sender: {
          type: String,
          enum: ['visitor', 'admin'],
          required: true,
        },
        senderName: { type: String },
        senderEmail: { type: String },
        content: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
  },
  { timestamps: true }
);

const Conversation =
  mongoose.models.Conversation || mongoose.model('Conversation', ConversationSchema);

export default Conversation;
