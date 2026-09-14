import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowRight, HiLightningBolt, HiCode, HiDatabase, HiChip, HiServer } from 'react-icons/hi'

const CATEGORY_ICONS = {
  frontend: HiCode,
  backend: HiServer,
  database: HiDatabase,
  tools: HiChip,
}

const LEVEL_COLORS = {
  expert: 'from-emerald-500/20 to-emerald-600/20 border-emerald-500/30 text-emerald-400',
  advanced: 'from-violet-500/20 to-violet-600/20 border-violet-500/30 text-violet-400',
  intermediate: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
  beginner: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400',
}

const LEVEL_BAR = {
  expert: 100,
  advanced: 75,
  intermediate: 50,
  beginner: 25,
}

export default function FeaturedSkills({ skills }) {
  const skillsArray = Array.isArray(skills) ? skills : (skills?.skills || [])
  if (!skillsArray || skillsArray.length === 0) return null
  const topSkills = skillsArray.slice(0, 6)

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="section-label mb-3">Expertise</p>
            <h2 className="text-gray-100">Top Skills</h2>
            <p className="text-gray-400 mt-3 max-w-xl">Technologies and tools I work with regularly.</p>
          </div>
          <Link href="/skills" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-mono text-sm group">
            View All <HiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {topSkills.map((skill, idx) => {
            const Icon = CATEGORY_ICONS[skill.category] || HiLightningBolt
            const levelColor = LEVEL_COLORS[skill.level] || LEVEL_COLORS.intermediate
            const levelBar = LEVEL_BAR[skill.level] || LEVEL_BAR.intermediate

            return (
              <motion.div
                key={skill._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="glass-card rounded-2xl p-6 transition-all duration-300 hover:border-white/20 hover:shadow-lg hover:shadow-violet-500/5 group"
                role="article"
                aria-label={`Skill: ${skill.name}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${levelColor} flex items-center justify-center`}>
                      <Icon size={18} className="text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white text-sm">{skill.name}</h3>
                      <p className="text-xs text-gray-500 capitalize">{skill.category || 'General'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full bg-gradient-to-r ${levelColor} border font-mono capitalize`}>
                    {skill.level || 'Intermediate'}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${levelBar}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: idx * 0.05 + 0.2 }}
                      className={`h-full bg-gradient-to-r ${levelColor.replace('border-', '').replace('/20', '/80')}`}
                    />
                  </div>
                </div>

                {skill.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">{skill.description}</p>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
