import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle2, Circle, BookOpen, FileText, PlayCircle, ArrowLeft, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function RoadmapDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, completeLesson, updateProfile, roadmaps, courses } = useApp();
  const [roadmap, setRoadmap] = useState(roadmaps.find(r => r.id === id));
  
  const [activeTest, setActiveTest] = useState<any>(null);
  const [testAnswers, setTestAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || !roadmap) return null;

  const getModuleStatus = (courseId?: string, moduleId?: string) => {
    if (!courseId || !moduleId) return false;
    const course = courses.find(c => c.id === courseId);
    if (!course) return false;
    const module = course.modules.find(m => m.id === moduleId);
    if (!module) return false;
    
    // Check if ALL lessons in this module are completed
    return module.lessons.every(lesson => 
      currentUser.completedLessons?.includes(lesson.id)
    );
  };

  const isStepCompleted = (step: any) => {
    if (step.type === 'module') {
      return getModuleStatus(step.courseId, step.moduleId);
    }
    if (step.type === 'lesson' && step.lessonId) {
      return currentUser.completedLessons?.includes(step.lessonId);
    }
    return currentUser.completedLessons?.includes(step.id);
  };

  const handleMarkAsDone = (step: any) => {
    if (step.type === 'module' || step.type === 'lesson') {
      navigate(`/course/${step.courseId}`);
    } else if (step.type === 'test') {
      const retries = currentUser?.testRetries?.[step.id] || 0;
      if (step.maxRetries && retries >= step.maxRetries) {
        toast.error('Você já atingiu o limite máximo de tentativas para este teste.');
        return;
      }
      setActiveTest(step);
      setTestAnswers({});
    } else {
      completeLesson(step.id, step.points || 50);
      toast.success(`Parabéns! Você concluiu "${step.title}" e ganhou ${step.points || 50} pontos!`);
    }
  };

  const handleSubmitTest = () => {
    if (!activeTest || !activeTest.questions) return;
    
    let correctCount = 0;
    activeTest.questions.forEach((q: any) => {
      if (testAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const totalQuestions = activeTest.questions.length;
    const scorePercentage = Math.round((correctCount / totalQuestions) * 100);
    const isApproved = correctCount >= Math.ceil(totalQuestions / 2);
    
    // Increment retries
    const currentRetries = currentUser?.testRetries || {};
    const retries = (currentRetries[activeTest.id] || 0) + 1;
    
    // Update scores
    const currentScores = currentUser?.testScores || {};
    
    updateProfile({ 
      testRetries: { ...currentRetries, [activeTest.id]: retries },
      testScores: { ...currentScores, [activeTest.id]: scorePercentage }
    });

    if (isApproved || correctCount === totalQuestions) {
      completeLesson(activeTest.id, activeTest.points || 100);
      toast.success(`Você acertou ${correctCount} de ${totalQuestions} (${scorePercentage}%)! Ganhou ${activeTest.points || 100} pontos.`);
    } else {
      toast.error(`Você acertou ${correctCount} de ${totalQuestions} (${scorePercentage}%). Tente novamente se possível.`);
      if (activeTest.maxRetries && retries >= activeTest.maxRetries) {
        completeLesson(activeTest.id, 10);
      }
    }
    setActiveTest(null);
  };

  const completedSteps = roadmap.steps.filter(isStepCompleted).length;
  const progressPercentage = Math.round((completedSteps / roadmap.steps.length) * 100);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <button 
            onClick={() => navigate('/learning')}
            className="flex items-center text-sm font-medium text-gray-500 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Voltar para o Centro de Aprendizado
          </button>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className={`
                  ${roadmap.area === 'tech' ? 'border-blue-200 text-blue-700 bg-blue-50' : ''}
                  ${roadmap.area === 'fashion' ? 'border-pink-200 text-pink-700 bg-pink-50' : ''}
                  ${roadmap.area === 'architecture' ? 'border-green-200 text-green-700 bg-green-50' : ''}
                `}>
                  {roadmap.level}
                </Badge>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{roadmap.title}</h1>
              <p className="text-gray-500 mt-2">{roadmap.description}</p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-white p-6 rounded-xl border shadow-sm">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold text-gray-700">Progresso da Trilha</span>
            <span className="font-bold text-indigo-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-3">
            <div 
              className="bg-indigo-600 h-3 rounded-full transition-all duration-500" 
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-3 text-right">
            {completedSteps} de {roadmap.steps.length} etapas concluídas
          </p>
        </div>

        {/* Steps */}
        <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
          {roadmap.steps.map((step, idx) => {
            const completed = isStepCompleted(step);
            
            return (
              <div key={step.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                {/* Icon */}
                <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white ${completed ? 'bg-green-500' : 'bg-gray-200'} shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors`}>
                  {completed ? (
                    <CheckCircle2 className="w-5 h-5 text-white" />
                  ) : (
                    <span className="text-sm font-bold text-gray-500">{idx + 1}</span>
                  )}
                </div>
                
                {/* Card */}
                <Card className={`w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] hover:shadow-md transition-all ${completed ? 'border-green-200 bg-green-50/30' : ''}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {step.type === 'module' && <PlayCircle className={`w-4 h-4 ${completed ? 'text-green-600' : 'text-indigo-600'}`} />}
                        {step.type === 'lesson' && <PlayCircle className={`w-4 h-4 ${completed ? 'text-green-600' : 'text-indigo-600'}`} />}
                        {step.type === 'book' && <BookOpen className={`w-4 h-4 ${completed ? 'text-green-600' : 'text-amber-600'}`} />}
                        {step.type === 'article' && <FileText className={`w-4 h-4 ${completed ? 'text-green-600' : 'text-blue-600'}`} />}
                        {step.type === 'file' && <FileText className={`w-4 h-4 ${completed ? 'text-green-600' : 'text-teal-600'}`} />}
                        {step.type === 'test' && <CheckCircle2 className={`w-4 h-4 ${completed ? 'text-green-600' : 'text-purple-600'}`} />}
                        <span className={`text-xs font-semibold uppercase tracking-wider ${
                          step.type === 'module' || step.type === 'lesson' ? 'text-indigo-600' : 
                          step.type === 'book' ? 'text-amber-600' : 
                          step.type === 'test' ? 'text-purple-600' :
                          'text-blue-600'
                        }`}>
                          {step.type === 'module' ? 'Módulo do Curso' : 
                           step.type === 'lesson' ? 'Aula' : 
                           step.type === 'book' ? 'Livro Recomendado' : 
                           step.type === 'test' ? 'Teste de Conhecimento' : 
                           step.type === 'file' ? 'Arquivo para Leitura' : 
                           'Artigo Técnico'}
                        </span>
                      </div>
                      
                      {step.points && (
                        <Badge variant="secondary" className="bg-indigo-50 text-indigo-700">
                          +{step.points} pts
                        </Badge>
                      )}
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-900 mb-1">{step.title}</h3>
                    {step.author && <p className="text-sm font-medium text-gray-700 mb-2">Por {step.author}</p>}
                    <p className="text-sm text-gray-600 mb-4">{step.description}</p>
                    
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                      {step.type === 'module' || step.type === 'lesson' ? (
                        <Button 
                          variant={completed ? "outline" : "default"}
                          size="sm"
                          className={completed ? "border-green-500 text-green-700 hover:bg-green-50" : ""}
                          onClick={() => handleMarkAsDone(step)}
                        >
                          {completed ? "Revisar" : "Ir para o Curso"}
                        </Button>
                      ) : step.type === 'test' ? (
                        <div className="flex items-center gap-3 w-full justify-between">
                          <div className="flex flex-col">
                            <span className="text-sm text-gray-500">
                              {step.maxRetries ? `Tentativas: ${currentUser?.testRetries?.[step.id] || 0}/${step.maxRetries}` : ''}
                            </span>
                            {currentUser?.testScores?.[step.id] !== undefined && (
                              <span className="text-sm font-medium text-purple-700">
                                Última Nota: {currentUser.testScores[step.id]}%
                              </span>
                            )}
                          </div>
                          <Button 
                            variant={completed ? "outline" : "default"}
                            size="sm"
                            className={completed ? "border-green-500 text-green-700 hover:bg-green-50" : "bg-purple-600 hover:bg-purple-700"}
                            onClick={() => !completed && handleMarkAsDone(step)}
                          >
                            {completed ? "Teste Concluído" : "Fazer Teste"}
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 w-full justify-between">
                          {(step.url || step.type === 'file') && (
                            <a 
                              href={step.url || '#'} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-sm font-medium text-indigo-600 hover:text-indigo-800 flex items-center"
                            >
                              {step.type === 'file' ? 'Baixar/Ler Arquivo' : 'Ler online'} <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                          {!step.url && step.type !== 'file' && <div></div>}
                          
                          <Button 
                            variant={completed ? "ghost" : "outline"}
                            size="sm"
                            className={completed ? "text-green-600 pointer-events-none" : "hover:bg-indigo-50 hover:text-indigo-700"}
                            onClick={() => !completed && handleMarkAsDone(step)}
                          >
                            {completed ? (
                              <><CheckCircle2 className="w-4 h-4 mr-2" /> Concluído</>
                            ) : (
                              <><Circle className="w-4 h-4 mr-2" /> Marcar como lido</>
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      </div>

      {/* Test Modal */}
      {activeTest && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-purple-50">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{activeTest.title}</h2>
                <p className="text-sm text-gray-600 mt-1">{activeTest.description}</p>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 space-y-8 bg-gray-50">
              {activeTest.questions?.map((q: any, i: number) => (
                <div key={q.id} className="bg-white p-5 rounded-lg border shadow-sm">
                  <p className="font-semibold text-gray-800 mb-4">{i + 1}. {q.question}</p>
                  <div className="space-y-3">
                    {q.options.map((opt: string, optIdx: number) => (
                      <label 
                        key={optIdx} 
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          testAnswers[q.id] === optIdx ? 'border-purple-500 bg-purple-50' : 'hover:bg-gray-50'
                        }`}
                      >
                        <input 
                          type="radio" 
                          name={`q_${q.id}`} 
                          checked={testAnswers[q.id] === optIdx}
                          onChange={() => setTestAnswers({ ...testAnswers, [q.id]: optIdx })}
                          className="mt-1 w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <span className="text-gray-700">{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
              <Button variant="ghost" onClick={() => setActiveTest(null)}>
                Cancelar
              </Button>
              <Button className="bg-purple-600 hover:bg-purple-700" onClick={handleSubmitTest}>
                Enviar Respostas
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}