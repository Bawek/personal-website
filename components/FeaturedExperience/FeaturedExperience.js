import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowRight, HiBriefcase, HiAcademicCap, HiCalendar, HiLocationMarker } from 'react-icons/hi'

const formatDate = (date) => {
  if (!date) return 'Present'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

const getTypeIcon = (type) => {
  return type === 'education' ? HiAcademicCap : HiBriefcase
}

const getTypeColor = (type) => {
  return type === 'education' 
    ? 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400'
    : 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400'
}

export default function FeaturedExperience({ experience }) {
  if (!experience || experience.length === 0) return null
  const featured = experience.slice(0, 3)

  return (
    <section id="experience" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="section-label mb-3">Career</p>
            <h2 className="text-gray-100">Experience & Education</h2>
            <p className="text-gray-400 mt-3 max-w-xl">Work history, education, and professional development.</p>
          </div>
          <Link href="/experience" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-mono text-sm group">
            View All <HiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent hidden sm:block" />

          <div className="space-y-6 sm:space-y-8">
            {featured.map((item, idx) => {
              const Icon = getTypeIcon(item.type)
              const typeColor = getTypeColor(item.type)
              const isEducation = item.type === 'education'

              return (
                <motion.div
                  key={item._id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="relative pl-12 sm:pl-16"
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-0 sm:left-6 top-6 w-8 h-8 rounded-full bg-gradient-to-br ${typeColor} border-2 border-[#0f0f17] flex items-center justify-center -translate-x-1/2 z-10`}>
                    <Icon size={14} className="text-white" />
                  </div>

                  {/* Card */}
                  <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-violet-500/5 group">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-white">{item.title}</h3>
                          <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${typeColor} border font-mono capitalize`}>
                            {isEducation ? 'Education' : 'Work'}
                          </span>
                        </div>
                        <p className="text-sm text-violet-400 font-medium">
                          {item.company || item.institution}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500 font-mono">
                        <div className="flex items-center gap-1.5">
                          <HiCalendar size={12} />
                          <span>{formatDate(item.startDate)} - {formatDate(item.endDate)}</span>
                        </div>
                        {item.location && (
                          <div className="flex items-center gap-1.5">
                            <HiLocationMarker size={12} />
                            <span>{item.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
                    )}

                    {item.achievements && item.achievements.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <p className="text-xs text-gray-500 font-mono uppercase tracking-widest mb-2">Key Achievements</p>
                        <ul className="space-y-1">
                          {item.achievements.slice(0, 2).map((achievement, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-2">
                              <span className="text-violet-400 mt-0.5">•</span>
                              <span className="line-clamp-1">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
