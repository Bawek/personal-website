import { useState } from 'react'
import { useRouter } from 'next/router'
import api from '@/lib/api'
import { motion } from 'framer-motion'
import { HiLockClosed, HiMail, HiEye, HiEyeOff } from 'react-icons/hi'
import AuthProtection from '@/components/AuthProtection'

function LoginForm() {
  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const router = useRouter()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { data } = await api.post('/auth/login', form)
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center p-4 bg-hero-glow">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-violet-600/8 blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <span className="font-mono font-bold text-2xl text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500">
            baweke<span className="text-violet-400">.</span>admin
          </span>
          <p className="text-gray-500 text-sm mt-2">Sign in to manage your portfolio</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          {error && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm" role="alert">
              <HiLockClosed size={14} aria-hidden="true" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                Email
              </label>
              <div className="relative">
                <HiMail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                <input
                  id="email" name="email" type="email" required
                  value={form.email} onChange={handleChange}
                  placeholder="admin@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-200 placeholder-gray-600
                             focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative">
                <HiLockClosed size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" aria-hidden="true" />
                <input
                  id="password" name="password" type={showPw ? 'text' : 'password'} required
                  value={form.password} onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-3 text-sm text-gray-200 placeholder-gray-600
                             focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? <HiEyeOff size={16} /> : <HiEye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm
                         bg-gradient-to-r from-violet-500 to-pink-500 text-white
                         hover:from-violet-400 hover:to-pink-400 transition-all duration-200
                         shadow-lg shadow-violet-500/25 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Signing in…</>
              ) : 'Sign In'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 mt-6">
            Registration is restricted to admin users.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

export default function AdminLogin() {
  return (
    <AuthProtection requireAuth={false}>
      <LoginForm />
    </AuthProtection>
  )
}
