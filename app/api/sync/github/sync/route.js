import { authMiddleware, isAdmin, unauthorizedResponse } from '@/lib/middleware/auth'
import { NextResponse } from 'next/server'

/**
 * POST /api/sync/github/sync - Sync GitHub repositories (stub)
 * This endpoint would integrate with GitHub API to fetch and sync repositories
 */
export async function POST(req) {
  try {
    const user = authMiddleware(req)
    if (!user || !isAdmin(user)) {
      return unauthorizedResponse()
    }

    const { username } = await req.json()

    if (!username) {
      return NextResponse.json(
        { message: 'GitHub username is required' },
        { status: 400 }
      )
    }

    // TODO: Implement actual GitHub API integration
    // For now, return a stub response
    try {
      // This would call GitHub API
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`, {
        headers: {
          'Accept': 'application/vnd.github.v3+json',
          ...(process.env.GITHUB_TOKEN && { 'Authorization': `token ${process.env.GITHUB_TOKEN}` })
        }
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: 'GitHub user not found or API error' },
          { status: 404 }
        )
      }

      const repos = await response.json()

      // You would typically save these to your database here
      // For now, just return success with count
      return NextResponse.json(
        {
          message: `Successfully synced repositories`,
          synced: repos.length,
          repositories: repos.map(r => ({
            name: r.name,
            description: r.description,
            url: r.html_url,
            language: r.language,
            stars: r.stargazers_count
          }))
        },
        { status: 200 }
      )
    } catch (error) {
      return NextResponse.json(
        { error: 'Failed to fetch repositories from GitHub' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Error syncing GitHub:', error)
    return NextResponse.json({ message: error.message }, { status: 400 })
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200 })
}
