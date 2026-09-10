import connectDB from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/contact/messages/[id] - Get single message (protected)
 */
export async function GET(req, { params }) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const { id } = await params;
    const message = await Contact.findById(id);

    if (!message) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error('Error fetching message:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * PATCH /api/contact/messages/[id] - Update message (protected)
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
    const message = await Contact.findById(id);

    if (!message) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    // Update fields
    if (data.status) message.status = data.status;
    if (data.read !== undefined) {
      message.read = data.read;
      if (data.read && !message.readAt) {
        message.readAt = new Date();
      }
    }
    if (data.adminNotes) message.adminNotes = data.adminNotes;

    await message.save();

    return NextResponse.json(message, { status: 200 });
  } catch (error) {
    console.error('Error updating message:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/contact/messages/[id] - Delete message (protected)
 */
export async function DELETE(req, { params }) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const { id } = await params;
    const message = await Contact.findByIdAndDelete(id);

    if (!message) {
      return NextResponse.json({ message: 'Message not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Message deleted' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting message:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
