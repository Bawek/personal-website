# Social Links Feature for Chat Settings

## Overview
Added social links management to the chat settings page. Admins can now add, edit, and remove social media links that appear in the chat widget.

## Features

### Admin Chat Settings Page (`/admin/chat-settings`)

#### Social Links Section
- **View Current Links**: Shows all added social links with count
- **Add New Link**: Form to add new social media links
- **Edit Links**: Inline editing of platform name and URL
- **Remove Links**: Delete button for each link
- **Validation**: Ensures both platform and URL are filled

### Chat Widget Display

#### Initial Message Screen
When visitors open the chat widget, they see:
1. Initial greeting message
2. "Start a conversation" button
3. **Social Links** (if configured)
   - Displayed as clickable badges
   - Shows platform name
   - Links open in new tab
   - Styled with blue theme

## Database Schema

### Settings Collection - Chat Social Links
```json
{
  "features": {
    "chat": {
      "enabled": true,
      "title": "Chat with us",
      "subtitle": "We typically respond within 48 hours",
      "placeholder": "Type your message...",
      "initialMessage": "👋 Hi! How can we help you today?",
      "buttonText": "Start a conversation",
      "socialLinks": [
        {
          "platform": "GitHub",
          "url": "https://github.com/username",
          "id": 1234567890
        },
        {
          "platform": "LinkedIn",
          "url": "https://linkedin.com/in/username",
          "id": 1234567891
        }
      ]
    }
  }
}
```

## API Endpoints

### Update Chat Settings (includes social links)
```
PUT /api/settings/chat
Headers: { Authorization: Bearer <token> }
Body: {
  enabled: Boolean,
  title: String,
  subtitle: String,
  placeholder: String,
  initialMessage: String,
  buttonText: String,
  socialLinks: [
    {
      platform: String,
      url: String,
      id: Number
    }
  ]
}
Response: { message: "...", chat: {...} }
```

## How to Use

### For Admins

#### Add Social Link
1. Go to `/admin/chat-settings`
2. Scroll to "Social Links" section
3. In "Add New Social Link" form:
   - Enter platform name (e.g., "GitHub", "LinkedIn", "Twitter")
   - Enter full URL (e.g., "https://github.com/username")
4. Click "Add" button
5. Link appears in "Current Links" section
6. Click "Save Settings" to persist

#### Edit Social Link
1. Go to `/admin/chat-settings`
2. Find the link in "Current Links" section
3. Click on the platform or URL field
4. Edit the text
5. Click "Save Settings" to persist

#### Remove Social Link
1. Go to `/admin/chat-settings`
2. Find the link in "Current Links" section
3. Click the trash icon
4. Link is removed from the list
5. Click "Save Settings" to persist

### For Visitors

#### View Social Links
1. Go to `/contact` page
2. Click the floating chat button
3. See the initial greeting message
4. See social links as clickable badges below the button
5. Click any link to visit that social profile

## UI Components

### Chat Settings Page - Social Links Section

```
┌─────────────────────────────────────────┐
│ Social Links                            │
├─────────────────────────────────────────┤
│                                         │
│ Current Links (2)                       │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Platform: [GitHub        ]  [🗑]    │ │
│ │ URL: [https://github.com/...] [🗑] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Platform: [LinkedIn      ]  [🗑]    │ │
│ │ URL: [https://linkedin.com/...] [🗑]│ │
│ └─────────────────────────────────────┘ │
│                                         │
│ Add New Social Link                     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Platform: [____________]            │ │
│ │ URL: [____________]  [+ Add]        │ │
│ └─────────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Chat Widget - Initial Screen

```
┌──────────────────────────────────┐
│ Chat with us                  [X] │
│ We typically respond within...    │
├──────────────────────────────────┤
│                                  │
│ 👋 Hi! How can we help you today?│
│                                  │
│ [Start a conversation]           │
│                                  │
│ Connect with us                  │
│ [GitHub] [LinkedIn] [Twitter]    │
│                                  │
└──────────────────────────────────┘
```

## File Changes

### Backend
- `backend/models/Settings.js` - Added socialLinks array to chat feature
- `backend/routes/settings.js` - Updated validation for socialLinks

### Frontend
- `frontend/pages/admin/chat-settings.js` - Added social links management UI
- `frontend/components/Chat/ChatWidget.js` - Display social links in initial screen

## Example Social Links

### GitHub
- Platform: `GitHub`
- URL: `https://github.com/username`

### LinkedIn
- Platform: `LinkedIn`
- URL: `https://linkedin.com/in/username`

### Twitter
- Platform: `Twitter`
- URL: `https://twitter.com/username`

### Email
- Platform: `Email`
- URL: `mailto:email@example.com`

### Website
- Platform: `Website`
- URL: `https://yourwebsite.com`

## Styling

### Social Links in Chat Widget
- **Container**: White background with gray border
- **Label**: Small gray text "Connect with us"
- **Links**: Blue badges with hover effect
- **Behavior**: Opens in new tab

### Social Links in Settings
- **Current Links**: Dark background with gray border
- **Add Form**: Dark background with violet accent
- **Buttons**: Trash icon for delete, Plus icon for add
- **Animations**: Smooth fade-in for new links

## Validation

### Platform Field
- Required when adding new link
- Accepts any text (e.g., "GitHub", "LinkedIn", "My Website")
- No length limit

### URL Field
- Required when adding new link
- Should be valid URL format
- Supports both http and https
- Supports mailto: for email links

## Features

✅ Add multiple social links
✅ Edit existing links inline
✅ Delete links with confirmation
✅ Display links in chat widget
✅ Open links in new tab
✅ Responsive design
✅ Smooth animations
✅ Validation on save

## Testing

### Test Adding Social Link
1. Go to `/admin/chat-settings`
2. Scroll to "Add New Social Link"
3. Enter: Platform = "GitHub", URL = "https://github.com/username"
4. Click "Add"
5. Verify link appears in "Current Links"
6. Click "Save Settings"
7. Verify success message

### Test Editing Social Link
1. Go to `/admin/chat-settings`
2. Click on a link's platform field
3. Change the text
4. Click "Save Settings"
5. Verify change is saved

### Test Removing Social Link
1. Go to `/admin/chat-settings`
2. Click trash icon on a link
3. Verify link is removed from list
4. Click "Save Settings"
5. Verify removal is saved

### Test Chat Widget Display
1. Go to `/contact` page
2. Click chat button
3. Verify social links appear below button
4. Click a link
5. Verify it opens in new tab

## Troubleshooting

### Social Links Not Saving
- Check if both platform and URL are filled
- Verify you're logged in as admin
- Check browser console for errors
- Verify backend is running

### Social Links Not Displaying
- Check if links are saved in settings
- Verify chat is enabled
- Check browser console for errors
- Verify ChatWidget is receiving settings

### Links Not Opening
- Verify URL format is correct
- Check if URL starts with http:// or https://
- For email, use mailto: prefix
- Check browser popup blocker

## Future Enhancements

- Add icon selection for each platform
- Add custom styling for links
- Add link analytics
- Add link ordering/sorting
- Add link preview
- Add social media icons
- Add link categories

---

**Feature Added**: January 2024
**Status**: Complete and Ready for Testing
**Version**: 1.0.0
