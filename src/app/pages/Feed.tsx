// import { useState, useEffect, useRef } from 'react';
// import { useNavigate } from 'react-router';
// import { useApp } from '../context/AppContext';
// import { Button } from '../components/ui/button';
// import { Card, CardContent } from '../components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
// import { Textarea } from '../components/ui/textarea';
// import { Badge } from '../components/ui/badge';
// import { Input } from '../components/ui/input';
// import { ProfileSearch } from '../components/ProfileSearch';
// import { PostCard } from '../components/PostCard';
// import { Navbar } from '../components/Navbar';
// import { ConnectionsSuggestions } from '../components/ConnectionsSuggestions';
// import { Image as ImageIcon, Video, Link as LinkIcon, X, TrendingUp } from 'lucide-react';

// export default function Feed() {
//   const navigate = useNavigate();
//   const { currentUser, posts, createPost } = useApp();
//   const [open, setOpen] = useState(false);
//   const [content, setContent] = useState('');
//   const [image, setImage] = useState('');
//   const [video, setVideo] = useState('');
//   const [link, setLink] = useState('');
//   const [linkTitle, setLinkTitle] = useState('');
//   const [tab, setTab] = useState<'image' | 'video' | 'link' | null>(null);
//   const imageRef = useRef<HTMLInputElement>(null);
//   const videoRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     if (!currentUser) navigate('/login');
//   }, [currentUser, navigate]);

//   if (!currentUser) return null;

//   const reset = () => {
//     setContent(''); setImage(''); setVideo(''); setLink(''); setLinkTitle(''); setTab(null); setOpen(false);
//   };

//   const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setImage(reader.result as string);
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const handleVideoFile = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onloadend = () => setVideo(reader.result as string);
//     reader.readAsDataURL(file);
//     e.target.value = '';
//   };

//   const handlePublish = () => {
//     if (!content.trim() && !image && !video && !link) return;
//     createPost(content, image || undefined, video || undefined, link || undefined, linkTitle || undefined);
//     reset();
//   };

//   const areaColors = { tech: 'bg-blue-100 text-blue-700', fashion: 'bg-pink-100 text-pink-700', architecture: 'bg-green-100 text-green-700' };
//   const areaLabels = { tech: 'Tecnologia', fashion: 'Moda', architecture: 'Arquitetura' };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

//         {/* User card */}
//         <Card>
//           <CardContent className="pt-6">
//             <div className="flex items-center gap-4">
//               <Avatar className="h-16 w-16">
//                 <AvatarImage src={currentUser.avatar} />
//                 <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
//               </Avatar>
//               <div>
//                 <h3 className="font-semibold">{currentUser.name}</h3>
//                 <div className="flex items-center gap-2 mt-1">
//                   <Badge className={areaColors[currentUser.area]}>{areaLabels[currentUser.area]}</Badge>
//                   <span className="flex items-center gap-1 text-sm text-gray-600">
//                     <TrendingUp className="h-4 w-4" /> Score: {currentUser.professionalScore}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Create post */}
//         <Card>
//           <CardContent className="pt-4 space-y-3">
//             {!open ? (
//               <button
//                 className="w-full text-left px-4 py-3 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors text-sm"
//                 onClick={() => setOpen(true)}
//               >
//                 Compartilhe uma atualização...
//               </button>
//             ) : (
//               <>
//                 <div className="flex gap-3">
//                   <Avatar className="h-9 w-9 shrink-0">
//                     <AvatarImage src={currentUser.avatar} />
//                     <AvatarFallback>{currentUser.name[0]}</AvatarFallback>
//                   </Avatar>
//                   <Textarea
//                     autoFocus
//                     placeholder="Compartilhe suas conquistas, projetos ou ideias..."
//                     value={content}
//                     onChange={e => setContent(e.target.value)}
//                     rows={3}
//                     className="resize-none"
//                   />
//                 </div>

//                 {/* Image preview */}
//                 {image && (
//                   <div className="relative">
//                     <img src={image} alt="preview" className="w-full max-h-64 object-cover rounded-lg" />
//                     <button onClick={() => setImage('')} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80">
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 )}

//                 {/* Video preview */}
//                 {video && (
//                   <div className="relative">
//                     <video src={video} controls className="w-full max-h-64 rounded-lg" />
//                     <button onClick={() => setVideo('')} className="absolute top-2 right-2 p-1 bg-black/60 rounded-full text-white hover:bg-black/80">
//                       <X className="h-4 w-4" />
//                     </button>
//                   </div>
//                 )}

//                 {/* Link input */}
//                 {tab === 'link' && (
//                   <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
//                     <Input placeholder="URL (ex: https://meusite.com)" value={link} onChange={e => setLink(e.target.value)} />
//                     <Input placeholder="Título do link (opcional)" value={linkTitle} onChange={e => setLinkTitle(e.target.value)} />
//                     {link && (
//                       <button onClick={() => { setLink(''); setLinkTitle(''); setTab(null); }} className="text-xs text-red-500 hover:underline">
//                         Remover link
//                       </button>
//                     )}
//                   </div>
//                 )}

//                 {/* Video URL input */}
//                 {tab === 'video' && !video && (
//                   <div className="space-y-2 p-3 bg-gray-50 rounded-lg border">
//                     <p className="text-xs text-gray-500 font-medium">Cole um link de vídeo (YouTube, Vimeo) ou faça upload:</p>
//                     <Input
//                       placeholder="https://youtube.com/watch?v=..."
//                       value={video}
//                       onChange={e => setVideo(e.target.value)}
//                     />
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-gray-400">ou</span>
//                       <button
//                         className="text-xs text-indigo-600 hover:underline"
//                         onClick={() => videoRef.current?.click()}
//                       >
//                         fazer upload de arquivo
//                       </button>
//                     </div>
//                   </div>
//                 )}

//                 {/* Hidden inputs */}
//                 <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageFile} />
//                 <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoFile} />

//                 {/* Toolbar */}
//                 <div className="flex items-center justify-between pt-1 border-t">
//                   <div className="flex gap-1">
//                     <Button
//                       variant="ghost" size="sm"
//                       className={tab === 'image' ? 'text-indigo-600' : 'text-gray-500'}
//                       onClick={() => { setTab('image'); imageRef.current?.click(); }}
//                     >
//                       <ImageIcon className="h-4 w-4 mr-1" /> Imagem
//                     </Button>
//                     <Button
//                       variant="ghost" size="sm"
//                       className={tab === 'video' ? 'text-indigo-600' : 'text-gray-500'}
//                       onClick={() => setTab(tab === 'video' ? null : 'video')}
//                     >
//                       <Video className="h-4 w-4 mr-1" /> Vídeo
//                     </Button>
//                     <Button
//                       variant="ghost" size="sm"
//                       className={tab === 'link' ? 'text-indigo-600' : 'text-gray-500'}
//                       onClick={() => setTab(tab === 'link' ? null : 'link')}
//                     >
//                       <LinkIcon className="h-4 w-4 mr-1" /> Link
//                     </Button>
//                   </div>
//                   <div className="flex gap-2">
//                     <Button variant="ghost" size="sm" onClick={reset}>Cancelar</Button>
//                     <Button size="sm" onClick={handlePublish} disabled={!content.trim() && !image && !video && !link}>
//                       Publicar
//                     </Button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Feed + Sidebar */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//           <div className="lg:col-span-2 space-y-6">
//             {posts.length === 0 && (
//               <div className="text-center py-16 text-gray-400">
//                 <p>Nenhuma publicação ainda. Seja o primeiro!</p>
//               </div>
//             )}
//             {posts.map(post => <PostCard key={post.id} post={post} />)}
//           </div>
//           <div className="space-y-6">
//             <ProfileSearch />
//             <ConnectionsSuggestions />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { useNavigate } from 'react-router';
import { useApp } from '../context/AppContext';

import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';

import { ProfileSearch } from '../components/ProfileSearch';
import { PostCard } from '../components/PostCard';
import { Navbar } from '../components/Navbar';
import { ConnectionsSuggestions } from '../components/ConnectionsSuggestions';

import {
  Image as ImageIcon,
  Video,
  Link as LinkIcon,
  X,
  TrendingUp,
} from 'lucide-react';

type UserArea = 'tech' | 'fashion' | 'architecture';

// type Post = {
//   id: string;
//   content: string;
// };

export default function Feed() {
  const navigate = useNavigate();

  const {
    currentUser,
    posts,
    createPost,
  } = useApp();

  const [open, setOpen] = useState(false);
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [video, setVideo] = useState('');
  const [link, setLink] = useState('');
  const [linkTitle, setLinkTitle] = useState('');
  const [tab, setTab] = useState<'image' | 'video' | 'link' | null>(null);

  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const reset = () => {
    setContent('');
    setImage('');
    setVideo('');
    setLink('');
    setLinkTitle('');
    setTab(null);
    setOpen(false);
  };

  const handleImageFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result as string);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleVideoFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onloadend = () => {
      setVideo(reader.result as string);
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handlePublish = () => {
    if (!content.trim() && !image && !video && !link) {
      return;
    }

    createPost(
      content,
      image || undefined,
      video || undefined,
      link || undefined,
      linkTitle || undefined
    );

    reset();
  };

  const areaColors: Record<UserArea, string> = {
    tech: 'bg-blue-100 text-blue-700',
    fashion: 'bg-pink-100 text-pink-700',
    architecture: 'bg-green-100 text-green-700',
  };

  const areaLabels: Record<UserArea, string> = {
    tech: 'Tecnologia',
    fashion: 'Moda',
    architecture: 'Arquitetura',
  };

  const userArea = currentUser.area as UserArea;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* USER CARD */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={currentUser.avatar} />
                <AvatarFallback>
                  {currentUser.name?.[0]}
                </AvatarFallback>
              </Avatar>

              <div>
                <h3 className="font-semibold">
                  {currentUser.name}
                </h3>

                <div className="flex items-center gap-2 mt-1">
                  <Badge className={areaColors[userArea]}>
                    {areaLabels[userArea]}
                  </Badge>

                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <TrendingUp className="h-4 w-4" />
                    Score: {currentUser.professionalScore}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CREATE POST */}
        <Card>
          <CardContent className="pt-4 space-y-3">

            {!open ? (
              <button
                className="w-full text-left px-4 py-3 rounded-full border border-gray-300 text-gray-500 hover:bg-gray-50 transition-colors text-sm"
                onClick={() => setOpen(true)}
              >
                Compartilhe uma atualização...
              </button>
            ) : (
              <>
                <div className="flex gap-3">
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={currentUser.avatar} />
                    <AvatarFallback>
                      {currentUser.name?.[0]}
                    </AvatarFallback>
                  </Avatar>

                  <Textarea
                    autoFocus
                    rows={3}
                    className="resize-none"
                    placeholder="Compartilhe suas conquistas, projetos ou ideias..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>

                <input
                  ref={imageRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageFile}
                />

                <input
                  ref={videoRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={handleVideoFile}
                />

                <div className="flex items-center justify-between pt-1 border-t">
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setTab('image');
                        imageRef.current?.click();
                      }}
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      Imagem
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTab(tab === 'video' ? null : 'video')
                      }
                    >
                      <Video className="h-4 w-4 mr-1" />
                      Vídeo
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        setTab(tab === 'link' ? null : 'link')
                      }
                    >
                      <LinkIcon className="h-4 w-4 mr-1" />
                      Link
                    </Button>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={reset}
                    >
                      Cancelar
                    </Button>

                    <Button
                      size="sm"
                      onClick={handlePublish}
                    >
                      Publicar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* POSTS */}
        <div className="space-y-6">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              Nenhuma publicação ainda.
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
              />
            ))
          )}
        </div>

        <ProfileSearch />
        <ConnectionsSuggestions />
      </div>
    </div>
  );
}