import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Navbar } from '../components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
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

const portfolioCategories = {
  tech: [
    { value: 'web', label: 'Web Development' },
    { value: 'mobile', label: 'Mobile App' },
    { value: 'backend', label: 'Backend' },
    { value: 'devops', label: 'DevOps' },
    { value: 'ai', label: 'AI/ML' }
  ],
  fashion: [
    { value: 'collection', label: 'Coleção' },
    { value: 'editorial', label: 'Editorial' },
    { value: 'sustainable', label: 'Sustentável' },
    { value: 'accessories', label: 'Acessórios' },
    { value: 'runway', label: 'Passarela' }
  ],
  architecture: [
    { value: 'residential', label: 'Residencial' },
    { value: 'commercial', label: 'Comercial' },
    { value: 'urban', label: 'Urbanismo' },
    { value: 'interior', label: 'Design de Interiores' },
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
    </div>
  );
}
