import { useState, useEffect, useCallback, useRef } from 'react'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────

interface FeedbackData {
  type: 'useful' | 'not-useful'
  timestamp: number
  comment?: string
}

interface FeedbackWidgetProps {
  /** ID único da seção para persistir feedback */
  sectionId: string
  /** Classes CSS opcionais */
  className?: string
}

// ── localStorage helpers ──────────────────────────────────────

function getStorageKey(sectionId: string): string {
  return `caderno-feedback-${sectionId}`
}

function loadFeedback(sectionId: string): FeedbackData | null {
  try {
    const raw = localStorage.getItem(getStorageKey(sectionId))
    if (!raw) return null
    return JSON.parse(raw) as FeedbackData
  } catch {
    return null
  }
}

function saveFeedback(sectionId: string, data: FeedbackData): void {
  try {
    localStorage.setItem(getStorageKey(sectionId), JSON.stringify(data))
  } catch {
    // localStorage indisponível — falha silenciosa
  }
}

// ── Component ─────────────────────────────────────────────────

export default function FeedbackWidget({ sectionId, className }: FeedbackWidgetProps) {
  const [feedback, setFeedback] = useState<'useful' | 'not-useful' | null>(null)
  const [showComment, setShowComment] = useState(false)
  const [comment, setComment] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [existing, setExisting] = useState<FeedbackData | null>(null)
  const [mounted, setMounted] = useState(false)

  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // ── Mount: carregar estado salvo ─────────────────────────────
  useEffect(() => {
    const saved = loadFeedback(sectionId)
    if (saved) {
      setExisting(saved)
      setFeedback(saved.type)
      setComment(saved.comment ?? '')
      setSubmitted(true)
    }
    // Pequeno delay para animação de entrada
    const timer = setTimeout(() => setMounted(true), 10)
    return () => clearTimeout(timer)
  }, [sectionId])

  // ── Foco no textarea quando expandir ─────────────────────────
  useEffect(() => {
    if (showComment && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [showComment])

  // ── Handlers ─────────────────────────────────────────────────

  const handleFeedback = useCallback(
    (type: 'useful' | 'not-useful') => {
      const data: FeedbackData = { type, timestamp: Date.now() }
      saveFeedback(sectionId, data)
      setFeedback(type)
      setSubmitted(true)
    },
    [sectionId],
  )

  const handleSaveComment = useCallback(() => {
    const trimmed = comment.trim()
    const data: FeedbackData = {
      type: feedback as 'useful' | 'not-useful',
      timestamp: Date.now(),
      comment: trimmed || undefined,
    }
    saveFeedback(sectionId, data)
    setShowComment(false)
  }, [comment, feedback, sectionId])

  const handleCommentKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        setShowComment(false)
      }
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        handleSaveComment()
      }
    },
    [handleSaveComment],
  )

  // ── Render estados ───────────────────────────────────────────

  // Estado: feedback já enviado anteriormente
  if (existing && feedback) {
    return (
      <div
        className={cn(
          'rounded-xl p-4 border transition-all duration-500',
          'animate-fade-in-scale',
          feedback === 'useful'
            ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-2">
          {feedback === 'useful' ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600 dark:text-green-400 flex-shrink-0">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-600 dark:text-red-400 flex-shrink-0">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
            </svg>
          )}
          <span className={cn(
            'text-sm font-medium',
            feedback === 'useful'
              ? 'text-green-700 dark:text-green-300'
              : 'text-red-700 dark:text-red-300',
          )}>
            {feedback === 'useful'
              ? 'Feedback enviado! Obrigado pela avaliação.'
              : 'Feedback enviado! Agradecemos seu retorno.'}
          </span>
        </div>
        {existing.comment && (
          <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 italic pl-7">
            "{existing.comment}"
          </p>
        )}
      </div>
    )
  }

  // ── Render principal ─────────────────────────────────────────

  return (
    <div
      className={cn(
        'rounded-xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
        'transition-all duration-500 ease-out',
        mounted ? 'animate-fade-in-up opacity-100' : 'opacity-0 translate-y-4',
        className,
      )}
    >
      {/* Título */}
      <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">
        Este conteúdo foi útil?
      </p>

      {/* Botões de feedback */}
      <div className="flex gap-2" role="group" aria-label="Feedback sobre o conteúdo">
        <button
          onClick={() => handleFeedback('useful')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-institucional-blue',
            submitted && feedback === 'useful'
              ? 'bg-green-100 dark:bg-green-900/40 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 shadow-sm'
              : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600',
          )}
          disabled={submitted}
          aria-label="Marcar como útil"
          aria-pressed={submitted && feedback === 'useful'}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" aria-hidden="true">
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
          </svg>
          Útil
        </button>

        <button
          onClick={() => handleFeedback('not-useful')}
          className={cn(
            'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-institucional-blue',
            submitted && feedback === 'not-useful'
              ? 'bg-red-100 dark:bg-red-900/40 border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 shadow-sm'
              : 'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-600',
          )}
          disabled={submitted}
          aria-label="Marcar como não útil"
          aria-pressed={submitted && feedback === 'not-useful'}
          type="button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0" aria-hidden="true">
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zM17 2h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17" />
          </svg>
          Não útil
        </button>
      </div>

      {/* Estado: enviado + opção de comentário */}
      {submitted && (
        <div className={cn(
          'mt-3 space-y-3 transition-all duration-300',
          'animate-fade-in-up',
        )}>
          {/* Botão "Ver comentário" */}
          {!showComment && (
            <button
              onClick={() => setShowComment(true)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium transition-colors duration-200',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-institucional-blue rounded px-2 py-1',
                feedback === 'useful'
                  ? 'text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900/30'
                  : 'text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-900/30',
              )}
              type="button"
              aria-expanded={false}
              aria-controls={`feedback-comment-${sectionId}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              Adicionar comentário
            </button>
          )}

          {/* Campo de comentário expandível */}
          <div
            id={`feedback-comment-${sectionId}`}
            className={cn(
              'overflow-hidden transition-all duration-300 ease-out',
              showComment ? 'max-h-48 opacity-100' : 'max-h-0 opacity-0',
            )}
          >
            <div className="space-y-2">
              <textarea
                ref={textareaRef}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                onKeyDown={handleCommentKeyDown}
                placeholder="Deixe seu comentário (opcional)"
                rows={3}
                className={cn(
                  'w-full resize-none rounded-lg border px-3 py-2 text-sm',
                  'bg-white dark:bg-slate-700 border-slate-200 dark:border-slate-600',
                  'text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:border-transparent',
                  'transition-colors duration-200',
                )}
                aria-label="Seu comentário sobre este conteúdo"
              />
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 dark:text-slate-500">
                  {comment.length > 0 && `${comment.length} caracteres`}
                  &nbsp;{/* Espaço reservado */}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setShowComment(false)
                      setComment('')
                    }}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-200',
                      'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200',
                      'hover:bg-slate-100 dark:hover:bg-slate-700',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-institucional-blue',
                    )}
                    type="button"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSaveComment}
                    disabled={!comment.trim()}
                    className={cn(
                      'text-xs font-medium px-3 py-1.5 rounded-lg transition-all duration-200',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-institucional-blue',
                      comment.trim()
                        ? feedback === 'useful'
                          ? 'bg-green-600 hover:bg-green-700 text-white shadow-sm'
                          : 'bg-institucional-blue hover:bg-institucional-blue/90 text-white shadow-sm'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed',
                    )}
                    type="button"
                  >
                    Salvar
                  </button>
                </div>
              </div>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">
                Pressione <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">Esc</kbd> para fechar ou{' '}
                <kbd className="px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 font-mono text-[10px]">⌘Enter</kbd> para salvar
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
