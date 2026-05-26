import '@/styles/globals.css'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import BackToTop from '@/components/BackToTop/BackToTop'
import Head from 'next/head'


export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <Head>
          <link rel="icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
          <link rel="apple-touch-icon" href="/favicon.ico" />
          <meta name="theme-color" content="#1a1a2e" />
        </Head>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Component {...pageProps} />
        <BackToTop />
      </LanguageProvider>
    </ThemeProvider>
  )
}
