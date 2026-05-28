import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
  HiCheckCircle,
  HiXCircle,
  HiTrash,
  HiCheck,
  HiMail,
  HiPencil,
  HiPlus,
  HiSearch,
  HiFilter,
  HiPaperAirplane,
  HiClock,
  HiFlag,
  HiUser
} from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"
const LABEL_CLS = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2"

function ChatContent() {
  const router = useRouter()
  const { conversationId } = router.query
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterPriority, setFilterPriority] = useState('all')
  const [messageInput, setMessageInput] = useState('')
  const [stats, setStats] = useState(null)
  const messagesEndRef = useRef(null)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const loadConversation = async (convId) => {
    try {
      const { data } = await api.get(`/chat/${convId}`, { headers: headers() })
      setSelectedConversation(data.conversation)
    } catch (error) {
      console.error('Error loading conversation:', error)
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [selectedConversation?.messages])

  useEffect(() => {
    // If conversationId is provided in query, load that conversation
    if (conversationId) {
      loadConversation(conversationId)
    }
  }, [conversationId])

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (filterStatus !== 'all') params.append('status', filterStatus)
      if (filterPriority !== 'all') params.append('priority', filterPriority)
      if (searchQuery) params.append('search', searchQuery)

      const { data } = await api.get(`/chat/admin/conversations?${params}`, {
        headers: headers()
      })
      setConversations(data.conversations || [])
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/chat/admin/stats', { headers: headers() })
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  useEffect(() => {
    fetchConversations()
    fetchStats()
  }, [filterStatus, filterPriority, searchQuery])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!messageInput.trim() || !selectedConversation) return

    try {
      const { data } = await api.post(
        `/chat/${selectedConversation._id}/message`,
        {
          content: messageInput,
          sender: 'admin',
          senderName: 'Admin',
          senderEmail: ''
        },
        { headers: headers() }
      )

      setSelectedConversation(data.conversation)
      setMessageInput('')
      fetchConversations()
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const handleStatusChange = async (conversationId, newStatus) => {
    try {
      const { data } = await api.patch(
        `/chat/${conversationId}/status`,
        { status: newStatus },
        { headers: headers() }
      )

      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(data.conversation)
      }
      fetchConversations()
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  const handlePriorityChange = async (conversationId, newPriority) => {
    try {
      const { data } = await api.patch(
        `/chat/${conversationId}/status`,
        { priority: newPriority },
        { headers: headers() }
      )

      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(data.conversation)
      }
      fetchConversations()
    } catch (error) {
      console.error('Error updating priority:', error)
    }
  }

  const handleMarkAsRead = async (conversationId) => {
    try {
      const { data } = await api.patch(
        `/chat/${conversationId}/read`,
        {},
        { headers: headers() }
      )

      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(data.conversation)
      }
      fetchConversations()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const handleDeleteConversation = async (conversationId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      await api.delete(`/chat/${conversationId}`, { headers: headers() })
      if (selectedConversation?._id === conversationId) {
        setSelectedConversation(null)
      }
      fetchConversations()
    } catch (error) {
      console.error('Error deleting conversation:', error)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      open: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      resolved: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800'
    }
    return colors[status] || colors.open
  }

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'text-gray-500',
      medium: 'text-blue-500',
      high: 'text-orange-500',
      urgent: 'text-red-500'
    }
    return colors[priority] || colors.medium
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Chat Management</h1>
          <p className="text-gray-400">Manage customer conversations and support tickets</p>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { label: 'Total', value: stats.total, icon: HiMail, color: 'from-blue-500 to-blue-600' },
              { label: 'Open', value: stats.open, icon: HiClock, color: 'from-yellow-500 to-yellow-600' },
              { label: 'In Progress', value: stats.inProgress, icon: HiPencil, color: 'from-purple-500 to-purple-600' },
              { label: 'Resolved', value: stats.resolved, icon: HiCheck, color: 'from-green-500 to-green-600' },
              { label: 'Unread', value: stats.unread, icon: HiFlag, color: 'from-red-500 to-red-600' }
            ].map((stat, idx) => {
              const Icon = stat.icon
              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`bg-gradient-to-br ${stat.color} p-4 rounded-lg text-white`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm opacity-90">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                    <Icon className="w-8 h-8 opacity-50" />
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden flex flex-col">
            {/* Search & Filter */}
            <div className="p-4 border-b border-gray-800 space-y-3">
              <div className="relative">
                <HiSearch className="absolute left-3 top-3 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={INPUT_CLS}
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>

                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className={INPUT_CLS}
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Conversations */}
            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No conversations found
                </div>
              ) : (
                conversations.map((conv) => (
                  <motion.button
                    key={conv._id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full text-left p-4 border-b border-gray-800 hover:bg-gray-800 transition ${
                      selectedConversation?._id === conv._id ? 'bg-gray-800' : ''
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-white truncate">{conv.visitorName}</p>
                        <p className="text-xs text-gray-400 truncate">{conv.visitorEmail}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded ${getStatusColor(conv.status)}`}>
                        {conv.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 truncate mb-2">{conv.subject}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{conv.messages?.length || 0} messages</span>
                      <HiFlag className={`w-4 h-4 ${getPriorityColor(conv.priority)}`} />
                    </div>
                  </motion.button>
                ))
              )}
            </div>
          </div>

          {/* Chat View */}
          <div className="lg:col-span-2 bg-gray-900 rounded-lg border border-gray-800 overflow-hidden flex flex-col">
            {selectedConversation ? (
              <>
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-white">{selectedConversation.visitorName}</h2>
                    <p className="text-sm text-gray-400">{selectedConversation.visitorEmail}</p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedConversation.status}
                      onChange={(e) => handleStatusChange(selectedConversation._id, e.target.value)}
                      className={`${INPUT_CLS} text-xs`}
                    >
                      <option value="open">Open</option>
                      <option value="in-progress">In Progress</option>
                      <option value="resolved">Resolved</option>
                      <option value="closed">Closed</option>
                    </select>

                    <select
                      value={selectedConversation.priority}
                      onChange={(e) => handlePriorityChange(selectedConversation._id, e.target.value)}
                      className={`${INPUT_CLS} text-xs`}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>

                    <button
                      onClick={() => handleDeleteConversation(selectedConversation._id)}
                      className="p-2 hover:bg-red-500/20 text-red-500 rounded transition"
                    >
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {selectedConversation.messages?.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          msg.sender === 'admin'
                            ? 'bg-blue-600 text-white rounded-br-none'
                            : 'bg-gray-800 text-gray-100 rounded-bl-none'
                        }`}
                      >
                        <p className="text-xs font-semibold mb-1 opacity-75">{msg.senderName}</p>
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

                {/* Input */}
                <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-4 bg-gray-800/50">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type your response..."
                      className={INPUT_CLS}
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white p-2 rounded transition"
                    >
                      <HiPaperAirplane className="w-5 h-5" />
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <HiMail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Select a conversation to view messages</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}

export default function ChatPage() {
  return (
    <AuthProtection>
      <ChatContent />
    </AuthProtection>
  )
}
