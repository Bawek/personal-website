import jwt from 'jsonwebtoken';

/**
 * Authentication middleware for Next.js API routes
 * Wraps an API handler and verifies JWT token
 * 
 * Usage:
 * export default authMiddleware(handler);
 */
export const authMiddleware = (handler) => async (req, res) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to request
    req.user = decoded;
    
    // Call the original handler
    return handler(req, res);
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired' });
    }
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't fail if missing
 */
export const optionalAuth = (handler) => async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Silently fail - user is just not authenticated
  }
  
  return handler(req, res);
};

/**
 * Rate limiting helper (basic implementation)
 * For production, consider using Upstash Rate Limit
 */
const requestCounts = new Map();

export const rateLimit = (options = {}) => {
  const { maxRequests = 10, windowMs = 60000 } = options;
  
  return (handler) => async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    const now = Date.now();
    const userRequests = requestCounts.get(ip) || [];
    
    // Remove old requests outside the time window
    const recentRequests = userRequests.filter(time => now - time < windowMs);
    
    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({ message: 'Too many requests' });
    }
    
    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    
    return handler(req, res);
  };
};
