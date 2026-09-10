import connectDB from '@/lib/db'
import Skill from '@/lib/models/Skill'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * Single Skill API
 * GET /api/skills/[id] - Get skill by ID (public)
 * PUT /api/skills/[id] - Update skill (protected - admin only)
 * DELETE /api/skills/[id] - Delete skill (protected - admin only)
 */
export async function GET(req, { params }) {
  await connectDB()
  const { id } = await params

  try {
    const skill = await Skill.findById(id)
    if (!skill) {
      return NextResponse.json(
        { message: 'Skill not found' },
        { status: 404 }
      )
    }
    return NextResponse.json({ skill }, { status: 200 })
  } catch (error) {
    console.error('Error fetching skill:', error)
    return NextResponse.json(
      { message: 'Error fetching skill' },
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

    const skill = await Skill.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    )

    if (!skill) {
      return NextResponse.json(
        { message: 'Skill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ skill }, { status: 200 })
  } catch (error) {
    console.error('Error updating skill:', error)
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

    const skill = await Skill.findByIdAndDelete(id)

    if (!skill) {
      return NextResponse.json(
        { message: 'Skill not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Skill deleted successfully' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting skill:', error)
    return NextResponse.json(
      { message: 'Error deleting skill' },
      { status: 500 }
    )
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
