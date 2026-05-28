const express = require('express');
const { Conversation } = require('../models/Contact');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// POST /api/chat/start - Start a new conversation (public)
router.post('/start', async (req, res) => {
  try {
    const { visitorName, visitorEmail, visitorPhone, subject, category, createdBy } = req.body;

    if (!visitorName || !visitorEmail || !subject || !createdBy) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Validate createdBy is a valid MongoDB ObjectId
    if (!createdBy.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID format'
      });
    }

    // Check if conversation already exists for this email
    let conversation = await Conversation.findOne({
      visitorEmail: visitorEmail.toLowerCase(),
      createdBy,
      status: { $ne: 'closed' }
    });

    if (conversation) {
      return res.json({
        success: true,
        conversation,
        isNew: false
      });
    }

    // Create new conversation
    conversation = new Conversation({
      visitorName,
      visitorEmail: visitorEmail.toLowerCase(),
      visitorPhone: visitorPhone || '',
      subject,
      category: category || 'inquiry',
      createdBy,
      status: 'open'
    });

    await conversation.save();

    res.status(201).json({
      success: true,
      conversation,
      isNew: true
    });
  } catch (error) {
    console.error('Error starting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to start conversation'
    });
  }
});

// POST /api/chat/:conversationId/message - Send a message (public for visitors, authenticated for admin)
router.post('/:conversationId/message', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { content, sender, senderName, senderEmail, visitorEmail } = req.body;

    if (!content || !sender) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Add message to conversation
    conversation.messages.push({
      sender,
      senderName: senderName || (sender === 'visitor' ? conversation.visitorName : 'Admin'),
      senderEmail: senderEmail || (sender === 'visitor' ? conversation.visitorEmail : ''),
      content,
      createdAt: new Date()
    });

    conversation.lastMessageAt = new Date();

    // Update read status
    if (sender === 'visitor') {
      conversation.visitorLastReadAt = new Date();
    } else {
      conversation.adminLastReadAt = new Date();
    }

    await conversation.save();

    res.json({
      success: true,
      message: 'Message sent successfully',
      conversation
    });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// GET /api/chat/:conversationId - Get conversation details
router.get('/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId)
      .populate('adminAssignedTo', 'name email');

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      conversation
    });
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversation'
    });
  }
});

// GET /api/chat/admin/conversations - Get all conversations for admin (authenticated)
router.get('/admin/conversations', authenticate, async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 20 } = req.query;
    const skip = (page - 1) * limit;

    let query = { createdBy: req.user.id };

    if (status) {
      query.status = status;
    }

    if (priority) {
      query.priority = priority;
    }

    if (search) {
      query.$or = [
        { visitorName: { $regex: search, $options: 'i' } },
        { visitorEmail: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const conversations = await Conversation.find(query)
      .sort({ lastMessageAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('adminAssignedTo', 'name email');

    const total = await Conversation.countDocuments(query);

    res.json({
      success: true,
      conversations,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch conversations'
    });
  }
});

// PATCH /api/chat/:conversationId/status - Update conversation status (authenticated)
router.patch('/:conversationId/status', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { status, priority, adminAssignedTo } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (status) conversation.status = status;
    if (priority) conversation.priority = priority;
    if (adminAssignedTo) conversation.adminAssignedTo = adminAssignedTo;

    await conversation.save();

    res.json({
      success: true,
      message: 'Conversation updated successfully',
      conversation
    });
  } catch (error) {
    console.error('Error updating conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update conversation'
    });
  }
});

// PATCH /api/chat/:conversationId/read - Mark conversation as read (authenticated)
router.patch('/:conversationId/read', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    conversation.adminLastReadAt = new Date();
    conversation.messages.forEach(msg => {
      if (msg.sender === 'visitor' && !msg.readAt) {
        msg.readAt = new Date();
      }
    });

    await conversation.save();

    res.json({
      success: true,
      message: 'Conversation marked as read',
      conversation
    });
  } catch (error) {
    console.error('Error marking conversation as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark conversation as read'
    });
  }
});

// DELETE /api/chat/:conversationId - Delete conversation (authenticated)
router.delete('/:conversationId', authenticate, async (req, res) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findByIdAndDelete(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting conversation:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete conversation'
    });
  }
});

// GET /api/chat/admin/stats - Get chat statistics (authenticated)
router.get('/admin/stats', authenticate, async (req, res) => {
  try {
    const total = await Conversation.countDocuments({ createdBy: req.user.id });
    const open = await Conversation.countDocuments({ createdBy: req.user.id, status: 'open' });
    const inProgress = await Conversation.countDocuments({ createdBy: req.user.id, status: 'in-progress' });
    const resolved = await Conversation.countDocuments({ createdBy: req.user.id, status: 'resolved' });
    const unread = await Conversation.countDocuments({
      createdBy: req.user.id,
      adminLastReadAt: { $lt: new Date(Date.now() - 1000) }
    });

    res.json({
      success: true,
      stats: {
        total,
        open,
        inProgress,
        resolved,
        unread
      }
    });
  } catch (error) {
    console.error('Error fetching chat stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch chat statistics'
    });
  }
});

module.exports = router;
