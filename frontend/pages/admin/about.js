import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'
import ImageUploadField from '@/components/Admin/ImageUploadField'

const FIELD = ({ label, children }) => (
  <div>
    <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{label}</label>
    {children}
  </div>
)

const INPUT_CLS = "admin-input"

function AboutContent() {
  const [data, setData]     = useState({ hero: { title: '', subtitle: '', description: '', imageUrl: '' }, whoAmI: { title: '', description: '' }, resume: { buttonText: '', fileUrl: '' } })
  const [loading, setLoading] = useState(false)
  const [status, setStatus]   = useState(null) // 'ok' | 'err'

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token')
        const { data: res } = await axios.get('/api/about', { headers: { Authorization: `Bearer ${token}` } })
        if (res.about) setData(res.about)
      } catch {}
    }
    fetch()
  }, [])

  const set = (section, field, value) => setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setStatus(null)
    try {
      const token = localStorage.getItem('token')
      await axios.put('/api/about', data, { headers: { Authorization: `Bearer ${token}` } })
      setStatus('ok')
    } catch { setStatus('err') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
        <h1 className="text-2xl font-bold text-white">About Section</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Hero Section</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FIELD label="Title">
              <input value={data.hero.title} onChange={e => set('hero','title',e.target.value)} placeholder="Hello, I am Baweke" className={INPUT_CLS} />
            </FIELD>
            <FIELD label="Subtitle">
              <input value={data.hero.subtitle} onChange={e => set('hero','subtitle',e.target.value)} placeholder="I love to learn new technologies" className={INPUT_CLS} />
            </FIELD>
          </div>
          <FIELD label="Description">
            <textarea rows={3} value={data.hero.description} onChange={e => set('hero','description',e.target.value)} placeholder="Short intro shown in the hero…" className={`${INPUT_CLS} resize-none`} />
          </FIELD>
          <ImageUploadField
            label="Profile Photo"
            value={data.hero.imageUrl || ''}
            folder="about"
            onError={() => setStatus('err')}
            onChange={({ url }) => set('hero', 'imageUrl', url)}
          />
        </motion.div>

        {/* Who I Am */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Who I Am</h2>
          <FIELD label="Section Title">
            <input value={data.whoAmI.title} onChange={e => set('whoAmI','title',e.target.value)} placeholder="Who I Am" className={INPUT_CLS} />
          </FIELD>
          <FIELD label="Description">
            <textarea rows={6} value={data.whoAmI.description} onChange={e => set('whoAmI','description',e.target.value)} placeholder="Tell visitors about yourself…" className={`${INPUT_CLS} resize-none`} />
          </FIELD>
        </motion.div>

        {/* Resume */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Resume Download</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FIELD label="Button Text">
              <input value={data.resume.buttonText} onChange={e => set('resume','buttonText',e.target.value)} placeholder="Download Resume" className={INPUT_CLS} />
            </FIELD>
            <FIELD label="File URL">
              <input type="url" value={data.resume.fileUrl} onChange={e => set('resume','fileUrl',e.target.value)} placeholder="https://…/resume.pdf" className={INPUT_CLS} />
            </FIELD>
          </div>
        </motion.div>

        {/* Status + submit */}
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

export default function AdminAbout() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="About">
        <AboutContent />
      </AdminLayout>
    </AuthProtection>
  )
}
