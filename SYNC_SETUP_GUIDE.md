# GitHub & LinkedIn Sync Setup Guide

## Overview
This guide helps you set up automatic synchronization between your portfolio and GitHub/LinkedIn accounts.

## GitHub Integration

### 1. Get GitHub Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Click "Generate new token (classic)"
3. Give it a name (e.g., "Portfolio Sync")
4. Select scopes:
   - `repo` (Access repositories)
   - `user` (Read user profile data)
5. Click "Generate token"
6. Copy the token (you won't see it again)

### 2. Add to Environment Variables

Add to your `.env` file:
```env
GITHUB_TOKEN=your_github_token_here
GITHUB_WEBHOOK_SECRET=your_webhook_secret_here
```

### 3. Set Up GitHub Webhook (Optional)

For automatic repository creation detection:

1. Go to your GitHub repository > Settings > Webhooks
2. Click "Add webhook"
3. Payload URL: `https://your-domain.com/api/sync/github/webhook`
4. Content type: `application/json`
5. Secret: Use the same as `GITHUB_WEBHOOK_SECRET`
6. Select events: "Repository creations", "Pushes"
7. Click "Add webhook"

## LinkedIn Integration

### 1. Create LinkedIn App

1. Go to LinkedIn Developer Portal
2. Create new app
3. Add products:
   - "Share on LinkedIn"
   - "Sign In with LinkedIn"
4. Configure OAuth 2.0 redirect URLs:
   - `http://localhost:3000/auth/linkedin/callback` (development)
   - `https://your-domain.com/auth/linkedin/callback` (production)

### 2. Get LinkedIn Access Token

1. Use OAuth 2.0 flow or get a temporary token from LinkedIn Developer Portal
2. Add to environment variables:
```env
LINKEDIN_ACCESS_TOKEN=your_linkedin_access_token
LINKEDIN_PERSON_URN=urn:li:person:your_person_id
```

### 3. Required LinkedIn Permissions

Make sure your app has these permissions:
- `r_liteprofile` - Read basic profile
- `r_emailaddress` - Get email address
- `w_member_social` - Create posts
- `w_share` - Share content

## Usage

### Manual Sync

1. Go to Admin Dashboard > Sync Settings
2. Enter your GitHub username
3. Click "Sync Repositories Now"

### Automatic Sync

Enable these options in Sync Settings:
- "Auto-sync new repositories" - Syncs new GitHub repos automatically
- "Auto-post new content" - Posts to LinkedIn when you add projects/experience/content

## What Gets Synced

### GitHub Sync
- Repository names and descriptions
- Programming languages used
- Repository creation dates
- GitHub repository URLs
- Repository README content

### LinkedIn Auto-Posts
- **New Projects**: "Excited to share my latest project: [Project Name]"
- **New Experience**: "Thrilled to announce my new role as [Title] at [Company]"
- **New Content**: "Just published: [Content Title]"
- **New Skills**: Automatically added to LinkedIn profile

## Security Notes

1. Never commit your tokens to version control
2. Use environment variables for all secrets
3. Regularly rotate your access tokens
4. Limit webhook events to only what you need
5. Use HTTPS for all webhook URLs in production

## Troubleshooting

### Common Issues

1. **GitHub Sync Not Working**
   - Check if token has correct permissions
   - Verify token is not expired
   - Ensure username is correct

2. **LinkedIn Posts Failing**
   - Check access token validity
   - Verify required permissions are granted
   - Ensure content meets LinkedIn's guidelines

3. **Webhook Issues**
   - Verify webhook URL is accessible
   - Check if secret matches
   - Review webhook delivery logs in GitHub

### Error Messages

- "Invalid signature" - Webhook secret mismatch
- "Token expired" - Need to refresh access token
- "Insufficient permissions" - Missing required scopes

## Advanced Configuration

### Custom Webhook Processing

You can customize what happens when webhooks are received by modifying the `handleWebhook` method in `githubService.js`.

### Custom LinkedIn Post Templates

Modify the post generation methods in `linkedinService.js` to customize your LinkedIn post format.

### Rate Limiting

Both GitHub and LinkedIn have API rate limits. The sync service includes basic rate limiting, but you may want to add more sophisticated handling for high-volume usage.
