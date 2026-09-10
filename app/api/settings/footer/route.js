import connectDB from '@/lib/db';
import Settings from '@/lib/models/Settings';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/settings/footer - Get footer settings (public)
 */
export async function GET(req) {
  try {
    await connectDB();
    let settings = await Settings.findOne();

    const footer = settings?.footer || {
      text: '',
      social: [],
      links: [],
      newsletter: { enabled: false, description: '' },
    };

    return NextResponse.json({ footer }, { status: 200 });
  } catch (error) {
    console.error('Error fetching footer settings:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/settings/footer - Update footer settings (protected - admin only)
 */
export async function PUT(req) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const data = await req.json();

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings();
    }

    settings.footer = {
      text: data.text || settings.footer.text,
      social: data.social || settings.footer.social,
      links: data.links || settings.footer.links,
      newsletter: data.newsletter || settings.footer.newsletter,
    };

    await settings.save();

    return NextResponse.json({ footer: settings.footer }, { status: 200 });
  } catch (error) {
    console.error('Error updating footer settings:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
