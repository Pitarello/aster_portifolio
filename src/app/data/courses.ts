export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: 'video' | 'activity';
  points: number;
  contentUrl?: string; // youtube embed or similar
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
}

export const coursesData: CourseData[] = [
  {
    id: 'c1',
    title: 'Bootcamp Fullstack Completo',
    provider: 'ProNetwork Academy',
    area: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2RpbmclMjBib290Y2FtcCUyMG9ubGluZSUyMGNvdXJzZXxlbnwxfHx8fDE3NzQzMjMyNjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '40h',
    rating: 4.8,
    tags: ['React', 'Node.js', 'PostgreSQL'],
    description: 'Aprenda do zero a construir aplicações robustas usando a stack de tecnologia mais atual do mercado: React no front-end e Node.js com PostgreSQL no back-end.',
    modules: [
      {
        id: 'm1_c1',
        title: 'Módulo 1: Fundamentos do Front-end',
        lessons: [
          {
            id: 'l1_m1_c1',
            title: 'Introdução ao React e Componentização',
            duration: '45 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/SqcY0GlETPk?si=z8v1vA3q6Z_a8A4W',
            description: 'Nesta aula, vamos entender como a componentização funciona no React e como criar nossas primeiras interfaces modernas.'
          },
          {
            id: 'l2_m1_c1',
            title: 'Atividade: Seu Primeiro Componente',
            duration: '30 min',
            type: 'activity',
            points: 100,
            description: 'Crie um componente de botão reutilizável no CodeSandbox usando Tailwind CSS e envie o link para avaliação.'
          }
        ]
      },
      {
        id: 'm2_c1',
        title: 'Módulo 2: Estado e Efeitos',
        lessons: [
          {
            id: 'l1_m2_c1',
            title: 'Entendendo o useState e useEffect',
            duration: '50 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/O6P86uwfdR0?si=O8Z0_1G2h_M2P2R3',
            description: 'Aprenda a lidar com estados complexos e efeitos colaterais na sua aplicação.'
          }
        ]
      }
    ]
  },
  {
    id: 'c2',
    title: 'Ilustração de Moda 3D',
    provider: 'Fashion Forward Institute',
    area: 'fashion',
    imageUrl: 'https://images.unsplash.com/photo-1557777586-f6682739fcf3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwZGVzaWduJTIwc2tldGNoaW5nfGVufDF8fHx8MTc3NDMyMzI2NHww&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '25h',
    rating: 4.9,
    tags: ['CLO 3D', 'Marvelous Designer'],
    description: 'Domine as ferramentas da próxima geração de estilistas e desenvolva peças realistas no ambiente virtual 3D.',
    modules: [
      {
        id: 'm1_c2',
        title: 'Módulo 1: Primeiros Passos no 3D',
        lessons: [
          {
            id: 'l1_m1_c2',
            title: 'Interface do CLO 3D',
            duration: '40 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/SqcY0GlETPk', // Using dummy video since it's a mock
            description: 'Nesta aula, apresentamos a interface do software CLO 3D.'
          },
          {
            id: 'l2_m1_c2',
            title: 'Atividade: Modelagem Básica de Camiseta',
            duration: '1h',
            type: 'activity',
            points: 150,
            description: 'Construa sua primeira modelagem básica e vista no avatar digital.'
          }
        ]
      }
    ]
  },
  {
    id: 'c3',
    title: 'Revit e Modelagem BIM Avançada',
    provider: 'ArchiTech Learning',
    area: 'architecture',
    imageUrl: 'https://images.unsplash.com/photo-1694902967176-070e63512b3c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcmNoaXRlY3R1cmUlMjBza2V0Y2hpbmclMjBkcmFmdGluZ3xlbnwxfHx8fDE3NzQzMjMyNjh8MA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '60h',
    rating: 4.7,
    tags: ['BIM', 'Revit', 'Projetos'],
    description: 'Domine o Revit e metodologias BIM para levar os projetos da sua carreira na arquitetura para um novo patamar de eficiência.',
    modules: [
      {
        id: 'm1_c3',
        title: 'Módulo 1: Fundamentos do BIM',
        lessons: [
          {
            id: 'l1_m1_c3',
            title: 'O que é BIM e como ele muda o mercado',
            duration: '35 min',
            type: 'video',
            points: 50,
            contentUrl: 'https://www.youtube.com/embed/SqcY0GlETPk',
            description: 'Entenda os princípios e vantagens competitivas da metodologia BIM.'
          }
        ]
      }
    ]
  }
];
