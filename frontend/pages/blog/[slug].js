import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '@/components/Navbar/Navbar'
import { HiArrowLeft, HiCalendar, HiEye, HiHeart, HiTag } from 'react-icons/hi'

export default function BlogPost() {
  const router = useRouter()
  const { slug } = router.query
  const [post, setPost]       = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [liked, setLiked]     = useState(false)

  useEffect(() => {
    if (!slug) return
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/content/${slug}`)
        setPost(data)
        const tag = data.tags?.[0]
        const { data: list } = await axios.get('/api/content', {
          params: { type: 'post', status: 'published', limit: 4, tags: tag || undefined },
        })
        setRelated((list.contents || []).filter((p) => p.slug !== slug).slice(0, 3))
      } catch { router.replace('/blog') }
      finally { setLoading(false) }
    }
    fetch()
  }, [slug, router])

  const handleLike = async () => {
    if (liked) return
    try {
      await axios.post(`/api/content/${post._id}/like`)
      setPost(prev => ({ ...prev, metadata: { ...prev.metadata, likes: (prev.metadata?.likes || 0) + 1 } }))
      setLiked(true)
    } catch {}
  }

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  if (!post) return null

  return (
    <>
      <Head>
        <title>{post.seo?.metaTitle || post.title} | Baweke</title>
        <meta name="description" content={post.seo?.metaDescription || post.excerpt || ''} />
        {post.seo?.keywords?.length > 0 && <meta name="keywords" content={post.seo.keywords.join(', ')} />}
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link href="/blog" className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors">
              <HiArrowLeft size={14} /> Back to Blog
            </Link>
          </motion.div>

          {/* Featured image */}
          {post.featuredImage && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-80">
              <img src={post.featuredImage} alt={post.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mb-8">
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="px-2.5 py-0.5 text-xs rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono capitalize">
                {post.type}
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <HiCalendar size={12} />
                {new Date(post.publishedAt || post.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              {post.metadata?.views > 0 && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <HiEye size={12} />{post.metadata.views} views
                </span>
              )}
            </div>

            <h1 className="text-gray-100 mb-4">{post.title}</h1>

            {post.excerpt && (
              <p className="text-lg text-gray-400 leading-relaxed">{post.excerpt}</p>
            )}

            {post.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {post.tags.map(tag => (
                  <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs rounded-full bg-white/5 border border-white/10 text-gray-400">
                    <HiTag size={10} />{tag}
                  </span>
                ))}
              </div>
            )}
          </motion.header>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-8" />

          {/* Body */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="prose prose-invert prose-violet max-w-none
                       prose-headings:text-white prose-headings:font-bold
                       prose-p:text-gray-300 prose-p:leading-relaxed
                       prose-a:text-violet-400 prose-a:no-underline hover:prose-a:text-violet-300
                       prose-code:text-violet-300 prose-code:bg-violet-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
                       prose-pre:bg-white/5 prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                       prose-blockquote:border-l-violet-500 prose-blockquote:text-gray-400
                       prose-strong:text-white prose-li:text-gray-300"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {related.length > 0 && (
            <aside className="mt-12 pt-8 border-t border-white/5">
              <h2 className="text-lg font-bold text-white mb-4">Related Articles</h2>
              <ul className="space-y-3">
                {related.map((r) => (
                  <li key={r._id}>
                    <Link href={`/blog/${r.slug}`} className="text-violet-400 hover:text-violet-300 text-sm">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          {/* Like button */}
          <div className="flex items-center justify-center mt-12 pt-8 border-t border-white/5">
            <button onClick={handleLike} disabled={liked}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all
                ${liked
                  ? 'bg-pink-500/15 border-pink-500/30 text-pink-400 cursor-default'
                  : 'border-white/10 text-gray-400 hover:border-pink-500/30 hover:text-pink-400 hover:bg-pink-500/10'
                }`}>
              <HiHeart size={16} className={liked ? 'fill-current' : ''} />
              {post.metadata?.likes || 0} {liked ? 'Liked!' : 'Like this post'}
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
