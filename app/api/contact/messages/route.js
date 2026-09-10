import connectDB from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/contact/messages - Get all contact messages (protected - admin only)
 */
export async function GET(req) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const read = searchParams.get('read');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    let query = {};
    if (status) query.status = status;
    if (read !== null) query.read = read === 'true';

    const skip = (page - 1) * limit;
    const messages = await Contact.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Contact.countDocuments(query);

    return NextResponse.json(
      {
        messages,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
