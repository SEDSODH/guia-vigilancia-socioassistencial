import { useState } from 'react'
import { cn } from '@/lib/utils'
import { AlertTriangle, CheckCircle } from 'lucide-react'

function fmt(v: number): string {
  return v.toLocaleString('pt-BR', { minimumFractionDigits: 2 })
}

export default function GaugeLimit60() {
  const [state, setState] = useState({ total: 100000, pct: 45 })

  const parse = (v: string) => {
    const n = Number(v)
    return Number.isNaN(n) ? 0 : n
  }

  const set = (field: 'total' | 'pct') => (e: React.ChangeEvent<HTMLInputElement>) => {
    setState(prev => ({ ...prev, [field]: parse(e.target.value) }))
  }

  const pct = Math.max(0, Math.min(100, state.pct))
  const total = Math.max(0, state.total)
  const valorFolha = (total * pct) / 100
  const limite = (total * 60) / 100
  const excede = pct > 60

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm dark:bg-slate-800 dark:border-slate-700">
      <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4">Simulador: Limite de 60% para Folha</h4>

      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-2">Valor total repassado (R$)</label>
          <input
            type="number"
            value={state.total}
            onChange={set('total')}
            className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-institucional-blue dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600"
          />
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Percentual destinado a folha</label>
            <span className={cn('text-sm font-bold inline-flex items-center gap-1', excede ? 'text-red-600 dark:text-red-400' : 'text-institucional-green')}>
              {excede ? <AlertTriangle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
              {pct}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={state.pct}
            onChange={(e) => setState(prev => ({ ...prev, pct: Number(e.target.value) }))}
            className="w-full h-3 cursor-pointer accent-institucional-blue slider-thumb"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Valor em folha</span>
            <span className={cn('text-lg font-bold inline-flex items-center gap-1.5', excede ? 'text-red-600 dark:text-red-400' : 'text-slate-800 dark:text-slate-200')}>
              {excede && <AlertTriangle className="w-5 h-5" />}
              R$ {fmt(valorFolha)}
            </span>
          </div>
          <div className="bg-institucional-lightGreen dark:bg-green-900/30 p-4 rounded-lg text-center">
            <span className="text-xs text-slate-500 dark:text-slate-400 block">Limite permitido (60%)</span>
            <span className="text-lg font-bold text-institucional-green">
              R$ {fmt(limite)}
            </span>
          </div>
        </div>

        {excede && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700 text-center dark:bg-red-900/30 dark:border-red-800 dark:text-red-300">
            <strong>Atenção:</strong> O valor ultrapassa o limite de 60% permitido para pagamento de equipes de referência.
          </div>
        )}
      </div>
    </div>
  )
}