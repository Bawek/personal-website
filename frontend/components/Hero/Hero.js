import Image from 'next/image'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { AiOutlineMail } from 'react-icons/ai'
import { HiArrowDown } from 'react-icons/hi'
import { motion } from 'framer-motion'
import Typewriter from 'typewriter-effect'
import Link from 'next/link'

const SOCIAL_LINKS = [
  { href: 'https://github.com/Bawek', icon: FaGithub, label: 'GitHub' },
  { href: 'https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/', icon: FaLinkedinIn, label: 'LinkedIn' },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

function formatLastUpdated(date) {
  if (!date) return null
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return null
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default function Hero({ content, lastUpdated, statusWidgets }) {
  const subtitle = content?.subtitle || 'AI Engineer building production-ready machine learning systems'
  const rawTitle = content?.title || ''
  const nameMatch = rawTitle.match(/(?:Hello,?\s+I(?:'m| am)\s+)(.+)/i)
  const displayName = nameMatch ? nameMatch[1] : (rawTitle || 'Baweke Mekonnen')
  const photoUrl = content?.imageUrl
  const updatedLabel = formatLastUpdated(lastUpdated || content?.lastUpdated)
  const building = statusWidgets?.currentlyBuilding
  const reading = statusWidgets?.currentlyReading

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      <div className="absolute inset-0 bg-hero-glow pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full
                   bg-violet-600/10 blur-[120px] pointer-events-none"
        aria-hidden="true"
      />

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="section-wrapper relative z-10 pt-24 pb-16 w-full"
      >
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          {/* Photo */}
          {photoUrl && (
            <motion.div variants={item} className="flex-shrink-0">
              <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-2 border-violet-500/30 shadow-xl shadow-violet-900/30">
                <Image
                  src={photoUrl}
                  alt={`Professional photo of ${displayName}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 160px, 192px"
                  priority
                />
              </div>
            </motion.div>
          )}

          <div className="flex-1 text-center lg:text-left">
            <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
                Available for work
              </span>
              {updatedLabel && (
                <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-gray-400 text-xs font-mono">
                  Updated {updatedLabel}
                </span>
              )}
            </motion.div>

            <motion.h1 variants={item} className="mb-4">
              <span className="text-gray-100 block text-lg sm:text-xl font-normal mb-1">{displayName}</span>
              <span className="gradient-text text-3xl sm:text-4xl md:text-5xl block leading-tight">
                {subtitle.split('.')[0] || subtitle}
              </span>
            </motion.h1>

            <motion.div
              variants={item}
              className="text-lg sm:text-xl text-gray-400 font-light mb-6 h-8"
              aria-live="polite"
            >
              <Typewriter
                options={{ autoStart: true, loop: true, delay: 50, deleteSpeed: 30 }}
                onInit={(tw) => {
                  tw
                    .typeString(subtitle)
                    .pauseFor(1500)
                    .deleteAll()
                    .typeString('Machine Learning & AI Systems')
                    .pauseFor(1500)
                    .deleteAll()
                    .typeString('Software Engineering')
                    .pauseFor(1500)
                    .deleteAll()
                    .start()
                }}
              />
            </motion.div>

            {content?.description && (
              <motion.p variants={item} className="max-w-xl mx-auto lg:mx-0 text-gray-400 text-base leading-relaxed mb-6">
                {content.description}
              </motion.p>
            )}

            {(building || reading) && (
              <motion.div variants={item} className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8 text-xs font-mono">
                {building && (
                  <span className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    Building: {building}
                  </span>
                )}
                {reading && (
                  <span className="px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-300">
                    Reading: {reading}
                  </span>
                )}
              </motion.div>
            )}

            <motion.div variants={item} className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10">
              <Link href="/projects" className="btn-primary">View My Work</Link>
              <Link href="/blog" className="btn-ghost">Read My Blog</Link>
              <Link href="/contact" className="btn-ghost">Get in Touch</Link>
            </motion.div>

            <motion.div variants={item} className="flex items-center justify-center lg:justify-start gap-3">
              {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
                <a key={label} href={href} target="_blank" rel="noreferrer" className="btn-icon" aria-label={label}>
                  <Icon size={18} />
                </a>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        aria-label="Learn more about me"
      >
        <Link href="/about" className="flex flex-col items-center gap-2 text-gray-500 hover:text-violet-400 transition-colors">
          <span className="text-xs font-mono tracking-widest uppercase">Learn More</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}>
            <HiArrowDown size={16} />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  )
}
