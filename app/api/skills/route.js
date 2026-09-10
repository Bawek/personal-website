import connectDB from '@/lib/db'
import Skill from '@/lib/models/Skill'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * Skills API
 * GET /api/skills - Get all skills (public)
 * POST /api/skills - Create a skill (protected - admin only)
 */
export async function GET(req) {
  await connectDB();

  try {
    const { searchParams } = new URL(req.url)
    const category = searchParams.get('category')
    const level = searchParams.get('level')

    let query = {}
    if (category) query.category = category.toLowerCase()
    if (level) query.level = level.toLowerCase()

    const skills = await Skill.find(query).sort({ category: 1, name: 1 })
    return NextResponse.json({ skills }, { status: 200 })
  } catch (error) {
    console.error('Error fetching skills:', error)
    return NextResponse.json({ message: 'Error fetching skills' }, { status: 500 })
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

    // Validation
    if (!body.name || !body.category) {
      return NextResponse.json(
        { message: 'name and category are required' },
        { status: 400 }
      )
    }

    const skill = await Skill.create({
      ...body,
      createdBy: user.userId,
    })
    return NextResponse.json({ skill }, { status: 201 })
  } catch (error) {
    console.error('Error creating skill:', error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
