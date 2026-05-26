import '@/styles/globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import { DarkModeProvider } from '@/lib/DarkModeContext'

export default function App({ Component, pageProps }) {
  return (
    <DarkModeProvider>
      <LanguageProvider>
        <Component {...pageProps} />
      </LanguageProvider>
    </DarkModeProvider>
  )
}
