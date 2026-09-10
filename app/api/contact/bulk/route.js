import connectDB from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * PATCH /api/contact/bulk - Bulk update messages (protected - admin only)
 */
export async function PATCH(req) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const { ids, action, status, read } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: 'Invalid ids' }, { status: 400 });
    }

    const updateData = {};

    if (action === 'read') {
      updateData.read = true;
      updateData.readAt = new Date();
    } else if (action === 'unread') {
      updateData.read = false;
      updateData.readAt = null;
    } else if (status) {
      updateData.status = status;
    }

    const result = await Contact.updateMany(
      { _id: { $in: ids } },
      { $set: updateData }
    );

    return NextResponse.json(
      {
        message: 'Messages updated',
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating messages:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

/**
 * DELETE /api/contact/bulk - Bulk delete messages (protected - admin only)
 */
export async function DELETE(req) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const { ids } = await req.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ message: 'Invalid ids' }, { status: 400 });
    }

    const result = await Contact.deleteMany({ _id: { $in: ids } });

    return NextResponse.json(
      {
        message: 'Messages deleted',
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting messages:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
