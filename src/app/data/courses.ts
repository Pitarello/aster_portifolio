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
  // ─── TECH ───────────────────────────────────────────────────────────────────
  {
    id: 'c1',
    title: 'Lógica de Programação',
    provider: 'Curso em Vídeo',
    area: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1675495277087-10598bf7bcd1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBwcm9ncmFtbWluZyUyMGxhcHRvcHxlbnwxfHx8fDE3NzQzMjg2ODd8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '40h',
    rating: 4.9,
    tags: ['Lógica', 'Algoritmos', 'Iniciante'],
    description: 'Curso completo de Lógica de Programação para quem está dando os primeiros passos no mundo do desenvolvimento.',
    modules: [
      {
        id: 'm1_c1',
        title: 'Módulo 1: Introdução',
        lessons: [
          {
            id: 'l1_m1_c1',
            title: 'Introdução a Algoritmos',
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
            description: 'Escreva um algoritmo simples descrevendo os passos do seu dia a dia (ex: fazer um café).'
          }
        ]
      },
      {
        id: 'm2_c1',
        title: 'Módulo 2: Estruturas de Controle',
        lessons: [
          {
            id: 'l1_m2_c1',
            title: 'Condicionais e Loops',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/JEMBMkBBmXE',
            description: 'Aprenda a usar if/else e laços de repetição para controlar o fluxo do seu programa.'
          },
          {
            id: 'l2_m2_c1',
            title: 'Atividade: Calculadora Simples',
            duration: '45 min',
            type: 'activity',
            points: 120,
            description: 'Crie a lógica de uma calculadora que realiza as 4 operações básicas.'
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
    description: 'Do zero ao primeiro site completo. Aprenda as três tecnologias base da web e construa interfaces modernas e responsivas.',
    modules: [
      {
        id: 'm1_c3',
        title: 'Módulo 1: HTML Semântico',
        lessons: [
          {
            id: 'l1_m1_c3',
            title: 'Estrutura de uma Página Web',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/epDCjksKMok',
            description: 'Entenda como o HTML estrutura o conteúdo de uma página e as principais tags semânticas.'
          },
          {
            id: 'l2_m1_c3',
            title: 'Atividade: Minha Primeira Página',
            duration: '1h',
            type: 'activity',
            points: 100,
            description: 'Crie uma página HTML com cabeçalho, seção de conteúdo e rodapé usando tags semânticas.'
          }
        ]
      },
      {
        id: 'm2_c3',
        title: 'Módulo 2: CSS e Estilização',
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
            description: 'Recrie um layout de portfólio responsivo usando Flexbox e Grid.'
          }
        ]
      }
    ]
  },
  {
    id: 'c4',
    title: 'UI/UX Design: Do Conceito ao Protótipo',
    provider: 'Alura',
    area: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '35h',
    rating: 4.7,
    tags: ['UI', 'UX', 'Figma', 'Design'],
    description: 'Aprenda a projetar interfaces centradas no utilizador, desde a pesquisa até o protótipo interativo no Figma.',
    modules: [
      {
        id: 'm1_c4',
        title: 'Módulo 1: Fundamentos de UX',
        lessons: [
          {
            id: 'l1_m1_c4',
            title: 'O que é UX Design?',
            duration: '25 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/SRec90j6lTY',
            description: 'Entenda o que é experiência do utilizador e por que ela é essencial no desenvolvimento de produtos digitais.'
          },
          {
            id: 'l2_m1_c4',
            title: 'Atividade: Mapa de Empatia',
            duration: '45 min',
            type: 'activity',
            points: 100,
            description: 'Crie um mapa de empatia para um utilizador fictício de um app de moda.'
          }
        ]
      },
      {
        id: 'm2_c4',
        title: 'Módulo 2: Prototipagem no Figma',
        lessons: [
          {
            id: 'l1_m2_c4',
            title: 'Introdução ao Figma',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/FTFaQWZBqQ8',
            description: 'Conheça a interface do Figma e crie os seus primeiros frames e componentes.'
          },
          {
            id: 'l2_m2_c4',
            title: 'Atividade: Protótipo de App',
            duration: '2h',
            type: 'activity',
            points: 200,
            description: 'Prototipe um fluxo de onboarding de 3 telas para um app de portfólio criativo.'
          }
        ]
      }
    ]
  },

  // ─── MODA (FASHION) ──────────────────────────────────────────────────────────
  {
    id: 'c5',
    title: 'Fundamentos do Design de Moda',
    provider: 'SENAI Moda',
    area: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    duration: '45h',
    rating: 4.8,
    tags: ['Moda', 'Design', 'Croqui', 'Iniciante'],
    description: 'Explore os princípios do design de moda: história, teoria das cores, silhuetas e criação de croquis de moda.',
    modules: [
      {
        id: 'm1_c5',
        title: 'Módulo 1: História da Moda',
        lessons: [
          {
            id: 'l1_m1_c5',
            title: 'Da Alta Costura ao Fast Fashion',
            duration: '35 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/bCFMBBMFMSA',
            description: 'Uma viagem pela evolução da moda desde os ateliês parisienses até as tendências globais de hoje.'
          },
          {
            id: 'l2_m1_c5',
            title: 'Atividade: Linha do Tempo da Moda',
            duration: '1h',
            type: 'activity',
            points: 100,
            description: 'Crie uma linha do tempo visual com os principais movimentos da moda do século XX ao XXI.'
          }
        ]
      },
      {
        id: 'm2_c5',
        title: 'Módulo 2: Teoria das Cores na Moda',
        lessons: [
          {
            id: 'l1_m2_c5',
            title: 'Paletas e Combinações de Cores',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/YeI6Wqn4I78',
            description: 'Aprenda a criar paletas harmoniosas e entenda como as cores comunicam emoções na moda.'
          },
          {
            id: 'l2_m2_c5',
            title: 'Atividade: Moodboard de Coleção',
            duration: '1h 30 min',
            type: 'activity',
            points: 150,
            description: 'Monte um moodboard digital para uma mini-coleção de 5 peças com paleta de cores definida.'
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
    tags: ['Modelagem', 'Costura', 'Técnica', 'Prático'],
    description: 'Aprenda a transformar ideias em peças reais: do traçado da modelagem plana à costura da primeira peça.',
    modules: [
      {
        id: 'm1_c6',
        title: 'Módulo 1: Modelagem Plana',
        lessons: [
          {
            id: 'l1_m1_c6',
            title: 'Medidas e Tabela de Tamanhos',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/Wd0JBqZhFBY',
            description: 'Entenda como tirar medidas corretamente e como funcionam as tabelas de numeração brasileira.'
          },
          {
            id: 'l2_m1_c6',
            title: 'Atividade: Traçado de Blusa Básica',
            duration: '2h',
            type: 'activity',
            points: 200,
            description: 'Trace a modelagem de uma blusa básica feminina usando as suas próprias medidas.'
          }
        ]
      },
      {
        id: 'm2_c6',
        title: 'Módulo 2: Introdução à Costura',
        lessons: [
          {
            id: 'l1_m2_c6',
            title: 'Conhecendo a Máquina de Costura',
            duration: '25 min',
            type: 'video',
            points: 40,
            contentUrl: 'https://www.youtube.com/embed/5Ql3RFnZ8Oc',
            description: 'Partes da máquina, tipos de pontos e como fazer a regulagem básica para diferentes tecidos.'
          },
          {
            id: 'l2_m2_c6',
            title: 'Atividade: Primeira Costura',
            duration: '1h 30 min',
            type: 'activity',
            points: 150,
            description: 'Costure as peças da blusa básica traçada no módulo anterior e finalize as costuras.'
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
    tags: ['Marketing', 'Instagram', 'Branding', 'Negócios'],
    description: 'Estratégias de marketing digital específicas para o mercado de moda: branding, redes sociais, influencers e e-commerce.',
    modules: [
      {
        id: 'm1_c7',
        title: 'Módulo 1: Identidade de Marca',
        lessons: [
          {
            id: 'l1_m1_c7',
            title: 'Construindo uma Marca de Moda',
            duration: '35 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/l-S2Y3SF3jM',
            description: 'Como definir posicionamento, público-alvo e identidade visual para uma marca de moda.'
          },
          {
            id: 'l2_m1_c7',
            title: 'Atividade: Brand Book Básico',
            duration: '2h',
            type: 'activity',
            points: 180,
            description: 'Crie um brand book simplificado para uma marca de moda fictícia com logo, paleta e tom de voz.'
          }
        ]
      }
    ]
  },

  // ─── ARQUITETURA ─────────────────────────────────────────────────────────────
  {
    id: 'c2',
    title: 'Modelagem 3D para Iniciantes',
    provider: 'Tutoriais 3D',
    area: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1676238560626-45d35b63b38f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHwzZCUyMG1vZGVsaW5nJTIwc29mdHdhcmV8ZW58MXx8fHwxNzc0MzcxMzM4fDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '30h',
    rating: 4.8,
    tags: ['3D', 'Modelagem', 'Design'],
    description: 'Aprenda os fundamentos da modelagem 3D, desde a interface do software até a criação dos seus primeiros objetos.',
    modules: [
      {
        id: 'm1_c2',
        title: 'Módulo 1: Fundamentos 3D',
        lessons: [
          {
            id: 'l1_m1_c2',
            title: 'Conhecendo a Interface',
            duration: '25 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/5TET1kdaSrU',
            description: 'Visão geral da interface do software de modelagem e navegação básica no espaço 3D.'
          },
          {
            id: 'l2_m1_c2',
            title: 'Prática: Manipulando Formas',
            duration: '1h',
            type: 'activity',
            points: 150,
            description: 'Crie e modifique vértices, arestas e faces da sua primeira malha geométrica.'
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
    tags: ['AutoCAD', 'Plantas', 'Técnico', 'Projetos'],
    description: 'Domine o AutoCAD para criar plantas baixas, cortes, fachadas e detalhamentos técnicos com precisão profissional.',
    modules: [
      {
        id: 'm1_c8',
        title: 'Módulo 1: Interface e Comandos Básicos',
        lessons: [
          {
            id: 'l1_m1_c8',
            title: 'Navegando no AutoCAD',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/Ot4qKMBmFpA',
            description: 'Conheça a interface, os painéis de ferramentas e os comandos essenciais para começar a desenhar.'
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
        title: 'Módulo 2: Cotas, Hachuras e Impressão',
        lessons: [
          {
            id: 'l1_m2_c8',
            title: 'Cotagem e Anotações Técnicas',
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
            description: 'Finalize um projeto residencial com planta baixa, corte e fachada prontos para impressão.'
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
    tags: ['Interiores', 'Decoração', 'Projeto', 'Estilo'],
    description: 'Aprenda a criar ambientes funcionais e esteticamente coerentes: do briefing do cliente ao projeto executivo.',
    modules: [
      {
        id: 'm1_c9',
        title: 'Módulo 1: Conceito e Briefing',
        lessons: [
          {
            id: 'l1_m1_c9',
            title: 'Como Fazer um Briefing de Interiores',
            duration: '30 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/Ot4qKMBmFpA',
            description: 'Aprenda a levantar as necessidades do cliente e transformá-las em conceito de projeto.'
          },
          {
            id: 'l2_m1_c9',
            title: 'Atividade: Moodboard de Ambiente',
            duration: '1h 30 min',
            type: 'activity',
            points: 150,
            description: 'Crie um moodboard para uma sala de estar contemporânea com referências de materiais e mobiliário.'
          }
        ]
      },
      {
        id: 'm2_c9',
        title: 'Módulo 2: Ergonomia e Circulação',
        lessons: [
          {
            id: 'l1_m2_c9',
            title: 'Dimensionamento e Ergonomia',
            duration: '40 min',
            type: 'video',
            points: 60,
            contentUrl: 'https://www.youtube.com/embed/Ot4qKMBmFpA',
            description: 'Entenda as medidas mínimas de circulação, conforto e acessibilidade em projetos de interiores.'
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
