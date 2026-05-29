# Chat Dialog & Public Folder Fix

## Issues Fixed

### 1. ✅ Chat Widget Now Shows as Dialog (Not Fullscreen)
**Problem:** Chat was opening in fullscreen mode, taking over the entire page.

**Solution:** 
- Changed chat window from fullscreen to a fixed bottom-right dialog (400x600px)
- Positioned at `bottom-24 right-6` to appear above the chat button
- Reduced backdrop opacity from 60% to 20% for less intrusive appearance
- Removed backdrop click-to-close to prevent accidental dismissal

**Changes in:** `frontend/components/Chat/ChatWidget.js`
```javascript
// Before: Full screen dialog
className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl..."

// After: Bottom-right dialog
className="fixed bottom-24 right-6 w-[400px] h-[600px] bg-white rounded-2xl..."
```

### 2. ✅ Chat History Now Persists
**Problem:** When user reopened chat, previous conversation was lost or redirected to full page.

**Solution:**
- Modified localStorage loading to restore conversation in the dialog instead of redirecting
- Added automatic message loading from saved conversation ID
- Chat now stays in dialog format with full history preserved
- Added new 'chat' form step to display messages

**Changes in:** `frontend/components/Chat/ChatWidget.js`
```javascript
// Load saved conversation and messages
useEffect(() => {
  const savedConversationId = localStorage.getItem('chatConversationId')
  const savedVisitorInfo = localStorage.getItem('chatVisitorInfo')
  
  if (savedConversationId && savedVisitorInfo) {
    setConversation({ _id: savedConversationId })
    setVisitorInfo(JSON.parse(savedVisitorInfo))
    setFormStep('chat')
    
    // Load messages from API
    const loadMessages = async () => {
      const { data } = await api.get(`/chat/${savedConversationId}`)
      setMessages(data.messages || [])
    }
    loadMessages()
  }
}, [])
```

### 3. ✅ Public Folder Now Tracked in Git
**Problem:** `frontend/public` folder was being ignored by git due to root `.gitignore`.

**Solution:**
- Commented out `public` line in root `.gitignore` (line 165)
- Added comment explaining it's for Gatsby, not Next.js
- Ran `git add frontend/public` to track the folder

**Changes in:** `.gitignore`
```gitignore
# Before:
public

# After:
# public - commented out to allow frontend/public folder to be tracked
```

**Files now tracked:**
- `frontend/public/favicon.ico`
- `frontend/public/robots.txt`
- `frontend/public/image/` (all images)

## UI Improvements

### Compact Dialog Design
- Reduced padding and spacing for better fit in 400px width
- Smaller text sizes (text-sm, text-xs)
- Compact form fields with reduced padding
- Optimized message bubbles to use 80% max-width

### Chat Flow
1. **Initial:** Welcome message + "Start a conversation" button
2. **Form:** Collect visitor info (name, email, phone, subject, category)
3. **Chat:** Message history + input field with send button

## Testing Checklist

- [ ] Click chat button - dialog appears bottom-right (not fullscreen)
- [ ] Fill form and start chat - conversation begins in dialog
- [ ] Send messages - they appear in chat history
- [ ] Close dialog and reopen - previous conversation loads
- [ ] Refresh page and open chat - conversation persists
- [ ] Check git status - public folder files are tracked

## Technical Details

**localStorage Keys:**
- `chatConversationId` - Stores conversation ID
- `chatVisitorInfo` - Stores visitor details (name, email, etc.)

**API Endpoints Used:**
- `POST /chat/start` - Start new conversation
- `GET /chat/:id` - Load conversation messages
- `POST /chat/:id/message` - Send new message

**Form Steps:**
- `initial` - Welcome screen
- `form` - Visitor information form
- `chat` - Active conversation view

## Notes

- Dialog stays open when clicking backdrop (user must click X to close)
- Messages auto-scroll to bottom when new message arrives
- Loading states prevent duplicate submissions
- All visitor info persists across page refreshes
