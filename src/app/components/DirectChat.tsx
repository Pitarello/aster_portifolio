import { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MessageCircle, X, ChevronLeft, Send, Search } from 'lucide-react';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

export function DirectChat() {
  const { currentUser, getAllUsers, directMessages, sendDirectMessage, getConversationId } = useApp();
  const [open, setOpen] = useState(false);
  const [activeUserId, setActiveUserId] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);

  const allUsers = getAllUsers().filter(u => u.id !== currentUser?.id && u.role !== 'admin');

  // Only show connections: users I follow OR who follow me (LinkedIn style)
  // Read from the full users list to get up-to-date followersIds
  const myUserRecord = getAllUsers().find(u => u.id === currentUser?.id);
  const connections = allUsers.filter(u =>
    myUserRecord?.followingIds?.includes(u.id) ||
    myUserRecord?.followersIds?.includes(u.id)
  );

  const filtered = connections.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  // Conversations that already have messages
  const conversationsWithMessages = connections.filter(u => {
    if (!currentUser) return false;
    const convId = getConversationId(currentUser.id, u.id);
    return (directMessages[convId]?.length ?? 0) > 0;
  });

  const activeUser = connections.find(u => u.id === activeUserId);
  const convId = currentUser && activeUserId ? getConversationId(currentUser.id, activeUserId) : null;
  const messages = convId ? (directMessages[convId] || []) : [];

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length, activeUserId]);

  const handleSend = () => {
    if (!input.trim() || !activeUserId) return;
    sendDirectMessage(activeUserId, input.trim());
    setInput('');
  };

  const lastMessage = (userId: string) => {
    if (!currentUser) return null;
    const id = getConversationId(currentUser.id, userId);
    const msgs = directMessages[id];
    return msgs && msgs.length > 0 ? msgs[msgs.length - 1] : null;
  };

  if (!currentUser) return null;

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
      {/* Chat window */}
      {open && (
        <div className="w-80 bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
          style={{ height: '480px' }}>

          {/* Header */}
          <div className="bg-indigo-600 text-white px-4 py-3 flex items-center gap-2">
            {activeUserId ? (
              <>
                <button onClick={() => setActiveUserId(null)} className="hover:opacity-70 transition-opacity">
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <Avatar className="w-7 h-7">
                  <AvatarImage src={activeUser?.avatar} />
                  <AvatarFallback className="text-xs bg-indigo-400">{activeUser?.name[0]}</AvatarFallback>
                </Avatar>
                <span className="font-semibold text-sm flex-1 truncate">{activeUser?.name}</span>
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5" />
                <span className="font-semibold text-sm flex-1">Mensagens</span>
              </>
            )}
            <button onClick={() => setOpen(false)} className="hover:opacity-70 transition-opacity ml-auto">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Conversation list */}
          {!activeUserId && (
            <div className="flex flex-col flex-1 overflow-hidden">
              <div className="p-2 border-b">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                  <Input
                    className="h-8 pl-8 text-sm"
                    placeholder="Pesquisar utilizadores..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                  />
                </div>
              </div>
              <ScrollArea className="flex-1">
                {/* Recent conversations first */}
                {!search && conversationsWithMessages.length > 0 && (
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase font-semibold px-3 pt-2 pb-1">Recentes</p>
                    {conversationsWithMessages.map(u => {
                      const last = lastMessage(u.id);
                      return (
                        <button
                          key={u.id}
                          onClick={() => setActiveUserId(u.id)}
                          className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                        >
                          <Avatar className="w-9 h-9 shrink-0">
                            <AvatarImage src={u.avatar} />
                            <AvatarFallback className="text-xs">{u.name[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{u.name}</p>
                            {last && (
                              <p className="text-xs text-gray-400 truncate">
                                {last.senderId === currentUser.id ? 'Você: ' : ''}{last.text}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                    <div className="border-t my-1" />
                  </div>
                )}
                {/* All / filtered users */}
                <div>
                  {!search && <p className="text-[10px] text-gray-400 uppercase font-semibold px-3 pt-2 pb-1">Conexões</p>}
                  {filtered.length === 0 && connections.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8 px-4">
                      Segue alguém ou aguarda que te sigam para começar a conversar.
                    </p>
                  )}
                  {filtered.length === 0 && connections.length > 0 && (
                    <p className="text-xs text-gray-400 text-center py-6">Nenhuma conexão encontrada.</p>
                  )}
                  {filtered.map(u => (
                    <button
                      key={u.id}
                      onClick={() => setActiveUserId(u.id)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Avatar className="w-9 h-9 shrink-0">
                        <AvatarImage src={u.avatar} />
                        <AvatarFallback className="text-xs">{u.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{u.name}</p>
                        <p className="text-xs text-gray-400 truncate">{u.area}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Active conversation */}
          {activeUserId && (
            <>
              <ScrollArea className="flex-1 p-3 bg-gray-50">
                <div className="space-y-2">
                  {messages.length === 0 && (
                    <p className="text-xs text-gray-400 text-center py-8">
                      Nenhuma mensagem ainda. Diz olá! 👋
                    </p>
                  )}
                  {messages.map(msg => {
                    const isMe = msg.senderId === currentUser.id;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                          isMe
                            ? 'bg-indigo-600 text-white rounded-tr-none'
                            : 'bg-white border text-gray-800 rounded-tl-none shadow-sm'
                        }`}>
                          <p className="break-words">{msg.text}</p>
                          <span className={`text-[10px] mt-0.5 block ${isMe ? 'text-indigo-200' : 'text-gray-400'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={bottomRef} />
                </div>
              </ScrollArea>
              <div className="p-2 border-t bg-white flex gap-2">
                <Input
                  className="flex-1 h-9 text-sm"
                  placeholder="Escreve uma mensagem..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim()}
                  className="w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 flex items-center justify-center text-white transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-13 h-13 w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg flex items-center justify-center transition-all active:scale-95"
      >
        {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
    </div>
  );
}
