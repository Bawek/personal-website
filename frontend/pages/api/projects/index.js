import connectDB from '../../../lib/db';
import Project from '../../../lib/models/Project';
import { authMiddleware } from '../../../lib/middleware/auth';

/**
 * Projects API
 * GET /api/projects - Get all projects (public)
 * POST /api/projects - Create a project (protected)
 */
async function handler(req, res) {
  await connectDB();

  // GET - Fetch all projects
  if (req.method === 'GET') {
    try {
      const { featured } = req.query;
      
      let query = {};
      if (featured === 'true') {
        query.featured = true;
      }

      const projects = await Project.find(query).sort({ createdAt: -1 });
      return res.status(200).json(projects);
    } catch (error) {
      console.error('Error fetching projects:', error);
      return res.status(500).json({ message: 'Error fetching projects' });
    }
  }

  // POST - Create new project (requires auth)
  if (req.method === 'POST') {
    try {
      const project = await Project.create({
        ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      return res.status(201).json(project);
    } catch (error) {
      console.error('Error creating project:', error);
      return res.status(400).json({ message: error.message });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

// Export with conditional auth:
// GET requests are public, POST requires authentication
export default async function (req, res) {
  if (req.method === 'POST') {
    return authMiddleware(handler)(req, res);
  }
  return handler(req, res);
}
