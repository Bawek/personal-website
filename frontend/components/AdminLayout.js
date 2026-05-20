import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import {
  HiViewGrid, HiFolder, HiLightningBolt, HiBriefcase,
  HiUser, HiMail, HiCog, HiRefresh, HiDocumentText,
  HiLogout, HiMenuAlt2, HiX, HiChevronRight, HiExternalLink,
} from 'react-icons/hi'

const NAV = [
  { label: 'Dashboard',  href: '/admin/dashboard',  icon: HiViewGrid    },
  { label: 'Projects',   href: '/admin/projects',   icon: HiFolder      },
  { label: 'Skills',     href: '/admin/skills',     icon: HiLightningBolt },
  { label: 'Experience', href: '/admin/experience', icon: HiBriefcase   },
  { label: 'About',      href: '/admin/about',      icon: HiUser        },
  { label: 'Contact',    href: '/admin/contact',    icon: HiMail        },
  { label: 'Content',    href: '/admin/content',    icon: HiDocumentText },
  { label: 'Sync',       href: '/admin/sync',       icon: HiRefresh     },
  { label: 'Settings',   href: '/admin/settings',   icon: HiCog         },
]

export default function AdminLayout({ children, title }) {
  const router  = useRouter()
  const [open, setOpen]   = useState(false)
  const [user, setUser]   = useState(null)

  useEffect(() => {
    const u = localStorage.getItem('user')
    if (u) setUser(JSON.parse(u))
  }, [])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/admin/login')
  }

  const isActive = (href) => router.pathname === href || router.pathname.startsWith(href + '/')

  return (
    <div className="min-h-screen bg-[#0f0f17] flex">
      {/* ── Sidebar ── */}
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 bottom-0 z-40 w-64 bg-[#16161e] border-r border-white/5
                    flex flex-col transition-transform duration-300
                    ${open ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-white/5 flex-shrink-0">
          <Link href="/admin/dashboard" className="font-mono font-bold text-base text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
            baweke<span className="text-violet-400">.</span>admin
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-gray-500 hover:text-white">
            <HiX size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3" aria-label="Admin navigation">
          <ul className="space-y-0.5" role="list">
            {NAV.map(({ label, href, icon: Icon }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                    ${isActive(href)
                      ? 'bg-violet-500/15 text-violet-300 border border-violet-500/20'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  aria-current={isActive(href) ? 'page' : undefined}
                >
                  <Icon size={16} aria-hidden="true" />
                  {label}
                  {isActive(href) && <HiChevronRight size={14} className="ml-auto opacity-60" aria-hidden="true" />}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User + actions */}
        <div className="p-3 border-t border-white/5 space-y-1 flex-shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all"
          >
            <HiExternalLink size={16} aria-hidden="true" />
            View Site
          </a>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <HiLogout size={16} aria-hidden="true" />
            Logout
          </button>
          {user && (
            <div className="flex items-center gap-3 px-3 py-2.5 mt-1">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-gray-300 truncate">{user.username}</p>
                <p className="text-xs text-gray-600 capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main area ── */}
      <div className="flex-1 flex flex-col lg:ml-64 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-20 h-16 bg-[#0f0f17]/80 backdrop-blur-md border-b border-white/5 flex items-center px-4 sm:px-6 gap-4 flex-shrink-0">
          <button
            onClick={() => setOpen(true)}
            className="lg:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition"
            aria-label="Open sidebar"
          >
            <HiMenuAlt2 size={20} />
          </button>

          <div className="flex-1 min-w-0">
            {title && (
              <h1 className="text-base font-semibold text-white truncate">{title}</h1>
            )}
          </div>

          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-400 transition-colors font-mono"
          >
            <HiExternalLink size={13} />
            View Site
          </Link>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
