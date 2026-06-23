import { useState, useEffect, useRef, useCallback } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { cn } from '@/lib/utils'
import { BLOCK_ACCENTS, BLOCKS, INTRO_SECTIONS, FINAL_SECTIONS } from '@/lib/constants'

// ── All section data derived from canonical constants ──
const ALL_SECTIONS = [
  ...INTRO_SECTIONS,
  ...BLOCKS.flatMap(b => b.items),
  ...FINAL_SECTIONS,
]

const SECTION_IDS = ALL_SECTIONS.map(s => s.id)

const SECTION_TITLES: Record<string, string> = {}
ALL_SECTIONS.forEach(s => { SECTION_TITLES[s.id] = s.title })

const NON_BLOCK_SECTIONS: Record<string, string> = {}
INTRO_SECTIONS.forEach(s => { NON_BLOCK_SECTIONS[s.id] = s.title })
FINAL_SECTIONS.forEach(s => { NON_BLOCK_SECTIONS[s.id] = s.title })

const SECTION_BLOCK_MAP: Record<string, { label: string; hex: string }> = {}
BLOCKS.forEach(b => {
  const accent = BLOCK_ACCENTS[b.accent as keyof typeof BLOCK_ACCENTS]
  b.items.forEach(i => {
    SECTION_BLOCK_MAP[i.id] = { label: b.title, hex: accent.hex }
  })
})

const TOC_GROUPS: { label: string; hex: string; ids: string[] }[] = [
  ...BLOCKS.map(b => ({
    label: b.title,
    hex: BLOCK_ACCENTS[b.accent as keyof typeof BLOCK_ACCENTS].hex,
    ids: b.items.map(i => i.id),
  })),
  {
    label: 'Outros',
    hex: '#64748b',
    ids: [...INTRO_SECTIONS.map(s => s.id), ...FINAL_SECTIONS.map(s => s.id)],
  },
]

/** Strips section-level card styling but preserves content layout/text classes. */
const STRIP_PATTERNS: RegExp[] = [
  /\bbg-white\b/,
  /\bshadow-(?:md|lg|xl|sm|2xl)\b/,
  /\brounded-(?:xl|2xl|full)\b/,
  /\bprint:shadow-none\b/,
  /\bprint:rounded-none\b/,
  /\bborder-l-4\b/,
  /\bborder-(?:institucional-\w+|purple-\d+|amber-\d+|red-\d+|cyan-\d+|pink-\d+|slate-\d+|blue-\d+|green-\d+|orange-\d+|yellow-\d+)\b/,
  /\btransition-all\b/,
  /\bhover:shadow-(?:lg|xl|md|sm)\b/,
  /\bhover:-translate-y-\d+\b/,
  /\b(?:m|mx|my|mt|mb|ml|mr)-16\b/,
  /\banimate-(?:on-scroll|scale|slide-left|slide-right)\b/,
  /\bmin-h-\[\d+px\]\b/,
  /\boverflow-hidden\b/,
  /\brelative\b/,
  /\babsolute\b/,
  /\bpointer-events-none\b/,
  /\bz-10\b/,
]

function cleanSectionHtml(html: string): string {
  return html.replace(
    /^(<(\w+)([^>]*?)class="([^"]*)"([^>]*>))/,
    (_, _full, tag, beforeClass, classAttr, afterClass) => {
      let clean = classAttr
      for (const pattern of STRIP_PATTERNS) {
        clean = clean.replace(pattern, '')
      }
      clean = clean
        .replace(/style="[^"]*clip-path[^"]*"/g, '')
        .replace(/\s{2,}/g, ' ')
        .trim()

      return clean
        ? `<${tag}${beforeClass}class="${clean}"${afterClass}`
        : `<${tag}${beforeClass}${afterClass}`
    },
  )
}

type ReadingMode = 'scroll' | 'book'
type FontLevel = 0 | 1 | 2
type AnimPhase = 'entering' | 'entered' | 'exiting'

const FONT_SIZE_CLASSES: Record<FontLevel, string> = {
  0: 'book-font-size-sm',
  1: 'book-font-size-md',
  2: 'book-font-size-lg',
}

function getFontSizeLabel(level: FontLevel): string {
  return ['Pequena', 'Média', 'Grande'][level]
}

export default function BookViewport() {
  const [mode, setMode] = useState<ReadingMode>('scroll')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pages, setPages] = useState<string[]>([])
  const [bookDims, setBookDims] = useState({ w: 800, h: 1050 })
  const [isMobile, setIsMobile] = useState(false)
  const [fontLevel, setFontLevel] = useState<FontLevel>(1)
  const [isSerif, setIsSerif] = useState(false)
  const [showToc, setShowToc] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [animPhase, setAnimPhase] = useState<AnimPhase>('entering')
  const [isDark, setIsDark] = useState(() => {
    if (typeof document === 'undefined') return false
    return document.documentElement.classList.contains('dark')
  })
  const flipBookRef = useRef<any>(null)
  const savedPageRef = useRef(0)
  const tocContainerRef = useRef<HTMLDivElement>(null)

  // ── Dimension / mobile detection ──
  useEffect(() => {
    function updateDimensions() {
      const mobile = window.innerWidth < 768
      const pad = mobile ? 16 : 48
      const pageW = mobile
        ? Math.min(500, Math.floor(window.innerWidth - pad))
        : Math.min(850, Math.floor((window.innerWidth - pad) / 2))
      const pageH = Math.min(1150, Math.floor(window.innerHeight - pad))
      setBookDims({ w: pageW, h: pageH })
      setIsMobile(mobile)
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // ── Collect pages from the DOM ──
  const collectPages = useCallback(() => {
    const allPages: string[] = []
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id)
      if (!el) continue
      allPages.push(cleanSectionHtml(el.outerHTML))
    }
    setPages(allPages)
    setTotalPages(allPages.length)
    setCurrentPage(0)
  }, [])

  // ── Mode change listener + initial check ──
  useEffect(() => {
    function readSavedPage(): number {
      try {
        const saved = localStorage.getItem('caderno-book-page')
        return saved ? parseInt(saved, 10) : 0
      } catch {
        return 0
      }
    }

    function handleModeChange(e: CustomEvent<{ mode: ReadingMode }>) {
      const newMode = e.detail.mode
      setMode(newMode)
      if (newMode === 'book') {
        setAnimPhase('entering')
        collectPages()
        // Restore saved page
        const saved = readSavedPage()
        savedPageRef.current = saved
        if (saved > 0 && saved < SECTION_IDS.length) {
          setCurrentPage(saved)
        }
      } else {
        setPages([])
        setCurrentPage(0)
        setTotalPages(0)
        setShowToc(false)
      }
    }

    const initial = document.body.getAttribute('data-reading-mode')
    if (initial === 'book') {
      setMode('book')
      setAnimPhase('entering')
      collectPages()
      const saved = readSavedPage()
      savedPageRef.current = saved
      if (saved > 0 && saved < SECTION_IDS.length) {
        setCurrentPage(saved)
      }
    }

    window.addEventListener('reading-mode-change', handleModeChange as EventListener)
    return () => window.removeEventListener('reading-mode-change', handleModeChange as EventListener)
  }, [collectPages])

  // ── Enter animation sequence ──
  useEffect(() => {
    if (animPhase === 'entering') {
      const t = setTimeout(() => setAnimPhase('entered'), 400)
      return () => clearTimeout(t)
    }
  }, [animPhase])

  // ── Keyboard navigation ──
  useEffect(() => {
    if (mode !== 'book') return

    function onKeyDown(e: KeyboardEvent) {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
      if (e.ctrlKey || e.metaKey || e.altKey) return

      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        flipBookRef.current?.pageFlip()?.flipPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        flipBookRef.current?.pageFlip()?.flipNext()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mode])

  // ── Wheel scroll: patching .book-page-content elements ──
  //     page-flip's 3D context (perspective / preserve-3d / translate3d)
  //     prevents the browser compositor from routing wheel events to
  //     nested scrollable elements. We attach a non-passive wheel listener
  //     directly on each .book-page-content to force the browser to
  //     dispatch wheel events to JavaScript, then manually scrollBy.
  useEffect(() => {
    if (mode !== 'book') return

    function attachWheelPatch(el: HTMLElement) {
      if (el.dataset.wheelPatched) return
      el.dataset.wheelPatched = '1'

      el.addEventListener('wheel', (ev: WheelEvent) => {
        if (ev.ctrlKey || ev.metaKey) return          // allow zoom
        if (el.scrollHeight <= el.clientHeight) return  // not scrollable
        ev.preventDefault()
        el.scrollTop += ev.deltaY
      }, { passive: false })
    }

    // Patch existing elements
    document.querySelectorAll<HTMLElement>('.book-page-content')
      .forEach(attachWheelPatch)

    // Watch for new ones (page flips replace DOM nodes)
    const observer = new MutationObserver(() => {
      document.querySelectorAll<HTMLElement>('.book-page-content')
        .forEach(attachWheelPatch)
    })
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
    }
  }, [mode])

  // ── Page flip callback ──
  const onFlip = useCallback((e: any) => {
    const page = e.data as number
    setCurrentPage(page)
    try {
      localStorage.setItem('caderno-book-page', String(page))
    } catch { /* noop */ }
  }, [])

  // ── Navigation helpers ──
  const goPrev = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipPrev()
  }, [])

  const goNext = useCallback(() => {
    flipBookRef.current?.pageFlip()?.flipNext()
  }, [])

  // ── Theme toggle ──
  const toggleTheme = useCallback(() => {
    const next = !isDark
    setIsDark(next)
    document.documentElement.classList.toggle('dark', next)
    try {
      localStorage.setItem('caderno-theme', next ? 'dark' : 'light')
    } catch { /* noop */ }
  }, [isDark])

  // ── Watch theme changes from other sources ──
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDark(document.documentElement.classList.contains('dark'))
    })
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  // ── Font size cycling ──
  const cycleFontSize = useCallback(() => {
    setFontLevel((prev) => ((prev + 1) % 3) as FontLevel)
  }, [])

  // ── Serif/Sans toggle ──
  const toggleSerif = useCallback(() => {
    setIsSerif((prev) => !prev)
  }, [])

  // ── Exit book mode ──
  const handleExit = useCallback(() => {
    setAnimPhase('exiting')
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('reading-mode-change', { detail: { mode: 'scroll' } }))
    }, 400)
  }, [])

  // ── TOC navigation ──
  const navigateToSection = useCallback((sectionId: string) => {
    const idx = SECTION_IDS.indexOf(sectionId)
    if (idx >= 0 && flipBookRef.current?.pageFlip()) {
      flipBookRef.current.pageFlip().flip(idx)
      setCurrentPage(idx)
    }
    setShowToc(false)
  }, [])

  // ── First-visit keyboard hint ──
  useEffect(() => {
    if (mode !== 'book') return
    try {
      const hintShown = localStorage.getItem('caderno-book-hint-shown')
      if (!hintShown) {
        localStorage.setItem('caderno-book-hint-shown', 'true')
        setShowHint(true)
      }
    } catch { /* noop */ }
  }, [mode])

  useEffect(() => {
    if (showHint) {
      const t = setTimeout(() => setShowHint(false), 3000)
      return () => clearTimeout(t)
    }
  }, [showHint])

  // ── Chapter indicator info ──
  const currentSectionId = SECTION_IDS[currentPage] || ''
  const blockInfo = SECTION_BLOCK_MAP[currentSectionId]
  const chapterLabel = blockInfo?.label || NON_BLOCK_SECTIONS[currentSectionId] || ''
  const chapterHex = blockInfo?.hex || '#64748b'

  // ── Auto-scroll TOC to current section ──
  useEffect(() => {
    if (showToc && currentSectionId && tocContainerRef.current) {
      const el = tocContainerRef.current.querySelector(`[data-toc-id="${currentSectionId}"]`)
      if (el) {
        el.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
      }
    }
  }, [showToc, currentSectionId])

  // ── Escape key closes TOC ──
  useEffect(() => {
    if (!showToc) return
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowToc(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [showToc])

  // ── Background radial gradient ──
  const bgStyle = isDark
    ? { background: 'radial-gradient(ellipse at center, #1e293b 0%, #0f172a 50%, #000000 100%)' }
    : { background: 'radial-gradient(ellipse at center, #f1f5f9 0%, #e2e8f0 50%, #94a3b8 100%)' }

  if (mode !== 'book') return null

  // ── Sun / Moon SVG (from BaseLayout.astro) ──
  const SunIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  )

  const MoonIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  )

  const ListIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  )

  const XIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  )

  // ── TOC overlay ──
  const TocOverlay = showToc ? (
    <div className="fixed inset-0 z-50 flex items-start justify-center" onClick={() => setShowToc(false)}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      {/* Dropdown */}
      <div
        ref={tocContainerRef}
        className="relative mt-20 w-full max-w-sm max-h-[70vh] overflow-y-auto rounded-2xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md shadow-2xl border border-slate-200 dark:border-slate-700 p-5 scrollbar-thin"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
          Sumário
        </h3>
        {TOC_GROUPS.map((group) => (
          <div key={group.label} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2 mb-1.5">
              <span
                className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: group.hex }}
              />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {group.label}
              </span>
            </div>
            <div className="ml-5 space-y-0.5">
              {group.ids.map((id) => (
                <button
                  key={id}
                  data-toc-id={id}
                  onClick={() => navigateToSection(id)}
                  className={cn(
                    'w-full text-left text-sm py-1 px-2 rounded-lg transition-colors',
                    'text-slate-700 dark:text-slate-300',
                    'hover:bg-slate-100 dark:hover:bg-slate-700/60',
                    currentSectionId === id && 'font-semibold bg-slate-100 dark:bg-slate-700/40',
                  )}
                >
                  <span
                    className="inline-block w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 align-middle"
                    style={{ backgroundColor: group.hex }}
                  />
                  {SECTION_TITLES[id] || id}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  ) : null

  return (
    <>
      {/* Main container with immersive background + animation */}
      <div
        className={cn(
          'fixed inset-0 z-30 flex flex-col items-center justify-center',
          'transition-all duration-500 ease-out overflow-hidden',
          animPhase === 'entering' && 'opacity-0 scale-95',
          animPhase === 'entered' && 'opacity-100 scale-100',
          animPhase === 'exiting' && 'opacity-0 scale-95',
          // Font size classes cascade to content
          FONT_SIZE_CLASSES[fontLevel],
          isSerif && 'book-font-serif',
        )}
        style={bgStyle}
      >
        {/* ── Reading Toolbar ── */}
        <div
          className={cn(
            'fixed top-4 left-1/2 -translate-x-1/2 z-40',
            'flex items-center gap-1 px-2 py-1.5 rounded-2xl',
            'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm',
            'shadow-lg border border-slate-200 dark:border-slate-700',
          )}
        >
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Alternar tema"
            title="Alternar tema"
          >
            {isDark ? SunIcon : MoonIcon}
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600" />

          {/* TOC */}
          <button
            onClick={() => setShowToc(!showToc)}
            className={cn(
              'p-2 rounded-xl transition-colors text-slate-600 dark:text-slate-300',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              showToc && 'bg-slate-100 dark:bg-slate-700',
            )}
            aria-label={`Sumário${currentSectionId ? ` — ${SECTION_TITLES[currentSectionId]}` : ''}`}
            aria-expanded={showToc}
            title="Sumário — navegar por seções"
          >
            <span className="flex items-center gap-1.5">
              {ListIcon}
              {currentSectionId && (
                <span className="inline-block w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: chapterHex }} />
              )}
            </span>
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600" />

          {/* Font size toggle */}
          <button
            onClick={cycleFontSize}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 flex items-center gap-1"
            aria-label={`Tamanho da fonte: ${getFontSizeLabel(fontLevel)}`}
            title={`Tamanho da fonte: ${getFontSizeLabel(fontLevel)}`}
          >
            <span className="text-xs leading-none font-semibold">A</span>
            <span className="text-base leading-none font-semibold">A</span>
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600" />

          {/* Serif/Sans toggle */}
          <button
            onClick={toggleSerif}
            className={cn(
              'p-2 rounded-xl transition-colors text-slate-600 dark:text-slate-300',
              'hover:bg-slate-100 dark:hover:bg-slate-700',
              isSerif && 'bg-slate-100 dark:bg-slate-700',
            )}
            aria-label={isSerif ? 'Fonte com serifa' : 'Fonte sem serifa'}
            title={isSerif ? 'Fonte: Georgia (serifada)' : 'Fonte: Inter (sem serifa)'}
          >
            {isSerif ? (
              <span className="font-serif text-sm font-semibold leading-none" style={{ fontFamily: 'Georgia, serif' }}>Aa</span>
            ) : (
              <span className="font-sans text-sm font-semibold leading-none">Aa</span>
            )}
          </button>
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-600" />

          {/* Exit */}
          <button
            onClick={handleExit}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300"
            aria-label="Fechar modo livro"
            title="Sair do modo livro"
          >
            {XIcon}
          </button>
        </div>

        {/* ── HTMLFlipBook ── */}
        <div className={cn(
          'flex-1 flex items-center justify-center',
          isSerif && 'font-serif',
        )}
          style={isSerif ? { fontFamily: 'Georgia, serif' } : undefined}
        >
          <HTMLFlipBook
            size="fixed"
            width={bookDims.w}
            height={bookDims.h}
            minWidth={300}
            maxWidth={1200}
            minHeight={400}
            maxHeight={1600}
            showCover={true}
            flippingTime={500}
            drawShadow={false}
            maxShadowOpacity={0}
            showPageCorners={true}
            useMouseEvents={true}
            mobileScrollSupport={isMobile}
            startPage={currentPage}
            usePortrait={true}
            disableFlipByClick={false}
            startZIndex={0}
            autoSize={false}
            clickEventForward={true}
            swipeDistance={30}
            onFlip={onFlip}
            ref={flipBookRef}
            className="shadow-2xl"
            style={{}}
          >
            {pages.map((html, i) => (
              <div key={i} className="h-full px-1 bg-white dark:bg-slate-900">
                <div
                  className={cn(
                    'book-page-content w-full h-full overflow-y-auto px-8 py-6 leading-relaxed',
                    'text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900',
                    FONT_SIZE_CLASSES[fontLevel],
                    isSerif && 'font-serif',
                    '[&_*]:max-w-full [&_img]:max-w-full',
                  )}
                  style={isSerif ? { fontFamily: 'Georgia, serif' } : undefined}
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </div>
            ))}
          </HTMLFlipBook>
        </div>

        {/* ── Bookmark-tab Navigation: Prev ── */}
        <button
          onClick={goPrev}
          className={cn(
            'absolute left-0 top-1/2 -translate-y-1/2 z-40 group',
            'flex items-center',
            'py-5 pl-1.5 pr-3 -rotate-3 origin-left',
            'rounded-r-xl',
            'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm',
            'shadow-lg border-y border-r border-slate-200 dark:border-slate-700',
            'text-slate-600 dark:text-slate-300',
            'hover:bg-white dark:hover:bg-slate-700',
            'transition-all duration-300 hover:shadow-xl hover:-rotate-2',
          )}
          aria-label="Página anterior"
          title="← Página anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-0.5 transition-transform">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        {/* ── Bookmark-tab Navigation: Next ── */}
        <button
          onClick={goNext}
          className={cn(
            'absolute right-0 top-1/2 -translate-y-1/2 z-40 group',
            'flex items-center',
            'py-5 pr-1.5 pl-3 rotate-3 origin-right',
            'rounded-l-xl',
            'bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm',
            'shadow-lg border-y border-l border-slate-200 dark:border-slate-700',
            'text-slate-600 dark:text-slate-300',
            'hover:bg-white dark:hover:bg-slate-700',
            'transition-all duration-300 hover:shadow-xl hover:rotate-2',
          )}
          aria-label="Próxima página"
          title="→ Próxima página"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-0.5 transition-transform">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>

        {/* ── Page counter + Chapter indicator ── */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center gap-1.5">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-700 dark:text-slate-300">
            Página {currentPage + 1} de {totalPages}
          </span>
          {chapterLabel && (
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-600 dark:text-slate-400">
              <span
                className="inline-block w-2 h-2 rounded-full flex-shrink-0"
                style={{ backgroundColor: chapterHex }}
              />
              {chapterLabel}
            </span>
          )}
        </div>

        {/* ── Keyboard hint (first visit) ── */}
        {showHint && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
            <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900/90 dark:bg-slate-100/90 text-white dark:text-slate-800 backdrop-blur-sm shadow-xl text-sm font-medium">
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/20 dark:bg-slate-800/20 text-xs font-bold">←</kbd>
              <span>Use</span>
              <kbd className="inline-flex items-center justify-center w-6 h-6 rounded bg-white/20 dark:bg-slate-800/20 text-xs font-bold">→</kbd>
              <span>para navegar entre páginas</span>
            </span>
          </div>
        )}
      </div>

      {/* TOC overlay (outside main container to avoid animation interference) */}
      {TocOverlay}
    </>
  )
}
