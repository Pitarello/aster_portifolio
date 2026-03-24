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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { 
  Home, 
  User, 
  Briefcase, 
  LogOut, 
  Network,
  TrendingUp,
  Users,
  Edit,
  Plus,
  X,
  Camera,
  Image as ImageIcon,
  Trash2,
  Crop
} from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout, updateProfile } = useApp();
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [editedBio, setEditedBio] = useState(currentUser?.bio || '');
  const [newSkill, setNewSkill] = useState('');
  const [newExperience, setNewExperience] = useState({
    title: '',
    company: '',
    period: ''
  });

  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImage, setCropperImage] = useState('');
  const [cropperAspect, setCropperAspect] = useState(1);
  const [cropperTitle, setCropperTitle] = useState('');
  const [currentEditType, setCurrentEditType] = useState<'avatar' | 'cover' | null>(null);

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

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

  const handleSaveBio = () => {
    updateProfile({ bio: editedBio });
    setIsEditingBio(false);
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      const currentSkills = currentUser.skills || [];
      updateProfile({ skills: [...currentSkills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    const currentSkills = currentUser.skills || [];
    updateProfile({ skills: currentSkills.filter(s => s !== skillToRemove) });
  };

  const handleAddExperience = () => {
    if (newExperience.title && newExperience.company) {
      const currentExperiences = currentUser.experiences || [];
      updateProfile({ 
        experiences: [...currentExperiences, newExperience] 
      });
      setNewExperience({ title: '', company: '', period: '' });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'cover') => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setCropperImage(reader.result?.toString() || '');
        setCropperAspect(type === 'avatar' ? 1 : 16 / 9);
        setCropperTitle(type === 'avatar' ? 'Ajustar Foto de Perfil' : 'Ajustar Foto de Capa');
        setCurrentEditType(type);
        setCropperOpen(true);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    // reset input
    e.target.value = '';
  };

  const handleCropSave = (croppedImage: string) => {
    if (currentEditType === 'avatar') {
      updateProfile({ avatar: croppedImage });
    } else if (currentEditType === 'cover') {
      updateProfile({ coverImage: croppedImage });
    }
  };

  const handleEditCurrentPhoto = (type: 'avatar' | 'cover') => {
    const imageUrl = type === 'avatar' ? currentUser.avatar : currentUser.coverImage;
    if (imageUrl) {
      setCropperImage(imageUrl);
      setCropperAspect(type === 'avatar' ? 1 : 16 / 9);
      setCropperTitle(type === 'avatar' ? 'Ajustar Foto de Perfil' : 'Ajustar Foto de Capa');
      setCurrentEditType(type);
      setCropperOpen(true);
    }
  };

  const handleDeletePhoto = (type: 'avatar' | 'cover') => {
    if (type === 'avatar') {
      updateProfile({ avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200' });
    } else {
      updateProfile({ coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200' });
    }
  };

  const areaColors = {
    tech: 'bg-blue-100 text-blue-700',
    fashion: 'bg-pink-100 text-pink-700',
    architecture: 'bg-green-100 text-green-700'
  };

  const areaLabels = {
    tech: 'Tecnologia',
    fashion: 'Moda',
    architecture: 'Arquitetura'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Hidden File Inputs */}
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={avatarInputRef} 
          onChange={(e) => handleFileChange(e, 'avatar')} 
        />
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={coverInputRef} 
          onChange={(e) => handleFileChange(e, 'cover')} 
        />

        <ImageCropperDialog
          open={cropperOpen}
          imageSrc={cropperImage}
          aspect={cropperAspect}
          title={cropperTitle}
          onClose={() => setCropperOpen(false)}
          onCropSave={handleCropSave}
        />

        {/* Cover & Profile Picture */}
        <Card>
          <div className="relative group">
            <div 
              className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg transition-opacity"
              style={{ backgroundImage: `url(${currentUser.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            {/* Cover Edit Button */}
            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="secondary" size="sm" className="bg-white/80 hover:bg-white text-gray-800">
                    <Camera className="h-4 w-4 mr-2" />
                    Editar Capa
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => coverInputRef.current?.click()}>
                    <ImageIcon className="h-4 w-4 mr-2" /> Fazer upload
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleEditCurrentPhoto('cover')}>
                    <Crop className="h-4 w-4 mr-2" /> Ajustar imagem
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePhoto('cover')}>
                    <Trash2 className="h-4 w-4 mr-2" /> Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="absolute -bottom-16 left-6 group/avatar">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white">
                  <AvatarImage src={currentUser.avatar} />
                  <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
                </Avatar>
                
                {/* Avatar Edit Button */}
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
                    <DropdownMenuItem onClick={() => handleEditCurrentPhoto('avatar')}>
                      <Crop className="h-4 w-4 mr-2" /> Ajustar foto
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleDeletePhoto('avatar')}>
                      <Trash2 className="h-4 w-4 mr-2" /> Remover
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <CardContent className="pt-20">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{currentUser.name}</h2>
                <p className="text-gray-600 mt-1">{currentUser.email}</p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className={areaColors[currentUser.area]}>
                    {areaLabels[currentUser.area]}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span className="font-semibold">{currentUser.professionalScore}</span>
                    <span className="text-gray-500">Score Profissional</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-3 text-sm">
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
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Sobre</CardTitle>
            <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(!isEditingBio)}>
              <Edit className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isEditingBio ? (
              <div className="space-y-4">
                <Textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  placeholder="Conte sobre você, suas experiências e objetivos..."
                  rows={4}
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditingBio(false)}>
                    Cancelar
                  </Button>
                  <Button size="sm" onClick={handleSaveBio}>
                    Salvar
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">
                {currentUser.bio || 'Adicione uma descrição sobre você...'}
              </p>
            )}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Habilidades</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Habilidade</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="skill">Nome da Habilidade</Label>
                    <Input
                      id="skill"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Ex: React, Design Thinking..."
                    />
                  </div>
                  <Button onClick={handleAddSkill} className="w-full">
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {(currentUser.skills?.length || 0) > 0 ? (
                currentUser.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5">
                    {skill}
                    <button
                      onClick={() => handleRemoveSkill(skill)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma habilidade adicionada ainda.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Experiência</CardTitle>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Experiência</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="title">Cargo</Label>
                    <Input
                      id="title"
                      value={newExperience.title}
                      onChange={(e) => setNewExperience({ ...newExperience, title: e.target.value })}
                      placeholder="Ex: Desenvolvedor Senior"
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Empresa</Label>
                    <Input
                      id="company"
                      value={newExperience.company}
                      onChange={(e) => setNewExperience({ ...newExperience, company: e.target.value })}
                      placeholder="Ex: Tech Corp"
                    />
                  </div>
                  <div>
                    <Label htmlFor="period">Período</Label>
                    <Input
                      id="period"
                      value={newExperience.period}
                      onChange={(e) => setNewExperience({ ...newExperience, period: e.target.value })}
                      placeholder="Ex: 2020 - Presente"
                    />
                  </div>
                  <Button onClick={handleAddExperience} className="w-full">
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent className="space-y-4">
            {(currentUser.experiences?.length || 0) > 0 ? (
              currentUser.experiences.map((exp, index) => (
                <div key={index} className="flex gap-3">
                  <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                  <div>
                    <h4 className="font-semibold">{exp.title}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.period}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">Nenhuma experiência adicionada ainda.</p>
            )}
          </CardContent>
        </Card>

        {/* Portfolio Carousel */}
        <PortfolioCarousel />
      </div>
    </div>
  );
}