import type { RefGroup } from '@/types'
import {
  BookOpen,
  Scale,
  Building2,
  FileText,
} from 'lucide-react'

export const referenciasGroups: RefGroup[] = [
  {
    title: 'Normativos Federais',
    icon: Scale,
    items: [
      'BRASIL. Constituição da República Federativa do Brasil de 1988, art. 203 e 204.',
      'BRASIL. Lei nº 8.742, de 7 de dezembro de 1993 (Lei Orgânica da Assistência Social – LOAS). Dispõe sobre a organização da Assistência Social e dá outras providências.',
      'BRASIL. Lei nº 12.435, de 6 de julho de 2011. Altera a LOAS para dispor sobre o SUAS.',
      'BRASIL. Decreto nº 6.214, de 26 de setembro de 2007. Regulamenta o Benefício de Prestação Continuada (BPC).',
      'BRASIL. Decreto nº 7.788, de 15 de agosto de 2012. Regulamenta o Fundo Nacional de Assistência Social.',
    ],
  },
  {
    title: 'Política Nacional e Normas Operacionais',
    icon: BookOpen,
    items: [
      'CONSELHO NACIONAL DE ASSISTÊNCIA SOCIAL. Política Nacional de Assistência Social – PNAS/2004. Brasília: MDS, 2004.',
      'CONSELHO NACIONAL DE ASSISTÊNCIA SOCIAL. Norma Operacional Básica do SUAS – NOB/SUAS 2012. Brasília: CNAS, 2012.',
      'CONSELHO NACIONAL DE ASSISTÊNCIA SOCIAL. Resolução CNAS nº 145, de 15 de outubro de 2004. Aprova a PNAS.',
      'CONSELHO NACIONAL DE ASSISTÊNCIA SOCIAL. Resolução CNAS nº 33, de 12 de dezembro de 2012. Aprova a NOB/SUAS 2012.',
      'BRASIL. Ministério do Desenvolvimento Social. Tipificação Nacional dos Serviços Socioassistenciais. Brasília: MDS, 2009 (republicada em 2014).',
    ],
  },
  {
    title: 'Normativos Estaduais (Rio de Janeiro)',
    icon: Building2,
    items: [
      'RIO DE JANEIRO (Estado). Constituição do Estado do Rio de Janeiro, art. 75, incisos IV e VI.',
      'RIO DE JANEIRO (Estado). Lei nº 7.966, de 14 de junho de 2018. Dispõe sobre o cofinanciamento estadual da Política de Assistência Social no Estado do Rio de Janeiro.',
      'RIO DE JANEIRO (Estado). Secretaria de Estado de Desenvolvimento Social e Direitos Humanos. Resolução SEDSODH nº 424/2012 e atualizações posteriores.',
      'RIO DE JANEIRO (Estado). COOVIG. Orientações Técnicas para a Implantação da Vigilância Socioassistencial nos Municípios Fluminenses.',
    ],
  },
  {
    title: 'Documentos Técnicos e Orientações',
    icon: FileText,
    items: [
      'BRASIL. Ministério do Desenvolvimento Social. Manual de Orientações Técnicas para a Vigilância Socioassistencial. Brasília: MDS, 2013.',
      'BRASIL. Ministério do Desenvolvimento Social. Caderno de Orientações Técnicas para o Cadastro Único. Brasília: MDS, várias edições.',
      'BRASIL. Ministério do Desenvolvimento Social. Guia de Referência para a Elaboração do Plano Municipal de Assistência Social. Brasília: MDS.',
      'CONGEMAS. Coletânea de Artigos sobre Vigilância Socioassistencial. Brasília: CONGEMAS, 2017.',
    ],
  },
]
