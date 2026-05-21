import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '@/components/ThemeToggle/ThemeToggle'
import SiteSearch from '@/components/SiteSearch/SiteSearch'

const NAV_LINKS = [
  { label: 'About',      href: '/about'      },
  { label: 'Experience', href: '/experience' },
  { label: 'Skills',     href: '/skills'     },
  { label: 'Projects',   href: '/projects'   },
  { label: 'Blog',       href: '/blog'       },
  { label: 'Contact',    href: '/contact'    },
]

function navLinkClass(active) {
  return `px-4 py-2 text-sm rounded-lg transition-all duration-200 font-medium ${
    active
      ? 'text-white bg-violet-500/20 border border-violet-500/40'
      : 'text-gray-400 hover:text-white hover:bg-white/5'
  }`
}

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const router = useRouter()

  const isActive = (href) => {
    if (href === '/') return router.pathname === '/'
    return router.pathname === href || router.pathname.startsWith(`${href}/`)
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const close = () => setOpen(false)
    window.addEventListener('resize', close)
    router.events?.on('routeChangeComplete', close)
    return () => {
      window.removeEventListener('resize', close)
      router.events?.off('routeChangeComplete', close)
    }
  }, [router.events])

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
          <Link
            href="/"
            className="font-mono font-bold text-lg gradient-text hover:opacity-80 transition-opacity"
            aria-label="Home"
            aria-current={router.pathname === '/' ? 'page' : undefined}
          >
            baweke<span className="text-violet-400">.</span>dev
          </Link>

          <ul className="hidden md:flex items-center gap-1" role="list">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <Link href={href} className={navLinkClass(isActive(href))} aria-current={isActive(href) ? 'page' : undefined}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="hidden md:flex items-center gap-2">
            <SiteSearch />
            <ThemeToggle />
            <a href="https://github.com/Bawek" target="_blank" rel="noreferrer" className="btn-icon" aria-label="GitHub">
              <FaGithub size={16} />
            </a>
            <a href="https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/" target="_blank" rel="noreferrer" className="btn-icon" aria-label="LinkedIn">
              <FaLinkedinIn size={16} />
            </a>
            <Link href="/contact" className="btn-primary text-xs py-2 px-4">Hire Me</Link>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <SiteSearch />
            <ThemeToggle />
            <button
              onClick={() => setOpen(!open)}
              className="btn-icon"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <AiOutlineClose size={18} /> : <AiOutlineMenu size={18} />}
            </button>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
            />
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
                <button onClick={() => setOpen(false)} className="btn-icon" aria-label="Close menu">
                  <AiOutlineClose size={16} />
                </button>
              </div>
              <ul className="flex flex-col gap-1 flex-1" role="list">
                {NAV_LINKS.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      onClick={() => setOpen(false)}
                      className={`block px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                        isActive(href) ? 'text-white bg-violet-500/15' : 'text-gray-300 hover:text-white hover:bg-white/5'
                      }`}
                      aria-current={isActive(href) ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
              <div className="pt-6 border-t border-white/10">
                <Link href="/contact" onClick={() => setOpen(false)} className="btn-primary w-full justify-center mb-4">
                  Hire Me
                </Link>
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
