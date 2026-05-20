import Head from 'next/head'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import axios from 'axios'
import Navbar from '@/components/Navbar/Navbar'
import { HiArrowLeft, HiChip, HiAcademicCap, HiChartBar } from 'react-icons/hi'

const LEVEL_COLORS = {
  beginner:     'from-gray-500    to-gray-400',
  intermediate: 'from-blue-500    to-cyan-400',
  advanced:     'from-violet-500  to-purple-400',
  expert:       'from-violet-500  to-pink-500',
}

const LEVEL_INFO = {
  beginner:     { width: '25%', description: 'Basic understanding and familiar with fundamental concepts' },
  intermediate: { width: '50%', description: 'Comfortable with everyday tasks and some advanced features' },
  advanced:     { width: '75%', description: 'Deep knowledge and can handle complex scenarios independently' },
  expert:       { width: '100%', description: 'Mastery level with extensive experience and can mentor others' },
}

const CATEGORY_COLORS = {
  frontend:  'bg-blue-500/10 text-blue-400 border-blue-500/20',
  backend:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  database:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  tools:     'bg-violet-500/10 text-violet-400 border-violet-500/20',
  other:     'bg-gray-500/10 text-gray-400 border-gray-500/20',
}

export default function SkillDetail() {
  const router = useRouter()
  const { slug } = router.query
  const [skill, setSkill] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!slug) return
    const fetch = async () => {
      try {
        const { data } = await axios.get(`/api/skills/${slug}`)
        setSkill(data.skill)
      } catch { router.replace('/skills') }
      finally { setLoading(false) }
    }
    fetch()
  }, [slug, router])

  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  if (!skill) return null

  const gradient = LEVEL_COLORS[skill.level] || LEVEL_COLORS.intermediate
  const categoryClass = CATEGORY_COLORS[skill.category] || CATEGORY_COLORS.other
  const levelInfo = LEVEL_INFO[skill.level] || LEVEL_INFO.intermediate

  return (
    <>
      <Head>
        <title>{skill.name} | Baweke</title>
        <meta name="description" content={`${skill.name} - ${skill.level} ${skill.category} skill`} />
      </Head>

      <Navbar />

      <main className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          {/* Back */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
            <Link href="/skills" className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-400 transition-colors">
              <HiArrowLeft size={14} /> Back to Skills
            </Link>
          </motion.div>

          {/* Header */}
          <motion.header initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-bold`}
                aria-hidden="true"
              >
                {skill.name.charAt(0).toUpperCase()}
              </div>
              
              <div>
                <h1 className="text-gray-100">{skill.name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2.5 py-0.5 text-xs rounded-full border font-mono capitalize ${categoryClass}`}>
                    {skill.category}
                  </span>
                  <span className="text-xs text-gray-500 capitalize font-mono">{skill.level}</span>
                </div>
              </div>
            </div>
          </motion.header>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-violet-500/30 to-transparent mb-8" />

          {/* Proficiency Level */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="mb-8">
            <h2 className="text-white mb-4">Proficiency Level</h2>
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-300 capitalize">{skill.level}</span>
                <span className="text-sm text-gray-500">{levelInfo.width}</span>
              </div>
              <div className="h-3 bg-white/5 rounded-full overflow-hidden mb-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: levelInfo.width }}
                  transition={{ duration: 1, delay: 0.2 }}
                  className={`h-full bg-gradient-to-r ${gradient} rounded-full`}
                />
              </div>
              <p className="text-sm text-gray-400">{levelInfo.description}</p>
            </div>
          </motion.div>

          {/* Category Info */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mb-8">
            <h2 className="text-white mb-4">Category</h2>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3">
                <HiChip size={24} className="text-violet-400" />
                <div>
                  <p className="text-white capitalize font-medium">{skill.category}</p>
                  <p className="text-sm text-gray-400">
                    {skill.category === 'frontend' && 'User interface and client-side development'}
                    {skill.category === 'backend' && 'Server-side and API development'}
                    {skill.category === 'database' && 'Data storage and management'}
                    {skill.category === 'tools' && 'Development tools and utilities'}
                    {skill.category === 'other' && 'Other technical skills'}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Learning Progress */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mb-8">
            <h2 className="text-white mb-4">Learning Journey</h2>
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <HiAcademicCap size={24} className="text-emerald-400" />
                <div>
                  <p className="text-white font-medium">Ongoing Development</p>
                  <p className="text-sm text-gray-400">Continuously improving and expanding skills</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <HiChartBar size={24} className="text-blue-400" />
                <div>
                  <p className="text-white font-medium">Practical Application</p>
                  <p className="text-sm text-gray-400">Applied in real-world projects and scenarios</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </>
  )
}
