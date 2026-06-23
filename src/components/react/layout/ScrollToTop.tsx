import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollY = window.scrollY
      setVisible(scrollY > 500)
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={cn(
          'fixed bottom-6 right-6 z-30 bg-institucional-blue text-white p-3 rounded-full shadow-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-institucional-blue focus-visible:ring-offset-2',
        visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-90 pointer-events-none',
      )}
      aria-label="Voltar ao topo"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
      <div
        className="absolute inset-0 rounded-full border-2 border-institucional-green opacity-30"
        style={{
          clipPath: `inset(${(1 - scrollProgress) * 100}% 0 0 0)`,
        }}
      />
    </button>
  )
}