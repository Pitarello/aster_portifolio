import { useNavigate, useLocation } from 'react-router';
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
  const location = useLocation();
  const { currentUser, logout } = useApp();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  const navBtn = (path: string, icon: React.ReactNode, label: string, extraClass = '') => {
    const active = isActive(path);
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(path)}
        className={`transition-none ${active
          ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700'
          : `text-gray-600 hover:text-gray-900 hover:bg-gray-100 ${extraClass}`
        }`}
      >
        {icon}
        <span className="hidden sm:inline">{label}</span>
      </Button>
    );
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/feed')}>
          <Network className="h-6 w-6 text-indigo-600" />
          <span className="font-semibold text-lg hidden sm:inline">ASTER</span>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar">
          {currentUser && (
            <Badge variant="secondary" className="mr-2 bg-yellow-50 text-yellow-700 border-yellow-200 flex items-center gap-1 shrink-0">
              <Award className="w-3.5 h-3.5" />
              <span>{currentUser.professionalScore} <span className="hidden sm:inline">pts</span></span>
            </Badge>
          )}

          {navBtn('/feed', <Home className="h-4 w-4 sm:mr-2" />, 'Feed')}
          {navBtn('/learning', <BookOpen className="h-4 w-4 sm:mr-2" />, 'Aprender')}
          {navBtn('/profile', <User className="h-4 w-4 sm:mr-2" />, 'Perfil')}
          {navBtn('/portfolio', <Briefcase className="h-4 w-4 sm:mr-2" />, 'Portf├│lio')}

          {currentUser?.role === 'admin' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin')}
              className={`transition-none ${isActive('/admin')
                ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-50 hover:text-indigo-700'
                : 'text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50'
              }`}
            >
              <Settings className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          )}

          {currentUser?.role === 'partner' && currentUser?.partnerStatus === 'approved' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/partner')}
              className={`transition-none ${isActive('/partner')
                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700'
                : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Briefcase className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Parceiro</span>
            </Button>
          )}

          {currentUser && currentUser?.role !== 'admin' && currentUser?.role !== 'partner' && currentUser?.partnerStatus !== 'pending' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/apply-partner')}
              className={`transition-none ${isActive('/apply-partner')
                ? 'bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-blue-700'
                : 'text-blue-600 hover:text-blue-700 hover:bg-blue-50'
              }`}
            >
              <Award className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Seja Parceiro</span>
            </Button>
          )}

          {currentUser?.partnerStatus === 'pending' && (
            <Badge variant="outline" className="hidden sm:inline-flex border-yellow-200 bg-yellow-50 text-yellow-700 shrink-0">
              Parceiro em An├ílise
            </Badge>
          )}

          {currentUser ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-600 hover:text-gray-900">
              <LogOut className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate('/login')} className="text-gray-600 hover:text-gray-900">
              <User className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Entrar</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
