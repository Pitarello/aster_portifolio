export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'activity';
  points: number;
  contentUrl?: string;
  description?: string;
  questions?: any[];
  maxRetries?: number;
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface CourseData {
  id: string;
  title: string;
  provider: string;
  area: 'tech' | 'fashion' | 'architecture';
  imageUrl: string;
  duration: string;
  rating: number;
  tags: string[];
  description: string;
  modules: Module[];
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedBy?: string; // userId
  submittedAt?: number;
  rejectionReason?: string;
}

export const coursesData: CourseData[] = [
  // ÔöÇÔöÇÔöÇ TECH ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  {
    id: 'c1',
    title: 'L├│gica de Programa├º├úo',
    provider: 'Curso em V├¡deo',
    area: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzQzMjg2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '40h',
    rating: 4.9,
    tags: ['L├│gica', 'Algoritmos', 'Iniciante'],
    description: 'Curso completo de L├│gica de Programa├º├úo para quem est├í dando os primeiros passos no mundo do desenvolvimento.',
    modules: [
      {
        id: 'm1_c1',
        title: 'M├│dulo 1: Introdu├º├úo',
        lessons: [
          {
            id: 'l1_m1_c1',
            title: 'Introdu├º├úo a Algoritmos',
            duration: '35 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/8mei6uVttho',
            description: 'Conceitos fundamentais sobre algoritmos e como pensar como um programador.'
          },
          {
            id: 'l2_m1_c1',
            title: 'Atividade: Primeiro Algoritmo',
            duration: '30 min',
            type: 'activity',
            points: 100,
            description: 'Escreva um algoritmo simples descrevendo os passos do seu dia a dia (ex: fazer um caf├®).'
          }
        ]
      },
      {
        id: 'm2_c1',
        title: 'M├│dulo 2: Estruturas de Controle',
        lessons: [
          {
            id: 'l1_m2_c1',
            title: 'Condicionais e Loops',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/JEMBMkBBmXE',
            description: 'Aprenda a usar if/else e la├ºos de repeti├º├úo para controlar o fluxo do seu programa.'
          },
          {
            id: 'l2_m2_c1',
            title: 'Atividade: Calculadora Simples',
            duration: '45 min',
            type: 'activity',
            points: 120,
            description: 'Crie a l├│gica de uma calculadora que realiza as 4 opera├º├Áes b├ísicas.'
          }
        ]
      }
    ]
  },
  {
    id: 'c3',
    title: 'Desenvolvimento Web com HTML, CSS e JavaScript',
    provider: 'Rocketseat',
    area: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1547658719-da2b51169166?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '60h',
    rating: 4.8,
    tags: ['HTML', 'CSS', 'JavaScript', 'Frontend'],
    description: 'Do zero ao primeiro site completo. Aprenda as tr├¬s tecnologias base da web e construa interfaces modernas e responsivas.',
    modules: [
      {
        id: 'm1_c3',
        title: 'M├│dulo 1: HTML Sem├óntico',
        lessons: [
          {
            id: 'l1_m1_c3',
            title: 'Estrutura de uma P├ígina Web',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/epDCjksKMok',
            description: 'Entenda como o HTML estrutura o conte├║do de uma p├ígina e as principais tags sem├ónticas.'
          },
          {
            id: 'l2_m1_c3',
            title: 'Atividade: Minha Primeira P├ígina',
            duration: '1h',
            type: 'activity',
            points: 100,
            description: 'Crie uma p├ígina HTML com cabe├ºalho, se├º├úo de conte├║do e rodap├® usando tags sem├ónticas.'
          }
        ]
      },
      {
        id: 'm2_c3',
        title: 'M├│dulo 2: CSS e Estiliza├º├úo',
        lessons: [
          {
            id: 'l1_m2_c3',
            title: 'Flexbox e Grid Layout',
            duration: '50 min',
            type: 'video',
            points: 70,
            contentUrl: 'https://www.youtube.com/embed/JJSoEo8JSnc',
            description: 'Domine os dois sistemas de layout mais usados no CSS moderno.'
          },
          {
            id: 'l2_m2_c3',
            title: 'Atividade: Layout Responsivo',
            duration: '1h 30 min',
            type: 'activity',
            points: 150,
            description: 'Recrie um layout de portf├│lio responsivo usando Flexbox e Grid.'
          }
        ]
      }
    ]
  },
  {
    id: 'c4',
    title: 'UI/UX Design: Do Conceito ao Prot├│tipo',
    provider: 'Alura',
    area: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '35h',
    rating: 4.7,
    tags: ['UI', 'UX', 'Figma', 'Design'],
    description: 'Aprenda a projetar interfaces centradas no utilizador, desde a pesquisa at├® o prot├│tipo interativo no Figma.',
    modules: [
      {
        id: 'm1_c4',
        title: 'M├│dulo 1: Fundamentos de UX',
        lessons: [
          {
            id: 'l1_m1_c4',
            title: 'O que ├® UX Design?',
            duration: '25 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/SRec90j6lTY',
            description: 'Entenda o que ├® experi├¬ncia do utilizador e por que ela ├® essencial no desenvolvimento de produtos digitais.'
          },
          {
            id: 'l2_m1_c4',
            title: 'Atividade: Mapa de Empatia',
            duration: '45 min',
            type: 'activity',
            points: 100,
            description: 'Crie um mapa de empatia para um utilizador fict├¡cio de um app de moda.'
          }
        ]
      },
      {
        id: 'm2_c4',
        title: 'M├│dulo 2: Prototipagem no Figma',
        lessons: [
          {
            id: 'l1_m2_c4',
            title: 'Introdu├º├úo ao Figma',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
            description: 'Conhe├ºa a interface do Figma e crie os seus primeiros frames e componentes.'
          },
          {
            id: 'l2_m2_c4',
            title: 'Atividade: Prot├│tipo de App',
            duration: '2h',
            type: 'activity',
            points: 200,
            description: 'Prototipe um fluxo de onboarding de 3 telas para um app de portf├│lio criativo.'
          }
        ]
      }
    ]
  },

  // ÔöÇÔöÇÔöÇ MODA (FASHION) ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  {
    id: 'c5',
    title: 'Fundamentos do Design de Moda',
    provider: 'SENAI Moda',
    area: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '45h',
    rating: 4.8,
    tags: ['Moda', 'Design', 'Croqui', 'Iniciante'],
    description: 'Explore os princ├¡pios do design de moda: hist├│ria, teoria das cores, silhuetas e cria├º├úo de croquis de moda.',
    modules: [
      {
        id: 'm1_c5',
        title: 'M├│dulo 1: Hist├│ria da Moda',
        lessons: [
          {
            id: 'l1_m1_c5',
            title: 'Da Alta Costura ao Fast Fashion',
            duration: '35 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/bCFMBBMFMSA',
            description: 'Uma viagem pela evolu├º├úo da moda desde os ateli├¬s parisienses at├® as tend├¬ncias globais de hoje.'
          },
          {
            id: 'l2_m1_c5',
            title: 'Atividade: Linha do Tempo da Moda',
            duration: '1h',
            type: 'activity',
            points: 100,
            description: 'Crie uma linha do tempo visual com os principais movimentos da moda do s├®culo XX ao XXI.'
          }
        ]
      },
      {
        id: 'm2_c5',
        title: 'M├│dulo 2: Teoria das Cores na Moda',
        lessons: [
          {
            id: 'l1_m2_c5',
            title: 'Paletas e Combina├º├Áes de Cores',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/YeI6Wqn4I78',
            description: 'Aprenda a criar paletas harmoniosas e entenda como as cores comunicam emo├º├Áes na moda.'
          },
          {
            id: 'l2_m2_c5',
            title: 'Atividade: Moodboard de Cole├º├úo',
            duration: '1h 30 min',
            type: 'activity',
            points: 150,
            description: 'Monte um moodboard digital para uma mini-cole├º├úo de 5 pe├ºas com paleta de cores definida.'
          }
        ]
      }
    ]
  },
  {
    id: 'c6',
    title: 'Modelagem e Costura para Iniciantes',
    provider: 'Escola de Moda Online',
    area: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '50h',
    rating: 4.7,
    tags: ['Modelagem', 'Costura', 'T├®cnica', 'Pr├ítico'],
    description: 'Aprenda a transformar ideias em pe├ºas reais: do tra├ºado da modelagem plana ├á costura da primeira pe├ºa.',
    modules: [
      {
        id: 'm1_c6',
        title: 'M├│dulo 1: Modelagem Plana',
        lessons: [
          {
            id: 'l1_m1_c6',
            title: 'Medidas e Tabela de Tamanhos',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/Wd0JBqZhFBY',
            description: 'Entenda como tirar medidas corretamente e como funcionam as tabelas de numera├º├úo brasileira.'
          },
          {
            id: 'l2_m1_c6',
            title: 'Atividade: Tra├ºado de Blusa B├ísica',
            duration: '2h',
            type: 'activity',
            points: 200,
            description: 'Trace a modelagem de uma blusa b├ísica feminina usando as suas pr├│prias medidas.'
          }
        ]
      },
      {
        id: 'm2_c6',
        title: 'M├│dulo 2: Introdu├º├úo ├á Costura',
        lessons: [
          {
            id: 'l1_m2_c6',
            title: 'Conhecendo a M├íquina de Costura',
            duration: '25 min',
            type: 'video',
            points: 40,
            contentUrl: 'https://www.youtube.com/embed/5Ql3RFnZ8Oc',
            description: 'Partes da m├íquina, tipos de pontos e como fazer a regulagem b├ísica para diferentes tecidos.'
          },
          {
            id: 'l2_m2_c6',
            title: 'Atividade: Primeira Costura',
            duration: '1h 30 min',
            type: 'activity',
            points: 150,
            description: 'Costure as pe├ºas da blusa b├ísica tra├ºada no m├│dulo anterior e finalize as costuras.'
          }
        ]
      }
    ]
  },
  {
    id: 'c7',
    title: 'Marketing Digital para Marcas de Moda',
    provider: 'Fashion Business School',
    area: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '25h',
    rating: 4.6,
    tags: ['Marketing', 'Instagram', 'Branding', 'Neg├│cios'],
    description: 'Estrat├®gias de marketing digital espec├¡ficas para o mercado de moda: branding, redes sociais, influencers e e-commerce.',
    modules: [
      {
        id: 'm1_c7',
        title: 'M├│dulo 1: Identidade de Marca',
        lessons: [
          {
            id: 'l1_m1_c7',
            title: 'Construindo uma Marca de Moda',
            duration: '35 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/l-S2Y3SF3jM',
            description: 'Como definir posicionamento, p├║blico-alvo e identidade visual para uma marca de moda.'
          },
          {
            id: 'l2_m1_c7',
            title: 'Atividade: Brand Book B├ísico',
            duration: '2h',
            type: 'activity',
            points: 180,
            description: 'Crie um brand book simplificado para uma marca de moda fict├¡cia com logo, paleta e tom de voz.'
          }
        ]
      }
    ]
  },

  // ÔöÇÔöÇÔöÇ ARQUITETURA ÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇÔöÇ
  {
    id: 'c2',
    title: 'Modelagem 3D para Iniciantes',
    provider: 'Tutoriais 3D',
    area: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1676238560626-45d35b63b38f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMG1vZGVsaW5nJTIwc29mdHdhcmV8ZW58MXx8fHwxNzc0MzcxMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '30h',
    rating: 4.8,
    tags: ['3D', 'Modelagem', 'Design'],
    description: 'Aprenda os fundamentos da modelagem 3D, desde a interface do software at├® a cria├º├úo dos seus primeiros objetos.',
    modules: [
      {
        id: 'm1_c2',
        title: 'M├│dulo 1: Fundamentos 3D',
        lessons: [
          {
            id: 'l1_m1_c2',
            title: 'Conhecendo a Interface',
            duration: '25 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/5TET1kdaSrU',
            description: 'Vis├úo geral da interface do software de modelagem e navega├º├úo b├ísica no espa├ºo 3D.'
          },
          {
            id: 'l2_m1_c2',
            title: 'Pr├ítica: Manipulando Formas',
            duration: '1h',
            type: 'activity',
            points: 150,
            description: 'Crie e modifique v├®rtices, arestas e faces da sua primeira malha geom├®trica.'
          }
        ]
      }
    ]
  },
  {
    id: 'c8',
    title: 'AutoCAD para Arquitetura',
    provider: 'Escola de Arquitetura Digital',
    area: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '55h',
    rating: 4.9,
    tags: ['AutoCAD', 'Plantas', 'T├®cnico', 'Projetos'],
    description: 'Domine o AutoCAD para criar plantas baixas, cortes, fachadas e detalhamentos t├®cnicos com precis├úo profissional.',
    modules: [
      {
        id: 'm1_c8',
        title: 'M├│dulo 1: Interface e Comandos B├ísicos',
        lessons: [
          {
            id: 'l1_m1_c8',
            title: 'Navegando no AutoCAD',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/Ot4qKMBmFpA',
            description: 'Conhe├ºa a interface, os pain├®is de ferramentas e os comandos essenciais para come├ºar a desenhar.'
          },
          {
            id: 'l2_m1_c8',
            title: 'Atividade: Planta Baixa Simples',
            duration: '2h',
            type: 'activity',
            points: 200,
            description: 'Desenhe a planta baixa de um apartamento studio com cotas e legenda.'
          }
        ]
      },
      {
        id: 'm2_c8',
        title: 'M├│dulo 2: Cotas, Hachuras e Impress├úo',
        lessons: [
          {
            id: 'l1_m2_c8',
            title: 'Cotagem e Anota├º├Áes T├®cnicas',
            duration: '35 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/Ot4qKMBmFpA',
            description: 'Aprenda a cotar corretamente plantas e detalhes seguindo as normas da ABNT.'
          },
          {
            id: 'l2_m2_c8',
            title: 'Atividade: Projeto Completo',
            duration: '3h',
            type: 'activity',
            points: 250,
            description: 'Finalize um projeto residencial com planta baixa, corte e fachada prontos para impress├úo.'
          }
        ]
      }
    ]
  },
  {
    id: 'c9',
    title: 'Design de Interiores: Conceito e Projeto',
    provider: 'Instituto de Design',
    area: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '40h',
    rating: 4.7,
    tags: ['Interiores', 'Decora├º├úo', 'Projeto', 'Estilo'],
    description: 'Aprenda a criar ambientes funcionais e esteticamente coerentes: do briefing do cliente ao projeto executivo.',
    modules: [
      {
        id: 'm1_c9',
        title: 'M├│dulo 1: Conceito e Briefing',
        lessons: [
          {
            id: 'l1_m1_c9',
            title: 'Como Fazer um Briefing de Interiores',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/Ot4qKMBmFpA',
            description: 'Aprenda a levantar as necessidades do cliente e transform├í-las em conceito de projeto.'
          },
          {
            id: 'l2_m1_c9',
            title: 'Atividade: Moodboard de Ambiente',
            duration: '1h 30 min',
            type: 'activity',
            points: 150,
            description: 'Crie um moodboard para uma sala de estar contempor├ónea com refer├¬ncias de materiais e mobili├írio.'
          }
        ]
      },
      {
        id: 'm2_c9',
        title: 'M├│dulo 2: Ergonomia e Circula├º├úo',
        lessons: [
          {
            id: 'l1_m2_c9',
            title: 'Dimensionamento e Ergonomia',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/Ot4qKMBmFpA',
            description: 'Entenda as medidas m├¡nimas de circula├º├úo, conforto e acessibilidade em projetos de interiores.'
          },
          {
            id: 'l2_m2_c9',
            title: 'Atividade: Layout de Ambiente',
            duration: '2h',
            type: 'activity',
            points: 180,
            description: 'Proponha o layout de uma sala de jantar para 6 pessoas respeitando as normas de ergonomia.'
          }
        ]
      }
    ]
  }
];
