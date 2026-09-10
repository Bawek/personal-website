import connectDB from '@/lib/db'
import Content from '@/lib/models/Content'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * Content API
 * GET /api/content - Get published content (posts, testimonials, etc.)
 * POST /api/content - Create content (protected - admin only)
 */
export async function GET(req) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || 'post'
    const status = searchParams.get('status') || 'published'
    const limit = parseInt(searchParams.get('limit')) || 10
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'publishedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const query = { type, status }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ]
    }

    const sortOptions = {}
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1

    const contents = await Content.find(query)
      .sort(sortOptions)
      .limit(limit)
      .populate('author', 'name email')
      .lean()

    const total = await Content.countDocuments(query)

    return NextResponse.json({
      contents,
      total,
      limit
    })
  } catch (error) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      { message: 'Error fetching content' },
      { status: 500 }
    )
  }
}

export async function POST(req) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const body = await req.json()

    const content = await Content.create({
      ...body,
      author: user.id,
      slug: body.slug || body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    })

    return NextResponse.json(content, { status: 201 })
  } catch (error) {
    console.error('Error creating content:', error)
    return NextResponse.json(
      { message: error.message || 'Error creating content' },
      { status: 400 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
