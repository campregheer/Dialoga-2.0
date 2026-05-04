import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Users, 
  ShieldAlert, 
  Activity, 
  MessageCircle, 
  LogOut, 
  Lock, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2
} from 'lucide-react';

interface Stats {
  totalJovens: number;
  totalProfissionais: number;
  totalPosts: number;
  totalReports: number;
}

interface ReportItem {
  _id: string;
  type: string;
  description: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

const REPORT_TYPE_LABELS: Record<string, string> = {
  bullying: 'Bullying ou Assédio',
  automutilacao: 'Auto-mutilação',
  abuso: 'Abuso ou Violência',
  conteudo: 'Conteúdo Inapropriado',
  outro: 'Outro',
};

const REPORT_TYPE_COLORS: Record<string, string> = {
  bullying: 'bg-amber-50 text-amber-600 border-amber-100',
  automutilacao: 'bg-rose-50 text-rose-600 border-rose-100',
  abuso: 'bg-rose-100 text-rose-700 border-rose-200',
  conteudo: 'bg-orange-50 text-orange-600 border-orange-100',
  outro: 'bg-slate-50 text-slate-500 border-slate-100',
};

export const ProfessionalDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<Stats | null>(null);
  const [reports, setReports] = useState<ReportItem[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [page, setPage] = useState(1);
  const [_loadingStats, setLoadingStats] = useState(true);
  const [loadingReports, setLoadingReports] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    fetchReports(page);
  }, [page]);

  const fetchStats = async () => {
    try {
      const res = await api.get('/professional/stats');
      setStats(res.data);
    } catch { } finally {
      setLoadingStats(false);
    }
  };

  const fetchReports = async (p: number) => {
    setLoadingReports(true);
    try {
      const res = await api.get(`/professional/reports?page=${p}`);
      setReports(res.data.reports);
      setPagination(res.data.pagination);
    } catch { } finally {
      setLoadingReports(false);
    }
  };

  return (
    <div className="min-h-screen bg-background font-['Nunito_Sans']">
      {/* Background decoration */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-secondary/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-primary/5 rounded-full blur-[100px]" />
      </div>

      {/* Header Premium - Com Logo */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-blue-50/50 h-20 flex items-center">
        <div className="max-w-5xl mx-auto w-full px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <img 
              src="/Dialoga Logo S fundo.png" 
              alt="logo dialoga" 
              className="h-10 w-auto"
            />
            <div>
              <h1 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Dialoga</h1>
              <span className="text-[10px] font-black uppercase tracking-widest text-primary opacity-70">Painel Profissional</span>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/dashboard')}
              className="hidden sm:flex h-11 px-5 rounded-xl text-slate-500 hover:bg-slate-50 font-bold gap-2"
            >
              <Activity className="w-4 h-4" /> Ver Plataforma
            </Button>
            <Button 
              variant="ghost" 
              onClick={logout} 
              className="w-11 h-11 rounded-xl p-0 text-slate-400 hover:bg-slate-50"
            >
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 relative z-10 space-y-12">
        {/* Banner Ético e Segurança */}
        <section className="bg-white/40 backdrop-blur-md border border-white/60 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 shadow-sm">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center flex-shrink-0">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <div className="space-y-1 text-center md:text-left">
            <h2 className="text-lg font-bold text-slate-800 tracking-tight">Compromisso com a Privacidade</h2>
            <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
              Este é um ambiente restrito para profissionais de saúde. Todas as informações aqui contidas são protegidas por sigilo ético. O anonimato dos jovens é preservado para garantir um espaço seguro de escuta.
            </p>
          </div>
        </section>

        {/* Métricas de Impacto */}
        <section className="space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 px-2 flex items-center gap-2">
            <Activity className="w-3 h-3 text-primary" /> Pulso da Rede
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard icon={<Users />} label="Jovens" value={stats?.totalJovens ?? 0} />
            <StatCard icon={<CheckCircle2 />} label="Profissionais" value={stats?.totalProfissionais ?? 0} />
            <StatCard icon={<MessageCircle />} label="Postagens" value={stats?.totalPosts ?? 0} />
            <StatCard icon={<ShieldAlert className="text-rose-500" />} label="Denúncias" value={stats?.totalReports ?? 0} alert />
          </div>
        </section>

        {/* Central de Alertas */}
        <section className="space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
              <ShieldAlert className="w-3 h-3 text-rose-500" /> Alertas de Segurança
            </h3>
            {pagination && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {pagination.totalItems} Casos Pendentes
              </span>
            )}
          </div>

          {loadingReports ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-white/50 animate-pulse rounded-[2rem] border border-white/20" />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="text-center py-20 bg-white/30 rounded-[3rem] border border-dashed border-slate-200">
              <CheckCircle2 className="w-12 h-12 text-emerald-300 mx-auto mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tudo sob controle. Nenhuma denúncia ativa.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {reports.map((report) => (
                <Card key={report._id} className="card-soft border-none bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${REPORT_TYPE_COLORS[report.type] ?? 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                      {REPORT_TYPE_LABELS[report.type] ?? report.type}
                    </span>
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      {report.isAnonymous && (
                        <span className="flex items-center gap-1.5 text-primary">
                          <Lock className="w-3 h-3" /> Relato Anônimo
                        </span>
                      )}
                      <span>{new Date(report.createdAt).toLocaleString('pt-BR')}</span>
                    </div>
                  </div>
                  <p className="text-slate-700 font-medium leading-relaxed">
                    {report.description}
                  </p>
                  <div className="pt-2 flex justify-end">
                    <Button variant="ghost" size="sm" className="text-primary font-bold text-xs gap-2 rounded-xl">
                      Analisar Caso <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Paginação */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-12">
              <Button
                variant="outline"
                size="icon"
                disabled={!pagination.hasPrev}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-xl border-slate-100 text-slate-400"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <div className="px-5 py-2 bg-white rounded-xl border border-slate-100 text-xs font-black text-slate-800">
                {pagination.currentPage} <span className="mx-2 text-slate-200">/</span> {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                size="icon"
                disabled={!pagination.hasNext}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-xl border-slate-100 text-slate-400"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, alert }: any) => (
  <Card className="card-soft border-none bg-white p-8 space-y-4 shadow-sm hover:shadow-md transition-all group">
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${alert ? 'bg-rose-50 text-rose-500' : 'bg-secondary/20 text-primary'} group-hover:scale-110 transition-transform`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value.toLocaleString('pt-BR')}</p>
    </div>
  </Card>
);

export default ProfessionalDashboard;
