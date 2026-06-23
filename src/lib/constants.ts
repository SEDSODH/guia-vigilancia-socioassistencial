export const INSTITUTIONAL_COLORS = {
  blue: '#004b87',
  lightBlue: '#e6f0fa',
  green: '#009b3a',
  lightGreen: '#e6f5ea',
  dark: '#1e293b',
  gray: '#f8fafc',
}

export const LIMITS = {
  // Limites específicos da Vigilância Socioassistencial
}

export const BLOCK_ACCENTS = {
  gestao: { border: 'border-block-gestao', light: 'bg-block-gestao-light', color: 'text-block-gestao-text', hex: '#004b87', label: 'azul', badgeBg: 'bg-block-gestao-light', badgeText: 'text-block-gestao-text', badgeBorder: 'border-block-gestao/30', lineGradient: 'from-institucional-blue to-blue-300', iconBg: 'bg-institucional-blue', iconBgDark: 'dark:bg-blue-800' },
  planejamento: { border: 'border-block-planejamento', light: 'bg-block-planejamento-light', color: 'text-block-planejamento-text', hex: '#009b3a', label: 'verde', badgeBg: 'bg-block-planejamento-light', badgeText: 'text-block-planejamento-text', badgeBorder: 'border-block-planejamento/30', lineGradient: 'from-institucional-green to-green-300', iconBg: 'bg-institucional-green', iconBgDark: 'dark:bg-green-800' },
  reprogramacao: { border: 'border-block-reprogramacao', light: 'bg-block-reprogramacao-light', color: 'text-block-reprogramacao-text', hex: '#0891b2', label: 'ciano', badgeBg: 'bg-block-reprogramacao-light', badgeText: 'text-block-reprogramacao-text', badgeBorder: 'border-block-reprogramacao/30', lineGradient: 'from-cyan-500 to-cyan-300', iconBg: 'bg-cyan-500', iconBgDark: 'dark:bg-cyan-700' },
  controle: { border: 'border-block-controle', light: 'bg-block-controle-light', color: 'text-block-controle-text', hex: '#be185d', label: 'rosa', badgeBg: 'bg-block-controle-light', badgeText: 'text-block-controle-text', badgeBorder: 'border-block-controle/30', lineGradient: 'from-pink-500 to-pink-300', iconBg: 'bg-pink-500', iconBgDark: 'dark:bg-pink-700' },
}

export const BLOCKS = [
  {
    id: 'fundamentacao',
    title: 'Bloco 1 - Fundamentação',
    accent: 'gestao',
    items: [
      { id: 'base-normativa', title: 'Base Normativa' },
      { id: 'vigilancia-suas', title: 'A Vigilância no SUAS' },
    ],
  },
  {
    id: 'institucionalizacao',
    title: 'Bloco 2 - Institucionalização',
    accent: 'planejamento',
    items: [
      { id: 'formalizacao', title: 'Formalização' },
      { id: 'modelo-portaria', title: 'Modelo de Portaria' },
      { id: 'resolucao-cmas', title: 'Resolução do CMAS' },
      { id: 'estrutura-equipe', title: 'Estruturação da Equipe' },
    ],
  },

  {
    id: 'disseminacao-planejamento',
    title: 'Bloco 3 - Disseminação e Planejamento',
    accent: 'reprogramacao',
    items: [
      { id: 'disseminacao-informacao', title: 'Produção e Disseminação' },
      { id: 'apoio-planejamento', title: 'Apoio ao Planejamento' },
    ],
  },
  {
    id: 'consolidacao',
    title: 'Bloco 4 - Consolidação',
    accent: 'controle',
    items: [
      { id: 'consolidacao', title: 'Consolidação da Vigilância' },
    ],
  },
]

export const INTRO_SECTIONS = [
  { id: 'capa', title: 'Capa' },
  { id: 'expediente', title: 'Expediente' },
  { id: 'sumario', title: 'Sumário' },
  { id: 'apresentacao', title: 'Apresentação' },
]

export const FINAL_SECTIONS = [
  { id: 'consideracoes', title: 'Considerações Finais' },
  { id: 'referencias', title: 'Referências' },
  { id: 'faq', title: 'Perguntas Frequentes' },
  { id: 'regras-ouro', title: '10 Regras de Ouro' },
  { id: 'contra-capa', title: 'Contra-Capa' },
]
