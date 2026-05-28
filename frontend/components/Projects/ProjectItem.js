import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { HiStar } from 'react-icons/hi'

export default function ProjectItem({
  title,
  backgroundImg,
  tech,
  projectUrl,
  desc,
  sourceLink,
  featured,
  slug,
}) {
  const isDynamic = typeof backgroundImg === 'string' && backgroundImg?.includes('/uploads/')
  const hasImage  = !!backgroundImg

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="glass-card overflow-hidden flex flex-col group hover:border-violet-500/40 transition-all duration-300"
    >
      {/* Image with link */}
      <Link href={`/projects/${slug}`} className="relative h-48 bg-surface-2 overflow-hidden flex-shrink-0 block">
        {hasImage ? (
          <Image
            src={backgroundImg}
            alt={title}
            fill
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          /* Placeholder gradient */
          <div className="w-full h-full bg-gradient-to-br from-violet-900/40 to-pink-900/40 flex items-center justify-center">
            <span className="text-4xl font-bold gradient-text opacity-30">{title?.charAt(0)}</span>
          </div>
        )}

        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-mono">
            <HiStar size={12} aria-hidden="true" />
            Featured
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </Link>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5">
        <Link href={`/projects/${slug}`} className="block">
          <h3 className="text-white mb-2 text-lg hover:text-violet-400 transition-colors">{title}</h3>
        </Link>

        {desc && (
          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">
            {desc}
          </p>
        )}

        {/* Tech stack */}
        {tech && (
          <div className="flex flex-wrap gap-1.5 mb-5">
            {tech.split(',').map((t) => (
              <span key={t.trim()} className="tech-badge">{t.trim()}</span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/5">
          {sourceLink && sourceLink !== '#' && (
            <a
              href={sourceLink}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost text-xs py-2 px-4 flex-1 justify-center"
              aria-label={`View source code for ${title}`}
            >
              <FaGithub size={14} />
              Source
            </a>
          )}
          {projectUrl && projectUrl !== '#' && (
            <a
              href={projectUrl}
              target="_blank"
              rel="noreferrer"
              className="btn-primary text-xs py-2 px-4 flex-1 justify-center"
              aria-label={`View live demo of ${title}`}
            >
              <FaExternalLinkAlt size={12} />
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}
