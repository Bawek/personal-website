import Head from 'next/head'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '@/components/Navbar/Navbar'
import { HiArrowRight, HiTag, HiCalendar, HiEye } from 'react-icons/hi'

const TYPE_LABELS = {
  post:        'Blog Post',
  page:        'Page',
  service:     'Service',
  testimonial: 'Testimonial',
  project:     'Project',
}

function PostCard({ item, index }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass-card p-6 flex flex-col hover:border-violet-500/30 transition-colors duration-300 group"
    >
      {/* Featured image */}
      {item.featuredImage && (
        <div className="h-44 rounded-xl overflow-hidden mb-5 -mx-1">
          <img src={item.featuredImage} alt={item.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
        </div>
      )}

      {/* Meta */}
      <div className="flex flex-wrap items-center gap-2 mb-3">
        <span className="px-2 py-0.5 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono capitalize">
          {TYPE_LABELS[item.type] || item.type}
        </span>
        {item.tags?.slice(0, 2).map(tag => (
          <span key={tag} className="flex items-center gap-1 text-xs text-gray-500">
            <HiTag size={10} />{tag}
          </span>
        ))}
      </div>

      <h2 className="text-lg font-bold text-white mb-2 group-hover:text-violet-300 transition-colors line-clamp-2">
        {item.title}
      </h2>

      {item.excerpt && (
        <p className="text-sm text-gray-400 leading-relaxed mb-4 flex-1 line-clamp-3">{item.excerpt}</p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
        <div className="flex items-center gap-3 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <HiCalendar size={12} />
            {new Date(item.publishedAt || item.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          {item.metadata?.views > 0 && (
            <span className="flex items-center gap-1">
              <HiEye size={12} />{item.metadata.views}
            </span>
          )}
        </div>
        <Link href={`/blog/${item.slug}`}
          className="flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium">
          Read more <HiArrowRight size={12} />
        </Link>
      </div>
    </motion.article>
  )
}

export default function BlogIndex() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState('all')

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/content?status=published&limit=50')
        setPosts(data.contents || [])
      } catch { setPosts([]) }
      finally { setLoading(false) }
    }
    fetch()
  }, [])

  const types = ['all', ...new Set(posts.map(p => p.type))]
  const filtered = filter === 'all' ? posts : posts.filter(p => p.type === filter)

  return (
    <>
      <Head>
        <title>Blog | Baweke</title>
        <meta name="description" content="Articles, notes, and thoughts from Baweke" />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="section-wrapper">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <p className="section-label mb-3">Writing</p>
            <h1 className="text-gray-100 mb-4">Blog</h1>
            <p className="text-gray-400 max-w-xl">
              Articles, tutorials, and notes on software development, tools, and things I find interesting.
            </p>
          </motion.div>

          {/* Type filter */}
          {types.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-10" role="tablist">
              {types.map(t => (
                <button key={t} role="tab" aria-selected={filter === t} onClick={() => setFilter(t)}
                  className={`px-4 py-1.5 rounded-full text-sm font-mono capitalize transition-all border
                    ${filter === t
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                      : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                    }`}>
                  {t === 'all' ? 'All' : TYPE_LABELS[t] || t}
                </button>
              ))}
            </div>
          )}

          {/* Posts grid */}
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-600">
              <p className="text-lg mb-2">Nothing here yet</p>
              <p className="text-sm">Check back soon.</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item, i) => <PostCard key={item._id} item={item} index={i} />)}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
