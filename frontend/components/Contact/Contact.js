import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { AiOutlineMail } from 'react-icons/ai'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { contactAPI } from '@/lib/api'
import { obfuscateEmail } from '@/lib/formatEmail'

const PLATFORM_ICONS = { 
  github: FaGithub, 
  linkedin: FaLinkedinIn, 
  email: AiOutlineMail,
  github: FaGithub,
  linkedin: FaLinkedinIn,
}

const INITIAL_FORM = { name: '', email: '', subject: '', message: '', website: '' }

export default function Contact({ content, settings }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    if (form.website) return
    setLoading(true)
    setStatus(null)
    try {
      await contactAPI.sendMessage({
        name: form.name,
        email: form.email,
        subject: form.subject,
        message: form.message,
      })
      setStatus('success')
      setForm(INITIAL_FORM)
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  // Get social links from contact data
  const socialLinks = content?.social?.links && content.social.links.length > 0
    ? content.social.links.map((link) => {
        const key = link.platform?.toLowerCase()
        const Icon = PLATFORM_ICONS[key] || AiOutlineMail
        const isEmail = key === 'email'
        return {
          icon: Icon,
          label: link.platform,
          value: isEmail ? obfuscateEmail(link.url.replace(/^mailto:/, '')) : link.url.replace(/^https?:\/\/(www\.)?/, ''),
          href: isEmail ? null : (link.url.startsWith('http') ? link.url : `https://${link.url}`),
          obfuscated: isEmail,
        }
      })
    : [
        // Fallback to settings contact info if no social links configured
        {
          icon: AiOutlineMail,
          label: 'Email',
          value: settings?.contactInfo?.email ? obfuscateEmail(settings.contactInfo.email) : 'bawekeasres [at] gmail [dot] com',
          href: null,
          obfuscated: true,
        },
        {
          icon: FaLinkedinIn,
          label: 'LinkedIn',
          value: 'baweke-mekonnen-asres',
          href: 'https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/',
          obfuscated: false,
        },
        {
          icon: FaGithub,
          label: 'GitHub',
          value: 'github.com/Bawek',
          href: 'https://github.com/Bawek',
          obfuscated: false,
        },
      ]

  const sectionTitle = content?.hero?.title || 'Get In Touch'
  const sectionSubtitle = content?.hero?.subtitle || 'Have a project in mind or just want to say hi? My inbox is always open.'
  const responseTime = content?.form?.responseTime || settings?.contactInfo?.responseTime || 'I typically respond within 48 hours.'

  return (
    <section id="contact" className="py-24 bg-surface/30">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <p className="section-label mb-3">Contact</p>
          <h2 className="text-gray-100">{sectionTitle}</h2>
          <p className="text-gray-400 mt-3 max-w-xl">{sectionSubtitle}</p>
          <p className="text-sm text-gray-500 mt-2 font-mono">{responseTime}</p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            {socialLinks.map(({ icon: Icon, label, value, href, obfuscated }) =>
              href ? (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="glass-card flex items-center gap-4 p-4 hover:border-violet-500/30 transition-colors duration-300 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <Icon size={16} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
                    <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{value}</p>
                  </div>
                </a>
              ) : (
                <div key={label} className="glass-card flex items-center gap-4 p-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                    <Icon size={16} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
                    <p className="text-sm text-gray-300">{obfuscated ? value : obfuscateEmail(contactEmail || value)}</p>
                  </div>
                </div>
              )
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} noValidate className="glass-card p-6 space-y-5">
              <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                <label htmlFor="contact-website">Website</label>
                <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Name</label>
                  <input id="contact-name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200" />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Email</label>
                  <input id="contact-email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200" />
                </div>
              </div>

              <div>
                <label htmlFor="contact-subject" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                <input id="contact-subject" name="subject" type="text" value={form.subject} onChange={handleChange} placeholder="Project inquiry, collaboration…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200" />
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Message</label>
                <textarea id="contact-message" name="message" required rows={5} value={form.message} onChange={handleChange} placeholder="Tell me about your project…"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200 resize-none" />
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3" role="alert">
                  <HiCheckCircle size={16} aria-hidden="true" />
                  Message sent! I&apos;ll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3" role="alert">
                  <HiXCircle size={16} aria-hidden="true" />
                  Something went wrong. Please try again.
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  'Send Message'
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
