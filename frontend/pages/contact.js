import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import Contact from '@/components/Contact/Contact'
import Hero from '@/components/Hero/Hero'
import { contactAPI, settingsAPI } from '@/lib/api'

export default function ContactPage() {
  const [settings, setSettings] = useState(null)
  const [contactData, setContactData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsRes, contactRes] = await Promise.allSettled([
          settingsAPI.get(),
          contactAPI.get(),
        ])

        if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data.settings)
        if (contactRes.status === 'fulfilled') setContactData(contactRes.value.data.contact)
      } catch (err) {
        console.error('Error fetching content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const siteTitle = settings?.siteName || 'Baweke | Contact'
  const siteDescription = settings?.siteDescription || 'Contact Baweke Mekonnen — Software Engineer'

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
          <p className="text-gray-500 text-sm font-mono">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta property="og:title" content={siteTitle} />
        <meta property="og:description" content={siteDescription} />
        {settings?.favicon && <link rel="icon" href={settings.favicon} />}
      </Head>

      <Navbar />

      <main>
        <Hero content={{ title: 'Contact', subtitle: 'Get in touch' }} />
        <Contact content={contactData} />
      </main>
    </>
  )
}
