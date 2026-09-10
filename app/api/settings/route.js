import connectDB from '@/lib/db';
import Settings from '@/lib/models/Settings';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/settings - Get site settings (public)
 */
export async function GET(req) {
  try {
    await connectDB();
    let settings = await Settings.findOne();

    // Return default settings if not found
    if (!settings) {
      settings = {
        siteName: 'My Portfolio',
        siteDescription: '',
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || '',
        seo: {
          metaTitle: '',
          metaDescription: '',
          keywords: [],
        },
        footer: {
          text: '',
          social: [],
          links: [],
          newsletter: { enabled: false, description: '' },
        },
        widgets: {
          siteLastUpdated: new Date(),
          showTestimonials: true,
          showArticles: true,
          showContactForm: true,
        },
        contact: {
          email: '',
          phone: '',
          location: '',
        },
        analytics: {
          googleAnalyticsId: '',
          hotjarId: '',
        },
      };
    }

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/settings - Update site settings (protected - admin only)
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

    // Update fields
    if (data.siteName) settings.siteName = data.siteName;
    if (data.siteDescription) settings.siteDescription = data.siteDescription;
    if (data.siteUrl) settings.siteUrl = data.siteUrl;
    if (data.seo) settings.seo = { ...settings.seo, ...data.seo };
    if (data.footer) settings.footer = { ...settings.footer, ...data.footer };
    if (data.widgets) settings.widgets = { ...settings.widgets, ...data.widgets };
    if (data.contact) settings.contact = { ...settings.contact, ...data.contact };
    if (data.analytics) settings.analytics = { ...settings.analytics, ...data.analytics };

    settings.updatedAt = new Date();
    await settings.save();

    return NextResponse.json({ settings }, { status: 200 });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
