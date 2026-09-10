/**
 * Health check endpoint
 * GET /api/health
 */
export async function GET(req) {
  return Response.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  })
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
