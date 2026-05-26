import { useDarkMode } from '@/lib/DarkModeContext'
import { HiMoon, HiSun } from 'react-icons/hi'

export default function DarkModeToggle() {
  const { darkMode, toggleDarkMode } = useDarkMode()

  return (
    <button
      onClick={toggleDarkMode}
      className="btn-icon"
      aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
      title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {darkMode ? <HiSun size={18} /> : <HiMoon size={18} />}
    </button>
  )
}
