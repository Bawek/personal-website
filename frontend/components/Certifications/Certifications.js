import { motion } from 'framer-motion'
import { HiBadgeCheck, HiStar, HiCalendar, HiExternalLink } from 'react-icons/hi'

function CertificationCard({ cert, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="glass-card p-5 hover:border-violet-500/30 transition-all duration-300 group"
    >
      <div className="flex items-start gap-4">
        {cert.logoUrl ? (
          <img
            src={cert.logoUrl}
            alt={cert.issuingOrganization}
            className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-pink-500/20 border border-violet-500/30 flex items-center justify-center flex-shrink-0">
            <HiBadgeCheck className="text-violet-400" size={20} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-white font-semibold group-hover:text-violet-400 transition-colors">
                  {cert.name}
                </h3>
                {cert.featured && <HiStar className="text-amber-400 flex-shrink-0" size={16} />}
              </div>
              <p className="text-violet-300 text-sm">{cert.issuingOrganization}</p>
            </div>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noreferrer"
                className="text-gray-500 hover:text-violet-400 transition-colors flex-shrink-0"
                title="View credential"
              >
                <HiExternalLink size={16} />
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 font-mono mb-3">
            <span className="flex items-center gap-1">
              <HiCalendar size={12} />
              {new Date(cert.issueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
            </span>
            {cert.expirationDate && (
              <span>• Expires: {new Date(cert.expirationDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}</span>
            )}
            {cert.credentialId && <span>• ID: {cert.credentialId}</span>}
          </div>

          {cert.skills && cert.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {cert.skills.map((skill, i) => (
                <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/10">
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function Certifications({ certifications }) {
  if (!certifications?.length) return null

  const featured = certifications.filter(c => c.featured)
  const regular = certifications.filter(c => !c.featured)

  return (
    <section id="certifications" className="py-24">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <p className="section-label mb-3">Credentials</p>
          <h2 className="text-gray-100">Certifications & Awards</h2>
        </motion.div>

        {/* Featured certifications */}
        {featured.length > 0 && (
          <div className="mb-8">
            <p className="text-xs font-mono text-violet-400 uppercase tracking-widest mb-4">Featured</p>
            <div className="grid md:grid-cols-2 gap-4">
              {featured.map((cert, i) => (
                <CertificationCard key={cert._id} cert={cert} index={i} />
              ))}
            </div>
          </div>
        )}

        {/* Regular certifications */}
        {regular.length > 0 && (
          <div>
            {featured.length > 0 && (
              <p className="text-xs font-mono text-gray-500 uppercase tracking-widest mb-4">Other Certifications</p>
            )}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {regular.map((cert, i) => (
                <CertificationCard key={cert._id} cert={cert} index={i} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
