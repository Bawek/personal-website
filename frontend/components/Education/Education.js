import { motion } from 'framer-motion'
import { HiAcademicCap, HiCalendar, HiLocationMarker } from 'react-icons/hi'
import Link from 'next/link'

function formatDate(dateStr) {
  if (!dateStr) return 'Present'
  return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
}

function EducationCard({ edu, index }) {
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

      <Link href="#" className="glass-card p-6 hover:border-violet-500/30 transition-colors duration-300 block">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          {edu.logoUrl && (
            <img
              src={edu.logoUrl}
              alt={edu.institution}
              className="w-14 h-14 rounded-xl object-cover flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-white hover:text-violet-400 transition-colors">{edu.degree}</h3>
            <p className="text-violet-300 font-medium">{edu.institution}</p>
            <p className="text-gray-400 text-sm mt-1">{edu.fieldOfStudy}</p>
          </div>
        </div>

        {/* Date and location */}
        <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-gray-500 font-mono">
          <span className="flex items-center gap-1">
            <HiCalendar size={14} aria-hidden="true" />
            {formatDate(edu.startDate)} — {formatDate(edu.endDate)}
          </span>
          {edu.gpa && (
            <span className="flex items-center gap-1">
              GPA: {edu.gpa}
            </span>
          )}
          {edu.websiteUrl && (
            <a
              href={edu.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              Visit Website →
            </a>
          )}
        </div>

        {/* Thesis topic */}
        {edu.thesisTopic && (
          <div className="border-t border-white/10 pt-4">
            <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Thesis</p>
            <p className="text-sm text-gray-400">{edu.thesisTopic}</p>
          </div>
        )}

        {/* Honors and coursework */}
        {(edu.honors?.length > 0 || edu.coursework?.length > 0) && (
          <div className="border-t border-white/10 pt-4 mt-4">
            {edu.honors?.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Honors</p>
                <div className="flex flex-wrap gap-2">
                  {edu.honors.map((honor, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {honor}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {edu.coursework?.length > 0 && (
              <div>
                <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-2">Relevant Coursework</p>
                <div className="flex flex-wrap gap-2">
                  {edu.coursework.map((course, i) => (
                    <span key={i} className="px-2 py-1 text-xs rounded-full bg-white/5 text-gray-400 border border-white/10">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </Link>
    </motion.div>
  )
}

export default function Education({ education }) {
  if (!education?.length) return null

  return (
    <section id="education" className="py-24 bg-surface/30">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">Education</p>
          <h2 className="text-gray-100">Academic Background</h2>
        </motion.div>

        <div className="max-w-3xl">
          {education.map((edu, i) => (
            <EducationCard key={edu._id} edu={edu} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
