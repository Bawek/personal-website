import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiCheckCircle, HiXCircle, HiPlus, HiTrash } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const FIELD = ({ label, children }) => (
  <div>
    <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{label}</label>
    {children}
  </div>
)

const INPUT_CLS = "admin-input"

function AboutContent() {
  const [data, setData] = useState({
    hero: { title: '', subtitle: '', description: '', photoUrl: '' },
    whoAmI: { title: '', description: '' },
    philosophy: { title: '', description: '', aiMLApproach: '' },
    interests: { title: '', items: [] },
    values: { title: '', items: [] },
    resume: { buttonText: '', fileUrl: '' }
  })
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState(null) // 'ok' | 'err'

  useEffect(() => {
    const fetch = async () => {
      try {
        const token = localStorage.getItem('token')
        const { data: res } = await axios.get('/api/about', { headers: { Authorization: `Bearer ${token}` } })
        if (res.about) {
          setData({
            hero: res.about.hero || { title: '', subtitle: '', description: '', photoUrl: '' },
            whoAmI: res.about.whoAmI || { title: '', description: '' },
            philosophy: res.about.philosophy || { title: '', description: '', aiMLApproach: '' },
            interests: res.about.interests || { title: '', items: [] },
            values: res.about.values || { title: '', items: [] },
            resume: res.about.resume || { buttonText: '', fileUrl: '' }
          })
        }
      } catch {}
    }
    fetch()
  }, [])

  const set = (section, field, value) => setData(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }))

  const addInterest = () => {
    setData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        items: [...prev.interests.items, { name: '', description: '', icon: '' }]
      }
    }))
  }

  const removeInterest = (index) => {
    setData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        items: prev.interests.items.filter((_, i) => i !== index)
      }
    }))
  }

  const updateInterest = (index, field, value) => {
    setData(prev => ({
      ...prev,
      interests: {
        ...prev.interests,
        items: prev.interests.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
      }
    }))
  }

  const addValue = () => {
    setData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: [...prev.values.items, { name: '', description: '' }]
      }
    }))
  }

  const removeValue = (index) => {
    setData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: prev.values.items.filter((_, i) => i !== index)
      }
    }))
  }

  const updateValue = (index, field, value) => {
    setData(prev => ({
      ...prev,
      values: {
        ...prev.values,
        items: prev.values.items.map((item, i) => i === index ? { ...item, [field]: value } : item)
      }
    }))
  }

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
          <FIELD label="Professional Photo URL">
            <input type="url" value={data.hero.photoUrl} onChange={e => set('hero','photoUrl',e.target.value)} placeholder="https://…/photo.jpg" className={INPUT_CLS} />
          </FIELD>
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

        {/* Philosophy */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Philosophy</h2>
          <FIELD label="Section Title">
            <input value={data.philosophy.title} onChange={e => set('philosophy','title',e.target.value)} placeholder="My Philosophy" className={INPUT_CLS} />
          </FIELD>
          <FIELD label="General Philosophy">
            <textarea rows={4} value={data.philosophy.description} onChange={e => set('philosophy','description',e.target.value)} placeholder="Your approach to software development and problem-solving…" className={`${INPUT_CLS} resize-none`} />
          </FIELD>
          <FIELD label="AI/ML Approach">
            <textarea rows={4} value={data.philosophy.aiMLApproach} onChange={e => set('philosophy','aiMLApproach',e.target.value)} placeholder="Your philosophy on AI/ML, ethics, reproducibility, etc." className={`${INPUT_CLS} resize-none`} />
          </FIELD>
        </motion.div>

        {/* Personal Interests */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Personal Interests</h2>
            <button type="button" onClick={addInterest} className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1">
              <HiPlus size={16} /> Add Interest
            </button>
          </div>
          <FIELD label="Section Title">
            <input value={data.interests.title} onChange={e => set('interests','title',e.target.value)} placeholder="Personal Interests" className={INPUT_CLS} />
          </FIELD>
          {data.interests.items.map((interest, index) => (
            <div key={index} className="border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Interest #{index + 1}</span>
                <button type="button" onClick={() => removeInterest(index)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                  <HiTrash size={16} /> Remove
                </button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <FIELD label="Name">
                  <input value={interest.name} onChange={e => updateInterest(index, 'name', e.target.value)} placeholder="e.g., Open Source" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="Icon (emoji)">
                  <input value={interest.icon} onChange={e => updateInterest(index, 'icon', e.target.value)} placeholder="🚀" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="Description">
                  <input value={interest.description} onChange={e => updateInterest(index, 'description', e.target.value)} placeholder="Short description" className={INPUT_CLS} />
                </FIELD>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Professional Values */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Professional Values</h2>
            <button type="button" onClick={addValue} className="text-violet-400 hover:text-violet-300 text-sm flex items-center gap-1">
              <HiPlus size={16} /> Add Value
            </button>
          </div>
          <FIELD label="Section Title">
            <input value={data.values.title} onChange={e => set('values','title',e.target.value)} placeholder="Professional Values" className={INPUT_CLS} />
          </FIELD>
          {data.values.items.map((value, index) => (
            <div key={index} className="border border-white/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">Value #{index + 1}</span>
                <button type="button" onClick={() => removeValue(index)} className="text-red-400 hover:text-red-300 text-sm flex items-center gap-1">
                  <HiTrash size={16} /> Remove
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                <FIELD label="Name">
                  <input value={value.name} onChange={e => updateValue(index, 'name', e.target.value)} placeholder="e.g., Clean Code" className={INPUT_CLS} />
                </FIELD>
                <FIELD label="Description">
                  <input value={value.description} onChange={e => updateValue(index, 'description', e.target.value)} placeholder="Short description" className={INPUT_CLS} />
                </FIELD>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Resume */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
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
