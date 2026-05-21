import { HiSun, HiMoon, HiOutlineZoomIn, HiOutlineZoomOut } from 'react-icons/hi'
import { useTheme } from '@/lib/ThemeContext'

export default function ThemeToggle({ className = '' }) {
  const { theme, fontScale, toggleTheme, setFontScale } = useTheme()

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={toggleTheme}
        className="btn-icon"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      >
        {theme === 'dark' ? <HiSun size={16} /> : <HiMoon size={16} />}
      </button>
      <button
        type="button"
        onClick={() => setFontScale(fontScale === 'large' ? 'normal' : 'large')}
        className="btn-icon"
        aria-label={fontScale === 'large' ? 'Normal font size' : 'Larger font size'}
        title="Adjust font size"
      >
        {fontScale === 'large' ? <HiOutlineZoomOut size={16} /> : <HiOutlineZoomIn size={16} />}
      </button>
    </div>
  )
}
