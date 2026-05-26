import { motion } from 'framer-motion'
import { HiDownload, HiLightBulb, HiHeart, HiStar } from 'react-icons/hi'

const fadeUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, delay, ease: 'easeOut' } },
})

export default function About({ content, experience }) {
  const currentJobs = experience?.filter((e) => e.current) || []
  const yearsExp = experience?.length
    ? new Date().getFullYear() - Math.min(...experience.map((e) => new Date(e.startDate).getFullYear()))
    : null

  const stats = [
    { label: 'Years Experience', value: yearsExp ? `${yearsExp}+` : '—' },
    { label: 'Projects Built',   value: '10+'  },
    { label: 'Technologies',     value: '15+'  },
  ]

  return (
    <section id="about" className="py-24 relative">
      {/* Subtle divider glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent to-violet-500/40" aria-hidden="true" />

      <div className="section-wrapper">
        <motion.div
          variants={fadeUp()}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-16"
        >
          <p className="section-label mb-3">About Me</p>
          <h2 className="text-gray-100">{content?.whoAmI?.title || 'Who I Am'}</h2>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Text column */}
          <motion.div
            variants={fadeUp(0.1)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-3 space-y-8"
          >
            {/* Who I Am */}
            <p className="text-gray-300 leading-relaxed text-base">
              {content?.whoAmI?.description ||
                "I'm a Software Engineer passionate about building clean, performant web applications. I've worked on real-world end-to-end projects using React, Next.js, Node.js, and MongoDB — always with an eye for good UX and maintainable code."}
            </p>

            {/* AI/ML Philosophy */}
            {(content?.philosophy?.description || content?.philosophy?.aiMLApproach) && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <HiLightBulb className="text-violet-400" size={20} />
                  <h3 className="text-white font-semibold">{content?.philosophy?.title || 'My Philosophy'}</h3>
                </div>
                {content?.philosophy?.description && (
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {content.philosophy.description}
                  </p>
                )}
                {content?.philosophy?.aiMLApproach && (
                  <div className="border-t border-white/10 pt-4">
                    <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-2">AI/ML Approach</p>
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {content.philosophy.aiMLApproach}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Personal Interests */}
            {content?.interests?.items?.length > 0 && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <HiHeart className="text-pink-400" size={20} />
                  <h3 className="text-white font-semibold">{content?.interests?.title || 'Personal Interests'}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {content.interests.items.map((interest, index) => (
                    <div key={index} className="flex items-start gap-3">
                      {interest.icon && (
                        <span className="text-2xl" aria-hidden="true">{interest.icon}</span>
                      )}
                      <div>
                        <p className="text-white font-medium text-sm">{interest.name}</p>
                        <p className="text-gray-400 text-xs mt-1">{interest.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Professional Values */}
            {content?.values?.items?.length > 0 && (
              <div className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <HiStar className="text-amber-400" size={20} />
                  <h3 className="text-white font-semibold">{content?.values?.title || 'Professional Values'}</h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {content.values.items.map((value, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <span className="text-violet-400 mt-1 flex-shrink-0" aria-hidden="true">▸</span>
                      <div>
                        <p className="text-white font-medium text-sm">{value.name}</p>
                        <p className="text-gray-400 text-xs mt-1">{value.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Current roles */}
            {currentJobs.length > 0 && (
              <div className="glass-card p-4 space-y-2">
                <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-3">Currently</p>
                {currentJobs.map((job) => (
                  <div key={job._id} className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" aria-hidden="true" />
                    <span className="text-sm text-gray-300">
                      <span className="font-medium text-white">{job.title}</span>
                      <span className="text-gray-500"> @ {job.company}</span>
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Resume button */}
            {content?.resume?.fileUrl && (
              <a
                href={content.resume.fileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary w-fit"
              >
                <HiDownload size={16} />
                {content.resume.buttonText || 'Download Resume'}
              </a>
            )}
          </motion.div>

          {/* Stats column */}
          <motion.div
            variants={fadeUp(0.2)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="lg:col-span-2 grid grid-cols-1 gap-4"
          >
            {stats.map(({ label, value }) => (
              <div key={label} className="glass-card p-6 text-center hover:border-violet-500/30 transition-colors duration-300">
                <p className="text-4xl font-bold gradient-text mb-1">{value}</p>
                <p className="text-sm text-gray-400">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
