import connectDB from '@/lib/db';
import Conversation from '@/lib/models/Conversation';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/chat/[id] - Get conversation by ID (protected - admin only)
 */
export async function GET(req, { params }) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const { id } = await params;
    const conversation = await Conversation.findById(id).populate('createdBy', 'name email');

    if (!conversation) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ conversation }, { status: 200 });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/chat/[id] - Update conversation status/priority (protected - admin only)
 */
export async function PATCH(req, { params }) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const data = await req.json();
    const { id } = await params;
    const conversation = await Conversation.findById(id);

    if (!conversation) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    // Update fields
    if (data.status) conversation.status = data.status;
    if (data.priority) conversation.priority = data.priority;
    if (data.assignedTo !== undefined) conversation.assignedTo = data.assignedTo;

    await conversation.save();

    return NextResponse.json({ conversation }, { status: 200 });
  } catch (error) {
    console.error('Error updating conversation:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/chat/[id] - Delete conversation (protected - admin only)
 */
export async function DELETE(req, { params }) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const { id } = await params;
    const conversation = await Conversation.findByIdAndDelete(id);

    if (!conversation) {
      return NextResponse.json({ message: 'Conversation not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Conversation deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
