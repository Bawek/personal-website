import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { HiSearch, HiX } from 'react-icons/hi'
import api from '@/lib/api'

export default function SiteSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  useEffect(() => {
    if (!open) return
    inputRef.current?.focus()
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const { data } = await api.get('/content', {
          params: { status: 'published', search: query.trim(), limit: 8 },
        })
        setResults(data.contents || [])
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [query])

  const getHref = (item) => {
    if (item.type === 'post') return `/blog/${item.slug}`
    if (item.type === 'project') return `/projects/${item.slug}`
    return `/blog/${item.slug}`
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="btn-icon"
        aria-label="Search site"
      >
        <HiSearch size={16} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center pt-20 px-4" role="dialog" aria-modal="true" aria-label="Site search">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg glass-card p-4 shadow-2xl">
            <div className="flex items-center gap-2 mb-3">
              <HiSearch className="text-gray-500 flex-shrink-0" size={18} />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search blog, projects…"
                className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-600 focus:outline-none"
                aria-label="Search query"
              />
              <button type="button" onClick={() => setOpen(false)} className="btn-icon" aria-label="Close search">
                <HiX size={16} />
              </button>
            </div>

            {loading && <p className="text-xs text-gray-500 font-mono px-1">Searching…</p>}

            {!loading && query && results.length === 0 && (
              <p className="text-sm text-gray-500 px-1">No results for &ldquo;{query}&rdquo;</p>
            )}

            <ul className="mt-2 max-h-64 overflow-y-auto space-y-1" role="listbox">
              {results.map((item) => (
                <li key={item._id}>
                  <Link
                    href={getHref(item)}
                    onClick={() => { setOpen(false); setQuery('') }}
                    className="block px-3 py-2 rounded-lg hover:bg-white/5 text-sm text-gray-300 hover:text-white transition-colors"
                  >
                    <span className="text-xs text-violet-400 font-mono capitalize mr-2">{item.type}</span>
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="text-xs text-gray-600 mt-3 font-mono">
              Tip: browse <Link href="/projects" className="text-violet-400 hover:underline" onClick={() => setOpen(false)}>projects</Link> or{' '}
              <Link href="/blog" className="text-violet-400 hover:underline" onClick={() => setOpen(false)}>blog</Link>
            </p>
          </div>
        </div>
      )}
    </>
  )
}
