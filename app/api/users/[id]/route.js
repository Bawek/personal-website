import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * GET /api/users/[id] - Get single user details (admin only)
 */
export async function GET(req, { params }) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const { id } = await params
    const targetUser = await User.findById(id).select('-password')

    if (!targetUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(targetUser, { status: 200 })
  } catch (error) {
    console.error('Error fetching user:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

/**
 * PUT /api/users/[id] - Update user (admin only)
 */
export async function PUT(req, { params }) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const data = await req.json()

    // Don't allow password changes via this endpoint
    const { password, ...updateData } = data

    const { id } = await params
    const updatedUser = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(updatedUser, { status: 200 })
  } catch (error) {
    console.error('Error updating user:', error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

/**
 * DELETE /api/users/[id] - Delete user (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    await connectDB()
    const { id } = await params
    const deletedUser = await User.findByIdAndDelete(id)

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'User deleted' }, { status: 200 })
  } catch (error) {
    console.error('Error deleting user:', error)
    return NextResponse.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
