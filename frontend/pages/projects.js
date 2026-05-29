import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import Projects from '@/components/Projects/Projects'
import Hero from '@/components/Hero/Hero'
import { projectsAPI, settingsAPI } from '@/lib/api'

export default function ProjectsPage() {
  const [settings, setSettings] = useState(null)
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [settingsRes, projectsRes] = await Promise.allSettled([
          settingsAPI.get(),
          projectsAPI.getAll(),
        ])

        if (settingsRes.status === 'fulfilled') setSettings(settingsRes.value.data.settings)
        if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.data.projects || [])
      } catch (err) {
        console.error('Error fetching content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const siteTitle = settings?.siteName || 'Baweke | Projects'
  const siteDescription = settings?.siteDescription || 'Projects of Baweke Mekonnen — Software Engineer'

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
      </Head>

      <Navbar />

      <main>
        <Hero content={{ title: 'Projects', subtitle: 'What I\'ve built' }} />
        <Projects projects={projects} />
      </main>
    </>
  )
}
