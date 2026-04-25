import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Award, Briefcase, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function ApplyPartner() {
  const { currentUser, applyForPartner } = useApp();
  const navigate = useNavigate();
  
  const [companyName, setCompanyName] = useState('');
  const [corporateName, setCorporateName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [description, setDescription] = useState('');

  // Se n├úo estiver logado, n├úo tem currentUser. 
  // Removendo o redirecionamento for├ºado para o login e exibindo navbar ou botao de voltar

  useEffect(() => {
    if (currentUser?.partnerStatus === 'approved') {
      navigate('/partner');
    } else if (currentUser?.role === 'admin') {
      navigate('/admin');
    }
  }, [currentUser, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast.error('Voc├¬ precisa fazer login para se inscrever.');
      navigate('/login');
      return;
    }
    
    if (!companyName || !corporateName || !cnpj || !description) {
      toast.error('Preencha todos os campos.');
      return;
    }
    // Basic CNPJ format validation (14 digits)
    const cnpjDigits = cnpj.replace(/\D/g, '');
    if (cnpjDigits.length !== 14) {
      toast.error('CNPJ inv├ílido. Informe os 14 d├¡gitos.');
      return;
    }
    applyForPartner(companyName, corporateName, description);
    toast.success('Solicita├º├úo enviada com sucesso! Aguarde a avalia├º├úo.');
    navigate('/feed');
  };

  if (currentUser?.partnerStatus === 'pending') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-10 pb-10">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Solicita├º├úo em An├ílise</h2>
              <p className="text-gray-500 mb-6">
                Sua solicita├º├úo para se tornar um parceiro ASTER est├í sendo avaliada por nossos administradores. Avisaremos assim que houver uma resposta.
              </p>
              <Button onClick={() => navigate('/feed')}>Voltar para o Feed</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (currentUser?.partnerStatus === 'rejected') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <CardContent className="pt-10 pb-10">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Solicita├º├úo Rejeitada</h2>
              <p className="text-gray-500 mb-6">
                Infelizmente sua solicita├º├úo n├úo foi aprovada neste momento. Continue interagindo com a comunidade e tente novamente no futuro.
              </p>
              <Button onClick={() => navigate('/feed')}>Voltar para o Feed</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      {currentUser ? <Navbar /> : (
        <div className="absolute top-4 left-4 z-10">
          <Button variant="ghost" onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
        </div>
      )}
      
      <div className="flex-1 flex items-center justify-center p-4 pt-16">
        <Card className="max-w-xl w-full">
          <CardHeader className="text-center pb-2">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Torne-se um Parceiro</CardTitle>
            <p className="text-gray-500 mt-2">
              Compartilhe seu conhecimento, crie cursos e trilhas de aprendizado exclusivas para a comunidade ASTER.
            </p>
          </CardHeader>
          <CardContent>
            {!currentUser && (
              <div className="bg-blue-50 text-blue-800 p-4 rounded-md mb-6 text-sm text-center">
                Voc├¬ precisar├í fazer login ou criar uma conta para concluir esta solicita├º├úo.
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6 mt-4">
              <div className="space-y-2">
                <Label>Nome Fantasia (Nome da Empresa ou Institui├º├úo)</Label>
                <Input 
                  placeholder="Ex: Tech StartX" 
                  value={companyName} 
                  onChange={e => setCompanyName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>Raz├úo Social</Label>
                <Input 
                  placeholder="Ex: Tech StartX Solu├º├Áes LTDA" 
                  value={corporateName} 
                  onChange={e => setCorporateName(e.target.value)} 
                />
              </div>
              <div className="space-y-2">
                <Label>CNPJ</Label>
                <Input 
                  placeholder="00.000.000/0000-00" 
                  value={cnpj}
                  onChange={e => {
                    // Auto-format CNPJ
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 14);
                    const formatted = digits
                      .replace(/^(\d{2})(\d)/, '$1.$2')
                      .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
                      .replace(/\.(\d{3})(\d)/, '.$1/$2')
                      .replace(/(\d{4})(\d)/, '$1-$2');
                    setCnpj(formatted);
                  }}
                />
              </div>
              <div className="space-y-2">
                <Label>Por que voc├¬ quer ser parceiro?</Label>
                <Textarea 
                  placeholder="Conte-nos um pouco sobre os conte├║dos que voc├¬ pretende criar..." 
                  rows={4}
                  value={description} 
                  onChange={e => setDescription(e.target.value)} 
                />
              </div>
              <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                Enviar Solicita├º├úo
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
