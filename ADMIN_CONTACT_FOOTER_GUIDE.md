# Admin Panel: Contact & Footer Management Guide

## Overview
The admin panel now provides comprehensive functionality for managing the contact section and footer of your website. All changes are saved to the database and immediately reflected on the frontend.

## Features

### 1. Hero Section Management
Edit the main contact section header:
- **Section Title**: Main heading (e.g., "Get In Touch")
- **Section Subtitle**: Descriptive text below the title

### 2. Contact Form Management
Customize the contact form appearance and messaging:
- **Form Title**: Heading for the contact form (e.g., "Send us a message")
- **Form Description**: Subtitle or description text
- **Response Time Message**: Set expectations for response time (e.g., "I typically respond within 48 hours.")

### 3. Social Links Management
Add, edit, and remove social media links:
- **Social Section Title**: Heading for the social links section (e.g., "Connect with me")
- **Add New Links**: 
  - Platform name (e.g., GitHub, LinkedIn, Email)
  - URL or contact information
  - Links are stored with unique IDs for easy management
- **Edit Existing Links**: Click edit mode to modify platform names or URLs
- **Remove Links**: Delete links you no longer want to display

### 4. Footer Management
Customize the footer text:
- **Footer Text**: Copyright and attribution text (e.g., "© 2026 Baweke Mekonnen. Built with Next.js & Tailwind.")

## How to Use

### Accessing the Admin Panel
1. Navigate to `/admin/contact` in your admin dashboard
2. You must be authenticated to access this page

### Editing Content
1. Click the **Edit** button in the "Contact Section" card
2. Modify any of the fields:
   - Hero section details
   - Contact form information
   - Social links (add, edit, or remove)
   - Footer text
3. Click **Save Changes** to persist your updates
4. A success message will confirm the save

### Managing Social Links
**To Add a New Link:**
1. In edit mode, scroll to the "Social Links" section
2. Enter the platform name (e.g., "GitHub")
3. Enter the URL (e.g., "https://github.com/username")
4. Click **Add Link**

**To Edit an Existing Link:**
1. In edit mode, find the link in the "Current Links" section
2. Modify the platform name or URL
3. Click **Save Changes**

**To Remove a Link:**
1. In edit mode, find the link in the "Current Links" section
2. Click the trash icon
3. Click **Save Changes**

## Data Structure

### Contact Model Fields
```javascript
{
  hero: {
    title: String,
    subtitle: String
  },
  form: {
    title: String,
    description: String,
    responseTime: String,
    placeholder: String
  },
  footer: {
    text: String
  },
  social: {
    title: String,
    links: [
      {
        platform: String,
        url: String,
        id: String
      }
    ]
  }
}
```

## API Endpoints

### Get Contact Settings
```
GET /api/contact
```
Returns the contact configuration (public endpoint)

### Update Contact Settings
```
PUT /api/contact
Authorization: Bearer {token}
```
Updates all contact and footer settings (authenticated)

### Get Messages
```
GET /api/contact/messages
Authorization: Bearer {token}
```
Retrieves all contact form submissions

### Submit Contact Form
```
POST /api/contact/messages
```
Public endpoint for form submissions

### Mark Message as Read
```
PATCH /api/contact/messages/:id/read
Authorization: Bearer {token}
```

### Delete Message
```
DELETE /api/contact/messages/:id
Authorization: Bearer {token}
```

## Frontend Integration

The Contact component automatically fetches and displays:
- Hero section title and subtitle
- Contact form with title and description
- Response time message
- Social links with proper icons and URLs
- Footer text with current year

All changes made in the admin panel are immediately reflected on the frontend without requiring a page reload.

## Message Management

The admin panel also includes an inbox for managing contact form submissions:
- View all messages with sender details
- Mark messages as read/unread
- Delete messages
- See unread message count at a glance

## Best Practices

1. **Keep it concise**: Use clear, brief text for better readability
2. **Update regularly**: Keep social links current and accurate
3. **Test changes**: After saving, visit the contact page to verify changes appear correctly
4. **Backup important text**: Consider keeping a backup of your footer and contact text
5. **Verify URLs**: Ensure social media URLs are correct before saving

## Troubleshooting

### Changes not appearing
- Refresh the page to see updates
- Check browser console for any errors
- Verify you're authenticated

### Social links not showing
- Ensure both platform name and URL are filled in
- Check that URLs are properly formatted
- Verify the links were saved successfully

### Form not submitting
- Check that all required fields are filled
- Verify the honeypot field (website) is empty
- Check browser console for errors
