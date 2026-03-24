import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Network, Loader2, ArrowLeft } from 'lucide-react';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    area: 'tech' as 'tech' | 'fashion' | 'architecture'
  });
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const success = await register(formData);
    
    if (success) {
      navigate('/feed');
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para o Início
        </Button>
      </div>
      <Card className="w-full max-w-md mt-10">
        <CardHeader className="space-y-1">
          <Link to="/" className="flex flex-col items-center justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 p-3 rounded-full mb-4">
              <Network className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-center">Criar Conta na ProNetwork</CardTitle>
          </Link>
          <CardDescription className="text-center">
            Junte-se à comunidade profissional
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="João Silva"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">Área de Atuação</Label>
              <Select
                value={formData.area}
                onValueChange={(value) => setFormData({ ...formData, area: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Tecnologia</SelectItem>
                  <SelectItem value="fashion">Moda</SelectItem>
                  <SelectItem value="architecture">Arquitetura</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Criando conta...
                </>
              ) : (
                'Criar Conta'
              )}
            </Button>
            <div className="text-sm text-center text-gray-600">
              Já tem uma conta?{' '}
              <Link to="/login" className="text-indigo-600 hover:underline">
                Entrar
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
