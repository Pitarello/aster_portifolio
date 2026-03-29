import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { CourseData, Module, Lesson } from '../data/courses';
import { Roadmap, RoadmapStep } from '../data/roadmaps';
import { PlusCircle, Save, Briefcase, BookOpen, Layers, ListChecks, Plus, Building2, MessageSquare, Send, FileText, Phone, Video as VideoIcon } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MediaInput } from '../components/MediaInput';
import { CallModal } from '../components/CallModal';

export default function PartnerDashboard() {
  const { currentUser, courses, roadmaps, addCourse, updateCourse, addRoadmap, updateRoadmap, submitCourseForReview, submitRoadmapForReview, updateProfile, chatMessages, sendMessageToAdmin } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'profile' | 'courses' | 'roadmaps' | 'chat'>('profile');
  const [chatInput, setChatInput] = useState('');
  const [callState, setCallState] = useState<'audio' | 'video' | null>(null);
  
  // Profile / Company Info
  const [companyName, setCompanyName] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');

  // Create state for Course
  const [newCourse, setNewCourse] = useState<Partial<CourseData>>({});
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  
  // Create state for Module/Lesson
  const [newModule, setNewModule] = useState<Partial<Module>>({});
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({ type: 'video' });
  
  // Create state for Roadmap
  const [newRoadmap, setNewRoadmap] = useState<Partial<Roadmap>>({});
  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [newStep, setNewStep] = useState<Partial<RoadmapStep>>({ type: 'module' });
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({
    question: '', options: ['', '', '', ''], correctOptionIndex: 0
  });

  const [lessonQuestions, setLessonQuestions] = useState<any[]>([]);
  const [newLessonQuestion, setNewLessonQuestion] = useState({
    question: '', options: ['', '', '', ''], correctOptionIndex: 0
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.role !== 'partner' || currentUser.partnerStatus !== 'approved') {
      toast.error('Acesso negado. Apenas parceiros aprovados.');
      navigate('/feed');
    } else {
      setCompanyName(currentUser.companyInfo?.name || '');
      setCorporateName(currentUser.companyInfo?.corporateName || '');
      setCompanyDesc(currentUser.companyInfo?.description || '');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'partner' || currentUser.partnerStatus !== 'approved') return null;

  const handleUpdateProfile = () => {
    updateProfile({
      companyInfo: {
        name: companyName,
        corporateName: corporateName,
        description: companyDesc
      }
    });
    toast.success('Perfil da empresa atualizado!');
  };

  // --- Course Functions ---
  const handleSaveCourse = () => {
    if (!newCourse.title || !newCourse.area) return toast.error('Preencha os campos obrigatórios');
    const course: CourseData = {
      id: `c_${Date.now()}`,
      title: newCourse.title,
      provider: currentUser.companyInfo?.name || currentUser.name,
      area: newCourse.area as any,
      imageUrl: newCourse.imageUrl || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
      duration: newCourse.duration || '0h',
      rating: 5.0,
      tags: [],
      description: newCourse.description || '',
      modules: []
    };
    addCourse(course);
    setIsCreatingCourse(false);
    setNewCourse({});
    toast.success('Curso criado com sucesso!');
  };

  const handleAddModule = () => {
    if (!editingCourse || !newModule.title) return;
    const module: Module = {
      id: `m_${Date.now()}`,
      title: newModule.title,
      lessons: []
    };
    const updatedCourse = { ...editingCourse, modules: [...editingCourse.modules, module] };
    updateCourse(updatedCourse);
    setEditingCourse(updatedCourse);
    setNewModule({});
    toast.success('Módulo adicionado!');
  };

  const handleAddLesson = (moduleId: string) => {
    if (!editingCourse || !newLesson.title) return;
    
    if (newLesson.type === 'activity' && lessonQuestions.length === 0) {
      toast.error('Adicione ao menos uma pergunta à atividade.');
      return;
    }
    
    const lesson: Lesson = {
      id: `l_${Date.now()}`,
      title: newLesson.title,
      duration: newLesson.duration || '10 min',
      type: newLesson.type as 'video' | 'activity',
      points: Number(newLesson.points) || 50,
      contentUrl: newLesson.contentUrl,
      description: newLesson.description,
      questions: newLesson.type === 'activity' ? lessonQuestions : undefined,
      maxRetries: newLesson.type === 'activity' ? (Number(newLesson.maxRetries) || 1) : undefined
    };

    const updatedModules = editingCourse.modules.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: [...m.lessons, lesson] };
      }
      return m;
    });

    const updatedCourse = { ...editingCourse, modules: updatedModules };
    updateCourse(updatedCourse);
    setEditingCourse(updatedCourse);
    setNewLesson({ type: 'video' });
    setLessonQuestions([]);
    toast.success('Aula/Atividade adicionada!');
  };

  const handleAddLessonQuestion = () => {
    if (!newLessonQuestion.question || newLessonQuestion.options.some(opt => !opt.trim())) {
      toast.error('Preencha a pergunta e todas as opções.');
      return;
    }
    setLessonQuestions([...lessonQuestions, { ...newLessonQuestion, id: `lq_${Date.now()}` }]);
    setNewLessonQuestion({ question: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  // --- Roadmap Functions ---
  const handleSaveRoadmap = () => {
    if (!newRoadmap.title || !newRoadmap.area) return toast.error('Preencha os campos obrigatórios');
    const roadmap: Roadmap = {
      id: `r_${Date.now()}`,
      title: newRoadmap.title,
      description: newRoadmap.description || '',
      area: newRoadmap.area as any,
      level: newRoadmap.level || 'Iniciante',
      steps: []
    };
    addRoadmap(roadmap);
    setIsCreatingRoadmap(false);
    setNewRoadmap({});
    toast.success('Trilha criada com sucesso!');
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(opt => !opt.trim())) {
      toast.error('Preencha a pergunta e todas as opções.');
      return;
    }
    setTestQuestions([...testQuestions, { ...newQuestion, id: `q_${Date.now()}` }]);
    setNewQuestion({ question: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  const handleAddStep = () => {
    if (!editingRoadmap || !newStep.title) return;
    
    if (newStep.type === 'test' && testQuestions.length === 0) {
      toast.error('Adicione ao menos uma pergunta ao teste.');
      return;
    }

    const step: RoadmapStep = {
      id: `step_${Date.now()}`,
      title: newStep.title,
      description: newStep.description || '',
      type: newStep.type as any,
      courseId: newStep.courseId,
      moduleId: newStep.moduleId,
      lessonId: newStep.lessonId,
      url: newStep.url,
      fileName: newStep.fileName,
      author: newStep.author,
      points: Number(newStep.points) || 50,
      questions: newStep.type === 'test' ? testQuestions : undefined,
      maxRetries: newStep.type === 'test' ? (Number(newStep.maxRetries) || 1) : undefined
    };

    const updatedRoadmap = { ...editingRoadmap, steps: [...editingRoadmap.steps, step] };
    updateRoadmap(updatedRoadmap);
    setEditingRoadmap(updatedRoadmap);
    setNewStep({ type: 'module' });
    setTestQuestions([]);
    toast.success('Etapa adicionada!');
  };

  const partnerProviderName = currentUser.companyInfo?.name || currentUser.name;
  const partnerCourses = courses.filter(c => c.provider === partnerProviderName);

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="w-8 h-8 text-emerald-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel do Parceiro</h1>
            <p className="text-gray-500 mt-1">Gerencie seu perfil de empresa, cursos e trilhas.</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'profile' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <Building2 className="w-5 h-5" />
            Perfil da Empresa
          </button>
          <button
            onClick={() => { setActiveTab('courses'); setEditingCourse(null); setIsCreatingCourse(false); }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'courses' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <BookOpen className="w-5 h-5" />
            Meus Cursos
          </button>
          <button
            onClick={() => { setActiveTab('roadmaps'); setEditingRoadmap(null); setIsCreatingRoadmap(false); }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'roadmaps' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <ListChecks className="w-5 h-5" />
            Trilhas de Conhecimento
          </button>
          <button
            onClick={() => setActiveTab('chat')}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'chat' ? 'border-emerald-600 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            <MessageSquare className="w-5 h-5" />
            Suporte ASTER
          </button>
        </div>

        {/* CONTENT - PROFILE */}
        {activeTab === 'profile' && (
          <Card className="max-w-2xl">
            <CardHeader>
              <CardTitle>Informações da Empresa</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Nome Fantasia (Nome da Empresa ou Instituição)</Label>
                <Input value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Razão Social</Label>
                <Input value={corporateName} onChange={(e) => setCorporateName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Descrição da Empresa</Label>
                <Textarea rows={4} value={companyDesc} onChange={(e) => setCompanyDesc(e.target.value)} />
              </div>
              <Button onClick={handleUpdateProfile} className="bg-emerald-600 hover:bg-emerald-700">
                <Save className="w-4 h-4 mr-2" />
                Salvar Perfil
              </Button>
            </CardContent>
          </Card>
        )}

        {/* CONTENT - COURSES */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {!isCreatingCourse && !editingCourse && (
              <>
                <div className="flex justify-end">
                  <Button onClick={() => setIsCreatingCourse(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <PlusCircle className="w-4 h-4 mr-2" /> Novo Curso
                  </Button>
                </div>
                {partnerCourses.length === 0 ? (
                  <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed">
                    Nenhum curso cadastrado ainda.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {partnerCourses.map(course => (
                      <Card key={course.id} className="cursor-pointer hover:border-emerald-500 transition-colors">
                        <CardHeader className="pb-2" onClick={() => setEditingCourse(course)}>
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="w-fit bg-emerald-100 text-emerald-800 border-transparent">{course.area}</Badge>
                            {course.status === 'pending' && <Badge className="bg-amber-100 text-amber-700 border-transparent">Em análise</Badge>}
                            {course.status === 'approved' && <Badge className="bg-green-100 text-green-700 border-transparent">Aprovado</Badge>}
                            {course.status === 'rejected' && <Badge variant="destructive" className="border-transparent">Rejeitado</Badge>}
                          </div>
                          <CardTitle className="text-lg">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500 mb-3">{course.modules.length} Módulos</p>
                          {course.status === 'rejected' && course.rejectionReason && (
                            <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3">Motivo: {course.rejectionReason}</p>
                          )}
                          {(!course.status || course.status === 'draft' || course.status === 'rejected') && (
                            <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { submitCourseForReview(course.id); toast.success('Curso submetido para aprovação!'); }}>
                              Submeter para Aprovação
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}

            {isCreatingCourse && (
              <Card>
                <CardHeader>
                  <CardTitle>Criar Novo Curso</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título do Curso</Label>
                    <Input value={newCourse.title || ''} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Área</Label>
                      <Select onValueChange={(val: any) => setNewCourse({...newCourse, area: val})}>
                        <SelectTrigger><SelectValue placeholder="Selecione a área" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Tecnologia</SelectItem>
                          <SelectItem value="fashion">Moda</SelectItem>
                          <SelectItem value="architecture">Arquitetura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Duração (ex: 40h)</Label>
                      <Input value={newCourse.duration || ''} onChange={e => setNewCourse({...newCourse, duration: e.target.value})} />
                    </div>
                  </div>
                  <MediaInput
                    label="Imagem de Capa"
                    mediaType="image"
                    value={newCourse.imageUrl || ''}
                    onChange={url => setNewCourse({...newCourse, imageUrl: url})}
                  />
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea value={newCourse.description || ''} onChange={e => setNewCourse({...newCourse, description: e.target.value})} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreatingCourse(false)}>Cancelar</Button>
                    <Button onClick={handleSaveCourse} className="bg-emerald-600 hover:bg-emerald-700"><Save className="w-4 h-4 mr-2" /> Salvar Curso</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {editingCourse && (
              <div className="space-y-6">
                <Button variant="outline" onClick={() => setEditingCourse(null)}>Voltar para lista</Button>
                
                <Card>
                  <CardHeader>
                    <div className="flex justify-between">
                      <CardTitle>Editando: {editingCourse.title}</CardTitle>
                      <Badge className="bg-emerald-100 text-emerald-800">{editingCourse.area}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {/* Add Module Form */}
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Layers className="w-4 h-4"/> Adicionar Módulo</h3>
                        <div className="flex gap-2">
                          <Input placeholder="Título do Módulo" value={newModule.title || ''} onChange={e => setNewModule({title: e.target.value})} />
                          <Button onClick={handleAddModule} className="bg-emerald-600 hover:bg-emerald-700">Adicionar</Button>
                        </div>
                      </div>

                      {/* Modules List */}
                      <div className="space-y-4">
                        {editingCourse.modules.map(module => (
                          <div key={module.id} className="border rounded-lg p-4">
                            <h4 className="font-bold text-lg mb-3">Módulo: {module.title}</h4>
                            <p className="text-xs text-gray-500 mb-4 font-mono">ID: {module.id}</p>
                            
                            {/* Lessons List */}
                            <div className="space-y-2 mb-4 pl-4 border-l-2 border-emerald-100">
                              {module.lessons.map(lesson => (
                                <div key={lesson.id} className="bg-white border rounded p-2 flex justify-between items-center text-sm">
                                  <span>{lesson.title} ({lesson.type})</span>
                                  <Badge variant="secondary">{lesson.points} pts</Badge>
                                </div>
                              ))}
                            </div>

                            {/* Add Lesson Form */}
                            <div className="bg-white border border-emerald-100 rounded-lg p-4 shadow-sm mt-4">
                              <h5 className="font-semibold text-sm mb-3 text-emerald-700">Nova Aula / Atividade</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div>
                                  <Label className="text-xs">Título</Label>
                                  <Input size={1} className="h-8 text-sm" value={newLesson.title || ''} onChange={e => setNewLesson({...newLesson, title: e.target.value})} />
                                </div>
                                <div>
                                  <Label className="text-xs">Tipo</Label>
                                  <Select onValueChange={(val: any) => setNewLesson({...newLesson, type: val})}>
                                    <SelectTrigger className="h-8"><SelectValue placeholder="Vídeo ou Atividade" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="video">Vídeo Aula</SelectItem>
                                      <SelectItem value="activity">Atividade (Teste)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-xs">Pontos de Recompensa</Label>
                                  <Input type="number" className="h-8 text-sm" value={newLesson.points || ''} onChange={e => setNewLesson({...newLesson, points: Number(e.target.value)})} />
                                </div>
                                {newLesson.type === 'video' && (
                                  <div>
                                    <MediaInput
                                      label="Vídeo da Aula"
                                      mediaType="video"
                                      value={newLesson.contentUrl || ''}
                                      onChange={url => setNewLesson({...newLesson, contentUrl: url})}
                                      labelClassName="text-xs"
                                    />
                                  </div>
                                )}
                                {newLesson.type === 'activity' && (
                                  <div>
                                    <Label className="text-xs">Tentativas Permitidas</Label>
                                    <Input type="number" min="1" className="h-8 text-sm" placeholder="1" value={newLesson.maxRetries || ''} onChange={e => setNewLesson({...newLesson, maxRetries: Number(e.target.value)})} />
                                  </div>
                                )}
                                <div className="md:col-span-2">
                                  <Label className="text-xs">Duração</Label>
                                  <Input className="h-8 text-sm" placeholder="Ex: 15 min" value={newLesson.duration || ''} onChange={e => setNewLesson({...newLesson, duration: e.target.value})} />
                                </div>
                              </div>

                              {newLesson.type === 'activity' && (
                                <div className="border p-4 rounded-lg bg-gray-50 mb-4 mt-2">
                                  <h4 className="font-semibold mb-4 text-emerald-800 text-sm">Construtor de Perguntas (Formato Google Forms)</h4>
                                  
                                  <div className="space-y-4 mb-6">
                                    {lessonQuestions.map((q, qIndex) => (
                                      <div key={q.id} className="p-3 bg-white border rounded-lg shadow-sm relative group text-sm">
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <Button 
                                            variant="ghost" 
                                            size="sm" 
                                            className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                            onClick={() => setLessonQuestions(lessonQuestions.filter((_, i) => i !== qIndex))}
                                          >
                                            &times;
                                          </Button>
                                        </div>
                                        <p className="font-semibold text-gray-800">{qIndex + 1}. {q.question}</p>
                                        <div className="mt-2 text-xs text-gray-600 space-y-1">
                                          {q.options.map((opt: any, oIndex: number) => (
                                            <div key={oIndex} className={`flex items-center gap-2 px-2 py-1.5 rounded-md border ${q.correctOptionIndex === oIndex ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' : 'bg-gray-50 border-transparent'}`}>
                                              <div className={`w-3 h-3 rounded-full border flex items-center justify-center ${q.correctOptionIndex === oIndex ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                                                {q.correctOptionIndex === oIndex && <div className="w-1 h-1 bg-white rounded-full" />}
                                              </div>
                                              <span>{opt}</span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  <div className="bg-white p-3 border rounded-lg shadow-sm text-sm">
                                    <Label className="mb-2 block text-xs">Nova Pergunta</Label>
                                    <Input 
                                      placeholder="Digite a pergunta..." 
                                      value={newLessonQuestion.question} 
                                      onChange={e => setNewLessonQuestion({...newLessonQuestion, question: e.target.value})}
                                      className="mb-3 h-8 text-sm"
                                    />
                                    
                                    <Label className="mb-2 block text-xs">Opções (Marque a correta)</Label>
                                    <div className="space-y-2 mb-3">
                                      {newLessonQuestion.options.map((opt: any, i: number) => (
                                        <div key={i} className="flex items-center gap-2">
                                          <input 
                                            type="radio" 
                                            name={`correctLessonOption-${module.id}`} 
                                            checked={newLessonQuestion.correctOptionIndex === i} 
                                            onChange={() => setNewLessonQuestion({...newLessonQuestion, correctOptionIndex: i})}
                                            className="w-3.5 h-3.5 text-emerald-600 focus:ring-emerald-500"
                                          />
                                          <Input 
                                            placeholder={`Opção ${String.fromCharCode(65 + i)}`} 
                                            value={opt} 
                                            onChange={e => {
                                              const newOpts = [...newLessonQuestion.options];
                                              newOpts[i] = e.target.value;
                                              setNewLessonQuestion({...newLessonQuestion, options: newOpts});
                                            }}
                                            className="h-8 text-sm"
                                          />
                                        </div>
                                      ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddLessonQuestion} className="w-full text-xs h-8">
                                      Adicionar Pergunta
                                    </Button>
                                  </div>
                                </div>
                              )}

                              <Button size="sm" onClick={() => handleAddLesson(module.id)} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-3 h-3 mr-1" /> Adicionar Aula/Atividade</Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* CONTENT - ROADMAPS */}
        {activeTab === 'roadmaps' && (
          <div className="space-y-6">
            {!isCreatingRoadmap && !editingRoadmap && (
              <>
                <div className="flex justify-end">
                  <Button onClick={() => setIsCreatingRoadmap(true)} className="bg-emerald-600 hover:bg-emerald-700">
                    <PlusCircle className="w-4 h-4 mr-2" /> Nova Trilha
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {roadmaps.map(roadmap => (
                    <Card key={roadmap.id} className="cursor-pointer hover:border-emerald-500 transition-colors">
                      <CardHeader className="pb-2" onClick={() => setEditingRoadmap(roadmap)}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className="bg-emerald-100 text-emerald-800 border-transparent">{roadmap.area}</Badge>
                          {roadmap.status === 'pending' && <Badge className="bg-amber-100 text-amber-700 border-transparent">Em análise</Badge>}
                          {roadmap.status === 'approved' && <Badge className="bg-green-100 text-green-700 border-transparent">Aprovada</Badge>}
                          {roadmap.status === 'rejected' && <Badge variant="destructive" className="border-transparent">Rejeitada</Badge>}
                        </div>
                        <CardTitle className="text-lg">{roadmap.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-500 mb-3">{roadmap.steps.length} Etapas</p>
                        {roadmap.status === 'rejected' && roadmap.rejectionReason && (
                          <p className="text-xs text-red-600 bg-red-50 p-2 rounded mb-3">Motivo: {roadmap.rejectionReason}</p>
                        )}
                        {(!roadmap.status || roadmap.status === 'draft' || roadmap.status === 'rejected') && (
                          <Button size="sm" className="w-full bg-emerald-600 hover:bg-emerald-700" onClick={() => { submitRoadmapForReview(roadmap.id); toast.success('Trilha submetida para aprovação!'); }}>
                            Submeter para Aprovação
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </>
            )}

            {isCreatingRoadmap && (
              <Card>
                <CardHeader>
                  <CardTitle>Criar Nova Trilha</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Título da Trilha</Label>
                    <Input value={newRoadmap.title || ''} onChange={e => setNewRoadmap({...newRoadmap, title: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Área</Label>
                      <Select onValueChange={(val: any) => setNewRoadmap({...newRoadmap, area: val})}>
                        <SelectTrigger><SelectValue placeholder="Selecione a área" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tech">Tecnologia</SelectItem>
                          <SelectItem value="fashion">Moda</SelectItem>
                          <SelectItem value="architecture">Arquitetura</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Nível</Label>
                      <Select onValueChange={(val: string) => setNewRoadmap({...newRoadmap, level: val})}>
                        <SelectTrigger><SelectValue placeholder="Nível" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Iniciante">Iniciante</SelectItem>
                          <SelectItem value="Intermediário">Intermediário</SelectItem>
                          <SelectItem value="Avançado">Avançado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Textarea value={newRoadmap.description || ''} onChange={e => setNewRoadmap({...newRoadmap, description: e.target.value})} />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setIsCreatingRoadmap(false)}>Cancelar</Button>
                    <Button onClick={handleSaveRoadmap} className="bg-emerald-600 hover:bg-emerald-700"><Save className="w-4 h-4 mr-2" /> Salvar Trilha</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {editingRoadmap && (
              <div className="space-y-6">
                <Button variant="outline" onClick={() => setEditingRoadmap(null)}>Voltar para lista</Button>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Trilha: {editingRoadmap.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    {/* Add Step Form */}
                    <div className="bg-gray-50 p-4 rounded-lg border mb-6">
                      <h3 className="font-semibold mb-3">Adicionar Etapa</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Título da Etapa</Label>
                          <Input value={newStep.title || ''} onChange={e => setNewStep({...newStep, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select onValueChange={(val: any) => setNewStep({...newStep, type: val})}>
                            <SelectTrigger><SelectValue placeholder="Tipo de Etapa" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="module">Módulo de Curso</SelectItem>
                              <SelectItem value="lesson">Aula de Curso</SelectItem>
                              <SelectItem value="book">Livro</SelectItem>
                              <SelectItem value="article">Artigo</SelectItem>
                              <SelectItem value="file">Arquivo de Leitura</SelectItem>
                              <SelectItem value="test">Teste / Prova</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label>Pontos / XP</Label>
                          <Input type="number" value={newStep.points || ''} onChange={e => setNewStep({...newStep, points: Number(e.target.value)})} />
                        </div>

                        {(newStep.type === 'module' || newStep.type === 'lesson') && (
                          <>
                            <div className="space-y-2">
                              <Label>Curso</Label>
                              <Select onValueChange={(val: any) => setNewStep({...newStep, courseId: val, moduleId: '', lessonId: ''})}>
                                <SelectTrigger><SelectValue placeholder="Selecione o Curso" /></SelectTrigger>
                                <SelectContent>
                                  {partnerCourses.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            {newStep.courseId && (
                              <div className="space-y-2">
                                <Label>Módulo</Label>
                                <Select onValueChange={(val: any) => setNewStep({...newStep, moduleId: val, lessonId: ''})}>
                                  <SelectTrigger><SelectValue placeholder="Selecione o Módulo" /></SelectTrigger>
                                  <SelectContent>
                                    {partnerCourses.find(c => c.id === newStep.courseId)?.modules.map(m => (
                                      <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {newStep.type === 'lesson' && newStep.moduleId && (
                              <div className="space-y-2">
                                <Label>Aula / Vídeo</Label>
                                <Select onValueChange={(val: any) => setNewStep({...newStep, lessonId: val})}>
                                  <SelectTrigger><SelectValue placeholder="Selecione a Aula" /></SelectTrigger>
                                  <SelectContent>
                                    {partnerCourses.find(c => c.id === newStep.courseId)?.modules.find(m => m.id === newStep.moduleId)?.lessons.map(l => (
                                      <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </>
                        )}

                        {newStep.type === 'file' && (
                          <>
                            <div className="space-y-2">
                              <Label>Nome do Arquivo (Ex: Apostila PDF)</Label>
                              <Input placeholder="Nome do arquivo" value={newStep.fileName || ''} onChange={e => setNewStep({...newStep, fileName: e.target.value})} />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                              <MediaInput
                                label="Ficheiro"
                                mediaType="file"
                                value={newStep.url || ''}
                                onChange={url => setNewStep({...newStep, url})}
                              />
                            </div>
                          </>
                        )}
                        
                        {newStep.type === 'test' && (
                          <div className="space-y-2">
                            <Label>Tentativas Permitidas</Label>
                            <Input type="number" min="1" placeholder="1" value={newStep.maxRetries || ''} onChange={e => setNewStep({...newStep, maxRetries: Number(e.target.value)})} />
                          </div>
                        )}

                        {newStep.type === 'book' && (
                          <div className="space-y-2">
                            <Label>Autor</Label>
                            <Input value={newStep.author || ''} onChange={e => setNewStep({...newStep, author: e.target.value})} />
                          </div>
                        )}

                        {newStep.type === 'article' && (
                          <div className="space-y-2 md:col-span-2">
                            <MediaInput
                              label="URL do Artigo"
                              mediaType="any"
                              value={newStep.url || ''}
                              onChange={url => setNewStep({...newStep, url})}
                            />
                          </div>
                        )}
                        
                      </div>
                      
                      {newStep.type === 'test' && (
                        <div className="border p-4 rounded-lg bg-gray-50 mb-4">
                          <h4 className="font-semibold mb-4 text-emerald-800">Construtor de Perguntas (Formato Google Forms)</h4>
                          
                          <div className="space-y-4 mb-6">
                            {testQuestions.map((q, qIndex) => (
                              <div key={q.id} className="p-4 bg-white border rounded-lg shadow-sm relative group">
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                                    onClick={() => setTestQuestions(testQuestions.filter((_, i) => i !== qIndex))}
                                  >
                                    &times;
                                  </Button>
                                </div>
                                <p className="font-semibold text-gray-800">{qIndex + 1}. {q.question}</p>
                                <div className="mt-3 text-sm text-gray-600 space-y-2">
                                  {q.options.map((opt: any, oIndex: number) => (
                                    <div key={oIndex} className={`flex items-center gap-2 px-3 py-2 rounded-md border ${q.correctOptionIndex === oIndex ? 'bg-emerald-50 border-emerald-200 text-emerald-800 font-medium' : 'bg-gray-50 border-transparent'}`}>
                                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${q.correctOptionIndex === oIndex ? 'border-emerald-500 bg-emerald-500' : 'border-gray-300'}`}>
                                        {q.correctOptionIndex === oIndex && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                      </div>
                                      <span>{opt}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="bg-white p-3 border rounded-lg shadow-sm">
                            <Label className="mb-2 block">Nova Pergunta</Label>
                            <Input 
                              placeholder="Digite a pergunta..." 
                              value={newQuestion.question} 
                              onChange={e => setNewQuestion({...newQuestion, question: e.target.value})}
                              className="mb-3"
                            />
                            
                            <Label className="mb-2 block">Opções (Marque a correta)</Label>
                            <div className="space-y-2 mb-3">
                              {newQuestion.options.map((opt: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <input 
                                    type="radio" 
                                    name="correctOption" 
                                    checked={newQuestion.correctOptionIndex === i} 
                                    onChange={() => setNewQuestion({...newQuestion, correctOptionIndex: i})}
                                    className="w-4 h-4 text-emerald-600 focus:ring-emerald-500"
                                  />
                                  <Input 
                                    placeholder={`Opção ${String.fromCharCode(65 + i)}`} 
                                    value={opt} 
                                    onChange={e => {
                                      const newOpts = [...newQuestion.options];
                                      newOpts[i] = e.target.value;
                                      setNewQuestion({...newQuestion, options: newOpts});
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                            <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion} className="w-full">
                              Adicionar Pergunta ao Teste
                            </Button>
                          </div>
                        </div>
                      )}

                      <div className="space-y-2 mb-4">
                        <Label>Descrição Curta</Label>
                        <Textarea rows={2} value={newStep.description || ''} onChange={e => setNewStep({...newStep, description: e.target.value})} />
                      </div>
                      <Button onClick={handleAddStep} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 mr-2"/> Adicionar Etapa</Button>
                    </div>

                    {/* Steps List */}
                    <div className="space-y-3">
                      <h3 className="font-semibold">Etapas Atuais ({editingRoadmap.steps.length})</h3>
                      {editingRoadmap.steps.map((step, idx) => (
                        <div key={step.id} className="border p-3 rounded flex justify-between items-center bg-white">
                          <div className="flex items-center gap-3">
                            <div className="bg-emerald-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-emerald-800">{idx + 1}</div>
                            <div>
                              <p className="font-medium">{step.title}</p>
                              <p className="text-xs text-gray-500 uppercase">{step.type} • {step.points} pts</p>
                              {step.type === 'module' && <p className="text-[10px] text-gray-400 font-mono mt-1">Curso: {step.courseId} | Mod: {step.moduleId}</p>}
                              {step.type === 'lesson' && <p className="text-[10px] text-gray-400 font-mono mt-1">Aula: {step.lessonId}</p>}
                              {step.type === 'file' && <p className="text-[10px] text-gray-400 font-mono mt-1">Arquivo: {step.fileName}</p>}
                              {step.type === 'test' && <p className="text-[10px] text-gray-400 font-mono mt-1">{step.questions?.length} perguntas | {step.maxRetries} tentativas</p>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* CONTENT - CHAT */}
        {activeTab === 'chat' && currentUser && (
          <>
          {callState && (
            <CallModal
              partnerName="Suporte ASTER"
              partnerAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200"
              mode={callState}
              onClose={() => setCallState(null)}
            />
          )}
          <div className="max-w-4xl mx-auto h-[600px] flex flex-col bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
                PR
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">Suporte ASTER</h3>
                <p className="text-xs text-gray-500">Administração & Avaliação de Conteúdo</p>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  onClick={() => setCallState('audio')}
                >
                  <Phone className="w-4 h-4" />
                  Ligar
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="gap-1.5 text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                  onClick={() => setCallState('video')}
                >
                  <VideoIcon className="w-4 h-4" />
                  Vídeo
                </Button>
              </div>
            </div>
            
            <ScrollArea className="flex-1 p-4 bg-gray-50/50">
              <div className="space-y-4">
                {(chatMessages[currentUser.id] || []).length === 0 ? (
                  <div className="text-center text-gray-500 mt-10">
                    Nenhuma mensagem ainda. Envie uma mensagem para a administração.
                  </div>
                ) : (
                  (chatMessages[currentUser.id] || []).map((msg: any) => (
                    <div key={msg.id} className={`flex ${msg.sender === 'partner' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-xl p-3 ${
                        msg.sender === 'partner' 
                          ? 'bg-emerald-600 text-white rounded-tr-none' 
                          : 'bg-white border border-gray-200 text-gray-800 rounded-tl-none shadow-sm'
                      }`}>
                        {msg.text.includes('STATUS:') ? (
                          <div className="space-y-1">
                            {msg.text.split('\n').map((line: string, i: number) => {
                              if (line.startsWith('STATUS:')) return <div key={i} className="font-bold text-red-600 mb-2">{line}</div>;
                              if (line.startsWith('CONTEÚDO:')) return <div key={i} className="text-sm"><strong>Conteúdo:</strong> {line.replace('CONTEÚDO:', '')}</div>;
                              if (line.startsWith('DATA:')) return <div key={i} className="text-xs text-gray-400 my-1">{line.replace('DATA:', '')}</div>;
                              if (line.startsWith('MOTIVO:')) return <div key={i} className="mt-2 text-sm bg-red-50 p-2 rounded text-red-800"><strong>Feedback:</strong> {line.replace('MOTIVO:', '')}</div>;
                              return <p key={i}>{line}</p>;
                            })}
                          </div>
                        ) : (
                          <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        )}
                        <span className={`text-[10px] mt-1 block ${msg.sender === 'partner' ? 'text-emerald-100' : 'text-gray-400'}`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
            
            <div className="p-4 bg-white border-t flex gap-2">
              <Input 
                placeholder="Digite sua mensagem para a administração..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && chatInput.trim() && (sendMessageToAdmin(chatInput), setChatInput(''))}
                className="flex-1"
              />
              <Button onClick={() => {
                if (chatInput.trim()) {
                  sendMessageToAdmin(chatInput);
                  setChatInput('');
                }
              }} className="bg-emerald-600 hover:bg-emerald-700">
                <Send className="w-4 h-4 mr-2" />
                Enviar
              </Button>
            </div>
          </div>
          </>
        )}
      </div>
    </div>
  );
}
