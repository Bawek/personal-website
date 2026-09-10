import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import { authMiddleware, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * POST /api/sync/settings - Update sync settings for current user
 */
export async function POST(req) {
  try {
    const user = authMiddleware(req)
    if (!user) {
      return unauthorizedResponse()
    }

    await connectDB()
    const data = await req.json()

    // Update current user's sync settings
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      {
        syncSettings: {
          autoSyncGithub: data.autoSyncGithub || false,
          autoPostLinkedin: data.autoPostLinkedin || false,
          githubUsername: data.githubUsername || '',
          linkedinEnabled: data.linkedinEnabled || false,
        },
      },
      { new: true }
    ).select('-password')

    return NextResponse.json(
      {
        message: 'Sync settings updated',
        settings: updatedUser.syncSettings,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating sync settings:', error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
