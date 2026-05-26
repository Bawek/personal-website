import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiBookOpen, HiCode } from 'react-icons/hi'
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

function SettingsContent() {
  const [settings, setSettings] = useState({ 
    siteName: '', 
    siteDescription: '', 
    contactInfo: { email: '', phone: '', address: '' }, 
    seo: { metaTitle: '', metaDescription: '', keywords: [] }, 
    theme: { primaryColor: '#8B5CF6', secondaryColor: '#EC4899', fontFamily: 'Inter' }, 
    features: { blog: { enabled: true }, portfolio: { enabled: true }, contact: { enabled: true }, analytics: { enabled: false } },
    statusWidgets: {
      currentlyReading: { enabled: false, bookTitle: '', author: '', coverUrl: '', link: '' },
      currentlyBuilding: { enabled: false, projectName: '', description: '', technologies: '', progress: 0 }
    }
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus]   = useState(null)

  useEffect(() => {
    axios.get('/api/settings').then(({ data }) => { if (data.settings) setSettings(data.settings) }).catch(() => {})
  }, [])

  const set = (path, value) => {
    const keys = path.split('.')
    setSettings(prev => {
      const next = { ...prev }
      let cur = next
      for (let i = 0; i < keys.length - 1; i++) { cur[keys[i]] = { ...cur[keys[i]] }; cur = cur[keys[i]] }
      cur[keys[keys.length - 1]] = value
      return next
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null)
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/settings', settings, { headers: { Authorization: `Bearer ${token}` } })
      setStatus('ok')
    } catch { setStatus('err') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* General */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">General</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={LABEL_CLS}>Site Name</label><input value={settings.siteName} onChange={e => set('siteName', e.target.value)} placeholder="My Portfolio" className={INPUT_CLS} /></div>
            <div><label className={LABEL_CLS}>Site Description</label><input value={settings.siteDescription} onChange={e => set('siteDescription', e.target.value)} placeholder="Welcome to my site" className={INPUT_CLS} /></div>
          </div>
        </motion.div>

        {/* Contact info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Contact Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div><label className={LABEL_CLS}>Email</label><input type="email" value={settings.contactInfo?.email || ''} onChange={e => set('contactInfo.email', e.target.value)} placeholder="you@example.com" className={INPUT_CLS} /></div>
            <div><label className={LABEL_CLS}>Phone</label><input value={settings.contactInfo?.phone || ''} onChange={e => set('contactInfo.phone', e.target.value)} placeholder="+251…" className={INPUT_CLS} /></div>
            <div className="sm:col-span-2"><label className={LABEL_CLS}>Address</label><input value={settings.contactInfo?.address || ''} onChange={e => set('contactInfo.address', e.target.value)} placeholder="Addis Ababa, Ethiopia" className={INPUT_CLS} /></div>
          </div>
        </motion.div>

        {/* Status Widgets */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Status Widgets</h2>
          
          {/* Currently Reading */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <Toggle 
              label="Currently Reading" 
              desc="Show what you're currently reading on the homepage" 
              checked={settings.statusWidgets?.currentlyReading?.enabled ?? false} 
              onChange={e => set('statusWidgets.currentlyReading.enabled', e.target.checked)} 
            />
            {settings.statusWidgets?.currentlyReading?.enabled && (
              <div className="grid sm:grid-cols-2 gap-4 pl-4">
                <div>
                  <label className={LABEL_CLS}>Book Title</label>
                  <input value={settings.statusWidgets?.currentlyReading?.bookTitle || ''} onChange={e => set('statusWidgets.currentlyReading.bookTitle', e.target.value)} placeholder="Book name" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Author</label>
                  <input value={settings.statusWidgets?.currentlyReading?.author || ''} onChange={e => set('statusWidgets.currentlyReading.author', e.target.value)} placeholder="Author name" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Cover URL</label>
                  <input type="url" value={settings.statusWidgets?.currentlyReading?.coverUrl || ''} onChange={e => set('statusWidgets.currentlyReading.coverUrl', e.target.value)} placeholder="https://..." className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Link URL</label>
                  <input type="url" value={settings.statusWidgets?.currentlyReading?.link || ''} onChange={e => set('statusWidgets.currentlyReading.link', e.target.value)} placeholder="https://..." className={INPUT_CLS} />
                </div>
              </div>
            )}
          </div>

          {/* Currently Building */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            <Toggle 
              label="Currently Building" 
              desc="Show what you're currently working on" 
              checked={settings.statusWidgets?.currentlyBuilding?.enabled ?? false} 
              onChange={e => set('statusWidgets.currentlyBuilding.enabled', e.target.checked)} 
            />
            {settings.statusWidgets?.currentlyBuilding?.enabled && (
              <div className="space-y-3 pl-4">
                <div>
                  <label className={LABEL_CLS}>Project Name</label>
                  <input value={settings.statusWidgets?.currentlyBuilding?.projectName || ''} onChange={e => set('statusWidgets.currentlyBuilding.projectName', e.target.value)} placeholder="Project name" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Description</label>
                  <input value={settings.statusWidgets?.currentlyBuilding?.description || ''} onChange={e => set('statusWidgets.currentlyBuilding.description', e.target.value)} placeholder="Short description" className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Technologies (comma-separated)</label>
                  <input value={settings.statusWidgets?.currentlyBuilding?.technologies || ''} onChange={e => set('statusWidgets.currentlyBuilding.technologies', e.target.value)} placeholder="React, Node.js, etc." className={INPUT_CLS} />
                </div>
                <div>
                  <label className={LABEL_CLS}>Progress (%)</label>
                  <input type="number" min="0" max="100" value={settings.statusWidgets?.currentlyBuilding?.progress ?? 0} onChange={e => set('statusWidgets.currentlyBuilding.progress', parseInt(e.target.value))} placeholder="0-100" className={INPUT_CLS} />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* SEO */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">SEO</h2>
          <div><label className={LABEL_CLS}>Meta Title <span className="text-gray-600 normal-case">(max 60 chars)</span></label><input maxLength={60} value={settings.seo?.metaTitle || ''} onChange={e => set('seo.metaTitle', e.target.value)} placeholder="Baweke | Software Engineer" className={INPUT_CLS} /></div>
          <div><label className={LABEL_CLS}>Meta Description <span className="text-gray-600 normal-case">(max 160 chars)</span></label><textarea maxLength={160} rows={2} value={settings.seo?.metaDescription || ''} onChange={e => set('seo.metaDescription', e.target.value)} placeholder="Personal portfolio of…" className={`${INPUT_CLS} resize-none`} /></div>
          <div><label className={LABEL_CLS}>Keywords <span className="text-gray-600 normal-case">(comma-separated)</span></label><input value={(settings.seo?.keywords || []).join(', ')} onChange={e => set('seo.keywords', e.target.value.split(',').map(k => k.trim()).filter(Boolean))} placeholder="portfolio, react, developer" className={INPUT_CLS} /></div>
        </motion.div>

        {/* Theme */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Theme</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className={LABEL_CLS}>Primary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={settings.theme?.primaryColor || '#8B5CF6'} onChange={e => set('theme.primaryColor', e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                <span className="text-xs text-gray-500 font-mono">{settings.theme?.primaryColor}</span>
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Secondary Color</label>
              <div className="flex items-center gap-2">
                <input type="color" value={settings.theme?.secondaryColor || '#EC4899'} onChange={e => set('theme.secondaryColor', e.target.value)} className="w-10 h-10 rounded-lg border border-white/10 bg-transparent cursor-pointer" />
                <span className="text-xs text-gray-500 font-mono">{settings.theme?.secondaryColor}</span>
              </div>
            </div>
            <div>
              <label className={LABEL_CLS}>Font</label>
              <select value={settings.theme?.fontFamily || 'Inter'} onChange={e => set('theme.fontFamily', e.target.value)}
                className="admin-select">
                {['Inter','Roboto','Poppins','Georgia','Fira Code'].map(f => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Features</h2>
          <div className="space-y-4">
            <Toggle label="Blog" desc="Enable the blog section" checked={settings.features?.blog?.enabled ?? true} onChange={e => set('features.blog.enabled', e.target.checked)} />
            <Toggle label="Portfolio" desc="Enable the projects section" checked={settings.features?.portfolio?.enabled ?? true} onChange={e => set('features.portfolio.enabled', e.target.checked)} />
            <Toggle label="Contact Form" desc="Allow visitors to send messages" checked={settings.features?.contact?.enabled ?? true} onChange={e => set('features.contact.enabled', e.target.checked)} />
            <Toggle label="Analytics" desc="Enable visitor tracking" checked={settings.features?.analytics?.enabled ?? false} onChange={e => set('features.analytics.enabled', e.target.checked)} />
          </div>
        </motion.div>

        {/* Status */}
        {status === 'ok' && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm">
            <HiCheckCircle size={16} /> Saved successfully
          </div>
        )}
        {status === 'err' && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <HiXCircle size={16} /> Failed to save. Please try again.
          </div>
        )}

        <button type="submit" disabled={loading}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50">
          {loading ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}

export default function AdminSettings() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Settings">
        <SettingsContent />
      </AdminLayout>
    </AuthProtection>
  )
}
