import connectDB from '@/lib/db'
import Content from '@/lib/models/Content'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * Single Content API
 * GET /api/content/[id] - Get content by ID (public)
 * PUT /api/content/[id] - Update content (protected - admin only)
 * DELETE /api/content/[id] - Delete content (protected - admin only)
 */
export async function GET(req, { params }) {
  try {
    await connectDB()
    const { id } = await params
    const content = await Content.findById(id).populate('author', 'name email')
    
    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(content, { status: 200 })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { message: 'Error fetching content' },
      { status: 500 }
    )
  }
}

export async function PUT(req, { params }) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const { id } = await params
    const body = await req.json()

    const content = await Content.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(content, { status: 200 })
  } catch (error) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      { message: error.message },
      { status: 400 }
    )
  }
}

export async function DELETE(req, { params }) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const { id } = await params

    const content = await Content.findByIdAndDelete(id)

    if (!content) {
      return NextResponse.json(
        { message: 'Content not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Content deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      { message: 'Error deleting content' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
