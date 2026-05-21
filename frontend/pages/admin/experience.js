import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiPencil, HiTrash, HiPlus, HiX, HiLocationMarker } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'
import { ENTRY_TYPES, EMPLOYMENT_TYPES, getEntryMeta } from '@/lib/timeline'

const INIT = {
  entryType: 'work',
  title: '',
  company: '',
  location: '',
  employmentType: 'full-time',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
  responsibilities: '',
  achievements: '',
  technologies: '',
  fieldOfStudy: '',
  degree: '',
  thesisTopic: '',
  credentialId: '',
  credentialUrl: '',
  eventUrl: '',
}

function ExperienceContent() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INIT)
  const [showForm, setShowForm] = useState(false)
  const [listFilter, setListFilter] = useState('all')

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })
  const meta = getEntryMeta(form.entryType)
  const isWork = form.entryType === 'work'

  const fetchExp = async () => {
    try {
      const { data } = await api.get('/experience', { headers: headers() })
      setExperiences(data.experiences || [])
    } catch {
      setError('Failed to load')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchExp() }, [])

  const openNew = (type = 'work') => {
    setForm({ ...INIT, entryType: type })
    setEditing(null)
    setShowForm(true)
    setError('')
  }

  const openEdit = (e) => {
    setForm({
      entryType: e.entryType || 'work',
      title: e.title,
      company: e.company,
      location: e.location || '',
      employmentType: e.employmentType || 'full-time',
      startDate: new Date(e.startDate).toISOString().split('T')[0],
      endDate: e.endDate ? new Date(e.endDate).toISOString().split('T')[0] : '',
      current: e.current || false,
      description: e.description,
      responsibilities: (e.responsibilities || []).join('\n'),
      achievements: (e.achievements || []).join('\n'),
      technologies: (e.technologies || []).join(', '),
      fieldOfStudy: e.fieldOfStudy || '',
      degree: e.degree || '',
      thesisTopic: e.thesisTopic || '',
      credentialId: e.credentialId || '',
      credentialUrl: e.credentialUrl || '',
      eventUrl: e.eventUrl || '',
    })
    setEditing(e)
    setShowForm(true)
    setError('')
  }

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(INIT) }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
        achievements: form.achievements.split('\n').map((s) => s.trim()).filter(Boolean),
        technologies: form.technologies.split(',').map((t) => t.trim()).filter(Boolean),
      }
      if (editing) await api.put(`/experience/${editing.slug}`, payload, { headers: headers() })
      else await api.post('/experience', payload, { headers: headers() })
      await fetchExp()
      closeForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Delete this entry?')) return
    try {
      await api.delete(`/experience/${slug}`, { headers: headers() })
      await fetchExp()
    } catch {
      setError('Failed to delete')
    }
  }

  const fmt = (d) => (d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present')

  const filteredList = listFilter === 'all'
    ? experiences
    : experiences.filter((e) => (e.entryType || 'work') === listFilter)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Timeline</h1>
          <p className="text-sm text-gray-500 mt-1">Work, education, certifications, awards & talks</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.entries(ENTRY_TYPES).map(([key, t]) => (
            <button
              key={key}
              type="button"
              onClick={() => openNew(key)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-white/10 text-xs text-gray-400 hover:text-white hover:border-violet-500/40 transition-all"
            >
              <HiPlus size={12} /> {t.shortLabel}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editing ? `Edit ${meta.label}` : `New ${meta.label}`}</h2>
            <button type="button" onClick={closeForm} className="text-gray-500 hover:text-white"><HiX size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Entry Type</label>
              <select
                value={form.entryType}
                onChange={(e) => setForm({ ...form, entryType: e.target.value })}
                className="admin-select"
              >
                {Object.entries(ENTRY_TYPES).map(([k, t]) => (
                  <option key={k} value={k}>{t.label}</option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{meta.titleLabel} *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{meta.orgLabel} *</label>
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="admin-input" />
              </div>
            </div>

            {form.entryType === 'education' && (
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Field of Study</label>
                  <input value={form.fieldOfStudy} onChange={(e) => setForm({ ...form, fieldOfStudy: e.target.value })} placeholder="Computer Science" className="admin-input" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Degree Type</label>
                  <input value={form.degree} onChange={(e) => setForm({ ...form, degree: e.target.value })} placeholder="BSc, MSc" className="admin-input" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Thesis Topic</label>
                  <input value={form.thesisTopic} onChange={(e) => setForm({ ...form, thesisTopic: e.target.value })} className="admin-input" />
                </div>
              </div>
            )}

            {form.entryType === 'certification' && (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Credential ID</label>
                  <input value={form.credentialId} onChange={(e) => setForm({ ...form, credentialId: e.target.value })} className="admin-input" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Verification URL</label>
                  <input type="text" value={form.credentialUrl} onChange={(e) => setForm({ ...form, credentialUrl: e.target.value })} placeholder="https://…" className="admin-input" />
                </div>
              </div>
            )}

            {form.entryType === 'talk' && (
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Event URL</label>
                <input type="text" value={form.eventUrl} onChange={(e) => setForm({ ...form, eventUrl: e.target.value })} placeholder="https://…" className="admin-input" />
              </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Location</label>
                <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="admin-input" />
              </div>
              {isWork && (
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Employment Type</label>
                  <select value={form.employmentType} onChange={(e) => setForm({ ...form, employmentType: e.target.value })} className="admin-select">
                    {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Start Date *</label>
                <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">{form.entryType === 'education' ? 'Graduation Date' : 'End Date'}</label>
                <input type="date" value={form.endDate} disabled={isWork && form.current} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="admin-input disabled:opacity-40" />
              </div>
            </div>

            {isWork && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? '' : form.endDate })} className="w-4 h-4 rounded" />
                <span className="text-sm text-gray-400">Currently working here</span>
              </label>
            )}

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Description *</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="admin-input resize-none" />
            </div>

            {isWork ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Responsibilities (one per line)</label>
                  <textarea rows={4} value={form.responsibilities} onChange={(e) => setForm({ ...form, responsibilities: e.target.value })} className="admin-input resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Achievements (one per line)</label>
                  <textarea rows={4} value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} className="admin-input resize-none" />
                </div>
              </div>
            ) : (
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Highlights (one per line)</label>
                <textarea rows={3} value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} className="admin-input resize-none" />
              </div>
            )}

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Technologies / Tags (comma-separated)</label>
              <input value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="admin-input" />
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Add Entry'}
              </button>
              <button type="button" onClick={closeForm} className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      <div className="flex flex-wrap gap-2">
        {['all', ...Object.keys(ENTRY_TYPES)].map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setListFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-mono border ${listFilter === f ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'border-white/10 text-gray-500'}`}
          >
            {f === 'all' ? 'All' : ENTRY_TYPES[f].shortLabel}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>
      ) : filteredList.length === 0 ? (
        <div className="text-center py-16 text-gray-600 border border-white/5 rounded-2xl">
          <p className="text-sm mb-3">No entries yet</p>
          <button type="button" onClick={() => openNew('education')} className="text-xs text-violet-400">+ Add education</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredList.map((exp) => {
            const m = getEntryMeta(exp.entryType || 'work')
            return (
              <motion.div key={exp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 group">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-2 py-0.5 text-xs rounded-full border font-mono ${m.color}`}>{m.shortLabel}</span>
                      {exp.current && <span className="text-xs text-emerald-400 font-mono">Current</span>}
                    </div>
                    <h3 className="font-semibold text-white">{exp.title}</h3>
                    <p className="text-violet-300 text-sm">{exp.company}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-500">
                      {exp.location && <span className="flex items-center gap-1"><HiLocationMarker size={12} />{exp.location}</span>}
                      <span>{fmt(exp.startDate)} — {fmt(exp.endDate)}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button type="button" onClick={() => openEdit(exp)} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400" aria-label="Edit"><HiPencil size={14} /></button>
                    <button type="button" onClick={() => handleDelete(exp.slug)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400" aria-label="Delete"><HiTrash size={14} /></button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminExperience() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Timeline">
        <ExperienceContent />
      </AdminLayout>
    </AuthProtection>
  )
}
