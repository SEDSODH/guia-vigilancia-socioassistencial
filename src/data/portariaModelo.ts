export interface PortariaArtigo {
  artigo: string
  paragrafos?: string[]
  incisos?: { numero: string; texto: string }[]
  caput: string
}

export const portariaModelo = {
  titulo: 'PORTARIA Nº ____/____',
  ementa:
    'Institui a Vigilância Socioassistencial no âmbito da Secretaria Municipal de Assistência Social e designa servidor(es) responsável(is) por sua coordenação.',
  preambulo: [
    'O(A) SECRETÁRIO(A) MUNICIPAL DE ASSISTÊNCIA SOCIAL DE _________________________, no uso de suas atribuições legais,',
    'CONSIDERANDO o disposto na Lei Federal nº 8.742, de 07 de dezembro de 1993 – Lei Orgânica da Assistência Social (LOAS), especialmente em seus artigos 2º, 6º e 6º-A;',
    'CONSIDERANDO a Política Nacional de Assistência Social – PNAS;',
    'CONSIDERANDO a Norma Operacional Básica do Sistema Único de Assistência Social – NOB/SUAS 2012, especialmente os artigos 87 a 94;',
    'CONSIDERANDO que a Vigilância Socioassistencial constitui função do Sistema Único de Assistência Social – SUAS, responsável pela produção, sistematização, análise e disseminação de informações territorializadas sobre vulnerabilidades, riscos sociais e oferta dos serviços socioassistenciais;',
  ],
  resolve: 'RESOLVE:',
  artigos: [
    {
      artigo: 'Art. 1º',
      caput:
        'Instituir a Vigilância Socioassistencial no âmbito da Secretaria Municipal de Assistência Social de ___________________________, vinculada diretamente à gestão municipal do Sistema Único de Assistência Social – SUAS.',
    },
    {
      artigo: 'Art. 2º',
      caput:
        'A Vigilância Socioassistencial terá como finalidade subsidiar o planejamento, monitoramento, avaliação e execução da Política Municipal de Assistência Social, por meio da gestão da informação e da produção de diagnósticos socioterritoriais.',
    },
    {
      artigo: 'Art. 3º',
      caput: 'Compete à Vigilância Socioassistencial:',
      incisos: [
        {
          numero: 'I',
          texto: 'elaborar e atualizar diagnósticos socioterritoriais do município;',
        },
        {
          numero: 'II',
          texto:
            'produzir, sistematizar e analisar informações sobre vulnerabilidades, riscos sociais e violações de direitos;',
        },
        {
          numero: 'III',
          texto:
            'apoiar o planejamento, monitoramento e avaliação dos serviços, programas, projetos e benefícios socioassistenciais;',
        },
        {
          numero: 'IV',
          texto: 'coordenar e acompanhar a alimentação dos sistemas de informação do SUAS;',
        },
        {
          numero: 'V',
          texto: 'apoiar a gestão municipal na produção de indicadores e estudos técnicos;',
        },
        {
          numero: 'VI',
          texto:
            'fornecer informações territorializadas para subsidiar ações de busca ativa e acompanhamento das famílias;',
        },
        {
          numero: 'VII',
          texto:
            'promover a disseminação de informações para as unidades da rede socioassistencial e para a gestão municipal;',
        },
        {
          numero: 'VIII',
          texto: 'exercer outras atribuições correlatas relacionadas à gestão da informação no âmbito do SUAS.',
        },
      ],
    },
    {
      artigo: 'Art. 4º',
      caput:
        'Fica designado(a) o(a) servidor(a) ___________________________________, matrícula nº ______________, para exercer a função de Coordenador(a) / Técnico(a) responsável pela Vigilância Socioassistencial do Município.',
      paragrafos: [
        '§1º  O responsável técnico poderá contar com apoio de equipe designada pela gestão municipal para execução das atividades da Vigilância Socioassistencial.',
        '§2º  As competências e responsabilidades individuais dos membros da equipe serão definidas em Plano de Trabalho específico.',
      ],
    },
    {
      artigo: 'Art. 5º',
      caput:
        'As áreas de Proteção Social Básica, Proteção Social Especial, Gestão do Cadastro Único e demais setores vinculados à Secretaria Municipal de Assistência Social deverão colaborar com a Vigilância Socioassistencial, fornecendo informações necessárias ao desenvolvimento de suas atribuições.',
    },
    {
      artigo: 'Art. 6º',
      caput:
        'A Vigilância Socioassistencial deverá elaborar Plano de Trabalho Anual contendo metas, produtos e cronograma de atividades, a ser submetido à apreciação do Conselho Municipal de Assistência Social (CMAS).',
    },
    {
      artigo: 'Art. 7º',
      caput: 'Esta Portaria entra em vigor na data de sua publicação.',
    },
  ],
  assinatura: {
    cargo: 'Secretário(a) Municipal de Assistência Social',
    municipio: 'Município de ____________________________',
    linhaData: 'Data: ___/___/______',
  },
}
