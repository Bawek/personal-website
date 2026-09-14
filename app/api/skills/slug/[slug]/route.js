import connectDB from '@/lib/db'
import Skill from '@/lib/models/Skill'
import { NextResponse } from 'next/server'

/**
 * GET /api/skills/slug/[slug] - Get skill by slug
 */
export async function GET(req, { params }) {
  try {
    await connectDB()

    const { slug } = await params
    
    if (!slug) {
      return NextResponse.json({ message: 'Slug is required' }, { status: 400 })
    }

    const skill = await Skill.findOne({ slug })
    if (!skill) {
      return NextResponse.json({ message: 'Skill not found' }, { status: 404 })
    }

    return NextResponse.json({ skill }, { status: 200 })
  } catch (error) {
    console.error('Error fetching skill by slug:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}