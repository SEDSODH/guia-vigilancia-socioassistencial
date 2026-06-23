import { useState, useEffect, useRef, useCallback } from 'react'

interface SearchResult {
  url: string
  title: string
  excerpt: string
}

let pagefindPromise: Promise<any> | null = null
let pagefindError = false

async function loadPagefind(): Promise<any> {
  if (pagefindError) return null as any
  if (pagefindPromise) return pagefindPromise

  pagefindPromise = (async () => {
    try {
      const base = import.meta.env.BASE_URL || '/'
      const pf = await import(/* @vite-ignore */ `${base}pagefind/pagefind.js`)
      await pf.init()
      return pf
    } catch (err) {
      console.error('[SearchBox] Falha ao carregar pagefind:', err)
      pagefindPromise = null
      pagefindError = true
      throw err
    }
  })()

  return pagefindPromise
}

function scrollToSection(url: string) {
  const hashIndex = url.indexOf('#')
  if (hashIndex === -1) return

  const id = url.substring(hashIndex + 1)
  if (!id) return

  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    window.history.pushState(null, '', `#${id}`)
  }
}

export default function SearchBox() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const search = useCallback(async (q: string) => {
    if (!q || q.length < 2) {
      setResults([])
      setError(false)
      return
    }
    setLoading(true)
    setError(false)
    try {
      const pf = await loadPagefind()
      if (!pf) {
        setError(true)
        return
      }
      const searchResult = await pf.search(q)
      const items: SearchResult[] = []

      for (const result of searchResult.results) {
        const data = await result.data()

        if (data.sub_results && data.sub_results.length > 0) {
          for (const sub of data.sub_results) {
            items.push({
              url: sub.url || data.url,
              title: sub.title || data.meta?.title || '',
              excerpt: sub.excerpt || sub.plain_excerpt || '',
            })
          }
        } else {
          items.push({
            url: data.url,
            title: data.meta?.title || '',
            excerpt: data.excerpt || '',
          })
        }
      }

      setResults(items.slice(0, 8))
    } catch (err) {
      console.error('[SearchBox] Erro na busca:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => search(query), 200)
    return () => clearTimeout(timer)
  }, [query, search])

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        inputRef.current?.focus()
      }
      if (e.key === 'Escape') {
        setOpen(false)
        inputRef.current?.blur()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full max-w-md">
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          placeholder="Buscar no caderno..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          className="w-full pl-9 pr-16 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-institucional-blue/50 focus:border-institucional-blue dark:text-slate-200 placeholder:text-slate-400 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
          Ctrl+K
        </kbd>
      </div>
      {open && query.length >= 2 && (
        <div className="absolute top-full mt-2 w-full max-h-96 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-50">
          {loading && (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Buscando...</div>
          )}
          {!loading && error && (
            <div className="p-4 text-sm text-amber-600 dark:text-amber-400">Busca indisponível no momento.</div>
          )}
          {!loading && !error && results.length === 0 && (
            <div className="p-4 text-sm text-slate-500 dark:text-slate-400">Nenhum resultado encontrado.</div>
          )}
          {!loading && !error && results.length > 0 && (
            <div>
              {results.map((r, i) => {
                const hasAnchor = r.url.includes('#')
                return (
                  <button
                    key={i}
                    onClick={() => {
                      if (hasAnchor) {
                        scrollToSection(r.url)
                      }
                      setOpen(false)
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                  >
                    {hasAnchor && (
                      <span className="inline-block text-[9px] font-bold uppercase tracking-wider text-institucional-blue dark:text-institucional-green mb-0.5">
                        Seção
                      </span>
                    )}
                    <div className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {r.title || 'Resultado'}
                    </div>
                    {r.excerpt && (
                      <div
                        className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: r.excerpt }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}