import Head from 'next/head'
import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'
import Contact from '@/components/Contact/Contact'
import AdminLoginButton from '@/components/AdminLoginButton'
import { AnimatePresence, motion } from 'framer-motion'
import { projectsAPI, skillsAPI, experienceAPI, aboutAPI, contactAPI, settingsAPI } from '@/lib/api'

export default function Home() {
  const [settings, setSettings] = useState(null)
  const [aboutData, setAboutData] = useState(null)
  const [contactData, setContactData] = useState(null)
  const [skills, setSkills] = useState([])
  const [projects, setProjects] = useState([])
  const [experience, setExperience] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchContent()
  }, [])

  const fetchContent = async () => {
    try {
      // Fetch all data from new APIs
      const [settingsResponse, aboutResponse, contactResponse, skillsResponse, projectsResponse, experienceResponse] = await Promise.all([
        settingsAPI.get(),
        aboutAPI.get(),
        contactAPI.get(),
        skillsAPI.getAll(),
        projectsAPI.getAll(),
        experienceAPI.getAll()
      ])

      setSettings(settingsResponse.data.settings)
      setAboutData(aboutResponse.data.about)
      setContactData(contactResponse.data.contact)
      setSkills(skillsResponse.data.skills || [])
      setProjects(projectsResponse.data.projects || [])
      setExperience(experienceResponse.data.experiences || [])
    } catch (error) {
      console.error('Error fetching content:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const siteTitle = settings?.siteName || 'Baweke | Front-End Developer'
  const siteDescription = settings?.siteDescription || 'Welcome to my personal website'

  return (
    <>
      <Head>
        <title>{siteTitle}</title>
        <meta name="description" content={siteDescription} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {settings?.favicon && <link rel="icon" href={settings.favicon} />}
      </Head>
      <Navbar />
      <AnimatePresence>
        <Hero content={aboutData?.hero} />
        <About content={aboutData} experience={experience} />
        <Experience experience={experience} />
        <Skills skills={skills} />
        <Projects projects={projects} />
        <Contact content={contactData} />
      </AnimatePresence>
      <AdminLoginButton />
    </>
  )
}
