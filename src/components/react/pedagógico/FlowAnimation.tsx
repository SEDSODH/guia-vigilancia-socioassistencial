import { useState, useEffect, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'

// ── Types ──────────────────────────────────────────────────────

interface FlowStepData {
  number: number
  label: string
  shortDesc: string
  fullDesc: string
  details: string[]
  icon: 'transfer' | 'account' | 'commit' | 'confirm' | 'payment' | 'report'
}

// ─── Step Data ─────────────────────────────────────────────────

const FLOW_STEPS: FlowStepData[] = [
  {
    number: 1,
    label: 'Repasse FEAS',
    shortDesc: 'Estado repassa recursos ao FMAS',
    fullDesc:
      'O Estado transfere os recursos do FEAS (Fundo Estadual de Assistência Social) para o FMAS (Fundo Municipal de Assistência Social), conforme pactuado no Plano de Ação e aprovado pelo CMAS.',
    details: [
      'Baseado no Plano de Ação aprovado pelo CMAS',
      'Transferência fundo a fundo',
      'Recursos carimbados por bloco de financiamento',
      'Acompanhamento e fiscalização pelo CMAS',
    ],
    icon: 'transfer',
  },
  {
    number: 2,
    label: 'Conta FMAS',
    shortDesc: 'Recursos disponíveis na conta',
    fullDesc:
      'Os recursos são depositados na conta bancária específica do FMAS, ficando disponíveis para movimentação pela gestão municipal, sempre vinculados às finalidades da assistência social.',
    details: [
      'Conta bancária específica do FMAS',
      'Recursos identificados por bloco de financiamento',
      'Rendimentos de aplicação financeira pertencem ao fundo',
      'Movimentação exclusiva pelo gestor do FMAS',
    ],
    icon: 'account',
  },
  {
    number: 3,
    label: 'Empenho',
    shortDesc: 'Reserva orçamentária da despesa',
    fullDesc:
      'O empenho é o ato da autoridade competente que cria para o município a obrigação de pagamento pendente ou não de implemento de condição. É a primeira etapa da despesa pública, reservando o orçamento para aquela despesa específica.',
    details: [
      'Prévia autorização orçamentária',
      'Reserva o valor para a despesa específica',
      'Fundamento legal: Lei 4.320/64',
      'Registra o comprometimento da dotação orçamentária',
    ],
    icon: 'commit',
  },
  {
    number: 4,
    label: 'Liquidação',
    shortDesc: 'Confirmação do objeto ou serviço',
    fullDesc:
      'A liquidação consiste na verificação do direito adquirido pelo credor tendo por base os títulos e documentos comprobatórios do respectivo crédito. É quando se atesta que o serviço foi prestado ou o produto entregue conforme contratado.',
    details: [
      'Verificação da entrega do produto ou serviço',
      'Conferência de notas fiscais e documentos',
      'Atesto do recebimento pelo setor competente',
      'Geração do direito ao pagamento',
    ],
    icon: 'confirm',
  },
  {
    number: 5,
    label: 'Pagamento',
    shortDesc: 'Saída efetiva do recurso',
    fullDesc:
      'O pagamento é a saída efetiva dos recursos da conta do FMAS para o credor. É a ordem de pagamento emitida após a liquidação da despesa, transferindo os recursos financeiros ao beneficiário final.',
    details: [
      'Ordem bancária de pagamento',
      'Transferência eletrônica ao credor',
      'Baixa da obrigação registrada no sistema',
      'Comprovação pelo extrato bancário',
    ],
    icon: 'payment',
  },
  {
    number: 6,
    label: 'Prestação',
    shortDesc: 'Prestação de contas ao CMAS',
    fullDesc:
      'A prestação de contas é o processo pelo qual o gestor do FMAS demonstra ao CMAS e aos órgãos de controle a correta aplicação dos recursos recebidos. Deve ser apresentada anualmente e sempre que solicitada.',
    details: [
      'Relatório de gestão fiscal consolidado',
      'Prestação ao CMAS até 31 de março',
      'Apreciação e parecer pelo Conselho',
      'Encaminhamento ao TCE e CGU',
    ],
    icon: 'report',
  },
]

// ─── Inline SVG Icons ──────────────────────────────────────────

function IconTransfer() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-600 dark:text-amber-400"
    >
      <rect x="2" y="16" width="20" height="4" rx="1" />
      <path d="M4 16V8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8" />
      <path d="M8 12h8" />
      <polyline points="12 8 12 12 15 10" />
      <polyline points="9 10 12 12 12 8" />
    </svg>
  )
}

function IconAccount() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-600 dark:text-amber-400"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="M12 8v8" />
      <path d="M8 12h8" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function IconCommit() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-600 dark:text-amber-400"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="13" x2="15" y2="13" />
      <line x1="9" y1="17" x2="13" y2="17" />
      <circle cx="16" cy="13" r="3" fill="currentColor" stroke="none" opacity="0.3" />
    </svg>
  )
}

function IconConfirm() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-600 dark:text-amber-400"
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="16 8 10 16 7 13" />
      <path d="M12 6v6l3 2" opacity="0.3" />
    </svg>
  )
}

function IconPayment() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-600 dark:text-amber-400"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v12" />
      <path d="M8 10c0-1.1.9-2 2-2h4a2 2 0 0 1 0 4h-4a2 2 0 0 0 0 4h4a2 2 0 0 0 2-2" />
    </svg>
  )
}

function IconReport() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-amber-600 dark:text-amber-400"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="16" x2="15" y2="16" />
      <path d="M9 8h2" opacity="0.5" />
    </svg>
  )
}

function getStepIcon(type: FlowStepData['icon']) {
  switch (type) {
    case 'transfer':
      return <IconTransfer />
    case 'account':
      return <IconAccount />
    case 'commit':
      return <IconCommit />
    case 'confirm':
      return <IconConfirm />
    case 'payment':
      return <IconPayment />
    case 'report':
      return <IconReport />
  }
}

// ─── Arrow Connectors ─────────────────────────────────────────

function ArrowRight({ index, isAnimated }: { index: number; isAnimated: boolean }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 mx-1 md:mx-2 transition-all duration-500 ease-out',
        isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2',
      )}
      style={{ transitionDelay: `${(index + 1) * 150 + 100}ms` }}
      aria-hidden="true"
    >
      <svg width="36" height="24" viewBox="0 0 36 24" className="overflow-visible">
        {/* Linha do conector */}
        <line
          x1="0"
          y1="12"
          x2="28"
          y2="12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-amber-300 dark:text-amber-600"
        />
        {/* Ponta da seta */}
        <polyline
          points="22,6 28,12 22,18"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500 dark:text-amber-400"
        />
        {/* Bolinha pulsante que percorre a seta */}
        <circle r="3" fill="currentColor" className="text-amber-500 dark:text-amber-400">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M0,12 L28,12"
            begin={isAnimated ? '0s' : 'indefinite'}
          />
        </circle>
      </svg>
    </div>
  )
}

function ArrowDown({ index, isAnimated }: { index: number; isAnimated: boolean }) {
  return (
    <div
      className={cn(
        'flex-shrink-0 my-1 transition-all duration-500 ease-out',
        isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      )}
      style={{ transitionDelay: `${(index + 1) * 150 + 100}ms` }}
      aria-hidden="true"
    >
      <svg width="24" height="36" viewBox="0 0 24 36" className="overflow-visible">
        {/* Linha do conector */}
        <line
          x1="12"
          y1="0"
          x2="12"
          y2="28"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="text-amber-300 dark:text-amber-600"
        />
        {/* Ponta da seta */}
        <polyline
          points="6,22 12,28 18,22"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-amber-500 dark:text-amber-400"
        />
        {/* Bolinha pulsante que percorre a seta */}
        <circle r="3" fill="currentColor" className="text-amber-500 dark:text-amber-400">
          <animateMotion
            dur="2s"
            repeatCount="indefinite"
            path="M12,0 L12,28"
            begin={isAnimated ? '0s' : 'indefinite'}
          />
        </circle>
      </svg>
    </div>
  )
}

// ─── Main Component ────────────────────────────────────────────

interface FlowAnimationProps {
  className?: string
}

export default function FlowAnimation({ className }: FlowAnimationProps) {
  const [isAnimated, setIsAnimated] = useState(false)
  const [expandedStep, setExpandedStep] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const expandedRef = useRef<HTMLDivElement>(null)

  // ── IntersectionObserver: lazy load entrance animation ──────
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsAnimated(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' },
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  // ── Responsivo ──────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Click outside to close expanded ─────────────────────────
  useEffect(() => {
    if (expandedStep === null) return

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setExpandedStep(null)
        return
      }

      // Se clicou em outro step, não fecha (o toggle cuida disso)
      // Se clicou fora do expanded card e fora de qualquer step, fecha
      const target = e.target as Node
      if (
        expandedRef.current &&
        !expandedRef.current.contains(target)
      ) {
        const stepButtons = containerRef.current?.querySelectorAll('[data-step]')
        let insideStep = false
        stepButtons?.forEach((btn) => {
          if (btn.contains(target)) insideStep = true
        })
        if (!insideStep) {
          setExpandedStep(null)
        }
      }
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpandedStep(null)
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [expandedStep])

  // ── Restart animation ───────────────────────────────────────
  const restartAnimation = useCallback(() => {
    setIsAnimated(false)
    setExpandedStep(null)
    // Duplo rAF para garantir que o CSS reinicie
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsAnimated(true)
      })
    })
  }, [])

  // ── Toggle step expand ──────────────────────────────────────
  const toggleStep = useCallback((num: number) => {
    setExpandedStep((prev) => (prev === num ? null : num))
  }, [])

  // ── Get expanded step data ──────────────────────────────────
  const expandedData = expandedStep
    ? FLOW_STEPS.find((s) => s.number === expandedStep)
    : null

  // ── Render ──────────────────────────────────────────────────
  return (
    <>
      {/* Keyframes para animações específicas do componente */}
      <style>{`
        @keyframes flow-arrow-glow {
          0%, 100% { opacity: 0.25; }
          50% { opacity: 1; }
        }
        @keyframes flow-slide-up {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .flow-expand-enter {
          animation: flow-slide-up 0.35s ease-out forwards;
        }
      `}</style>

      <div
        ref={containerRef}
        className={cn(
          'bg-white dark:bg-slate-800 rounded-xl shadow-md',
          'border border-slate-200 dark:border-slate-700',
          'p-6 md:p-8',
          className,
        )}
      >
        {/* ── Header ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-start justify-between gap-3 mb-6 md:mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
              Fluxo do Dinheiro
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              FEAS → FMAS → Prestação de Contas
            </p>
          </div>

          <button
            onClick={restartAnimation}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium',
              'border border-amber-200 dark:border-amber-700',
              'text-amber-700 dark:text-amber-400',
              'bg-amber-50 dark:bg-amber-900/30',
              'hover:bg-amber-100 dark:hover:bg-amber-900/50',
              'active:scale-95 transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-800',
            )}
            type="button"
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
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Reproduzir animação
          </button>
        </div>

        {/* ── Flow Diagram ───────────────────────────────────── */}
        <div
          className={cn(
            'flex items-center justify-center',
            isMobile ? 'flex-col' : 'flex-row flex-wrap',
          )}
          role="list"
          aria-label="Etapas do fluxo financeiro"
        >
          {FLOW_STEPS.map((step, i) => (
            <div
              key={step.number}
              className={cn(
                'flex',
                isMobile
                  ? 'flex-col items-center w-full'
                  : 'flex-row items-center',
              )}
              role="listitem"
            >
              {/* ── Step Node ──────────────────────────────── */}
              <button
                data-step={step.number}
                onClick={() => toggleStep(step.number)}
                className={cn(
                  'group relative flex flex-col items-center text-center cursor-pointer',
                  'transition-all duration-500 ease-out',
                  isAnimated
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-4',
                  expandedStep === step.number && 'scale-105',
                )}
                style={{ transitionDelay: `${i * 150}ms` }}
                title={step.shortDesc}
                type="button"
                aria-expanded={expandedStep === step.number}
                aria-label={`${step.label}: ${step.shortDesc}${
                  expandedStep === step.number ? ' (expandido)' : ''
                }`}
              >
                {/* Círculo numerado com ícone */}
                <div
                  className={cn(
                    'relative w-14 h-14 md:w-16 md:h-16',
                    'rounded-full flex items-center justify-center',
                    'border-2 border-amber-400 dark:border-amber-500',
                    'bg-gradient-to-br from-amber-50 to-amber-100',
                    'dark:from-amber-900/30 dark:to-amber-800/20',
                    'shadow-sm transition-all duration-300',
                    'group-hover:shadow-lg group-hover:shadow-amber-200/50',
                    'dark:group-hover:shadow-amber-900/40',
                    'group-hover:scale-110 group-hover:border-amber-500',
                    'dark:group-hover:border-amber-400',
                    expandedStep === step.number &&
                      'shadow-lg shadow-amber-200/50 dark:shadow-amber-900/40 scale-110 border-amber-500 dark:border-amber-400 ring-2 ring-amber-200 dark:ring-amber-700',
                  )}
                >
                  {/* Ícone */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {getStepIcon(step.icon)}
                  </div>
                  {/* Número (some no hover) */}
                  <span
                    className={cn(
                      'font-bold text-base md:text-lg transition-opacity duration-300',
                      'text-amber-600 dark:text-amber-400',
                      'group-hover:opacity-0',
                    )}
                  >
                    {step.number}
                  </span>
                </div>

                {/* Rótulo + descrição curta */}
                <span className="mt-2 text-xs font-semibold text-slate-700 dark:text-slate-300 leading-tight">
                  {step.label}
                </span>
                <span className="mt-0.5 text-[10px] leading-tight text-slate-400 dark:text-slate-500 max-w-[100px] hidden md:block">
                  {step.shortDesc}
                </span>

                {/* Tooltip customizado (hover) */}
                <div
                  className={cn(
                    'absolute z-20 bottom-full left-1/2 -translate-x-1/2 mb-2',
                    'px-3 py-1.5 rounded-lg',
                    'bg-slate-800 dark:bg-slate-700 text-white text-xs whitespace-nowrap',
                    'shadow-lg',
                    'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
                    'pointer-events-none',
                    'hidden md:block',
                  )}
                  role="tooltip"
                >
                  {step.shortDesc}
                  <div
                    className={cn(
                      'absolute top-full left-1/2 -translate-x-1/2',
                      'w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45 -mt-1',
                    )}
                    aria-hidden="true"
                  />
                </div>
              </button>

              {/* ── Arrow Connector ──────────────────────────── */}
              {i < FLOW_STEPS.length - 1 &&
                (isMobile ? (
                  <ArrowDown index={i} isAnimated={isAnimated} />
                ) : (
                  <ArrowRight index={i} isAnimated={isAnimated} />
                ))}
            </div>
          ))}
        </div>

        {/* ── Dica de interação ────────────────────────────── */}
        {expandedStep === null && (
          <p className="mt-4 text-center text-[11px] text-slate-400 dark:text-slate-500 transition-opacity duration-300">
            Clique em cada etapa para ver detalhes
          </p>
        )}

        {/* ── Expanded Detail Card ──────────────────────────── */}
        {expandedData && (
          <div
            ref={expandedRef}
            className="flow-expand-enter mt-6 p-4 md:p-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800"
          >
            <div className="flex items-start justify-between gap-3 mb-3">
              <h4 className="font-bold text-amber-800 dark:text-amber-300 flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {expandedData.number}
                </span>
                <span className="text-sm md:text-base">
                  {expandedData.label}
                </span>
              </h4>
              <button
                onClick={() => setExpandedStep(null)}
                className={cn(
                  'flex-shrink-0 p-1 rounded-md',
                  'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300',
                  'hover:bg-slate-200/50 dark:hover:bg-slate-700/50',
                  'transition-colors',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500',
                )}
                type="button"
                aria-label="Fechar detalhes"
              >
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
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
              {expandedData.fullDesc}
            </p>

            <ul className="space-y-2">
              {expandedData.details.map((detail, j) => (
                <li
                  key={j}
                  className="flex items-start gap-2.5 text-sm text-slate-600 dark:text-slate-400"
                >
                  <svg
                    className="mt-0.5 flex-shrink-0 text-amber-500"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  <span>{detail}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </>
  )
}
