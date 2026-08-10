import connectDB from '../../../lib/db';
import User from '../../../lib/models/User';
import { authMiddleware } from '../../../lib/middleware/auth';

/**
 * Get current user API
 * GET /api/auth/me
 * Protected route - requires authentication
 */
async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();

  try {
    // req.user is populated by authMiddleware
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (error) {
    console.error('Get user error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
}

export default authMiddleware(handler);
