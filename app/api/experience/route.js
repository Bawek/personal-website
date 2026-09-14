import connectDB from '@/lib/db'
import Experience from '@/lib/models/Experience'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * GET /api/experience
 * Public endpoint - Get all experience entries
 */
export async function GET(req) {
  try {
    await connectDB()
    const experiences = await Experience.find().sort({ startDate: -1 })
    return NextResponse.json({ experience: experiences }, { status: 200 })
  } catch (error) {
    console.error('Experience fetch error:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/experience
 * Protected endpoint - Create new experience entry (admin only)
 */
export async function POST(req) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const data = await req.json()

    // Validation
    if (!data.title || !data.company || !data.startDate || !data.description) {
      return NextResponse.json(
        { message: 'title, company, startDate, and description are required' },
        { status: 400 }
      )
    }

    const experience = new Experience({
      title: data.title,
      company: data.company,
      location: data.location || '',
      employmentType: data.employmentType || 'full-time',
      startDate: data.startDate,
      endDate: data.endDate || null,
      current: data.current || false,
      description: data.description,
    })

    await experience.save()
    return NextResponse.json({ experience }, { status: 201 })
  } catch (error) {
    console.error('Experience creation error:', error)
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
