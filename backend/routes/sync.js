const express = require('express');
const { authenticate } = require('../middleware/auth');
const GitHubService = require('../services/githubService');
const LinkedInService = require('../services/linkedinService');

const router = express.Router();

// GitHub webhook endpoint
router.post('/github/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const signature = req.headers['x-hub-signature-256'];
    const payload = req.body;

    // Verify webhook signature
    if (process.env.GITHUB_WEBHOOK_SECRET) {
      const crypto = require('crypto');
      const hmac = crypto.createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET);
      hmac.update(payload); // payload is raw Buffer from express.raw()
      const expectedSignature = `sha256=${hmac.digest('hex')}`;

      if (signature !== expectedSignature) {
        return res.status(401).json({ error: 'Invalid signature' });
      }
    }

    const githubService = new GitHubService();
    await githubService.handleWebhook(payload);

    res.status(200).json({ success: true });
  } catch (error) {
    console.error('GitHub webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Manual GitHub sync
router.post('/github/sync', authenticate, async (req, res) => {
  try {
    const { username } = req.body;
    
    if (!username) {
      return res.status(400).json({ error: 'GitHub username is required' });
    }

    const githubService = new GitHubService();
    const result = await githubService.syncRepositories(username, req.user.id);

    res.json({
      success: true,
      message: `Successfully synced ${result.synced} repositories`,
      ...result
    });
  } catch (error) {
    console.error('GitHub sync error:', error);
    res.status(500).json({ error: 'Failed to sync repositories' });
  }
});

// Manual LinkedIn post
router.post('/linkedin/post', authenticate, async (req, res) => {
  try {
    const { content, type, data } = req.body;
    
    const linkedinService = new LinkedInService();
    let result;

    switch (type) {
      case 'project':
        result = await linkedinService.postNewProject(data);
        break;
      case 'experience':
        result = await linkedinService.postNewExperience(data);
        break;
      case 'content':
        result = await linkedinService.postNewContent(data);
        break;
      default:
        result = await linkedinService.postContent(content);
    }

    res.json({
      success: true,
      message: 'Successfully posted to LinkedIn',
      data: result
    });
  } catch (error) {
    console.error('LinkedIn post error:', error);
    res.status(500).json({ error: 'Failed to post to LinkedIn' });
  }
});

// Auto-sync settings
router.post('/settings', authenticate, async (req, res) => {
  try {
    const { autoSyncGithub, autoPostLinkedin, githubUsername, linkedinEnabled } = req.body;
    
    // Update user's sync preferences (you'd need to add these fields to User model)
    const User = require('../models/User');
    await User.findByIdAndUpdate(req.user.id, {
      syncSettings: {
        autoSyncGithub,
        autoPostLinkedin,
        githubUsername,
        linkedinEnabled
      }
    });

    res.json({
      success: true,
      message: 'Sync settings updated successfully'
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

module.exports = router;
