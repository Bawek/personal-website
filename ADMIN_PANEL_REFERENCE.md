# Admin Panel - Visual Reference & Quick Guide

## Admin Contact Page Layout

```
┌─────────────────────────────────────────────────────────────┐
│ MANAGE                                                      │
│ Contact & Messages                                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ CONTACT SECTION                                    [EDIT]   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ VIEW MODE (Default):                                        │
│ ├─ Hero Section                                             │
│ │  ├─ Title: "Get In Touch"                                 │
│ │  └─ Subtitle: "Have a project in mind..."                │
│ ├─ Contact Form                                             │
│ │  ├─ Title: "Send us a message"                            │
│ │  ├─ Description: "We'd love to hear from you..."          │
│ │  └─ Response Time: "I typically respond within 48 hours." │
│ ├─ Social Links                                             │
│ │  ├─ Section Title: "Connect with me"                      │
│ │  └─ Links (3): GitHub, LinkedIn, Email                    │
│ └─ Footer                                                   │
│    └─ Text: "© 2026 Baweke Mekonnen. Built with..."        │
│                                                             │
│ EDIT MODE (After clicking Edit):                            │
│ ├─ Hero Section                                             │
│ │  ├─ [Input] Section Title                                 │
│ │  └─ [Textarea] Section Subtitle                           │
│ ├─ Contact Form                                             │
│ │  ├─ [Input] Form Title                                    │
│ │  ├─ [Textarea] Form Description                           │
│ │  └─ [Input] Response Time Message                         │
│ ├─ Social Links                                             │
│ │  ├─ [Input] Social Section Title                          │
│ │  ├─ Current Links                                         │
│ │  │  ├─ [Input] Platform                                   │
│ │  │  ├─ [Input] URL                                        │
│ │  │  └─ [Delete Button]                                    │
│ │  └─ Add New Link                                          │
│ │     ├─ [Input] Platform                                   │
│ │     ├─ [Input] URL                                        │
│ │     └─ [Add Link Button]                                  │
│ ├─ Footer                                                   │
│ │  └─ [Input] Footer Text                                   │
│ ├─ [Success/Error Message]                                  │
│ └─ [Save Changes] [Cancel]                                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│ INBOX                                          [3 new]      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ Message 1 (Unread)                                          │
│ ├─ John Doe | john@example.com | [New Badge]               │
│ ├─ "I have a project inquiry..."                            │
│ ├─ 2026-05-26 10:30 AM                                      │
│ └─ [Mark Read] [Delete]                                     │
│                                                             │
│ Message 2 (Read)                                            │
│ ├─ Jane Smith | jane@example.com                            │
│ ├─ "Interested in collaboration..."                         │
│ ├─ 2026-05-25 03:15 PM                                      │
│ └─ [Delete]                                                 │
│                                                             │
│ Message 3 (Unread)                                          │
│ ├─ Bob Wilson | bob@example.com | [New Badge]              │
│ ├─ "Great work on your portfolio!"                          │
│ ├─ 2026-05-24 09:45 AM                                      │
│ └─ [Mark Read] [Delete]                                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Field Reference

### Hero Section
| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| Title | Text | "Get In Touch" | Main heading of contact section |
| Subtitle | Text | "Have a project in mind..." | Descriptive text below title |

### Contact Form
| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| Title | Text | "Send us a message" | Form heading |
| Description | Text | "We'd love to hear from you..." | Form description |
| Response Time | Text | "I typically respond within 48 hours." | Set expectations |
| Placeholder | Text | "Tell me about your project…" | Form message placeholder |

### Social Links
| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| Section Title | Text | "Connect with me" | Social links heading |
| Platform | Text | "GitHub" | Social platform name |
| URL | Text | "https://github.com/username" | Link to profile |
| ID | Auto | "github-1234567890" | Unique identifier |

### Footer
| Field | Type | Example | Purpose |
|-------|------|---------|---------|
| Text | Text | "© 2026 Baweke Mekonnen..." | Footer copyright text |

## Workflow Diagrams

### Adding a Social Link
```
1. Click [Edit]
   ↓
2. Scroll to "Social Links" section
   ↓
3. Enter Platform name (e.g., "GitHub")
   ↓
4. Enter URL (e.g., "https://github.com/username")
   ↓
5. Click [Add Link]
   ↓
6. Link appears in "Current Links" section
   ↓
7. Click [Save Changes]
   ↓
8. Link appears on contact page
```

### Editing a Social Link
```
1. Click [Edit]
   ↓
2. Scroll to "Social Links" → "Current Links"
   ↓
3. Find the link to edit
   ↓
4. Modify Platform or URL field
   ↓
5. Click [Save Changes]
   ↓
6. Updated link appears on contact page
```

### Removing a Social Link
```
1. Click [Edit]
   ↓
2. Scroll to "Social Links" → "Current Links"
   ↓
3. Find the link to remove
   ↓
4. Click [Trash Icon]
   ↓
5. Link disappears from list
   ↓
6. Click [Save Changes]
   ↓
7. Link removed from contact page
```

### Managing Messages
```
View Messages:
1. Scroll to "Inbox" section
2. See all contact form submissions
3. Unread messages show [New] badge

Mark as Read:
1. Hover over message
2. Click [Checkmark Icon]
3. [New] badge disappears

Delete Message:
1. Hover over message
2. Click [Trash Icon]
3. Confirm deletion
4. Message removed from inbox
```

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Refresh page | F5 or Ctrl+R |
| Open developer console | F12 |
| Clear browser cache | Ctrl+Shift+Delete |
| Focus next field | Tab |
| Focus previous field | Shift+Tab |

## Status Messages

### Success Messages
```
✓ Saved
  "Contact settings updated successfully"
```

### Error Messages
```
✗ Failed to save
  "Failed to update contact data"
```

### Validation Messages
- Platform and URL required for social links
- At least one field must be filled to save
- Email format validation for contact form

## Color Coding

| Color | Meaning |
|-------|---------|
| Violet/Purple | Primary action (Edit, Save) |
| Green | Success (Saved, Mark as read) |
| Red | Danger (Delete, Error) |
| Gray | Secondary (Cancel, Disabled) |
| Blue | Info (New message badge) |

## Icons Used

| Icon | Meaning | Action |
|------|---------|--------|
| ✏️ Pencil | Edit | Click to enter edit mode |
| 💾 Save | Save | Click to save changes |
| ✓ Checkmark | Mark as read | Click to mark message as read |
| 🗑️ Trash | Delete | Click to delete item |
| ✓ Check Circle | Success | Indicates successful save |
| ✗ X Circle | Error | Indicates error |
| ✉️ Mail | Message | Indicates contact message |
| + Plus | Add | Click to add new item |

## Common Tasks

### Task: Update Footer Text
```
1. Go to /admin/contact
2. Click [Edit]
3. Scroll to "Footer" section
4. Update the text field
5. Click [Save Changes]
6. Verify on contact page
```

### Task: Add New Social Link
```
1. Go to /admin/contact
2. Click [Edit]
3. Scroll to "Social Links"
4. Fill in "Add New Link" section
5. Click [Add Link]
6. Click [Save Changes]
7. Verify on contact page
```

### Task: Change Response Time
```
1. Go to /admin/contact
2. Click [Edit]
3. Find "Response Time Message" field
4. Update the message
5. Click [Save Changes]
6. Verify on contact page
```

### Task: View Contact Messages
```
1. Go to /admin/contact
2. Scroll to "Inbox" section
3. View all messages
4. Click [Mark Read] or [Delete] as needed
```

## Troubleshooting Quick Reference

| Problem | Solution |
|---------|----------|
| Changes not showing | Refresh page (F5) |
| Can't edit | Click [Edit] button first |
| Social link won't save | Check both fields are filled |
| Message not loading | Refresh page, check connection |
| Can't access admin | Verify you're logged in |
| Form won't submit | Fill all required fields |

## Best Practices Checklist

- [ ] Keep text concise and clear
- [ ] Use proper URL format (include http:// or https://)
- [ ] Test changes on contact page
- [ ] Update social links regularly
- [ ] Respond to messages promptly
- [ ] Keep footer text current
- [ ] Backup important text
- [ ] Check messages daily

## Performance Tips

1. **Save frequently** - Don't make too many changes before saving
2. **Clear cache** - If changes don't appear, clear browser cache
3. **Use modern browser** - Chrome, Firefox, Safari, Edge recommended
4. **Check connection** - Ensure stable internet connection
5. **Avoid duplicates** - Don't add same social link twice

---

**Last Updated:** May 26, 2026
**Version:** 1.0
