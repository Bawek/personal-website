import Link from 'next/link'
import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import Navbar from '@/components/Navbar/Navbar'
import SeoHead from '@/components/SeoHead/SeoHead'
import { HiArrowRight, HiTag, HiCalendar, HiEye, HiClock, HiSearch } from 'react-icons/hi'

function readingTime(text = '') {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

function PostCard({ item, index }) {
  const mins = readingTime(item.content || item.excerpt)
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass-card p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300 group"
    >
      {item.featuredImage && (
        <div className="h-44 rounded-xl overflow-hidden mb-5 -mx-1">
          <img src={item.featuredImage} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2 mb-3">
        {item.tags?.slice(0, 2).map((tag) => (
          <span key={tag} className="flex items-center gap-1 text-xs text-gray-500">
            <HiTag size={10} />
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">{item.title}</h2>

      {item.excerpt && <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">{item.excerpt}</p>}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <HiCalendar size={12} />
            {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span className="flex items-center gap-1">
            <HiClock size={12} />
            {mins} min
          </span>
          {item.metadata?.views > 0 && (
            <span className="flex items-center gap-1">
              <HiEye size={12} />
              {item.metadata.views}
            </span>
          )}
        </div>
        <Link href={`/blog/${item.slug}`} className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
          Read more <HiArrowRight size={12} />
        </Link>
      </div>
    </motion.article>
  )
}

export default function BlogIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [tagFilter, setTagFilter] = useState('all')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/content', {
          params: { type: 'post', status: 'published', limit: 50, sortBy: 'publishedAt', sortOrder: 'desc' },
        })
        setPosts(data.contents || [])
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const allTags = useMemo(() => {
    const tags = new Set()
    posts.forEach((p) => (p.tags || []).forEach((t) => tags.add(t)))
    return ['all', ...Array.from(tags).sort()]
  }, [posts])

  const filtered = useMemo(() => {
    let list = posts
    if (tagFilter !== 'all') list = list.filter((p) => (p.tags || []).includes(tagFilter))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.excerpt?.toLowerCase().includes(q) ||
          (p.tags || []).some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [posts, search, tagFilter])

  return (
    <>
      <SeoHead title="Blog" description="Technical articles on AI, ML, and software engineering by Baweke Mekonnen" />

      <Navbar />

      <main id="main-content" className="min-h-screen pt-24 pb-20">
        <div className="section-wrapper">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="section-label mb-3">Writing</p>
            <h1 className="text-gray-100 mb-4">Blog</h1>
            <p className="text-gray-400 max-w-xl">
              Technical deep-dives, tutorials, and opinion pieces on AI/ML trends and lessons learned.
            </p>
          </motion.div>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1 max-w-md">
              <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search articles…"
                aria-label="Search blog posts"
                className="w-full pl-10 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
              />
            </div>
          </div>

          {allTags.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10" role="tablist" aria-label="Filter by topic">
              {allTags.map((t) => (
                <button
                  key={t}
                  type="button"
                  role="tab"
                  aria-selected={tagFilter === t}
                  onClick={() => setTagFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-mono capitalize transition-all border ${
                    tagFilter === t
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                      : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                  }`}
                >
                  {t === 'all' ? 'All topics' : t}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-lg mb-2">Nothing here yet</p>
              <p className="text-sm">Check back soon for new articles.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => (
                <PostCard key={item._id} item={item} index={i} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
