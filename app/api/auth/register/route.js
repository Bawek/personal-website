import connectDB from '@/lib/db'
import User from '@/lib/models/User'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

/**
 * Register API
 * POST /api/auth/register
 */
export async function POST(req) {
  await connectDB()

  try {
    const { email, password, name } = await req.json()

    // Validation
    if (!email || !password || !name) {
      return Response.json(
        { message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return Response.json(
        { message: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return Response.json(
        { message: 'User already exists' },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Check if this is the first user - make them admin
    const userCount = await User.countDocuments()
    const isFirstUser = userCount === 0

    // Create user
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: isFirstUser ? 'admin' : 'user', // First user is admin
    })

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return Response.json(
      {
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          isFirstUser,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Registration error:', error)
    return Response.json({ message: 'Server error' }, { status: 500 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
