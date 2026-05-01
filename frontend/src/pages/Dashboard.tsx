import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Wind,
  MessageCircle,
  Heart,
  Send,
  Flag,
  User,
  Plus,
  BookOpen,
  Users,
  ShieldCheck,
  Bot,
  ShieldAlert,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/ui/header';

// --- Tipos ---
interface DiaryEntry {
  _id: string;
  content: string;
  emotion?: string;
  createdAt: string;
}

interface Comment {
  _id: string;
  content: string;
  author: { profile: string; role: string };
  createdAt: string;
}

interface Post {
  _id: string;
  content: string;
  author: { profile: string; role: string };
  createdAt: string;
  totalLikes: number;
  userLiked: boolean;
}

// --- Sub-componente: PostCard ---
const PostCard = ({ post, onLikeToggle }: { post: Post; onLikeToggle: (id: string) => void }) => {
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);

  const loadComments = async () => {
    if (showComments) {
      setShowComments(false);
      return;
    }
    setLoadingComments(true);
    try {
      const res = await api.get(`/community/${post._id}/comments`);
      setComments(res.data);
      setShowComments(true);
    } catch { } finally {
      setLoadingComments(false);
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await api.post(`/community/${post._id}/comment`, { content: newComment });
      setComments((prev) => [...prev, res.data]);
      setNewComment('');
    } catch { }
  };

  return (
    <Card className="card-soft bg-white border-none shadow-sm p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-secondary/30 flex items-center justify-center text-primary font-bold">
            {post.author.profile.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm leading-none">{post.author.profile}</p>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
              {new Date(post.createdAt).toLocaleDateString('pt-BR')}
            </p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-300 rounded-xl">
          <Flag className="w-4 h-4" />
        </Button>
      </div>

      <p className="text-slate-600 font-medium leading-relaxed">{post.content}</p>

      <div className="flex gap-2 pt-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onLikeToggle(post._id)}
          className={`rounded-xl gap-2 font-bold ${post.userLiked ? 'text-rose-500 bg-rose-50' : 'text-slate-400 hover:bg-slate-50'}`}
        >
          <Heart className={`w-4 h-4 ${post.userLiked ? 'fill-current' : ''}`} />
          {post.totalLikes}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={loadComments}
          disabled={loadingComments}
          className="rounded-xl gap-2 text-slate-400 font-bold hover:bg-slate-50"
        >
          <MessageCircle className="w-4 h-4" />
          {loadingComments ? '...' : showComments ? 'Fechar' : 'Conversar'}
        </Button>
      </div>

      {showComments && (
        <div className="space-y-4 pt-4 border-t border-slate-50">
          {comments.map((c) => (
            <div key={c._id} className="flex gap-3">
              <div className="w-7 h-7 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 font-bold text-[10px] shrink-0">
                {c.author.profile.charAt(0).toUpperCase()}
              </div>
              <div className="bg-slate-50 rounded-2xl px-4 py-2 flex-1">
                <p className="font-bold text-slate-800 text-[10px]">{c.author.profile}</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{c.content}</p>
              </div>
            </div>
          ))}
          <form onSubmit={handleComment} className="flex gap-2">
            <Input
              placeholder="Escreva algo gentil..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="h-10 rounded-xl bg-slate-50 border-none text-xs focus:ring-1 focus:ring-primary/20"
            />
            <Button type="submit" size="sm" disabled={!newComment.trim()} className="rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/10">
              <Send className="w-3.5 h-3.5" />
            </Button>
          </form>
        </div>
      )}
    </Card>
  );
};

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [diaryContent, setDiaryContent] = useState('');
  const [diaryEmotion, setDiaryEmotion] = useState('');
  const [posts, setPosts] = useState<Post[]>([]);
  const [postContent, setPostContent] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState('outro');
  const [reportDesc, setReportDesc] = useState('');
  const [reportLoading, setReportLoading] = useState(false);

  useEffect(() => {
    if (user?.role === 'jovem') {
      fetchDiary();
    }
    fetchPosts();
  }, [user]);

  const fetchDiary = async () => {
    try {
      const res = await api.get('/diary');
      setEntries(res.data);
    } catch { }
  };

  const fetchPosts = async () => {
    try {
      const res = await api.get('/community');
      setPosts(res.data);
    } catch { }
  };

  const handleSaveDiary = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!diaryContent.trim()) return;
    try {
      const res = await api.post('/diary', { content: diaryContent, emotion: diaryEmotion });
      setEntries((prev) => [res.data, ...prev]);
      setDiaryContent('');
      setDiaryEmotion('');
    } catch { }
  };

  const handleSavePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;
    try {
      const res = await api.post('/community', { content: postContent });
      setPosts((prev) => [res.data, ...prev]);
      setPostContent('');
    } catch { }
  };

  const handleLikeToggle = async (postId: string) => {
    try {
      const res = await api.post(`/community/${postId}/like`);
      setPosts((prev) =>
        prev.map((p) =>
          p._id === postId ? { ...p, totalLikes: res.data.totalLikes, userLiked: res.data.userLiked } : p
        )
      );
    } catch { }
  };

  const handleSendReport = async () => {
    if (!reportDesc.trim()) return;
    setReportLoading(true);
    try {
      await api.post('/reports', { type: reportType, description: reportDesc, isAnonymous: true });
      alert('Relato enviado com segurança. Um profissional analisará em breve.');
      setShowReportModal(false);
      setReportDesc('');
    } catch {
      alert('Erro ao enviar relato.');
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-['Nunito_Sans'] pb-32 overflow-x-hidden">
      {/* Background decoration - reduzidos para mobile */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] right-[-30%] w-48 md:w-96 h-48 md:h-96 bg-secondary/20 rounded-full blur-[60px] md:blur-[100px]" />
        <div className="absolute bottom-[-20%] left-[-30%] w-40 md:w-80 h-40 md:h-80 bg-primary/5 rounded-full blur-[40px] md:blur-[80px]" />
      </div>

      {/* Header */}
      <Header showReportButton onReportClick={() => setShowReportModal(true)} />

      <main className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10 relative z-10 space-y-8 md:space-y-12">
        {/* Saudação */}
        <section className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Olá, <span className="text-primary">{user?.profile}</span></h2>
          <p className="text-slate-500 font-medium">Como você está se sentindo agora?</p>
        </section>

        {/* Quick Actions Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
          <ActionCard
            icon={<Bot className="w-6 h-6" />}
            title="Chatbot de Apoio"
            desc="Conversa leve e imediata."
            color="bg-secondary/40"
            onClick={() => navigate('/chatbot')}
          />
          <ActionCard
            icon={<User className="w-6 h-6" />}
            title="Conversa Privada"
            desc="Fale com um profissional."
            color="bg-primary/10"
            onClick={() => navigate('/chat')}
          />
          <ActionCard
            icon={<Wind className="w-6 h-6" />}
            title="Bem-estar"
            desc="Respire e relaxe."
            color="bg-emerald-50"
            onClick={() => navigate('/bem-estar')}
          />
        </section>

        {/* Tabs for Community and Diary */}
        <Tabs defaultValue="community" className="space-y-8">
          <TabsList className="flex gap-2 h-12 md:h-14 p-1.5 bg-white/80 rounded-2xl border border-blue-50/50 shadow-sm w-full overflow-x-auto">
            <TabsTrigger value="community" className="rounded-xl px-4 md:px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap">
              <Users className="w-4 h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Comunidade</span><span className="sm:hidden">Posts</span>
            </TabsTrigger>
            {user?.role === 'jovem' && (
              <TabsTrigger value="diary" className="rounded-xl px-4 md:px-8 font-bold data-[state=active]:bg-primary data-[state=active]:text-white transition-all whitespace-nowrap">
                <BookOpen className="w-4 h-4 mr-1 md:mr-2" /> <span className="hidden sm:inline">Meu Diário</span><span className="sm:hidden">Diário</span>
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="community" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Novo Post */}
            <Card className="card-soft bg-white border-none shadow-sm p-4 md:p-8 space-y-4 md:space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-secondary/30 rounded-xl flex items-center justify-center text-primary">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 tracking-tight">Nova Postagem</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Voz da Rede</p>
                </div>
              </div>
              <form onSubmit={handleSavePost} className="space-y-4">
                <Textarea
                  placeholder="Compartilhe um pensamento ou apoio..."
                  value={postContent}
                  onChange={(e) => setPostContent(e.target.value)}
                  className="rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 transition-all resize-none p-5 text-slate-600 font-medium"
                  rows={3}
                />
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Identidade Protegida
                  </div>
                  <Button
                    type="submit"
                    disabled={!postContent.trim()}
                    className="h-12 px-8 bg-primary hover:bg-primary/90 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all"
                  >
                    Publicar
                  </Button>
                </div>
              </form>
            </Card>

            {/* Feed */}
            <div className="space-y-6">
              <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-2 flex items-center gap-3">
                Feed Coletivo <div className="h-px flex-1 bg-slate-100" />
              </h4>
              {posts.length === 0 ? (
                <div className="py-20 text-center bg-white/40 rounded-[2.5rem] border border-dashed border-slate-200">
                  <p className="text-slate-400 font-bold italic">O feed está calmo por aqui...</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {posts.map((post) => (
                    <PostCard key={post._id} post={post} onLikeToggle={handleLikeToggle} />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="diary" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Novo Diário */}
            <Card className="card-soft bg-white border-none shadow-sm p-8 space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 tracking-tight">O que você está pensando?</h3>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Só você verá isto</p>
                </div>
              </div>
              <form onSubmit={handleSaveDiary} className="space-y-4">
                <Input
                  placeholder="Como você se sente? (ex: Calmo, Animado...)"
                  value={diaryEmotion}
                  onChange={(e) => setDiaryEmotion(e.target.value)}
                  className="h-12 rounded-xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 transition-all text-slate-600 font-medium"
                />
                <Textarea
                  placeholder="Escreva sobre o seu dia..."
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  className="rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 transition-all resize-none p-5 text-slate-600 font-medium"
                  rows={4}
                />
                <Button
                  type="submit"
                  disabled={!diaryContent.trim()}
                  className="w-full h-12 bg-slate-800 hover:bg-slate-900 rounded-xl font-bold shadow-lg transition-all text-white"
                >
                  Guardar Memória
                </Button>
              </form>
            </Card>

            {/* Lista Diário */}
            <div className="grid gap-4">
              {entries.map((entry) => (
                <Card key={entry._id} className="card-soft bg-white/60 border-none shadow-sm p-6 hover:shadow-md transition-all">
                  <div className="flex justify-between items-center mb-4">
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-100">
                      {entry.emotion || 'Sentimento'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                      {new Date(entry.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="text-slate-600 font-medium leading-relaxed italic">"{entry.content}"</p>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Floating Alert Button Mobile */}
      <button
        onClick={() => setShowReportModal(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-rose-500 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-rose-200 z-50 sm:hidden hover:scale-110 active:scale-95 transition-all"
      >
        <ShieldAlert className="w-8 h-8" />
      </button>

      {/* Modal de Alerta */}
      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none p-8 font-['Nunito_Sans']">
          <DialogHeader className="space-y-4">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <DialogTitle className="text-2xl font-black text-center text-slate-800">Precisa de ajuda urgente?</DialogTitle>
            <DialogDescription className="text-center text-slate-500 font-medium text-base">
              Se você está passando por um momento difícil ou conhece alguém que esteja, relate aqui. Sua identidade será protegida e um profissional qualificado entrará em contato.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">O que está acontecendo?</label>
              <Select onValueChange={setReportType} defaultValue="outro">
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-blue-50">
                  <SelectItem value="bullying">Bullying ou Assédio</SelectItem>
                  <SelectItem value="automutilacao">Dificuldades Graves</SelectItem>
                  <SelectItem value="abuso">Abuso ou Violência</SelectItem>
                  <SelectItem value="conteudo">Conteúdo Inapropriado</SelectItem>
                  <SelectItem value="outro">Outro motivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mais detalhes (opcional)</label>
              <Textarea
                placeholder="Conte-nos o que está acontecendo para podermos ajudar melhor..."
                className="rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 min-h-[120px] p-5"
                value={reportDesc}
                onChange={(e) => setReportDesc(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-3">
            <Button variant="ghost" onClick={() => setShowReportModal(false)} className="h-14 rounded-2xl font-bold flex-1">Agora não</Button>
            <Button
              onClick={handleSendReport}
              disabled={reportLoading}
              className="h-14 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold flex-1 shadow-xl shadow-rose-100"
            >
              {reportLoading ? 'Enviando...' : 'Enviar Alerta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

// Sub-componente ActionCard
const ActionCard = ({ icon, title, desc, color, onClick }: any) => (
  <button
    onClick={onClick}
    className="card-soft bg-white border-none shadow-sm p-6 flex flex-col gap-4 text-left hover:shadow-lg transition-all group overflow-hidden relative"
  >
    <div className={`absolute top-0 right-0 w-24 h-24 ${color} rounded-full -mr-12 -mt-12 blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700`} />
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-inner ${color}`}>
      {icon}
    </div>
    <div className="space-y-1 relative z-10">
      <h3 className="font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-xs text-slate-400 font-medium">{desc}</p>
    </div>
  </button>
);

export default Dashboard;
