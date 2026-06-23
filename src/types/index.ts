import type { LucideIcon } from 'lucide-react'

export interface NavItem {
  id: string
  title: string
}

export interface NavBlock {
  id: string
  title: string
  items: NavItem[]
}

export interface Normativo {
  id: string
  title: string
  description: string
  highlight?: boolean
  accentColor?: 'blue' | 'green' | 'purple' | 'slate'
}

export interface ChecklistItem {
  id: string
  text: string
}

export interface FAQItem {
  question: string
  answer: string
}

export interface RefGroup {
  title: string
  icon: LucideIcon
  items: string[]
}

export interface Rule {
  number: number
  title: string
  description: string
  highlight?: boolean
  highlightColor?: string
}

export interface ComparisonRow {
  item: string
  status: 'pode' | 'nao' | 'condicao' | 'limite'
  condition: string
}

export interface FlowNodeData {
  label: string
  icon?: LucideIcon
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger'
}

export interface FlowEdgeData {
  label?: string
}

export interface InfoCardData {
  icon: LucideIcon
  title: string
  description: string
  accent?: 'blue' | 'green' | 'purple' | 'orange' | 'slate'
}

export interface ProcessStep {
  number: number
  title: string
  description: string
  accent?: 'blue' | 'green' | 'slate'
}

export interface BlockIntro {
  blockId: string
  title: string
  summary: string
  keyPoints: string[]
  icon: string
}

export interface PedagogicConfig {
  enabled: boolean
  showSummaries: boolean
  showKeyPoints: boolean
  showNavigationHints: boolean
  autoShowIntro: boolean
}

export interface NavigationTip {
  icon: string
  text: string
}

export interface GlossaryTerm {
  term: string
  slug: string
  definition: string
  category?: string
  example?: string
}
