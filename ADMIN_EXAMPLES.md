# Admin Panel Examples - Contact & Footer Management

## Example 1: Setting Up Your Contact Section

### Initial Setup
When you first access `/admin/contact`, you'll see the contact section editor. Here's how to set it up:

**Hero Section:**
- Title: "Get In Touch"
- Subtitle: "Have a project in mind or just want to say hi? My inbox is always open."

**Contact Form:**
- Title: "Send us a message"
- Description: "We'd love to hear from you. Fill out the form below and I'll get back to you as soon as possible."
- Response Time: "I typically respond within 48 hours."

**Social Links:**
- Section Title: "Connect with me"
- Add links for: GitHub, LinkedIn, Email

**Footer:**
- Text: "© 2026 Baweke Mekonnen. Built with Next.js & Tailwind."

## Example 2: Adding Social Media Links

### Step-by-Step

1. Click **Edit** button
2. Scroll to "Social Links" section
3. In the "Add New Link" area, enter:
   - Platform: `GitHub`
   - URL: `https://github.com/BawekWebsite`
4. Click **Add Link**
5. Repeat for other platforms:
   - LinkedIn: `https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/`
   - Email: `mailto:bawekeasres@gmail.com`
6. Click **Save Changes**

### Result
Your social links will appear on the contact page with proper icons and clickable URLs.

## Example 3: Updating Response Time

### Scenario
You're going on vacation and want to let visitors know you'll respond slower.

1. Click **Edit**
2. Find "Response Time Message" field
3. Change from: `"I typically respond within 48 hours."`
4. Change to: `"I'm currently on vacation and will respond within 5-7 business days."`
5. Click **Save Changes**

### Result
Visitors will see the updated message on the contact page.

## Example 4: Editing an Existing Social Link

### Scenario
You changed your GitHub username.

1. Click **Edit**
2. Scroll to "Social Links" → "Current Links"
3. Find the GitHub link
4. Update the URL field to your new GitHub profile
5. Click **Save Changes**

### Result
The contact page will display your updated GitHub link.

## Example 5: Removing a Social Link

### Scenario
You no longer want to display your Twitter link.

1. Click **Edit**
2. Scroll to "Social Links" → "Current Links"
3. Find the Twitter link
4. Click the trash icon next to it
5. Click **Save Changes**

### Result
The Twitter link is removed from the contact page.

## Example 6: Customizing Footer Text

### Scenario
You want to add additional information to the footer.

1. Click **Edit**
2. Scroll to "Footer" section
3. Update the text to:
   ```
   © 2026 Baweke Mekonnen. Built with Next.js & Tailwind. 
   Hosted on Vercel. All rights reserved.
   ```
4. Click **Save Changes**

### Result
The footer on the contact page displays your updated text.

## Example 7: Managing Contact Form Messages

### Viewing Messages
1. On the `/admin/contact` page, scroll down to "Inbox"
2. You'll see all contact form submissions with:
   - Sender's name and email
   - Message content
   - Submission date/time
   - "New" badge for unread messages

### Marking as Read
1. Hover over a message
2. Click the checkmark icon to mark as read
3. The "New" badge disappears

### Deleting Messages
1. Hover over a message
2. Click the trash icon to delete
3. Confirm the deletion

### Unread Count
- The inbox header shows the number of unread messages
- Example: "Inbox 3 new" means 3 unread messages

## Example 8: Complete Contact Section Update

### Scenario
You're rebranding and want to update all contact information.

**Before:**
```
Hero Title: "Get In Touch"
Hero Subtitle: "Have a project in mind..."
Form Title: "Send us a message"
Form Description: "We'd love to hear from you..."
Response Time: "I typically respond within 48 hours."
Footer: "© 2026 Baweke Mekonnen. Built with Next.js & Tailwind."
Social Links: GitHub, LinkedIn, Email
```

**After:**
```
Hero Title: "Let's Connect"
Hero Subtitle: "Ready to collaborate? I'd love to hear about your project!"
Form Title: "Get in touch"
Form Description: "Send me a message and I'll respond as soon as I can."
Response Time: "Response time: 24-48 hours"
Footer: "© 2026 Baweke Mekonnen. All rights reserved."
Social Links: GitHub, LinkedIn, Email, Twitter
```

**Steps:**
1. Click **Edit**
2. Update each field as shown above
3. Add Twitter link in the "Add New Link" section
4. Click **Save Changes**

**Result:**
Your entire contact section is updated with the new branding.

## Common Issues & Solutions

### Issue: Changes not appearing on the contact page
**Solution:**
1. Refresh the contact page (Ctrl+R or Cmd+R)
2. Clear browser cache if still not showing
3. Check browser console for errors (F12)

### Issue: Social link not saving
**Solution:**
1. Ensure both Platform and URL fields are filled
2. Check that URL is properly formatted (include http:// or https://)
3. Try saving again

### Issue: Can't access admin panel
**Solution:**
1. Ensure you're logged in
2. Check that your authentication token is valid
3. Try logging out and logging back in

### Issue: Message inbox not loading
**Solution:**
1. Refresh the page
2. Check your internet connection
3. Verify you have permission to view messages

## Tips & Best Practices

1. **Keep it concise**: Use clear, brief text for better readability
2. **Test changes**: After saving, visit the contact page to verify
3. **Update regularly**: Keep social links current
4. **Use proper URLs**: Always include http:// or https:// for external links
5. **Backup important text**: Keep a copy of your footer and contact text
6. **Check messages regularly**: Respond to contact form submissions promptly
7. **Use descriptive platform names**: Use exact names like "GitHub", "LinkedIn", "Email"

## API Reference (For Developers)

### Get Contact Settings
```bash
curl https://your-domain.com/api/contact
```

### Update Contact Settings
```bash
curl -X PUT https://your-domain.com/api/contact \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "hero": { "title": "...", "subtitle": "..." },
    "form": { "title": "...", "description": "...", "responseTime": "..." },
    "footer": { "text": "..." },
    "social": { "title": "...", "links": [...] }
  }'
```

### Get Messages
```bash
curl https://your-domain.com/api/contact/messages \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Submit Contact Form
```bash
curl -X POST https://your-domain.com/api/contact/messages \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Project Inquiry",
    "message": "I have a project..."
  }'
```
