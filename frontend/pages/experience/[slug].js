import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '@/components/Navbar/Navbar'
import { HiArrowLeft, HiLocationMarker, HiCalendar, HiBriefcase } from 'react-icons/hi'

const TYPE_COLORS = {
  'full-time':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'part-time':  'bg-blue-500/10    text-blue-400    border-blue-500/20',
  'contract':   'bg-violet-500/10  text-violet-400  border-violet-500/20',
  'internship': 'bg-amber-500/10   text-amber-400   border-amber-500/20',
  'freelance':  'bg-pink-500/10    text-pink-400    border-pink-500/20',
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
        const { data } = await axios.get(`/api/experience/${slug}`)
        setExperience(data.experience)
      } catch { router.replace('/experience') }
      finally { setLoading(false) }
    }
    fetch()
  }, [slug, router])

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  if (!experience) return null

  const typeClass = TYPE_COLORS[experience.employmentType] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'

  return (
    <>
      <Head>
        <title>{experience.title} at {experience.company} | Baweke</title>
        <meta name="description" content={experience.description} />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link href="/experience" className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors">
              <HiArrowLeft size={14} /> Back to Experience
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {experience.current && (
                <span className="px-2.5 py-1 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Current Position
                </span>
              )}
              <span className={`px-2.5 py-1 text-xs rounded-full border font-mono capitalize ${typeClass}`}>
                {experience.employmentType?.replace('-', ' ')}
              </span>
            </div>

            <h1 className="text-gray-100 mb-2">{experience.title}</h1>
            <p className="text-xl text-violet-300 font-medium mb-4">{experience.company}</p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-8" />

          {/* Description */}
          {experience.description && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
              <h2 className="text-white mb-4">About the Role</h2>
              <p className="text-gray-400 leading-relaxed">{experience.description}</p>
            </motion.div>
          )}

          {/* Responsibilities */}
          {experience.responsibilities?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
              <h2 className="text-white mb-4">Responsibilities</h2>
              <ul className="space-y-3">
                {experience.responsibilities.map((r, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <span className="text-violet-500 mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Achievements */}
          {experience.achievements?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
              <h2 className="text-white mb-4">Key Achievements</h2>
              <ul className="space-y-3">
                {experience.achievements.map((a, i) => (
                  <li key={i} className="flex items-start gap-3 text-gray-400">
                    <span className="text-emerald-500 mt-1 flex-shrink-0" aria-hidden="true">✓</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Technologies */}
          {experience.technologies?.length > 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <h2 className="text-white mb-4">Technologies Used</h2>
              <div className="flex flex-wrap gap-2">
                {experience.technologies.map((tech, i) => (
                  <span key={i} className="tech-badge">{tech}</span>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </>
  )
}
