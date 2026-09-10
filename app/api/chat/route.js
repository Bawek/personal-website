import connectDB from '@/lib/db';
import Conversation from '@/lib/models/Conversation';
import { NextResponse } from 'next/server';

/**
 * POST /api/chat - Start a new conversation (public)
 */
export async function POST(req) {
  try {
    await connectDB();
    const { visitorName, visitorEmail, subject, category, createdBy } = await req.json();

    // Validation
    if (!visitorName || !visitorEmail || !subject) {
      return NextResponse.json(
        { message: 'visitorName, visitorEmail, and subject are required' },
        { status: 400 }
      );
    }

    const conversation = await Conversation.create({
      visitorName,
      visitorEmail,
      subject,
      category: category || 'other',
      status: 'open',
      priority: 'medium',
      messages: [],
      createdBy: createdBy || null,
    });

    return NextResponse.json({ conversation }, { status: 201 });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
