import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import type { User } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { MediaInput } from '../components/MediaInput';
import { CourseData, Module, Lesson } from '../data/courses';
import { Roadmap, RoadmapStep } from '../data/roadmaps';
import { 
  Settings, Users, BookOpen, CheckCircle, MessageSquare, ListChecks,
  BarChart3, AlertTriangle, Eye, Send, PlayCircle, Clock, Video, ListVideo,
  PlusCircle, Save, Plus, Layers, FileText, Phone
} from 'lucide-react';
import { toast } from 'sonner';
import { CallModal } from '../components/CallModal';
import {
  XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts';

// Mock Data for the new sections
const MOCK_VALIDATIONS: any[] = [];

const MOCK_ERRORS: any[] = [];

export default function AdminDashboard() {
  const { currentUser, courses, roadmaps, posts, getAllUsers, approvePartner, rejectPartner, chatMessages, sendMessageToPartner, addCourse, updateCourse, addRoadmap, updateRoadmap, approveContent, rejectContent } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'requests' | 'chat' | 'validation' | 'analytics' | 'errors' | 'courses' | 'roadmaps'>('requests');
  const [chatPartner, setChatPartner] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [validations, setValidations] = useState(MOCK_VALIDATIONS);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  const [rejectTargetType, setRejectTargetType] = useState<'course' | 'roadmap'>('course');
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<{ type: 'course' | 'roadmap'; id: string } | null>(null);

  // Call state
  const [callState, setCallState] = useState<{ partnerId: string; mode: 'audio' | 'video' } | null>(null);

  // Course management state
  const [newCourse, setNewCourse] = useState<Partial<CourseData>>({});
  const [isCreatingCourse, setIsCreatingCourse] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseData | null>(null);
  const [newModule, setNewModule] = useState<Partial<Module>>({});
  const [newLesson, setNewLesson] = useState<Partial<Lesson>>({ type: 'video' });
  const [lessonQuestions, setLessonQuestions] = useState<any[]>([]);
  const [newLessonQuestion, setNewLessonQuestion] = useState({ question: '', options: ['', '', '', ''], correctOptionIndex: 0 });

  // Roadmap management state
  const [newRoadmap, setNewRoadmap] = useState<Partial<Roadmap>>({});
  const [isCreatingRoadmap, setIsCreatingRoadmap] = useState(false);
  const [editingRoadmap, setEditingRoadmap] = useState<Roadmap | null>(null);
  const [newStep, setNewStep] = useState<Partial<RoadmapStep>>({ type: 'module' });
  const [testQuestions, setTestQuestions] = useState<any[]>([]);
  const [newQuestion, setNewQuestion] = useState({ question: '', options: ['', '', '', ''], correctOptionIndex: 0 });

  const users = getAllUsers();
  const pendingPartners = users.filter(u => u.partnerStatus === 'pending');
  const approvedPartners = users.filter(u => u.partnerStatus === 'approved');

  // Real platform metrics
  const totalUsers = users.filter(u => u.role !== 'admin').length;
  const totalPosts = posts.length;
  const totalCourses = courses.length;
  const totalRoadmaps = roadmaps.length;
  const totalLessonsCompleted = users.reduce((acc, u) => acc + (u.completedLessons?.length ?? 0), 0);
  const avgScore = users.filter(u => u.role !== 'admin' && u.professionalScore > 0).length > 0
    ? Math.round(users.filter(u => u.role !== 'admin').reduce((acc, u) => acc + (u.professionalScore ?? 0), 0) / Math.max(users.filter(u => u.role !== 'admin').length, 1))
    : 0;

  // Area distribution
  const areaCount = users.filter(u => u.role !== 'admin').reduce((acc, u) => {
    acc[u.area] = (acc[u.area] ?? 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const areaData = [
    { name: 'Tech', value: areaCount['tech'] ?? 0 },
    { name: 'Moda', value: areaCount['fashion'] ?? 0 },
    { name: 'Arquitetura', value: areaCount['architecture'] ?? 0 },
  ];

  // Top users by score
  const topUsers = [...users]
    .filter(u => u.role !== 'admin')
    .sort((a, b) => (b.professionalScore ?? 0) - (a.professionalScore ?? 0))
    .slice(0, 5);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    } else if (currentUser.email !== 'brendacgl@outlook.com.br' && currentUser.role !== 'admin') {
      toast.error('Acesso negado. Área restrita para administradores.');
      navigate('/feed');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;
  // Ensure we only show UI if admin or brenda
  if (currentUser.email !== 'brendacgl@outlook.com.br' && currentUser.role !== 'admin') return null;

  const handleApprovePartner = (userId: string) => {
    const user = users.find(u => u.id === userId);
    approvePartner(userId);
    if (user) {
      const msg = `✅ Parabéns, ${user.name}! A sua solicitação de parceria foi APROVADA.\n\nBem-vindo(a) à ASTER como parceiro oficial. Já podes aceder ao Painel do Parceiro e começar a criar cursos e trilhas.\n\nQualquer dúvida, estamos aqui. 🚀`;
      sendMessageToPartner(userId, msg);
    }
    toast.success('Parceiro aprovado! Notificação enviada.');
  };

  const handleRejectPartner = (userId: string) => {
    const user = users.find(u => u.id === userId);
    rejectPartner(userId);
    if (user) {
      const msg = `❌ Olá, ${user.name}. Após análise, a sua solicitação de parceria não foi aprovada neste momento.\n\nContinue a interagir com a comunidade ASTER e poderás candidatar-te novamente no futuro. Obrigada pelo interesse!`;
      sendMessageToPartner(userId, msg);
    }
    toast.success('Solicitação rejeitada. Notificação enviada.');
  };

  const handleApproveContent = (type: 'course' | 'roadmap', id: string) => {
    approveContent(type, id);
    toast.success('Conteúdo aprovado e publicado na plataforma!');
  };

  const handleOpenRejectDialog = (type: 'course' | 'roadmap', id: string) => {
    setRejectTargetId(id);
    setRejectTargetType(type);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectTargetId) return;
    rejectContent(rejectTargetType, rejectTargetId, rejectReason);
    toast.success('Conteúdo rejeitado. Feedback enviado ao parceiro.');
    setIsRejectDialogOpen(false);
    setRejectTargetId(null);
  };

  const handlePreviewContent = (type: 'course' | 'roadmap', id: string) => {
    setPreviewItem({ type, id });
    setIsPreviewDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !chatPartner) return;
    sendMessageToPartner(chatPartner, chatInput);
    setChatInput('');
  };

  // --- Course Functions ---
  const handleSaveCourse = () => {
    if (!newCourse.title || !newCourse.area) return toast.error('Preencha título e área');
    const course: CourseData = {
      id: `c_${Date.now()}`,
      title: newCourse.title,
      provider: 'ASTER',
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
    toast.success('Curso criado!');
  };

  const handleAddModule = () => {
    if (!editingCourse || !newModule.title) return;
    const module: Module = { id: `m_${Date.now()}`, title: newModule.title, lessons: [] };
    const updated = { ...editingCourse, modules: [...editingCourse.modules, module] };
    updateCourse(updated);
    setEditingCourse(updated);
    setNewModule({});
    toast.success('Módulo adicionado!');
  };

  const handleAddLesson = (moduleId: string) => {
    if (!editingCourse || !newLesson.title) return;
    if (newLesson.type === 'activity' && lessonQuestions.length === 0) {
      return toast.error('Adicione ao menos uma pergunta à atividade.');
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
    const updatedModules = editingCourse.modules.map(m =>
      m.id === moduleId ? { ...m, lessons: [...m.lessons, lesson] } : m
    );
    const updated = { ...editingCourse, modules: updatedModules };
    updateCourse(updated);
    setEditingCourse(updated);
    setNewLesson({ type: 'video' });
    setLessonQuestions([]);
    toast.success('Aula adicionada!');
  };

  const handleAddLessonQuestion = () => {
    if (!newLessonQuestion.question || newLessonQuestion.options.some(o => !o.trim()))
      return toast.error('Preencha a pergunta e todas as opções.');
    setLessonQuestions([...lessonQuestions, { ...newLessonQuestion, id: `lq_${Date.now()}` }]);
    setNewLessonQuestion({ question: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  // --- Roadmap Functions ---
  const handleSaveRoadmap = () => {
    if (!newRoadmap.title || !newRoadmap.area) return toast.error('Preencha título e área');
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
    toast.success('Trilha criada!');
  };

  const handleAddQuestion = () => {
    if (!newQuestion.question || newQuestion.options.some(o => !o.trim()))
      return toast.error('Preencha a pergunta e todas as opções.');
    setTestQuestions([...testQuestions, { ...newQuestion, id: `q_${Date.now()}` }]);
    setNewQuestion({ question: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  const handleAddStep = () => {
    if (!editingRoadmap || !newStep.title) return;
    if (newStep.type === 'test' && testQuestions.length === 0)
      return toast.error('Adicione ao menos uma pergunta ao teste.');
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
    const updated = { ...editingRoadmap, steps: [...editingRoadmap.steps, step] };
    updateRoadmap(updated);
    setEditingRoadmap(updated);
    setNewStep({ type: 'module' });
    setTestQuestions([]);
    toast.success('Etapa adicionada!');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Call modal */}
      {callState && (() => {
        const partner = approvedPartners.find(u => u.id === callState.partnerId);
        return partner ? (
          <CallModal
            partnerName={partner.name}
            partnerAvatar={partner.avatar}
            mode={callState.mode}
            onClose={() => setCallState(null)}
          />
        ) : null;
      })()}
      <Navbar />

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Settings className="w-6 h-6 text-indigo-600" />
              Painel Admin
            </h2>
            <p className="text-sm text-gray-500 mt-1">Olá, Brenda</p>
          </div>
          <nav className="flex-1 p-4 space-y-1">
            <button
              onClick={() => setActiveTab('requests')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'requests' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Solicitações
              {pendingPartners.length > 0 && (
                <span className="ml-auto bg-red-100 text-red-600 py-0.5 px-2 rounded-full text-xs">
                  {pendingPartners.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('chat')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'chat' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare className="w-5 h-5" />
              Chat c/ Parceiros
            </button>
            <button
              onClick={() => setActiveTab('validation')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'validation' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <CheckCircle className="w-5 h-5" />
              Validação de Conteúdo
              {validations.length > 0 && (
                <span className="ml-auto bg-amber-100 text-amber-700 py-0.5 px-2 rounded-full text-xs">
                  {validations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'analytics' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Performances e Analytics
            </button>
            <button
              onClick={() => { setActiveTab('courses'); setEditingCourse(null); setIsCreatingCourse(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'courses' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Gerir Cursos
            </button>
            <button
              onClick={() => { setActiveTab('roadmaps'); setEditingRoadmap(null); setIsCreatingRoadmap(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'roadmaps' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <ListChecks className="w-5 h-5" />
              Gerir Trilhas
            </button>
            <button
              onClick={() => setActiveTab('errors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'errors' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              Erros da Plataforma
            </button>          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-gray-50 p-8">
          
          {/* TAB: REQUESTS */}
          {activeTab === 'requests' && (
            <div className="max-w-4xl space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Solicitações de Parceria</h1>
                <p className="text-gray-500">Analise e aprove novos produtores de conteúdo para a plataforma.</p>
              </div>

              {/* Pending */}
              <div>
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                  Pendentes ({pendingPartners.length})
                </h2>
                {pendingPartners.length === 0 ? (
                  <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
                    <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Nenhuma solicitação pendente.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingPartners.map((user: User) => (
                      <Card key={user.id}>
                        <CardContent className="p-6">
                          <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div className="flex items-center gap-4">
                              <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-14 h-14 rounded-full border object-cover" />
                              <div>
                                <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                                <p className="text-sm text-gray-500">{user.email} • {user.area}</p>
                                {user.companyInfo && (
                                  <div className="text-sm mt-1">
                                    <p><strong>Empresa:</strong> {user.companyInfo.name}</p>
                                    {user.companyInfo.corporateName && <p><strong>Razão Social:</strong> {user.companyInfo.corporateName}</p>}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0 flex-wrap">
                              <Button variant="outline" size="sm" onClick={() => navigate(`/user/${user.id}`)}>
                                <Eye className="w-4 h-4 mr-1" /> Ver Perfil
                              </Button>
                              <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleRejectPartner(user.id)}>
                                Recusar
                              </Button>
                              <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApprovePartner(user.id)}>
                                Aprovar
                              </Button>
                            </div>
                          </div>
                          {user.companyInfo?.description && (
                            <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                              <p className="text-sm text-gray-700"><strong>Justificativa:</strong> {user.companyInfo.description}</p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              {/* Approved */}
              {approvedPartners.length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                    Aprovados ({approvedPartners.length})
                  </h2>
                  <div className="space-y-3">
                    {approvedPartners.map((user: User) => (
                      <div key={user.id} className="flex items-center gap-4 bg-white border rounded-xl p-4">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email} • {user.companyInfo?.name || user.area}</p>
                        </div>
                        <Badge className="bg-green-100 text-green-700 border-transparent">Aprovado</Badge>
                        <Button size="sm" variant="outline" onClick={() => { setActiveTab('chat'); setChatPartner(user.id); }}>
                          <MessageSquare className="w-3.5 h-3.5 mr-1" /> Chat
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Rejected */}
              {users.filter(u => u.partnerStatus === 'rejected').length > 0 && (
                <div>
                  <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-400 inline-block" />
                    Rejeitados ({users.filter(u => u.partnerStatus === 'rejected').length})
                  </h2>
                  <div className="space-y-3">
                    {users.filter(u => u.partnerStatus === 'rejected').map((user: User) => (
                      <div key={user.id} className="flex items-center gap-4 bg-white border rounded-xl p-4 opacity-70">
                        <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full object-cover border" />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{user.name}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                        <Badge variant="destructive" className="border-transparent">Rejeitado</Badge>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50" onClick={() => handleApprovePartner(user.id)}>
                          Aprovar agora
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: CHAT */}
          {activeTab === 'chat' && (
            <div className="h-[calc(100vh-12rem)] bg-white rounded-xl border shadow-sm flex overflow-hidden">
              {/* Chat Sidebar */}
              <div className="w-1/3 border-r flex flex-col">
                <div className="p-4 border-b bg-gray-50">
                  <h3 className="font-semibold">Parceiros</h3>
                </div>
                <ScrollArea className="flex-1">
                  {approvedPartners.length === 0 && <p className="p-4 text-center text-gray-500 text-sm">Nenhum parceiro aprovado.</p>}
                  {approvedPartners.map((partner: User) => (
                    <button
                      key={partner.id}
                      onClick={() => setChatPartner(partner.id)}
                      className={`w-full p-4 flex items-center gap-3 text-left border-b transition-colors hover:bg-gray-50 ${chatPartner === partner.id ? 'bg-indigo-50 border-l-4 border-l-indigo-600' : ''}`}
                    >
                      <img src={partner.avatar || `https://ui-avatars.com/api/?name=${partner.name}`} alt="" className="w-10 h-10 rounded-full" />
                      <div className="flex-1 overflow-hidden">
                        <p className="font-medium text-sm truncate">{partner.name}</p>
                        <p className="text-xs text-gray-500 truncate">{partner.area}</p>
                      </div>
                    </button>
                  ))}
                  {approvedPartners.length === 0 && (
                    <div className="p-4 text-center text-sm text-gray-500">
                      Nenhum parceiro aprovado.
                    </div>
                  )}
                </ScrollArea>
              </div>
              
              {/* Chat Area */}
              <div className="flex-1 flex flex-col bg-gray-50">
                {chatPartner ? (
                  <>
                    <div className="p-4 border-b bg-white flex items-center gap-3 shadow-sm z-10">
                      {(() => {
                        const p = approvedPartners.find(u => u.id === chatPartner);
                        return p ? (
                          <>
                            <img src={p.avatar} alt={p.name} className="w-9 h-9 rounded-full object-cover" />
                            <div className="flex-1">
                              <p className="font-semibold text-sm">{p.name}</p>
                              <p className="text-xs text-gray-400">{p.area}</p>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                onClick={() => setCallState({ partnerId: chatPartner, mode: 'audio' })}
                              >
                                <Phone className="w-4 h-4" />
                                Ligar
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="gap-1.5 text-indigo-600 border-indigo-200 hover:bg-indigo-50"
                                onClick={() => setCallState({ partnerId: chatPartner, mode: 'video' })}
                              >
                                <Video className="w-4 h-4" />
                                Vídeo
                              </Button>
                            </div>
                          </>
                        ) : (
                          <h3 className="font-semibold">Chat com Parceiro</h3>
                        );
                      })()}
                    </div>
                    
                    <ScrollArea className="flex-1 p-4">
                      <div className="space-y-4">
                        {(chatMessages[chatPartner] || []).map((msg: any) => (
                          <div key={msg.id} className={`flex ${msg.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-xl p-3 ${
                              msg.sender === 'admin' 
                                ? 'bg-indigo-600 text-white rounded-tr-none' 
                                : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'
                            }`}>
                              <p className="text-sm">{msg.text}</p>
                              <span className={`text-[10px] mt-1 block ${msg.sender === 'admin' ? 'text-indigo-200' : 'text-gray-400'}`}>
                                {msg.time}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    
                    <div className="p-4 bg-white border-t">
                      <div className="flex gap-2">
                        <Input 
                          placeholder="Digite sua mensagem..." 
                          value={chatInput}
                          onChange={(e) => setChatInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={handleSendMessage}>
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                    <MessageSquare className="w-12 h-12 mb-4 opacity-50" />
                    <p>Selecione um parceiro para iniciar uma conversa</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB: VALIDATION */}
          {activeTab === 'validation' && (() => {
            const pendingCourses = courses.filter(c => c.status === 'pending');
            const pendingRoadmaps = roadmaps.filter(r => r.status === 'pending');
            const totalPending = pendingCourses.length + pendingRoadmaps.length;

            return (
              <div className="max-w-5xl space-y-6">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Verificação de Conteúdo</h1>
                  <p className="text-gray-500">Valide cursos e trilhas submetidos pelos parceiros antes de publicar.</p>
                </div>

                {totalPending === 0 ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium">Tudo limpo! Não há conteúdos pendentes para aprovação.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Pending Courses */}
                    {pendingCourses.map(course => {
                      const submitter = course.submittedBy ? users.find(u => u.id === course.submittedBy) : null;
                      const videoCount = course.modules.flatMap(m => m.lessons).filter(l => l.type === 'video' && l.contentUrl).length;
                      const date = course.submittedAt ? new Date(course.submittedAt).toLocaleDateString('pt-BR') : '—';
                      return (
                        <Card key={course.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4 flex-1 min-w-0">
                                <div className="p-3 rounded-lg flex-shrink-0 bg-purple-100 text-purple-600">
                                  <BookOpen className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <Badge variant="outline" className="border-purple-200 text-purple-700">Curso</Badge>
                                    <Badge variant="outline" className="border-gray-200 text-gray-500">{course.area}</Badge>
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{date}</span>
                                  </div>
                                  <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                                    {submitter && <span>Por: <strong>{submitter.name}</strong> ({submitter.companyInfo?.name || submitter.area})</span>}
                                    <span>{course.modules.length} módulos</span>
                                    {videoCount > 0 && <span>{videoCount} vídeo(s)</span>}
                                    <span>{course.duration}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveContent('course', course.id)}>
                                  Aprovar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleOpenRejectDialog('course', course.id)}>
                                  Recusar
                                </Button>
                                <Button size="sm" variant="ghost" className="text-indigo-600" onClick={() => handlePreviewContent('course', course.id)}>
                                  <PlayCircle className="w-4 h-4 mr-1" /> Ver
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}

                    {/* Pending Roadmaps */}
                    {pendingRoadmaps.map(roadmap => {
                      const submitter = roadmap.submittedBy ? users.find(u => u.id === roadmap.submittedBy) : null;
                      const date = roadmap.submittedAt ? new Date(roadmap.submittedAt).toLocaleDateString('pt-BR') : '—';
                      return (
                        <Card key={roadmap.id}>
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex gap-4 flex-1 min-w-0">
                                <div className="p-3 rounded-lg flex-shrink-0 bg-blue-100 text-blue-600">
                                  <ListChecks className="w-6 h-6" />
                                </div>
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <Badge variant="outline" className="border-blue-200 text-blue-700">Trilha</Badge>
                                    <Badge variant="outline" className="border-gray-200 text-gray-500">{roadmap.area}</Badge>
                                    <Badge variant="outline" className="border-gray-200 text-gray-500">{roadmap.level}</Badge>
                                    <span className="text-xs text-gray-400 flex items-center gap-1"><Clock className="w-3 h-3" />{date}</span>
                                  </div>
                                  <h3 className="font-bold text-lg text-gray-900">{roadmap.title}</h3>
                                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">{roadmap.description}</p>
                                  <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-500">
                                    {submitter && <span>Por: <strong>{submitter.name}</strong></span>}
                                    <span>{roadmap.steps.length} etapas</span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex flex-col gap-2 shrink-0">
                                <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveContent('roadmap', roadmap.id)}>
                                  Aprovar
                                </Button>
                                <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200" onClick={() => handleOpenRejectDialog('roadmap', roadmap.id)}>
                                  Recusar
                                </Button>
                                <Button size="sm" variant="ghost" className="text-indigo-600" onClick={() => handlePreviewContent('roadmap', roadmap.id)}>
                                  <PlayCircle className="w-4 h-4 mr-1" /> Ver
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance e Analytics</h1>
                <p className="text-gray-500">Dados reais da plataforma ASTER.</p>
              </div>

              {/* KPIs reais */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Utilizadores Registados</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalUsers}</h3>
                    <p className="text-xs text-gray-400 mt-2">Total na plataforma</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Posts Publicados</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalPosts}</h3>
                    <p className="text-xs text-gray-400 mt-2">Total no feed</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Parceiros Aprovados</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{approvedPartners.length}</h3>
                    <p className="text-xs text-gray-400 mt-2">{pendingPartners.length} pendente(s)</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Aulas Concluídas</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalLessonsCompleted}</h3>
                    <p className="text-xs text-gray-400 mt-2">Por todos os utilizadores</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Cursos Disponíveis</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalCourses}</h3>
                    <p className="text-xs text-gray-400 mt-2">Na plataforma</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Roadmaps Disponíveis</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{totalRoadmaps}</h3>
                    <p className="text-xs text-gray-400 mt-2">Trilhas de aprendizado</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Score Médio</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{avgScore}</h3>
                    <p className="text-xs text-gray-400 mt-2">Pontuação média dos utilizadores</p>
                  </CardContent>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Distribuição por área */}
                <Card>
                  <CardHeader>
                    <CardTitle>Utilizadores por Área</CardTitle>
                    <CardDescription>Distribuição real dos utilizadores registados</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[280px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={areaData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="value" name="Utilizadores" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* Top utilizadores por score */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Utilizadores</CardTitle>
                    <CardDescription>Maiores pontuações profissionais</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {topUsers.length === 0 ? (
                      <p className="text-gray-400 text-sm text-center py-8">Nenhum utilizador registado ainda.</p>
                    ) : (
                      <div className="space-y-3">
                        {topUsers.map((u, i) => (
                          <div key={u.id} className="flex items-center gap-3">
                            <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                            <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                              <p className="text-xs text-gray-400">{u.area}</p>
                            </div>
                            <span className="text-sm font-bold text-indigo-600">{u.professionalScore} pts</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB: COURSES */}
          {activeTab === 'courses' && (
            <div className="space-y-6">
              {!isCreatingCourse && !editingCourse && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Gerir Cursos</h1>
                      <p className="text-gray-500">Crie e edite cursos da plataforma ASTER.</p>
                    </div>
                    <Button onClick={() => setIsCreatingCourse(true)} className="bg-indigo-600 hover:bg-indigo-700">
                      <PlusCircle className="w-4 h-4 mr-2" /> Novo Curso
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {courses.map(course => (
                      <Card key={course.id} className="cursor-pointer hover:border-indigo-400 transition-colors" onClick={() => setEditingCourse(course)}>
                        <CardHeader className="pb-2">
                          <Badge className="w-fit mb-2 bg-indigo-100 text-indigo-800 border-transparent">{course.area}</Badge>
                          <CardTitle className="text-base">{course.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">{course.provider} • {course.modules.length} módulos</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {isCreatingCourse && (
                <Card className="max-w-2xl">
                  <CardHeader><CardTitle>Criar Novo Curso</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Título do Curso</Label>
                      <Input value={newCourse.title || ''} onChange={e => setNewCourse({...newCourse, title: e.target.value})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Área</Label>
                        <Select onValueChange={(val: any) => setNewCourse({...newCourse, area: val})}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                      <Button onClick={handleSaveCourse} className="bg-indigo-600 hover:bg-indigo-700"><Save className="w-4 h-4 mr-2" />Salvar Curso</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {editingCourse && (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setEditingCourse(null)}>← Voltar para lista</Button>
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>Editando: {editingCourse.title}</CardTitle>
                        <Badge className="bg-indigo-100 text-indigo-800">{editingCourse.area}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-3 flex items-center gap-2"><Layers className="w-4 h-4" /> Adicionar Módulo</h3>
                        <div className="flex gap-2">
                          <Input placeholder="Título do Módulo" value={newModule.title || ''} onChange={e => setNewModule({title: e.target.value})} />
                          <Button onClick={handleAddModule} className="bg-indigo-600 hover:bg-indigo-700">Adicionar</Button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {editingCourse.modules.map(module => (
                          <div key={module.id} className="border rounded-lg p-4">
                            <h4 className="font-bold text-lg mb-1">Módulo: {module.title}</h4>
                            <p className="text-xs text-gray-400 font-mono mb-3">ID: {module.id}</p>
                            <div className="space-y-2 mb-4 pl-4 border-l-2 border-indigo-100">
                              {module.lessons.map(lesson => (
                                <div key={lesson.id} className="bg-white border rounded p-2 flex justify-between items-center text-sm">
                                  <span>{lesson.title} ({lesson.type})</span>
                                  <Badge variant="secondary">{lesson.points} pts</Badge>
                                </div>
                              ))}
                            </div>
                            <div className="bg-white border border-indigo-100 rounded-lg p-4 shadow-sm">
                              <h5 className="font-semibold text-sm mb-3 text-indigo-700">Nova Aula / Atividade</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <div><Label className="text-xs">Título</Label><Input className="h-8 text-sm" value={newLesson.title || ''} onChange={e => setNewLesson({...newLesson, title: e.target.value})} /></div>
                                <div>
                                  <Label className="text-xs">Tipo</Label>
                                  <Select onValueChange={(val: any) => setNewLesson({...newLesson, type: val})}>
                                    <SelectTrigger className="h-8"><SelectValue placeholder="Tipo" /></SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="video">Vídeo Aula</SelectItem>
                                      <SelectItem value="activity">Atividade (Teste)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div><Label className="text-xs">Pontos</Label><Input type="number" className="h-8 text-sm" value={newLesson.points || ''} onChange={e => setNewLesson({...newLesson, points: Number(e.target.value)})} /></div>
                                <div><Label className="text-xs">Duração</Label><Input className="h-8 text-sm" placeholder="Ex: 30 min" value={newLesson.duration || ''} onChange={e => setNewLesson({...newLesson, duration: e.target.value})} /></div>
                                {newLesson.type === 'video' && (
                                  <div className="md:col-span-2">
                                    <MediaInput
                                      label="Vídeo da Aula"
                                      mediaType="video"
                                      value={newLesson.contentUrl || ''}
                                      onChange={url => setNewLesson({...newLesson, contentUrl: url})}
                                      labelClassName="text-xs"
                                    />
                                  </div>
                                )}
                                {newLesson.type === 'activity' && <div><Label className="text-xs">Tentativas Permitidas</Label><Input type="number" min="1" className="h-8 text-sm" value={newLesson.maxRetries || ''} onChange={e => setNewLesson({...newLesson, maxRetries: Number(e.target.value)})} /></div>}
                              </div>
                              {newLesson.type === 'activity' && (
                                <div className="border p-3 rounded-lg bg-gray-50 mb-3">
                                  <h4 className="font-semibold text-sm mb-3 text-indigo-800">Perguntas da Atividade</h4>
                                  <div className="space-y-2 mb-3">
                                    {lessonQuestions.map((q, qi) => (
                                      <div key={q.id} className="p-2 bg-white border rounded text-sm flex justify-between items-start">
                                        <p className="font-medium">{qi + 1}. {q.question}</p>
                                        <button onClick={() => setLessonQuestions(lessonQuestions.filter((_, i) => i !== qi))} className="text-red-400 hover:text-red-600 ml-2">&times;</button>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="bg-white p-3 border rounded">
                                    <Input className="h-8 text-sm mb-2" placeholder="Pergunta..." value={newLessonQuestion.question} onChange={e => setNewLessonQuestion({...newLessonQuestion, question: e.target.value})} />
                                    <div className="space-y-1 mb-2">
                                      {newLessonQuestion.options.map((opt, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                          <input type="radio" name={`lq-${module.id}`} checked={newLessonQuestion.correctOptionIndex === i} onChange={() => setNewLessonQuestion({...newLessonQuestion, correctOptionIndex: i})} />
                                          <Input className="h-7 text-xs" placeholder={`Opção ${String.fromCharCode(65+i)}`} value={opt} onChange={e => { const o = [...newLessonQuestion.options]; o[i] = e.target.value; setNewLessonQuestion({...newLessonQuestion, options: o}); }} />
                                        </div>
                                      ))}
                                    </div>
                                    <Button type="button" variant="outline" size="sm" onClick={handleAddLessonQuestion} className="w-full text-xs h-7">+ Adicionar Pergunta</Button>
                                  </div>
                                </div>
                              )}
                              <Button size="sm" onClick={() => handleAddLesson(module.id)} className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-3 h-3 mr-1" />Adicionar Aula</Button>
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

          {/* TAB: ROADMAPS */}
          {activeTab === 'roadmaps' && (
            <div className="space-y-6">
              {!isCreatingRoadmap && !editingRoadmap && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">Gerir Trilhas</h1>
                      <p className="text-gray-500">Crie e edite trilhas de aprendizado da plataforma.</p>
                    </div>
                    <Button onClick={() => setIsCreatingRoadmap(true)} className="bg-indigo-600 hover:bg-indigo-700">
                      <PlusCircle className="w-4 h-4 mr-2" /> Nova Trilha
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {roadmaps.map(roadmap => (
                      <Card key={roadmap.id} className="cursor-pointer hover:border-indigo-400 transition-colors" onClick={() => setEditingRoadmap(roadmap)}>
                        <CardHeader className="pb-2">
                          <div className="flex gap-2 mb-2">
                            <Badge className="bg-indigo-100 text-indigo-800 border-transparent">{roadmap.area}</Badge>
                            <Badge variant="outline">{roadmap.level}</Badge>
                          </div>
                          <CardTitle className="text-base">{roadmap.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-500">{roadmap.steps.length} etapas</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </>
              )}

              {isCreatingRoadmap && (
                <Card className="max-w-2xl">
                  <CardHeader><CardTitle>Criar Nova Trilha</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2"><Label>Título</Label><Input value={newRoadmap.title || ''} onChange={e => setNewRoadmap({...newRoadmap, title: e.target.value})} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Área</Label>
                        <Select onValueChange={(val: any) => setNewRoadmap({...newRoadmap, area: val})}>
                          <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
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
                    <div className="space-y-2"><Label>Descrição</Label><Textarea value={newRoadmap.description || ''} onChange={e => setNewRoadmap({...newRoadmap, description: e.target.value})} /></div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" onClick={() => setIsCreatingRoadmap(false)}>Cancelar</Button>
                      <Button onClick={handleSaveRoadmap} className="bg-indigo-600 hover:bg-indigo-700"><Save className="w-4 h-4 mr-2" />Salvar Trilha</Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {editingRoadmap && (
                <div className="space-y-6">
                  <Button variant="outline" onClick={() => setEditingRoadmap(null)}>← Voltar para lista</Button>
                  <Card>
                    <CardHeader><CardTitle>Trilha: {editingRoadmap.title}</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <h3 className="font-semibold mb-4">Adicionar Etapa</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2"><Label>Título da Etapa</Label><Input value={newStep.title || ''} onChange={e => setNewStep({...newStep, title: e.target.value})} /></div>
                          <div className="space-y-2">
                            <Label>Tipo</Label>
                            <Select onValueChange={(val: any) => setNewStep({...newStep, type: val})}>
                              <SelectTrigger><SelectValue placeholder="Tipo" /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="module">Módulo de Curso</SelectItem>
                                <SelectItem value="lesson">Aula de Curso</SelectItem>
                                <SelectItem value="book">Livro</SelectItem>
                                <SelectItem value="article">Artigo</SelectItem>
                                <SelectItem value="file">Arquivo</SelectItem>
                                <SelectItem value="test">Teste</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2"><Label>Pontos / XP</Label><Input type="number" value={newStep.points || ''} onChange={e => setNewStep({...newStep, points: Number(e.target.value)})} /></div>

                          {(newStep.type === 'module' || newStep.type === 'lesson') && (
                            <>
                              <div className="space-y-2">
                                <Label>Curso</Label>
                                <Select onValueChange={(val: any) => setNewStep({...newStep, courseId: val, moduleId: '', lessonId: ''})}>
                                  <SelectTrigger><SelectValue placeholder="Selecione o Curso" /></SelectTrigger>
                                  <SelectContent>
                                    {courses.map(c => <SelectItem key={c.id} value={c.id}>{c.title}</SelectItem>)}
                                  </SelectContent>
                                </Select>
                              </div>
                              {newStep.courseId && (
                                <div className="space-y-2">
                                  <Label>Módulo</Label>
                                  <Select onValueChange={(val: any) => setNewStep({...newStep, moduleId: val, lessonId: ''})}>
                                    <SelectTrigger><SelectValue placeholder="Selecione o Módulo" /></SelectTrigger>
                                    <SelectContent>
                                      {courses.find(c => c.id === newStep.courseId)?.modules.map(m => <SelectItem key={m.id} value={m.id}>{m.title}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                              {newStep.type === 'lesson' && newStep.moduleId && (
                                <div className="space-y-2">
                                  <Label>Aula</Label>
                                  <Select onValueChange={(val: any) => setNewStep({...newStep, lessonId: val})}>
                                    <SelectTrigger><SelectValue placeholder="Selecione a Aula" /></SelectTrigger>
                                    <SelectContent>
                                      {courses.find(c => c.id === newStep.courseId)?.modules.find(m => m.id === newStep.moduleId)?.lessons.map(l => <SelectItem key={l.id} value={l.id}>{l.title}</SelectItem>)}
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </>
                          )}
                          {newStep.type === 'book' && <div className="space-y-2"><Label>Autor</Label><Input value={newStep.author || ''} onChange={e => setNewStep({...newStep, author: e.target.value})} /></div>}
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
                          {newStep.type === 'file' && (
                            <div className="space-y-2 md:col-span-2">
                              <MediaInput
                                label="Ficheiro"
                                mediaType="file"
                                value={newStep.url || ''}
                                onChange={url => setNewStep({...newStep, url})}
                              />
                            </div>
                          )}
                          {newStep.type === 'test' && <div className="space-y-2"><Label>Tentativas Permitidas</Label><Input type="number" min="1" value={newStep.maxRetries || ''} onChange={e => setNewStep({...newStep, maxRetries: Number(e.target.value)})} /></div>}
                        </div>

                        {newStep.type === 'test' && (
                          <div className="border p-4 rounded-lg bg-white mb-4">
                            <h4 className="font-semibold mb-3 text-indigo-800">Perguntas do Teste</h4>
                            <div className="space-y-2 mb-3">
                              {testQuestions.map((q, qi) => (
                                <div key={q.id} className="p-2 bg-gray-50 border rounded text-sm flex justify-between">
                                  <p className="font-medium">{qi + 1}. {q.question}</p>
                                  <button onClick={() => setTestQuestions(testQuestions.filter((_, i) => i !== qi))} className="text-red-400 hover:text-red-600">&times;</button>
                                </div>
                              ))}
                            </div>
                            <div className="bg-gray-50 p-3 border rounded">
                              <Input className="mb-2" placeholder="Pergunta..." value={newQuestion.question} onChange={e => setNewQuestion({...newQuestion, question: e.target.value})} />
                              <div className="space-y-1 mb-2">
                                {newQuestion.options.map((opt, i) => (
                                  <div key={i} className="flex items-center gap-2">
                                    <input type="radio" name="adminCorrectOpt" checked={newQuestion.correctOptionIndex === i} onChange={() => setNewQuestion({...newQuestion, correctOptionIndex: i})} />
                                    <Input className="h-8 text-sm" placeholder={`Opção ${String.fromCharCode(65+i)}`} value={opt} onChange={e => { const o = [...newQuestion.options]; o[i] = e.target.value; setNewQuestion({...newQuestion, options: o}); }} />
                                  </div>
                                ))}
                              </div>
                              <Button type="button" variant="outline" size="sm" onClick={handleAddQuestion} className="w-full">+ Adicionar Pergunta</Button>
                            </div>
                          </div>
                        )}

                        <div className="space-y-2 mb-4"><Label>Descrição</Label><Textarea rows={2} value={newStep.description || ''} onChange={e => setNewStep({...newStep, description: e.target.value})} /></div>
                        <Button onClick={handleAddStep} className="bg-indigo-600 hover:bg-indigo-700"><Plus className="w-4 h-4 mr-2" />Adicionar Etapa</Button>
                      </div>

                      <div className="space-y-3">
                        <h3 className="font-semibold">Etapas ({editingRoadmap.steps.length})</h3>
                        {editingRoadmap.steps.map((step, idx) => (
                          <div key={step.id} className="border p-3 rounded flex items-center gap-3 bg-white">
                            <div className="bg-indigo-100 w-8 h-8 rounded-full flex items-center justify-center font-bold text-indigo-800 shrink-0">{idx + 1}</div>
                            <div>
                              <p className="font-medium text-sm">{step.title}</p>
                              <p className="text-xs text-gray-400 uppercase">{step.type} • {step.points} pts</p>
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

          {/* TAB: ERRORS */}
          {activeTab === 'errors' && (            <div className="max-w-4xl space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Erros da Plataforma</h1>
                <p className="text-gray-500">Monitoramento de falhas, exceções e gargalos técnicos relatados.</p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    Últimos Registros do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {MOCK_ERRORS.map(err => (
                      <div key={err.id} className="flex items-start justify-between p-4 border rounded-lg bg-white">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant={err.severity === 'high' ? 'destructive' : err.severity === 'medium' ? 'default' : 'secondary'}
                                   className={err.severity === 'medium' ? 'bg-orange-500' : ''}>
                              {err.severity.toUpperCase()}
                            </Badge>
                            <span className="font-semibold text-gray-900">{err.type}</span>
                          </div>
                          <p className="text-gray-600 text-sm">{err.message}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-gray-400 font-mono">{err.time}</span>
                          <div className="mt-2">
                            <Button variant="outline" size="sm" className="h-8 text-xs">Ver Detalhes</Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Dialogs */}
          <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Recusar Conteúdo</DialogTitle>
                <DialogDescription>Forneça um feedback construtivo. O parceiro receberá esta mensagem no chat.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="reason">Motivo da Recusa</Label>
                <Textarea id="reason" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Ex: O áudio está muito baixo na aula 2, a descrição está incompleta..." className="mt-2 h-32" />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleConfirmReject} disabled={!rejectReason.trim()}>Confirmar Recusa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isPreviewDialogOpen} onOpenChange={(o) => { setIsPreviewDialogOpen(o); if (!o) setPreviewItem(null); }}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Pré-visualização</DialogTitle>
                {previewItem && (
                  <DialogDescription>
                    {previewItem.type === 'course' ? courses.find(c => c.id === previewItem.id)?.title : roadmaps.find(r => r.id === previewItem.id)?.title}
                  </DialogDescription>
                )}
              </DialogHeader>
              <ScrollArea className="max-h-[70vh] mt-2 pr-2">
                {previewItem?.type === 'course' && (() => {
                  const course = courses.find(c => c.id === previewItem.id);
                  if (!course) return null;
                  return (
                    <div className="space-y-5">
                      {course.imageUrl && <img src={course.imageUrl} alt={course.title} className="w-full h-40 object-cover rounded-lg" />}
                      <p className="text-sm text-gray-600">{course.description}</p>
                      {course.modules.map((mod, mi) => (
                        <div key={mod.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-2 font-semibold text-sm text-gray-700 border-b">Módulo {mi + 1}: {mod.title}</div>
                          <div className="divide-y">
                            {mod.lessons.map((lesson, li) => (
                              <div key={lesson.id} className="p-4 space-y-3">
                                <div className="flex items-center gap-2">
                                  {lesson.type === 'video' ? <Video className="w-4 h-4 text-blue-500 shrink-0" /> : <CheckCircle className="w-4 h-4 text-purple-500 shrink-0" />}
                                  <span className="font-medium text-sm">{li + 1}. {lesson.title}</span>
                                  <span className="text-xs text-gray-400 ml-auto">{lesson.duration} • {lesson.points} pts</span>
                                </div>
                                {lesson.description && <p className="text-xs text-gray-500 pl-6">{lesson.description}</p>}
                                {lesson.type === 'video' && lesson.contentUrl && (
                                  <div className="pl-6">
                                    {lesson.contentUrl.includes('youtube.com') || lesson.contentUrl.includes('youtu.be') ? (
                                      <div className="aspect-video rounded overflow-hidden border">
                                        <iframe src={lesson.contentUrl.replace('watch?v=', 'embed/')} className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                                      </div>
                                    ) : (
                                      <video src={lesson.contentUrl} controls className="w-full rounded border max-h-48" />
                                    )}
                                  </div>
                                )}
                                {lesson.type === 'activity' && lesson.questions && lesson.questions.length > 0 && (
                                  <div className="pl-6 space-y-2">
                                    {lesson.questions.map((q: any, qi: number) => (
                                      <div key={qi} className="bg-gray-50 rounded p-2 text-xs">
                                        <p className="font-medium mb-1">{qi + 1}. {q.question}</p>
                                        <div className="space-y-0.5">
                                          {q.options.map((opt: string, oi: number) => (
                                            <p key={oi} className={oi === q.correctOptionIndex ? 'text-green-700 font-medium' : 'text-gray-500'}>{oi === q.correctOptionIndex ? '✓' : '○'} {opt}</p>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
                {previewItem?.type === 'roadmap' && (() => {
                  const roadmap = roadmaps.find(r => r.id === previewItem.id);
                  if (!roadmap) return null;
                  return (
                    <div className="space-y-4">
                      <p className="text-sm text-gray-600">{roadmap.description}</p>
                      <div className="space-y-3">
                        {roadmap.steps.map((step, idx) => {
                          const linkedCourse = step.courseId ? courses.find(c => c.id === step.courseId) : null;
                          const linkedModule = linkedCourse?.modules.find(m => m.id === step.moduleId);
                          const linkedLesson = linkedModule?.lessons.find(l => l.id === step.lessonId);
                          return (
                            <div key={step.id} className="border rounded-lg p-4 space-y-2">
                              <div className="flex items-center gap-3">
                                <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">{idx + 1}</div>
                                <div className="flex-1">
                                  <p className="font-medium text-sm">{step.title}</p>
                                  <p className="text-xs text-gray-400 uppercase">{step.type} • {step.points} pts</p>
                                </div>
                              </div>
                              {step.description && <p className="text-xs text-gray-500 pl-10">{step.description}</p>}
                              {linkedCourse && (
                                <div className="pl-10 text-xs text-indigo-600 bg-indigo-50 rounded p-2">
                                  Curso: {linkedCourse.title}{linkedModule ? ` › ${linkedModule.title}` : ''}{linkedLesson ? ` › ${linkedLesson.title}` : ''}
                                </div>
                              )}
                              {step.url && (
                                <div className="pl-10">
                                  <a href={step.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-600 underline flex items-center gap-1">
                                    <FileText className="w-3 h-3" /> {step.type === 'file' ? 'Abrir ficheiro' : step.url}
                                  </a>
                                </div>
                              )}
                              {step.type === 'test' && step.questions && step.questions.length > 0 && (
                                <div className="pl-10 space-y-2">
                                  {step.questions.map((q: any, qi: number) => (
                                    <div key={qi} className="bg-gray-50 rounded p-2 text-xs">
                                      <p className="font-medium mb-1">{qi + 1}. {q.question}</p>
                                      <div className="space-y-0.5">
                                        {q.options.map((opt: string, oi: number) => (
                                          <p key={oi} className={oi === q.correctOptionIndex ? 'text-green-700 font-medium' : 'text-gray-500'}>{oi === q.correctOptionIndex ? '✓' : '○'} {opt}</p>
                                        ))}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })()}
              </ScrollArea>
              <DialogFooter className="mt-4 flex gap-2">
                {previewItem && (
                  <>
                    <Button variant="outline" onClick={() => setIsPreviewDialogOpen(false)}>Fechar</Button>
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={() => { setIsPreviewDialogOpen(false); handleOpenRejectDialog(previewItem.type, previewItem.id); }}>Recusar</Button>
                    <Button className="bg-green-600 hover:bg-green-700" onClick={() => { handleApproveContent(previewItem.type, previewItem.id); setIsPreviewDialogOpen(false); }}>Aprovar</Button>
                  </>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </main>
      </div>
    </div>
  );
}
