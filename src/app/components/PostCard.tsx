import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Separator } from './ui/separator';
import { Heart, MessageCircle, Share2, Send } from 'lucide-react';
import type { Post } from '../context/AppContext';

interface PostCardProps {
  post: Post;
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

export function PostCard({ post }: PostCardProps) {
  const { currentUser, likePost, addComment } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  if (!currentUser) return null;

  const formatTimestamp = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Agora há pouco';
    if (hours === 1) return '1 hora atrás';
    if (hours < 24) return `${hours} horas atrás`;
    const days = Math.floor(hours / 24);
    if (days === 1) return '1 dia atrás';
    return `${days} dias atrás`;
  };

  const handleAddComment = () => {
    if (commentText.trim()) {
      addComment(post.id, commentText);
      setCommentText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddComment();
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src={post.userAvatar} />
            <AvatarFallback>{post.userName[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="font-semibold">{post.userName}</h4>
              <Badge className={`${areaColors[post.userArea]} text-xs`}>
                {areaLabels[post.userArea]}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="whitespace-pre-wrap">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="w-full rounded-lg object-cover max-h-96"
          />
        )}
        
        {/* Actions */}
        <div className="flex items-center gap-6 pt-2 border-t">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => likePost(post.id)}
            className={post.likedBy.includes(currentUser.id) ? 'text-red-600' : ''}
          >
            <Heart
              className={`h-4 w-4 mr-2 ${
                post.likedBy.includes(currentUser.id) ? 'fill-current' : ''
              }`}
            />
            {post.likes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Compartilhar
          </Button>
        </div>

        {/* Comments Section */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            {/* Add Comment */}
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Escreva um comentário..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <Button 
                  size="sm" 
                  onClick={handleAddComment}
                  disabled={!commentText.trim()}
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Comments List */}
            {post.comments.length > 0 && (
              <div className="space-y-4">
                <Separator />
                {post.comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.userAvatar} />
                      <AvatarFallback>{comment.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <p className="font-semibold text-sm">{comment.userName}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <p className="text-xs text-gray-500 mt-1 ml-3">
                        {formatTimestamp(comment.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
