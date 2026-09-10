'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiCalendar, HiClock, HiTag, HiFilter, HiArrowRight } from 'react-icons/hi'
import api from '@/lib/api'

function readingTime(text = '') {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function BlogPage() {
  const [posts, setPosts] = useState([])
  const [filteredPosts, setFilteredPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [categories, setCategories] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await api.get('/content', {
          params: { type: 'post', status: 'published', limit: 100, sortBy: 'publishedAt', sortOrder: 'desc' }
        })
        setPosts(data.contents || [])
        setFilteredPosts(data.contents || [])
        
        // Extract unique categories
        const uniqueCategories = [...new Set((data.contents || []).map(p => p.category).filter(Boolean))]
        setCategories(uniqueCategories)
      } catch (error) {
        console.error('Error fetching posts:', error)
        setPosts([])
        setFilteredPosts([])
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = posts

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(p =>
        p.title?.toLowerCase().includes(query) ||
        p.excerpt?.toLowerCase().includes(query) ||
        p.content?.toLowerCase().includes(query) ||
        p.tags?.some(t => t.toLowerCase().includes(query))
      )
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(p => p.category === selectedCategory)
    }

    setFilteredPosts(filtered)
  }, [searchQuery, selectedCategory, posts])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-mono">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f17]">
      {/* Header */}
      <div className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="section-wrapper relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <p className="section-label mb-3">Writing</p>
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Blog</h1>
            <p className="text-gray-400 text-lg">
              Technical deep-dives, tutorials, and lessons learned from building software.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="section-wrapper pb-24">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 pl-12 text-white text-sm placeholder-gray-500 focus:border-violet-500/30 focus:outline-none transition-colors"
            />
            <HiFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 text-sm rounded-lg transition-all border ${
                selectedCategory === 'all'
                  ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                  : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
              }`}
            >
              All
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-sm rounded-lg transition-all border ${
                  selectedCategory === category
                    ? 'bg-violet-500/20 text-violet-300 border-violet-500/30'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Posts */}
        {filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-600 bg-white/3 border border-white/5 rounded-2xl">
            <p className="text-sm">
              {posts.length === 0 ? 'No articles published yet' : 'No articles match your filters'}
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post, idx) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 group"
              >
                {/* Cover Image */}
                {post.coverImage ? (
                  <div className="h-48 overflow-hidden">
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-violet-900/20 to-pink-900/20 flex items-center justify-center">
                    <span className="text-4xl font-bold text-white/10">{post.title?.charAt(0)}</span>
                  </div>
                )}

                <div className="p-6">
                  {post.category && (
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono mb-3">
                      {post.category}
                    </span>
                  )}

                  <h3 className="text-lg font-bold text-white mb-2 line-clamp-2 group-hover:text-violet-400 transition-colors">
                    {post.title}
                  </h3>

                  {post.excerpt && (
                    <p className="text-sm text-gray-400 line-clamp-3 mb-4">{post.excerpt}</p>
                  )}

                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                    <span className="flex items-center gap-1">
                      <HiCalendar size={12} />
                      {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1">
                      <HiClock size={12} />
                      {readingTime(post.content)} min read
                    </span>
                  </div>

                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-gray-500">
                          <HiTag size={10} />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 font-medium transition-colors"
                  >
                    Read article <HiArrowRight size={14} />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
