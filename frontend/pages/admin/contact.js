import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiTrash, HiCheck, HiMail } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"

function ContactContent() {
  const [messages, setMessages] = useState([])
  const [status, setStatus]     = useState(null)
  const [loading, setLoading]   = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchMessages = async () => {
    try { const { data } = await api.get('/contact/messages', { headers: headers() }); setMessages(data.messages || []) }
    catch {}
  }

  useEffect(() => { fetchMessages() }, [])

  const markRead = async (id) => {
    try { await api.patch(`/contact/messages/${id}/read`, {}, { headers: headers() }); await fetchMessages() }
    catch {}
  }

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return
    try { await api.delete(`/contact/messages/${id}`, { headers: headers() }); await fetchMessages() }
    catch {}
  }

  const unread = messages.filter(m => !m.read).length

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
        <h1 className="text-2xl font-bold text-white">Contact & Messages</h1>
      </div>

      {/* Messages */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Inbox</h2>
          {unread > 0 && (
            <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
              {unread} new
            </span>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
            <HiMail size={32} className="mb-3 opacity-40" />
            <p className="text-sm">No messages yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <motion.div key={msg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white/5 border rounded-2xl p-5 transition-colors group ${!msg.read ? 'border-violet-500/30' : 'border-white/10'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-semibold text-white text-sm">{msg.name}</span>
                      <a href={`mailto:${msg.email}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">{msg.email}</a>
                      {!msg.read && <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">New</span>}
                    </div>
                    <p className="text-sm text-gray-400 leading-relaxed">{msg.message}</p>
                    <p className="text-xs text-gray-600 mt-2 font-mono">{new Date(msg.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    {!msg.read && (
                      <button onClick={() => markRead(msg._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" aria-label="Mark as read">
                        <HiCheck size={14} />
                      </button>
                    )}
                    <button onClick={() => deleteMsg(msg._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" aria-label="Delete">
                      <HiTrash size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AdminContact() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Contact">
        <ContactContent />
      </AdminLayout>
    </AuthProtection>
  )
}
