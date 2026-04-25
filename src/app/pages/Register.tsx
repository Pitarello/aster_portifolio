import { useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Network, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import emailjs from '@emailjs/browser';

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
      try {
        // As chaves informadas
        const publicKey = 'zF02pHZqSrINPNCAw'; 
        // d5i6PXXmz9U6FEppycaHt parece ser o seu Service ID ou Template ID. 
        // Substitua os campos abaixo com os valores exatos do seu painel EmailJS:
        const serviceId = 'SEU_SERVICE_ID'; // ex: service_xxx
        const templateId = 'd5i6PXXmz9U6FEppycaHt'; // Usando o segundo c├│digo que voc├¬ enviou como Template ID, troque se necess├írio.

        // Par├ómetros que v├úo ser injetados no seu modelo de email (ajuste de acordo com as vari├íveis no seu template no EmailJS)
        const templateParams = {
          to_name: formData.name,
          to_email: formData.email,
          message: 'Bem-vindo(a) ├á vers├úo Beta da ASTER! Estamos muito felizes em ter voc├¬ conosco na nossa rede gamificada.',
        };

        await emailjs.send(serviceId, templateId, templateParams, publicKey);

        toast.success('Conta criada com sucesso!', {
          description: `Enviamos um e-mail de boas-vindas para ${formData.email} agradecendo por participar da nossa vers├úo Beta! ­ƒÄë`,
          duration: 5000,
        });
      } catch (error) {
        console.error('Erro ao enviar e-mail:', error);
        toast.error('Conta criada, mas houve um erro ao enviar o e-mail de boas-vindas.');
      }

      setTimeout(() => {
        navigate('/feed');
      }, 2000);
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4 relative">
      <div className="absolute top-4 left-4 z-10">
        <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Voltar para o In├¡cio
        </Button>
      </div>
      <Card className="w-full max-w-md mt-10">
        <CardHeader className="space-y-1">
          <Link to="/" className="flex flex-col items-center justify-center mb-4 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="bg-indigo-600 p-3 rounded-full mb-4">
              <Network className="h-8 w-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-center">Criar Conta na ASTER</CardTitle>
          </Link>
          <CardDescription className="text-center">
            Junte-se ├á comunidade profissional na vers├úo Beta
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleRegister}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <Input
                id="name"
                placeholder="Jo├úo Silva"
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
                placeholder="ÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇóÔÇó"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="area">├ürea de Atua├º├úo</Label>
              <Select
                value={formData.area}
                onValueChange={(value) => setFormData({ ...formData, area: value as any })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione sua ├írea" />
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
              J├í tem uma conta?{' '}
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
