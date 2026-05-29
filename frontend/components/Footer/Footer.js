import { motion } from 'framer-motion'
import Link from 'next/link'
import { FaGithub, FaLinkedinIn, FaTwitter, FaEnvelope } from 'react-icons/fa'

const PLATFORM_ICONS = {
  github: FaGithub,
  linkedin: FaLinkedinIn,
  twitter: FaTwitter,
  email: FaEnvelope,
  x: FaTwitter,
}

export default function Footer({ footerData, settings }) {
  const footer = footerData || {}
  const companyName = footer.companyName || settings?.siteName || 'Baweke Mekonnen'
  const copyrightText = footer.copyrightText || `© ${new Date().getFullYear()} ${companyName}. All rights reserved.`
  const description = footer.description || 'Full-Stack Developer specializing in Next.js, React, Node.js, and modern web applications.'
  const links = footer.links || []
  
  // Combine footer social links with chat social links
  const footerSocialLinks = footer.socialLinks || []
  const chatSocialLinks = settings?.features?.chat?.socialLinks || []
  
  // Merge and remove duplicates
  const allSocialLinks = [...footerSocialLinks, ...chatSocialLinks]
  const socialLinks = allSocialLinks.length > 0 
    ? allSocialLinks.filter((link, index, self) =>
        index === self.findIndex((l) => l.platform === link.platform && l.url === link.url)
      )
    : [
        { id: 1, platform: 'GitHub', url: 'https://github.com/Bawek', icon: 'FaGithub' },
        { id: 2, platform: 'LinkedIn', url: 'https://www.linkedin.com/in/baweke/', icon: 'FaLinkedinIn' },
      ]
  
  const newsletter = footer.newsletter || { enabled: false }
  const contact = footer.contact || { enabled: true, email: 'bawekemekonen884@gmail.com', phone: '+251989131968' }

  // Group links by category
  const groupedLinks = links.reduce((acc, link) => {
    const category = link.category || 'Other'
    if (!acc[category]) acc[category] = []
    acc[category].push(link)
    return acc
  }, {})

  const getSocialIcon = (platform) => {
    const key = platform?.toLowerCase()
    return PLATFORM_ICONS[key] || FaEnvelope
  }

  return (
    <footer className="bg-surface/50 border-t border-white/5">
      <div className="section-wrapper py-16">
        {/* Newsletter Section */}
        {newsletter.enabled && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-16 pb-16 border-b border-white/5"
          >
            <div className="max-w-2xl">
              <h3 className="text-xl font-semibold text-white mb-2">{newsletter.title || 'Subscribe to my newsletter'}</h3>
              <p className="text-gray-400 text-sm mb-6">{newsletter.description || 'Get updates on new projects and insights.'}</p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="your@email.com"
                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-violet-500/60 focus:bg-violet-500/5 transition-all duration-200"
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-violet-500 to-pink-500 text-white text-sm font-semibold rounded-xl hover:from-violet-400 hover:to-pink-400 transition-all duration-200"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-500 mb-3">
              {companyName}
            </h2>
            <p className="text-sm text-gray-400 mb-4">{description}</p>

            {/* Social Links */}
            {socialLinks && socialLinks.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-gray-500 font-mono uppercase tracking-widest">Connect</p>
                <div className="flex gap-3 flex-wrap">
                  {socialLinks.map((link) => {
                    const Icon = getSocialIcon(link.platform)
                    return (
                      <a
                        key={link.id || link.platform}
                        href={link.url}
                        target="_blank"
                        rel="noreferrer"
                        className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-violet-400 hover:border-violet-500/30 hover:bg-violet-500/10 transition-all duration-200"
                        aria-label={link.platform}
                        title={link.platform}
                      >
                        <Icon size={16} />
                      </a>
                    )
                  })}
                </div>
              </div>
            )}
          </motion.div>

          {/* Links Sections */}
          {Object.keys(groupedLinks).length > 0 ? (
            Object.entries(groupedLinks).map(([category, categoryLinks], idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
              >
                <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">{category}</h3>
                <ul className="space-y-2">
                  {categoryLinks
                    .sort((a, b) => (a.order || 0) - (b.order || 0))
                    .map((link) => (
                      <li key={link.id}>
                        <a
                          href={link.url}
                          target={link.url.startsWith('http') ? '_blank' : undefined}
                          rel={link.url.startsWith('http') ? 'noreferrer' : undefined}
                          className="text-sm text-gray-400 hover:text-violet-400 transition-colors duration-200"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                </ul>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Other</h3>
              <ul className="space-y-2">
                <li><Link href="/" className="text-sm text-gray-400 hover:text-violet-400 transition-colors block">Home</Link></li>
                <li><Link href="/projects" className="text-sm text-gray-400 hover:text-violet-400 transition-colors block">Projects</Link></li>
                <li><Link href="/contact" className="text-sm text-gray-400 hover:text-violet-400 transition-colors block">Contact</Link></li>
                <li><Link href="/skills" className="text-sm text-gray-400 hover:text-violet-400 transition-colors block">Skills</Link></li>
              </ul>
            </motion.div>
          )}

          {/* Contact Section */}
          {contact.enabled && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-widest">Contact</h3>
              <ul className="space-y-2">
                {contact.email && (
                  <li>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-sm text-gray-400 hover:text-violet-400 transition-colors duration-200"
                    >
                      {contact.email}
                    </a>
                  </li>
                )}
                {contact.phone && (
                  <li>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-sm text-gray-400 hover:text-violet-400 transition-colors duration-200"
                    >
                      {contact.phone}
                    </a>
                  </li>
                )}
              </ul>
            </motion.div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-600 font-mono">{copyrightText}</p>
          <div className="flex gap-4 text-xs text-gray-600">
            <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
