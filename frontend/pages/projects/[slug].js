import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '@/components/Navbar/Navbar'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { HiArrowLeft, HiStar } from 'react-icons/hi'

export default function ProjectDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/projects/${slug}`)
        setProject(data.project)
      } catch { router.replace('/projects') }
      finally { setLoading(false) }
    }
    fetch()
  }, [slug, router])

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  if (!project) return null

  return (
    <>
      <Head>
        <title>{project.title} | Baweke</title>
        <meta name="description" content={project.description} />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link href="/projects" className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors">
              <HiArrowLeft size={14} /> Back to Projects
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {project.featured && (
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono">
                  <HiStar size={12} aria-hidden="true" />
                  Featured
                </div>
              )}
            </div>

            <h1 className="text-gray-100 mb-4">{project.title}</h1>
            <p className="text-lg text-gray-400 leading-relaxed">{project.description}</p>
          </motion.header>

          {/* Image */}
          {project.imageUrl && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="rounded-2xl overflow-hidden mb-8 h-64 sm:h-96">
              <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover" />
            </motion.div>
          )}

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-8" />

          {/* Tech Stack */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="text-white mb-4">Tech Stack</h2>
            <div className="flex flex-wrap gap-2">
              {project.techStack.map(tech => (
                <span key={tech} className="px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Action buttons */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex flex-wrap gap-4 pt-8 border-t border-white/5">
            {project.githubUrl && project.githubUrl !== '#' && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-ghost flex items-center gap-2"
                aria-label={`View source code for ${project.title}`}
              >
                <FaGithub size={16} />
                Source Code
              </a>
            )}
            {project.liveUrl && project.liveUrl !== '#' && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-primary flex items-center gap-2"
                aria-label={`View live demo of ${project.title}`}
              >
                <FaExternalLinkAlt size={14} />
                Live Demo
              </a>
            )}
          </motion.div>
        </div>
      </main>
    </>
  )
}
