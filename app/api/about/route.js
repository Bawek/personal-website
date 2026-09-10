import connectDB from '@/lib/db';
import About from '@/lib/models/About';
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth';
import { NextResponse } from 'next/server';

/**
 * GET /api/about - Get about page content (public)
 */
export async function GET(req) {
  try {
    await connectDB();
    let about = await About.findOne();

    // Return default structure if not found
    if (!about) {
      about = {
        hero: { title: '', subtitle: '', imageUrl: '', cta: '', ctaUrl: '' },
        whoAmI: { title: '', description: '', highlights: [] },
        stats: [],
        resumeUrl: '',
      };
    }

    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    console.error('Error fetching about:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

/**
 * PUT /api/about - Update about page content (protected - admin only)
 */
export async function PUT(req) {
  try {
    const user = authMiddleware(req);
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse();
    }

    await connectDB();
    const data = await req.json();

    let about = await About.findOne();
    if (!about) {
      about = new About();
    }

    // Update fields
    if (data.hero) about.hero = { ...about.hero, ...data.hero };
    if (data.whoAmI) about.whoAmI = { ...about.whoAmI, ...data.whoAmI };
    if (data.stats) about.stats = data.stats;
    if (data.resumeUrl) about.resumeUrl = data.resumeUrl;

    await about.save();

    return NextResponse.json(about, { status: 200 });
  } catch (error) {
    console.error('Error updating about:', error);
    return NextResponse.json({ message: error.message }, { status: 400 });
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 });
}
