import Link from 'next/link'
import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiLocationMarker, HiChevronDown, HiChevronUp, HiExternalLink, HiBadgeCheck } from 'react-icons/hi'
import { ENTRY_TYPES, getEntryMeta } from '@/lib/timeline'

const EMPLOYMENT_COLORS = {
  'full-time': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'part-time': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'contract': 'bg-violet-500/10 text-violet-400 border-violet-500/20',
  'internship': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'freelance': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
}

function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function TimelineCard({ exp, index }) {
  const [expanded, setExpanded] = useState(false)
  const meta = getEntryMeta(exp.entryType || 'work')
  const isWork = (exp.entryType || 'work') === 'work'
  const hasMore = exp.responsibilities?.length > 3

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      <div className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-violet-500/60 to-transparent" aria-hidden="true" />
      <div className="absolute left-[-5px] top-2 w-[11px] h-[11px] rounded-full border-2 border-violet-500 bg-bg" aria-hidden="true" />

      <Link href={`/experience/${exp.slug}`} className="glass-card p-6 hover:border-violet-500/30 transition-colors duration-300 block">
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`px-2 py-0.5 text-xs rounded-full border font-mono ${meta.color}`}>
                {meta.shortLabel}
              </span>
              {isWork && exp.current && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Current
                </span>
              )}
            </div>
            <h3 className="text-white hover:text-violet-400 transition-colors">{exp.title}</h3>
            <p className="text-violet-300 font-medium">{exp.company}</p>
            {exp.entryType === 'education' && exp.fieldOfStudy && (
              <p className="text-sm text-gray-500 mt-1">{exp.fieldOfStudy}{exp.degree ? ` · ${exp.degree}` : ''}</p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            {isWork && exp.employmentType && (
              <span className={`px-2.5 py-0.5 text-xs rounded-full border font-mono capitalize ${EMPLOYMENT_COLORS[exp.employmentType] || ''}`}>
                {exp.employmentType.replace('-', ' ')}
              </span>
            )}
            <span className="text-xs text-gray-500 font-mono">
              {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
            </span>
          </div>
        </div>

        {exp.location && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <HiLocationMarker size={14} aria-hidden="true" />
            {exp.location}
          </p>
        )}

        {exp.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>
        )}

        {exp.entryType === 'education' && exp.thesisTopic && (
          <p className="text-sm text-gray-500 mb-3">
            <span className="font-mono text-xs text-gray-600 uppercase tracking-widest">Thesis: </span>
            {exp.thesisTopic}
          </p>
        )}

        {exp.entryType === 'certification' && (exp.credentialId || exp.credentialUrl) && (
          <div className="flex flex-wrap items-center gap-3 mb-4 text-sm">
            {exp.credentialId && (
              <span className="flex items-center gap-1 text-gray-500">
                <HiBadgeCheck size={14} className="text-amber-400" />
                ID: {exp.credentialId}
              </span>
            )}
            {exp.credentialUrl && (
              <span
                onClick={(e) => e.stopPropagation()}
                className="inline-flex"
              >
                <a href={exp.credentialUrl} target="_blank" rel="noreferrer" className="text-violet-400 hover:text-violet-300 flex items-center gap-1">
                  Verify credential <HiExternalLink size={12} />
                </a>
              </span>
            )}
          </div>
        )}

        {exp.entryType === 'talk' && exp.eventUrl && (
          <a
            href={exp.eventUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 mb-4"
          >
            Event details <HiExternalLink size={12} />
          </a>
        )}

        {exp.achievements?.length > 0 && exp.entryType !== 'work' && (
          <ul className="space-y-1.5 mb-4">
            {exp.achievements.map((a, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                <span className="text-violet-500 mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                {a}
              </li>
            ))}
          </ul>
        )}

        {isWork && exp.responsibilities?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Responsibilities</p>
            <ul className="space-y-1.5">
              {exp.responsibilities.slice(0, expanded ? undefined : 3).map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                  <span className="text-violet-500 mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                  {r}
                </li>
              ))}
            </ul>
            {hasMore && (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); setExpanded(!expanded) }}
                className="mt-2 flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-mono"
              >
                {expanded ? <><HiChevronUp size={14} /> Show less</> : <><HiChevronDown size={14} /> {exp.responsibilities.length - 3} more</>}
              </button>
            )}
          </div>
        )}

        {exp.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech) => (
              <span key={tech} className="tech-badge">{tech}</span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  )
}

export default function Experience({ experience, showFilters = false }) {
  const [filter, setFilter] = useState('all')

  const sorted = useMemo(() => {
    if (!experience?.length) return []
    return [...experience].sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
  }, [experience])

  const filtered = useMemo(() => {
    if (filter === 'all') return sorted
    return sorted.filter((e) => (e.entryType || 'work') === filter)
  }, [sorted, filter])

  const counts = useMemo(() => {
    const c = { all: sorted.length }
    Object.keys(ENTRY_TYPES).forEach((k) => {
      c[k] = sorted.filter((e) => (e.entryType || 'work') === k).length
    })
    return c
  }, [sorted])

  if (!sorted.length) return null

  return (
    <section id="experience" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="section-label mb-3">Career</p>
          <h2 className="text-gray-100">Experience & Education</h2>
          <p className="text-gray-400 mt-3 max-w-xl">
            Work history, education, certifications, awards, and speaking engagements.
          </p>
        </motion.div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-10" role="tablist">
            <button
              type="button"
              role="tab"
              aria-selected={filter === 'all'}
              onClick={() => setFilter('all')}
              className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all ${filter === 'all' ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
            >
              All ({counts.all})
            </button>
            {Object.entries(ENTRY_TYPES).map(([key, meta]) =>
              counts[key] > 0 ? (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={filter === key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all ${filter === key ? 'bg-violet-500/20 border-violet-500/50 text-violet-300' : 'border-white/10 text-gray-500 hover:border-white/20'}`}
                >
                  {meta.shortLabel} ({counts[key]})
                </button>
              ) : null
            )}
          </div>
        )}

        <div className="max-w-3xl">
          <AnimatePresence mode="popLayout">
            {filtered.map((exp, i) => (
              <TimelineCard key={exp._id} exp={exp} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
