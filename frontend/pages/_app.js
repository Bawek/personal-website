import '@/styles/globals.css'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { LanguageProvider } from '@/lib/LanguageContext'
import { ThemeProvider } from '@/lib/ThemeContext'
import BackToTop from '@/components/BackToTop/BackToTop'
import Footer from '@/components/Footer/Footer'
import Head from 'next/head'
import { settingsAPI } from '@/lib/api'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  const [footerData, setFooterData] = useState(null)
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await settingsAPI.get()
        if (data.settings) {
          setSettings(data.settings)
          setFooterData(data.settings.footer)
        }
      } catch (err) {
        console.error('Error fetching settings:', err)
      }
    }

    fetchSettings()
  }, [])

  // Don't show footer on admin pages
  const isAdminPage = router.pathname.startsWith('/admin')

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
        {!isAdminPage && <Footer footerData={footerData} settings={settings} />}
      </LanguageProvider>
    </ThemeProvider>
  )
}
