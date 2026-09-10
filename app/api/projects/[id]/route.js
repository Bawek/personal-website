import connectDB from '@/lib/db'
import Project from '@/lib/models/Project'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * Single Project API
 * GET /api/projects/[id] - Get project by ID (public)
 * PUT /api/projects/[id] - Update project (protected - admin only)
 * DELETE /api/projects/[id] - Delete project (protected - admin only)
 */
export async function GET(req, { params }) {
  await connectDB()
  const { id } = await params

  try {
    const project = await Project.findById(id)
    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }
    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { message: 'Error fetching project' },
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

    const project = await Project.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(project, { status: 200 })
  } catch (error) {
    console.error('Error updating project:', error)
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

    const project = await Project.findByIdAndDelete(id)

    if (!project) {
      return NextResponse.json(
        { message: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Project deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { message: 'Error deleting project' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
