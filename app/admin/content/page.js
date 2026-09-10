'use client'

import { useState, useEffect } from 'react'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiPencil, HiTrash, HiPlus, HiX, HiSearch, HiEye, HiEyeOff, HiDocumentText } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const INIT = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  type: 'post',
  status: 'draft',
  featured: false,
  coverImage: '',
  category: '',
  tags: ''
}

function ContentContent() {
  const [contents, setContents] = useState([])
  const [filteredContents, setFilteredContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(INIT)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('post')
  const [filterStatus, setFilterStatus] = useState('all')

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchContents = async () => {
    try {
      const { data } = await api.get('/api/content', { 
        params: { type: filterType, limit: 100 },
        headers: headers() 
      })
      setContents(data.contents || [])
      setFilteredContents(data.contents || [])
    } catch {
      setError('Failed to load content')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchContents() }, [filterType])

  useEffect(() => {
    let filtered = contents

    if (filterStatus !== 'all') {
      filtered = filtered.filter(c => c.status === filterStatus)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(c => 
        c.title?.toLowerCase().includes(query) ||
        c.excerpt?.toLowerCase().includes(query) ||
        c.category?.toLowerCase().includes(query)
      )
    }

    setFilteredContents(filtered)
  }, [searchQuery, filterStatus, contents])

  const openNew = () => { setForm(INIT); setEditing(null); setShowForm(true); setError('') }
  const openEdit = (c) => {
    setForm({ 
      title: c.title, 
      slug: c.slug, 
      excerpt: c.excerpt, 
      content: c.content, 
      type: c.type, 
      status: c.status, 
      featured: c.featured || false, 
      coverImage: c.coverImage || '', 
      category: c.category || '', 
      tags: (c.tags || []).join(', ') 
    })
    setEditing(c); setShowForm(true); setError('')
  }
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(INIT) }

  const handleSubmit = async (e) => {
    e.preventDefault(); setSaving(true); setError('')
    try {
      const contentData = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      }
      
      if (editing) {
        await api.put(`/api/content/${editing._id}`, contentData, { headers: headers() })
      } else {
        await api.post('/api/content', contentData, { headers: headers() })
      }
      await fetchContents(); closeForm()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this content?')) return
    try {
      await api.delete(`/api/content/${id}`, { headers: headers() })
      await fetchContents()
    } catch {
      setError('Failed to delete')
    }
  }

  const toggleStatus = async (id) => {
    try {
      const content = contents.find(c => c._id === id)
      await api.put(`/content/${id}`, { ...content, status: content.status === 'published' ? 'draft' : 'published' }, { headers: headers() })
      await fetchContents()
    } catch {
      setError('Failed to update')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">Manage</p>
          <h1 className="text-2xl font-bold text-white">Content</h1>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25">
          <HiPlus size={16} /> Add Content
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <HiSearch size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="Search content..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:border-violet-500/30 focus:outline-none transition-colors"
          />
        </div>
        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-violet-500/30 focus:outline-none transition-colors"
        >
          <option value="post">Posts</option>
          <option value="testimonial">Testimonials</option>
          <option value="page">Pages</option>
        </select>
        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-violet-500/30 focus:outline-none transition-colors"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {error && <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>}

      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-white">{editing ? 'Edit Content' : 'New Content'}</h2>
            <button onClick={closeForm} className="text-gray-500 hover:text-white"><HiX size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Title *</label>
                <input required value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Content title" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Slug</label>
                <input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="url-friendly-slug" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Excerpt</label>
              <textarea rows={2} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Brief description..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none" />
            </div>
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Content *</label>
              <textarea required rows={8} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Write your content here... (HTML supported)" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm resize-none font-mono" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option value="post">Post</option>
                  <option value="testimonial">Testimonial</option>
                  <option value="page">Page</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Status</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm">
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Category</label>
                <input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Category" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Cover Image URL</label>
                <input type="url" value={form.coverImage} onChange={e => setForm({ ...form, coverImage: e.target.value })} placeholder="https://..." className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
              <div>
                <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Tags (comma-separated)</label>
                <input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="react, nextjs, tutorial" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm" />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm text-gray-400">Mark as featured</span>
            </label>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold disabled:opacity-50">
                {saving ? 'Saving…' : editing ? 'Update' : 'Add Content'}
              </button>
              <button type="button" onClick={closeForm} className="px-5 py-2 rounded-xl border border-white/10 text-gray-400 text-sm">Cancel</button>
            </div>
          </form>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" /></div>
      ) : filteredContents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
          <HiDocumentText size={32} className="mb-3 opacity-40" />
          <p className="text-sm mb-3">{contents.length === 0 ? 'No content yet' : 'No content matches your filters'}</p>
          <button onClick={openNew} className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"><HiPlus size={12} /> Add your first content</button>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredContents.map((c) => (
            <motion.div key={c._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-white/20 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-white truncate">{c.title}</h3>
                    <span className={`px-2 py-0.5 text-xs rounded-full font-mono ${c.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                      {c.status}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono capitalize">
                      {c.type}
                    </span>
                    {c.featured && <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">Featured</span>}
                  </div>
                  {c.excerpt && <p className="text-sm text-gray-500 line-clamp-2 mb-2">{c.excerpt}</p>}
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    {c.category && <span className="font-mono">{c.category}</span>}
                    {c.slug && <span className="font-mono">/{c.slug}</span>}
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleStatus(c._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all" title="Toggle status">
                    {c.status === 'published' ? <HiEye size={14} /> : <HiEyeOff size={14} />}
                  </button>
                  <button onClick={() => openEdit(c)} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"><HiPencil size={14} /></button>
                  <button onClick={() => handleDelete(c._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><HiTrash size={14} /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default function AdminContent() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Content">
        <ContentContent />
      </AdminLayout>
    </AuthProtection>
  )
}
