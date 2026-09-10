import connectDB from '@/lib/db';
import Conversation from '@/lib/models/Conversation';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * POST /api/chat/[id]/message - Add message to conversation (protected - admin or creator)
 */
export async function POST(req, { params }) {
  try {
    const user = authMiddleware(req);
    if (!user) {
      return unauthorizedResponse();
    }

    await connectDB();
    const { sender, content } = await req.json();

    // Validation
    if (!sender || !content) {
      return NextResponse.json(
        { message: 'sender and content are required' },
        { status: 400 }
      );
    }

    if (!['visitor', 'admin'].includes(sender)) {
      return NextResponse.json(
        { message: 'Invalid sender type' },
        { status: 400 }
      );
    }

    // For admin sender, must be admin user
    if (sender === 'admin' && !isAdmin(user)) {
      return unauthorizedResponse();
    }

    const { id } = await params;
    const conversation = await Conversation.findById(id);
    if (!conversation) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    // Add message
    const message = {
      sender,
      senderName: sender === 'admin' ? user.name : conversation.visitorName,
      senderEmail: sender === 'admin' ? user.email : conversation.visitorEmail,
      content,
      createdAt: new Date(),
    };

    conversation.messages.push(message);
    conversation.updatedAt = new Date();
    await conversation.save();

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('Error adding message:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
