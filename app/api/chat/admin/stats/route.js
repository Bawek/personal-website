import connectDB from '@/lib/db';
import Conversation from '@/lib/models/Conversation';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/chat/admin/stats - Get chat statistics (protected - admin only)
 */
export async function GET(req) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();

    // Get all stats
    const totalConversations = await Conversation.countDocuments();
    const openConversations = await Conversation.countDocuments({ status: 'open' });
    const resolvedConversations = await Conversation.countDocuments({ status: 'resolved' });
    const inProgressConversations = await Conversation.countDocuments({ status: 'in-progress' });

    // Get priority breakdown
    const priorityBreakdown = await Conversation.aggregate([
      {
        $group: {
          _id: '$priority',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get category breakdown
    const categoryBreakdown = await Conversation.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);

    // Get average response time (simplified - in real app, compare first message to first response)
    const recentConversations = await Conversation.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('createdAt updatedAt');

    const stats = {
      total: totalConversations,
      open: openConversations,
      inProgress: inProgressConversations,
      resolved: resolvedConversations,
      priorityBreakdown: priorityBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
      categoryBreakdown: categoryBreakdown.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    };

    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
