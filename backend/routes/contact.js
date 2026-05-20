const express = require('express');
const { Contact, Message } = require('../models/Contact');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// GET /api/contact - Get contact settings (public, returns first available)
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne().sort({ createdAt: 1 });
    
    res.json({
      success: true,
      contact: contact || null
    });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch contact data'
    });
  }
});

// PUT /api/contact - Update contact settings
router.put('/', authenticate, async (req, res) => {
  try {
    let contact = await Contact.findOne({ createdBy: req.user.id });
    
    if (!contact) {
      // Create if doesn't exist
      contact = new Contact({
        ...req.body,
        createdBy: req.user.id
      });
    } else {
      // Update existing
      Object.assign(contact, req.body);
    }
    
    await contact.save();
    
    res.json({
      success: true,
      message: 'Contact settings updated successfully',
      contact: contact
    });
  } catch (error) {
    console.error('Error updating contact data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update contact data'
    });
  }
});

// GET /api/contact/messages - Get all messages for the authenticated user
router.get('/messages', authenticate, async (req, res) => {
  try {
    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(50); // Limit to last 50 messages
    
    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch messages'
    });
  }
});

// POST /api/contact/messages - Create a new message (public endpoint)
router.post('/messages', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      });
    }
    
    const newMessage = new Message({
      name,
      email,
      message
    });
    
    await newMessage.save();
    
    res.status(201).json({
      success: true,
      message: 'Message sent successfully'
    });
  } catch (error) {
    console.error('Error creating message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message'
    });
  }
});

// PATCH /api/contact/messages/:id/read - Mark message as read
router.patch('/messages/:id/read', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    message.read = true;
    await message.save();
    
    res.json({
      success: true,
      message: 'Message marked as read'
    });
  } catch (error) {
    console.error('Error marking message as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update message'
    });
  }
});

// DELETE /api/contact/messages/:id - Delete a message
router.delete('/messages/:id', authenticate, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({
        success: false,
        message: 'Message not found'
      });
    }
    
    await Message.deleteOne({ _id: req.params.id });
    
    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete message'
    });
  }
});

module.exports = router;
