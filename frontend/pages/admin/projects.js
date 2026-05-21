import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiPencil, HiTrash, HiStar, HiPlus, HiX, HiExternalLink } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'
import ImageUploadField from '@/components/Admin/ImageUploadField'

const INIT = { title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', imageUrl: '', imageFile: null, featured: false }

function ProjectsContent() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading]   = useState(true)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')
  const [editing, setEditing]   = useState(null)
  const [form, setForm]         = useState(INIT)
  const [showForm, setShowForm] = useState(false)

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchProjects = async () => {
    try { const { data } = await api.get('/projects', { headers: headers() }); setProjects(data.projects || []) }
    catch { setError('Failed to load projects') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchProjects() }, [])

  const openNew  = () => { setForm(INIT); setEditing(null); setShowForm(true); setError('') }
  const openEdit = (p) => {
    setForm({ title: p.title, description: p.description, techStack: p.techStack.join(', '), liveUrl: p.liveUrl || '', githubUrl: p.githubUrl || '', imageUrl: p.imageUrl || '', imageFile: null, featured: p.featured || false })
    setEditing(p); setShowForm(true); setError('')
  }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(INIT) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const token = localStorage.getItem('token')
      const projectData = { title: form.title, description: form.description, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean), liveUrl: form.liveUrl, githubUrl: form.githubUrl, featured: form.featured }
      let body, hdrs = { Authorization: `Bearer ${token}` }
      if (form.imageFile) {
        body = new FormData(); body.append('data', JSON.stringify(projectData)); body.append('image', form.imageFile)
      } else {
        projectData.imageUrl = form.imageUrl; body = projectData
      }
      if (editing) await api.put(`/projects/${editing.slug}`, body, { headers: hdrs })
      else         await api.post('/projects', body, { headers: hdrs })
      await fetchProjects(); closeForm()
    } catch (err) { setError(err.response?.data?.message || 'Failed to save') }
    finally { setSaving(false) }
  }

  const handleDelete = async (slug) => {
    if (!confirm('Delete this project?')) return
    try { await api.delete(`/projects/${slug}`, { headers: headers() }); await fetchProjects() }
    catch { setError('Failed to delete') }
  }

  const toggleFeatured = async (slug) => {
    try { await api.patch(`/projects/${slug}/toggle-featured`, {}, { headers: headers() }); await fetchProjects() }
    catch { setError('Failed to update') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Projects</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25">
          <HiPlus size={16} /> Add Project
        </button>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {/* Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editing ? 'Edit Project' : 'New Project'}</h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-white transition-colors"><HiX size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Project name"
                  className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Tech Stack</label>
                <input value={form.techStack} onChange={e => setForm({ ...form, techStack: e.target.value })} placeholder="React, Node.js, MongoDB"
                  className="admin-input" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Description *</label>
              <textarea required rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Describe your project…"
                className="admin-input resize-none" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Live URL</label>
                <input type="url" value={form.liveUrl} onChange={e => setForm({ ...form, liveUrl: e.target.value })} placeholder="https://…"
                  className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">GitHub URL</label>
                <input type="url" value={form.githubUrl} onChange={e => setForm({ ...form, githubUrl: e.target.value })} placeholder="https://github.com/…"
                  className="admin-input" />
              </div>
            </div>
            <ImageUploadField
              label="Project Image"
              value={form.imageUrl}
              file={form.imageFile}
              folder="projects"
              autoUpload
              onError={setError}
              onChange={({ url, file }) => setForm({ ...form, imageUrl: url, imageFile: file })}
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500 focus:ring-offset-0" />
              <span className="text-sm text-gray-400">Mark as featured</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Add Project'}
              </button>
              <button type="button" onClick={closeForm}
                className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-white transition-all">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Projects list */}
      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
          <p className="text-sm mb-3">No projects yet</p>
          <button onClick={openNew} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"><HiPlus size={12} /> Add your first project</button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <motion.div key={p._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors group">
              {/* Image */}
              <div className="h-36 bg-surface-2 overflow-hidden relative">
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-violet-900/30 to-pink-900/30 flex items-center justify-center">
                    <span className="text-3xl font-bold text-white/10">{p.title?.charAt(0)}</span>
                  </div>
                )}
                {p.featured && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-xs rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono flex items-center gap-1">
                    <HiStar size={10} /> Featured
                  </span>
                )}
              </div>
              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white text-sm mb-1 truncate">{p.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.description}</p>
                <div className="flex flex-wrap gap-1 mb-3">
                  {p.techStack?.slice(0, 3).map(t => (
                    <span key={t} className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">{t}</span>
                  ))}
                  {p.techStack?.length > 3 && <span className="px-2 py-0.5 text-xs text-gray-600">+{p.techStack.length - 3}</span>}
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-white/5">
                  <div className="flex gap-2">
                    {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-violet-400 transition-colors" aria-label="Live demo"><HiExternalLink size={15} /></a>}
                    {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-gray-500 hover:text-white transition-colors" aria-label="GitHub"><FaGithub size={14} /></a>}
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => toggleFeatured(p.slug)} className={`p-1.5 rounded-lg transition-all ${p.featured ? 'text-amber-400 bg-amber-500/10' : 'text-gray-600 hover:text-amber-400 hover:bg-amber-500/10'}`} aria-label="Toggle featured"><HiStar size={14} /></button>
                    <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all" aria-label="Edit"><HiPencil size={14} /></button>
                    <button onClick={() => handleDelete(p.slug)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all" aria-label="Delete"><HiTrash size={14} /></button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminProjects() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Projects">
        <ProjectsContent />
      </AdminLayout>
    </AuthProtection>
  )
}
