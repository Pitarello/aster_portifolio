import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { UserPlus } from 'lucide-react';

export function ConnectionsSuggestions() {
  const navigate = useNavigate();
  const { getAllUsers, currentUser, followUser, isFollowing } = useApp();

  if (!currentUser) return null;

  // Get users that the current user is not following
  const suggestions = getAllUsers()
    .filter(u => u.id !== currentUser.id && !isFollowing(u.id))
    .slice(0, 3);

  if (suggestions.length === 0) {
    return null;
  }

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Sugestões de Conexão</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestions.map((user) => (
          <div key={user.id} className="flex items-center gap-3">
            <Avatar 
              className="h-12 w-12 cursor-pointer" 
              onClick={() => navigate(`/user/${user.id}`)}
            >
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p 
                className="font-medium text-sm truncate cursor-pointer hover:underline"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                {user.name}
              </p>
              <Badge className={`${areaColors[user.area]} text-xs mt-1`}>
                {areaLabels[user.area]}
              </Badge>
            </div>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => followUser(user.id)}
            >
              <UserPlus className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
