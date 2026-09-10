import connectDB from '@/lib/db';
import Contact from '@/lib/models/Contact';
import { NextResponse } from 'next/server';

/**
 * GET /api/contact - Get public contact info (public)
 */
export async function GET(req) {
  try {
    await connectDB();
    
    // Return static contact info for now
    // In future, could fetch from Settings model
    const contactInfo = {
      email: process.env.CONTACT_EMAIL || 'contact@example.com',
      phone: process.env.CONTACT_PHONE || '',
      location: process.env.CONTACT_LOCATION || '',
      responseTime: process.env.CONTACT_RESPONSE_TIME || 'Within 24 hours',
    };

    return NextResponse.json(contactInfo, { status: 200 });
  } catch (error) {
    console.error('Error fetching contact:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * POST /api/contact - Submit contact form (public)
 */
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, subject, message } = await req.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { message: 'All fields are required' },
        { status: 400 }
      );
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Store in database
    const contact = await Contact.create({
      name,
      email,
      subject,
      message,
      status: 'new',
      read: false,
    });

    // TODO: Send email notification to admin
    // TODO: Send confirmation email to visitor

    return NextResponse.json(
      {
        message: 'Message received. We will contact you soon!',
        contact,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
