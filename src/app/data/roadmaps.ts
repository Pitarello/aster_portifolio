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
}

export const roadmapsData: Roadmap[] = [
  {
    id: 'r1',
    title: 'Como virar Desenvolvedor Front-end',
    description: 'Guia completo do zero ao pro para se tornar um desenvolvedor Front-end moderno.',
    area: 'tech',
    level: 'Iniciante',
    steps: [
      {
        id: 'rs_t1',
        title: 'Fundamentos do Front-end',
        description: 'Domine a componentização no React e entenda como criar interfaces modernas.',
        type: 'module',
        courseId: 'c1',
        moduleId: 'm1_c1',
      },
      {
        id: 'rs_t2',
        title: 'Clean Code',
        description: 'Leitura essencial para escrever código legível, testável e manutenível.',
        type: 'book',
        author: 'Robert C. Martin',
        points: 200,
      },
      {
        id: 'rs_t3',
        title: 'Estado e Efeitos no React',
        description: 'Aprenda a lidar com estados complexos e efeitos colaterais na sua aplicação.',
        type: 'module',
        courseId: 'c1',
        moduleId: 'm2_c1',
      },
      {
        id: 'rs_t4',
        title: 'Arquitetura de Micro-Frontends',
        description: 'Artigo complementar sobre como escalar aplicações front-end.',
        type: 'article',
        url: 'https://martinfowler.com/articles/micro-frontends.html',
        points: 50,
      }
    ]
  },
  {
    id: 'r2',
    title: 'Como virar Designer de Moda',
    description: 'Trilha essencial para construir sua marca e dominar o design de moda contemporâneo.',
    area: 'fashion',
    level: 'Intermediário',
    steps: [
      {
        id: 'rs_f1',
        title: 'Primeiros Passos no 3D',
        description: 'Aprenda a interface do CLO 3D e construa sua primeira modelagem.',
        type: 'module',
        courseId: 'c2',
        moduleId: 'm1_c2',
      },
      {
        id: 'rs_f2',
        title: 'The End of Fashion',
        description: 'Como o mercado de moda mudou e se adaptou à era moderna.',
        type: 'book',
        author: 'Teri Agins',
        points: 200,
      },
      {
        id: 'rs_f3',
        title: 'Guia de Tecidos Sustentáveis',
        description: 'Artigo detalhado sobre as opções de tecidos eco-friendly.',
        type: 'article',
        url: '#',
        points: 50,
      }
    ]
  },
  {
    id: 'r3',
    title: 'Como virar Arquiteto de Interiores',
    description: 'Domine a arte de transformar espaços e projetar interiores incríveis.',
    area: 'architecture',
    level: 'Avançado',
    steps: [
      {
        id: 'rs_a1',
        title: 'A Pattern Language',
        description: 'O clássico sobre como projetar espaços focados na experiência humana.',
        type: 'book',
        author: 'Christopher Alexander',
        points: 200,
      },
      {
        id: 'rs_a2',
        title: 'Fundamentos do BIM',
        description: 'Entenda os princípios e vantagens competitivas da metodologia BIM no Revit.',
        type: 'module',
        courseId: 'c3',
        moduleId: 'm1_c3',
      },
      {
        id: 'rs_a3',
        title: 'Implementação do BIM em 2024',
        description: 'Artigo abordando os desafios práticos de aplicar o BIM no mercado atual.',
        type: 'article',
        url: '#',
        points: 50,
      }
    ]
  }
];