import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useApp } from '../context/AppContext';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { 
  TrendingUp, Users, UserPlus, UserMinus, ArrowLeft, Briefcase,
  ChevronLeft, ChevronRight, ExternalLink
} from 'lucide-react';

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { currentUser, getUserById, logout, followUser, unfollowUser, isFollowing, getPortfolioByUserId } = useApp();
  const [carouselIdx, setCarouselIdx] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const user = getUserById(userId || '');
  const userPortfolio = getPortfolioByUserId(userId || '');

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Usu├írio n├úo encontrado</h3>
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
              {user.bio || 'Este usu├írio ainda n├úo adicionou uma descri├º├úo.'}
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
            <CardTitle>Experi├¬ncia</CardTitle>
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
              <p className="text-gray-500">Nenhuma experi├¬ncia adicionada.</p>
            )}
          </CardContent>
        </Card>

        {/* Portfolio */}
        {userPortfolio.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Portf├│lio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userPortfolio.map(project => {
                  const proj = project as any;
                  const imgs: string[] = proj.images?.length ? proj.images : (proj.image ? [proj.image] : []);
                  const idx = carouselIdx[project.id] || 0;
                  return (
                    <div key={project.id} className="rounded-xl overflow-hidden border bg-white shadow-sm">
                      {/* Carousel */}
                      <div className="relative bg-gray-100">
                        {imgs.length > 0 ? (
                          <img src={imgs[idx]} alt={project.title} className="w-full h-48 object-cover" />
                        ) : (
                          <div className="w-full h-48 flex items-center justify-center text-gray-400">
                            <Briefcase className="h-10 w-10" />
                          </div>
                        )}
                        {imgs.length > 1 && (
                          <>
                            <button onClick={() => setCarouselIdx(s => ({ ...s, [project.id]: (idx - 1 + imgs.length) % imgs.length }))}
                              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white">
                              <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button onClick={() => setCarouselIdx(s => ({ ...s, [project.id]: (idx + 1) % imgs.length }))}
                              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-black/50 rounded-full text-white">
                              <ChevronRight className="h-4 w-4" />
                            </button>
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                              {imgs.map((_, i) => (
                                <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === idx ? 'bg-white' : 'bg-white/40'}`} />
                              ))}
                            </div>
                          </>
                        )}
                      </div>
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold">{project.title}</h3>
                          <div className="flex gap-1 shrink-0">
                            {proj.link && (
                              <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            )}
                            {proj.githubUrl && (
                              <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900">
                                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/></svg>
                              </a>
                            )}
                          </div>
                        </div>
                        {project.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{project.description}</p>}
                        {project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {project.tags.map((tag, i) => (
                              <Badge key={i} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
