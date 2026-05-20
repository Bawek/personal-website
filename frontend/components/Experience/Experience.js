import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HiLocationMarker, HiChevronDown, HiChevronUp } from 'react-icons/hi'

const TYPE_COLORS = {
  'full-time':  'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'part-time':  'bg-blue-500/10    text-blue-400    border-blue-500/20',
  'contract':   'bg-violet-500/10  text-violet-400  border-violet-500/20',
  'internship': 'bg-amber-500/10   text-amber-400   border-amber-500/20',
  'freelance':  'bg-pink-500/10    text-pink-400    border-pink-500/20',
}

function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function ExperienceCard({ exp, index }) {
  const [expanded, setExpanded] = useState(false)
  const typeClass = TYPE_COLORS[exp.employmentType] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
  const hasMore = exp.responsibilities?.length > 3

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="relative pl-8 pb-10 last:pb-0"
    >
      {/* Timeline line */}
      <div
        className="absolute left-0 top-2 bottom-0 w-px bg-gradient-to-b from-violet-500/60 to-transparent"
        aria-hidden="true"
      />
      {/* Timeline dot */}
      <div
        className="absolute left-[-5px] top-2 w-[11px] h-[11px] rounded-full border-2 border-violet-500 bg-bg"
        aria-hidden="true"
      />

      <Link href={`/experience/${exp.slug}`} className="glass-card p-6 hover:border-violet-500/30 transition-colors duration-300 block">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-white hover:text-violet-400 transition-colors">{exp.title}</h3>
              {exp.current && (
                <span className="px-2 py-0.5 text-xs rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  Current
                </span>
              )}
            </div>
            <p className="text-violet-300 font-medium">{exp.company}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span className={`px-2.5 py-0.5 text-xs rounded-full border font-mono capitalize ${typeClass}`}>
              {exp.employmentType?.replace('-', ' ')}
            </span>
            <span className="text-xs text-gray-500 font-mono">
              {formatDate(exp.startDate)} — {formatDate(exp.endDate)}
            </span>
          </div>
        </div>

        {/* Location */}
        {exp.location && (
          <p className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <HiLocationMarker size={14} aria-hidden="true" />
            {exp.location}
          </p>
        )}

        {/* Description */}
        {exp.description && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4">{exp.description}</p>
        )}

        {/* Responsibilities */}
        {exp.responsibilities?.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Responsibilities</p>
            <ul className="space-y-1.5">
              {exp.responsibilities
                .slice(0, expanded ? undefined : 3)
                .map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className="text-violet-500 mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                    {r}
                  </li>
                ))}
            </ul>
            {hasMore && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  setExpanded(!expanded)
                }}
                className="mt-2 flex items-center gap-1 text-xs text-violet-400 hover:text-violet-300 transition-colors font-mono"
                aria-expanded={expanded}
              >
                {expanded ? (
                  <><HiChevronUp size={14} /> Show less</>
                ) : (
                  <><HiChevronDown size={14} /> {exp.responsibilities.length - 3} more</>
                )}
              </button>
            )}
          </div>
        )}

        {/* Technologies */}
        {exp.technologies?.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {exp.technologies.map((tech, i) => (
              <span key={i} className="tech-badge">{tech}</span>
            ))}
          </div>
        )}
      </Link>
    </motion.div>
  )
}

export default function Experience({ experience }) {
  if (!experience?.length) return null

  return (
    <section id="experience" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">Career</p>
          <h2 className="text-gray-100">Work Experience</h2>
        </motion.div>

        <div className="max-w-3xl">
          {experience.map((exp, i) => (
            <ExperienceCard key={exp._id} exp={exp} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
