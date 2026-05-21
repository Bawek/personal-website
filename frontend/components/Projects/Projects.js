import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import ProjectItem from './ProjectItem'

const FALLBACK_PROJECTS = [
  {
    _id: '1',
    slug: 'ecommerce-application',
    title: 'Ecommerce Application',
    description: 'A full-stack ecommerce app where users can browse and purchase products with authentication.',
    techStack: ['React', 'Context API', 'Express', 'Tailwind'],
    liveUrl: '#',
    githubUrl: 'https://github.com/Bawek/ECOMMERCE-APP/',
    featured: true,
  },
  {
    _id: '2',
    slug: 'blog-app',
    title: 'Blog App',
    description: 'A full-featured blog platform enabling users to create, manage, and read posts with Google Auth.',
    techStack: ['React', 'Redux', 'MongoDB', 'Express'],
    liveUrl: '#',
    githubUrl: 'https://github.com/Bawek/Blog-App',
    featured: false,
  },
  {
    _id: '3',
    slug: 'user-management-system',
    title: 'User Management System',
    description: 'Admin dashboard for managing users, roles, and permissions with secure authentication.',
    techStack: ['React', 'Redux/Thunk', 'Express', 'MongoDB'],
    liveUrl: '#',
    githubUrl: 'https://github.com/Bawek/UserManegmentSyStem',
    featured: false,
  },
  {
    _id: '4',
    slug: 'mail-box-client',
    title: 'Mail-Box Client',
    description: 'Email client where users can compose, send, and manage received and unread mail in real-time.',
    techStack: ['React', 'Redux', 'Firebase', 'Tailwind'],
    liveUrl: '#',
    githubUrl: 'https://github.com/Bawek/MERN',
    featured: false,
  },
]

export default function Projects({ projects, showFilters = false }) {
  const data = projects?.length ? projects : FALLBACK_PROJECTS
  const [showAll, setShowAll] = useState(false)
  const [search, setSearch] = useState('')
  const [techFilter, setTechFilter] = useState('all')
  const [featuredOnly, setFeaturedOnly] = useState(false)

  const allTech = useMemo(() => {
    const set = new Set()
    data.forEach((p) => (p.techStack || []).forEach((t) => set.add(t)))
    return ['all', ...Array.from(set).sort()]
  }, [data])

  const filtered = useMemo(() => {
    let list = data
    if (featuredOnly) list = list.filter((p) => p.featured)
    if (techFilter !== 'all') list = list.filter((p) => (p.techStack || []).includes(techFilter))
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          (p.techStack || []).some((t) => t.toLowerCase().includes(q))
      )
    }
    return list
  }, [data, search, techFilter, featuredOnly])

  const displayed = showAll ? filtered : filtered.slice(0, 6)

  return (
    <section id="projects" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Portfolio</p>
          <h2 className="text-gray-100">What I&apos;ve Built</h2>
          <p className="text-gray-400 mt-3 max-w-xl">
            Case studies and projects — filter by technology or search by keyword.
          </p>
        </motion.div>

        {showFilters && (
          <div className="flex flex-col gap-4 mb-10">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search projects…"
              aria-label="Search projects"
              className="w-full max-w-md bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60"
            />
            <div className="flex flex-wrap gap-2 items-center">
              <button
                type="button"
                onClick={() => setFeaturedOnly(!featuredOnly)}
                className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all ${
                  featuredOnly
                    ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                    : 'border-white/10 text-gray-500 hover:border-white/20'
                }`}
              >
                Featured
              </button>
              {allTech.slice(0, 12).map((tech) => (
                <button
                  key={tech}
                  type="button"
                  onClick={() => setTechFilter(tech)}
                  className={`px-4 py-1.5 rounded-full text-sm font-mono border transition-all ${
                    techFilter === tech
                      ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                      : 'border-white/10 text-gray-500 hover:border-white/20'
                  }`}
                >
                  {tech === 'all' ? 'All tech' : tech}
                </button>
              ))}
            </div>
          </div>
        )}

        {displayed.length === 0 ? (
          <p className="text-gray-500 text-center py-12">No projects match your filters.</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayed.map((project) => (
              <ProjectItem
                key={project._id}
                slug={project.slug}
                title={project.title}
                projectUrl={project.liveUrl || '#'}
                backgroundImg={project.imageUrl || null}
                desc={project.description}
                tech={(project.techStack || []).join(', ')}
                sourceLink={project.githubUrl || '#'}
                featured={project.featured}
              />
            ))}
          </div>
        )}

        {filtered.length > 6 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="flex justify-center mt-10">
            <button type="button" onClick={() => setShowAll(!showAll)} className="btn-ghost">
              {showAll ? 'Show Less' : `Show All ${filtered.length} Projects`}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
