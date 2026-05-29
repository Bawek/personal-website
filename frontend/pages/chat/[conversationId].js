import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { HiPaperAirplane, HiX } from 'react-icons/hi'
import api from '@/lib/api'
import Head from 'next/head'

export default function PublicChatPage() {
  const router = useRouter()
  const { conversationId } = router.query
  const [conversation, setConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (conversationId) {
      // Save conversation ID to localStorage for persistence
      localStorage.setItem('chatConversationId', conversationId)
      
      loadConversation()
      // Poll for new messages every 5 seconds
      const interval = setInterval(loadConversation, 5000)
      return () => clearInterval(interval)
    }
  }, [conversationId])

  const loadConversation = async () => {
    try {
      const { data } = await api.get(`/chat/${conversationId}`)
      setConversation(data.conversation)
      setMessages(data.conversation.messages || [])
      setError(null)
    } catch (error) {
      console.error('Error loading conversation:', error)
      setError('Failed to load conversation')
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || !conversation) return

    const newMessage = {
      sender: 'visitor',
      senderName: conversation.visitorName,
      senderEmail: conversation.visitorEmail,
      content: inputValue,
      createdAt: new Date()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setLoading(true)

    try {
      const { data } = await api.post(`/chat/${conversationId}/message`, {
        content: inputValue,
        sender: 'visitor',
        senderName: conversation.visitorName,
        senderEmail: conversation.visitorEmail
      })

      setConversation(data.conversation)
      setMessages(data.conversation.messages || [])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages(prev => prev.slice(0, -1))
      alert('Failed to send message')
    } finally {
      setLoading(false)
    }
  }

  if (!conversationId) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button
            onClick={() => router.push('/contact')}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go to Contact Page
          </button>
        </div>
      </div>
    )
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading conversation...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Chat - {conversation.subject}</title>
      </Head>

      <div className="min-h-screen bg-gray-900 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 shadow-lg">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">{conversation.subject}</h1>
              <p className="text-sm text-blue-100">
                Status: <span className="capitalize">{conversation.status}</span>
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  localStorage.removeItem('chatConversationId')
                  localStorage.removeItem('chatVisitorInfo')
                  router.push('/contact')
                }}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition text-sm font-medium"
              >
                New Chat
              </button>
              <button
                onClick={() => router.push('/contact')}
                className="p-2 hover:bg-white/20 rounded-lg transition"
              >
                <HiX className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-800">
          <div className="max-w-4xl mx-auto space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No messages yet. Start the conversation!</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.sender === 'visitor' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md px-4 py-3 rounded-lg ${
                      msg.sender === 'visitor'
                        ? 'bg-blue-500 text-white rounded-br-none'
                        : 'bg-gray-700 text-gray-100 rounded-bl-none'
                    }`}
                  >
                    <p className="text-xs font-semibold mb-1 opacity-75">
                      {msg.sender === 'visitor' ? 'You' : 'Admin'}
                    </p>
                    <p className="text-sm">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <form onSubmit={handleSendMessage} className="border-t border-gray-700 p-4 bg-gray-900">
          <div className="max-w-4xl mx-auto flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-800 text-white"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg transition font-medium"
            >
              <HiPaperAirplane className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
