import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Home, 
  User, 
  Briefcase, 
  BookOpen,
  LogOut, 
  Network,
  Award,
  Settings
} from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/feed')}>
          <Network className="h-6 w-6 text-indigo-600" />
          <span className="font-semibold text-lg hidden sm:inline">ProNetwork</span>
        </div>
        <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar">
          {currentUser && (
            <Badge variant="secondary" className="mr-2 bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>{currentUser.professionalScore} <span className="hidden sm:inline">pts</span></span>
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={() => navigate('/feed')}>
            <Home className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Feed</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/learning')}>
            <BookOpen className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Aprender</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/profile')}>
            <User className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Perfil</span>
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigate('/portfolio')}>
            <Briefcase className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Portfólio</span>
          </Button>
          {currentUser?.role === 'admin' && (
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700" onClick={() => navigate('/admin')}>
              <Settings className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          )}
          {currentUser?.role === 'partner' && currentUser?.partnerStatus === 'approved' && (
            <Button variant="ghost" size="sm" className="text-emerald-600 hover:text-emerald-700" onClick={() => navigate('/partner')}>
              <Briefcase className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Parceiro</span>
            </Button>
          )}
          {(!currentUser || currentUser?.role === 'user' || currentUser?.role === undefined) && currentUser?.partnerStatus !== 'pending' && (
            <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700" onClick={() => navigate('/apply-partner')}>
              <Award className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Seja Parceiro</span>
            </Button>
          )}
          {currentUser?.partnerStatus === 'pending' && (
            <Badge variant="outline" className="hidden sm:inline-flex border-yellow-200 bg-yellow-50 text-yellow-700">
              Parceiro em Análise
            </Badge>
          )}
          {currentUser ? (
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
              <User className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
