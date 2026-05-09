import { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Card, CardContent, CardHeader } from './ui/card';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Separator } from './ui/separator';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Heart, MessageCircle, Share2, Send, MoreHorizontal, Pencil, Trash2, X, ExternalLink, Image as ImageIcon, Video } from 'lucide-react';
import type { Post } from '../context/AppContext';

interface PostCardProps {
  post: Post;
}

const areaColors = {
  tech: 'bg-blue-100 text-blue-700',
  fashion: 'bg-pink-100 text-pink-700',
  architecture: 'bg-green-100 text-green-700'
};
const areaLabels = { tech: 'Tecnologia', fashion: 'Moda', architecture: 'Arquitetura' };

function isYouTube(url: string) {
  return /youtube\.com|youtu\.be/.test(url);
}
function isVimeo(url: string) {
  return /vimeo\.com/.test(url);
}
function getYouTubeEmbed(url: string) {
  const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
function getVimeoEmbed(url: string) {
  const match = url.match(/vimeo\.com\/(\d+)/);
  return match ? `https://player.vimeo.com/video/${match[1]}` : null;
}

export function PostCard({ post }: PostCardProps) {
  const { currentUser, likePost, addComment, updatePost, deletePost } = useApp();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [editImage, setEditImage] = useState(post.image || '');
  const [editVideo, setEditVideo] = useState(post.video || '');
  const [editLink, setEditLink] = useState(post.link || '');
  const [editLinkTitle, setEditLinkTitle] = useState(post.linkTitle || '');
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const isOwner = currentUser.id === post.userId;

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const h = Math.floor(diff / 3600000);
    if (h < 1) return 'Agora há pouco';
    if (h === 1) return '1 hora atrás';
    if (h < 24) return `${h} horas atrás`;
    const d = Math.floor(h / 24);
    return d === 1 ? '1 dia atrás' : `${d} dias atrás`;
  };

  const handleSaveEdit = () => {
    updatePost(post.id, {
      content: editContent,
      image: editImage || undefined,
      video: editVideo || undefined,
      link: editLink || undefined,
      linkTitle: editLinkTitle || undefined,
    });
    setEditing(false);
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditImage(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setEditVideo(reader.result as string);
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const renderVideo = (url: string) => {
    if (isYouTube(url)) {
      const embed = getYouTubeEmbed(url);
      if (embed) return <iframe src={embed} className="w-full aspect-video rounded-lg" allowFullScreen />;
    }
    if (isVimeo(url)) {
      const embed = getVimeoEmbed(url);
      if (embed) return <iframe src={embed} className="w-full aspect-video rounded-lg" allowFullScreen />;
    }
    // file upload or direct video URL
    return <video src={url} controls className="w-full max-h-72 rounded-lg" />;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarImage src={post.userAvatar} />
              <AvatarFallback>{post.userName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-semibold">{post.userName}</h4>
                <Badge className={`${areaColors[post.userArea]} text-xs`}>{areaLabels[post.userArea]}</Badge>
              </div>
              <p className="text-sm text-gray-500">{formatTimestamp(post.timestamp)}</p>
            </div>
          </div>

          {isOwner && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { setEditing(true); setEditContent(post.content); setEditImage(post.image || ''); setEditVideo(post.video || ''); setEditLink(post.link || ''); setEditLinkTitle(post.linkTitle || ''); }}>
                  <Pencil className="h-4 w-4 mr-2" /> Editar
                </DropdownMenuItem>
                <DropdownMenuItem className="text-red-600" onClick={() => deletePost(post.id)}>
                  <Trash2 className="h-4 w-4 mr-2" /> Excluir
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {editing ? (
          <div className="space-y-3">
            <Textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} className="resize-none" />

            {editImage && (
              <div className="relative">
                <img src={editImage} className="w-full max-h-48 object-cover rounded-lg" />
                <button onClick={() => setEditImage('')} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white"><X className="h-3 w-3" /></button>
              </div>
            )}
            {editVideo && (
              <div className="relative">
                {renderVideo(editVideo)}
                <button onClick={() => setEditVideo('')} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white"><X className="h-3 w-3" /></button>
              </div>
            )}

            <div className="space-y-2">
              <Input placeholder="Link externo (URL)" value={editLink} onChange={e => setEditLink(e.target.value)} />
              {editLink && <Input placeholder="Título do link" value={editLinkTitle} onChange={e => setEditLinkTitle(e.target.value)} />}
            </div>

            <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
            <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFile} />

            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="ghost" size="sm" onClick={() => imageRef.current?.click()}><ImageIcon className="h-4 w-4 mr-1" /> Imagem</Button>
              <Button variant="ghost" size="sm" onClick={() => videoRef.current?.click()}><Video className="h-4 w-4 mr-1" /> Vídeo</Button>
              <div className="flex-1" />
              <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>Cancelar</Button>
              <Button size="sm" onClick={handleSaveEdit}>Salvar</Button>
            </div>
          </div>
        ) : (
          <>
            {post.content && <p className="whitespace-pre-wrap">{post.content}</p>}

            {post.image && (
              <img src={post.image} alt="Post" className="w-full rounded-lg object-cover max-h-96" />
            )}

            {post.video && renderVideo(post.video)}

            {post.link && (
              <a
                href={post.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-gray-50 transition-colors group"
              >
                <ExternalLink className="h-4 w-4 text-indigo-600 shrink-0" />
                <span className="text-sm text-indigo-600 group-hover:underline truncate">
                  {post.linkTitle || post.link}
                </span>
              </a>
            )}
          </>
        )}

        {/* Actions */}
        <div className="flex items-center gap-6 pt-2 border-t">
          <Button
            variant="ghost" size="sm"
            onClick={() => likePost(post.id)}
            className={post.likedBy.includes(currentUser.id) ? 'text-red-600' : ''}
          >
            <Heart className={`h-4 w-4 mr-2 ${post.likedBy.includes(currentUser.id) ? 'fill-current' : ''}`} />
            {post.likes}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-4 w-4 mr-2" />
            {post.comments.length}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard?.writeText(window.location.href)}>
            <Share2 className="h-4 w-4 mr-2" /> Compartilhar
          </Button>
        </div>

        {/* Comments */}
        {showComments && (
          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-start gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex gap-2">
                <Input
                  placeholder="Escreva um comentário..."
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); if (commentText.trim()) { addComment(post.id, commentText); setCommentText(''); } } }}
                />
                <Button size="sm" onClick={() => { if (commentText.trim()) { addComment(post.id, commentText); setCommentText(''); } }} disabled={!commentText.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {post.comments.length > 0 && (
              <div className="space-y-4">
                <Separator />
                {post.comments.map(comment => (
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
                      <p className="text-xs text-gray-500 mt-1 ml-3">{formatTimestamp(comment.timestamp)}</p>
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
