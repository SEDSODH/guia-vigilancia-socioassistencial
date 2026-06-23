import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { getTermBySlug } from '@/data/glossary'
import type { ReactNode } from 'react'

interface GlossaryTooltipProps {
  /** Termo a ser exibido (usado como fallback se children não for passado) */
  term?: string
  /** Definição direta do termo (opcional) */
  definition?: string
  /** Slug para buscar definição no glossário (prioriza sobre definition) */
  slug?: string
  /** Conteúdo customizado para o trigger */
  children?: ReactNode
  /** Classes adicionais para o trigger */
  className?: string
}

export default function GlossaryTooltip({
  term,
  definition,
  slug,
  children,
  className,
}: GlossaryTooltipProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [resolvedDef, setResolvedDef] = useState<string | undefined>(undefined)
  const [verticalPos, setVerticalPos] = useState<'bottom' | 'top'>('bottom')
  const [offsetX, setOffsetX] = useState(0)

  const triggerRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const openTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // ── Resolve definition ──────────────────────────────────────
  useEffect(() => {
    if (definition) {
      setResolvedDef(definition)
    } else if (slug) {
      const data = getTermBySlug(slug)
      setResolvedDef(data?.definition)
    } else {
      setResolvedDef(undefined)
    }
  }, [slug, definition])

  // ── Cleanup timers on unmount ────────────────────────────────
  useEffect(() => {
    return () => {
      if (openTimerRef.current) clearTimeout(openTimerRef.current)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  // ── Show / hide helpers ─────────────────────────────────────
  const show = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = undefined
    }
    setIsMounted(true)
    // Pequeno delay para que a animação de entrada aconteça após o mount
    openTimerRef.current = setTimeout(() => setIsOpen(true), 10)
  }, [])

  const hide = useCallback(() => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = undefined
    }
    setIsOpen(false)
    // Delay para permitir animação de saída antes de desmontar
    closeTimerRef.current = setTimeout(() => setIsMounted(false), 200)
  }, [])

  const toggle = useCallback(() => {
    if (isOpen) hide()
    else show()
  }, [isOpen, show, hide])

  // ── Smart positioning (vertical + horizontal) ──────────────
  useEffect(() => {
    if (!isOpen) return

    const updatePosition = () => {
      if (!triggerRef.current || !tooltipRef.current) return
      const trigger = triggerRef.current.getBoundingClientRect()
      const tooltip = tooltipRef.current.getBoundingClientRect()
      const tipW = tooltip.width || 280
      const tipH = tooltip.height || 120

      // Vertical: flip to top if not enough space below
      const spaceBelow = window.innerHeight - trigger.bottom
      const spaceAbove = trigger.top
      setVerticalPos(
        spaceBelow < tipH + 12 && spaceAbove > spaceBelow ? 'top' : 'bottom',
      )

      // Horizontal: shift to avoid viewport overflow
      const center = trigger.left + trigger.width / 2
      const leftEdge = center - tipW / 2
      const rightEdge = center + tipW / 2
      let ox = 0
      if (leftEdge < 12) {
        ox = 12 - leftEdge
      } else if (rightEdge > window.innerWidth - 12) {
        ox = window.innerWidth - 12 - rightEdge
      }
      setOffsetX(ox)
    }

    updatePosition()
    window.addEventListener('scroll', updatePosition, { passive: true })
    window.addEventListener('resize', updatePosition, { passive: true })
    return () => {
      window.removeEventListener('scroll', updatePosition)
      window.removeEventListener('resize', updatePosition)
    }
  }, [isOpen])

  // ── Click outside ───────────────────────────────────────────
  useEffect(() => {
    if (!isMounted) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node) &&
        tooltipRef.current &&
        !tooltipRef.current.contains(e.target as Node)
      ) {
        hide()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isMounted, hide])

  // ── Keyboard ────────────────────────────────────────────────
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
    if (e.key === 'Escape' && isOpen) {
      e.preventDefault()
      hide()
    }
  }

  const handleBlur = (e: React.FocusEvent) => {
    // Não esconde se o foco foi para dentro do tooltip
    if (!tooltipRef.current?.contains(e.relatedTarget as Node)) {
      hide()
    }
  }

  // ── Derived data ────────────────────────────────────────────
  const displayDef = resolvedDef ?? 'Termo não encontrado no glossário'
  const hasDef = resolvedDef !== undefined
  const uniqueId = `gt-${slug ?? term ?? 'tip'}-${Math.random().toString(36).slice(2, 8)}`

  // ── Render ──────────────────────────────────────────────────
  return (
    <span
      ref={triggerRef}
      className={cn(
        'relative inline-flex items-center cursor-help',
        'border-b-2 border-dotted border-institucional-blue/50',
        'hover:border-institucional-blue dark:border-institucional-blue/40',
        'dark:hover:border-institucional-blue/80',
        'transition-colors duration-150',
        className,
      )}
      onMouseEnter={show}
      onMouseLeave={hide}
      onClick={toggle}
      onKeyDown={handleKeyDown}
      onFocus={show}
      onBlur={handleBlur}
      tabIndex={0}
      role="button"
      aria-describedby={isOpen ? uniqueId : undefined}
      aria-expanded={isOpen}
    >
      {children ?? term}

      {isMounted && (
        <div
          ref={tooltipRef}
          id={uniqueId}
          role="tooltip"
          className={cn(
            'absolute z-50 w-[280px] p-3 rounded-lg shadow-xl',
            'bg-slate-800 dark:bg-slate-700 text-white',
            'transition-all duration-200 ease-out will-change-transform',
            isOpen
              ? 'opacity-100 pointer-events-auto'
              : 'opacity-0 pointer-events-none',
            verticalPos === 'bottom' ? 'top-full mt-2' : 'bottom-full mb-2',
          )}
          style={{
            left: '50%',
            transform: isOpen
              ? `translateX(calc(-50% + ${offsetX}px)) translateY(0) scale(1)`
              : `translateX(calc(-50% + ${offsetX}px)) translateY(${verticalPos === 'bottom' ? '4px' : '-4px'}) scale(0.95)`,
          }}
        >
          {/* Seta apontando para o trigger */}
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 w-2 h-2',
              'bg-slate-800 dark:bg-slate-700 rotate-45',
              verticalPos === 'bottom' ? '-top-1' : '-bottom-1',
            )}
            aria-hidden="true"
          />

          {/* Conteúdo */}
          <div className="relative">
            {hasDef && term && (
              <p className="font-semibold text-xs uppercase tracking-wider text-white/70 mb-1">
                {term}
              </p>
            )}
            <p className="text-sm leading-relaxed text-white/90">
              {displayDef}
            </p>
            {!hasDef && (
              <p className="text-xs italic text-white/50 mt-1">
                Termo não encontrado no glossário
              </p>
            )}
          </div>
        </div>
      )}
    </span>
  )
}
