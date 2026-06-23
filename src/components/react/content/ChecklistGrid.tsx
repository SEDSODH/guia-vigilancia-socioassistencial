import { useState, useCallback } from 'react'
import { cn } from '@/lib/utils'
import type { ChecklistItem } from '@/types'

interface Props {
  items: ChecklistItem[]
  className?: string
}

function useLocalStorageChecklist() {
  const [completed, setCompleted] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('caderno-checklist')
      return saved ? JSON.parse(saved) : {}
    } catch {
      return {}
    }
  })

  const toggle = useCallback(
    (id: string) => {
      setCompleted((prev) => {
        const next = { ...prev, [id]: !prev[id] }
        try {
          localStorage.setItem('caderno-checklist', JSON.stringify(next))
        } catch {}
        return next
      })
    },
    [],
  )

  const reset = useCallback(() => {
    setCompleted({})
    try {
      localStorage.setItem('caderno-checklist', JSON.stringify({}))
    } catch {}
  }, [])

  return { completed, toggle, reset }
}

export default function ChecklistGrid({ items, className }: Props) {
  const { completed, toggle, reset } = useLocalStorageChecklist()
  const completedCount = Object.values(completed).filter(Boolean).length
  const progress = Math.round((completedCount / items.length) * 100)

  return (
    <div className={className}>
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {completedCount} de {items.length} itens verificados
        </span>
        <div className="w-32 h-2 bg-slate-200 dark:bg-slate-600 rounded-full overflow-hidden">
          <div
            className="h-full bg-institucional-green transition-all duration-500 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {items.map((item) => {
          const isChecked = !!completed[item.id]
          return (
            <button
              key={item.id}
              onClick={() => toggle(item.id)}
              className={cn(
                'flex items-start bg-white dark:bg-slate-800 p-3 rounded shadow-sm border text-left transition-all hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2',
                isChecked
                  ? 'border-institucional-green bg-institucional-lightGreen dark:bg-green-900/30'
                  : 'border-slate-100 dark:border-slate-700',
              )}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn('mr-3 flex-shrink-0 mt-0.5', isChecked ? 'text-institucional-green' : 'text-slate-300 dark:text-slate-600')}
              >
                {isChecked ? (
                  <>
                    <polyline points="9 11 12 14 22 4" />
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                  </>
                ) : (
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                )}
              </svg>
              <span className={cn('text-sm font-medium', isChecked ? 'text-slate-600 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300')}>
                {item.text}
              </span>
            </button>
          )
        })}
      </div>
      {completedCount > 0 && (
        <div className="mt-4 flex justify-end">
          <button
            onClick={reset}
            className="text-xs font-medium text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2"
          >
            Limpar checklist
          </button>
        </div>
      )}
    </div>
  )
}
