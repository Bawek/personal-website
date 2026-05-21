import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import axios from 'axios'
import { HiArrowRight, HiCalendar, HiClock } from 'react-icons/hi'

function readingTime(text = '') {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function LatestArticles({ limit = 3 }) {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axios.get('/api/content', {
          params: { type: 'post', status: 'published', limit, sortBy: 'publishedAt', sortOrder: 'desc' },
        })
        setPosts(data.contents || [])
      } catch {
        setPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [limit])

  if (loading) return null
  if (!posts.length) return null

  return (
    <section id="blog-preview" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12"
        >
          <div>
            <p className="section-label mb-3">Writing</p>
            <h2 className="text-gray-100">Latest Articles</h2>
            <p className="text-gray-400 mt-3 max-w-xl">Technical deep-dives, tutorials, and lessons learned.</p>
          </div>
          <Link href="/blog" className="btn-ghost w-fit">
            Read My Blog <HiArrowRight size={14} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post, i) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-6 flex flex-col hover:border-violet-500/30 transition-colors"
            >
              <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{post.title}</h3>
              {post.excerpt && <p className="text-sm text-gray-400 line-clamp-3 mb-4 flex-1">{post.excerpt}</p>}
              <div className="flex items-center gap-3 text-xs text-gray-500 mt-auto pt-4 border-t border-white/5">
                <span className="flex items-center gap-1">
                  <HiCalendar size={12} />
                  {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-1">
                  <HiClock size={12} />
                  {readingTime(post.content || post.excerpt)} min read
                </span>
              </div>
              <Link href={`/blog/${post.slug}`} className="mt-4 text-sm text-violet-400 hover:text-violet-300 font-medium">
                Read article →
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
