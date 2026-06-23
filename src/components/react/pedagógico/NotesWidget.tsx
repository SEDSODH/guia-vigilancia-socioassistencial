import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

const STORAGE_KEY = 'caderno-notes'
const MAX_CHARS = 500
const DEBOUNCE_MS = 500

interface NotesWidgetProps {
  /** ID único da seção para persistência em localStorage */
  sectionId: string
  /** Título da seção (exibido no cabeçalho do modal) */
  sectionTitle?: string
  /** Classes adicionais para o wrapper */
  className?: string
}

/**
 * NotesWidget — widget de anotações pessoais por seção.
 *
 * - Persiste em localStorage (chave `caderno-notes`)
 * - Auto-save com debounce de 500ms
 * - Suporte a dark mode
 * - Exportação de todas as anotações como JSON
 * - Focus trap + acessibilidade
 *
 * @example
 * <h2 className="group flex items-center gap-2">
 *   Título da Seção
 *   <NotesWidget sectionId="secao-1" sectionTitle="Título da Seção" />
 * </h2>
 */
export default function NotesWidget({ sectionId, sectionTitle, className }: NotesWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [note, setNote] = useState('')
  const [savedNote, setSavedNote] = useState('')
  const [charCount, setCharCount] = useState(0)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  // ── Carregar anotação do localStorage ao montar ──────────────
  useEffect(() => {
    try {
      const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const existing = allNotes[sectionId] || ''
      setNote(existing)
      setSavedNote(existing)
      setCharCount(existing.length)
    } catch {
      // localStorage indisponível ou corrompido — ignora
    }
  }, [sectionId])

  // ── Cleanup do debounce ao desmontar ─────────────────────────
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [])

  // ── Persistência imediata no localStorage ────────────────────
  const persistNotes = useCallback(
    (text: string) => {
      try {
        const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
        if (text.trim()) {
          allNotes[sectionId] = text
        } else {
          delete allNotes[sectionId]
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(allNotes))
      } catch {
        // localStorage cheio ou indisponível — ignora
      }
    },
    [sectionId],
  )

  // ── Auto-save com debounce ───────────────────────────────────
  const saveWithDebounce = useCallback(
    (text: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        persistNotes(text)
      }, DEBOUNCE_MS)
    },
    [persistNotes],
  )

  // ── Handlers ─────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value.slice(0, MAX_CHARS)
    setNote(text)
    setCharCount(text.length)
    saveWithDebounce(text)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const closeModal = useCallback(() => {
    // Reverte para o último estado salvo (desfaz alterações não salvas)
    setNote(savedNote)
    setCharCount(savedNote.length)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
      debounceRef.current = undefined
    }
    setIsOpen(false)
    // Retorna o foco para o botão trigger
    triggerRef.current?.focus()
  }, [savedNote])

  const handleSave = () => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    persistNotes(note)
    setSavedNote(note)
    setIsOpen(false)
    triggerRef.current?.focus()
  }

  const handleCancel = useCallback(() => {
    closeModal()
  }, [closeModal])

  const handleClear = () => {
    setNote('')
    setCharCount(0)
    setSavedNote('')
    if (debounceRef.current) clearTimeout(debounceRef.current)
    persistNotes('')
  }

  const handleExport = () => {
    try {
      const allNotes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}')
      const blob = new Blob([JSON.stringify(allNotes, null, 2)], {
        type: 'application/json',
      })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `anotacoes-caderno-${new Date().toISOString().slice(0, 10)}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch {
      // Falha no export — ignora
    }
  }

  // ── Keyboard: Escape fecha o modal ───────────────────────────
  useEffect(() => {
    if (!isOpen) return

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        handleCancel()
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleCancel])

  // ── Focar textarea ao abrir o modal ──────────────────────────
  useEffect(() => {
    if (!isOpen) return
    const timer = setTimeout(() => {
      textareaRef.current?.focus()
    }, 100)
    return () => clearTimeout(timer)
  }, [isOpen])

  // ── Focus trap ───────────────────────────────────────────────
  const handleTabTrap = (e: React.KeyboardEvent) => {
    if (e.key !== 'Tab') return

    const focusable = modalRef.current?.querySelectorAll<HTMLElement>(
      'button, textarea, [tabindex]:not([tabindex="-1"])',
    )
    if (!focusable || focusable.length === 0) return

    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  // ── Estado derivado ──────────────────────────────────────────
  const hasNote = savedNote.trim().length > 0
  const hasUnsaved = note !== savedNote
  const isNearLimit = charCount >= MAX_CHARS * 0.9

  return (
    <>
      {/* ── Trigger Button ─────────────────────────────────── */}
      <span className={cn('relative inline-flex', className)}>
        <button
          ref={triggerRef}
          type="button"
          onClick={openModal}
          className={cn(
            'inline-flex items-center justify-center',
            'w-8 h-8 rounded-full',
            'bg-institucional-lightBlue dark:bg-institucional-blue/20',
            'hover:bg-institucional-blue/20 dark:hover:bg-institucional-blue/30',
            'text-institucional-blue dark:text-institucional-lightBlue',
            'transition-all duration-200 ease-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue/50',
            'select-none no-print',
            hasNote
              ? 'opacity-100'
              : 'opacity-0 group-hover:opacity-100 focus-visible:opacity-100',
          )}
          aria-label={
            hasNote
              ? `Editar anotação${sectionTitle ? `: ${sectionTitle}` : ''}`
              : `Adicionar anotação${sectionTitle ? `: ${sectionTitle}` : ''}`
          }
          title={hasNote ? 'Editar anotação' : 'Adicionar anotação'}
        >
          {hasNote ? (
            /* Ícone de nota preenchido */
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
              stroke="none"
              aria-hidden="true"
            >
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          ) : (
            /* Ícone de nota outline */
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
              aria-hidden="true"
            >
              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          )}
        </button>
      </span>

      {/* ── Modal ──────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label={sectionTitle ? `Anotação: ${sectionTitle}` : 'Nova anotação'}
        >
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={handleCancel}
            aria-hidden="true"
          />

          {/* Painel do modal */}
          <div
            ref={modalRef}
            onKeyDown={handleTabTrap}
            className={cn(
              'relative w-full max-w-lg',
              'bg-white dark:bg-slate-800',
              'rounded-2xl shadow-2xl',
              'animate-fade-in-scale',
              'overflow-hidden',
              'divide-y divide-slate-200 dark:divide-slate-700',
            )}
          >
            {/* ── Header ──────────────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-5">
              <div className="flex items-center gap-3 min-w-0">
                <span className="flex-shrink-0 w-9 h-9 rounded-full bg-institucional-lightBlue dark:bg-institucional-blue/20 flex items-center justify-center text-institucional-blue dark:text-institucional-lightBlue">
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
                    aria-hidden="true"
                  >
                    <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate leading-tight">
                    {sectionTitle || 'Anotação'}
                  </h3>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5 font-mono truncate">
                    {sectionId}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleCancel}
                className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/50"
                aria-label="Fechar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* ── Body: Textarea ──────────────────────────── */}
            <div className="px-6 py-4">
              <textarea
                ref={textareaRef}
                value={note}
                onChange={handleChange}
                placeholder="Escreva sua anotação pessoal sobre esta seção..."
                maxLength={MAX_CHARS}
                rows={5}
                className={cn(
                  'w-full resize-none',
                  'px-4 py-3 rounded-xl',
                  'border border-slate-200 dark:border-slate-600',
                  'bg-slate-50 dark:bg-slate-700/50',
                  'text-sm text-slate-700 dark:text-slate-300 leading-relaxed',
                  'placeholder:text-slate-400 dark:placeholder:text-slate-500',
                  'focus:outline-none focus:ring-2 focus:ring-institucional-blue/30 focus:border-institucional-blue',
                  'transition-colors duration-150',
                )}
                aria-describedby={`nw-${sectionId}-charcount`}
              />
              <div
                id={`nw-${sectionId}-charcount`}
                className={cn(
                  'flex items-center justify-between mt-1.5 text-xs',
                  isNearLimit
                    ? 'text-red-500 dark:text-red-400'
                    : 'text-slate-400 dark:text-slate-500',
                )}
              >
                <span>
                  {hasUnsaved && (
                    <span className="inline-flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                      Não salvo
                    </span>
                  )}
                </span>
                <span>
                  {charCount}/{MAX_CHARS}
                </span>
              </div>
            </div>

            {/* ── Footer: Ações ───────────────────────────── */}
            <div className="flex items-center justify-between px-6 py-4 bg-slate-50/80 dark:bg-slate-700/30">
              {/* Grupo esquerdo */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={handleClear}
                  disabled={!hasNote && note.trim().length === 0}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                    'text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20',
                    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500/30',
                    'disabled:opacity-30 disabled:cursor-not-allowed',
                  )}
                  aria-label="Limpar anotação desta seção"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                  </svg>
                  Limpar
                </button>
                <button
                  type="button"
                  onClick={handleExport}
                  className={cn(
                    'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
                    'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700',
                    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30',
                  )}
                  aria-label="Exportar todas as anotações como JSON"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Exportar
                </button>
              </div>

              {/* Grupo direito */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCancel}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700',
                    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400/30',
                  )}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium',
                    'bg-institucional-blue text-white',
                    'hover:bg-institucional-blue/90 active:bg-institucional-blue/80',
                    'transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue/50',
                  )}
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
