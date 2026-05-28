import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import Navbar from '@/components/Navbar/Navbar'
import Hero from '@/components/Hero/Hero'
import About from '@/components/About/About'
import AdminLoginButton from '@/components/AdminLoginButton'
import SeoHead, { personJsonLd } from '@/components/SeoHead/SeoHead'
import { projectsAPI, skillsAPI, experienceAPI, aboutAPI, contactAPI, settingsAPI } from '@/lib/api'
import { motion } from 'framer-motion'
import { HiArrowRight } from 'react-icons/hi'

// Lazy load heavy components with ssr disabled to prevent hydration issues
const LatestArticles = dynamic(() => import('@/components/LatestArticles/LatestArticles'), { 
  ssr: false,
  loading: () => null 
})
const Testimonials = dynamic(() => import('@/components/Testimonials/Testimonials'), { 
  ssr: false,
  loading: () => null 
})
const Contact = dynamic(() => import('@/components/Contact/Contact'), { 
  ssr: false,
  loading: () => null 
})

// Featured Projects Component
function FeaturedProjects({ projects }) {
  if (!projects || projects.length === 0) return null
  
  const featured = projects.filter(p => p.featured).slice(0, 3)
  if (featured.length === 0) return null

  return (
    <section id="projects" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="section-label mb-3">Portfolio</p>
            <h2 className="text-gray-100">Featured Projects</h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              A selection of my recent work and case studies.
            </p>
          </div>
          <Link href="/projects" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-mono text-sm">
            View All <HiArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((project, idx) => (
            <motion.a
              key={project._id}
              href={project.liveUrl || '#'}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="group glass-card p-6 hover:border-violet-500/30 transition-all duration-300"
            >
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-violet-400 transition-colors">{project.title}</h3>
              <p className="text-sm text-gray-400 mb-4">{project.description}</p>
              <div className="flex flex-wrap gap-2">
                {(project.techStack || []).slice(0, 3).map((tech) => (
                  <span key={tech} className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                    {tech}
                  </span>
                ))}
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  )
}

// Featured Skills Component
function FeaturedSkills({ skills }) {
  if (!skills || skills.length === 0) return null
  
  const topSkills = skills.slice(0, 6)

  return (
    <section id="skills" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="section-label mb-3">Expertise</p>
            <h2 className="text-gray-100">Top Skills</h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              Technologies and tools I work with regularly.
            </p>
          </div>
          <Link href="/skills" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-mono text-sm">
            View All <HiArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {topSkills.map((skill, idx) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              className="glass-card p-4 hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-white">{skill.name}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20 capitalize">
                  {skill.level || 'Intermediate'}
                </span>
              </div>
              {skill.description && <p className="text-xs text-gray-500">{skill.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Featured Experience Component
function FeaturedExperience({ experience }) {
  if (!experience || experience.length === 0) return null
  
  const featured = experience.slice(0, 3)

  return (
    <section id="experience" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 flex items-end justify-between"
        >
          <div>
            <p className="section-label mb-3">Career</p>
            <h2 className="text-gray-100">Experience & Education</h2>
            <p className="text-gray-400 mt-3 max-w-xl">
              Work history, education, and professional development.
            </p>
          </div>
          <Link href="/experience" className="flex items-center gap-2 text-violet-400 hover:text-violet-300 transition-colors font-mono text-sm">
            View All <HiArrowRight size={16} />
          </Link>
        </motion.div>

        <div className="space-y-4">
          {featured.map((item, idx) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="glass-card p-6 hover:border-violet-500/30 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-white">{item.title}</h3>
                  <p className="text-sm text-violet-400">{item.company || item.institution}</p>
                </div>
                <span className="text-xs text-gray-500 font-mono whitespace-nowrap ml-4">
                  {item.startDate && new Date(item.startDate).getFullYear()}
                </span>
              </div>
              {item.description && <p className="text-sm text-gray-400">{item.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

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
        
        {/* Featured Sections with View All Links */}
        {experience.length > 0 && <FeaturedExperience experience={experience} />}
        {skills.length > 0 && <FeaturedSkills skills={skills} />}
        {projects.length > 0 && <FeaturedProjects projects={projects} />}
        
        <LatestArticles limit={3} />
        <Testimonials />
        <Contact content={contactData} settings={settings} />
      </main>

      <AdminLoginButton />
    </>
  )
}
