import '@/styles/globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import BackToTop from '@/components/BackToTop/BackToTop'

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Component {...pageProps} />
        <BackToTop />
      </LanguageProvider>
    </ThemeProvider>
  )
}
