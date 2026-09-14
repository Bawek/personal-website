'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Head from 'next/head'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowLeft, HiExternalLink, HiStar } from 'react-icons/hi'
import Hero from '@/components/Hero/Hero'
import { skillsAPI, settingsAPI } from '@/lib/api'

const LEVEL_COLORS = {
  beginner: 'from-gray-500 to-gray-400',
  intermediate: 'from-blue-500 to-cyan-400',
  advanced: 'from-violet-500 to-purple-400',
  expert: 'from-violet-500 to-pink-500',
}

const LEVEL_WIDTH = {
  beginner: 'w-1/4',
  intermediate: 'w-1/2',
  advanced: 'w-3/4',
  expert: 'w-full',
}

const LEVEL_DESCRIPTIONS = {
  beginner: 'Basic understanding and limited experience',
  intermediate: 'Comfortable working with this technology',
  advanced: 'Strong expertise with complex implementations',
  expert: 'Deep mastery and ability to mentor others',
}

const FALLBACK_SKILLS = {
  'react': { _id: '1', slug: 'react', name: 'React', category: 'frontend', level: 'expert', description: 'A JavaScript library for building user interfaces, particularly single-page applications where you need dynamic and interactive UIs.' },
  'nextjs': { _id: '2', slug: 'nextjs', name: 'Next.js', category: 'frontend', level: 'advanced', description: 'A React framework that provides server-side rendering, static site generation, and many other features out of the box.' },
  'javascript': { _id: '3', slug: 'javascript', name: 'JavaScript', category: 'frontend', level: 'expert', description: 'A versatile programming language that runs on the web, servers, and mobile devices.' },
  'typescript': { _id: '4', slug: 'typescript', name: 'TypeScript', category: 'frontend', level: 'intermediate', description: 'A statically typed superset of JavaScript that compiles to plain JavaScript, adding type safety to development.' },
  'tailwind': { _id: '5', slug: 'tailwind', name: 'Tailwind', category: 'frontend', level: 'advanced', description: 'A utility-first CSS framework that provides low-level utility classes to build custom designs.' },
  'nodejs': { _id: '6', slug: 'nodejs', name: 'Node.js', category: 'backend', level: 'advanced', description: 'A JavaScript runtime built on Chrome\'s V8 engine that allows running JavaScript on the server side.' },
  'mongodb': { _id: '7', slug: 'mongodb', name: 'MongoDB', category: 'backend', level: 'intermediate', description: 'A document-oriented NoSQL database that stores data in flexible, JSON-like documents.' },
  'express': { _id: '8', slug: 'express', name: 'Express', category: 'backend', level: 'advanced', description: 'A minimal and flexible Node.js web application framework that provides robust features for building APIs.' },
  'git': { _id: '9', slug: 'git', name: 'Git', category: 'tools', level: 'advanced', description: 'A distributed version control system for tracking changes in source code during software development.' },
  'redux': { _id: '10', slug: 'redux', name: 'Redux', category: 'frontend', level: 'advanced', description: 'A predictable state container for JavaScript applications, commonly used with React for state management.' },
  'html5': { _id: '11', slug: 'html5', name: 'HTML5', category: 'frontend', level: 'expert', description: 'The latest version of the HyperText Markup Language for structuring web content.' },
  'css3': { _id: '12', slug: 'css3', name: 'CSS3', category: 'frontend', level: 'expert', description: 'The latest evolution of Cascading Style Sheets for styling and layout of web pages.' },
}

export default function SkillDetailPage() {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [skill, setSkill] = useState(null)
  const [settings, setSettings] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        // Try to get settings
        const settingsRes = await settingsAPI.get().catch(() => null)
        if (settingsRes?.data?.settings) {
          setSettings(settingsRes.data.settings)
        }

        // Try to fetch skill from API first
        try {
          const skillRes = await skillsAPI.getBySlug(slug)
          if (skillRes.data.skill) {
            setSkill(skillRes.data.skill)
            return
          }
        } catch (apiError) {
          console.log('API fetch failed, trying fallback skills')
        }

        // Use fallback skills if API fails
        const fallbackSkill = FALLBACK_SKILLS[slug]
        if (fallbackSkill) {
          setSkill(fallbackSkill)
        } else {
          setError('Skill not found')
        }
      } catch (err) {
        console.error('Error fetching skill:', err)
        setError('Failed to load skill')
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-mono">Loading skill…</p>
        </div>
      </div>
    )
  }

  if (error || !skill) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiStar className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Skill Not Found</h1>
          <p className="text-gray-400 mb-6">{error || 'The requested skill could not be found.'}</p>
          <Link 
            href="/skills" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-lg transition-colors"
          >
            <HiArrowLeft className="w-4 h-4" />
            Back to Skills
          </Link>
        </div>
      </div>
    )
  }

  const gradient = LEVEL_COLORS[skill.level] || LEVEL_COLORS.intermediate
  const barWidth = LEVEL_WIDTH[skill.level] || LEVEL_WIDTH.intermediate
  const levelDescription = LEVEL_DESCRIPTIONS[skill.level] || LEVEL_DESCRIPTIONS.intermediate

  const siteTitle = `${skill.name} | ${settings?.siteName || 'Baweke'}`
  const siteDescription = skill.description || `Learn about my experience with ${skill.name}`

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
      </Head>

      <main>
        <Hero 
          content={{ 
            title: skill.name, 
            subtitle: skill.description || `My experience with ${skill.name}` 
          }} 
        />
        
        <section className="py-24">
          <div className="section-wrapper">
            <div className="max-w-4xl">
              {/* Back link */}
              <Link 
                href="/skills" 
                className="inline-flex items-center gap-2 text-gray-400 hover:text-violet-400 transition-colors mb-8"
              >
                <HiArrowLeft className="w-4 h-4" />
                Back to Skills
              </Link>

              <div className="grid gap-8 lg:grid-cols-3">
                {/* Main content */}
                <div className="lg:col-span-2 space-y-8">
                  {/* Skill header */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-card p-6"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div
                        className={`w-16 h-16 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold flex-shrink-0`}
                        aria-hidden="true"
                      >
                        {skill.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold text-white">{skill.name}</h1>
                        <p className="text-gray-400 capitalize">{skill.category} • {skill.level}</p>
                      </div>
                    </div>

                    {/* Proficiency bar */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-300">Proficiency Level</span>
                        <span className="text-gray-400 capitalize">{skill.level}</span>
                      </div>
                      <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ duration: 1, delay: 0.3 }}
                          className={`h-full ${barWidth} bg-gradient-to-r ${gradient} rounded-full`}
                        />
                      </div>
                      <p className="text-xs text-gray-500">{levelDescription}</p>
                    </div>
                  </motion.div>

                  {/* Description */}
                  {skill.description && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="glass-card p-6"
                    >
                      <h2 className="text-lg font-semibold text-white mb-4">About This Skill</h2>
                      <p className="text-gray-300 leading-relaxed">{skill.description}</p>
                    </motion.div>
                  )}

                  {/* Experience */}
                  {skill.experience && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="glass-card p-6"
                    >
                      <h2 className="text-lg font-semibold text-white mb-4">Experience</h2>
                      <p className="text-gray-300 leading-relaxed">{skill.experience}</p>
                    </motion.div>
                  )}

                  {/* Projects */}
                  {skill.projects && skill.projects.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass-card p-6"
                    >
                      <h2 className="text-lg font-semibold text-white mb-4">Related Projects</h2>
                      <div className="space-y-3">
                        {skill.projects.map((project, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                            <div className="w-2 h-2 bg-violet-500 rounded-full flex-shrink-0" />
                            <p className="text-gray-300">{project}</p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Quick info */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                  >
                    <h3 className="text-lg font-semibold text-white mb-4">Quick Info</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Category:</span>
                        <span className="text-white capitalize">{skill.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Level:</span>
                        <span className="text-white capitalize">{skill.level}</span>
                      </div>
                      {skill.yearsOfExperience && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Experience:</span>
                          <span className="text-white">{skill.yearsOfExperience} years</span>
                        </div>
                      )}
                      {skill.lastUsed && (
                        <div className="flex justify-between">
                          <span className="text-gray-400">Last Used:</span>
                          <span className="text-white">{new Date(skill.lastUsed).getFullYear()}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>

                  {/* External links */}
                  {skill.links && skill.links.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="glass-card p-6"
                    >
                      <h3 className="text-lg font-semibold text-white mb-4">Learn More</h3>
                      <div className="space-y-2">
                        {skill.links.map((link, index) => (
                          <a
                            key={index}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors text-sm"
                          >
                            <HiExternalLink className="w-4 h-4 flex-shrink-0" />
                            {link.title || link.url}
                          </a>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}