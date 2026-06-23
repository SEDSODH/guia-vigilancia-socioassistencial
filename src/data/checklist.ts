export interface ChecklistItem {
  id: string
  text: string
  descricao?: string
}

export interface ChecklistEtapa {
  etapa: number
  titulo: string
  objetivo: string
  items: ChecklistItem[]
  produtos: string[]
}

export const checklistEtapas: ChecklistEtapa[] = [
  {
    etapa: 1,
    titulo: 'Formalização da Vigilância Socioassistencial',
    objetivo:
      'Instituir formalmente a Vigilância Socioassistencial na estrutura organizacional da Secretaria Municipal de Assistência Social.',
    items: [
      { id: 'f1-1', text: 'Inserir a Vigilância Socioassistencial no organograma da Secretaria' },
      { id: 'f1-2', text: 'Instituir coordenação, núcleo ou setor específico' },
      { id: 'f1-3', text: 'Publicar Portaria designando responsável técnico' },
      { id: 'f1-4', text: 'Definir competências e atribuições da área' },
      { id: 'f1-5', text: 'Submeter Resolução do CMAS reconhecendo a institucionalização' },
    ],
    produtos: [
      'Área formalmente instituída',
      'Responsável técnico designado',
      'Competências definidas',
      'Resolução do CMAS aprovada',
    ],
  },
  {
    etapa: 2,
    titulo: 'Estruturação da Equipe',
    objetivo: 'Garantir capacidade técnica para execução das atividades da Vigilância.',
    items: [
      { id: 'f2-1', text: 'Identificar profissionais disponíveis' },
      { id: 'f2-2', text: 'Designar equipe de referência' },
      { id: 'f2-3', text: 'Definir responsabilidades individuais' },
      { id: 'f2-4', text: 'Promover capacitações sobre Vigilância Socioassistencial' },
      { id: 'f2-5', text: 'Elaborar Plano de Trabalho Anual' },
    ],
    produtos: ['Equipe constituída', 'Plano de trabalho definido'],
  },
  {
    etapa: 3,
    titulo: 'Mapeamento das Fontes de Informação',
    objetivo: 'Identificar e organizar todas as fontes de dados utilizadas pelo SUAS municipal.',
    items: [
      { id: 'f3-1', text: 'Levantar sistemas federais (CadSUAS, Censo SUAS, RMA, CadÚnico, CECAD, SUASWeb)' },
      { id: 'f3-2', text: 'Identificar bancos de dados municipais' },
      { id: 'f3-3', text: 'Mapear instrumentos de registro dos serviços (Prontuário SUAS)' },
      { id: 'f3-4', text: 'Identificar informações produzidas por outras políticas públicas' },
      { id: 'f3-5', text: 'Construir inventário de fontes com fluxos de atualização' },
    ],
    produtos: ['Inventário de fontes de dados', 'Fluxo de atualização das informações'],
  },
  {
    etapa: 4,
    titulo: 'Organização e Padronização dos Registros',
    objetivo: 'Garantir qualidade, padronização e confiabilidade das informações produzidas no SUAS.',
    items: [
      { id: 'f4-1', text: 'Revisar instrumentos de registro das unidades' },
      { id: 'f4-2', text: 'Padronizar conceitos e nomenclaturas' },
      { id: 'f4-3', text: 'Definir fluxos de alimentação dos sistemas' },
      { id: 'f4-4', text: 'Capacitar equipes dos serviços' },
      { id: 'f4-5', text: 'Implantar rotina de validação das informações' },
    ],
    produtos: [
      'Fluxo de gestão da informação institucionalizado',
      'Redução de inconsistências nos registros',
    ],
  },
  {
    etapa: 5,
    titulo: 'Gestão dos Sistemas de Informação',
    objetivo: 'Qualificar a alimentação e utilização dos sistemas oficiais do SUAS.',
    items: [
      { id: 'f5-1', text: 'Coordenar o preenchimento do CadSUAS' },
      { id: 'f5-2', text: 'Coordenar a aplicação do Censo SUAS' },
      { id: 'f5-3', text: 'Monitorar a alimentação do RMA' },
      { id: 'f5-4', text: 'Acompanhar sistemas locais' },
      { id: 'f5-5', text: 'Validar informações enviadas ao MDS' },
    ],
    produtos: ['Sistemas atualizados', 'Melhoria da qualidade das informações'],
  },
  {
    etapa: 6,
    titulo: 'Elaboração do Diagnóstico Socioterritorial',
    objetivo: 'Produzir conhecimento sobre a realidade social do município e seus territórios.',
    items: [
      { id: 'f6-1', text: 'Levantar dados demográficos e socioeconômicos (IBGE, CadÚnico, CECAD)' },
      { id: 'f6-2', text: 'Analisar perfil populacional por território' },
      { id: 'f6-3', text: 'Mapear vulnerabilidades e riscos sociais' },
      { id: 'f6-4', text: 'Caracterizar a rede socioassistencial instalada' },
      { id: 'f6-5', text: 'Estimar a demanda potencial' },
      { id: 'f6-6', text: 'Identificar potencialidades territoriais' },
      { id: 'f6-7', text: 'Realizar análise de lacunas de atendimento' },
      { id: 'f6-8', text: 'Elaborar Diagnósticos dos territórios de CRAS e CREAS' },
    ],
    produtos: [
      'Diagnóstico Socioterritorial Municipal',
      'Diagnósticos dos territórios de CRAS e CREAS',
    ],
  },
  {
    etapa: 7,
    titulo: 'Produção de Mapas de Vulnerabilidade',
    objetivo: 'Territorializar as informações e apoiar a tomada de decisão.',
    items: [
      { id: 'f7-1', text: 'Identificar concentração de vulnerabilidades' },
      { id: 'f7-2', text: 'Mapear públicos prioritários' },
      { id: 'f7-3', text: 'Identificar vazios de cobertura' },
      { id: 'f7-4', text: 'Relacionar demanda e oferta' },
      { id: 'f7-5', text: 'Construir painéis territoriais' },
    ],
    produtos: ['Mapas temáticos', 'Painéis territoriais', 'Priorização de territórios'],
  },
  {
    etapa: 8,
    titulo: 'Organização da Busca Ativa',
    objetivo: 'Transformar informações em ações de proteção social.',
    items: [
      { id: 'f8-1', text: 'Identificar famílias prioritárias a partir do CadÚnico e Prontuários' },
      { id: 'f8-2', text: 'Produzir listagens territorializadas' },
      { id: 'f8-3', text: 'Apoiar CRAS e CREAS na execução da Busca Ativa' },
      { id: 'f8-4', text: 'Monitorar encaminhamentos e acompanhamentos' },
      { id: 'f8-5', text: 'Elaborar Plano de Busca Ativa' },
    ],
    produtos: ['Plano de Busca Ativa', 'Ampliação do acesso aos serviços'],
  },
  {
    etapa: 9,
    titulo: 'Monitoramento da Rede Socioassistencial',
    objetivo: 'Avaliar a adequação da oferta às necessidades da população.',
    items: [
      { id: 'f9-1', text: 'Monitorar cobertura dos serviços' },
      { id: 'f9-2', text: 'Monitorar capacidade instalada' },
      { id: 'f9-3', text: 'Monitorar recursos humanos' },
      { id: 'f9-4', text: 'Monitorar infraestrutura' },
      { id: 'f9-5', text: 'Monitorar perfil dos usuários' },
      { id: 'f9-6', text: 'Monitorar qualidade dos atendimentos' },
      { id: 'f9-7', text: 'Produzir relatórios de monitoramento periódicos' },
    ],
    produtos: [
      'Relatórios de monitoramento',
      'Identificação de necessidades de expansão ou reorganização da rede',
    ],
  },
  {
    etapa: 10,
    titulo: 'Produção e Disseminação de Informações',
    objetivo: 'Subsidiar a gestão municipal com informações qualificadas.',
    items: [
      { id: 'f10-1', text: 'Produzir boletins informativos' },
      { id: 'f10-2', text: 'Elaborar relatórios gerenciais' },
      { id: 'f10-3', text: 'Construir painéis de indicadores' },
      { id: 'f10-4', text: 'Produzir informes territoriais' },
      { id: 'f10-5', text: 'Preparar apresentações para gestores e conselhos' },
    ],
    produtos: [
      'Boletins mensais',
      'Relatórios trimestrais',
      'Relatórios semestrais',
      'Relatórios anuais',
    ],
  },
  {
    etapa: 11,
    titulo: 'Apoio ao Planejamento Municipal',
    objetivo: 'Incorporar as evidências produzidas pela Vigilância aos processos decisórios.',
    items: [
      { id: 'f11-1', text: 'Subsidiar o Plano Municipal de Assistência Social' },
      { id: 'f11-2', text: 'Apoiar a elaboração do Plano Plurianual (PPA)' },
      { id: 'f11-3', text: 'Apoiar pactuações e deliberações' },
      { id: 'f11-4', text: 'Subsidiar a expansão da rede socioassistencial' },
    ],
    produtos: ['Planejamento fundamentado em evidências', 'Melhor adequação entre demanda e oferta'],
  },
  {
    etapa: 12,
    titulo: 'Consolidação da Vigilância Socioassistencial',
    objetivo:
      'Institucionalizar a Vigilância como função permanente da gestão do SUAS.',
    items: [
      { id: 'f12-1', text: 'Avaliar periodicamente a implementação' },
      { id: 'f12-2', text: 'Coletar evidências de que a Vigilância orienta decisões' },
      { id: 'f12-3', text: 'Documentar boas práticas e lições aprendidas' },
      { id: 'f12-4', text: 'Sistematizar melhorias incrementais' },
      { id: 'f12-5', text: 'Apresentar resultados ao CMAS e à sociedade' },
    ],
    produtos: [
      'Vigilância institucionalizada como função permanente do SUAS municipal',
    ],
  },
]
