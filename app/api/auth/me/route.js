import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import { authMiddleware, unauthorizedResponse } from '@/lib/middleware/auth'
import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'

/**
 * Get current user API
 * GET /api/auth/me
 * Protected route - requires authentication
 */
export async function GET(req) {
  try {
    const user = authMiddleware(req)
    if (!user) {
      return unauthorizedResponse()
    }

    await connectDB()

    const currentUser = await User.findById(user.userId).select('-password')
    
    if (!currentUser) {
      return NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: currentUser._id,
      email: currentUser.email,
      name: currentUser.name,
      role: currentUser.role,
      isActive: currentUser.isActive,
      lastLogin: currentUser.lastLogin,
    }, { status: 200 })
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
