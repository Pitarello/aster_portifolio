import { coursesData } from './courses';

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
}

export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  type: 'module' | 'lesson' | 'book' | 'article' | 'file' | 'test';
  moduleId?: string;
  courseId?: string;
  lessonId?: string;
  url?: string;
  fileName?: string;
  author?: string;
  points?: number;
  questions?: TestQuestion[];
  maxRetries?: number;
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  area: 'tech' | 'fashion' | 'architecture';
  level: string;
  steps: RoadmapStep[];
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
  submittedBy?: string;
  submittedAt?: number;
  rejectionReason?: string;
}

export const roadmapsData: Roadmap[] = [
  // ─── TECH ────────────────────────────────────────────────────────────────────
  {
    id: 'r1',
    title: 'Iniciando na Programação',
    description: 'A trilha perfeita para quem nunca escreveu uma linha de código e quer entender a lógica de programação.',
    area: 'tech',
    level: 'Iniciante',
    steps: [
      {
        id: 'rs_1_1',
        title: 'Lógica de Programação — Módulo Introdutório',
        description: 'Primeiro passo para entender como os computadores pensam e resolvem problemas.',
        type: 'module',
        courseId: 'c1',
        moduleId: 'm1_c1',
      },
      {
        id: 'rs_1_2',
        title: 'Estruturas de Controle na Prática',
        description: 'Condicionais e loops são a base de qualquer programa.',
        type: 'module',
        courseId: 'c1',
        moduleId: 'm2_c1',
      },
      {
        id: 'rs_1_3',
        title: 'Como Pensar Como um Programador',
        description: 'Leitura complementar sobre a importância da lógica antes de aprender sua primeira linguagem.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/L%C3%B3gica_de_programa%C3%A7%C3%A3o',
        points: 50,
      },
      {
        id: 'rs_1_4',
        title: 'Teste: Fundamentos de Lógica',
        description: 'Valide o que aprendeu sobre algoritmos e estruturas de controle.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r1', question: 'O que é um algoritmo?', options: ['Um tipo de linguagem de programação', 'Uma sequência finita de passos para resolver um problema', 'Um software de edição de código', 'Um erro de programação'], correctOptionIndex: 1 },
          { id: 'q2_r1', question: 'Qual estrutura repete um bloco enquanto uma condição for verdadeira?', options: ['if/else', 'switch', 'while', 'function'], correctOptionIndex: 2 },
          { id: 'q3_r1', question: 'O que significa "depurar" um código?', options: ['Escrever comentários', 'Encontrar e corrigir erros', 'Compilar o programa', 'Apagar código desnecessário'], correctOptionIndex: 1 }
        ]
      }
    ]
  },
  {
    id: 'r3',
    title: 'Desenvolvedor Frontend',
    description: 'Torne-se um desenvolvedor frontend completo: HTML semântico, CSS moderno e JavaScript interativo.',
    area: 'tech',
    level: 'Intermediário',
    steps: [
      {
        id: 'rs_3_1',
        title: 'HTML Semântico — Estrutura da Web',
        description: 'Aprenda a estruturar páginas web com HTML semântico e acessível.',
        type: 'module',
        courseId: 'c3',
        moduleId: 'm1_c3',
      },
      {
        id: 'rs_3_2',
        title: 'CSS Moderno: Flexbox e Grid',
        description: 'Domine os layouts modernos e crie interfaces responsivas.',
        type: 'module',
        courseId: 'c3',
        moduleId: 'm2_c3',
      },
      {
        id: 'rs_3_3',
        title: 'Guia de Acessibilidade Web (WCAG)',
        description: 'Diretrizes de acessibilidade para criar produtos digitais inclusivos.',
        type: 'article',
        url: 'https://www.w3.org/WAI/standards-guidelines/wcag/',
        points: 60,
      },
      {
        id: 'rs_3_4',
        title: 'Teste: HTML e CSS',
        description: 'Teste seus conhecimentos sobre estrutura e estilização web.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r3', question: 'Qual tag HTML cria um link?', options: ['<link>', '<a>', '<href>', '<nav>'], correctOptionIndex: 1 },
          { id: 'q2_r3', question: 'Qual propriedade CSS centraliza com Flexbox?', options: ['align-items: center', 'text-align: center', 'justify-content: center', 'margin: auto'], correctOptionIndex: 2 },
          { id: 'q3_r3', question: 'O que significa "responsivo" em design web?', options: ['O site carrega rapidamente', 'O layout se adapta a diferentes tamanhos de ecrã', 'O site tem animações', 'O site usa JavaScript'], correctOptionIndex: 1 }
        ]
      }
    ]
  },
  {
    id: 'r4',
    title: 'Designer de Produto Digital',
    description: 'Aprenda a projetar produtos digitais centrados no utilizador, do wireframe ao protótipo navegável.',
    area: 'tech',
    level: 'Intermediário',
    steps: [
      {
        id: 'rs_4_1',
        title: 'Fundamentos de UX Design',
        description: 'Entenda o que é experiência do utilizador e como aplicar os princípios de UX.',
        type: 'module',
        courseId: 'c4',
        moduleId: 'm1_c4',
      },
      {
        id: 'rs_4_2',
        title: 'Prototipagem no Figma',
        description: 'Crie protótipos interativos e apresente suas ideias de forma profissional.',
        type: 'module',
        courseId: 'c4',
        moduleId: 'm2_c4',
      },
      {
        id: 'rs_4_3',
        title: 'Princípios de Design Visual',
        description: 'Hierarquia, contraste, espaçamento e tipografia — os pilares do bom design.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/Design_de_intera%C3%A7%C3%A3o',
        points: 50,
      },
      {
        id: 'rs_4_4',
        title: 'Teste: UX e Prototipagem',
        description: 'Valide seus conhecimentos sobre design de produto digital.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r4', question: 'O que é um wireframe?', options: ['Um protótipo com cores finais', 'Um esboço estrutural de baixa fidelidade', 'Um arquivo de exportação do Figma', 'Um tipo de animação'], correctOptionIndex: 1 },
          { id: 'q2_r4', question: 'O que significa "UX"?', options: ['User Experience', 'User Extension', 'Unique Experience', 'Universal Exchange'], correctOptionIndex: 0 }
        ]
      }
    ]
  },
  // ─── MODA (FASHION) ──────────────────────────────────────────────────────────
  {
    id: 'r5',
    title: 'Criador de Moda: Do Zero à Coleção',
    description: 'Trilha completa para quem quer criar a sua primeira coleção: conceito, design e apresentação.',
    area: 'fashion',
    level: 'Iniciante',
    steps: [
      {
        id: 'rs_5_1',
        title: 'História e Fundamentos da Moda',
        description: 'Entenda a evolução da moda e os movimentos que moldaram o mercado atual.',
        type: 'module',
        courseId: 'c5',
        moduleId: 'm1_c5',
      },
      {
        id: 'rs_5_2',
        title: 'Teoria das Cores Aplicada à Moda',
        description: 'Aprenda a criar paletas harmoniosas e a usar as cores como ferramenta de expressão.',
        type: 'module',
        courseId: 'c5',
        moduleId: 'm2_c5',
      },
      {
        id: 'rs_5_3',
        title: 'Tendências de Moda: Como Ler o Mercado',
        description: 'Entenda como surgem as tendências e como aplicá-las no seu trabalho criativo.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/Moda',
        points: 50,
      },
      {
        id: 'rs_5_4',
        title: 'Teste: Fundamentos de Moda',
        description: 'Teste seus conhecimentos sobre história, cores e tendências.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r5', question: 'O que é "fast fashion"?', options: ['Moda de alta costura produzida rapidamente', 'Modelo de produção rápida e barata baseada em tendências', 'Roupas esportivas de alta performance', 'Moda sustentável e reciclada'], correctOptionIndex: 1 },
          { id: 'q2_r5', question: 'Quais são as cores primárias no modelo pigmento?', options: ['Vermelho, verde e azul', 'Ciano, magenta e amarelo', 'Vermelho, amarelo e azul', 'Laranja, verde e roxo'], correctOptionIndex: 2 }
        ]
      }
    ]
  },
  {
    id: 'r6',
    title: 'Técnico em Modelagem e Costura',
    description: 'Desenvolva habilidades técnicas para transformar ideias em peças reais com qualidade profissional.',
    area: 'fashion',
    level: 'Intermediário',
    steps: [
      {
        id: 'rs_6_1',
        title: 'Modelagem Plana: Medidas e Traçado',
        description: 'Aprenda a tirar medidas e traçar moldes com precisão.',
        type: 'module',
        courseId: 'c6',
        moduleId: 'm1_c6',
      },
      {
        id: 'rs_6_2',
        title: 'Costura: Da Máquina à Peça Finalizada',
        description: 'Domine a máquina de costura e finalize suas primeiras peças.',
        type: 'module',
        courseId: 'c6',
        moduleId: 'm2_c6',
      },
      {
        id: 'rs_6_3',
        title: 'Tipos de Tecidos e suas Aplicações',
        description: 'Conheça as propriedades dos principais tecidos e como escolher o certo para cada peça.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/Tecido_(t%C3%AAxtil)',
        points: 60,
      },
      {
        id: 'rs_6_4',
        title: 'Teste: Modelagem e Costura',
        description: 'Valide seus conhecimentos técnicos de modelagem e costura.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r6', question: 'O que é "margem de costura"?', options: ['A diferença entre molde e tamanho final', 'O espaço extra de tecido além da linha de costura', 'O tipo de ponto usado', 'A medida da bainha'], correctOptionIndex: 1 },
          { id: 'q2_r6', question: 'Qual tecido é mais indicado para peças de verão?', options: ['Lã', 'Veludo', 'Linho', 'Couro ecológico'], correctOptionIndex: 2 }
        ]
      }
    ]
  },
  {
    id: 'r7',
    title: 'Empreendedor de Moda',
    description: 'Transforme sua paixão por moda em negócio: branding, marketing digital e estratégias de venda.',
    area: 'fashion',
    level: 'Avançado',
    steps: [
      {
        id: 'rs_7_1',
        title: 'Identidade de Marca na Moda',
        description: 'Construa uma marca de moda com posicionamento claro e identidade visual forte.',
        type: 'module',
        courseId: 'c7',
        moduleId: 'm1_c7',
      },
      {
        id: 'rs_7_2',
        title: 'Sustentabilidade na Moda',
        description: 'Entenda o impacto ambiental da indústria têxtil e como criar um negócio mais consciente.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/Moda_sustent%C3%A1vel',
        points: 70,
      },
      {
        id: 'rs_7_3',
        title: 'Teste: Negócios de Moda',
        description: 'Teste seus conhecimentos sobre branding e marketing para moda.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r7', question: 'O que é "branding"?', options: ['A criação do logotipo', 'O conjunto de estratégias para construir e gerir a identidade de uma marca', 'A estratégia de preços', 'O processo de produção de roupas'], correctOptionIndex: 1 }
        ]
      }
    ]
  },
  // ─── ARQUITETURA ─────────────────────────────────────────────────────────────
  {
    id: 'r2',
    title: 'Mestre da Modelagem 3D',
    description: 'Deixe o mundo 2D para trás e comece a criar volumes, formas e cenas impressionantes em três dimensões.',
    area: 'architecture',
    level: 'Iniciante',
    steps: [
      {
        id: 'rs_2_1',
        title: 'Primeiros Passos no 3D',
        description: 'Aprenda a interface, as ferramentas e os primeiros atalhos do software de modelagem.',
        type: 'module',
        courseId: 'c2',
        moduleId: 'm1_c2',
      },
      {
        id: 'rs_2_2',
        title: 'Composição de Formas Básicas',
        description: 'Entenda como esferas, cubos e cilindros compõem praticamente tudo ao nosso redor.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/Computa%C3%A7%C3%A3o_gr%C3%A1fica_3D',
        points: 50,
      }
    ]
  },
  {
    id: 'r8',
    title: 'Desenhista Técnico com AutoCAD',
    description: 'Aprenda a produzir documentação técnica de projetos arquitetônicos com precisão e eficiência.',
    area: 'architecture',
    level: 'Intermediário',
    steps: [
      {
        id: 'rs_8_1',
        title: 'AutoCAD: Interface e Comandos Essenciais',
        description: 'Domine os comandos básicos e comece a desenhar plantas técnicas.',
        type: 'module',
        courseId: 'c8',
        moduleId: 'm1_c8',
      },
      {
        id: 'rs_8_2',
        title: 'Cotas, Hachuras e Impressão Técnica',
        description: 'Finalize projetos com cotagem correta e prepare para impressão.',
        type: 'module',
        courseId: 'c8',
        moduleId: 'm2_c8',
      },
      {
        id: 'rs_8_3',
        title: 'Normas ABNT para Projetos Arquitetônicos',
        description: 'Conheça as principais normas técnicas que regem a documentação de projetos no Brasil.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/Associa%C3%A7%C3%A3o_Brasileira_de_Normas_T%C3%A9cnicas',
        points: 60,
      },
      {
        id: 'rs_8_4',
        title: 'Teste: AutoCAD e Desenho Técnico',
        description: 'Valide seus conhecimentos sobre desenho técnico arquitetônico.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r8', question: 'O que é uma "planta baixa"?', options: ['Uma vista lateral do edifício', 'Um corte horizontal que mostra a disposição dos ambientes', 'A fachada frontal do projeto', 'O projeto estrutural'], correctOptionIndex: 1 },
          { id: 'q2_r8', question: 'Qual é a escala mais comum para plantas baixas residenciais?', options: ['1:5', '1:50', '1:500', '1:5000'], correctOptionIndex: 1 }
        ]
      }
    ]
  },
  {
    id: 'r9',
    title: 'Designer de Interiores',
    description: 'Crie ambientes funcionais e esteticamente coerentes, do conceito ao projeto executivo.',
    area: 'architecture',
    level: 'Intermediário',
    steps: [
      {
        id: 'rs_9_1',
        title: 'Conceito e Briefing de Interiores',
        description: 'Aprenda a levantar necessidades do cliente e transformá-las em conceito de projeto.',
        type: 'module',
        courseId: 'c9',
        moduleId: 'm1_c9',
      },
      {
        id: 'rs_9_2',
        title: 'Ergonomia e Circulação em Ambientes',
        description: 'Dimensionamento correto e conforto para os utilizadores do espaço.',
        type: 'module',
        courseId: 'c9',
        moduleId: 'm2_c9',
      },
      {
        id: 'rs_9_3',
        title: 'Materiais e Acabamentos em Interiores',
        description: 'Conheça os principais materiais de revestimento, mobiliário e iluminação.',
        type: 'article',
        url: 'https://pt.wikipedia.org/wiki/Design_de_interiores',
        points: 60,
      },
      {
        id: 'rs_9_4',
        title: 'Teste: Design de Interiores',
        description: 'Valide seus conhecimentos sobre projeto e ergonomia de interiores.',
        type: 'test',
        points: 150,
        maxRetries: 3,
        questions: [
          { id: 'q1_r9', question: 'O que é ergonomia aplicada ao design de interiores?', options: ['O estudo das cores em ambientes', 'A adaptação do espaço às necessidades físicas e psicológicas dos utilizadores', 'A escolha de mobiliário caro', 'O uso de materiais sustentáveis'], correctOptionIndex: 1 },
          { id: 'q2_r9', question: 'Qual é a altura padrão de uma bancada de cozinha?', options: ['70 cm', '85 cm', '100 cm', '110 cm'], correctOptionIndex: 1 }
        ]
      }
    ]
  }
];
