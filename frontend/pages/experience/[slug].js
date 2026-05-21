import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'
import Navbar from '@/components/Navbar/Navbar'
import { HiArrowLeft, HiLocationMarker, HiCalendar, HiExternalLink, HiBadgeCheck } from 'react-icons/hi'
import { getEntryMeta } from '@/lib/timeline'

const EMPLOYMENT_COLORS = {
  'full-time': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'part-time': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'contract': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'internship': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'freelance': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function ExperienceDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [experience, setExperience] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const fetch = async () => {
      try {
        const { data } = await api.get(`/experience/${slug}`)
        setExperience(data.experience)
      } catch {
        router.replace('/experience')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [slug, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    )
  }

  if (!experience) return null

  const meta = getEntryMeta(experience.entryType || 'work')
  const isWork = (experience.entryType || 'work') === 'work'

  return (
    <>
      <Head>
        <title>{experience.title} | {experience.company} | Baweke</title>
        <meta name="description" content={experience.description} />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link href="/experience" className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors">
              <HiArrowLeft size={14} /> Back to timeline
            </Link>
          </motion.div>

          <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-2.5 py-1 text-xs rounded-full border font-mono ${meta.color}`}>{meta.label}</span>
              {isWork && experience.current && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Current
                </span>
              )}
              {isWork && experience.employmentType && (
                <span className={`px-2.5 py-1 text-xs rounded-full border font-mono capitalize ${EMPLOYMENT_COLORS[experience.employmentType] || ''}`}>
                  {experience.employmentType.replace('-', ' ')}
                </span>
              )}
            </div>

            <h1 className="text-gray-100 mb-2">{experience.title}</h1>
            <p className="text-xl text-violet-300 font-medium mb-2">{experience.company}</p>
            {experience.entryType === 'education' && experience.fieldOfStudy && (
              <p className="text-gray-400">{experience.fieldOfStudy}{experience.degree ? ` · ${experience.degree}` : ''}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mt-4">
              <span className="flex items-center gap-1.5">
                <HiCalendar size={16} />
                {formatDate(experience.startDate)} — {formatDate(experience.endDate)}
              </span>
              {experience.location && (
                <span className="flex items-center gap-1.5">
                  <HiLocationMarker size={16} />
                  {experience.location}
                </span>
              )}
            </div>
          </motion.header>

          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-8" />

          {experience.description && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <h2 className="text-white mb-4">Overview</h2>
              <p className="text-gray-400 leading-relaxed">{experience.description}</p>
            </motion.div>
          )}

          {experience.thesisTopic && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <h2 className="text-white mb-4">Thesis</h2>
              <p className="text-gray-400">{experience.thesisTopic}</p>
            </motion.div>
          )}

          {experience.credentialUrl && (
            <a href={experience.credentialUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8">
              <HiBadgeCheck size={18} /> Verify credential <HiExternalLink size={14} />
            </a>
          )}

          {experience.eventUrl && (
            <a href={experience.eventUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-violet-400 hover:text-violet-300 mb-8">
              Event link <HiExternalLink size={14} />
            </a>
          )}

          {experience.responsibilities?.length > 0 && isWork && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <h2 className="text-white mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {experience.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <span className="text-violet-500 mt-1 flex-shrink-0">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {experience.achievements?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
              <h2 className="text-white mb-4">{isWork ? 'Key Achievements' : 'Highlights'}</h2>
              <ul className="space-y-3">
                {experience.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <span className="text-emerald-500 mt-1 flex-shrink-0">✓</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {experience.technologies?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <h2 className="text-white mb-4">Technologies</h2>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech) => (
                  <span key={tech} className="tech-badge">{tech}</span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
