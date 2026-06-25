import { useEffect, useRef, useState, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import {
  WELCOME_CONFIG,
  WELCOME_TEAM,
  WELCOME_CONTACT,
  WELCOME_CONTENT,
  OTHER_CADERNOS,
} from '@/data/welcome'

// ─── Inline SVG icons (Lucide-style, matching project pattern) ────────────────
const SVG = {
  bookOpen:
    '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>',
  x: '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  externalLink:
    '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
  mail: '<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',
  building:
    '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>',
  chevronRight:
    '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
}

// ─── CadernoLink ───────────────────────────────────────────────────────────────
function CadernoLink({
  caderno,
}: {
  caderno: (typeof OTHER_CADERNOS)[number]
}) {
  return (
    <a
      href={caderno.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'flex items-center gap-2.5 px-3 py-2.5 rounded-lg',
        'bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/80 dark:to-slate-800/40',
        'border border-slate-200 dark:border-slate-700',
        'hover:shadow-md hover:border-institucional-blue/50 hover:-translate-y-0.5',
        'dark:hover:bg-institucional-blue/10',
        'transition-all duration-200',
        'group',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2',
      )}
    >
      <span
        className={cn(
          'w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5',
          caderno.accentClass,
        )}
        aria-hidden="true"
      />
      <span className="flex-1 min-w-0">
        <span className="block text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-institucional-blue transition-colors">
          {caderno.label}
        </span>
        <span className="block text-xs text-slate-500 dark:text-slate-400 truncate">
          {caderno.description}
        </span>
      </span>
      <span
        className="flex-shrink-0 text-slate-400 group-hover:text-institucional-blue transition-colors"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: SVG.externalLink }}
      />
    </a>
  )
}

// ─── Section badge (project pattern: pill with variant color) ──────────────────
function SectionBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.5625rem] font-bold uppercase tracking-wider bg-institucional-lightBlue dark:bg-institucional-blue/20 text-institucional-blue dark:text-institucional-blue/90">
      {label}
    </span>
  )
}

// ─── WelcomeModal ─────────────────────────────────────────────────────────────
interface WelcomeModalProps {
  forceShow?: boolean
}

export function WelcomeModal({ forceShow = false }: WelcomeModalProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [dontShowAgain, setDontShowAgain] = useState(false)
  const [mounted, setMounted] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => setMounted(true), [])

  // Show logic — não abre se já estiver em modo livro
  useEffect(() => {
    if (!mounted) return
    // Não abre o modal se o modo livro já está ativo
    if (document.body.getAttribute('data-reading-mode') === 'book') return
    const seen = localStorage.getItem(WELCOME_CONFIG.localStorageKey)
    if (forceShow || !seen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, WELCOME_CONFIG.showDelayMs)
      return () => clearTimeout(timer)
    }
  }, [mounted, forceShow])

  // Focus trap & Escape
  useEffect(() => {
    if (!isOpen) return

    closeButtonRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
        return
      }
      if (e.key === 'Tab') {
        const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        )
        if (!focusable || focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
      if (dontShowAgain) {
        localStorage.setItem(WELCOME_CONFIG.localStorageKey, 'true')
      }
    }, 250)
  }, [dontShowAgain])

  if (!mounted) return null

  const content = (
    <div
      className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4 pointer-events-none"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/40 backdrop-blur-sm',
          'transition-opacity duration-300',
          isOpen && !isClosing ? 'opacity-100' : 'opacity-0',
        )}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Dialog panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        aria-describedby="welcome-description"
        className={cn(
          'relative w-full max-w-2xl max-h-[85vh] overflow-y-auto styled-scrollbar',
          'bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-900',
          'rounded-2xl shadow-2xl',
          'border border-slate-200 dark:border-slate-700',
          isOpen ? 'pointer-events-auto' : 'pointer-events-none',
          isOpen && !isClosing
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4',
          'transition-all duration-300',
        )}
      >
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="relative p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-100 dark:border-slate-800">
          {/* Accent gradient bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-institucional-blue via-institucional-blue/70 to-institucional-green pointer-events-none"
            aria-hidden="true"
          />

          <button
            ref={closeButtonRef}
            onClick={handleClose}
            aria-label="Fechar"
            className={cn(
              'absolute top-3 right-3 z-10 p-2.5 rounded-full',
              'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200',
              'bg-slate-100 dark:bg-slate-800',
              'hover:bg-slate-200 dark:hover:bg-slate-700',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2',
            )}
            dangerouslySetInnerHTML={{ __html: SVG.x }}
          />

          <div className="flex items-start gap-4 pr-10 animate-slide-down" style={{ '--delay': '0ms' } as React.CSSProperties}>
            {/* Header icon container — project pattern: 48px, gradient, rounded */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-institucional-blue to-institucional-blue/80 text-white"
              dangerouslySetInnerHTML={{ __html: SVG.bookOpen }}
            />
            <div>
              <h2
                id="welcome-title"
                className="text-xl font-bold text-slate-900 dark:text-white leading-tight"
              >
                {WELCOME_CONTENT.title}
              </h2>
              <p className="text-sm font-medium text-institucional-blue dark:text-institucional-blue/80 mt-0.5">
                {WELCOME_CONTENT.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* ── Body ───────────────────────────────────────────────────── */}
        <div className="px-4 py-5 sm:p-6 space-y-5">
          {/* Descrição */}
          <p
            id="welcome-description"
            className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed animate-slide-down"
            style={{ '--delay': '80ms' } as React.CSSProperties}
          >
            {WELCOME_CONTENT.description}
          </p>

          {/* ── Equipe responsável ── */}
          <section
            aria-labelledby="team-heading"
            className="animate-slide-down"
            style={{ '--delay': '160ms' } as React.CSSProperties}
          >
            <h3 id="team-heading" className="mb-3">
              <SectionBadge label={WELCOME_CONTENT.teamLabel} />
            </h3>
            <div className="space-y-2.5">
              {WELCOME_TEAM.map((member) => (
                <div
                  key={member.unit}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-white to-slate-50 dark:from-slate-800/60 dark:to-slate-800/30 border border-slate-100 dark:border-slate-700"
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-institucional-blue/15 to-institucional-blue/10 dark:from-institucional-blue/20 dark:to-institucional-blue/15 text-institucional-blue"
                    dangerouslySetInnerHTML={{ __html: SVG.building }}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                        {member.unit}
                      </p>
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[0.5625rem] font-bold uppercase tracking-wider bg-institucional-lightBlue dark:bg-institucional-blue/20 text-institucional-blue dark:text-institucional-blue/90">
                        {member.role}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      <span className="font-medium text-slate-700 dark:text-slate-300">Desenvolvedor:</span>{' '}
                      {member.responsible}
                      {member.support && (
                        <>
                          {' — '}
                          <span className="font-medium text-slate-700 dark:text-slate-300">Conteudistas:</span>{' '}
                          {member.support}
                        </>
                      )}
                    </p>
                    <span
                      className={cn(
                        'inline-flex items-center gap-1.5 mt-1.5 text-xs',
                        'text-institucional-blue underline underline-offset-2 decoration-institucional-blue/40',
                      )}
                    >
                      <span aria-hidden="true" dangerouslySetInnerHTML={{ __html: SVG.mail }} />
                      {member.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2.5 flex items-center gap-1.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
              Contato: {WELCOME_CONTACT.phone}
            </p>
          </section>

          {/* ── Outros cadernos ── */}
          <section
            aria-labelledby="cadernos-heading"
            className="animate-slide-down"
            style={{ '--delay': '320ms' } as React.CSSProperties}
          >
            <h3 id="cadernos-heading" className="mb-3">
              <SectionBadge label={WELCOME_CONTENT.otherCadernosLabel} />
            </h3>
            {OTHER_CADERNOS.length > 0 ? (
              <div className="space-y-2">
                {OTHER_CADERNOS.map((caderno) => (
                  <CadernoLink key={caderno.href} caderno={caderno} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-slate-400 dark:text-slate-500 italic px-3 py-2">
                {WELCOME_CONTENT.otherCadernosEmpty}
              </p>
            )}
          </section>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div
          className="px-4 sm:px-6 pb-4 sm:pb-5 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-4 flex-wrap animate-slide-down"
          style={{ '--delay': '400ms' } as React.CSSProperties}
        >
          <label className="flex items-center gap-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={dontShowAgain}
              onChange={(e) => setDontShowAgain(e.target.checked)}
              className={cn(
                'w-4 h-4 rounded border-slate-300 dark:border-slate-600',
                'text-institucional-blue',
                'focus:ring-2 focus:ring-institucional-blue focus:ring-offset-2',
                'cursor-pointer',
                'accent-institucional-blue',
              )}
            />
            <span className="text-xs text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-300 transition-colors select-none">
              {WELCOME_CONTENT.dontShowAgainLabel}
            </span>
          </label>

          <button
            onClick={handleClose}
            className={cn(
              'px-5 py-2 rounded-xl text-sm font-semibold',
              'bg-gradient-to-r from-institucional-blue to-institucional-blue/90 text-white',
              'hover:from-institucional-blue/95 hover:to-institucional-blue/80',
              'hover:-translate-y-0.5 hover:shadow-md',
              'active:scale-95',
              'transition-all duration-200',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2',
            )}
          >
            {WELCOME_CONTENT.ctaLabel}
          </button>
        </div>
      </div>
    </div>
  )

  if (typeof document === 'undefined') return null
  return createPortal(content, document.body)
}

// ─── Exported helper ───────────────────────────────────────────────────────────
export function openWelcomeModal() {
  localStorage.removeItem(WELCOME_CONFIG.localStorageKey)
  window.dispatchEvent(new CustomEvent('open-welcome-modal'))
}
