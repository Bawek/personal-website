import Link from 'next/link'
import { motion } from 'framer-motion'
import { HiArrowRight, HiExternalLink, HiStar } from 'react-icons/hi'
import { FaGithub } from 'react-icons/fa'

export default function FeaturedProjects({ projects }) {
  if (!projects || projects.length === 0) return null
  const featured = projects.filter(p => p.featured).slice(0, 3)
  if (featured.length === 0) return null

  return (
    <section id="projects" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent pointer-events-none" />
      <div className="section-wrapper relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="section-label mb-3">Portfolio</p>
            <h2 className="text-gray-100">Featured Projects</h2>
            <p className="text-gray-400 mt-3 max-w-xl">A selection of my recent work and case studies.</p>
          </div>
          <Link href="/projects" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-mono text-sm group">
            View All <HiArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {featured.map((project, idx) => (
            <motion.div
              key={project._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group"
            >
              <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/10 h-full flex flex-col">
                {/* Image Section */}
                <div className="relative h-48 bg-gradient-to-br from-violet-900/20 to-pink-900/20 overflow-hidden">
                  {project.imageUrl ? (
                    <img 
                      src={project.imageUrl} 
                      alt={project.title} 
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-4xl font-bold text-white/10">{project.title?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f17] via-transparent to-transparent opacity-60" />
                  {project.featured && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 backdrop-blur-sm">
                      <HiStar size={12} className="text-amber-400" />
                      <span className="text-xs font-medium text-amber-400">Featured</span>
                    </div>
                  )}
                </div>

                {/* Content Section */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4 line-clamp-2 flex-1">{project.description}</p>
                  
                  {/* Tech Stack */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {(project.techStack || []).slice(0, 4).map((tech) => (
                      <span key={tech} className="text-xs px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 font-mono">
                        {tech}
                      </span>
                    ))}
                    {project.techStack?.length > 4 && (
                      <span className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-gray-500 border border-white/10 font-mono">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    {project.liveUrl && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-violet-400 hover:text-violet-300 transition-colors font-medium"
                      >
                        <HiExternalLink size={14} />
                        Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a 
                        href={project.githubUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors font-medium"
                      >
                        <FaGithub size={14} />
                        Code
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
