import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Lesson, Module } from '../data/courses';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { 
  PlayCircle, 
  FileText, 
  CheckCircle,
  Award,
  ChevronLeft,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { toast } from 'sonner';

export default function CoursePlayer() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { currentUser, completeLesson, courses, updateProfile } = useApp();
  
  const [course, setCourse] = useState(courses.find(c => c.id === courseId));
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [expandedModules, setExpandedModules] = useState<string[]>([]);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});
  const [hasPassedActivity, setHasPassedActivity] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setTestAnswers({});
    setHasPassedActivity(false);
  }, [activeLesson]);

  useEffect(() => {
    if (course && course.modules.length > 0) {
      // Set the first module as expanded by default
      setExpandedModules([course.modules[0].id]);
      
      // Select the first lesson by default if none is selected
      if (!activeLesson && course.modules[0].lessons.length > 0) {
        setActiveLesson(course.modules[0].lessons[0]);
      }
    }
  }, [course]);

  if (!currentUser) return null;

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
        <Button onClick={() => navigate('/learning')}>Voltar ao Aprendizado</Button>
      </div>
    );
  }

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => 
      prev.includes(moduleId) 
        ? prev.filter(id => id !== moduleId)
        : [...prev, moduleId]
    );
  };

  const isLessonCompleted = (lessonId: string) => {
    return currentUser.completedLessons?.includes(lessonId) || false;
  };

  const handleCompleteLesson = () => {
    if (!activeLesson) return;
    
    completeLesson(activeLesson.id, activeLesson.points);
    toast.success(`Parabéns! Você ganhou ${activeLesson.points} pontos.`, {
      icon: <Award className="w-5 h-5 text-yellow-500" />
    });
  };

  const handleSubmitActivity = () => {
    if (!activeLesson || !activeLesson.questions || !currentUser) return;
    
    const retries = currentUser.testRetries?.[activeLesson.id] || 0;
    const maxRetries = activeLesson.maxRetries || 1;
    
    if (retries >= maxRetries) {
      toast.error('Limite de tentativas excedido para esta atividade.');
      return;
    }
    
    let correct = 0;
    activeLesson.questions.forEach(q => {
      if (testAnswers[q.id] === q.correctOptionIndex) correct++;
    });
    
    const percentage = Math.round((correct / activeLesson.questions.length) * 100);
    
    const newRetries = {
      ...(currentUser.testRetries || {}),
      [activeLesson.id]: retries + 1
    };
    
    const newScores = {
      ...(currentUser.testScores || {}),
      [activeLesson.id]: percentage
    };
    
    updateProfile({ testRetries: newRetries, testScores: newScores });
    
    if (percentage >= 70) {
      toast.success(`Parabéns! Você acertou ${percentage}% e foi aprovado.`);
      setHasPassedActivity(true);
      handleCompleteLesson();
    } else {
      const remaining = maxRetries - (retries + 1);
      if (remaining > 0) {
        toast.error(`Você acertou ${percentage}%. Tentativas restantes: ${remaining}. Tente novamente para alcançar 70%.`);
      } else {
        toast.error(`Você acertou ${percentage}% e excedeu o limite de tentativas. Atividade bloqueada.`);
      }
    }
  };

  const calculateProgress = () => {
    const totalLessons = course.modules.reduce((acc, mod) => acc + mod.lessons.length, 0);
    if (totalLessons === 0) return 0;

    let completed = 0;
    course.modules.forEach(mod => {
      mod.lessons.forEach(lesson => {
        if (isLessonCompleted(lesson.id)) completed++;
      });
    });

    return Math.round((completed / totalLessons) * 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r flex flex-col h-[calc(100vh-64px)] overflow-hidden shrink-0 hidden md:flex">
          <div className="p-4 border-b">
            <button 
              onClick={() => navigate('/learning')}
              className="flex items-center text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors"
            >
              <ChevronLeft className="w-4 h-4 mr-1" /> Voltar
            </button>
            <h2 className="font-bold text-gray-900 leading-tight">{course.title}</h2>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span className="font-medium">{calculateProgress()}% concluído</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-indigo-600 h-2 rounded-full transition-all" 
                style={{ width: `${calculateProgress()}%` }}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {course.modules.map(module => (
              <div key={module.id} className="border-b last:border-b-0">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
                >
                  <span className="font-semibold text-sm text-gray-800">{module.title}</span>
                  {expandedModules.includes(module.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </button>
                
                {expandedModules.includes(module.id) && (
                  <div className="py-2">
                    {module.lessons.map(lesson => {
                      const isActive = activeLesson?.id === lesson.id;
                      const completed = isLessonCompleted(lesson.id);
                      
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setActiveLesson(lesson)}
                          className={`w-full flex items-start p-3 pl-4 text-left transition-colors ${
                            isActive ? 'bg-indigo-50 border-r-4 border-indigo-600' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="mt-0.5 mr-3 shrink-0">
                            {completed ? (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            ) : lesson.type === 'video' ? (
                              <PlayCircle className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            ) : (
                              <FileText className={`w-5 h-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${isActive ? 'font-medium text-indigo-900' : 'text-gray-700'}`}>
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-gray-500">{lesson.duration}</span>
                              <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 border-yellow-200 bg-yellow-50 text-yellow-700">
                                {lesson.points} pts
                              </Badge>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-y-auto bg-gray-50">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto w-full p-4 md:p-8">
              <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="capitalize">
                      {activeLesson.type === 'video' ? 'Vídeo Aula' : 'Atividade Prática'}
                    </Badge>
                    <span className="text-sm text-gray-500">{activeLesson.duration}</span>
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                    {activeLesson.title}
                  </h1>
                </div>
              </div>

              {/* Video Player or Activity Content */}
              <div className="bg-white rounded-xl shadow-sm border overflow-hidden mb-8">
                {activeLesson.type === 'video' && activeLesson.contentUrl ? (
                  <div className="aspect-video w-full bg-black relative">
                    <iframe 
                      src={activeLesson.contentUrl} 
                      className="absolute inset-0 w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                      title={activeLesson.title}
                    ></iframe>
                  </div>
                ) : (
                  <div className="p-8 text-left bg-indigo-50 flex flex-col items-start justify-start border-b">
                    <div className="flex items-center gap-3 mb-4 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <FileText className="w-10 h-10 text-indigo-400" />
                        <div>
                          <h3 className="text-xl font-semibold text-indigo-900">Exercício Prático</h3>
                          <p className="text-sm text-indigo-700">Responda as questões abaixo para concluir.</p>
                        </div>
                      </div>
                      {activeLesson.questions && activeLesson.maxRetries && (
                        <div className="text-right text-sm font-medium text-indigo-800">
                          Tentativas: {currentUser.testRetries?.[activeLesson.id] || 0} / {activeLesson.maxRetries}
                          {currentUser.testScores?.[activeLesson.id] !== undefined && (
                            <div className="text-xs text-indigo-600 mt-1">Última nota: {currentUser.testScores[activeLesson.id]}%</div>
                          )}
                        </div>
                      )}
                    </div>
                    
                    {activeLesson.questions && activeLesson.questions.length > 0 ? (
                      <div className="w-full space-y-6 mt-4">
                        {activeLesson.questions.map((q: any, i: number) => (
                          <div key={q.id} className="bg-white p-5 rounded-lg border shadow-sm w-full">
                            <p className="font-semibold text-gray-800 mb-4">{i + 1}. {q.question}</p>
                            <div className="space-y-3">
                              {q.options.map((opt: string, optIdx: number) => (
                                <label 
                                  key={optIdx} 
                                  className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                    testAnswers[q.id] === optIdx ? 'border-indigo-500 bg-indigo-50' : 'hover:bg-gray-50'
                                  }`}
                                >
                                  <input 
                                    type="radio" 
                                    name={`activity_q_${q.id}`} 
                                    checked={testAnswers[q.id] === optIdx}
                                    onChange={() => setTestAnswers({ ...testAnswers, [q.id]: optIdx })}
                                    className="mt-1 w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                    disabled={
                                      hasPassedActivity || 
                                      isLessonCompleted(activeLesson.id) || 
                                      ((currentUser.testRetries?.[activeLesson.id] || 0) >= (activeLesson.maxRetries || 1))
                                    }
                                  />
                                  <span className="text-gray-700">{opt}</span>
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-indigo-700 max-w-md mt-4">
                        Realize a atividade prática conforme descrito na aula.
                      </p>
                    )}
                  </div>
                )}

                <div className="p-6 md:p-8">
                  <h3 className="text-lg font-semibold mb-4">Sobre esta {activeLesson.type === 'video' ? 'aula' : 'atividade'}</h3>
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    {activeLesson.description || 'Nenhuma descrição fornecida para esta aula.'}
                  </p>

                  <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                        <Award className="w-6 h-6 text-yellow-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">Recompensa</p>
                        <p className="text-sm text-gray-600">{activeLesson.points} Pontos Profissionais</p>
                      </div>
                    </div>

                    <Button 
                      onClick={activeLesson.type === 'activity' && activeLesson.questions?.length ? handleSubmitActivity : handleCompleteLesson} 
                      disabled={
                        isLessonCompleted(activeLesson.id) || 
                        (activeLesson.type === 'activity' && activeLesson.questions?.length && hasPassedActivity) ||
                        (activeLesson.type === 'activity' && activeLesson.questions?.length && (currentUser.testRetries?.[activeLesson.id] || 0) >= (activeLesson.maxRetries || 1))
                      }
                      className={isLessonCompleted(activeLesson.id) ? 'bg-green-600 hover:bg-green-700' : ''}
                    >
                      {isLessonCompleted(activeLesson.id) ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Concluído
                        </>
                      ) : activeLesson.type === 'activity' && activeLesson.questions?.length ? (
                        (currentUser.testRetries?.[activeLesson.id] || 0) >= (activeLesson.maxRetries || 1) ? 'Bloqueado (Tentativas Esgotadas)' : 'Enviar Respostas'
                      ) : (
                        'Concluir e Ganhar Pontos'
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500 p-8">
              <PlayCircle className="w-16 h-16 mb-4 text-gray-300" />
              <p>Selecione uma aula no menu lateral para começar.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
