import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Map, 
  PlayCircle, 
  Award, 
  Star,
  Clock,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export default function Learning() {
  const navigate = useNavigate();
  const { currentUser, courses, roadmaps } = useApp();
  const [activeTab, setActiveTab] = useState<'roadmaps' | 'courses'>('roadmaps');
  const [activeArea, setActiveArea] = useState<'all' | 'tech' | 'fashion' | 'architecture'>('all');

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else {
      setActiveArea(currentUser.area);
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const filteredRoadmaps = roadmaps.filter(
    (r) => activeArea === 'all' || r.area === activeArea
  );

  const filteredCourses = courses.filter(
    (c) => activeArea === 'all' || c.area === activeArea
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Centro de Aprendizado</h1>
            <p className="text-gray-500 mt-1">Evolua na sua carreira com trilhas e cursos focados na sua área</p>
          </div>

          {/* Area Filter */}
          <div className="flex gap-2 p-1 bg-white rounded-lg border shadow-sm w-full md:w-auto overflow-x-auto">
            <button
              onClick={() => setActiveArea('all')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeArea === 'all' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Todas as Áreas
            </button>
            <button
              onClick={() => setActiveArea('tech')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeArea === 'tech' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Tecnologia
            </button>
            <button
              onClick={() => setActiveArea('fashion')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeArea === 'fashion' ? 'bg-pink-50 text-pink-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Moda
            </button>
            <button
              onClick={() => setActiveArea('architecture')}
              className={`px-4 py-2 text-sm font-medium rounded-md whitespace-nowrap transition-colors ${activeArea === 'architecture' ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              Arquitetura
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('roadmaps')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'roadmaps' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Map className="w-5 h-5" />
            Roadmaps de Carreira
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === 'courses' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <PlayCircle className="w-5 h-5" />
            Cursos Recomendados
          </button>
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === 'roadmaps' ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoadmaps.length > 0 ? (
                filteredRoadmaps.map((roadmap) => (
                  <Card key={roadmap.id} className="hover:shadow-md transition-shadow flex flex-col">
                    <CardHeader>
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant="outline" className={`
                          ${roadmap.area === 'tech' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                          ${roadmap.area === 'fashion' ? 'border-pink-200 text-pink-700 bg-pink-50' : ''}
                          ${roadmap.area === 'architecture' ? 'border-green-200 text-green-700 bg-green-50' : ''}
                        `}>
                          {roadmap.level}
                        </Badge>
                      </div>
                      <CardTitle className="text-xl line-clamp-2">{roadmap.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{roadmap.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col justify-between">
                      <div className="space-y-3 mb-6">
                        <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          <Award className="w-4 h-4 text-indigo-500" />
                          Passos principais:
                        </p>
                        <ul className="space-y-2">
                          {roadmap.steps.slice(0, 3).map((step, idx) => (
                            <li key={step.id} className="flex items-center text-sm text-gray-600">
                              <span className="w-6 h-6 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center text-xs mr-3 font-medium shrink-0">
                                {idx + 1}
                              </span>
                              <span className="truncate">{step.title}</span>
                            </li>
                          ))}
                          {roadmap.steps.length > 3 && (
                            <li className="text-sm text-gray-400 pl-9">+ {roadmap.steps.length - 3} outros passos</li>
                          )}
                        </ul>
                      </div>
                      <Button 
                        className="w-full hover:bg-indigo-50 hover:text-indigo-700" 
                        variant="outline"
                        onClick={() => navigate(`/roadmap/${roadmap.id}`)}
                      >
                        Iniciar Trilha <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500">
                  <Map className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Nenhum roadmap encontrado para esta área no momento.</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <Card 
                    key={course.id} 
                    className="overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
                    onClick={() => navigate(`/course/${course.id}`)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img 
                        src={course.imageUrl} 
                        alt={course.title} 
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                        <PlayCircle className="w-12 h-12 text-white opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                      </div>
                    </div>
                    <CardHeader className="pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs font-medium text-gray-500">{course.provider}</span>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-current" />
                          <span className="text-xs font-semibold">{course.rating}</span>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                        <Clock className="w-4 h-4" />
                        <span>{course.duration} de conteúdo</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {course.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs font-normal bg-gray-100">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button 
                        className="w-full group-hover:bg-indigo-700 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/course/${course.id}`);
                        }}
                      >
                        Acessar Curso <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full py-12 text-center text-gray-500">
                  <PlayCircle className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p>Nenhum curso encontrado para esta área no momento.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
