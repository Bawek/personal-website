import connectDB from '@/lib/db'
import Experience from '@/lib/models/Experience'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * GET /api/experience/[id]
 * Public endpoint - Get single experience entry
 */
export async function GET(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const experience = await Experience.findById(id)

    if (!experience) {
      return NextResponse.json(
        { message: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(experience, { status: 200 })
  } catch (error) {
    console.error('Experience fetch error:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/experience/[id]
 * Protected endpoint - Update experience entry (admin only)
 */
export async function PUT(req, { params }) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const data = await req.json()
    const { id } = await params

    const experience = await Experience.findByIdAndUpdate(
      id,
      {
        title: data.title,
        company: data.company,
        location: data.location,
        employmentType: data.employmentType,
        startDate: data.startDate,
        endDate: data.endDate || null,
        current: data.current,
        description: data.description,
      },
      { new: true }
    )

    if (!experience) {
      return NextResponse.json(
        { message: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(experience, { status: 200 })
  } catch (error) {
    console.error('Experience update error:', error)
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    )
  }
}

/**
 * DELETE /api/experience/[id]
 * Protected endpoint - Delete experience entry (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const { id } = await params
    const experience = await Experience.findByIdAndDelete(id)

    if (!experience) {
      return NextResponse.json(
        { message: 'Not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: 'Deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Experience delete error:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
