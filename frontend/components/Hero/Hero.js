import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { AiOutlineMail } from 'react-icons/ai'
import { HiArrowDown } from 'react-icons/hi'
import { motion } from 'framer-motion'
import Typewriter from 'typewriter-effect'

const SOCIAL_LINKS = [
  {
    href: 'https://github.com/Bawek',
    icon: FaGithub,
    label: 'GitHub',
  },
  {
    href: 'https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/',
    icon: FaLinkedinIn,
    label: 'LinkedIn',
  },
  {
    href: 'mailto:bawekeasres@gmail.com',
    icon: AiOutlineMail,
    label: 'Email',
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Hero({ content }) {
  const subtitle = content?.subtitle || 'I love to learn new technologies'

  // Extract just the name from the hero title.
  // The About model stores "Hello, I am Baweke" — we want just "Baweke".
  // Fall back gracefully if the title is in a different format.
  const rawTitle = content?.title || ''
  const nameMatch = rawTitle.match(/(?:Hello,?\s+I(?:'m| am)\s+)(.+)/i)
  const displayName = nameMatch ? nameMatch[1] : (rawTitle || 'Baweke')

  return (
    <section
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      aria-label="Hero"
    >
      {/* Background glow */}
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
        className="section-wrapper relative z-10 text-center pt-24 pb-16"
      >
        {/* Greeting badge */}
        <motion.div variants={item} className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-sm font-mono">
            <span className="w-2 h-2 rounded-full bg-violet-400 animate-pulse" aria-hidden="true" />
            Available for work
          </span>
        </motion.div>

        {/* Name */}
        <motion.h1 variants={item} className="mb-4">
          <span className="text-gray-100">Hi, I&apos;m </span>
          <span className="gradient-text">{displayName}</span>
        </motion.h1>

        {/* Typewriter subtitle */}
        <motion.div
          variants={item}
          className="text-xl sm:text-2xl text-gray-400 font-light mb-6 h-8"
          aria-live="polite"
        >
          <Typewriter
            options={{ autoStart: true, loop: true, delay: 50, deleteSpeed: 30 }}
            onInit={(tw) => {
              tw
                .typeString(subtitle)
                .pauseFor(1500)
                .deleteAll()
                .typeString('A Software Engineer')
                .pauseFor(1500)
                .deleteAll()
                .typeString('I love to code.')
                .pauseFor(1500)
                .deleteAll()
                .start()
            }}
          />
        </motion.div>

        {/* Description */}
        {content?.description && (
          <motion.p
            variants={item}
            className="max-w-xl mx-auto text-gray-400 text-base leading-relaxed mb-8"
          >
            {content.description}
          </motion.p>
        )}

        {/* CTA buttons */}
        <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <a href="/#projects" className="btn-primary">
            View My Work
          </a>
          <a href="/#contact" className="btn-ghost">
            Get In Touch
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div variants={item} className="flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map(({ href, icon: Icon, label }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith('mailto') ? undefined : '_blank'}
              rel={href.startsWith('mailto') ? undefined : 'noreferrer'}
              className="btn-icon"
              aria-label={label}
            >
              <Icon size={18} />
            </a>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.a
        href="/#about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-500 hover:text-violet-400 transition-colors"
        aria-label="Scroll to About"
      >
        <span className="text-xs font-mono tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
        >
          <HiArrowDown size={16} />
        </motion.div>
      </motion.a>
    </section>
  )
}
