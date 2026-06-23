import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { FAQItem } from '@/types'

interface Props {
  items: FAQItem[]
  className?: string
  allowMultiple?: boolean
}

export default function FAQAccordion({ items, className, allowMultiple = true }: Props) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggle = (index: number) => {
    setOpenItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        if (!allowMultiple) next.clear()
        next.add(index)
      }
      return next
    })
  }

  const toggleAll = () => {
    if (openItems.size === items.length) {
      setOpenItems(new Set())
    } else {
      setOpenItems(new Set(items.map((_, i) => i)))
    }
  }

  const allExpanded = openItems.size === items.length

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex justify-end">
        <button
          onClick={toggleAll}
          className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          {allExpanded ? 'Recolher todas' : 'Expandir todas'}
        </button>
      </div>
      {items.map((item, i) => {
        const isOpen = openItems.has(i)
        return (
          <div key={i} className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(i)}
              className="w-full p-4 font-bold text-slate-800 dark:text-slate-200 flex items-center justify-between cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2"
            >
              <span className="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-institucional-blue flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                <span className="text-sm">{item.question}</span>
              </span>
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
                className={cn('text-slate-400 dark:text-slate-500 transition-transform duration-200 flex-shrink-0', isOpen && 'rotate-180')}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
            {isOpen && (
              <div className="p-4 pt-0 text-sm text-slate-700 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700">
                <p className="mt-3" dangerouslySetInnerHTML={{ __html: item.answer }} />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
