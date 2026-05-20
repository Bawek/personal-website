import { createContext, useContext, useState, useEffect } from 'react'
import { detectLanguage } from '@/lib/i18n'

export const LanguageContext = createContext({
  language: 'en',
  setLanguage: () => {},
})

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState('en')

  useEffect(() => {
    const saved = typeof window !== 'undefined'
      ? localStorage.getItem('language')
      : null
    setLanguageState(saved || detectLanguage())
  }, [])

  const setLanguage = (lang) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang)
    }
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}
