import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import type { PartnerShowcaseItem, PartnerCampaign } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { ScrollArea } from '../components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import {
  Building2, BarChart3, Users, Megaphone, MessageSquare, Send,
  Plus, Trash2, Edit, Eye, MousePointerClick, TrendingUp, Star,
  Briefcase, BookOpen, GraduationCap, Calendar, Link as LinkIcon,
  CheckCircle, Clock, XCircle, Save, X, Award, Handshake
} from 'lucide-react';

type Tab = 'overview' | 'showcase' | 'analytics' | 'leads' | 'campaigns' | 'affiliate' | 'courses' | 'chat';

const SHOWCASE_TYPES = [
  { value: 'service', label: 'Serviço', icon: Briefcase },
  { value: 'product', label: 'Produto', icon: Star },
  { value: 'course', label: 'Curso', icon: BookOpen },
  { value: 'mentorship', label: 'Mentoria', icon: GraduationCap },
  { value: 'job', label: 'Vaga', icon: Users },
  { value: 'program', label: 'Programa', icon: Award },
  { value: 'event', label: 'Evento', icon: Calendar },
];

const CAMPAIGN_TYPES = [
  { value: 'highlight', label: 'Destaque na Home' },
  { value: 'newsletter', label: 'Newsletter' },
  { value: 'notification', label: 'Notificação Interna' },
  { value: 'seasonal', label: 'Campanha Sazonal' },
];

const emptyShowcase: Omit<PartnerShowcaseItem, 'id' | 'partnerId' | 'views' | 'clicks' | 'createdAt'> = {
  type: 'service', title: '', description: '', image: '', link: '', price: '', tags: [],
};

const emptyCampaign: Omit<PartnerCampaign, 'id' | 'partnerId' | 'impressions' | 'clicks' | 'leads' | 'createdAt'> = {
  title: '', description: '', type: 'highlight', status: 'draft', startDate: '', endDate: '',
};

export default function PartnerDashboard() {
  const navigate = useNavigate();
  const {
    currentUser, updateProfile, chatMessages, sendMessageToAdmin,
    showcaseItems, addShowcaseItem, updateShowcaseItem, deleteShowcaseItem,
    partnerLeads, updateLeadStatus,
    partnerCampaigns, addCampaign, updateCampaign, deleteCampaign,
    courses, roadmaps,
  } = useApp();

  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [chatInput, setChatInput] = useState('');

  // Company profile
  const [companyName, setCompanyName] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [companyDesc, setCompanyDesc] = useState('');

  // Showcase
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [scForm, setScForm] = useState(emptyShowcase);
  const [tagsInput, setTagsInput] = useState('');

  // Campaigns
  const [showCampForm, setShowCampForm] = useState(false);
  const [campForm, setCampForm] = useState(emptyCampaign);

  useEffect(() => {
    if (!currentUser) { navigate('/login'); return; }
    if (currentUser.role !== 'partner' || currentUser.partnerStatus !== 'approved') {
      toast.error('Acesso negado.'); navigate('/feed');
    } else {
      setCompanyName(currentUser.companyInfo?.name || '');
      setCorporateName(currentUser.companyInfo?.corporateName || '');
      setCompanyDesc(currentUser.companyInfo?.description || '');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'partner' || currentUser.partnerStatus !== 'approved') return null;

  const myShowcase = showcaseItems.filter(i => i.partnerId === currentUser.id);
  const myLeads = partnerLeads.filter(l => l.partnerId === currentUser.id);
  const myCampaigns = partnerCampaigns.filter(c => c.partnerId === currentUser.id);
  const myMessages = chatMessages[currentUser.id] || [];
  const partnerCourses = courses.filter(c => c.provider === (currentUser.companyInfo?.name || currentUser.name));

  // Analytics totals
  const totalViews = myShowcase.reduce((a, i) => a + i.views, 0);
  const totalClicks = myShowcase.reduce((a, i) => a + i.clicks, 0);
  const totalLeads = myLeads.length;
  const converted = myLeads.filter(l => l.status === 'converted').length;
  const convRate = totalLeads > 0 ? Math.round((converted / totalLeads) * 100) : 0;

  const handleSaveProfile = () => {
    updateProfile({ companyInfo: { name: companyName, corporateName, description: companyDesc } });
    toast.success('Perfil atualizado!');
  };

  const handleSaveShowcase = () => {
    if (!scForm.title.trim()) return toast.error('Título obrigatório');
    const data = { ...scForm, tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean) };
    if (editingId) { updateShowcaseItem(editingId, data); toast.success('Item atualizado!'); }
    else { addShowcaseItem(data); toast.success('Item adicionado à vitrine!'); }
    setShowForm(false); setEditingId(null); setScForm(emptyShowcase); setTagsInput('');
  };

  const openEditShowcase = (item: PartnerShowcaseItem) => {
    setScForm({ type: item.type, title: item.title, description: item.description, image: item.image, link: item.link, price: item.price, tags: item.tags });
    setTagsInput(item.tags.join(', '));
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleSaveCampaign = () => {
    if (!campForm.title.trim()) return toast.error('Título obrigatório');
    addCampaign(campForm);
    toast.success('Campanha criada!');
    setShowCampForm(false); setCampForm(emptyCampaign);
  };

  const navItems: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Visão Geral', icon: BarChart3 },
    { id: 'showcase', label: 'Vitrine', icon: Building2 },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'campaigns', label: 'Campanhas', icon: Megaphone },
    { id: 'affiliate', label: 'Afiliados', icon: Handshake },
    { id: 'courses', label: 'Cursos & Trilhas', icon: BookOpen },
    { id: 'chat', label: 'Suporte ASTER', icon: MessageSquare },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
            <Building2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Painel do Parceiro</h1>
            <p className="text-gray-500 text-sm">{currentUser.companyInfo?.name || currentUser.name}</p>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Sidebar nav */}
          <aside className="w-56 shrink-0">
            <nav className="space-y-1 bg-white rounded-xl border p-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === item.id ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                  {item.id === 'leads' && myLeads.filter(l => l.status === 'new').length > 0 && (
                    <span className="ml-auto bg-red-100 text-red-600 text-xs px-1.5 py-0.5 rounded-full">
                      {myLeads.filter(l => l.status === 'new').length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <main className="flex-1 min-w-0">

            {/* OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Visualizações', value: totalViews, icon: Eye, color: 'text-blue-600 bg-blue-50' },
                    { label: 'Cliques', value: totalClicks, icon: MousePointerClick, color: 'text-purple-600 bg-purple-50' },
                    { label: 'Leads', value: totalLeads, icon: Users, color: 'text-emerald-600 bg-emerald-50' },
                    { label: 'Conversão', value: `${convRate}%`, icon: TrendingUp, color: 'text-orange-600 bg-orange-50' },
                  ].map(stat => (
                    <Card key={stat.label}>
                      <CardContent className="pt-5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-gray-500">{stat.label}</p>
                            <p className="text-2xl font-bold mt-1">{stat.value}</p>
                          </div>
                          <div className={`p-3 rounded-xl ${stat.color}`}>
                            <stat.icon className="w-5 h-5" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Company profile quick edit */}
                <Card>
                  <CardHeader><CardTitle>Perfil da Empresa</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div><Label>Nome Fantasia</Label><Input className="mt-1" value={companyName} onChange={e => setCompanyName(e.target.value)} /></div>
                      <div><Label>Razão Social</Label><Input className="mt-1" value={corporateName} onChange={e => setCorporateName(e.target.value)} /></div>
                    </div>
                    <div><Label>Descrição</Label><Textarea className="mt-1" rows={3} value={companyDesc} onChange={e => setCompanyDesc(e.target.value)} /></div>
                    <Button onClick={handleSaveProfile} className="bg-emerald-600 hover:bg-emerald-700"><Save className="w-4 h-4 mr-2" />Salvar</Button>
                  </CardContent>
                </Card>

                {/* Quick actions */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Adicionar à Vitrine', icon: Plus, tab: 'showcase' as Tab },
                    { label: 'Ver Leads', icon: Users, tab: 'leads' as Tab },
                    { label: 'Nova Campanha', icon: Megaphone, tab: 'campaigns' as Tab },
                    { label: 'Suporte', icon: MessageSquare, tab: 'chat' as Tab },
                  ].map(a => (
                    <button key={a.label} onClick={() => setActiveTab(a.tab)}
                      className="flex flex-col items-center gap-2 p-4 bg-white border rounded-xl hover:border-emerald-400 hover:bg-emerald-50 transition-colors text-sm font-medium text-gray-700">
                      <a.icon className="w-5 h-5 text-emerald-600" />{a.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SHOWCASE */}
            {activeTab === 'showcase' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-lg font-bold">Vitrine</h2><p className="text-sm text-gray-500">Apresente seus serviços, produtos, vagas e programas.</p></div>
                  <Button onClick={() => { setShowForm(true); setEditingId(null); setScForm(emptyShowcase); setTagsInput(''); }} className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="w-4 h-4 mr-2" /> Adicionar
                  </Button>
                </div>

                {showForm && (
                  <Card className="border-emerald-200">
                    <CardHeader><CardTitle className="text-base">{editingId ? 'Editar Item' : 'Novo Item'}</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label>Tipo</Label>
                          <Select value={scForm.type} onValueChange={v => setScForm(f => ({ ...f, type: v as any }))}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>{SHOWCASE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                        <div><Label>Título *</Label><Input className="mt-1" value={scForm.title} onChange={e => setScForm(f => ({ ...f, title: e.target.value }))} /></div>
                      </div>
                      <div><Label>Descrição</Label><Textarea className="mt-1" rows={3} value={scForm.description} onChange={e => setScForm(f => ({ ...f, description: e.target.value }))} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Link (URL)</Label><Input className="mt-1" placeholder="https://..." value={scForm.link} onChange={e => setScForm(f => ({ ...f, link: e.target.value }))} /></div>
                        <div><Label>Preço / Investimento</Label><Input className="mt-1" placeholder="Ex: R$ 1.200 ou Gratuito" value={scForm.price} onChange={e => setScForm(f => ({ ...f, price: e.target.value }))} /></div>
                      </div>
                      <div><Label>Tags (separadas por vírgula)</Label><Input className="mt-1" value={tagsInput} onChange={e => setTagsInput(e.target.value)} /></div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancelar</Button>
                        <Button onClick={handleSaveShowcase} className="bg-emerald-600 hover:bg-emerald-700"><Save className="w-4 h-4 mr-2" />Salvar</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {myShowcase.length === 0 && !showForm && (
                  <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed">
                    <Building2 className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Sua vitrine está vazia. Adicione seus serviços, produtos e oportunidades.</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myShowcase.map(item => {
                    const typeInfo = SHOWCASE_TYPES.find(t => t.value === item.type);
                    return (
                      <Card key={item.id} className="hover:shadow-md transition-shadow">
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {typeInfo && <typeInfo.icon className="w-4 h-4 text-emerald-600 shrink-0" />}
                              <div>
                                <p className="font-semibold text-sm">{item.title}</p>
                                <Badge variant="outline" className="text-xs mt-0.5">{typeInfo?.label}</Badge>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={() => openEditShowcase(item)}><Edit className="w-3.5 h-3.5" /></Button>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-red-500" onClick={() => deleteShowcaseItem(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                          {item.description && <p className="text-xs text-gray-500 mt-2 line-clamp-2">{item.description}</p>}
                          {item.price && <p className="text-sm font-medium text-emerald-700 mt-1">{item.price}</p>}
                          {item.tags.length > 0 && <div className="flex flex-wrap gap-1 mt-2">{item.tags.map(t => <span key={t} className="text-xs bg-gray-100 px-2 py-0.5 rounded-full">{t}</span>)}</div>}
                          <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                            <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{item.views}</span>
                            <span className="flex items-center gap-1"><MousePointerClick className="w-3 h-3" />{item.clicks}</span>
                            {item.link && <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-500 hover:underline ml-auto"><LinkIcon className="w-3 h-3" />Ver</a>}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ANALYTICS */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <h2 className="text-lg font-bold">Analytics</h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Visualizações Totais', value: totalViews, icon: Eye, desc: 'Itens da vitrine' },
                    { label: 'Cliques Totais', value: totalClicks, icon: MousePointerClick, desc: 'Links acessados' },
                    { label: 'Leads Gerados', value: totalLeads, icon: Users, desc: 'Contatos qualificados' },
                    { label: 'Taxa de Conversão', value: `${convRate}%`, icon: TrendingUp, desc: 'Leads convertidos' },
                  ].map(s => (
                    <Card key={s.label}>
                      <CardContent className="pt-5">
                        <s.icon className="w-5 h-5 text-emerald-600 mb-2" />
                        <p className="text-2xl font-bold">{s.value}</p>
                        <p className="text-sm font-medium mt-0.5">{s.label}</p>
                        <p className="text-xs text-gray-400">{s.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader><CardTitle>Performance por Item da Vitrine</CardTitle></CardHeader>
                  <CardContent>
                    {myShowcase.length === 0 ? (
                      <p className="text-gray-400 text-sm">Nenhum item na vitrine ainda.</p>
                    ) : (
                      <div className="space-y-3">
                        {myShowcase.map(item => {
                          const ctr = item.views > 0 ? Math.round((item.clicks / item.views) * 100) : 0;
                          return (
                            <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{item.title}</p>
                                <p className="text-xs text-gray-400">{SHOWCASE_TYPES.find(t => t.value === item.type)?.label}</p>
                              </div>
                              <div className="flex items-center gap-6 text-sm shrink-0">
                                <span className="flex items-center gap-1 text-gray-500"><Eye className="w-3.5 h-3.5" />{item.views}</span>
                                <span className="flex items-center gap-1 text-gray-500"><MousePointerClick className="w-3.5 h-3.5" />{item.clicks}</span>
                                <Badge variant="outline" className="text-xs">CTR {ctr}%</Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader><CardTitle>Cursos & Trilhas</CardTitle><CardDescription>Performance do seu conteúdo educacional</CardDescription></CardHeader>
                  <CardContent>
                    {partnerCourses.length === 0 ? (
                      <p className="text-gray-400 text-sm">Nenhum curso publicado ainda.</p>
                    ) : (
                      <div className="space-y-2">
                        {partnerCourses.map(c => (
                          <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium text-sm">{c.title}</p>
                              <p className="text-xs text-gray-400">{c.modules.length} módulos · {c.duration}</p>
                            </div>
                            <Badge className={c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}>
                              {c.status === 'approved' ? 'Publicado' : c.status === 'pending' ? 'Em análise' : 'Rascunho'}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* LEADS */}
            {activeTab === 'leads' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold">Leads Qualificados</h2>
                    <p className="text-sm text-gray-500">Usuários com interesse real no seu conteúdo.</p>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <Badge className="bg-red-100 text-red-700">{myLeads.filter(l => l.status === 'new').length} novos</Badge>
                    <Badge className="bg-blue-100 text-blue-700">{myLeads.filter(l => l.status === 'contacted').length} contatados</Badge>
                    <Badge className="bg-green-100 text-green-700">{myLeads.filter(l => l.status === 'converted').length} convertidos</Badge>
                  </div>
                </div>

                {myLeads.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed">
                    <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Nenhum lead ainda. Adicione itens à vitrine para começar a receber leads.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myLeads.map(lead => (
                      <Card key={lead.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold text-sm">{lead.userName}</p>
                                <Badge variant="outline" className="text-xs">{lead.userArea}</Badge>
                                <span className="text-xs text-gray-400 flex items-center gap-1"><Star className="w-3 h-3" />{lead.userScore} pts</span>
                              </div>
                              <p className="text-xs text-gray-500 mt-0.5">{lead.userEmail}</p>
                              <p className="text-xs text-gray-400 mt-0.5">Via: {lead.sourceTitle}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Select value={lead.status} onValueChange={v => updateLeadStatus(lead.id, v as any)}>
                                <SelectTrigger className="h-8 text-xs w-32"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="new">Novo</SelectItem>
                                  <SelectItem value="contacted">Contatado</SelectItem>
                                  <SelectItem value="converted">Convertido</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CAMPAIGNS */}
            {activeTab === 'campaigns' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div><h2 className="text-lg font-bold">Campanhas de Visibilidade</h2><p className="text-sm text-gray-500">Apareça para o público certo na hora certa.</p></div>
                  <Button onClick={() => setShowCampForm(true)} className="bg-emerald-600 hover:bg-emerald-700"><Plus className="w-4 h-4 mr-2" />Nova Campanha</Button>
                </div>

                {showCampForm && (
                  <Card className="border-emerald-200">
                    <CardHeader><CardTitle className="text-base">Nova Campanha</CardTitle></CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Título *</Label><Input className="mt-1" value={campForm.title} onChange={e => setCampForm(f => ({ ...f, title: e.target.value }))} /></div>
                        <div>
                          <Label>Tipo</Label>
                          <Select value={campForm.type} onValueChange={v => setCampForm(f => ({ ...f, type: v as any }))}>
                            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                            <SelectContent>{CAMPAIGN_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div><Label>Descrição / Objetivo</Label><Textarea className="mt-1" rows={2} value={campForm.description} onChange={e => setCampForm(f => ({ ...f, description: e.target.value }))} /></div>
                      <div className="grid grid-cols-2 gap-3">
                        <div><Label>Data de Início</Label><Input type="date" className="mt-1" value={campForm.startDate} onChange={e => setCampForm(f => ({ ...f, startDate: e.target.value }))} /></div>
                        <div><Label>Data de Fim</Label><Input type="date" className="mt-1" value={campForm.endDate} onChange={e => setCampForm(f => ({ ...f, endDate: e.target.value }))} /></div>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" onClick={() => setShowCampForm(false)}>Cancelar</Button>
                        <Button onClick={handleSaveCampaign} className="bg-emerald-600 hover:bg-emerald-700"><Save className="w-4 h-4 mr-2" />Criar</Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {myCampaigns.length === 0 && !showCampForm ? (
                  <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed">
                    <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Nenhuma campanha criada. Crie campanhas para aumentar sua visibilidade.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {myCampaigns.map(camp => (
                      <Card key={camp.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-semibold">{camp.title}</p>
                                <Badge className={camp.status === 'active' ? 'bg-green-100 text-green-700' : camp.status === 'ended' ? 'bg-gray-100 text-gray-600' : 'bg-amber-100 text-amber-700'}>
                                  {camp.status === 'active' ? 'Ativa' : camp.status === 'ended' ? 'Encerrada' : 'Rascunho'}
                                </Badge>
                                <Badge variant="outline" className="text-xs">{CAMPAIGN_TYPES.find(t => t.value === camp.type)?.label}</Badge>
                              </div>
                              {camp.description && <p className="text-sm text-gray-500 mt-1">{camp.description}</p>}
                              {camp.startDate && <p className="text-xs text-gray-400 mt-1">{camp.startDate} → {camp.endDate}</p>}
                              <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                <span><Eye className="w-3 h-3 inline mr-1" />{camp.impressions} impressões</span>
                                <span><MousePointerClick className="w-3 h-3 inline mr-1" />{camp.clicks} cliques</span>
                                <span><Users className="w-3 h-3 inline mr-1" />{camp.leads} leads</span>
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              {camp.status === 'draft' && (
                                <Button size="sm" variant="outline" className="text-green-600 border-green-200 h-8 text-xs" onClick={() => updateCampaign(camp.id, { status: 'active' })}>
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" />Ativar
                                </Button>
                              )}
                              {camp.status === 'active' && (
                                <Button size="sm" variant="outline" className="h-8 text-xs" onClick={() => updateCampaign(camp.id, { status: 'ended' })}>
                                  <Clock className="w-3.5 h-3.5 mr-1" />Encerrar
                                </Button>
                              )}
                              <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500" onClick={() => deleteCampaign(camp.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* AFFILIATE */}
            {activeTab === 'affiliate' && (
              <div className="space-y-6">
                <div><h2 className="text-lg font-bold">Programa de Afiliados</h2><p className="text-sm text-gray-500">Modelo de performance com previsibilidade.</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { title: 'Comissão por Lead', desc: 'Receba por cada lead qualificado gerado pela plataforma.', value: 'R$ 15 / lead', icon: Users, color: 'bg-blue-50 text-blue-600' },
                    { title: 'Comissão por Matrícula', desc: 'Ganhe quando um usuário se matricula no seu curso.', value: '10% do valor', icon: GraduationCap, color: 'bg-purple-50 text-purple-600' },
                    { title: 'Comissão por Contratação', desc: 'Receba quando um usuário é contratado via sua vaga.', value: 'R$ 200 / contratação', icon: Briefcase, color: 'bg-emerald-50 text-emerald-600' },
                    { title: 'Revenue Share', desc: 'Modelo de receita compartilhada com a ASTER.', value: '70% / 30%', icon: TrendingUp, color: 'bg-orange-50 text-orange-600' },
                  ].map(m => (
                    <Card key={m.title} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${m.color}`}>
                          <m.icon className="w-5 h-5" />
                        </div>
                        <h3 className="font-semibold">{m.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{m.desc}</p>
                        <p className="text-lg font-bold text-emerald-700 mt-2">{m.value}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                <Card className="bg-emerald-50 border-emerald-200">
                  <CardContent className="pt-5">
                    <div className="flex items-start gap-3">
                      <Handshake className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-emerald-900">Como funciona</h3>
                        <p className="text-sm text-emerald-800 mt-1">
                          A ASTER cresce quando o parceiro cresce. Cada ação do usuário na plataforma que resulta em conversão para o parceiro gera uma comissão automática. Os relatórios de conversão são atualizados em tempo real no seu dashboard.
                        </p>
                        <Button className="mt-3 bg-emerald-600 hover:bg-emerald-700" onClick={() => setActiveTab('chat')}>
                          <MessageSquare className="w-4 h-4 mr-2" />Falar com a ASTER
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* COURSES */}
            {activeTab === 'courses' && (
              <div className="space-y-4">
                <div><h2 className="text-lg font-bold">Cursos & Trilhas</h2><p className="text-sm text-gray-500">Gerencie seu conteúdo educacional na plataforma.</p></div>
                {partnerCourses.length === 0 ? (
                  <div className="text-center py-16 text-gray-400 bg-white rounded-xl border border-dashed">
                    <BookOpen className="w-10 h-10 mx-auto mb-3 opacity-40" />
                    <p>Nenhum curso criado ainda.</p>
                    <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700" onClick={() => setActiveTab('chat')}>
                      Solicitar criação de curso
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {partnerCourses.map(c => (
                      <Card key={c.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="font-semibold">{c.title}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{c.modules.length} módulos · {c.duration}</p>
                            </div>
                            <Badge className={c.status === 'approved' ? 'bg-green-100 text-green-700' : c.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}>
                              {c.status === 'approved' ? 'Publicado' : c.status === 'pending' ? 'Em análise' : 'Rascunho'}
                            </Badge>
                          </div>
                          {c.description && <p className="text-sm text-gray-500 mt-2 line-clamp-2">{c.description}</p>}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* CHAT */}
            {activeTab === 'chat' && (
              <div className="space-y-4">
                <div><h2 className="text-lg font-bold">Suporte ASTER</h2><p className="text-sm text-gray-500">Fale diretamente com a equipe ASTER.</p></div>
                <Card>
                  <CardContent className="pt-4">
                    <ScrollArea className="h-80 pr-2">
                      {myMessages.length === 0 ? (
                        <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                          Nenhuma mensagem ainda. Inicie uma conversa!
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {myMessages.map(msg => (
                            <div key={msg.id} className={`flex ${msg.sender === 'partner' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-xs px-3 py-2 rounded-xl text-sm ${msg.sender === 'partner' ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-800'}`}>
                                <p>{msg.text}</p>
                                <p className={`text-xs mt-1 ${msg.sender === 'partner' ? 'text-emerald-200' : 'text-gray-400'}`}>{msg.time}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                    <div className="flex gap-2 mt-4 pt-4 border-t">
                      <Input
                        placeholder="Digite sua mensagem..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter' && chatInput.trim()) { sendMessageToAdmin(chatInput); setChatInput(''); } }}
                      />
                      <Button onClick={() => { if (chatInput.trim()) { sendMessageToAdmin(chatInput); setChatInput(''); } }} className="bg-emerald-600 hover:bg-emerald-700">
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
