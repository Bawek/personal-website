import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiSave, HiTrash, HiPlus } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"
const LABEL_CLS = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2"

function ChatSettingsContent() {
  const [settings, setSettings] = useState({
    enabled: true,
    title: 'Chat with us',
    subtitle: 'We typically respond within 48 hours',
    placeholder: 'Type your message...',
    initialMessage: '👋 Hi! How can we help you today?',
    buttonText: 'Start a conversation',
    socialLinks: []
  })
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '' })
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/settings', { headers: headers() })
      if (data.settings?.features?.chat) {
        setSettings(data.settings.features.chat)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleAddSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      alert('Please fill in both platform and URL')
      return
    }
    setSettings(prev => ({
      ...prev,
      socialLinks: [...(prev.socialLinks || []), { ...newSocialLink, id: Date.now() }]
    }))
    setNewSocialLink({ platform: '', url: '' })
  }

  const handleRemoveSocialLink = (id) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).filter(link => link.id !== id)
    }))
  }

  const handleUpdateSocialLink = (id, field, value) => {
    setSettings(prev => ({
      ...prev,
      socialLinks: (prev.socialLinks || []).map(link =>
        link.id === id ? { ...link, [field]: value } : link
      )
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setStatus(null)

    try {
      const { data } = await api.put(
        '/settings/chat',
        settings,
        { headers: headers() }
      )
      setStatus('success')
      setTimeout(() => setStatus(null), 3000)
    } catch (error) {
      console.error('Error saving settings:', error)
      setStatus('error')
    } finally {
      setIsSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading settings...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Chat Settings</h1>
          <p className="text-gray-400">Configure the chat widget appearance and behavior</p>
        </div>

        {/* Settings Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-8 space-y-6"
        >
          <form onSubmit={handleSave} className="space-y-6">
            {/* Enable/Disable Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg border border-gray-700">
              <div>
                <label className={LABEL_CLS}>Enable Chat Widget</label>
                <p className="text-sm text-gray-400">Show the chat widget on your contact page</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="enabled"
                  checked={settings.enabled}
                  onChange={handleChange}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600"></div>
              </label>
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className={LABEL_CLS}>Chat Widget Title</label>
              <input
                id="title"
                type="text"
                name="title"
                value={settings.title}
                onChange={handleChange}
                placeholder="Chat with us"
                className={INPUT_CLS}
              />
              <p className="text-xs text-gray-500 mt-1">Displayed in the chat header</p>
            </div>

            {/* Subtitle */}
            <div>
              <label htmlFor="subtitle" className={LABEL_CLS}>Chat Widget Subtitle</label>
              <input
                id="subtitle"
                type="text"
                name="subtitle"
                value={settings.subtitle}
                onChange={handleChange}
                placeholder="We typically respond within 48 hours"
                className={INPUT_CLS}
              />
              <p className="text-xs text-gray-500 mt-1">Displayed below the title in the chat header</p>
            </div>

            {/* Initial Message */}
            <div>
              <label htmlFor="initialMessage" className={LABEL_CLS}>Initial Greeting Message</label>
              <textarea
                id="initialMessage"
                name="initialMessage"
                value={settings.initialMessage}
                onChange={handleChange}
                placeholder="👋 Hi! How can we help you today?"
                rows={3}
                className={`${INPUT_CLS} resize-none`}
              />
              <p className="text-xs text-gray-500 mt-1">First message shown when chat opens</p>
            </div>

            {/* Message Placeholder */}
            <div>
              <label htmlFor="placeholder" className={LABEL_CLS}>Message Input Placeholder</label>
              <input
                id="placeholder"
                type="text"
                name="placeholder"
                value={settings.placeholder}
                onChange={handleChange}
                placeholder="Type your message..."
                className={INPUT_CLS}
              />
              <p className="text-xs text-gray-500 mt-1">Placeholder text in the message input field</p>
            </div>

            {/* Button Text */}
            <div>
              <label htmlFor="buttonText" className={LABEL_CLS}>Start Chat Button Text</label>
              <input
                id="buttonText"
                type="text"
                name="buttonText"
                value={settings.buttonText}
                onChange={handleChange}
                placeholder="Start a conversation"
                className={INPUT_CLS}
              />
              <p className="text-xs text-gray-500 mt-1">Text on the button to start a conversation</p>
            </div>

            {/* Social Links Section */}
            <div className="border-t border-gray-700 pt-6">
              <h3 className="text-lg font-semibold text-white mb-4">Social Links</h3>
              
              {/* Current Links */}
              {settings.socialLinks && settings.socialLinks.length > 0 && (
                <div className="mb-6 space-y-3">
                  <p className="text-sm text-gray-400">Current Links ({settings.socialLinks.length})</p>
                  {settings.socialLinks.map((link) => (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3 items-end bg-gray-800/50 p-4 rounded-lg border border-gray-700"
                    >
                      <div className="flex-1">
                        <label className={LABEL_CLS}>Platform</label>
                        <input
                          type="text"
                          value={link.platform}
                          onChange={(e) => handleUpdateSocialLink(link.id, 'platform', e.target.value)}
                          placeholder="e.g., GitHub, LinkedIn, Twitter"
                          className={INPUT_CLS}
                        />
                      </div>
                      <div className="flex-1">
                        <label className={LABEL_CLS}>URL</label>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleUpdateSocialLink(link.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className={INPUT_CLS}
                        />
                      </div>
                      <motion.button
                        type="button"
                        onClick={() => handleRemoveSocialLink(link.id)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition"
                      >
                        <HiTrash size={18} />
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Add New Social Link */}
              <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700 space-y-3">
                <p className="text-sm text-gray-400 font-semibold">Add New Social Link</p>
                <div className="flex gap-3 items-end">
                  <div className="flex-1">
                    <label className={LABEL_CLS}>Platform</label>
                    <input
                      type="text"
                      value={newSocialLink.platform}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                      placeholder="e.g., GitHub, LinkedIn, Twitter"
                      className={INPUT_CLS}
                    />
                  </div>
                  <div className="flex-1">
                    <label className={LABEL_CLS}>URL</label>
                    <input
                      type="url"
                      value={newSocialLink.url}
                      onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                      placeholder="https://..."
                      className={INPUT_CLS}
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={handleAddSocialLink}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-400 rounded-lg transition flex items-center gap-2 font-medium"
                  >
                    <HiPlus size={18} />
                    Add
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-4 py-3"
              >
                <HiCheckCircle size={16} />
                Chat settings saved successfully!
              </motion.div>
            )}
            {status === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-3"
              >
                <HiXCircle size={16} />
                Failed to save settings. Please try again.
              </motion.div>
            )}

            {/* Save Button */}
            <div className="flex gap-3 pt-4">
              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold rounded-lg hover:from-violet-400 hover:to-pink-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <HiSave size={18} />
                {isSaving ? 'Saving...' : 'Save Settings'}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Preview Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gray-900 rounded-lg border border-gray-800 p-8"
        >
          <h2 className="text-xl font-bold text-white mb-6">Preview</h2>
          
          {/* Chat Widget Preview */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-2xl max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-bold text-lg">{settings.title}</h3>
                <p className="text-sm text-blue-100">{settings.subtitle}</p>
              </div>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-900 text-sm">
              {settings.initialMessage}
            </div>

            <button className="w-full bg-white text-blue-600 py-2 rounded-lg font-medium hover:bg-gray-100 transition">
              {settings.buttonText}
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">This is how your chat widget will appear to visitors</p>
        </motion.div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-6"
        >
          <h3 className="text-blue-400 font-semibold mb-2">💡 Chat Widget Info</h3>
          <ul className="text-sm text-gray-300 space-y-2">
            <li>• The chat widget appears as a floating button on your contact page</li>
            <li>• Visitors can start conversations and send messages in real-time</li>
            <li>• You can respond to conversations from the admin dashboard at /admin/chat</li>
            <li>• Disable the widget to hide it from your contact page</li>
            <li>• All conversations are stored in your database</li>
          </ul>
        </motion.div>
      </div>
    </AdminLayout>
  )
}

export default function ChatSettingsPage() {
  return (
    <AuthProtection>
      <ChatSettingsContent />
    </AuthProtection>
  )
}
