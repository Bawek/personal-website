import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiTrash, HiCheck, HiMail, HiPencil, HiPlus, HiSearch, HiFilter, HiDownload, HiChat } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"
const LABEL_CLS = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2"

function ContactContent() {
  const router = useRouter()
  const [messages, setMessages] = useState([])
  const [filteredMessages, setFilteredMessages] = useState([])
  const [editingContact, setEditingContact] = useState(false)
  const [status, setStatus]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', id: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all') // all, read, unread
  const [selectedMessages, setSelectedMessages] = useState(new Set())
  const [contactForm, setContactForm] = useState({
    hero: { title: '', subtitle: '' },
    form: { title: '', description: '', responseTime: '' },
    footer: { text: '' },
    social: { title: '', links: [] }
  })

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const startChat = async (message) => {
    try {
      // Get the current user ID from localStorage
      const userStr = localStorage.getItem('user')
      const user = userStr ? JSON.parse(userStr) : null
      const userId = user?.id
      
      if (!userId) {
        alert('User ID not found. Please log in again.')
        return
      }

      // Start a new conversation with the message sender
      const { data } = await api.post('/chat/start', {
        visitorName: message.name,
        visitorEmail: message.email,
        subject: message.subject || 'Follow-up to contact form',
        category: 'support',
        createdBy: userId
      }, { headers: headers() })

      // Navigate to chat page with the conversation ID
      router.push(`/admin/chat?conversationId=${data.conversation._id}`)
    } catch (error) {
      console.error('Error starting chat:', error)
      alert('Failed to start chat')
    }
  }

  const fetchMessages = async () => {
    try { 
      const { data } = await api.get('/contact/messages', { headers: headers() })
      setMessages(data.messages || [])
      applyFilters(data.messages || [], searchQuery, filterStatus)
    }
    catch {}
  }

  const applyFilters = (msgs, query, status) => {
    let filtered = msgs
    
    if (status === 'read') {
      filtered = filtered.filter(m => m.read)
    } else if (status === 'unread') {
      filtered = filtered.filter(m => !m.read)
    }
    
    if (query.trim()) {
      const q = query.toLowerCase()
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
      )
    }
    
    setFilteredMessages(filtered)
  }

  const fetchContactContent = async () => {
    try {
      const { data } = await api.get('/contact', { headers: headers() })
      if (data.contact) {
        setContactForm({
          hero: { title: data.contact.hero?.title || '', subtitle: data.contact.hero?.subtitle || '' },
          form: { 
            title: data.contact.form?.title || '', 
            description: data.contact.form?.description || '', 
            responseTime: data.contact.form?.responseTime || '' 
          },
          footer: { text: data.contact.footer?.text || '' },
          social: { 
            title: data.contact.social?.title || '', 
            links: data.contact.social?.links || [] 
          }
        })
      }
    } catch {}
  }

  useEffect(() => { fetchMessages(); fetchContactContent() }, [])

  useEffect(() => {
    applyFilters(messages, searchQuery, filterStatus)
  }, [searchQuery, filterStatus, messages])

  const markRead = async (id) => {
    try { await api.patch(`/contact/messages/${id}/read`, {}, { headers: headers() }); await fetchMessages() }
    catch {}
  }

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return
    try { await api.delete(`/contact/messages/${id}`, { headers: headers() }); await fetchMessages() }
    catch {}
  }

  const toggleSelectMessage = (id) => {
    const newSelected = new Set(selectedMessages)
    if (newSelected.has(id)) {
      newSelected.delete(id)
    } else {
      newSelected.add(id)
    }
    setSelectedMessages(newSelected)
  }

  const toggleSelectAll = () => {
    if (selectedMessages.size === filteredMessages.length) {
      setSelectedMessages(new Set())
    } else {
      setSelectedMessages(new Set(filteredMessages.map(m => m._id)))
    }
  }

  const markSelectedAsRead = async () => {
    try {
      await api.patch(`/contact/bulk/read`, { ids: Array.from(selectedMessages) }, { headers: headers() })
      setSelectedMessages(new Set())
      await fetchMessages()
    } catch {}
  }

  const deleteSelected = async () => {
    if (!confirm(`Delete ${selectedMessages.size} message(s)?`)) return
    try {
      await api.delete(`/contact/bulk/delete`, { data: { ids: Array.from(selectedMessages) }, headers: headers() })
      setSelectedMessages(new Set())
      await fetchMessages()
    } catch {}
  }

  const exportMessages = () => {
    const csv = [
      ['Name', 'Email', 'Subject', 'Message', 'Date', 'Status'],
      ...filteredMessages.map(m => [
        m.name,
        m.email,
        m.subject,
        `"${m.message.replace(/"/g, '""')}"`,
        new Date(m.createdAt).toLocaleString(),
        m.read ? 'Read' : 'Unread'
      ])
    ]
    .map(row => row.join(','))
    .join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `messages-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const handleSaveContact = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await api.put('/contact', contactForm, { headers: headers() })
      setStatus('ok')
      setEditingContact(false)
      await fetchContactContent()
    } catch {
      setStatus('err')
    } finally {
      setLoading(false)
    }
  }

  const handleAddSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      setStatus('err')
      return
    }
    const id = newSocialLink.id || `${newSocialLink.platform}-${Date.now()}`
    const updatedLinks = [...contactForm.social.links, { ...newSocialLink, id }]
    setContactForm({ ...contactForm, social: { ...contactForm.social, links: updatedLinks } })
    setNewSocialLink({ platform: '', url: '', id: '' })
  }

  const handleRemoveSocialLink = (id) => {
    const updatedLinks = contactForm.social.links.filter(link => link.id !== id)
    setContactForm({ ...contactForm, social: { ...contactForm.social, links: updatedLinks } })
  }

  const handleUpdateSocialLink = (id, field, value) => {
    const updatedLinks = contactForm.social.links.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    )
    setContactForm({ ...contactForm, social: { ...contactForm.social, links: updatedLinks } })
  }

  const unread = messages.filter(m => !m.read).length
  const total = messages.length
  const read = messages.filter(m => m.read).length

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
        <h1 className="text-2xl font-bold text-white">Contact & Messages</h1>
      </div>

      {/* Contact Section Editor */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Contact Section</h2>
          <button onClick={() => setEditingContact(!editingContact)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all border border-violet-500/20">
            <HiPencil size={14} /> {editingContact ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {editingContact ? (
          <form onSubmit={handleSaveContact} className="space-y-6">
            {/* Hero Section */}
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-sm font-semibold text-white mb-4">Hero Section</h3>
              <div className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>Section Title</label>
                  <input value={contactForm.hero.title} onChange={e => setContactForm({ ...contactForm, hero: { ...contactForm.hero, title: e.target.value } })}
                    placeholder="Get In Touch" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Section Subtitle</label>
                  <textarea rows={2} value={contactForm.hero.subtitle} onChange={e => setContactForm({ ...contactForm, hero: { ...contactForm.hero, subtitle: e.target.value } })}
                    placeholder="Have a project in mind or just want to say hi? My inbox is always open." className={`${INPUT_CLS} resize-none`} />
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-sm font-semibold text-white mb-4">Contact Form</h3>
              <div className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>Form Title</label>
                  <input value={contactForm.form.title} onChange={e => setContactForm({ ...contactForm, form: { ...contactForm.form, title: e.target.value } })}
                    placeholder="Send us a message" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Form Description</label>
                  <textarea rows={2} value={contactForm.form.description} onChange={e => setContactForm({ ...contactForm, form: { ...contactForm.form, description: e.target.value } })}
                    placeholder="We'd love to hear from you..." className={`${INPUT_CLS} resize-none`} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Response Time Message</label>
                  <input value={contactForm.form.responseTime} onChange={e => setContactForm({ ...contactForm, form: { ...contactForm.form, responseTime: e.target.value } })}
                    placeholder="I typically respond within 48 hours." className={INPUT_CLS} />
                </div>
              </div>
            </div>

            {/* Social Links Section */}
            <div className="border-b border-white/10 pb-6">
              <h3 className="text-sm font-semibold text-white mb-4">Social Links</h3>
              <div className="space-y-4">
                <div>
                  <label className={LABEL_CLS}>Social Section Title</label>
                  <input value={contactForm.social.title} onChange={e => setContactForm({ ...contactForm, social: { ...contactForm.social, title: e.target.value } })}
                    placeholder="Connect with me" className={INPUT_CLS} />
                </div>

                {/* Existing Social Links */}
                {contactForm.social.links.length > 0 && (
                  <div className="space-y-3 bg-white/3 rounded-xl p-4">
                    <p className="text-xs text-gray-500 font-mono uppercase">Current Links</p>
                    {contactForm.social.links.map((link) => (
                      <div key={link.id} className="flex gap-2 items-end">
                        <div className="flex-1 space-y-2">
                          <input value={link.platform} onChange={e => handleUpdateSocialLink(link.id, 'platform', e.target.value)}
                            placeholder="Platform (e.g., GitHub, LinkedIn)" className={`${INPUT_CLS} text-xs`} />
                          <input value={link.url} onChange={e => handleUpdateSocialLink(link.id, 'url', e.target.value)}
                            placeholder="URL" className={`${INPUT_CLS} text-xs`} />
                        </div>
                        <button type="button" onClick={() => handleRemoveSocialLink(link.id)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                          <HiTrash size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Add New Social Link */}
                <div className="bg-white/3 rounded-xl p-4 space-y-3">
                  <p className="text-xs text-gray-500 font-mono uppercase">Add New Link</p>
                  <input value={newSocialLink.platform} onChange={e => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
                    placeholder="Platform (e.g., GitHub, LinkedIn)" className={`${INPUT_CLS} text-xs`} />
                  <input value={newSocialLink.url} onChange={e => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                    placeholder="URL" className={`${INPUT_CLS} text-xs`} />
                  <button type="button" onClick={handleAddSocialLink}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all border border-violet-500/20">
                    <HiPlus size={14} /> Add Link
                  </button>
                </div>
              </div>
            </div>

            {/* Footer Section */}
            <div className="pb-6">
              <h3 className="text-sm font-semibold text-white mb-4">Footer</h3>
              <div>
                <label className={LABEL_CLS}>Footer Text</label>
                <input value={contactForm.footer.text} onChange={e => setContactForm({ ...contactForm, footer: { ...contactForm.footer, text: e.target.value } })}
                  placeholder="© 2026 Your Name. Built with Next.js & Tailwind." className={INPUT_CLS} />
              </div>
            </div>

            {status === 'ok'  && <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"><HiCheckCircle size={16} /> Saved</div>}
            {status === 'err' && <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><HiXCircle size={16} /> Failed to save</div>}

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={loading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all disabled:opacity-50">
                {loading ? 'Saving…' : 'Save Changes'}
              </button>
              <button type="button" onClick={() => setEditingContact(false)}
                className="px-4 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Hero Display */}
            <div className="border-b border-white/10 pb-6">
              <p className="text-xs text-gray-500 font-mono mb-3 uppercase">Hero Section</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-600 font-mono mb-1">Title</p>
                  <p className="text-gray-300">{contactForm.hero.title || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-mono mb-1">Subtitle</p>
                  <p className="text-gray-300">{contactForm.hero.subtitle || '—'}</p>
                </div>
              </div>
            </div>

            {/* Form Display */}
            <div className="border-b border-white/10 pb-6">
              <p className="text-xs text-gray-500 font-mono mb-3 uppercase">Contact Form</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-600 font-mono mb-1">Title</p>
                  <p className="text-gray-300">{contactForm.form.title || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-mono mb-1">Description</p>
                  <p className="text-gray-300">{contactForm.form.description || '—'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-mono mb-1">Response Time</p>
                  <p className="text-gray-300">{contactForm.form.responseTime || '—'}</p>
                </div>
              </div>
            </div>

            {/* Social Display */}
            <div className="border-b border-white/10 pb-6">
              <p className="text-xs text-gray-500 font-mono mb-3 uppercase">Social Links</p>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-xs text-gray-600 font-mono mb-1">Section Title</p>
                  <p className="text-gray-300">{contactForm.social.title || '—'}</p>
                </div>
                {contactForm.social.links.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600 font-mono mb-2">Links ({contactForm.social.links.length})</p>
                    {contactForm.social.links.map((link) => (
                      <div key={link.id} className="text-xs bg-white/3 rounded-lg p-2">
                        <p className="text-gray-400">{link.platform}: <span className="text-gray-500">{link.url}</span></p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-xs">No social links configured</p>
                )}
              </div>
            </div>

            {/* Footer Display */}
            <div>
              <p className="text-xs text-gray-500 font-mono mb-3 uppercase">Footer</p>
              <p className="text-gray-300 text-xs">{contactForm.footer.text || '—'}</p>
            </div>
          </div>
        )}
      </motion.div>

      {/* Messages */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Inbox</h2>
            <div className="flex gap-2">
              <span className="px-2 py-0.5 text-xs rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">
                {total} total
              </span>
              {unread > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">
                  {unread} new
                </span>
              )}
              {read > 0 && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                  {read} read
                </span>
              )}
            </div>
          </div>
          <button onClick={exportMessages} disabled={filteredMessages.length === 0}
            className="flex items-center gap-2 px-3 py-1.5 text-xs rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all border border-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed">
            <HiDownload size={14} /> Export CSV
          </button>
        </div>

        {/* Search and Filter */}
        <div className="mb-4 space-y-3">
          <div className="relative">
            <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" size={16} />
            <input
              type="text"
              placeholder="Search by name, email, subject, or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`${INPUT_CLS} pl-10`}
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${
                filterStatus === 'all'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('unread')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${
                filterStatus === 'unread'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => setFilterStatus('read')}
              className={`px-3 py-1.5 text-xs rounded-lg transition-all border ${
                filterStatus === 'read'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
              }`}
            >
              Read
            </button>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedMessages.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20">
            <input
              type="checkbox"
              checked={selectedMessages.size === filteredMessages.length && filteredMessages.length > 0}
              onChange={toggleSelectAll}
              className="w-4 h-4 rounded cursor-pointer"
            />
            <span className="text-sm text-violet-300 font-mono">{selectedMessages.size} selected</span>
            <div className="flex-1" />
            <button onClick={markSelectedAsRead}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-all border border-emerald-500/20">
              <HiCheck size={14} /> Mark as Read
            </button>
            <button onClick={deleteSelected}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all border border-red-500/20">
              <HiTrash size={14} /> Delete
            </button>
          </motion.div>
        )}

        {filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
            <HiMail size={32} className="mb-3 opacity-40" />
            <p className="text-sm">{messages.length === 0 ? 'No messages yet' : 'No messages match your filters'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMessages.map((msg) => (
              <motion.div key={msg._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className={`bg-white/5 border rounded-2xl p-5 transition-colors group flex items-start gap-3 ${!msg.read ? 'border-violet-500/30' : 'border-white/10'}`}>
                <input
                  type="checkbox"
                  checked={selectedMessages.has(msg._id)}
                  onChange={() => toggleSelectMessage(msg._id)}
                  className="w-4 h-4 rounded cursor-pointer mt-1 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-white text-sm">{msg.name}</span>
                    <a href={`mailto:${msg.email}`} className="text-xs text-violet-400 hover:text-violet-300 transition-colors">{msg.email}</a>
                    {!msg.read && <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30 font-mono">New</span>}
                  </div>
                  {msg.subject && <p className="text-xs text-gray-500 mb-1 font-mono">Subject: {msg.subject}</p>}
                  <p className="text-sm text-gray-400 leading-relaxed">{msg.message}</p>
                  <p className="text-xs text-gray-600 mt-2 font-mono">{new Date(msg.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex gap-1.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => startChat(msg)} className="p-1.5 rounded-lg text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 transition-all" aria-label="Start chat">
                    <HiChat size={14} />
                  </button>
                  {!msg.read && (
                    <button onClick={() => markRead(msg._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" aria-label="Mark as read">
                      <HiCheck size={14} />
                    </button>
                  )}
                  <button onClick={() => deleteMsg(msg._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" aria-label="Delete">
                    <HiTrash size={14} />
                  </button>
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
