import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Search, TrendingUp } from 'lucide-react';

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

export function ProfileSearch() {
  const navigate = useNavigate();
  const { getAllUsers, currentUser } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  
  const allUsers = getAllUsers().filter(u => u.id !== currentUser?.id);
  
  const filteredUsers = allUsers.filter(user => {
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.area.toLowerCase().includes(query) ||
      user.skills.some(skill => skill.toLowerCase().includes(query))
    );
  });

  const displayUsers = searchQuery ? filteredUsers : allUsers.slice(0, 5);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Descobrir Profissionais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nome, área ou skill..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="space-y-3">
          {displayUsers.length > 0 ? (
            displayUsers.map((user) => (
              <div 
                key={user.id} 
                className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{user.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge className={`${areaColors[user.area]} text-xs`}>
                      {areaLabels[user.area]}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <TrendingUp className="h-3 w-3" />
                      {user.professionalScore}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">
              Nenhum profissional encontrado
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}