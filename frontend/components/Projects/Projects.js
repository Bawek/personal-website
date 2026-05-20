import { useState } from 'react'
import { motion } from 'framer-motion'
import ProjectItem from './ProjectItem'

// Fallback projects when no DB data
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

export default function Projects({ projects }) {
  const data = projects?.length ? projects : FALLBACK_PROJECTS
  const [showAll, setShowAll] = useState(false)

  const displayed = showAll ? data : data.slice(0, 6)

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
            A selection of projects I&apos;ve worked on — from full-stack apps to UI experiments.
          </p>
        </motion.div>

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

        {data.length > 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex justify-center mt-10"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="btn-ghost"
            >
              {showAll ? 'Show Less' : `Show All ${data.length} Projects`}
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
