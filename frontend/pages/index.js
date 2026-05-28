import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import Experience from '@/components/Experience/Experience'
import Skills from '@/components/Skills/Skills'
import Projects from '@/components/Projects/Projects'
import LatestArticles from '@/components/LatestArticles/LatestArticles'
import Testimonials from '@/components/Testimonials/Testimonials'
import Contact from '@/components/Contact/Contact'
import AdminLoginButton from '@/components/AdminLoginButton'
import SeoHead, { personJsonLd } from '@/components/SeoHead/SeoHead'
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
    const fetchAll = async () => {
      try {
        const [settingsRes, aboutRes, contactRes, skillsRes, projectsRes, experienceRes] =
          await Promise.allSettled([
            settingsAPI.get(),
            aboutAPI.get(),
            contactAPI.get(),
            skillsAPI.getAll(),
            projectsAPI.getAll(),
            experienceAPI.getAll(),
          ])

        if (settingsRes.status === 'fulfilled') {
          setSettings(settingsRes.value.data.settings)
        }
        if (aboutRes.status === 'fulfilled') setAboutData(aboutRes.value.data.about)
        if (contactRes.status === 'fulfilled') setContactData(contactRes.value.data.contact)
        if (skillsRes.status === 'fulfilled') setSkills(skillsRes.value.data.skills || [])
        if (projectsRes.status === 'fulfilled') setProjects(projectsRes.value.data.projects || [])
        if (experienceRes.status === 'fulfilled') setExperience(experienceRes.value.data.experiences || [])
      } catch (err) {
        console.error('Error fetching content:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const siteTitle = settings?.seo?.metaTitle || settings?.siteName || 'Baweke Mekonnen | AI & ML Engineer'
  const siteDescription =
    settings?.seo?.metaDescription ||
    settings?.siteDescription ||
    'Software Developer and AI/ML Engineer — portfolio, projects, and technical writing.'

  const jsonLd = personJsonLd({
    name: 'Baweke Mekonnen',
    jobTitle: aboutData?.hero?.subtitle || 'AI & ML Engineer',
    description: siteDescription,
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://baweke.dev',
    image: aboutData?.hero?.imageUrl,
    sameAs: [
      'https://github.com/Bawek',
      'https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/',
    ],
  })

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
      <SeoHead
        title={siteTitle}
        description={siteDescription}
        keywords={settings?.seo?.keywords}
        jsonLd={jsonLd}
      />

      <Navbar />

      <main id="main-content">
        <Hero
          content={aboutData?.hero}
          lastUpdated={settings?.widgets?.siteLastUpdated || aboutData?.updatedAt}
          statusWidgets={settings?.widgets}
        />
        <About content={aboutData} experience={experience} />
        <Experience experience={experience} />
        <Skills skills={skills} />
        <Projects projects={projects} showFilters />
        <LatestArticles limit={3} />
        <Testimonials />
        <Contact content={contactData} settings={settings} />
      </main>

      <AdminLoginButton />
    </>
  )
}
