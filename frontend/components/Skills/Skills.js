import Link from 'next/link'
import { useState } from 'react'
import { motion } from 'framer-motion'

// Map skill names to simple colored initials — extend as needed
const LEVEL_COLORS = {
  beginner:     'from-gray-500    to-gray-400',
  intermediate: 'from-blue-500    to-cyan-400',
  advanced:     'from-violet-500  to-purple-400',
  expert:       'from-violet-500  to-pink-500',
}

const LEVEL_WIDTH = {
  beginner:     'w-1/4',
  intermediate: 'w-1/2',
  advanced:     'w-3/4',
  expert:       'w-full',
}

function SkillCard({ skill, index }) {
  const gradient = LEVEL_COLORS[skill.level] || LEVEL_COLORS.intermediate
  const barWidth = LEVEL_WIDTH[skill.level] || LEVEL_WIDTH.intermediate

  return (
    <Link href={`/skills/${skill.slug}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.04 }}
        className="glass-card p-4 hover:border-violet-500/30 transition-all duration-300 group h-full"
      >
        <div className="flex items-center gap-3 mb-3">
          {/* Icon placeholder — gradient initial */}
          <div
            className={`w-9 h-9 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-sm font-bold flex-shrink-0`}
            aria-hidden="true"
          >
            {skill.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-white truncate group-hover:text-violet-400 transition-colors">{skill.name}</p>
            <p className="text-xs text-gray-500 capitalize">{skill.category}</p>
          </div>
        </div>

        {/* Level bar */}
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: index * 0.04 + 0.2 }}
            className={`h-full ${barWidth} bg-gradient-to-r ${gradient} rounded-full`}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1 capitalize font-mono">{skill.level}</p>
      </motion.div>
    </Link>
  )
}

// Fallback static skills when no DB data
const FALLBACK_SKILLS = [
  { _id: '1', slug: 'react',      name: 'React',      category: 'frontend', level: 'expert'       },
  { _id: '2', slug: 'nextjs',     name: 'Next.js',    category: 'frontend', level: 'advanced'     },
  { _id: '3', slug: 'javascript', name: 'JavaScript', category: 'frontend', level: 'expert'       },
  { _id: '4', slug: 'typescript', name: 'TypeScript', category: 'frontend', level: 'intermediate' },
  { _id: '5', slug: 'tailwind',   name: 'Tailwind',   category: 'frontend', level: 'advanced'     },
  { _id: '6', slug: 'nodejs',     name: 'Node.js',    category: 'backend',  level: 'advanced'     },
  { _id: '7', slug: 'mongodb',    name: 'MongoDB',    category: 'backend',  level: 'intermediate' },
  { _id: '8', slug: 'express',    name: 'Express',    category: 'backend',  level: 'advanced'     },
  { _id: '9', slug: 'git',        name: 'Git',        category: 'tools',    level: 'advanced'     },
  { _id: '10', slug: 'redux',     name: 'Redux',     category: 'frontend', level: 'advanced'     },
  { _id: '11', slug: 'html5',     name: 'HTML5',     category: 'frontend', level: 'expert'       },
  { _id: '12', slug: 'css3',      name: 'CSS3',      category: 'frontend', level: 'expert'       },
]

export default function Skills({ skills }) {
  const data = skills?.length ? skills : FALLBACK_SKILLS

  // Get unique categories
  const categories = ['all', ...new Set(data.map((s) => s.category))]
  const [activeCategory, setActiveCategory] = useState('all')

  const filtered = activeCategory === 'all'
    ? data
    : data.filter((s) => s.category === activeCategory)

  return (
    <section id="skills" className="py-24 bg-surface/30">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Expertise</p>
          <h2 className="text-gray-100">Technical Skills</h2>
        </motion.div>

        {/* Category filter tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
          role="tablist"
          aria-label="Filter skills by category"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              role="tab"
              aria-selected={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-mono capitalize transition-all duration-200 border
                ${activeCategory === cat
                  ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                  : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Skills grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((skill, i) => (
            <SkillCard key={skill._id} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
