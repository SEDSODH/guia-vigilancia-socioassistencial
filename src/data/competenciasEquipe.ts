export interface CompetenciaItem {
  area: string
  descricao: string
  atividades: string[]
}

export const competenciasEquipe: CompetenciaItem[] = [
  {
    area: 'Gestão da Informação',
    descricao:
      'Capacidade de organizar, armazenar, recuperar e compartilhar dados e informações da Assistência Social.',
    atividades: [
      'Catalogar fontes de dados e sistemas de informação do SUAS',
      'Construir fluxos de alimentação e atualização de bases de dados',
      'Implementar rotinas de validação e consistência das informações',
      'Garantir a interoperabilidade entre sistemas',
    ],
  },
  {
    area: 'Elaboração de Diagnósticos',
    descricao:
      'Capacidade de sistematizar dados primários e secundários em documentos analíticos sobre a realidade social do território.',
    atividades: [
      'Levantar dados primários e secundários do município',
      'Analisar o perfil populacional, vulnerabilidades e riscos sociais',
      'Caracterizar a rede socioassistencial instalada e a cobertura dos serviços',
      'Identificar lacunas, potencialidades e prioridades territoriais',
    ],
  },
  {
    area: 'Produção de Indicadores',
    descricao:
      'Capacidade de construir, calcular e interpretar indicadores sociais e de gestão.',
    atividades: [
      'Definir indicadores quantitativos e qualitativos',
      'Calcular taxas, proporções e índices territorializados',
      'Construir séries históricas e análises comparativas',
      'Monitorar metas e resultados pactuados',
    ],
  },
  {
    area: 'Análise de Dados',
    descricao:
      'Capacidade de tratar, analisar e interpretar dados quantitativos e qualitativos para subsidiar decisões.',
    atividades: [
      'Aplicar técnicas estatísticas e análises exploratórias',
      'Cruzar bases de dados de diferentes fontes',
      'Elaborar relatórios analíticos e sínteses executivas',
      'Comunicar achados para públicos diversos (técnicos, gestores, conselheiros)',
    ],
  },
  {
    area: 'Planejamento e Monitoramento',
    descricao:
      'Capacidade de articular a Vigilância aos processos de planejamento, monitoramento e avaliação da política.',
    atividades: [
      'Subsidiar o PMAS, PPA, LDO e LOA com informações da Vigilância',
      'Acompanhar a execução de metas e indicadores pactuados',
      'Apoiar o monitoramento da rede socioassistencial',
      'Apoiar a avaliação de políticas e programas',
    ],
  },
]
