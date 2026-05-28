import { useState } from 'react'
import { motion } from 'framer-motion'
import { FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope, FaArrowRight } from 'react-icons/fa'
import { HiCheckCircle, HiXCircle } from 'react-icons/hi'
import { contactAPI } from '@/lib/api'
import { obfuscateEmail } from '@/lib/formatEmail'
import ChatWidget from '@/components/Chat/ChatWidget'

const PLATFORM_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
  email: FaEnvelope,
  x: FaTwitter,
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

  // Get chat settings
  const chatSettings = settings?.features?.chat

  // Check if chat is enabled
  const isChatEnabled = chatSettings?.enabled !== false

  // Get social links from contact data
  const socialLinks = content?.social?.links && content.social.links.length > 0
    ? content.social.links.map((link) => {
        const key = link.platform?.toLowerCase()
        const Icon = PLATFORM_ICONS[key] || FaEnvelope
        const isEmail = key === 'email'
        return {
          icon: Icon,
          label: link.platform,
          value: isEmail ? obfuscateEmail(link.url.replace(/^mailto:/, '')) : link.url.replace(/^https?:\/\/(www\.)?/, ''),
          href: isEmail ? null : (link.url.startsWith('http') ? link.url : `https://${link.url}`),
        }
      })
    : []

  // Get text from content, with no fallbacks - fully dynamic
  const sectionTitle = content?.hero?.title || ''
  const sectionSubtitle = content?.hero?.subtitle || ''
  const responseTime = content?.form?.responseTime || ''
  const formTitle = content?.form?.title || ''
  const formDescription = content?.form?.description || ''
  const messagePlaceholder = content?.form?.placeholder || 'Tell me about your project…'

  return (
    <section id="contact" className="relative py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 via-transparent to-pink-500/5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl -z-10" />

      <div className="section-wrapper relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-20 text-center"
        >
          <p className="section-label mb-4">Contact</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 bg-gradient-to-r from-violet-400 via-white to-pink-400 bg-clip-text text-transparent">
            {sectionTitle}
          </h2>
          {sectionSubtitle && (
            <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-4">
              {sectionSubtitle}
            </p>
          )}
          {responseTime && (
            <p className="text-sm text-violet-400/80 font-mono">
              {responseTime}
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Social Links Section */}
          {socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2 space-y-4"
            >
              {socialLinks.map(({ icon: Icon, label, value, href }) =>
                href ? (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 4 }}
                    className="group glass-card flex items-center gap-4 p-5 hover:border-violet-500/50 hover:bg-violet-500/5 transition-all duration-300 cursor-pointer"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 flex-shrink-0 group-hover:from-violet-500/30 group-hover:to-pink-500/30 transition-all">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
                      <p className="text-sm text-gray-300 group-hover:text-white transition-colors">{value}</p>
                    </div>
                    <FaArrowRight size={14} className="text-gray-600 group-hover:text-violet-400 transition-colors opacity-0 group-hover:opacity-100" />
                  </motion.a>
                ) : (
                  <div key={label} className="glass-card flex items-center gap-4 p-5 border-violet-500/20">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center text-violet-400 flex-shrink-0">
                      <Icon size={18} aria-hidden="true" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">{label}</p>
                      <p className="text-sm text-gray-300">{value}</p>
                    </div>
                  </div>
                )
              )}
            </motion.div>
          )}

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className={socialLinks.length > 0 ? 'lg:col-span-3' : 'lg:col-span-5 max-w-2xl mx-auto'}
          >
            <div className="glass-card p-8 space-y-6 border-violet-500/20 hover:border-violet-500/30 transition-colors">
              {/* Form Header */}
              {(formTitle || formDescription) && (
                <div className="mb-6">
                  {formTitle && (
                    <h3 className="text-2xl font-bold text-white mb-2">{formTitle}</h3>
                  )}
                  {formDescription && (
                    <p className="text-gray-400">{formDescription}</p>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-5">
                {/* Honeypot field */}
                <div className="absolute -left-[9999px] w-px h-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="contact-website">Website</label>
                  <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" value={form.website} onChange={handleChange} />
                </div>

                {/* Name and Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <label htmlFor="contact-name" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Name</label>
                    <input
                      id="contact-name"
                      name="name"
                      type="text"
                      required
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200"
                    />
                  </motion.div>
                  <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                    <label htmlFor="contact-email" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Email</label>
                    <input
                      id="contact-email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200"
                    />
                  </motion.div>
                </div>

                {/* Subject */}
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <label htmlFor="contact-subject" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Subject</label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="Project inquiry, collaboration…"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200"
                  />
                </motion.div>

                {/* Message */}
                <motion.div whileHover={{ y: -2 }} transition={{ duration: 0.2 }}>
                  <label htmlFor="contact-message" className="block text-xs font-mono text-gray-400 uppercase tracking-widest mb-2">Message</label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    placeholder={messagePlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200 resize-none"
                  />
                </motion.div>

                {/* Status Messages */}
                {status === 'success' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-emerald-400 text-sm bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-4 py-3"
                    role="alert"
                  >
                    <HiCheckCircle size={16} aria-hidden="true" />
                    Message sent! I&apos;ll get back to you soon.
                  </motion.div>
                )}
                {status === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3"
                    role="alert"
                  >
                    <HiXCircle size={16} aria-hidden="true" />
                    Something went wrong. Please try again.
                  </motion.div>
                )}

                {/* Submit Button */}
                <motion.button
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold text-sm hover:from-violet-400 hover:to-pink-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" aria-hidden="true" />
                      Sending…
                    </>
                  ) : (
                    <>
                      Send Message
                      <FaArrowRight size={14} />
                    </>
                  )}
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Chat Widget */}
      {isChatEnabled && <ChatWidget userId={settings?.createdBy || settings?._id} chatSettings={chatSettings} />}
    </section>
  )
}
