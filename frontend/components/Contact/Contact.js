import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedinIn } from 'react-icons/fa'
import { AiOutlineMail } from 'react-icons/ai'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { contactAPI } from '@/lib/api'

// Default contact info — overridden by DB data when available
const DEFAULT_CONTACT = [
  {
    icon: AiOutlineMail,
    label: 'Email',
    value: 'bawekeasres@gmail.com',
    href: 'mailto:bawekeasres@gmail.com',
  },
  {
    icon: FaLinkedinIn,
    label: 'LinkedIn',
    value: 'baweke-mekonnen-asres',
    href: 'https://www.linkedin.com/in/baweke-mekonnen-asres-60a426279/',
  },
  {
    icon: FaGithub,
    label: 'GitHub',
    value: 'github.com/Bawek',
    href: 'https://github.com/Bawek',
  },
]

const PLATFORM_ICONS = {
  github:   FaGithub,
  linkedin: FaLinkedinIn,
  email:    AiOutlineMail,
}

const INITIAL_FORM = { name: '', email: '', message: '' }

export default function Contact({ content }) {
  const [form, setForm]       = useState(INITIAL_FORM)
  const [status, setStatus]   = useState(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return
    setLoading(true); setStatus(null)
    try {
      await contactAPI.sendMessage(form)
      setStatus('success')
      setForm(INITIAL_FORM)
    } catch {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  // Build contact info from DB social links if available, else use defaults
  const socialLinks = content?.social?.links?.length
    ? content.social.links.map((link) => {
        const key = link.platform?.toLowerCase()
        const Icon = PLATFORM_ICONS[key] || AiOutlineMail
        return {
          icon: Icon,
          label: link.platform,
          value: link.url.replace(/^https?:\/\/(www\.)?/, ''),
          href: link.url.startsWith('http') ? link.url : `https://${link.url}`,
        }
      })
    : DEFAULT_CONTACT

  const sectionTitle    = content?.hero?.title    || 'Get In Touch'
  const sectionSubtitle = content?.hero?.subtitle || 'Have a project in mind or just want to say hi? My inbox is always open.'

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
          <p className="text-gray-400 mt-3 max-w-xl">
            {sectionSubtitle}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 space-y-4"
          >
            {socialLinks.map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith('mailto') ? undefined : '_blank'}
                rel={href.startsWith('mailto') ? undefined : 'noreferrer'}
                className="glass-card flex items-center gap-4 p-4 hover:border-violet-500/30 transition-colors duration-300 group"
              >
                <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 flex-shrink-0 group-hover:bg-violet-500/20 transition-colors">
                  <Icon size={16} aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
                  <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{value}</p>
                </div>
              </a>
            ))}

            <div className="glass-card p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Status</p>
                <p className="text-sm text-emerald-400">Available for opportunities</p>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <form onSubmit={handleSubmit} noValidate className="glass-card p-6 space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600
                               focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="your@email.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600
                               focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  required
                  rows={5}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Tell me about your project..."
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600
                             focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200 resize-none"
                />
              </div>

              {/* Status messages */}
              {status === 'success' && (
                <div className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3" role="alert">
                  <HiCheckCircle size={16} aria-hidden="true" />
                  Message sent! I&apos;ll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3" role="alert">
                  <HiXCircle size={16} aria-hidden="true" />
                  Something went wrong. Please try again or email me directly.
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
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

      {/* Footer */}
      <div className="section-wrapper mt-20 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-gray-600 font-mono">
          © {new Date().getFullYear()} Baweke Mekonnen. Built with Next.js & Tailwind.
        </p>
        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
          className="text-xs text-gray-600 hover:text-violet-400 transition-colors font-mono"
          aria-label="Back to top"
        >
          ↑ Back to top
        </a>
      </div>
    </section>
  )
}
