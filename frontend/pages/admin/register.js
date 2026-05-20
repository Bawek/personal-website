import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { motion } from 'framer-motion'
import { HiLockClosed, HiMail, HiUser, HiShieldCheck } from 'react-icons/hi'

const ROLES = [
  { value: 'admin',  label: 'Admin',  desc: 'Full access to all features and user management' },
  { value: 'editor', label: 'Editor', desc: 'Can create and edit content, but not manage users' },
  { value: 'viewer', label: 'Viewer', desc: 'Read-only access to content' },
]

export default function AdminRegister() {
  const [form, setForm]       = useState({ username: '', email: '', password: '', confirmPassword: '', role: 'viewer' })
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const router = useRouter()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    setLoading(true); setError('')
    try {
      const { confirmPassword, ...data } = form
      const res = await axios.post('/api/auth/register', data)
      localStorage.setItem('token', res.data.token)
      localStorage.setItem('user', JSON.stringify(res.data.user))
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center p-4">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <span className="font-mono font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
            baweke<span className="text-violet-400">.</span>admin
          </span>
          <p className="text-gray-500 text-sm mt-2">Create a new account</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Username</label>
              <div className="relative">
                <HiUser size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="username" name="username" type="text" required minLength={3}
                  value={form.username} onChange={handleChange} placeholder="Choose a username"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Email</label>
              <div className="relative">
                <HiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="email" name="email" type="email" required
                  value={form.email} onChange={handleChange} placeholder="admin@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Role</label>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map(({ value, label }) => (
                  <button key={value} type="button" onClick={() => setForm({ ...form, role: value })}
                    className={`py-2 px-3 rounded-xl text-xs font-medium border transition-all
                      ${form.role === value
                        ? 'bg-violet-500/20 border-violet-500/50 text-violet-300'
                        : 'border-white/10 text-gray-500 hover:border-white/20 hover:text-gray-300'}`}>
                    {label}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-600 mt-1.5">
                {ROLES.find(r => r.value === form.role)?.desc}
              </p>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Password</label>
              <div className="relative">
                <HiLockClosed size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="password" name="password" type="password" required minLength={6}
                  value={form.password} onChange={handleChange} placeholder="Min 6 characters"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Confirm Password</label>
              <div className="relative">
                <HiShieldCheck size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input id="confirmPassword" name="confirmPassword" type="password" required
                  value={form.confirmPassword} onChange={handleChange} placeholder="Repeat password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all" />
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                         bg-gradient-to-r from-violet-500 to-pink-500 text-white hover:from-violet-400 hover:to-pink-400
                         transition-all duration-200 shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {loading ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Creating…</> : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{' '}
            <Link href="/admin/login" className="text-violet-400 hover:text-violet-300 transition-colors">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}
