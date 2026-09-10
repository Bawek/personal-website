import { createContext, useContext, useEffect, useState } from 'react'

const ThemeContext = createContext({
  theme: 'dark',
  fontScale: 'normal',
  setTheme: () => {},
  setFontScale: () => {},
  toggleTheme: () => {},
})

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState('dark')
  const [fontScale, setFontScaleState] = useState('normal')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedTheme = localStorage.getItem('theme')
    const savedScale = localStorage.getItem('fontScale')
    if (savedTheme === 'light' || savedTheme === 'dark') setThemeState(savedTheme)
    if (savedScale === 'normal' || savedScale === 'large') setFontScaleState(savedScale)
  }, [])

  useEffect(() => {
    if (!mounted) return
    document.documentElement.setAttribute('data-theme', theme)
    document.documentElement.setAttribute('data-font-scale', fontScale)
    localStorage.setItem('theme', theme)
    localStorage.setItem('fontScale', fontScale)
  }, [theme, fontScale, mounted])

  const setTheme = (t) => setThemeState(t)
  const setFontScale = (s) => setFontScaleState(s)
  const toggleTheme = () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark'))

  return (
    <ThemeContext.Provider value={{ theme, fontScale, setTheme, setFontScale, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
