import connectDB from '../../../lib/db';
import Project from '../../../lib/models/Project';
import { authMiddleware } from '../../../lib/middleware/auth';

/**
 * Single Project API
 * GET /api/projects/[id] - Get project by ID (public)
 * PUT /api/projects/[id] - Update project (protected)
 * DELETE /api/projects/[id] - Delete project (protected)
 */
async function handler(req, res) {
  await connectDB();
  const { id } = req.query;

  // GET - Fetch single project
  if (req.method === 'GET') {
    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      return res.status(200).json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      return res.status(500).json({ message: 'Error fetching project' });
    }
  }

  // PUT - Update project
  if (req.method === 'PUT') {
    try {
      const project = await Project.findByIdAndUpdate(
        id,
        { ...req.body, updatedAt: new Date() },
        { new: true, runValidators: true }
      );
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      return res.status(200).json(project);
    } catch (error) {
      console.error('Error updating project:', error);
      return res.status(400).json({ message: error.message });
    }
  }

  // DELETE - Delete project
  if (req.method === 'DELETE') {
    try {
      const project = await Project.findByIdAndDelete(id);
      
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      
      return res.status(200).json({ message: 'Project deleted successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      return res.status(500).json({ message: 'Error deleting project' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}

// Export with conditional auth:
// GET requests are public, PUT/DELETE require authentication
export default async function (req, res) {
  if (req.method === 'GET') {
    return handler(req, res);
  }
  return authMiddleware(handler)(req, res);
}
