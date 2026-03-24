import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ScrollArea } from '../components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { 
  Settings, Users, BookOpen, CheckCircle, XCircle, MessageSquare, 
  BarChart3, AlertTriangle, Eye, Send, PlayCircle, Clock, Video, ListVideo
} from 'lucide-react';
import { toast } from 'sonner';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, Legend
} from 'recharts';

// Mock Data for the new sections
const MOCK_MESSAGES: Record<string, any[]> = {};

const MOCK_VALIDATIONS: any[] = [];

const MOCK_ERRORS: any[] = [];

const ANALYTICS_DATA = [
  { name: 'Jan', users: 400, courses: 24, revenue: 2400 },
  { name: 'Fev', users: 800, courses: 35, revenue: 4500 },
  { name: 'Mar', users: 1200, courses: 42, revenue: 6800 },
  { name: 'Abr', users: 1600, courses: 58, revenue: 9200 },
  { name: 'Mai', users: 2100, courses: 70, revenue: 12500 },
  { name: 'Jun', users: 2800, courses: 85, revenue: 16000 },
];

export default function AdminDashboard() {
  const { currentUser, courses, roadmaps, getAllUsers, approvePartner, rejectPartner, chatMessages, sendMessageToPartner } = useApp();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState<'requests' | 'chat' | 'validation' | 'analytics' | 'errors'>('requests');
  const [chatPartner, setChatPartner] = useState<string | null>(null);
  const [chatInput, setChatInput] = useState('');
  const [validations, setValidations] = useState(MOCK_VALIDATIONS);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectTargetId, setRejectTargetId] = useState<string | null>(null);
  
  const [isPreviewDialogOpen, setIsPreviewDialogOpen] = useState(false);
  const [previewTargetId, setPreviewTargetId] = useState<string | null>(null);

  const users = getAllUsers();
  const pendingPartners = users.filter(u => u.partnerStatus === 'pending');
  const approvedPartners = users.filter(u => u.partnerStatus === 'approved');

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
    approvePartner(userId);
    toast.success('Parceiro aprovado com sucesso!');
  };

  const handleRejectPartner = (userId: string) => {
    rejectPartner(userId);
    toast.success('Solicitação de parceiro rejeitada.');
  };

  const handleApproveContent = (id: string) => {
    setValidations(prev => prev.filter(v => v.id !== id));
    toast.success('Conteúdo aprovado e publicado na plataforma!');
  };

  const handleOpenRejectDialog = (id: string) => {
    setRejectTargetId(id);
    setRejectReason('');
    setIsRejectDialogOpen(true);
  };

  const handleConfirmReject = () => {
    if (!rejectTargetId) return;
    
    const content = validations.find(v => v.id === rejectTargetId);
    if (content) {
      setValidations(prev => prev.filter(v => v.id !== rejectTargetId));
      
      const dateStr = new Date().toLocaleDateString('pt-BR');
      const text = `STATUS: Recusado\nCONTEÚDO: ${content.title}\nDATA: ${dateStr}\nMOTIVO: ${rejectReason}`;
      
      sendMessageToPartner(content.partnerId, text);

      toast.success('Conteúdo rejeitado e feedback enviado ao parceiro.');
    }
    
    setIsRejectDialogOpen(false);
    setRejectTargetId(null);
  };

  const handlePreviewContent = (id: string) => {
    setPreviewTargetId(id);
    setIsPreviewDialogOpen(true);
  };

  const handleSendMessage = () => {
    if (!chatInput.trim() || !chatPartner) return;
    sendMessageToPartner(chatPartner, chatInput);
    setChatInput('');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
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
              onClick={() => setActiveTab('errors')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'errors' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <AlertTriangle className="w-5 h-5" />
              Erros da Plataforma
            </button>
          </nav>
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

              {pendingPartners.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                  <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Nenhuma solicitação pendente no momento.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingPartners.map(user => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                          <div className="flex items-center gap-4">
                            <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt={user.name} className="w-14 h-14 rounded-full border" />
                            <div>
                              <h3 className="font-bold text-lg text-gray-900">{user.name}</h3>
                              <p className="text-sm text-gray-500">{user.email} • {user.area}</p>
                              {user.companyInfo && (
                                <p className="text-sm mt-1"><strong>Empresa:</strong> {user.companyInfo.name}</p>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                            <Button variant="outline" onClick={() => navigate(`/user/${user.id}`)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver Perfil
                            </Button>
                            <Button variant="outline" className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200" onClick={() => handleRejectPartner(user.id)}>
                              Recusar
                            </Button>
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApprovePartner(user.id)}>
                              Aprovar
                            </Button>
                          </div>
                        </div>
                        {user.companyInfo?.description && (
                          <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-700"><strong>Justificativa/Descrição:</strong> {user.companyInfo.description}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
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
                  {approvedPartners.map(partner => (
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
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <h3 className="font-semibold">Chat com Parceiro</h3>
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
          {activeTab === 'validation' && (
            <div className="max-w-5xl space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Verificação de Conteúdo</h1>
                <p className="text-gray-500">Valide trilhas de aprendizado e uploads de vídeos antes de publicá-los.</p>
              </div>

              {validations.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-xl border border-dashed border-gray-300">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">Tudo limpo! Não há conteúdos pendentes para aprovação.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {validations.map(val => (
                    <Card key={val.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex gap-4">
                            <div className={`p-3 rounded-lg flex-shrink-0 ${val.type === 'course' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                              {val.type === 'course' ? <BookOpen className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className={val.type === 'course' ? 'border-purple-200 text-purple-700' : 'border-blue-200 text-blue-700'}>
                                  {val.type === 'course' ? 'Nova Trilha' : 'Upload de Vídeo'}
                                </Badge>
                                <span className="text-xs text-gray-500 flex items-center gap-1">
                                  <Clock className="w-3 h-3" /> {val.date}
                                </span>
                              </div>
                              <h3 className="font-bold text-lg text-gray-900">{val.title}</h3>
                              <p className="text-sm text-gray-600 mt-1">{val.description}</p>
                              <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
                                <span>Por: <strong>{val.partnerName}</strong></span>
                                {val.videos > 0 && <span>Vídeos anexados: {val.videos}</span>}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex flex-col gap-2">
                            <Button className="bg-green-600 hover:bg-green-700" onClick={() => handleApproveContent(val.id)}>
                              Aprovar Publicação
                            </Button>
                            <Button variant="outline" className="text-red-600 hover:bg-red-50" onClick={() => handleOpenRejectDialog(val.id)}>
                              Recusar com Observação
                            </Button>
                            <Button variant="ghost" className="text-indigo-600 hover:text-indigo-800" onClick={() => handlePreviewContent(val.id)}>
                              <PlayCircle className="w-4 h-4 mr-2" /> Pré-visualizar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: ANALYTICS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Performance e Analytics</h1>
                <p className="text-gray-500">Acompanhamento de usuários, crescimento e métricas gerais.</p>
              </div>

              {/* KPIS */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Usuários Ativos (Mensal)</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">2.8k</h3>
                    <p className="text-xs text-green-600 flex items-center mt-2">+12% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Trilhas Concluídas</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">1.245</h3>
                    <p className="text-xs text-green-600 flex items-center mt-2">+5% em relação ao mês anterior</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Parceiros Ativos</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">{approvedPartners.length > 0 ? approvedPartners.length : '18'}</h3>
                    <p className="text-xs text-green-600 flex items-center mt-2">+2 novos este mês</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <p className="text-sm text-gray-500 font-medium">Tempo Médio na Plataforma</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-2">42 min</h3>
                    <p className="text-xs text-gray-500 flex items-center mt-2">Estável</p>
                  </CardContent>
                </Card>
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Crescimento de Usuários</CardTitle>
                    <CardDescription>Novos cadastros nos últimos 6 meses</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={ANALYTICS_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <Line type="monotone" dataKey="users" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                        <RechartsTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Criação de Trilhas</CardTitle>
                    <CardDescription>Trilhas publicadas por parceiros</CardDescription>
                  </CardHeader>
                  <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ANALYTICS_DATA} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                        <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                        <RechartsTooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        <Bar dataKey="courses" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={30} />
                      </BarChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* TAB: ERRORS */}
          {activeTab === 'errors' && (
            <div className="max-w-4xl space-y-6">
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
                <DialogDescription>
                  Forneça um feedback construtivo. O parceiro receberá esta mensagem no chat.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <Label htmlFor="reason">Motivo da Recusa</Label>
                <Textarea 
                  id="reason" 
                  value={rejectReason} 
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex: O áudio está muito baixo na aula 2..."
                  className="mt-2 h-32"
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleConfirmReject} disabled={!rejectReason.trim()}>
                  Confirmar Recusa
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isPreviewDialogOpen} onOpenChange={setIsPreviewDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Pré-visualização do Conteúdo</DialogTitle>
                <DialogDescription>
                  {validations.find(v => v.id === previewTargetId)?.title}
                </DialogDescription>
              </DialogHeader>
              <ScrollArea className="max-h-[60vh] mt-4 pr-4">
                <div className="space-y-4">
                  {validations.find(v => v.id === previewTargetId)?.previewSteps?.map((step, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 border rounded-lg bg-gray-50">
                      <div className="bg-white p-2 rounded shadow-sm border">
                        {step.type.includes('Vídeo') ? <Video className="w-5 h-5 text-blue-500" /> : <ListVideo className="w-5 h-5 text-purple-500" />}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">{index + 1}. {step.title}</h4>
                        <p className="text-sm text-gray-500">{step.type}</p>
                      </div>
                    </div>
                  ))}
                  {(!validations.find(v => v.id === previewTargetId)?.previewSteps || validations.find(v => v.id === previewTargetId)?.previewSteps?.length === 0) && (
                    <p className="text-gray-500 text-center py-8">Nenhum conteúdo detalhado disponível para esta submissão.</p>
                  )}
                </div>
              </ScrollArea>
              <DialogFooter className="mt-4">
                <Button onClick={() => setIsPreviewDialogOpen(false)}>Fechar Pré-visualização</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

        </main>
      </div>
    </div>
  );
}
