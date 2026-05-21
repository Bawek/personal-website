import { useState, useEffect } from 'react'
import { HiArrowUp } from 'react-icons/hi'

export default function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!visible) return null

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-full bg-violet-600 text-white shadow-lg shadow-violet-900/40
                 hover:bg-violet-500 transition-all flex items-center justify-center border border-violet-400/30"
      aria-label="Back to top"
    >
      <HiArrowUp size={18} />
    </button>
  )
}
