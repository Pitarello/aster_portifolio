<<<<<<< HEAD
import { useState, useEffect, useRef } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
<<<<<<< HEAD
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
=======
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
<<<<<<< HEAD
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { Plus, Trash2, Edit, Briefcase, X, ChevronLeft, ChevronRight, ExternalLink, FolderOpen, Image as ImageIcon, Link, MessageCircle, Send, Github } from 'lucide-react';
=======
import { 
  Home, 
  User, 
  Briefcase, 
  LogOut, 
  Network,
  Plus,
  Trash2,
  Code,
  Palette,
  Building
} from 'lucide-react';
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e

const portfolioCategories = {
  tech: [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'backend', label: 'Backend' },
    { value: 'devops', label: 'DevOps' },
<<<<<<< HEAD
    { value: 'ai', label: 'AI/ML' },
=======
    { value: 'ai', label: 'AI/ML' }
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  ],
  fashion: [
    { value: 'collection', label: 'Coleção' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'sustainable', label: 'Sustentável' },
    { value: 'accessories', label: 'Acessórios' },
<<<<<<< HEAD
    { value: 'runway', label: 'Passarela' },
=======
    { value: 'runway', label: 'Passarela' }
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
  ],
  architecture: [
    { value: 'residential', label: 'Residencial' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'urban', label: 'Urbanismo' },
    { value: 'interior', label: 'Design de Interiores' },
<<<<<<< HEAD
    { value: 'landscape', label: 'Paisagismo' },
  ],
};

const emptyForm = { title: '', description: '', image: '', images: [] as string[], link: '', githubUrl: '', category: '', tags: '' };

// ── Mini Carousel ─────────────────────────────────────────────────────────────
function ProjectCarousel({ images, title, fullHeight }: { images: string[]; title: string; fullHeight?: boolean }) {
  const [idx, setIdx] = useState(0);
  if (!images.length) return (
    <div className={`w-full flex items-center justify-center bg-[#2a2a2a] text-gray-600 ${fullHeight ? 'h-full' : 'h-48'}`}>
      <Briefcase className="h-12 w-12" />
    </div>
  );
  const prev = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setIdx(i => (i - 1 + images.length) % images.length); };
  const next = (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); setIdx(i => (i + 1) % images.length); };
  return (
    <div className={`relative w-full overflow-hidden select-none ${fullHeight ? 'h-full' : ''}`}>
      <img
        src={images[idx]}
        alt={`${title} ${idx + 1}`}
        className={`w-full block ${fullHeight ? 'h-full object-contain' : 'object-cover max-h-72'}`}
        draggable={false}
      />
      {images.length > 1 && (
        <>
          {/* Carousel buttons sit above the hover overlay via z-20 */}
          <button
            onClick={prev}
            className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-1.5 bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setIdx(i); }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Portfolio() {
  const navigate = useNavigate();
  const { currentUser, portfolio, addProject, removeProject, updateProject, reactToProject, commentOnProject, removeProjectComment, getUserById } = useApp();

  const [addOpen, setAddOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [viewId, setViewId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [activeFilter, setActiveFilter] = useState('all');
  const [commentText, setCommentText] = useState('');
  const folderInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const categories = portfolioCategories[currentUser.area];

  // Only show current user's projects
  const myPortfolio = portfolio.filter(p => (p as any).userId === currentUser.id || !(p as any).userId);

  const openAdd = () => { setForm(emptyForm); setAddOpen(true); };
  const openEdit = (id: string) => {
    const p = myPortfolio.find(x => x.id === id) as any;
    if (!p) return;
    setForm({
      title: p.title,
      description: p.description,
      image: p.image || '',
      images: p.images || (p.image ? [p.image] : []),
      link: p.link || '',
      githubUrl: p.githubUrl || '',
      category: p.category,
      tags: p.tags.join(', '),
    });
    setEditId(id);
  };
  const closeDialog = () => { setAddOpen(false); setEditId(null); setForm(emptyForm); };

  const viewProject = portfolio.find(p => p.id === viewId);
  const viewOwner = viewProject ? getUserById(viewProject.userId) : null;
  const REACTIONS = ['👍', '❤️', '🔥', '🎉', '😮', '👏'];

  const handleSendComment = () => {
    if (!viewId || !commentText.trim()) return;
    commentOnProject(viewId, commentText);
    setCommentText('');
  };

  // Single cover image
  const handleCoverFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setForm(f => ({
        ...f,
        image: result,
        images: f.images.includes(result) ? f.images : [result, ...f.images],
      }));
    };
    reader.readAsDataURL(file);
  };

  // Multiple files from folder
  const handleFolderFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'));
    if (!files.length) return;
    const results: string[] = [];
    let loaded = 0;
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        results.push(reader.result as string);
        loaded++;
        if (loaded === files.length) {
          setForm(f => ({
            ...f,
            images: [...f.images, ...results],
            image: f.image || results[0],
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (idx: number) => {
    setForm(f => {
      const imgs = f.images.filter((_, i) => i !== idx);
      return { ...f, images: imgs, image: imgs[0] || '' };
    });
  };

  const handleSave = () => {
    if (!form.title.trim()) return;
    const allImages = form.images.length ? form.images : (form.image ? [form.image] : []);
    const data = {
      title: form.title.trim(),
      description: form.description.trim(),
      image: allImages[0] || '',
      images: allImages,
      link: form.link.trim(),
      githubUrl: form.githubUrl.trim(),
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
    };
    if (editId) {
      updateProject(editId, data);
    } else {
      addProject(data);
    }
    closeDialog();
  };

  const filtered = activeFilter === 'all'
    ? myPortfolio
    : myPortfolio.filter(p => p.category === activeFilter);

  const allFilters = [{ value: 'all', label: 'Todos' }, ...categories];

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      <Navbar />

      {/* ── Profile Banner ── */}
      <div className="border-b border-white/10 bg-[#111]">
        <div className="max-w-6xl mx-auto px-6 py-8 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-2 border-white/20">
              <AvatarImage src={currentUser.avatar} />
              <AvatarFallback className="text-2xl font-bold bg-indigo-900 text-indigo-200">
                {currentUser.name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">{currentUser.name}</h1>
              <p className="text-gray-400 text-sm mt-0.5">{currentUser.email}</p>
              <div className="flex items-center gap-3 mt-2 text-sm text-gray-400">
                <span>{myPortfolio.length} projeto{myPortfolio.length !== 1 ? 's' : ''}</span>
                <span>·</span>
                <span>{currentUser.followersIds?.length || 0} seguidores</span>
              </div>
            </div>
          </div>
          <Button onClick={openAdd} className="bg-[#0057ff] hover:bg-[#0046cc] text-white rounded-full px-6 gap-2">
            <Plus className="h-4 w-4" /> Novo Projeto
          </Button>
        </div>
      </div>

      {/* ── Filters ── */}
      <div className="border-b border-white/10 bg-[#111] sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 flex gap-1 overflow-x-auto py-3">
          {allFilters.map(f => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeFilter === f.value ? 'bg-white text-black' : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Grid ── */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {filtered.length > 0 ? (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
            {filtered.map(project => {
              const proj = project as any;
              const imgs: string[] = proj.images?.length ? proj.images : (proj.image ? [proj.image] : []);
              return (
                <div key={project.id} className="break-inside-avoid group relative rounded-xl overflow-hidden bg-[#222] cursor-pointer" onClick={() => setViewId(project.id)}>
                  {/* Carousel */}
                  <ProjectCarousel images={imgs} title={project.title} />

                  {/* Hover overlay — z-10 so carousel buttons (z-20) stay clickable */}
                  <div className="absolute inset-0 z-10 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-4 pointer-events-none group-hover:pointer-events-auto">
                    <div className="flex justify-end gap-2">
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer"
                          onClick={e => e.stopPropagation()}
                          className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </a>
                      )}
                      <button onClick={() => openEdit(project.id)} className="p-2 bg-white/20 hover:bg-white/30 rounded-full backdrop-blur-sm transition-colors">
                        <Edit className="h-4 w-4 text-white" />
                      </button>
                      <button onClick={() => removeProject(project.id)} className="p-2 bg-red-500/80 hover:bg-red-600 rounded-full backdrop-blur-sm transition-colors">
                        <Trash2 className="h-4 w-4 text-white" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-lg leading-tight">{project.title}</h3>
                      {project.description && <p className="text-gray-300 text-sm mt-1 line-clamp-2">{project.description}</p>}
                      {project.category && (
                        <Badge className="bg-white/20 text-white border-0 text-xs mt-2">
                          {categories.find(c => c.value === project.category)?.label}
                        </Badge>
                      )}
                      {project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {project.tags.map((tag, i) => (
                            <span key={i} className="text-xs text-gray-400 bg-white/10 px-2 py-0.5 rounded-full">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom bar */}
                  <div className="p-3 bg-[#1e1e1e]">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-sm truncate">{project.title}</p>
                      {proj.link && (
                        <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 shrink-0" onClick={e => e.stopPropagation()}>
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      )}
                    </div>
                    {project.category && (
                      <p className="text-xs text-gray-500 mt-0.5">{categories.find(c => c.value === project.category)?.label}</p>
                    )}
                    <div className="flex items-center gap-3 mt-1.5">
                      {Object.entries(proj.reactions || {}).slice(0, 3).map(([emoji, users]: [string, any]) => (
                        <span key={emoji} className="text-xs text-gray-400">{emoji} {users.length}</span>
                      ))}
                      {(proj.comments?.length || 0) > 0 && (
                        <span className="text-xs text-gray-500 flex items-center gap-1 ml-auto">
                          <MessageCircle className="h-3 w-3" />{proj.comments.length}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
              <Briefcase className="h-10 w-10 text-gray-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300 mb-2">
              {activeFilter === 'all' ? 'Nenhum projeto ainda' : 'Nenhum projeto nesta categoria'}
            </h3>
            <p className="text-gray-500 mb-6 max-w-sm">
              {activeFilter === 'all' ? 'Comece adicionando seus melhores projetos.' : 'Tente outro filtro ou adicione um projeto nesta categoria.'}
            </p>
            {activeFilter === 'all' && (
              <Button onClick={openAdd} className="bg-[#0057ff] hover:bg-[#0046cc] rounded-full px-6 gap-2">
                <Plus className="h-4 w-4" /> Adicionar Primeiro Projeto
              </Button>
            )}
          </div>
        )}
      </div>

      {/* ── Add / Edit Dialog ── */}
      <Dialog open={addOpen || !!editId} onOpenChange={open => !open && closeDialog()}>
        <DialogContent className="max-w-2xl bg-[#1e1e1e] border-white/10 text-white max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white">{editId ? 'Editar Projeto' : 'Novo Projeto'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-5">

            {/* Título */}
            <div>
              <Label className="text-gray-300">Título *</Label>
              <Input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Nome do projeto" className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>

            {/* Descrição */}
            <div>
              <Label className="text-gray-300">Descrição</Label>
              <Textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Descreva seu projeto..." rows={3}
                className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>

            {/* Categoria */}
            <div>
              <Label className="text-gray-300">Categoria</Label>
              <div className="mt-1 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setForm(f => ({ ...f, category: '' }))}
                  className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${
                    form.category === ''
                      ? 'bg-[#0057ff] border-[#0057ff] text-white'
                      : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  Sem categoria
                </button>
                {categories.map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, category: cat.value }))}
                    className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors text-left ${
                      form.category === cat.value
                        ? 'bg-[#0057ff] border-[#0057ff] text-white'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Link externo */}
            <div>
              <Label className="text-gray-300 flex items-center gap-2"><Link className="h-3.5 w-3.5" /> Link de Redirecionamento</Label>
              <Input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))}
                placeholder="https://meu-projeto.com" type="url"
                className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
              <p className="text-xs text-gray-500 mt-1">Opcional — abre uma página externa ao clicar no projeto</p>
            </div>

            {/* GitHub */}
            <div>
              <Label className="text-gray-300 flex items-center gap-2">
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                GitHub
              </Label>
              <Input value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))}
                placeholder="https://github.com/usuario/repositorio" type="url"
                className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>

            {/* Imagens */}
            <div>
              <Label className="text-gray-300">Imagens do Projeto</Label>
              <div className="mt-2 flex gap-2 flex-wrap">
                {/* Capa única */}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-sm text-gray-300 transition-colors">
                  <ImageIcon className="h-4 w-4" /> Imagem de Capa
                  <input type="file" accept="image/*" onChange={handleCoverFile} className="hidden" />
                </label>
                {/* Pasta completa */}
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 cursor-pointer text-sm text-gray-300 transition-colors">
                  <FolderOpen className="h-4 w-4" /> Subir Pasta
                  <input
                    ref={folderInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    // @ts-ignore
                    webkitdirectory=""
                    onChange={handleFolderFiles}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Preview das imagens */}
              {form.images.length > 0 && (
                <div className="mt-3 grid grid-cols-4 gap-2">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group/img">
                      <img src={img} alt={`img ${i + 1}`} className="w-full h-full object-cover" />
                      {i === 0 && (
                        <span className="absolute top-1 left-1 text-[10px] bg-[#0057ff] text-white px-1.5 py-0.5 rounded font-medium">Capa</span>
                      )}
                      <button onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 p-0.5 bg-black/70 rounded-full opacity-0 group-hover/img:opacity-100 transition-opacity">
                        <X className="h-3 w-3 text-white" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-2">A primeira imagem será a capa. Arraste para reordenar ou remova individualmente.</p>
            </div>

            {/* Tags */}
            <div>
              <Label className="text-gray-300">Tags <span className="text-gray-500 font-normal">(separadas por vírgula)</span></Label>
              <Input value={form.tags} onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                placeholder="React, TypeScript, Figma"
                className="mt-1 bg-white/5 border-white/10 text-white placeholder:text-gray-500" />
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSave} className="flex-1 bg-[#0057ff] hover:bg-[#0046cc]">
                {editId ? 'Salvar Alterações' : 'Publicar Projeto'}
              </Button>
              <Button variant="ghost" onClick={closeDialog} className="text-gray-400 hover:text-white">Cancelar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Expanded Project View ── */}
      <Dialog open={!!viewId} onOpenChange={open => { if (!open) { setViewId(null); setCommentText(''); } }}>
        <DialogContent className="bg-[#1a1a1a] border-white/10 text-white p-0 overflow-hidden flex flex-col"
          style={{ width: '90vw', height: '90vh', maxWidth: '90vw', maxHeight: '90vh' }}>
          {viewProject && (
            <>
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={viewOwner?.avatar} />
                    <AvatarFallback className="bg-indigo-900 text-indigo-200 text-sm">
                      {(viewOwner?.name || 'U').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-sm">{viewOwner?.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-400">{viewProject.category ? categories.find(c => c.value === viewProject.category)?.label : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {viewProject.link && (
                    <a href={viewProject.link} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" /> Ver projeto
                    </a>
                  )}
                  {(viewProject as any).githubUrl && (
                    <a href={(viewProject as any).githubUrl} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-sm transition-colors">
                      <Github className="h-3.5 w-3.5" /> GitHub
                    </a>
                  )}
                  {currentUser?.id === viewProject.userId && (
                    <button onClick={() => { setViewId(null); openEdit(viewProject.id); }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Body: 80% image + 20% sidebar */}
              <div className="flex flex-1 overflow-hidden" style={{ minHeight: 0 }}>
                {/* Image area — 80% width */}
                <div className="bg-black flex items-center justify-center overflow-hidden" style={{ width: '80%' }}>
                  <ProjectCarousel
                    images={(viewProject as any).images?.length ? (viewProject as any).images : (viewProject.image ? [viewProject.image] : [])}
                    title={viewProject.title}
                    fullHeight
                  />
                </div>

                {/* Sidebar — 20% width */}
                <div className="flex flex-col border-l border-white/10 bg-[#111] overflow-hidden" style={{ width: '20%', minWidth: '260px' }}>
                  {/* Info */}
                  <div className="p-4 border-b border-white/10 shrink-0">
                    <h2 className="font-bold text-base leading-tight">{viewProject.title}</h2>
                    {viewProject.description && <p className="text-gray-400 text-xs mt-1 line-clamp-3">{viewProject.description}</p>}
                    {viewProject.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {viewProject.tags.map((tag, i) => (
                          <span key={i} className="text-xs bg-white/10 text-gray-300 px-2 py-0.5 rounded-full">{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Reactions */}
                  <div className="p-4 border-b border-white/10 shrink-0">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wide">Reações</p>
                    <div className="flex flex-wrap gap-1.5">
                      {REACTIONS.map(emoji => {
                        const users: string[] = (viewProject.reactions || {})[emoji] || [];
                        const reacted = currentUser ? users.includes(currentUser.id) : false;
                        return (
                          <button
                            key={emoji}
                            onClick={() => currentUser && reactToProject(viewProject.id, emoji)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm border transition-colors ${
                              reacted
                                ? 'bg-indigo-600/30 border-indigo-500 text-white'
                                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            {emoji} {users.length > 0 && <span className="text-xs">{users.length}</span>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Comments list */}
                  <ScrollArea className="flex-1 p-4">
                    <p className="text-xs text-gray-500 mb-3 uppercase tracking-wide flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5" /> Comentários ({(viewProject.comments || []).length})
                    </p>
                    <div className="space-y-3">
                      {(viewProject.comments || []).length === 0 && (
                        <p className="text-gray-600 text-sm italic">Seja o primeiro a comentar.</p>
                      )}
                      {(viewProject.comments || []).map(comment => (
                        <div key={comment.id} className="flex gap-2 group">
                          <Avatar className="h-7 w-7 shrink-0">
                            <AvatarImage src={comment.userAvatar} />
                            <AvatarFallback className="text-xs bg-indigo-900 text-indigo-200">
                              {comment.userName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 bg-white/5 rounded-lg px-3 py-2 min-w-0">
                            <p className="text-xs font-semibold text-gray-300 truncate">{comment.userName}</p>
                            <p className="text-sm text-gray-200 mt-0.5 break-words">{comment.content}</p>
                          </div>
                          {(currentUser?.id === comment.userId || currentUser?.id === viewProject.userId) && (
                            <button
                              onClick={() => removeProjectComment(viewProject.id, comment.id)}
                              className="opacity-0 group-hover:opacity-100 p-1 text-gray-600 hover:text-red-500 transition-all shrink-0"
                            >
                              <X className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  {/* Comment input */}
                  {currentUser && (
                    <div className="p-3 border-t border-white/10 flex gap-2 shrink-0">
                      <Input
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendComment()}
                        placeholder="Adicionar comentário..."
                        className="flex-1 bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm h-9"
                      />
                      <Button size="sm" onClick={handleSendComment} className="bg-[#0057ff] hover:bg-[#0046cc] h-9 px-3">
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
=======
    { value: 'landscape', label: 'Paisagismo' }
  ]
};

export default function Portfolio() {
  const navigate = useNavigate();
  const { currentUser, logout, portfolio, addProject, removeProject } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
    tags: ''
  });

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddProject = () => {
    if (newProject.title && newProject.description) {
      addProject({
        title: newProject.title,
        description: newProject.description,
        image: newProject.image || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        category: newProject.category,
        tags: newProject.tags.split(',').map(t => t.trim()).filter(Boolean)
      });
      
      setNewProject({ title: '', description: '', image: '', category: '', tags: '' });
      setIsDialogOpen(false);
    }
  };

  const areaIcons = {
    tech: <Code className="h-5 w-5" />,
    fashion: <Palette className="h-5 w-5" />,
    architecture: <Building className="h-5 w-5" />
  };

  const areaLabels = {
    tech: 'Tecnologia',
    fashion: 'Moda',
    architecture: 'Arquitetura'
  };

  const categories = portfolioCategories[currentUser.area];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              {areaIcons[currentUser.area]}
              <h1 className="text-3xl font-semibold">Meu Portfólio</h1>
            </div>
            <p className="text-gray-600 mt-1">
              Área: {areaLabels[currentUser.area]}
            </p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Novo Projeto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Projeto</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Título do Projeto</Label>
                  <Input
                    id="title"
                    value={newProject.title}
                    onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                    placeholder="Ex: E-commerce Platform"
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={newProject.description}
                    onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                    placeholder="Descreva seu projeto..."
                    rows={4}
                  />
                </div>
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <select
                    id="category"
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="">Selecione uma categoria</option>
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label htmlFor="image">Imagem do Projeto</Label>
                  <div className="mt-1">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setNewProject({ ...newProject, image: reader.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="cursor-pointer"
                    />
                  </div>
                  {newProject.image && (
                    <div className="mt-2 relative w-32 h-32 rounded-md overflow-hidden border border-gray-200">
                      <img src={newProject.image} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
                <div>
                  <Label htmlFor="tags">Tags (separadas por vírgula)</Label>
                  <Input
                    id="tags"
                    value={newProject.tags}
                    onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                    placeholder="React, TypeScript, AWS"
                  />
                </div>
                <Button onClick={handleAddProject} className="w-full">
                  Adicionar Projeto
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Portfolio Grid */}
        {portfolio.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((project) => (
              <Card key={project.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48 bg-gray-200">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => removeProject(project.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                  </div>
                  {project.category && (
                    <Badge variant="secondary" className="w-fit mt-2">
                      {categories.find(c => c.value === project.category)?.label}
                    </Badge>
                  )}
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-3">
                    {project.description}
                  </CardDescription>
                  {project.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="py-12">
            <CardContent className="text-center">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Nenhum projeto ainda</h3>
              <p className="text-gray-600 mb-4">
                Comece a construir seu portfólio adicionando seus melhores projetos.
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar Primeiro Projeto
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
>>>>>>> 0b549b08d77e0a8b647e151e6622fd765323381e
    </div>
  );
}
