'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiCalendar, HiClock, HiTag, HiArrowLeft, HiArrowRight } from 'react-icons/hi'
import api from '@/lib/api'

function readingTime(text = '') {
  const words = text.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / 200))
}

export default function BlogPostPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data } = await api.get('/content', {
          params: { type: 'post', status: 'published', limit: 100 }
        })
        const foundPost = data.contents?.find(p => p.slug === slug)
        
        if (!foundPost) {
          setError('Post not found')
        } else {
          setPost(foundPost)
        }
      } catch (err) {
        setError('Failed to load post')
        console.error('Error fetching post:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [slug])

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

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{error || 'Post not found'}</p>
          <Link href="/blog" className="text-violet-400 hover:text-violet-300">
            Back to Blog
          </Link>
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
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-6"
          >
            <HiArrowLeft size={16} />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {post.category && (
              <span className="inline-block px-3 py-1 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">{post.title}</h1>
            {post.excerpt && (
              <p className="text-gray-400 text-lg max-w-3xl">{post.excerpt}</p>
            )}
            
            <div className="flex items-center gap-4 text-sm text-gray-500 mt-6">
              <span className="flex items-center gap-2">
                <HiCalendar size={16} />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <span className="flex items-center gap-2">
                <HiClock size={16} />
                {readingTime(post.content)} min read
              </span>
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10">
                    <HiTag size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Cover Image */}
      {post.coverImage && (
        <div className="section-wrapper mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl overflow-hidden border border-white/10"
          >
            <img
              src={post.coverImage}
              alt={post.title}
              className="w-full h-auto"
            />
          </motion.div>
        </div>
      )}

      {/* Content */}
      <div className="section-wrapper pb-24">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div 
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Author Info */}
          {post.author && (
            <div className="mt-12 pt-8 border-t border-white/10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white font-bold">
                  {post.author.name?.charAt(0) || 'A'}
                </div>
                <div>
                  <p className="text-white font-medium">{post.author.name || 'Author'}</p>
                  <p className="text-gray-500 text-sm">{post.author.email}</p>
                </div>
              </div>
            </div>
          )}
        </motion.article>
      </div>
    </div>
  )
}
