import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  Home, 
  User, 
  Briefcase, 
  LogOut, 
  Network,
  TrendingUp,
  Users,
  UserPlus,
  UserMinus,
  ArrowLeft
} from 'lucide-react';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser, getUserById, logout, followUser, unfollowUser, isFollowing } = useApp();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const user = getUserById(userId || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Usuário não encontrado</h3>
            <Button onClick={() => navigate('/feed')}>Voltar ao Feed</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFollowToggle = () => {
    if (isFollowing(user.id)) {
      unfollowUser(user.id);
    } else {
      followUser(user.id);
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
        {/* Back Button */}
        <Button variant="ghost" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>

        {/* Cover & Profile Picture */}
        <Card>
          <div className="relative">
            <div 
              className="h-48 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-t-lg"
              style={{ backgroundImage: `url(${user.coverImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            <div className="absolute -bottom-16 left-6">
              <Avatar className="h-32 w-32 border-4 border-white">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name[0]}</AvatarFallback>
              </Avatar>
            </div>
          </div>
          <CardContent className="pt-20">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-semibold">{user.name}</h2>
                <p className="text-gray-600 mt-1">{user.email}</p>
                <div className="flex items-center gap-3 mt-3">
                  <Badge className={areaColors[user.area]}>
                    {areaLabels[user.area]}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm">
                    <TrendingUp className="h-4 w-4 text-indigo-600" />
                    <span className="font-semibold">{user.professionalScore}</span>
                    <span className="text-gray-500">Score Profissional</span>
                  </div>
                </div>
                <div className="flex items-center gap-6 mt-3 text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span><strong>{user.followersIds.length}</strong> seguidores</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span><strong>{user.followingIds.length}</strong> seguindo</span>
                  </div>
                </div>
              </div>
              <Button onClick={handleFollowToggle} variant={isFollowing(user.id) ? 'outline' : 'default'}>
                {isFollowing(user.id) ? (
                  <>
                    <UserMinus className="h-4 w-4 mr-2" />
                    Deixar de seguir
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Seguir
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Bio */}
        <Card>
          <CardHeader>
            <CardTitle>Sobre</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">
              {user.bio || 'Este usuário ainda não adicionou uma descrição.'}
            </p>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader>
            <CardTitle>Habilidades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {user.skills.length > 0 ? (
                user.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5">
                    {skill}
                  </Badge>
                ))
              ) : (
                <p className="text-gray-500">Nenhuma habilidade adicionada.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card>
          <CardHeader>
            <CardTitle>Experiência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {user.experiences.length > 0 ? (
              user.experiences.map((exp, index) => (
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
              <p className="text-gray-500">Nenhuma experiência adicionada.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
