import { useState, useEffect } from 'react'
import Link from 'next/link'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'

const NAV_LINKS = [
  { label: 'About',      href: '/#about'    },
  { label: 'Experience', href: '/#experience'},
  { label: 'Skills',     href: '/#skills'   },
  { label: 'Projects',   href: '/#projects' },
  { label: 'Blog',       href: '/blog'      },
  { label: 'Contact',    href: '/#contact'  },
]

export default function Navbar() {
  const [open, setOpen]       = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change / resize
  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    return () => window.removeEventListener('resize', close)
  }, [])

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-bg/80 backdrop-blur-md border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
      >
        <nav className="section-wrapper flex items-center justify-between h-16" aria-label="Main navigation">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono font-bold text-lg gradient-text hover:opacity-80 transition-opacity"
            aria-label="Home"
          >
            baweke<span className="text-violet-400">.</span>dev
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link
                  href={href}
                  className="px-4 py-2 text-sm text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-all duration-200 font-medium"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          {/* Desktop social + CTA */}
          <div className="hidden md:flex items-center gap-3">
            <a
              href="https://github.com/Bawek"
              target="_blank"
              rel="noreferrer"
              className="btn-icon"
              aria-label="GitHub"
            >
              <FaGithub size={16} />
            </a>
            <a
              href="https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/"
              target="_blank"
              rel="noreferrer"
              className="btn-icon"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn size={16} />
            </a>
            <a href="/#contact" className="btn-primary text-xs py-2 px-4">
              Hire Me
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden btn-icon"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? <AiOutlineClose size={18} /> : <AiOutlineMenu size={18} />}
          </button>
        </nav>
      </header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />

            {/* Drawer */}
            <motion.div
              key="drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-surface border-l border-white/10 p-6 flex flex-col md:hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <span className="font-mono font-bold gradient-text">baweke.dev</span>
                <button
                  onClick={() => setOpen(false)}
                  className="btn-icon"
                  aria-label="Close menu"
                >
                  <AiOutlineClose size={16} />
                </button>
              </div>

              <ul className="flex flex-col gap-1 flex-1" role="list">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className="block px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all duration-200 font-medium"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>

              <div className="pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-4 font-mono tracking-widest uppercase">Connect</p>
                <div className="flex gap-3">
                  <a href="https://github.com/Bawek" target="_blank" rel="noreferrer" className="btn-icon" aria-label="GitHub">
                    <FaGithub size={16} />
                  </a>
                  <a href="https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/" target="_blank" rel="noreferrer" className="btn-icon" aria-label="LinkedIn">
                    <FaLinkedinIn size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
