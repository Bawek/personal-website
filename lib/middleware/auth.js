import jwt from 'jsonwebtoken';

/**
 * Verify JWT token from Authorization header
 * Returns the decoded token or null if invalid
 */
export function verifyToken(token) {
  if (!token) return null;

  try {
    // Remove 'Bearer ' prefix if present
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
    return decoded;
  } catch (error) {
    console.error('Token verification error:', error.message);
    return null;
  }
}

/**
 * Auth middleware wrapper for API routes
 * Usage: const user = authMiddleware(req); if (!user) return unauthorized response;
 */
export function authMiddleware(req) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader) return null;

  return verifyToken(authHeader);
}

/**
 * Check if user has admin role
 */
export function isAdmin(user) {
  return user && (user.role === 'admin' || user.role === 'editor');
}

/**
 * Create unauthorized response
 */
export function unauthorizedResponse() {
  return Response.json({ message: 'Unauthorized' }, { status: 401 });
}

/**
 * Create forbidden response
 */
export function forbiddenResponse() {
  return Response.json({ message: 'Forbidden' }, { status: 403 });
}
