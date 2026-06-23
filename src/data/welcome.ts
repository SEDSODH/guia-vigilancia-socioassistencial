/**
 * Welcome Modal configuration and content
 * For the Vigilância Socioassistencial Guide
 */

export const WELCOME_CONFIG = {
  localStorageKey: 'guia-vigilancia-welcome-seen',
  showDelayMs: 600,
}

export const WELCOME_CONTENT = {
  title: 'Guia de Implantação da Vigilância Socioassistencial',
  subtitle: 'SUAS / RJ — COOVIG / SEDSODH',
  description:
    'Este Guia apresenta um roteiro prático, em 4 etapas, para apoiar os municípios fluminenses na implantação da Vigilância Socioassistencial de forma planejada e formalizada. Inclui modelos de Portaria e Resolução do CMAS prontos para uso, além de orientações técnicas para a estruturação da equipe, produção e disseminação de informações, apoio ao planejamento municipal e consolidação da Vigilância.',
  teamLabel: 'Equipe Responsável',
  otherCadernosLabel: 'Outros Cadernos desenvolvidos pela Vigilância Socioassistencial',
  otherCadernosEmpty: 'Outros cadernos serão publicados em breve.',
  dontShowAgainLabel: 'Não mostrar novamente nesta sessão',
  ctaLabel: 'Iniciar leitura',
}

export const WELCOME_TEAM = [
  {
    unit: 'Coordenação Estadual de Vigilância Socioassistencial (COOVIG)',
    role: 'Desenvolvimento do Guia',
    responsible: 'Junier Goulart',
    support: 'Matheus Lopes e Matheus de Freitas',
    email: 'coordvigilanciasgs@sedsdh.rj.gov.br',
  },
]

export const WELCOME_CONTACT = {
  phone: '(21) 3231-3658',
  email: 'coordvigilanciasgs@sedsdh.rj.gov.br',
  address: 'Secretaria de Estado de Desenvolvimento Social e Direitos Humanos — Rio de Janeiro/RJ',
}

export const OTHER_CADERNOS = [
  {
    href: 'https://caderno.gofsuasrj.org',
    label: 'Caderno de Execução Orçamentária e Financeira do SUAS',
    description: 'Orientações para gestão dos recursos do cofinanciamento estadual',
    accentClass: 'bg-institucional-green',
  },
  {
    href: 'https://drive.google.com/drive/mobile/folders/1hkNTcAu1do5xu_wEOcgCA-WLbIC54Eax?usp=sharing',
    label: 'Drive COOVIG',
    description: 'Materiais da COOVIG para formação e consulta',
    accentClass: 'bg-institucional-blue',
  },
]
