# Modern Two-Way Chat System Guide

## Overview

The new chat system provides a modern, dynamic two-way communication platform for customers/employers and admins. It replaces the basic contact form with a real-time conversation interface.

## Features

### For Visitors/Customers
- **Chat Widget**: Floating chat button on the contact page
- **Conversation Initiation**: Easy form to start a new conversation
- **Real-time Messaging**: Send and receive messages instantly
- **Conversation History**: View all messages in a conversation
- **Categories**: Classify inquiries (inquiry, support, collaboration, feedback, other)
- **Contact Info**: Provide name, email, phone, and subject

### For Admins
- **Admin Dashboard**: Dedicated chat management page at `/admin/chat`
- **Conversation List**: View all conversations with search and filtering
- **Status Management**: Track conversation status (open, in-progress, resolved, closed)
- **Priority Levels**: Assign priority (low, medium, high, urgent)
- **Real-time Responses**: Send messages directly to customers
- **Statistics**: View total, open, in-progress, resolved, and unread conversations
- **Bulk Actions**: Mark as read, delete conversations
- **Assignment**: Assign conversations to team members

## Database Schema

### Conversation Model

```javascript
{
  visitorEmail: String,           // Customer email (unique per user)
  visitorName: String,            // Customer name
  visitorPhone: String,           // Optional phone number
  subject: String,                // Conversation subject
  status: String,                 // open, in-progress, resolved, closed
  priority: String,               // low, medium, high, urgent
  category: String,               // inquiry, support, collaboration, feedback, other
  adminAssignedTo: ObjectId,      // Admin user ID
  messages: [{
    sender: String,               // 'visitor' or 'admin'
    senderName: String,
    senderEmail: String,
    content: String,
    attachments: Array,
    readAt: Date,
    createdAt: Date
  }],
  lastMessageAt: Date,
  visitorLastReadAt: Date,
  adminLastReadAt: Date,
  createdBy: ObjectId,            // Portfolio owner ID
  timestamps: true
}
```

## API Endpoints

### Public Endpoints

#### Start a Conversation
```
POST /api/chat/start
Body: {
  visitorName: String,
  visitorEmail: String,
  visitorPhone: String (optional),
  subject: String,
  category: String (optional),
  createdBy: String (portfolio owner ID)
}
Response: { success: true, conversation: {...}, isNew: boolean }
```

#### Send a Message
```
POST /api/chat/:conversationId/message
Body: {
  content: String,
  sender: 'visitor' | 'admin',
  senderName: String,
  senderEmail: String
}
Response: { success: true, conversation: {...} }
```

#### Get Conversation Details
```
GET /api/chat/:conversationId
Response: { success: true, conversation: {...} }
```

### Authenticated Endpoints (Admin)

#### Get All Conversations
```
GET /api/chat/admin/conversations?status=open&priority=high&search=query&page=1&limit=20
Headers: { Authorization: Bearer <token> }
Response: { 
  success: true, 
  conversations: [...],
  pagination: { total, page, limit, pages }
}
```

#### Update Conversation Status
```
PATCH /api/chat/:conversationId/status
Headers: { Authorization: Bearer <token> }
Body: {
  status: String (optional),
  priority: String (optional),
  adminAssignedTo: String (optional)
}
Response: { success: true, conversation: {...} }
```

#### Mark as Read
```
PATCH /api/chat/:conversationId/read
Headers: { Authorization: Bearer <token> }
Response: { success: true, conversation: {...} }
```

#### Delete Conversation
```
DELETE /api/chat/:conversationId
Headers: { Authorization: Bearer <token> }
Response: { success: true, message: "Conversation deleted successfully" }
```

#### Get Chat Statistics
```
GET /api/chat/admin/stats
Headers: { Authorization: Bearer <token> }
Response: { 
  success: true, 
  stats: { total, open, inProgress, resolved, unread }
}
```

## Frontend Components

### ChatWidget Component
**Location**: `frontend/components/Chat/ChatWidget.js`

A floating chat button that opens a chat interface for visitors.

**Props**:
- `userId` (String): Portfolio owner ID

**Features**:
- Floating chat button (bottom-right)
- Initial greeting message
- Visitor info form
- Real-time message display
- Auto-scroll to latest messages

**Usage**:
```jsx
import ChatWidget from '@/components/Chat/ChatWidget'

export default function Page() {
  return (
    <>
      {/* Your content */}
      <ChatWidget userId={userId} />
    </>
  )
}
```

### Admin Chat Page
**Location**: `frontend/pages/admin/chat.js`

Full-featured admin dashboard for managing conversations.

**Features**:
- Conversation list with search and filtering
- Real-time message display
- Status and priority management
- Message statistics
- Responsive design

**Access**: `/admin/chat` (requires authentication)

## Integration Steps

### 1. Backend Setup
✅ Already done:
- Updated `Contact.js` model with Conversation schema
- Created `routes/chat.js` with all endpoints
- Added chat routes to `server.js`

### 2. Frontend Setup
✅ Already done:
- Created `ChatWidget.js` component
- Created admin chat page
- Integrated ChatWidget into Contact component

### 3. Usage

#### For Visitors
1. Navigate to `/contact` page
2. Click the floating chat button (bottom-right)
3. Fill in the conversation form
4. Start chatting

#### For Admins
1. Navigate to `/admin/chat`
2. View all conversations in the left panel
3. Click a conversation to view messages
4. Send responses
5. Update status and priority as needed

## Styling

The chat system uses:
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Icons** for UI elements
- **Gradient backgrounds** for modern look
- **Glass-morphism** effects for cards

### Color Scheme
- **Primary**: Blue/Purple gradient
- **Status Colors**:
  - Open: Blue
  - In-Progress: Yellow
  - Resolved: Green
  - Closed: Gray
- **Priority Colors**:
  - Low: Gray
  - Medium: Blue
  - High: Orange
  - Urgent: Red

## Security Features

1. **Authentication**: Admin endpoints require JWT token
2. **Authorization**: Only portfolio owner can access their conversations
3. **Input Validation**: All required fields are validated
4. **Rate Limiting**: API endpoints are rate-limited
5. **CORS Protection**: Cross-origin requests are controlled

## Performance Optimizations

1. **Pagination**: Conversations are paginated (20 per page)
2. **Indexing**: Database indexes on frequently queried fields
3. **Lazy Loading**: Messages load on demand
4. **Caching**: Stats are fetched separately for efficiency

## Future Enhancements

1. **WebSocket Support**: Real-time updates without polling
2. **File Attachments**: Support for file uploads in messages
3. **Typing Indicators**: Show when someone is typing
4. **Read Receipts**: Visual indicators for message read status
5. **Notifications**: Email/push notifications for new messages
6. **Message Search**: Full-text search across conversations
7. **Conversation Templates**: Pre-written responses
8. **Analytics**: Conversation metrics and insights
9. **Multi-language Support**: Translate conversations
10. **AI Assistant**: Auto-responses and suggestions

## Troubleshooting

### Chat Widget Not Appearing
- Check if `ChatWidget` is imported in Contact component
- Verify `userId` prop is being passed correctly
- Check browser console for errors

### Messages Not Sending
- Verify API endpoint is accessible
- Check network tab in browser dev tools
- Ensure conversation ID is valid
- Check backend logs for errors

### Admin Page Not Loading
- Verify authentication token is valid
- Check if user has admin privileges
- Verify `/admin/chat` route exists
- Check browser console for errors

### Database Connection Issues
- Verify MongoDB URI in `.env`
- Check if database is running
- Verify network connectivity
- Check MongoDB Atlas firewall settings

## API Response Examples

### Start Conversation Response
```json
{
  "success": true,
  "conversation": {
    "_id": "507f1f77bcf86cd799439011",
    "visitorEmail": "john@example.com",
    "visitorName": "John Doe",
    "subject": "Project Inquiry",
    "status": "open",
    "priority": "medium",
    "category": "inquiry",
    "messages": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "isNew": true
}
```

### Send Message Response
```json
{
  "success": true,
  "conversation": {
    "_id": "507f1f77bcf86cd799439011",
    "messages": [
      {
        "sender": "visitor",
        "senderName": "John Doe",
        "content": "Hi, I'm interested in your services",
        "createdAt": "2024-01-15T10:31:00Z"
      }
    ],
    "lastMessageAt": "2024-01-15T10:31:00Z"
  }
}
```

### Get Conversations Response
```json
{
  "success": true,
  "conversations": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "visitorName": "John Doe",
      "visitorEmail": "john@example.com",
      "subject": "Project Inquiry",
      "status": "open",
      "priority": "high",
      "messages": [
        {
          "sender": "visitor",
          "content": "Hi there!",
          "createdAt": "2024-01-15T10:30:00Z"
        }
      ],
      "lastMessageAt": "2024-01-15T10:30:00Z"
    }
  ],
  "pagination": {
    "total": 15,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review API documentation
3. Check browser console for errors
4. Review backend logs
5. Contact development team

---

**Last Updated**: January 2024
**Version**: 1.0.0
