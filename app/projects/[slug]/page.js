'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiExternalLink, HiCalendar, HiTag, HiCode, HiBriefcase } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'
import Link from 'next/link'
import { projectsAPI } from '@/lib/api'

export default function ProjectDetail() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await projectsAPI.getAll()
        const projects = Array.isArray(data) ? data : (data.projects || [])
        const foundProject = projects.find(p => p.slug === params.slug)
        
        if (foundProject) {
          setProject(foundProject)
        } else {
          setError('Project not found')
        }
      } catch (err) {
        setError('Failed to load project')
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchProject()
    }
  }, [params.slug])

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

  if (error || !project) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 mb-4">{error || 'Project not found'}</p>
          <Link href="/projects" className="text-violet-400 hover:text-violet-300 flex items-center gap-2 justify-center">
            <HiArrowLeft size={16} />
            Back to Projects
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0f0f17]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0f0f17]/80 backdrop-blur-md border-b border-white/5">
        <div className="section-wrapper h-16 flex items-center">
          <Link 
            href="/projects" 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <HiArrowLeft size={20} />
            <span className="text-sm">Back to Projects</span>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent pointer-events-none" />
        <div className="section-wrapper relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {project.featured && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-sm font-mono mb-4">
                <HiStar size={14} />
                Featured Project
              </div>
            )}
            
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
            
            <p className="text-xl text-gray-400 mb-6 max-w-3xl">{project.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-8">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:from-violet-400 hover:to-pink-400 transition-all shadow-lg shadow-violet-500/25"
                >
                  <HiExternalLink size={18} />
                  Live Demo
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-white font-semibold hover:bg-white/5 transition-all"
                >
                  <FaGithub size={18} />
                  View Code
                </a>
              )}
            </div>

            {/* Tech Stack */}
            <div className="flex flex-wrap gap-2">
              {(project.techStack || []).map((tech) => (
                <span key={tech} className="px-3 py-1.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 text-sm font-mono">
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Project Image */}
      {project.imageUrl && (
        <section className="py-12">
          <div className="section-wrapper">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl overflow-hidden border border-white/10"
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-auto"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Project Details */}
      <section className="py-12">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="max-w-4xl"
          >
            <h2 className="text-2xl font-bold text-white mb-6">About This Project</h2>
            <div className="prose prose-invert prose-lg max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {project.description}
              </p>
            </div>

            {/* Project Metadata */}
            <div className="grid sm:grid-cols-2 gap-6 mt-12 pt-8 border-t border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center flex-shrink-0">
                  <HiCode size={20} className="text-violet-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Technologies</p>
                  <p className="text-white font-medium">
                    {(project.techStack || []).join(', ')}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <HiBriefcase size={20} className="text-pink-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Project Type</p>
                  <p className="text-white font-medium">Web Application</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-12">
        <div className="section-wrapper">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-gradient-to-r from-violet-500/10 to-pink-500/10 border border-violet-500/20 rounded-2xl p-8 text-center"
          >
            <h3 className="text-2xl font-bold text-white mb-4">Interested in this project?</h3>
            <p className="text-gray-400 mb-6">Feel free to check out the code or live demo, or get in touch to discuss collaboration.</p>
            <div className="flex flex-wrap justify-center gap-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-white/10 text-white font-semibold hover:bg-white/20 transition-all"
                >
                  <FaGithub size={18} />
                  View on GitHub
                </a>
              )}
              <Link
                href="/contact"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:from-violet-400 hover:to-pink-400 transition-all"
              >
                Get in Touch
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}