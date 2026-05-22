import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function AuthProtection({ children, requireAuth = true, allowedRoles = [] }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userText = localStorage.getItem('user')
    const user = userText ? JSON.parse(userText) : null
    const ok = !!(token && user)
    setAuthed(ok)

    if (requireAuth && !ok) {
      router.replace('/admin/login')
      return
    }

    if (allowedRoles.length && user && !allowedRoles.includes(user.role)) {
      router.replace('/admin/dashboard')
      return
    }

    if (!requireAuth && ok) {
      router.replace('/admin/dashboard')
      return
    }

    setReady(true)
  }, [router, requireAuth, allowedRoles])

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-mono">Loading…</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
