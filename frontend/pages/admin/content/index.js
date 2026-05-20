import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiPlus, HiPencil, HiTrash, HiSearch, HiEye, HiDocumentText } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const TYPE_COLORS = {
  page:        'bg-blue-500/10    text-blue-400    border-blue-500/20',
  post:        'bg-violet-500/10  text-violet-400  border-violet-500/20',
  project:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  service:     'bg-cyan-500/10    text-cyan-400    border-cyan-500/20',
  testimonial: 'bg-pink-500/10    text-pink-400    border-pink-500/20',
  skill:       'bg-amber-500/10   text-amber-400   border-amber-500/20',
}

const STATUS_COLORS = {
  published: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  draft:     'bg-amber-500/10   text-amber-400   border-amber-500/20',
  archived:  'bg-gray-500/10    text-gray-400    border-gray-500/20',
}

function ContentList() {
  const [items, setItems]         = useState([])
  const [loading, setLoading]     = useState(true)
  const [pagination, setPagination] = useState({})
  const [filters, setFilters]     = useState({ type: '', status: 'published', search: '', page: 1, limit: 10 })

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  const fetchContent = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      Object.entries(filters).forEach(([k, v]) => { if (v) params.append(k, v) })
      const { data } = await axios.get(`/api/content?${params}`, { headers: headers() })
      setItems(data.contents || [])
      setPagination(data.pagination || {})
    } catch { setItems([]) }
    finally { setLoading(false) }
  }, [filters])

  useEffect(() => { fetchContent() }, [fetchContent])

  const setFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value, page: key === 'page' ? value : 1 }))

  const handleDelete = async (id) => {
    if (!confirm('Delete this content permanently?')) return
    try { await axios.delete(`/api/content/${id}`, { headers: headers() }); fetchContent() }
    catch { alert('Failed to delete') }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">CMS</p>
          <h1 className="text-2xl font-bold text-white">Content</h1>
          <p className="text-sm text-gray-500 mt-1">Blog posts, pages, services, testimonials</p>
        </div>
        <Link href="/admin/content/new"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25">
          <HiPlus size={16} /> New Content
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <HiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilter('search', e.target.value)}
              placeholder="Search…"
              className="admin-input pl-9"
            />
          </div>

          {/* Type */}
          <select value={filters.type} onChange={e => setFilter('type', e.target.value)} className="admin-select">
            <option value="">All Types</option>
            <option value="page">Page</option>
            <option value="post">Blog Post</option>
            <option value="project">Project</option>
            <option value="service">Service</option>
            <option value="testimonial">Testimonial</option>
            <option value="skill">Skill</option>
          </select>

          {/* Status */}
          <select value={filters.status} onChange={e => setFilter('status', e.target.value)} className="admin-select">
            <option value="">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>

          {/* Per page */}
          <select value={filters.limit} onChange={e => setFilter('limit', e.target.value)} className="admin-select">
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600">
            <HiDocumentText size={32} className="mb-3 opacity-40" />
            <p className="text-sm mb-1">No content found</p>
            <p className="text-xs text-gray-700">Try changing the filters or create new content</p>
            <Link href="/admin/content/new" className="mt-4 text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
              <HiPlus size={12} /> Create your first content
            </Link>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-5 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-widest">Title</th>
                    <th className="px-5 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-widest">Type</th>
                    <th className="px-5 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-widest">Status</th>
                    <th className="px-5 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-widest">Lang</th>
                    <th className="px-5 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-widest">Date</th>
                    <th className="px-5 py-3 text-left text-xs font-mono text-gray-500 uppercase tracking-widest">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {items.map((item) => (
                    <tr key={item._id} className="hover:bg-white/3 transition-colors group">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-medium text-gray-200 truncate max-w-[220px]">{item.title}</p>
                        <p className="text-xs text-gray-600 font-mono mt-0.5">/{item.slug}</p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-mono capitalize ${TYPE_COLORS[item.type] || ''}`}>
                          {item.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2 py-0.5 text-xs rounded-full border font-mono capitalize ${STATUS_COLORS[item.status] || ''}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500 font-mono uppercase">{item.language}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-xs text-gray-500">{new Date(item.createdAt).toLocaleDateString()}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link href={`/admin/content/edit/${item._id}`}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"
                            aria-label="Edit">
                            <HiPencil size={14} />
                          </Link>
                          <button onClick={() => handleDelete(item._id)}
                            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            aria-label="Delete">
                            <HiTrash size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-white/5">
              {items.map((item) => (
                <div key={item._id} className="p-4 flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-200 truncate">{item.title}</p>
                    <p className="text-xs text-gray-600 font-mono mt-0.5">/{item.slug}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`px-2 py-0.5 text-xs rounded-full border font-mono capitalize ${TYPE_COLORS[item.type] || ''}`}>{item.type}</span>
                      <span className={`px-2 py-0.5 text-xs rounded-full border font-mono capitalize ${STATUS_COLORS[item.status] || ''}`}>{item.status}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <Link href={`/admin/content/edit/${item._id}`} className="p-1.5 rounded-lg text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all"><HiPencil size={14} /></Link>
                    <button onClick={() => handleDelete(item._id)} className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"><HiTrash size={14} /></button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-white/5">
                <p className="text-xs text-gray-500">
                  {(pagination.page - 1) * pagination.limit + 1}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
                </p>
                <div className="flex gap-1">
                  <button onClick={() => setFilter('page', pagination.page - 1)} disabled={pagination.page === 1}
                    className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-400 hover:border-white/20 hover:text-white transition-all disabled:opacity-30">
                    Prev
                  </button>
                  {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setFilter('page', p)}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-all ${p === pagination.page ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-white'}`}>
                      {p}
                    </button>
                  ))}
                  <button onClick={() => setFilter('page', pagination.page + 1)} disabled={pagination.page === pagination.pages}
                    className="px-3 py-1.5 text-xs rounded-lg border border-white/10 text-gray-400 hover:border-white/20 hover:text-white transition-all disabled:opacity-30">
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default function AdminContent() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Content">
        <ContentList />
      </AdminLayout>
    </AuthProtection>
  )
}
