import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiXCircle, HiArrowLeft } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'
import ImageUploadField from '@/components/Admin/ImageUploadField'

const LABEL = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2"

const INIT = {
  title: '', slug: '', type: 'post', content: '', excerpt: '',
  featuredImage: '', status: 'draft', language: 'en',
  tags: '', categories: '',
  seo: { metaTitle: '', metaDescription: '', keywords: '' }
}

function NewContentForm() {
  const [form, setForm]       = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const router = useRouter()

  // Auto-generate slug from title
  useEffect(() => {
    if (form.title && !form.slug) {
      setForm(prev => ({
        ...prev,
        slug: form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      }))
    }
  }, [form.title])

  const set = (name, value) => {
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setForm(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }))
    } else {
      setForm(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleChange = (e) => set(e.target.name, e.target.value)

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setError('')
    try {
      const token = localStorage.getItem('token')
      const payload = {
        ...form,
        tags:       form.tags       ? form.tags.split(',').map(t => t.trim()).filter(Boolean)       : [],
        categories: form.categories ? form.categories.split(',').map(c => c.trim()).filter(Boolean) : [],
        seo: {
          ...form.seo,
          keywords: form.seo.keywords ? form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) : []
        }
      }
      await axios.post('/api/content', payload, { headers: { Authorization: `Bearer ${token}` } })
      router.push('/admin/content')
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Failed to create content')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/content" className="p-2 rounded-xl border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all">
          <HiArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">CMS</p>
          <h1 className="text-2xl font-bold text-white">New Content</h1>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
          <HiXCircle size={16} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Basic Info</h2>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className={LABEL}>Title *</label>
              <input id="title" name="title" required value={form.title} onChange={handleChange}
                placeholder="My awesome post" className="admin-input" />
            </div>
            <div>
              <label htmlFor="slug" className={LABEL}>Slug *</label>
              <input id="slug" name="slug" required value={form.slug} onChange={handleChange}
                placeholder="my-awesome-post" className="admin-input font-mono" />
            </div>
            <div>
              <label htmlFor="type" className={LABEL}>Type *</label>
              <select id="type" name="type" required value={form.type} onChange={handleChange} className="admin-select">
                <option value="post">Blog Post</option>
                <option value="page">Page</option>
                <option value="service">Service</option>
                <option value="testimonial">Testimonial</option>
                <option value="project">Project</option>
                <option value="skill">Skill</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={LABEL}>Status *</label>
              <select id="status" name="status" required value={form.status} onChange={handleChange} className="admin-select">
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label htmlFor="language" className={LABEL}>Language</label>
              <select id="language" name="language" value={form.language} onChange={handleChange} className="admin-select">
                <option value="en">English</option>
                <option value="am">Amharic</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="zh">Chinese</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <ImageUploadField
                label="Featured Image"
                value={form.featuredImage}
                folder="content"
                onError={setError}
                onChange={({ url }) => set('featuredImage', url)}
              />
            </div>
          </div>
        </motion.div>

        {/* Content body */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Content</h2>

          <div>
            <label htmlFor="excerpt" className={LABEL}>Excerpt</label>
            <textarea id="excerpt" name="excerpt" rows={2} value={form.excerpt} onChange={handleChange}
              placeholder="Short summary shown in listings…" className="admin-input resize-none" />
          </div>
          <div>
            <label htmlFor="content" className={LABEL}>Body * <span className="text-gray-600 normal-case font-sans">(HTML supported)</span></label>
            <textarea id="content" name="content" required rows={14} value={form.content} onChange={handleChange}
              placeholder="Write your content here…" className="admin-input resize-y font-mono text-xs leading-relaxed" />
          </div>
        </motion.div>

        {/* Tags & categories */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Organisation</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tags" className={LABEL}>Tags <span className="text-gray-600 normal-case font-sans">(comma-separated)</span></label>
              <input id="tags" name="tags" value={form.tags} onChange={handleChange}
                placeholder="react, tutorial, web" className="admin-input" />
            </div>
            <div>
              <label htmlFor="categories" className={LABEL}>Categories <span className="text-gray-600 normal-case font-sans">(comma-separated)</span></label>
              <input id="categories" name="categories" value={form.categories} onChange={handleChange}
                placeholder="development, design" className="admin-input" />
            </div>
          </div>
        </motion.div>

        {/* SEO */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">SEO</h2>
          <div>
            <label htmlFor="metaTitle" className={LABEL}>Meta Title <span className="text-gray-600 normal-case font-sans">(max 60)</span></label>
            <input id="metaTitle" name="seo.metaTitle" maxLength={60} value={form.seo.metaTitle} onChange={handleChange}
              placeholder="Page title for search engines" className="admin-input" />
          </div>
          <div>
            <label htmlFor="metaDescription" className={LABEL}>Meta Description <span className="text-gray-600 normal-case font-sans">(max 160)</span></label>
            <textarea id="metaDescription" name="seo.metaDescription" maxLength={160} rows={2} value={form.seo.metaDescription} onChange={handleChange}
              placeholder="Description shown in search results…" className="admin-input resize-none" />
          </div>
          <div>
            <label htmlFor="keywords" className={LABEL}>Keywords <span className="text-gray-600 normal-case font-sans">(comma-separated)</span></label>
            <input id="keywords" name="seo.keywords" value={form.seo.keywords} onChange={handleChange}
              placeholder="react, portfolio, developer" className="admin-input" />
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50">
            {loading ? 'Publishing…' : form.status === 'published' ? 'Publish' : 'Save Draft'}
          </button>
          <Link href="/admin/content"
            className="px-6 py-2.5 rounded-xl border border-white/10 text-gray-400 text-sm hover:border-white/20 hover:text-white transition-all">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default function AdminNewContent() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="New Content">
        <NewContentForm />
      </AdminLayout>
    </AuthProtection>
  )
}
