import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiTrash, HiCheck, HiMail, HiPencil, HiPlus, HiX } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"
const LABEL_CLS = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2"

function ContactContent() {
  const [messages, setMessages] = useState([])
  const [contactContent, setContactContent] = useState(null)
  const [editingContact, setEditingContact] = useState(false)
  const [status, setStatus]     = useState(null)
  const [loading, setLoading]   = useState(false)
  const [contactForm, setContactForm] = useState({
    hero: { title: '', subtitle: '' },
    form: { responseTime: '' },
    footer: { text: '' }
  })

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchMessages = async () => {
    try { const { data } = await api.get('/contact/messages', { headers: headers() }); setMessages(data.messages || []) }
    catch {}
  }

  const fetchContactContent = async () => {
    try {
      const { data } = await api.get('/contact', { headers: headers() })
      if (data.contact) {
        setContactContent(data.contact)
        setContactForm({
          hero: { title: data.contact.hero?.title || '', subtitle: data.contact.hero?.subtitle || '' },
          form: { responseTime: data.contact.form?.responseTime || '' },
          footer: { text: data.contact.footer?.text || '' }
        })
      }
    } catch {}
  }

  useEffect(() => { fetchMessages(); fetchContactContent() }, [])

  const markRead = async (id) => {
    try { await api.patch(`/contact/messages/${id}/read`, {}, { headers: headers() }); await fetchMessages() }
    catch {}
  }

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return
    try { await api.delete(`/contact/messages/${id}`, { headers: headers() }); await fetchMessages() }
    catch {}
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

  const unread = messages.filter(m => !m.read).length

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
          <form onSubmit={handleSaveContact} className="space-y-4">
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
            <div>
              <label className={LABEL_CLS}>Response Time</label>
              <input value={contactForm.form.responseTime} onChange={e => setContactForm({ ...contactForm, form: { ...contactForm.form, responseTime: e.target.value } })}
                placeholder="I typically respond within 48 hours." className={INPUT_CLS} />
            </div>
            <div>
              <label className={LABEL_CLS}>Footer Text</label>
              <input value={contactForm.footer.text} onChange={e => setContactForm({ ...contactForm, footer: { ...contactForm.footer, text: e.target.value } })}
                placeholder="© 2026 Your Name. Built with Next.js & Tailwind." className={INPUT_CLS} />
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
          <div className="space-y-3 text-sm">
            <div>
              <p className="text-xs text-gray-500 font-mono mb-1">Title</p>
              <p className="text-gray-300">{contactForm.hero.title || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono mb-1">Subtitle</p>
              <p className="text-gray-300">{contactForm.hero.subtitle || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono mb-1">Response Time</p>
              <p className="text-gray-300">{contactForm.form.responseTime || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 font-mono mb-1">Footer</p>
              <p className="text-gray-300 text-xs">{contactForm.footer.text || '—'}</p>
            </div>
          </div>
        )}
      </motion.div>

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
