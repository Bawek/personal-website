'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiPencil, HiTrash, HiPlus, HiX, HiLocationMarker } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INIT = {
  title: '',
  company: '',
  location: '',
  employmentType: 'full-time',
  startDate: '',
  endDate: '',
  current: false,
  description: '',
}

function ExperienceContent() {
  const [experiences, setExperiences] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INIT)
  const [showForm, setShowForm] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchExperience = async () => {
    try {
      const { data } = await api.get('/experience', { headers: headers() })
      setExperiences(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Error fetching:', err)
      setError('Failed to load experience')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchExperience() }, [])

  const openNew = () => {
    setForm(INIT)
    setEditing(null)
    setShowForm(true)
    setError('')
  }

  const closeForm = () => {
    setShowForm(false)
    setEditing(null)
    setForm(INIT)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (editing) {
        await api.put(`/experience/${editing._id}`, form, { headers: headers() })
      } else {
        await api.post('/experience', form, { headers: headers() })
      }
      await fetchExperience()
      closeForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this entry?')) return
    try {
      await api.delete(`/experience/${id}`, { headers: headers() })
      await fetchExperience()
    } catch {
      setError('Failed to delete')
    }
  }

  const fmt = (d) => d ? new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Timeline</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25">
          <HiPlus size={16} /> Add Entry
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editing ? 'Edit Entry' : 'New Entry'}</h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-white"><HiX size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Company *</label>
                <input required value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="admin-input" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="City, Country" className="admin-input" />
            </div>

            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Description *</label>
              <textarea required rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="resize-none admin-input" />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Start Date *</label>
                <input type="date" required value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">End Date</label>
                <input type="date" value={form.endDate} disabled={form.current} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="admin-input disabled:opacity-40" />
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked, endDate: e.target.checked ? '' : form.endDate })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-400">Currently working here</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Add Entry'}
              </button>
              <button type="button" onClick={closeForm} className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
          <p className="text-sm mb-3">No entries yet</p>
          <button onClick={openNew} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"><HiPlus size={12} /> Add your first entry</button>
        </div>
      ) : (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <motion.div key={exp._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:border-violet-500/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white">{exp.title}</h3>
                  <p className="text-violet-300 text-sm">{exp.company}</p>
                  {exp.location && (
                    <p className="flex items-center gap-1.5 text-xs text-gray-500 mt-1">
                      <HiLocationMarker size={12} />
                      {exp.location}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-500">{fmt(exp.startDate)} — {fmt(exp.endDate)}</span>
                    {exp.current && <span className="text-xs text-emerald-400 font-mono">Current</span>}
                  </div>
                </div>
                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => {
                    setForm({
                      title: exp.title,
                      company: exp.company,
                      location: exp.location,
                      employmentType: exp.employmentType || 'full-time',
                      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                      current: exp.current || false,
                      description: exp.description,
                    })
                    setEditing(exp)
                    setShowForm(true)
                  }} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
                    <HiPencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(exp._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all">
                    <HiTrash size={14} />
                  </button>
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
      <AdminLayout title="Timeline">
        <ExperienceContent />
      </AdminLayout>
    </AuthProtection>
  )
}
