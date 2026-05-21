import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '@/lib/api'

export default function Testimonials() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/content', {
          params: { type: 'testimonial', status: 'published', limit: 6 },
        })
        setItems(data.contents || [])
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  if (loading || !items.length) return null

  return (
    <section id="testimonials" className="py-24 bg-surface/30">
      <div className="section-wrapper">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <p className="section-label mb-3">Social Proof</p>
          <h2 className="text-gray-100">What People Say</h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.blockquote
              key={t._id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-6 flex flex-col"
            >
              <p className="text-gray-300 text-sm leading-relaxed flex-1 italic">
                &ldquo;{t.excerpt || t.content?.replace(/<[^>]+>/g, '').slice(0, 280)}&rdquo;
              </p>
              <footer className="mt-4 pt-4 border-t border-white/5">
                <p className="text-sm font-medium text-white">{t.title}</p>
                {t.categories?.[0] && <p className="text-xs text-gray-500">{t.categories[0]}</p>}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  )
}
