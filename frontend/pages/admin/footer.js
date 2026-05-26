import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiTrash, HiPlus, HiPencil } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INPUT_CLS = "admin-input"
const LABEL_CLS = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2"

const Toggle = ({ label, desc, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div className="relative mt-0.5 flex-shrink-0">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-9 h-5 bg-white/10 rounded-full peer-checked:bg-violet-500 transition-colors" />
      <div className="absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</p>
      {desc && <p className="text-xs text-gray-600 mt-0.5">{desc}</p>}
    </div>
  </label>
)

function FooterContent() {
  const [footer, setFooter] = useState({
    companyName: '',
    copyrightText: '',
    description: '',
    links: [],
    socialLinks: [],
    newsletter: { enabled: false, title: '', description: '' },
    contact: { enabled: true, email: '', phone: '' }
  })
  const [newLink, setNewLink] = useState({ label: '', url: '', category: '', order: 0 })
  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', icon: '' })
  const [editingLink, setEditingLink] = useState(null)
  const [editingSocialLink, setEditingSocialLink] = useState(null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  useEffect(() => {
    fetchFooter()
  }, [])

  const fetchFooter = async () => {
    try {
      const { data } = await api.get('/settings', { headers: headers() })
      if (data.settings?.footer) {
        setFooter(data.settings.footer)
      }
    } catch {}
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus(null)
    try {
      await api.put('/settings/footer', footer, { headers: headers() })
      setStatus('ok')
      setTimeout(() => setStatus(null), 3000)
    } catch {
      setStatus('err')
    } finally {
      setLoading(false)
    }
  }

  const addLink = () => {
    if (!newLink.label || !newLink.url) {
      setStatus('err')
      return
    }
    const updatedLinks = [...footer.links, { ...newLink, id: Date.now() }]
    setFooter({ ...footer, links: updatedLinks })
    setNewLink({ label: '', url: '', category: '', order: 0 })
  }

  const updateLink = (id, field, value) => {
    const updatedLinks = footer.links.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    )
    setFooter({ ...footer, links: updatedLinks })
  }

  const removeLink = (id) => {
    const updatedLinks = footer.links.filter(link => link.id !== id)
    setFooter({ ...footer, links: updatedLinks })
  }

  const addSocialLink = () => {
    if (!newSocialLink.platform || !newSocialLink.url) {
      setStatus('err')
      return
    }
    const updatedSocialLinks = [...footer.socialLinks, { ...newSocialLink, id: Date.now() }]
    setFooter({ ...footer, socialLinks: updatedSocialLinks })
    setNewSocialLink({ platform: '', url: '', icon: '' })
  }

  const updateSocialLink = (id, field, value) => {
    const updatedSocialLinks = footer.socialLinks.map(link =>
      link.id === id ? { ...link, [field]: value } : link
    )
    setFooter({ ...footer, socialLinks: updatedSocialLinks })
  }

  const removeSocialLink = (id) => {
    const updatedSocialLinks = footer.socialLinks.filter(link => link.id !== id)
    setFooter({ ...footer, socialLinks: updatedSocialLinks })
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
        <h1 className="text-2xl font-bold text-white">Footer Settings</h1>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* General Footer Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">General</h2>
          <div className="space-y-4">
            <div>
              <label className={LABEL_CLS}>Company Name</label>
              <input
                value={footer.companyName}
                onChange={e => setFooter({ ...footer, companyName: e.target.value })}
                placeholder="Your Name"
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Copyright Text</label>
              <input
                value={footer.copyrightText}
                onChange={e => setFooter({ ...footer, copyrightText: e.target.value })}
                placeholder="© 2026 Your Name. All rights reserved."
                className={INPUT_CLS}
              />
            </div>
            <div>
              <label className={LABEL_CLS}>Description</label>
              <textarea
                rows={2}
                value={footer.description}
                onChange={e => setFooter({ ...footer, description: e.target.value })}
                placeholder="Built with Next.js & Tailwind CSS"
                className={`${INPUT_CLS} resize-none`}
              />
            </div>
          </div>
        </motion.div>

        {/* Footer Links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Footer Links</h2>

          {/* Existing Links */}
          {footer.links.length > 0 && (
            <div className="space-y-3 bg-white/3 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-mono uppercase">Current Links ({footer.links.length})</p>
              {footer.links.map((link) => (
                <div key={link.id} className="flex gap-2 items-end bg-white/5 p-3 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <input
                      value={link.label}
                      onChange={e => updateLink(link.id, 'label', e.target.value)}
                      placeholder="Link Label"
                      className={`${INPUT_CLS} text-xs`}
                    />
                    <input
                      value={link.url}
                      onChange={e => updateLink(link.id, 'url', e.target.value)}
                      placeholder="https://example.com"
                      className={`${INPUT_CLS} text-xs`}
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={link.category}
                        onChange={e => updateLink(link.id, 'category', e.target.value)}
                        placeholder="Category (e.g., Product)"
                        className={`${INPUT_CLS} text-xs`}
                      />
                      <input
                        type="number"
                        value={link.order}
                        onChange={e => updateLink(link.id, 'order', parseInt(e.target.value))}
                        placeholder="Order"
                        className={`${INPUT_CLS} text-xs`}
                      />
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeLink(link.id)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                  >
                    <HiTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Link */}
          <div className="bg-white/3 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 font-mono uppercase">Add New Link</p>
            <input
              value={newLink.label}
              onChange={e => setNewLink({ ...newLink, label: e.target.value })}
              placeholder="Link Label"
              className={`${INPUT_CLS} text-xs`}
            />
            <input
              value={newLink.url}
              onChange={e => setNewLink({ ...newLink, url: e.target.value })}
              placeholder="https://example.com"
              className={`${INPUT_CLS} text-xs`}
            />
            <div className="grid grid-cols-2 gap-2">
              <input
                value={newLink.category}
                onChange={e => setNewLink({ ...newLink, category: e.target.value })}
                placeholder="Category"
                className={`${INPUT_CLS} text-xs`}
              />
              <input
                type="number"
                value={newLink.order}
                onChange={e => setNewLink({ ...newLink, order: parseInt(e.target.value) })}
                placeholder="Order"
                className={`${INPUT_CLS} text-xs`}
              />
            </div>
            <button
              type="button"
              onClick={addLink}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all border border-violet-500/20"
            >
              <HiPlus size={14} /> Add Link
            </button>
          </div>
        </motion.div>

        {/* Social Links */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Social Links</h2>

          {/* Existing Social Links */}
          {footer.socialLinks.length > 0 && (
            <div className="space-y-3 bg-white/3 rounded-xl p-4">
              <p className="text-xs text-gray-500 font-mono uppercase">Current Links ({footer.socialLinks.length})</p>
              {footer.socialLinks.map((link) => (
                <div key={link.id} className="flex gap-2 items-end bg-white/5 p-3 rounded-lg">
                  <div className="flex-1 space-y-2">
                    <input
                      value={link.platform}
                      onChange={e => updateSocialLink(link.id, 'platform', e.target.value)}
                      placeholder="Platform (e.g., GitHub, LinkedIn)"
                      className={`${INPUT_CLS} text-xs`}
                    />
                    <input
                      value={link.url}
                      onChange={e => updateSocialLink(link.id, 'url', e.target.value)}
                      placeholder="https://example.com"
                      className={`${INPUT_CLS} text-xs`}
                    />
                    <input
                      value={link.icon}
                      onChange={e => updateSocialLink(link.id, 'icon', e.target.value)}
                      placeholder="Icon class (e.g., HiGithub)"
                      className={`${INPUT_CLS} text-xs`}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeSocialLink(link.id)}
                    className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
                  >
                    <HiTrash size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Add New Social Link */}
          <div className="bg-white/3 rounded-xl p-4 space-y-3">
            <p className="text-xs text-gray-500 font-mono uppercase">Add New Social Link</p>
            <input
              value={newSocialLink.platform}
              onChange={e => setNewSocialLink({ ...newSocialLink, platform: e.target.value })}
              placeholder="Platform (e.g., GitHub, LinkedIn)"
              className={`${INPUT_CLS} text-xs`}
            />
            <input
              value={newSocialLink.url}
              onChange={e => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
              placeholder="https://example.com"
              className={`${INPUT_CLS} text-xs`}
            />
            <input
              value={newSocialLink.icon}
              onChange={e => setNewSocialLink({ ...newSocialLink, icon: e.target.value })}
              placeholder="Icon class (e.g., HiGithub)"
              className={`${INPUT_CLS} text-xs`}
            />
            <button
              type="button"
              onClick={addSocialLink}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs rounded-lg bg-violet-500/10 text-violet-400 hover:bg-violet-500/20 transition-all border border-violet-500/20"
            >
              <HiPlus size={14} /> Add Social Link
            </button>
          </div>
        </motion.div>

        {/* Newsletter */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Newsletter</h2>
          <Toggle
            label="Enable Newsletter"
            desc="Show newsletter signup in footer"
            checked={footer.newsletter?.enabled ?? false}
            onChange={e => setFooter({ ...footer, newsletter: { ...footer.newsletter, enabled: e.target.checked } })}
          />
          {footer.newsletter?.enabled && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <label className={LABEL_CLS}>Newsletter Title</label>
                <input
                  value={footer.newsletter?.title || ''}
                  onChange={e => setFooter({ ...footer, newsletter: { ...footer.newsletter, title: e.target.value } })}
                  placeholder="Subscribe to my newsletter"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Newsletter Description</label>
                <textarea
                  rows={2}
                  value={footer.newsletter?.description || ''}
                  onChange={e => setFooter({ ...footer, newsletter: { ...footer.newsletter, description: e.target.value } })}
                  placeholder="Get updates on new projects and insights..."
                  className={`${INPUT_CLS} resize-none`}
                />
              </div>
            </div>
          )}
        </motion.div>

        {/* Contact Info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Contact Info</h2>
          <Toggle
            label="Show Contact Info"
            desc="Display contact details in footer"
            checked={footer.contact?.enabled ?? true}
            onChange={e => setFooter({ ...footer, contact: { ...footer.contact, enabled: e.target.checked } })}
          />
          {footer.contact?.enabled && (
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div>
                <label className={LABEL_CLS}>Email</label>
                <input
                  type="email"
                  value={footer.contact?.email || ''}
                  onChange={e => setFooter({ ...footer, contact: { ...footer.contact, email: e.target.value } })}
                  placeholder="you@example.com"
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Phone</label>
                <input
                  value={footer.contact?.phone || ''}
                  onChange={e => setFooter({ ...footer, contact: { ...footer.contact, phone: e.target.value } })}
                  placeholder="+251..."
                  className={INPUT_CLS}
                />
              </div>
            </div>
          )}
        </motion.div>

        {status === 'ok' && <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"><HiCheckCircle size={16} /> Footer settings saved</div>}
        {status === 'err' && <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><HiXCircle size={16} /> Failed to save</div>}

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50"
        >
          {loading ? 'Saving…' : 'Save Footer Settings'}
        </button>
      </form>
    </div>
  )
}

export default function AdminFooter() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Footer">
        <FooterContent />
      </AdminLayout>
    </AuthProtection>
  )
}
