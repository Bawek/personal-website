import connectDB from '@/lib/db'
import Project from '@/lib/models/Project'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * Projects API
 * GET /api/projects - Get all projects (public)
 * POST /api/projects - Create a project (protected - admin only)
 */
async function handleGET(req) {
  await connectDB()

  try {
    const { searchParams } = new URL(req.url)
    const featured = searchParams.get('featured')
    
    let query = {}
    if (featured === 'true') {
      query.featured = true
    }

    const projects = await Project.find(query).sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json({ message: 'Error fetching projects' }, { status: 500 })
  }
}

async function handlePOST(req) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()

    const body = await req.json()

    // Validation
    if (!body.title || !body.description) {
      return NextResponse.json(
        { message: 'title and description are required' },
        { status: 400 }
      )
    }

    const project = await Project.create({
      ...body,
      createdBy: user.userId,
    })
    return NextResponse.json({ project }, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function GET(req) {
  return handleGET(req)
}

export async function POST(req) {
  return handlePOST(req)
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
