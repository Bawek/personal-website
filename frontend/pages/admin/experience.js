import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiPencil, HiTrash, HiPlus, HiX, HiLocationMarker } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const TYPE_COLORS = {
  'full-time':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'part-time':  'bg-blue-500/10    text-blue-400    border-blue-500/20',
  'contract':   'bg-violet-500/10  text-violet-400  border-violet-500/20',
  'internship': 'bg-amber-500/10   text-amber-400   border-amber-500/20',
  'freelance':  'bg-pink-500/10    text-pink-400    border-pink-500/20',
}

const INIT = { title: '', company: '', location: '', employmentType: 'full-time', startDate: '', endDate: '', current: false, description: '', responsibilities: '', achievements: '', technologies: '' }

function ExperienceContent() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(INIT)
  const [showForm, setShowForm] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchExp = async () => {
    try { const { data } = await axios.get('/api/experience', { headers: headers() }); setExperiences(data.experiences || []) }
    catch { setError('Failed to load') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchExp() }, [])

  const openNew  = () => { setForm(INIT); setEditing(null); setShowForm(true); setError('') }
  const openEdit = (e) => {
    setForm({ title: e.title, company: e.company, location: e.location || '', employmentType: e.employmentType, startDate: new Date(e.startDate).toISOString().split('T')[0], endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : '', current: e.current || false, description: e.description, responsibilities: e.responsibilities.join('\n'), achievements: e.achievements.join('\n'), technologies: e.technologies.join(', ') })
    setEditing(e); setShowForm(true); setError('')
  }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(INIT) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const payload = { ...form, responsibilities: form.responsibilities.split('\n').filter(Boolean), achievements: form.achievements.split('\n').filter(Boolean), technologies: form.technologies.split(',').map(t => t.trim()).filter(Boolean) }
      if (editing) await axios.put(`/api/experience/${editing._id}`, payload, { headers: headers() })
      else         await axios.post('/api/experience', payload, { headers: headers() })
      await fetchExp(); closeForm()
    } catch (err) { setError(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this experience?')) return
    try { await axios.delete(`/api/experience/${id}`, { headers: headers() }); await fetchExp() }
    catch { setError('Failed to delete') }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Experience</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25">
          <HiPlus size={16} /> Add Experience
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editing ? 'Edit Experience' : 'New Experience'}</h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-white transition-colors"><HiX size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              {[['title','Job Title','e.g. Software Engineer',true],['company','Company','e.g. Tech Corp',true],['location','Location','e.g. Addis Ababa',false]].map(([name,label,ph,req]) => (
                <div key={name}>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{label}</label>
                  <input required={req} value={form[name]} onChange={e => setForm({ ...form, [name]: e.target.value })} placeholder={ph}
                    className="admin-input" />
                </div>
              ))}
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Type</label>
                <select value={form.employmentType} onChange={e => setForm({ ...form, employmentType: e.target.value })}
                  className="admin-select">
                  {['full-time','part-time','contract','internship','freelance'].map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
                </select>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Start Date</label>
                <input type="date" required value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-violet-500/60 transition-all" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">End Date</label>
                <input type="date" value={form.endDate} disabled={form.current} onChange={e => setForm({ ...form, endDate: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 focus:outline-none focus:border-violet-500/60 transition-all disabled:opacity-40" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.current} onChange={e => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? '' : form.endDate })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500 focus:ring-offset-0" />
              <span className="text-sm text-gray-400">Currently working here</span>
            </label>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Description *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Brief role description…"
                className="admin-input resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Responsibilities (one per line)</label>
                <textarea rows={4} value={form.responsibilities} onChange={e => setForm({ ...form, responsibilities: e.target.value })} placeholder="Built REST APIs&#10;Led code reviews"
                  className="admin-input resize-none" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Achievements (one per line)</label>
                <textarea rows={4} value={form.achievements} onChange={e => setForm({ ...form, achievements: e.target.value })} placeholder="Reduced load time by 40%&#10;Shipped 3 major features"
                  className="admin-input resize-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Technologies (comma-separated)</label>
              <input value={form.technologies} onChange={e => setForm({ ...form, technologies: e.target.value })} placeholder="React, Node.js, AWS"
                className="admin-input" />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Add Experience'}
              </button>
              <button type="button" onClick={closeForm}
                className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-white transition-all">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* List */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
          <p className="text-sm mb-3">No experience yet</p>
          <button onClick={openNew} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"><HiPlus size={12} /> Add your first role</button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <motion.div key={exp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors group">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white">{exp.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full border font-mono capitalize ${TYPE_COLORS[exp.employmentType] || ''}`}>{exp.employmentType?.replace('-',' ')}</span>
                    {exp.current && <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">Current</span>}
                  </div>
                  <p className="text-violet-300 text-sm font-medium">{exp.company}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                    {exp.location && <span className="flex items-center gap-1"><HiLocationMarker size={12} />{exp.location}</span>}
                    <span>{fmt(exp.startDate)} — {fmt(exp.endDate)}</span>
                  </div>
                  {exp.technologies?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {exp.technologies.map(t => <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">{t}</span>)}
                    </div>
                  )}
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                  <button onClick={() => openEdit(exp)} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all" aria-label="Edit"><HiPencil size={14} /></button>
                  <button onClick={() => handleDelete(exp._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" aria-label="Delete"><HiTrash size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminExperience() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Experience">
        <ExperienceContent />
      </AdminLayout>
    </AuthProtection>
  )
}
