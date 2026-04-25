import { motion } from 'motion/react';
import { Link } from 'react-router';
import { Button } from '../components/ui/button';
import { ArrowRight, Sparkles, Briefcase, GraduationCap, Globe, Users, Zap, Building, Rocket, Code, Palette, BookOpen } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Landing() {
  const { getAllUsers, courses, roadmaps } = useApp();
  
  // Contagens din├ómicas atreladas aos dados reais do sistema (usuários e trilhas reais do contexto)
  const realUsersCount = getAllUsers().length;
  const realTrailsCount = (courses?.length || 0) + (roadmaps?.length || 0);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-100px" },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    initial: { opacity: 0 },
    whileInView: { opacity: 1 },
    viewport: { once: true, margin: "-100px" },
    transition: { staggerChildren: 0.1 }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-fuchsia-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 w-full z-50 bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-tr from-fuchsia-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <Sparkles className="text-white h-5 w-5" />
            </div>
            <span className="text-2xl font-bold tracking-tighter">ASTER</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-fuchsia-400 transition-colors">Funcionalidades</a>
            <a href="#about" className="hover:text-cyan-400 transition-colors">Sobre Nós</a>
            <a href="#partners" className="hover:text-yellow-400 transition-colors">Parceiros</a>
          </div>

          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost" className="text-white hover:text-fuchsia-400 hover:bg-white/5">
                Entrar
              </Button>
            </Link>
            <Link to="/register">
              <Button className="bg-white text-black hover:bg-gray-200 rounded-full px-6">
                Criar Conta
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 min-h-screen flex items-center justify-center overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-fuchsia-600/30 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 text-sm text-cyan-400 font-medium">
              <Zap className="h-4 w-4" />
              <span>A nova forma de evoluir na carreira</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[1.1] mb-8 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
              Sua carreira, <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-500 to-cyan-500">sem limites.</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12 leading-relaxed">
              Publique seu portfólio, conecte-se com gigantes do mercado, estude através de trilhas gamificadas e seja contratado pelas melhores empresas. Tudo em um só lugar.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <Button size="lg" className="h-14 px-8 text-lg rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 hover:opacity-90 transition-opacity border-0">
                  Começar Agora <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/apply-partner">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full border-white/20 bg-white/5 hover:bg-white/10 text-white">
                  Seja um Parceiro
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Marquee or Scrolling Text (Gen Z vibe) */}
      <div className="w-full bg-fuchsia-500 text-black py-4 overflow-hidden flex whitespace-nowrap -rotate-1 scale-105">
        <motion.div 
          className="flex gap-8 text-xl font-bold uppercase tracking-widest"
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
        >
          <span>CONSTRUA SEU FUTURO</span> • <span>CONECTE-SE</span> • <span>APRENDA</span> • <span>COMPARTILHE SEU PORTF├ôLIO</span> • <span>EVOLUA</span> • 
          <span>CONSTRUA SEU FUTURO</span> • <span>CONECTE-SE</span> • <span>APRENDA</span> • <span>COMPARTILHE SEU PORTF├ôLIO</span> • <span>EVOLUA</span> •
          <span>CONSTRUA SEU FUTURO</span> • <span>CONECTE-SE</span> • <span>APRENDA</span> • <span>COMPARTILHE SEU PORTF├ôLIO</span> • <span>EVOLUA</span> •
        </motion.div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div {...fadeIn} className="mb-20">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">Tudo para você decolar.</h2>
            <p className="text-xl text-gray-400 max-w-2xl">Desenvolvido para criadores, desenvolvedores e profissionais do futuro.</p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Palette, title: "Portfólio Criativo", desc: "Mostre seu trabalho para o mundo. Faça upload de projetos, imagens e links com uma vitrine moderna.", color: "text-fuchsia-400" },
              { icon: Users, title: "Networking Real", desc: "Conecte-se com pessoas da sua área. Siga, interaja e crie laços profissionais autênticos.", color: "text-cyan-400" },
              { icon: Briefcase, title: "Currículo Din├ómico", desc: "Seu perfil é seu currículo. Habilidades validadas, histórico de cursos e badges gamificados.", color: "text-yellow-400" },
              { icon: GraduationCap, title: "Aprenda e Especialize-se", desc: "Trilhas de conhecimento criadas pelas melhores empresas. Responda questionários e ganhe XP.", color: "text-green-400" },
            ].map((feat, i) => (
              <motion.div 
                key={i} 
                variants={fadeIn}
                className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors group"
              >
                <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 ${feat.color} group-hover:scale-110 transition-transform`}>
                  <feat.icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-bold mb-4">{feat.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="py-32 px-6 bg-white text-black rounded-[3rem] mx-4 md:mx-8 mb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">O que é a<br/>ASTER?</h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Nós acreditamos que a educação e as oportunidades não deveriam ser limitadas. Nosso objetivo é <strong>popularizar o conhecimento para todos</strong>, ajudando a capacitar mais pessoas em áreas distintas.
              </p>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Criamos um ecossistema onde criar um portfólio incrível é fácil, e onde aprender é uma experiência social e gamificada. Aqui, sua dedicação vira resultado, atraindo empresas parceiras que estão em busca do seu talento.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-2 font-bold text-lg">
                  <Globe className="text-fuchsia-500" /> {realUsersCount} Usuários
                </div>
                <div className="flex items-center gap-2 font-bold text-lg">
                  <BookOpen className="text-cyan-500" /> {realTrailsCount} Trilhas
                </div>
              </div>
            </motion.div>
            <motion.div 
              {...fadeIn}
              className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img 
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80" 
                alt="Equipe colaborando" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 text-white">
                <h3 className="text-2xl font-bold mb-2">Comunidade forte</h3>
                <p className="text-white/80">Faça parte da nova geração de profissionais.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section id="partners" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-yellow-500/10 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div {...fadeIn} className="max-w-3xl mx-auto mb-16">
            <div className="w-20 h-20 mx-auto bg-yellow-500/20 rounded-full flex items-center justify-center mb-8">
              <Building className="h-10 w-10 text-yellow-500" />
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">Para Empresas e Parceiros</h2>
            <p className="text-xl text-gray-400">
              Transforme a forma como você contrata e treina. A ASTER conecta sua marca aos melhores talentos através da educação e do engajamento org├ónico.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 text-left">
            <motion.div {...fadeIn} className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-white">Contrate Melhor</h3>
              <p className="text-gray-400">Encontre talentos com base em habilidades reais comprovadas nas trilhas, não apenas no que dizem nos currículos.</p>
            </motion.div>
            <motion.div {...fadeIn} className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-white">Publique Conte├║do</h3>
              <p className="text-gray-400">Crie cursos, questionários e desafios. Posicione sua marca como referência técnica e atraia profissionais engajados.</p>
            </motion.div>
            <motion.div {...fadeIn} className="p-8 rounded-3xl bg-white/5 border border-white/10">
              <h3 className="text-xl font-bold mb-4 text-white">Acesso Exclusivo</h3>
              <p className="text-gray-400">Tenha um dashboard dedicado para analisar métricas de engajamento dos alunos nas suas trilhas e gerenciar vagas.</p>
            </motion.div>
          </div>

          <motion.div {...fadeIn}>
            <Link to="/apply-partner">
              <Button size="lg" className="h-16 px-10 text-lg rounded-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold transition-all hover:scale-105">
                Inscreva-se como Parceiro <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-white/10 bg-black">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Sparkles className="text-fuchsia-500 h-5 w-5" />
            <span className="text-xl font-bold">ASTER</span>
          </div>
          <p className="text-gray-500 text-sm">
            ┬® {new Date().getFullYear()} ASTER. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-white transition-colors">Termos</a>
            <a href="#" className="hover:text-white transition-colors">Privacidade</a>
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
