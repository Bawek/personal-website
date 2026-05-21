import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import api from '@/lib/api'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiXCircle, HiCheckCircle, HiArrowLeft } from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'
import ImageUploadField from '@/components/Admin/ImageUploadField'

const LABEL = "block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2"

function EditContentForm() {
  const router = useRouter()
  const { id }  = router.query

  const [form, setForm]       = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [status, setStatus]   = useState(null) // 'ok' | 'err'
  const [errMsg, setErrMsg]   = useState('')

  const headers = () => ({ Authorization: `Bearer ${localStorage.getItem('token')}` })

  useEffect(() => {
    if (!id) return
    const fetch = async () => {
      try {
        const { data } = await api.get(`/content/${id}`, { headers: headers() })
        const c = data
        setForm({
          title:        c.title        || '',
          slug:         c.slug         || '',
          type:         c.type         || 'post',
          content:      c.content      || '',
          excerpt:      c.excerpt      || '',
          featuredImage:c.featuredImage|| '',
          status:       c.status       || 'draft',
          language:     c.language     || 'en',
          tags:         (c.tags        || []).join(', '),
          categories:   (c.categories  || []).join(', '),
          seo: {
            metaTitle:       c.seo?.metaTitle       || '',
            metaDescription: c.seo?.metaDescription || '',
            keywords:        (c.seo?.keywords || []).join(', '),
          }
        })
      } catch { setErrMsg('Failed to load content') }
      finally { setLoading(false) }
    }
    fetch()
  }, [id])

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
    e.preventDefault(); setSaving(true); setStatus(null)
    try {
      const payload = {
        ...form,
        tags:       form.tags       ? form.tags.split(',').map(t => t.trim()).filter(Boolean)       : [],
        categories: form.categories ? form.categories.split(',').map(c => c.trim()).filter(Boolean) : [],
        seo: {
          ...form.seo,
          keywords: form.seo.keywords ? form.seo.keywords.split(',').map(k => k.trim()).filter(Boolean) : []
        }
      }
      await api.put(`/content/${id}`, payload, { headers: headers() })
      setStatus('ok')
    } catch (err) {
      setErrMsg(err.response?.data?.message || 'Failed to save')
      setStatus('err')
    } finally { setSaving(false) }
  }

  if (loading) return (
    <div className="flex justify-center py-16">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  if (!form) return (
    <div className="text-center py-16 text-gray-500">
      <p>{errMsg || 'Content not found'}</p>
      <Link href="/admin/content" className="mt-4 text-violet-400 hover:text-violet-300 text-sm">← Back to content</Link>
    </div>
  )

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/content" className="p-2 rounded-xl border border-white/10 text-gray-500 hover:text-white hover:border-white/20 transition-all">
          <HiArrowLeft size={16} />
        </Link>
        <div>
          <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-1">CMS</p>
          <h1 className="text-2xl font-bold text-white truncate max-w-md">{form.title || 'Edit Content'}</h1>
        </div>
      </div>

      {status === 'ok'  && <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm"><HiCheckCircle size={16} /> Saved successfully</div>}
      {status === 'err' && <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"><HiXCircle size={16} /> {errMsg}</div>}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Basic info */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Basic Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className={LABEL}>Title *</label>
              <input id="title" name="title" required value={form.title} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label htmlFor="slug" className={LABEL}>Slug *</label>
              <input id="slug" name="slug" required value={form.slug} onChange={handleChange} className="admin-input font-mono" />
            </div>
            <div>
              <label htmlFor="type" className={LABEL}>Type</label>
              <select id="type" name="type" value={form.type} onChange={handleChange} className="admin-select">
                <option value="post">Blog Post</option>
                <option value="page">Page</option>
                <option value="service">Service</option>
                <option value="testimonial">Testimonial</option>
                <option value="project">Project</option>
                <option value="skill">Skill</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className={LABEL}>Status</label>
              <select id="status" name="status" value={form.status} onChange={handleChange} className="admin-select">
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
                onError={setErrMsg}
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
            <textarea id="excerpt" name="excerpt" rows={2} value={form.excerpt} onChange={handleChange} className="admin-input resize-none" />
          </div>
          <div>
            <label htmlFor="content" className={LABEL}>Body * <span className="text-gray-600 normal-case font-sans">(HTML supported)</span></label>
            <textarea id="content" name="content" required rows={14} value={form.content} onChange={handleChange}
              className="admin-input resize-y font-mono text-xs leading-relaxed" />
          </div>
        </motion.div>

        {/* Tags & categories */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">Organisation</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="tags" className={LABEL}>Tags</label>
              <input id="tags" name="tags" value={form.tags} onChange={handleChange} placeholder="react, tutorial" className="admin-input" />
            </div>
            <div>
              <label htmlFor="categories" className={LABEL}>Categories</label>
              <input id="categories" name="categories" value={form.categories} onChange={handleChange} placeholder="development" className="admin-input" />
            </div>
          </div>
        </motion.div>

        {/* SEO */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-sm font-mono text-gray-400 uppercase tracking-widest">SEO</h2>
          <div>
            <label htmlFor="metaTitle" className={LABEL}>Meta Title</label>
            <input id="metaTitle" name="seo.metaTitle" maxLength={60} value={form.seo.metaTitle} onChange={handleChange} className="admin-input" />
          </div>
          <div>
            <label htmlFor="metaDescription" className={LABEL}>Meta Description</label>
            <textarea id="metaDescription" name="seo.metaDescription" maxLength={160} rows={2} value={form.seo.metaDescription} onChange={handleChange} className="admin-input resize-none" />
          </div>
          <div>
            <label htmlFor="keywords" className={LABEL}>Keywords</label>
            <input id="keywords" name="seo.keywords" value={form.seo.keywords} onChange={handleChange} placeholder="react, portfolio" className="admin-input" />
          </div>
        </motion.div>

        <div className="flex items-center gap-3 pt-2">
          <button type="submit" disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25 disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
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

export default function AdminEditContent() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Edit Content">
        <EditContentForm />
      </AdminLayout>
    </AuthProtection>
  )
}
