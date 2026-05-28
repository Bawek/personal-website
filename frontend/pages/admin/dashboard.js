import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import {
  HiFolder, HiStar, HiLightningBolt, HiBriefcase, HiUsers,
  HiArrowRight, HiPlus,
} from 'react-icons/hi'
import AdminLayout from '@/components/AdminLayout'
import AuthProtection from '@/components/AuthProtection'

const QUICK_ACTIONS = [
  { label: 'Projects',   href: '/admin/projects',   color: 'from-violet-500 to-purple-600' },
  { label: 'Skills',     href: '/admin/skills',     color: 'from-blue-500 to-cyan-600'    },
  { label: 'Experience', href: '/admin/experience', color: 'from-emerald-500 to-teal-600' },
  { label: 'About',      href: '/admin/about',      color: 'from-amber-500 to-orange-600' },
  { label: 'Contact',    href: '/admin/contact',    color: 'from-pink-500 to-rose-600'    },
  { label: 'Chat',       href: '/admin/chat',       color: 'from-cyan-500 to-blue-600'    },
  { label: 'Chat Settings', href: '/admin/chat-settings', color: 'from-indigo-500 to-purple-600' },
  { label: 'Settings',   href: '/admin/settings',   color: 'from-gray-500 to-slate-600'   },
]

function StatCard({ label, value, icon: Icon, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-colors"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center`}>
          <Icon size={18} className="text-white" aria-hidden="true" />
        </div>
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </motion.div>
  )
}

function DashboardContent() {
  const [stats, setStats]   = useState({ totalProjects: 0, featuredProjects: 0, totalSkills: 0, totalExperience: 0, totalUsers: 0 })
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token')
      const headers = { Authorization: `Bearer ${token}` }
      const [pR, sR, eR, uR] = await Promise.allSettled([
        api.get('/projects',  { headers }),
        api.get('/skills',    { headers }),
        api.get('/experience',{ headers }),
        api.get('/users',     { headers }),
      ])
      const projects    = pR.status === 'fulfilled' ? pR.value.data.projects    || [] : []
      const skills      = sR.status === 'fulfilled' ? sR.value.data.skills      || [] : []
      const experiences = eR.status === 'fulfilled' ? eR.value.data.experiences || [] : []
      const users       = uR.status === 'fulfilled' ? uR.value.data.users       || [] : []
      setStats({ totalProjects: projects.length, featuredProjects: projects.filter(p => p.featured).length, totalSkills: skills.length, totalExperience: experiences.length, totalUsers: users.length })
      setRecent(projects.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5))
      setLoading(false)
    }
    fetchData()
  }, [])

  const STATS = [
    { label: 'Total Projects',    value: stats.totalProjects,    icon: HiFolder,       color: 'from-violet-500 to-purple-600', delay: 0    },
    { label: 'Featured Projects', value: stats.featuredProjects, icon: HiStar,         color: 'from-amber-500 to-orange-600',  delay: 0.05 },
    { label: 'Skills',            value: stats.totalSkills,      icon: HiLightningBolt,color: 'from-blue-500 to-cyan-600',     delay: 0.1  },
    { label: 'Experience',        value: stats.totalExperience,  icon: HiBriefcase,    color: 'from-emerald-500 to-teal-600',  delay: 0.15 },
    { label: 'Users',             value: stats.totalUsers,       icon: HiUsers,        color: 'from-pink-500 to-rose-600',     delay: 0.2  },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {STATS.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {QUICK_ACTIONS.map(({ label, href, color }) => (
            <Link key={href} href={href}
              className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/10 rounded-xl
                         hover:border-white/20 hover:bg-white/8 transition-all group">
              <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{label}</span>
              <HiArrowRight size={14} className="text-gray-600 group-hover:text-violet-400 transition-colors" />
            </Link>
          ))}
        </div>
      </motion.div>

      {/* Recent projects */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-mono text-gray-500 uppercase tracking-widest">Recent Projects</h2>
          <Link href="/admin/projects" className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1">
            View all <HiArrowRight size={12} />
          </Link>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
          {recent.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-600">
              <HiFolder size={32} className="mb-3 opacity-40" />
              <p className="text-sm">No projects yet</p>
              <Link href="/admin/projects" className="mt-3 text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
                <HiPlus size={12} /> Add your first project
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {recent.map((p) => (
                <div key={p._id} className="flex items-center justify-between px-5 py-3.5 hover:bg-white/3 transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-200 truncate">{p.title}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    {p.featured && (
                      <span className="px-2 py-0.5 text-xs rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono">Featured</span>
                    )}
                    <Link href="/admin/projects" className="text-xs text-violet-400 hover:text-violet-300 transition-colors">Edit</Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <AuthProtection requireAuth={true}>
      <AdminLayout title="Dashboard">
        <DashboardContent />
      </AdminLayout>
    </AuthProtection>
  )
}
