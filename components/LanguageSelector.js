import { useState } from 'react'
import { useLanguage } from '@/lib/LanguageContext'
import { HiChevronDown } from 'react-icons/hi'

const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'am', name: 'Amharic', flag: '🇪🇹' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
]

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage()
  const [open, setOpen] = useState(false)

  const current = LANGUAGES.find(l => l.code === language) || LANGUAGES[0]

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/10 text-gray-300
                   hover:border-violet-500/40 hover:text-white transition-all duration-200 text-sm"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.name}</span>
        <HiChevronDown
          size={14}
          className={`text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          <div
            role="listbox"
            aria-label="Select language"
            className="absolute right-0 mt-2 w-44 z-50 bg-[#16161e] border border-white/10 rounded-xl shadow-xl shadow-black/40 overflow-hidden"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                role="option"
                aria-selected={language === lang.code}
                onClick={() => { setLanguage(lang.code); setOpen(false) }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors
                  ${language === lang.code
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  }`}
              >
                <span aria-hidden="true">{lang.flag}</span>
                <span>{lang.name}</span>
                {language === lang.code && (
                  <svg className="w-3.5 h-3.5 ml-auto text-violet-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
