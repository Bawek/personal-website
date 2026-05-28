import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiX, HiPaperAirplane, HiChat } from 'react-icons/hi'
import api from '@/lib/api'

export default function ChatWidget({ userId, chatSettings }) {
  const [isOpen, setIsOpen] = useState(false)
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [formStep, setFormStep] = useState('initial') // initial, form, chat
  const [visitorInfo, setVisitorInfo] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    category: 'inquiry'
  })
  const messagesEndRef = useRef(null)

  // Use provided settings or defaults
  const settings = chatSettings || {
    title: 'Chat with us',
    subtitle: 'We typically respond within 48 hours',
    placeholder: 'Type your message...',
    initialMessage: '👋 Hi! How can we help you today?',
    buttonText: 'Start a conversation',
    socialLinks: []
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleStartChat = async (e) => {
    e.preventDefault()
    if (!visitorInfo.name || !visitorInfo.email || !visitorInfo.subject) {
      alert('Please fill in all required fields')
      return
    }

    if (!userId) {
      alert('User ID not found. Please refresh the page.')
      return
    }

    setLoading(true)
    try {
      const payload = {
        visitorName: visitorInfo.name,
        visitorEmail: visitorInfo.email,
        visitorPhone: visitorInfo.phone,
        subject: visitorInfo.subject,
        category: visitorInfo.category,
        createdBy: userId
      }

      console.log('Starting chat with payload:', payload)

      const { data } = await api.post('/chat/start', payload)

      setConversation(data.conversation)
      setMessages(data.conversation.messages || [])
      setFormStep('chat')
    } catch (error) {
      console.error('Error starting chat:', error)
      console.error('Error response:', error.response?.data)
      alert('Failed to start chat: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || !conversation) return

    const newMessage = {
      sender: 'visitor',
      senderName: visitorInfo.name,
      senderEmail: visitorInfo.email,
      content: inputValue,
      createdAt: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setLoading(true)

    try {
      const { data } = await api.post(`/chat/${conversation._id}/message`, {
        content: inputValue,
        sender: 'visitor',
        senderName: visitorInfo.name,
        senderEmail: visitorInfo.email
      })

      setConversation(data.conversation)
      setMessages(data.conversation.messages || [])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      {/* Chat Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <HiChat className="w-6 h-6" />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-24px)] bg-white rounded-2xl shadow-2xl flex flex-col z-50 h-[600px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-2xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg">{settings.title}</h3>
                <p className="text-sm text-blue-100">{settings.subtitle}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-lg transition"
              >
                <HiX className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {formStep === 'initial' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-4"
                >
                  <div className="bg-white p-4 rounded-lg border border-gray-200">
                    <p className="text-gray-700 mb-4">
                      {settings.initialMessage}
                    </p>
                    <button
                      onClick={() => setFormStep('form')}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition font-medium"
                    >
                      {settings.buttonText}
                    </button>
                  </div>

                  {/* Social Links */}
                  {settings.socialLinks && settings.socialLinks.length > 0 && (
                    <div className="bg-white p-4 rounded-lg border border-gray-200 space-y-2">
                      <p className="text-xs font-semibold text-gray-600 uppercase tracking-widest">Connect with us</p>
                      <div className="flex flex-wrap gap-2">
                        {settings.socialLinks.map((link) => (
                          <a
                            key={link.id}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm rounded-full transition border border-blue-200"
                          >
                            {link.platform}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              )}

              {formStep === 'form' && (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleStartChat}
                  className="space-y-3"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorInfo.name}
                      onChange={(e) => setVisitorInfo({ ...visitorInfo, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="John Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={visitorInfo.email}
                      onChange={(e) => setVisitorInfo({ ...visitorInfo, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={visitorInfo.phone}
                      onChange={(e) => setVisitorInfo({ ...visitorInfo, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+1 (555) 000-0000"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Subject *
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorInfo.subject}
                      onChange={(e) => setVisitorInfo({ ...visitorInfo, subject: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="What is this about?"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={visitorInfo.category}
                      onChange={(e) => setVisitorInfo({ ...visitorInfo, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="inquiry">General Inquiry</option>
                      <option value="support">Support</option>
                      <option value="collaboration">Collaboration</option>
                      <option value="feedback">Feedback</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white py-2 rounded-lg transition font-medium"
                  >
                    {loading ? 'Starting...' : 'Start Chat'}
                  </button>
                </motion.form>
              )}

              {formStep === 'chat' && (
                <div className="space-y-3">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'visitor'
                            ? 'bg-blue-500 text-white rounded-br-none'
                            : 'bg-gray-200 text-gray-900 rounded-bl-none'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs mt-1 opacity-70">
                          {new Date(msg.createdAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            {/* Input */}
            {formStep === 'chat' && (
              <form onSubmit={handleSendMessage} className="border-t border-gray-200 p-4 bg-white rounded-b-2xl">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={settings.placeholder}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <button
                    type="submit"
                    disabled={loading || !inputValue.trim()}
                    className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white p-2 rounded-lg transition"
                  >
                    <HiPaperAirplane className="w-5 h-5" />
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
