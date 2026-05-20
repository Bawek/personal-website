import '@/styles/globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'

export default function App({ Component, pageProps }) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  )
}
