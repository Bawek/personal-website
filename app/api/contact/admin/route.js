/**
 * Get default admin user
 * GET /api/contact/admin
 * Returns the admin user ID for chat functionality
 */
export async function GET(req) {
  // TODO: Implement getting default admin from database
  // For now, return a placeholder ID
  return Response.json({
    adminId: 'admin-user-id-placeholder',
    name: 'Admin',
    email: 'admin@example.com',
  })
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
