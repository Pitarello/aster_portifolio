import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { PortfolioCarousel } from '../components/PortfolioCarousel';
import { ImageCropperDialog } from '../components/ImageCropperDialog';
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import {
  TrendingUp, Users, Edit, Plus, X, Camera, Image as ImageIcon, Trash2, Crop, Check, Briefcase,
  GraduationCap, Award, Globe, Phone, MapPin, Languages, Heart,
} from 'lucide-react';

const areaColors = {
  tech: 'bg-blue-100 text-blue-700',
  fashion: 'bg-pink-100 text-pink-700',
  architecture: 'bg-green-100 text-green-700',
};
const areaLabels = { tech: 'Tecnologia', fashion: 'Moda', architecture: 'Arquitetura' };

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useApp();

  // Info editing
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedArea, setEditedArea] = useState<'tech' | 'fashion' | 'architecture'>('tech');

  // Bio
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState('');

  // Skills
  const [newSkill, setNewSkill] = useState('');
  const [editingSkillIdx, setEditingSkillIdx] = useState<number | null>(null);
  const [editingSkillVal, setEditingSkillVal] = useState('');

  // Experiences
  const [newExp, setNewExp] = useState({ title: '', company: '', period: '', description: '', current: false });
  const [editingExpIdx, setEditingExpIdx] = useState<number | null>(null);
  const [editingExpVal, setEditingExpVal] = useState({ title: '', company: '', period: '', description: '', current: false });

  // Education
  const [newEdu, setNewEdu] = useState({ institution: '', degree: '', field: '', period: '', description: '' });
  const [editingEduIdx, setEditingEduIdx] = useState<number | null>(null);
  const [editingEduVal, setEditingEduVal] = useState({ institution: '', degree: '', field: '', period: '', description: '' });

  // Certifications
  const [newCert, setNewCert] = useState({ name: '', issuer: '', date: '', url: '' });
  const [editingCertIdx, setEditingCertIdx] = useState<number | null>(null);
  const [editingCertVal, setEditingCertVal] = useState({ name: '', issuer: '', date: '', url: '' });

  // Languages
  const [newLang, setNewLang] = useState({ name: '', level: '' });

  // Volunteer
  const [newVol, setNewVol] = useState({ role: '', organization: '', period: '', description: '' });
  const [editingVolIdx, setEditingVolIdx] = useState<number | null>(null);
  const [editingVolVal, setEditingVolVal] = useState({ role: '', organization: '', period: '', description: '' });

  // Contact info editing
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ headline: '', location: '', website: '', phone: '' });

  // Photo cropper
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState('');
  const [cropperAspect, setCropperAspect] = useState(1);
  const [cropperTitle, setCropperTitle] = useState('');
  const [currentEditType, setCurrentEditType] = useState<'avatar' | 'cover' | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  // ── Info ──────────────────────────────────────────────
  const openEditInfo = () => {
    setEditedName(currentUser.name);
    setEditedArea(currentUser.area);
    setIsEditingInfo(true);
  };
  const saveInfo = () => {
    if (editedName.trim()) {
      updateProfile({ name: editedName.trim(), area: editedArea });
      setIsEditingInfo(false);
    }
  };

  // ── Bio ───────────────────────────────────────────────
  const openEditBio = () => { setEditedBio(currentUser.bio || ''); setIsEditingBio(true); };
  const saveBio = () => { updateProfile({ bio: editedBio }); setIsEditingBio(false); };

  // ── Skills ────────────────────────────────────────────
  const addSkill = () => {
    if (!newSkill.trim()) return;
    updateProfile({ skills: [...(currentUser.skills || []), newSkill.trim()] });
    setNewSkill('');
  };
  const startEditSkill = (i: number) => { setEditingSkillIdx(i); setEditingSkillVal(currentUser.skills[i]); };
  const saveSkill = (i: number) => {
    if (!editingSkillVal.trim()) return;
    const s = [...currentUser.skills];
    s[i] = editingSkillVal.trim();
    updateProfile({ skills: s });
    setEditingSkillIdx(null);
  };
  const removeSkill = (i: number) => {
    updateProfile({ skills: currentUser.skills.filter((_, idx) => idx !== i) });
  };

  // ── Experiences ───────────────────────────────────────
  const addExp = () => {
    if (!newExp.title || !newExp.company) return;
    updateProfile({ experiences: [...(currentUser.experiences || []), newExp] });
    setNewExp({ title: '', company: '', period: '', description: '', current: false });
  };
  const startEditExp = (i: number) => { setEditingExpIdx(i); setEditingExpVal({ description: '', current: false, ...currentUser.experiences[i] }); };
  const saveExp = (i: number) => {
    if (!editingExpVal.title || !editingExpVal.company) return;
    const exps = [...currentUser.experiences];
    exps[i] = editingExpVal;
    updateProfile({ experiences: exps });
    setEditingExpIdx(null);
  };
  const removeExp = (i: number) => {
    updateProfile({ experiences: currentUser.experiences.filter((_, idx) => idx !== i) });
  };

  // ── Education ─────────────────────────────────────────
  const addEdu = () => {
    if (!newEdu.institution || !newEdu.degree) return;
    updateProfile({ education: [...(currentUser.education || []), newEdu] });
    setNewEdu({ institution: '', degree: '', field: '', period: '', description: '' });
  };
  const startEditEdu = (i: number) => { setEditingEduIdx(i); setEditingEduVal({ ...currentUser.education![i] }); };
  const saveEdu = (i: number) => {
    const edus = [...(currentUser.education || [])];
    edus[i] = editingEduVal;
    updateProfile({ education: edus });
    setEditingEduIdx(null);
  };
  const removeEdu = (i: number) => {
    updateProfile({ education: (currentUser.education || []).filter((_, idx) => idx !== i) });
  };

  // ── Certifications ────────────────────────────────────
  const addCert = () => {
    if (!newCert.name || !newCert.issuer) return;
    updateProfile({ certifications: [...(currentUser.certifications || []), newCert] });
    setNewCert({ name: '', issuer: '', date: '', url: '' });
  };
  const startEditCert = (i: number) => { setEditingCertIdx(i); setEditingCertVal({ ...currentUser.certifications![i] }); };
  const saveCert = (i: number) => {
    const certs = [...(currentUser.certifications || [])];
    certs[i] = editingCertVal;
    updateProfile({ certifications: certs });
    setEditingCertIdx(null);
  };
  const removeCert = (i: number) => {
    updateProfile({ certifications: (currentUser.certifications || []).filter((_, idx) => idx !== i) });
  };

  // ── Languages ─────────────────────────────────────────
  const addLang = () => {
    if (!newLang.name || !newLang.level) return;
    updateProfile({ languages: [...(currentUser.languages || []), newLang] });
    setNewLang({ name: '', level: '' });
  };
  const removeLang = (i: number) => {
    updateProfile({ languages: (currentUser.languages || []).filter((_, idx) => idx !== i) });
  };

  // ── Volunteer ─────────────────────────────────────────
  const addVol = () => {
    if (!newVol.role || !newVol.organization) return;
    updateProfile({ volunteer: [...(currentUser.volunteer || []), newVol] });
    setNewVol({ role: '', organization: '', period: '', description: '' });
  };
  const startEditVol = (i: number) => { setEditingVolIdx(i); setEditingVolVal({ ...currentUser.volunteer![i] }); };
  const saveVol = (i: number) => {
    const vols = [...(currentUser.volunteer || [])];
    vols[i] = editingVolVal;
    updateProfile({ volunteer: vols });
    setEditingVolIdx(null);
  };
  const removeVol = (i: number) => {
    updateProfile({ volunteer: (currentUser.volunteer || []).filter((_, idx) => idx !== i) });
  };

  // ── Contact ───────────────────────────────────────────
  const openEditContact = () => {
    setContactForm({
      headline: currentUser.headline || '',
      location: currentUser.location || '',
      website: currentUser.website || '',
      phone: currentUser.phone || '',
    });
    setIsEditingContact(true);
  };
  const saveContact = () => {
    updateProfile(contactForm);
    setIsEditingContact(false);
  };

  // ── Photos ────────────────────────────────────────────
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    if (!e.target.files?.length) return;
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      setCropperImage(reader.result?.toString() || '');
      setCropperAspect(type === 'avatar' ? 1 : 16 / 9);
      setCropperTitle(type === 'avatar' ? 'Ajustar Foto de Perfil' : 'Ajustar Foto de Capa');
      setCurrentEditType(type);
      setCropperOpen(true);
    });
    reader.readAsDataURL(e.target.files[0]);
    e.target.value = '';
  };
  const handleCropSave = (img: string) => {
    if (currentEditType === 'avatar') updateProfile({ avatar: img });
    else if (currentEditType === 'cover') updateProfile({ coverImage: img });
  };
  const handleEditCurrentPhoto = (type: 'avatar' | 'cover') => {
    const url = type === 'avatar' ? currentUser.avatar : currentUser.coverImage;
    if (!url) return;
    setCropperImage(url);
    setCropperAspect(type === 'avatar' ? 1 : 16 / 9);
    setCropperTitle(type === 'avatar' ? 'Ajustar Foto de Perfil' : 'Ajustar Foto de Capa');
    setCurrentEditType(type);
    setCropperOpen(true);
  };
  const handleDeletePhoto = (type: 'avatar' | 'cover') => {
    if (type === 'avatar') updateProfile({ avatar: '' });
    else updateProfile({ coverImage: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hidden file inputs */}
      <input type="file" accept="image/*" className="hidden" ref={avatarInputRef} onChange={e => handleFileChange(e, 'avatar')} />
      <input type="file" accept="image/*" className="hidden" ref={coverInputRef} onChange={e => handleFileChange(e, 'cover')} />

      <ImageCropperDialog
        open={cropperOpen}
        imageSrc={cropperImage}
        aspect={cropperAspect}
        title={cropperTitle}
        onClose={() => setCropperOpen(false)}
        onCropSave={handleCropSave}
      />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ── Cover & Avatar ── */}
        <Card>
          <div className="relative group">
            <div
              className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg"
              style={currentUser.coverImage ? { backgroundImage: `url(${currentUser.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            />
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white text-gray-800">
                    <Camera className="h-4 w-4 mr-2" /> Editar Capa
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => coverInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" /> Fazer upload
                  </DropdownMenuItem>
                  {currentUser.coverImage && (
                    <DropdownMenuItem onClick={() => handleEditCurrentPhoto('cover')}>
                      <Crop className="h-4 w-4 mr-2" /> Ajustar imagem
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePhoto('cover')}>
                    <Trash2 className="h-4 w-4 mr-2" /> Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="absolute -bottom-16 left-6 group/avatar">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback className="text-3xl font-bold bg-indigo-100 text-indigo-700">
                    {currentUser.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="absolute bottom-2 right-2 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 text-gray-700 opacity-0 group-hover/avatar:opacity-100 transition-opacity focus:opacity-100">
                      <Camera className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => avatarInputRef.current?.click()}>
                      <ImageIcon className="h-4 w-4 mr-2" /> Fazer upload
                    </DropdownMenuItem>
                    {currentUser.avatar && (
                      <DropdownMenuItem onClick={() => handleEditCurrentPhoto('avatar')}>
                        <Crop className="h-4 w-4 mr-2" /> Ajustar foto
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePhoto('avatar')}>
                      <Trash2 className="h-4 w-4 mr-2" /> Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>

          <CardContent className="pt-20">
            {isEditingInfo ? (
              <div className="space-y-3 max-w-sm">
                <div>
                  <Label>Nome</Label>
                  <Input value={editedName} onChange={e => setEditedName(e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label>Área</Label>
                  <select
                    value={editedArea}
                    onChange={e => setEditedArea(e.target.value as 'tech' | 'fashion' | 'architecture')}
                    className="w-full rounded-md border border-gray-300 p-2 mt-1 text-sm"
                  >
                    <option value="tech">Tecnologia</option>
                    <option value="fashion">Moda</option>
                    <option value="architecture">Arquitetura</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" onClick={saveInfo}><Check className="h-4 w-4 mr-1" /> Salvar</Button>
                  <Button size="sm" variant="ghost" onClick={() => setIsEditingInfo(false)}>Cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                    <button onClick={openEditInfo} className="text-gray-400 hover:text-indigo-600 transition-colors">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                  {currentUser.headline && <p className="text-gray-700 font-medium mt-0.5">{currentUser.headline}</p>}
                  <p className="text-gray-500 text-sm mt-0.5">{currentUser.email}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-500">
                    {currentUser.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{currentUser.location}</span>}
                    {currentUser.website && <a href={currentUser.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-indigo-600 hover:underline"><Globe className="h-3.5 w-3.5" />{currentUser.website}</a>}
                    {currentUser.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{currentUser.phone}</span>}
                    <button onClick={openEditContact} className="text-indigo-600 hover:underline text-xs">Editar contato</button>
                  </div>
                  <div className="flex items-center gap-3 mt-3 flex-wrap">
                    <Badge className={areaColors[currentUser.area]}>{areaLabels[currentUser.area]}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <TrendingUp className="h-4 w-4 text-indigo-600" />
                      <span className="font-semibold">{currentUser.professionalScore}</span>
                      <span className="text-gray-500">Score</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span><strong>{currentUser.followersIds?.length || 0}</strong> seguidores</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      <span><strong>{currentUser.followingIds?.length || 0}</strong> seguindo</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* ── Bio ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Sobre</CardTitle>
            {!isEditingBio && (
              <Button variant="ghost" size="sm" onClick={openEditBio}><Edit className="h-4 w-4" /></Button>
            )}
          </CardHeader>
          <CardContent>
            {isEditingBio ? (
              <div className="space-y-3">
                <Textarea
                  value={editedBio}
                  onChange={e => setEditedBio(e.target.value)}
                  placeholder="Conte sobre você, suas experiências e objetivos..."
                  rows={4}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(false)}>Cancelar</Button>
                  <Button size="sm" onClick={saveBio}><Check className="h-4 w-4 mr-1" /> Salvar</Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700 whitespace-pre-wrap">
                {currentUser.bio || <span className="text-gray-400 italic">Adicione uma descrição sobre você...</span>}
              </p>
            )}
          </CardContent>
        </Card>

        {/* ── Skills ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Habilidades</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Habilidade</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Nome da Habilidade</Label>
                    <Input
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addSkill()}
                      placeholder="Ex: React, Design Thinking..."
                      className="mt-1"
                    />
                  </div>
                  <Button onClick={addSkill} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {(currentUser.skills?.length || 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentUser.skills.map((skill, i) =>
                  editingSkillIdx === i ? (
                    <div key={i} className="flex items-center gap-1">
                      <Input
                        value={editingSkillVal}
                        onChange={e => setEditingSkillVal(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && saveSkill(i)}
                        className="h-7 text-sm w-36"
                        autoFocus
                      />
                      <button onClick={() => saveSkill(i)} className="p-1 text-green-600 hover:text-green-700"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setEditingSkillIdx(null)} className="p-1 text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
                    </div>
                  ) : (
                    <Badge key={i} variant="secondary" className="px-3 py-1.5 group flex items-center gap-1">
                      {skill}
                      <button onClick={() => startEditSkill(i)} className="ml-1 opacity-0 group-hover:opacity-100 hover:text-blue-600 transition-opacity">
                        <Edit className="h-3 w-3" />
                      </button>
                      <button onClick={() => removeSkill(i)} className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )
                )}
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Nenhuma habilidade adicionada ainda.</p>
            )}
          </CardContent>
        </Card>

        {/* ── Experience ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle>Experiência</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Experiência</DialogTitle></DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Cargo</Label>
                    <Input value={newExp.title} onChange={e => setNewExp({ ...newExp, title: e.target.value })} placeholder="Ex: Desenvolvedor Senior" className="mt-1" />
                  </div>
                  <div>
                    <Label>Empresa</Label>
                    <Input value={newExp.company} onChange={e => setNewExp({ ...newExp, company: e.target.value })} placeholder="Ex: Tech Corp" className="mt-1" />
                  </div>
                  <div>
                    <Label>Período</Label>
                    <Input value={newExp.period} onChange={e => setNewExp({ ...newExp, period: e.target.value })} placeholder="Ex: 2020 - Presente" className="mt-1" />
                  </div>
                  <div>
                    <Label>Descrição</Label>
                    <Textarea value={newExp.description} onChange={e => setNewExp({ ...newExp, description: e.target.value })} placeholder="Descreva suas responsabilidades..." rows={3} className="mt-1" />
                  </div>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" checked={newExp.current} onChange={e => setNewExp({ ...newExp, current: e.target.checked })} />
                    Emprego atual
                  </label>
                  <Button onClick={addExp} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {(currentUser.experiences?.length || 0) > 0 ? (
              currentUser.experiences.map((exp, i) =>
                editingExpIdx === i ? (
                  <div key={i} className="space-y-2 border rounded-lg p-3 bg-gray-50">
                    <Input value={editingExpVal.title} onChange={e => setEditingExpVal({ ...editingExpVal, title: e.target.value })} placeholder="Cargo" />
                    <Input value={editingExpVal.company} onChange={e => setEditingExpVal({ ...editingExpVal, company: e.target.value })} placeholder="Empresa" />
                    <Input value={editingExpVal.period} onChange={e => setEditingExpVal({ ...editingExpVal, period: e.target.value })} placeholder="Período" />
                    <Textarea value={editingExpVal.description || ''} onChange={e => setEditingExpVal({ ...editingExpVal, description: e.target.value })} placeholder="Descrição" rows={2} />
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input type="checkbox" checked={editingExpVal.current || false} onChange={e => setEditingExpVal({ ...editingExpVal, current: e.target.checked })} />
                      Emprego atual
                    </label>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => saveExp(i)}><Check className="h-4 w-4 mr-1" /> Salvar</Button>
                      <Button size="sm" variant="ghost" onClick={() => setEditingExpIdx(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  <div key={i} className="flex gap-3 group">
                    <div className="mt-1 p-2 bg-indigo-50 rounded-lg shrink-0">
                      <Briefcase className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-sm">{exp.title}</h4>
                        {(exp as any).current && <Badge variant="secondary" className="text-xs">Atual</Badge>}
                      </div>
                      <p className="text-gray-600 text-sm">{exp.company}</p>
                      <p className="text-gray-400 text-xs">{exp.period}</p>
                      {(exp as any).description && <p className="text-gray-500 text-sm mt-1">{(exp as any).description}</p>}
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => startEditExp(i)} className="p-1 hover:text-blue-600 text-gray-400">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button onClick={() => removeExp(i)} className="p-1 hover:text-red-600 text-gray-400">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              )
            ) : (
              <p className="text-gray-400 italic text-sm">Nenhuma experiência adicionada ainda.</p>
            )}
          </CardContent>
        </Card>

        {/* ── Portfolio Carousel ── */}
        <PortfolioCarousel />

        {/* ── Education ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2"><GraduationCap className="h-5 w-5 text-indigo-600" /> Formação Acadêmica</CardTitle>
            <Dialog>
              <DialogTrigger asChild><Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Formação</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Instituição</Label><Input value={newEdu.institution} onChange={e => setNewEdu({ ...newEdu, institution: e.target.value })} placeholder="Ex: USP" className="mt-1" /></div>
                  <div><Label>Grau</Label><Input value={newEdu.degree} onChange={e => setNewEdu({ ...newEdu, degree: e.target.value })} placeholder="Ex: Bacharelado" className="mt-1" /></div>
                  <div><Label>Área</Label><Input value={newEdu.field} onChange={e => setNewEdu({ ...newEdu, field: e.target.value })} placeholder="Ex: Ciência da Computação" className="mt-1" /></div>
                  <div><Label>Período</Label><Input value={newEdu.period} onChange={e => setNewEdu({ ...newEdu, period: e.target.value })} placeholder="Ex: 2018 - 2022" className="mt-1" /></div>
                  <div><Label>Descrição</Label><Textarea value={newEdu.description} onChange={e => setNewEdu({ ...newEdu, description: e.target.value })} rows={2} className="mt-1" /></div>
                  <Button onClick={addEdu} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {(currentUser.education?.length || 0) > 0 ? currentUser.education!.map((edu, i) =>
              editingEduIdx === i ? (
                <div key={i} className="space-y-2 border rounded-lg p-3 bg-gray-50">
                  <Input value={editingEduVal.institution} onChange={e => setEditingEduVal({ ...editingEduVal, institution: e.target.value })} placeholder="Instituição" />
                  <Input value={editingEduVal.degree} onChange={e => setEditingEduVal({ ...editingEduVal, degree: e.target.value })} placeholder="Grau" />
                  <Input value={editingEduVal.field} onChange={e => setEditingEduVal({ ...editingEduVal, field: e.target.value })} placeholder="Área" />
                  <Input value={editingEduVal.period} onChange={e => setEditingEduVal({ ...editingEduVal, period: e.target.value })} placeholder="Período" />
                  <Textarea value={editingEduVal.description} onChange={e => setEditingEduVal({ ...editingEduVal, description: e.target.value })} rows={2} />
                  <div className="flex gap-2"><Button size="sm" onClick={() => saveEdu(i)}><Check className="h-4 w-4 mr-1" />Salvar</Button><Button size="sm" variant="ghost" onClick={() => setEditingEduIdx(null)}>Cancelar</Button></div>
                </div>
              ) : (
                <div key={i} className="flex gap-3 group">
                  <div className="mt-1 p-2 bg-purple-50 rounded-lg shrink-0"><GraduationCap className="h-4 w-4 text-purple-600" /></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{edu.institution}</h4>
                    <p className="text-gray-600 text-sm">{edu.degree}{edu.field ? ` · ${edu.field}` : ''}</p>
                    <p className="text-gray-400 text-xs">{edu.period}</p>
                    {edu.description && <p className="text-gray-500 text-sm mt-1">{edu.description}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditEdu(i)} className="p-1 hover:text-blue-600 text-gray-400"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => removeEdu(i)} className="p-1 hover:text-red-600 text-gray-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )
            ) : <p className="text-gray-400 italic text-sm">Nenhuma formação adicionada ainda.</p>}
          </CardContent>
        </Card>

        {/* ── Certifications ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2"><Award className="h-5 w-5 text-yellow-600" /> Licenças e Certificados</CardTitle>
            <Dialog>
              <DialogTrigger asChild><Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Certificado</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Nome</Label><Input value={newCert.name} onChange={e => setNewCert({ ...newCert, name: e.target.value })} placeholder="Ex: AWS Solutions Architect" className="mt-1" /></div>
                  <div><Label>Emissor</Label><Input value={newCert.issuer} onChange={e => setNewCert({ ...newCert, issuer: e.target.value })} placeholder="Ex: Amazon Web Services" className="mt-1" /></div>
                  <div><Label>Data</Label><Input value={newCert.date} onChange={e => setNewCert({ ...newCert, date: e.target.value })} placeholder="Ex: Jan 2024" className="mt-1" /></div>
                  <div><Label>URL do Certificado</Label><Input value={newCert.url} onChange={e => setNewCert({ ...newCert, url: e.target.value })} placeholder="https://..." className="mt-1" /></div>
                  <Button onClick={addCert} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-3">
            {(currentUser.certifications?.length || 0) > 0 ? currentUser.certifications!.map((cert, i) =>
              editingCertIdx === i ? (
                <div key={i} className="space-y-2 border rounded-lg p-3 bg-gray-50">
                  <Input value={editingCertVal.name} onChange={e => setEditingCertVal({ ...editingCertVal, name: e.target.value })} placeholder="Nome" />
                  <Input value={editingCertVal.issuer} onChange={e => setEditingCertVal({ ...editingCertVal, issuer: e.target.value })} placeholder="Emissor" />
                  <Input value={editingCertVal.date} onChange={e => setEditingCertVal({ ...editingCertVal, date: e.target.value })} placeholder="Data" />
                  <Input value={editingCertVal.url || ''} onChange={e => setEditingCertVal({ ...editingCertVal, url: e.target.value })} placeholder="URL" />
                  <div className="flex gap-2"><Button size="sm" onClick={() => saveCert(i)}><Check className="h-4 w-4 mr-1" />Salvar</Button><Button size="sm" variant="ghost" onClick={() => setEditingCertIdx(null)}>Cancelar</Button></div>
                </div>
              ) : (
                <div key={i} className="flex gap-3 group">
                  <div className="mt-1 p-2 bg-yellow-50 rounded-lg shrink-0"><Award className="h-4 w-4 text-yellow-600" /></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{cert.name}</h4>
                    <p className="text-gray-600 text-sm">{cert.issuer}</p>
                    <p className="text-gray-400 text-xs">{cert.date}</p>
                    {cert.url && <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 text-xs hover:underline">Ver certificado</a>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditCert(i)} className="p-1 hover:text-blue-600 text-gray-400"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => removeCert(i)} className="p-1 hover:text-red-600 text-gray-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )
            ) : <p className="text-gray-400 italic text-sm">Nenhum certificado adicionado ainda.</p>}
          </CardContent>
        </Card>

        {/* ── Languages ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2"><Languages className="h-5 w-5 text-green-600" /> Idiomas</CardTitle>
            <Dialog>
              <DialogTrigger asChild><Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Idioma</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Idioma</Label><Input value={newLang.name} onChange={e => setNewLang({ ...newLang, name: e.target.value })} placeholder="Ex: Inglês" className="mt-1" /></div>
                  <div>
                    <Label>Nível</Label>
                    <select value={newLang.level} onChange={e => setNewLang({ ...newLang, level: e.target.value })} className="w-full mt-1 rounded-md border border-gray-300 p-2 text-sm">
                      <option value="">Selecione</option>
                      <option>Básico</option><option>Intermediário</option><option>Avançado</option><option>Fluente</option><option>Nativo</option>
                    </select>
                  </div>
                  <Button onClick={addLang} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {(currentUser.languages?.length || 0) > 0 ? (
              <div className="flex flex-wrap gap-2">
                {currentUser.languages!.map((lang, i) => (
                  <Badge key={i} variant="outline" className="px-3 py-1.5 group flex items-center gap-1">
                    {lang.name} · <span className="text-gray-500">{lang.level}</span>
                    <button onClick={() => removeLang(i)} className="ml-1 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"><X className="h-3 w-3" /></button>
                  </Badge>
                ))}
              </div>
            ) : <p className="text-gray-400 italic text-sm">Nenhum idioma adicionado ainda.</p>}
          </CardContent>
        </Card>

        {/* ── Volunteer ── */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="flex items-center gap-2"><Heart className="h-5 w-5 text-red-500" /> Voluntariado</CardTitle>
            <Dialog>
              <DialogTrigger asChild><Button variant="ghost" size="sm"><Plus className="h-4 w-4" /></Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle>Adicionar Voluntariado</DialogTitle></DialogHeader>
                <div className="space-y-3">
                  <div><Label>Função</Label><Input value={newVol.role} onChange={e => setNewVol({ ...newVol, role: e.target.value })} placeholder="Ex: Instrutor" className="mt-1" /></div>
                  <div><Label>Organização</Label><Input value={newVol.organization} onChange={e => setNewVol({ ...newVol, organization: e.target.value })} placeholder="Ex: ONG Educação+" className="mt-1" /></div>
                  <div><Label>Período</Label><Input value={newVol.period} onChange={e => setNewVol({ ...newVol, period: e.target.value })} placeholder="Ex: 2022 - Presente" className="mt-1" /></div>
                  <div><Label>Descrição</Label><Textarea value={newVol.description} onChange={e => setNewVol({ ...newVol, description: e.target.value })} rows={2} className="mt-1" /></div>
                  <Button onClick={addVol} className="w-full">Adicionar</Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {(currentUser.volunteer?.length || 0) > 0 ? currentUser.volunteer!.map((vol, i) =>
              editingVolIdx === i ? (
                <div key={i} className="space-y-2 border rounded-lg p-3 bg-gray-50">
                  <Input value={editingVolVal.role} onChange={e => setEditingVolVal({ ...editingVolVal, role: e.target.value })} placeholder="Função" />
                  <Input value={editingVolVal.organization} onChange={e => setEditingVolVal({ ...editingVolVal, organization: e.target.value })} placeholder="Organização" />
                  <Input value={editingVolVal.period} onChange={e => setEditingVolVal({ ...editingVolVal, period: e.target.value })} placeholder="Período" />
                  <Textarea value={editingVolVal.description} onChange={e => setEditingVolVal({ ...editingVolVal, description: e.target.value })} rows={2} />
                  <div className="flex gap-2"><Button size="sm" onClick={() => saveVol(i)}><Check className="h-4 w-4 mr-1" />Salvar</Button><Button size="sm" variant="ghost" onClick={() => setEditingVolIdx(null)}>Cancelar</Button></div>
                </div>
              ) : (
                <div key={i} className="flex gap-3 group">
                  <div className="mt-1 p-2 bg-red-50 rounded-lg shrink-0"><Heart className="h-4 w-4 text-red-500" /></div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{vol.role}</h4>
                    <p className="text-gray-600 text-sm">{vol.organization}</p>
                    <p className="text-gray-400 text-xs">{vol.period}</p>
                    {vol.description && <p className="text-gray-500 text-sm mt-1">{vol.description}</p>}
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => startEditVol(i)} className="p-1 hover:text-blue-600 text-gray-400"><Edit className="h-4 w-4" /></button>
                    <button onClick={() => removeVol(i)} className="p-1 hover:text-red-600 text-gray-400"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              )
            ) : <p className="text-gray-400 italic text-sm">Nenhum voluntariado adicionado ainda.</p>}
          </CardContent>
        </Card>

        {/* ── Contact Dialog ── */}
        <Dialog open={isEditingContact} onOpenChange={open => !open && setIsEditingContact(false)}>
          <DialogContent>
            <DialogHeader><DialogTitle>Editar Informações de Contato</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Título Profissional</Label><Input value={contactForm.headline} onChange={e => setContactForm({ ...contactForm, headline: e.target.value })} placeholder="Ex: Desenvolvedor Full Stack | React" className="mt-1" /></div>
              <div><Label>Localização</Label><Input value={contactForm.location} onChange={e => setContactForm({ ...contactForm, location: e.target.value })} placeholder="Ex: São Paulo, SP" className="mt-1" /></div>
              <div><Label>Site Pessoal</Label><Input value={contactForm.website} onChange={e => setContactForm({ ...contactForm, website: e.target.value })} placeholder="https://meusite.com" className="mt-1" /></div>
              <div><Label>Telefone</Label><Input value={contactForm.phone} onChange={e => setContactForm({ ...contactForm, phone: e.target.value })} placeholder="(11) 99999-9999" className="mt-1" /></div>
              <div className="flex gap-2 justify-end">
                <Button variant="ghost" onClick={() => setIsEditingContact(false)}>Cancelar</Button>
                <Button onClick={saveContact}><Check className="h-4 w-4 mr-1" />Salvar</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
