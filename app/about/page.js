'use client'

import Head from 'next/head'
import { useState, useEffect } from 'react'
import About from '@/components/About/About'
import Hero from '@/components/Hero/Hero'
import { aboutAPI, experienceAPI, settingsAPI } from '@/lib/api'

export default function AboutPage() {
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [experience, setExperience] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [settingsRes, aboutRes, experienceRes] = await Promise.allSettled([
          settingsAPI.get(),
          aboutAPI.get(),
          experienceAPI.getAll(),
        ])

        if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data.settings)
        if (aboutRes.status === 'fulfilled') setAboutData(aboutRes.value.data.about)
        if (experienceRes.status === 'fulfilled') setExperience(experienceRes.value.data.experiences || [])
      } catch (err) {
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const siteTitle = settings?.siteName || 'Baweke | About'
  const siteDescription = settings?.siteDescription || 'About Baweke Mekonnen — Software Engineer'

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f17] flex items-center justify-center">
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
      </Head>

      <main>
        <Hero content={aboutData?.hero} />
        <About content={aboutData} experience={experience} />
      </main>
    </>
  )
}
