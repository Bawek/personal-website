import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { HiCog, HiLogout } from 'react-icons/hi'

export default function AdminLoginButton() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(!!localStorage.getItem('token'))
    }
  }, [])

  const goToDashboard = () => router.push('/admin/dashboard')
  const goToLogin     = () => router.push('/admin/login')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    router.push('/')
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2">
      {isLoggedIn ? (
        <>
          <button
            onClick={goToDashboard}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/10 text-gray-300 text-sm font-medium
                       hover:border-violet-500/50 hover:text-white transition-all duration-200 shadow-lg shadow-black/30"
            aria-label="Go to admin dashboard"
          >
            <HiCog size={15} aria-hidden="true" />
            Admin
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-surface border border-white/10 text-gray-500
                       hover:border-red-500/50 hover:text-red-400 transition-all duration-200 shadow-lg shadow-black/30"
            aria-label="Logout"
            title="Logout"
          >
            <HiLogout size={15} aria-hidden="true" />
          </button>
        </>
      ) : (
        <button
          onClick={goToLogin}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface border border-white/10 text-gray-500 text-sm
                     hover:border-violet-500/30 hover:text-gray-300 transition-all duration-200 shadow-lg shadow-black/30"
          aria-label="Admin login"
        >
          <HiCog size={15} aria-hidden="true" />
          Admin
        </button>
      )}
    </div>
  )
}
