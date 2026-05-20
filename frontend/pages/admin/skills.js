import { useState, useEffect } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiPencil, HiTrash, HiPlus, HiX } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const LEVEL_COLORS = {
  expert:       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  advanced:     'bg-violet-500/10  text-violet-400  border-violet-500/20',
  intermediate: 'bg-blue-500/10    text-blue-400    border-blue-500/20',
  beginner:     'bg-gray-500/10    text-gray-400    border-gray-500/20',
}

const INIT = { name: '', category: '', level: 'intermediate' }

function SkillsContent() {
  const [skills, setSkills]   = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm]       = useState(INIT)
  const [showForm, setShowForm] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchSkills = async () => {
    try {
      const { data } = await axios.get('/api/skills', { headers: headers() })
      setSkills(data.skills || [])
    } catch { setError('Failed to load skills') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchSkills() }, [])

  const openNew  = () => { setForm(INIT); setEditing(null); setShowForm(true); setError('') }
  const openEdit = (s) => { setForm({ name: s.name, category: s.category, level: s.level }); setEditing(s); setShowForm(true); setError('') }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(INIT) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      if (editing) await axios.put(`/api/skills/${editing.slug}`, form, { headers: headers() })
      else         await axios.post('/api/skills', form, { headers: headers() })
      await fetchSkills(); closeForm()
    } catch (err) { setError(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Delete this skill?')) return
    try { await axios.delete(`/api/skills/${slug}`, { headers: headers() }); await fetchSkills() }
    catch { setError('Failed to delete') }
  }

  const grouped = skills.reduce((acc, s) => {
    const cat = s.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(s)
    return acc
  }, {})

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Skills</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25">
          <HiPlus size={16} /> Add Skill
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {/* Slide-in form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editing ? 'Edit Skill' : 'New Skill'}</h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-white transition-colors"><HiX size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Name</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. React" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Category</label>
              <select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                className="admin-select">
                <option value="">Select…</option>
                {['frontend','backend','database','tools','other'].map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                className="admin-select">
                {['beginner','intermediate','advanced','expert'].map(l => <option key={l} value={l} className="capitalize">{l}</option>)}
              </select>
            </div>
            <div className="sm:col-span-3 flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Add Skill'}
              </button>
              <button type="button" onClick={closeForm}
                className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-white transition-all">
                Cancel
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Skills grouped by category */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
          <p className="text-sm mb-3">No skills yet</p>
          <button onClick={openNew} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"><HiPlus size={12} /> Add your first skill</button>
        </div>
      ) : (
        Object.entries(grouped).map(([cat, items]) => (
          <div key={cat}>
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-3 capitalize">{cat}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
              {items.map((skill) => (
                <motion.div key={skill._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between hover:border-white/20 transition-colors group">
                  <div>
                    <p className="text-sm font-medium text-gray-200">{skill.name}</p>
                    <span className={`inline-block mt-1.5 px-2 py-0.5 text-xs rounded-full border font-mono capitalize ${LEVEL_COLORS[skill.level] || LEVEL_COLORS.beginner}`}>
                      {skill.level}
                    </span>
                  </div>
                  <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(skill)} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all" aria-label="Edit"><HiPencil size={14} /></button>
                    <button onClick={() => handleDelete(skill.slug)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" aria-label="Delete"><HiTrash size={14} /></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default function AdminSkills() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Skills">
        <SkillsContent />
      </AdminLayout>
    </AuthProtection>
  )
}
