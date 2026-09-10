import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * GET /api/users - List all users (admin only)
 */
export async function GET(req) {
  try {
    const user = authMiddleware(req)
    
    // Debug logging
    console.log('Auth middleware result:', user)
    console.log('Request headers:', req.headers.get('authorization'))
    
    if (!user || !isAdmin(user)) {
      console.log('Access denied - user:', user, 'isAdmin:', user ? isAdmin(user) : false)
      return unauthorizedResponse()
    }

    await connectDB()

    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const role = searchParams.get('role')

    let query = {}
    if (role) query.role = role

    const skip = (page - 1) * limit
    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })

    const total = await User.countDocuments(query)

    return NextResponse.json(
      {
        users,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error fetching users:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

/**
 * POST /api/users - Create new user (admin only)
 */
export async function POST(req) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const data = await req.json()

    // Check if user exists
    const existingUser = await User.findOne({ email: data.email })
    if (existingUser) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const newUser = await User.create(data)
    const userResponse = newUser.toObject()
    delete userResponse.password

    return NextResponse.json(userResponse, { status: 201 })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
