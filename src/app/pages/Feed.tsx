import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { ProfileSearch } from '../components/ProfileSearch';
import { PostCard } from '../components/PostCard';
import { Navbar } from '../components/Navbar';
import { ConnectionsSuggestions } from '../components/ConnectionsSuggestions';
import { 
  Home, 
  User, 
  Briefcase, 
  LogOut, 
  Heart, 
  MessageCircle, 
  Share2, 
  Image as ImageIcon,
  Network,
  TrendingUp,
  Send
} from 'lucide-react';

export default function Feed() {
  const navigate = useNavigate();
  const { currentUser, logout, posts, createPost, likePost } = useApp();
  const [newPostContent, setNewPostContent] = useState('');
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) {
    return null;
  }

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      createPost(newPostContent);
      setNewPostContent('');
      setShowCreatePost(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
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
        {/* User Info Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="font-semibold">{currentUser.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={areaColors[currentUser.area]}>
                    {areaLabels[currentUser.area]}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    Score: {currentUser.professionalScore}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Create Post */}
        <Card>
          <CardContent className="pt-6">
            {!showCreatePost ? (
              <Button
                variant="outline"
                className="w-full justify-start text-gray-500"
                onClick={() => setShowCreatePost(true)}
              >
                Compartilhe uma atualização...
              </Button>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Compartilhe suas conquistas, projetos ou ideias..."
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <Button variant="ghost" size="sm">
                    <ImageIcon className="h-4 w-4 mr-2" />
                    Adicionar imagem
                  </Button>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setShowCreatePost(false);
                        setNewPostContent('');
                      }}
                    >
                      Cancelar
                    </Button>
                    <Button size="sm" onClick={handleCreatePost}>
                      Publicar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Layout: Feed + Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Posts Feed */}
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <ProfileSearch />
            <ConnectionsSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
}