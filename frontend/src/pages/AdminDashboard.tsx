import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Users,
  ShieldAlert,
  Settings,
  BarChart3,
  LogOut,
  LayoutDashboard,
  Bell,
  CheckCircle2,
  UserPlus,
  ArrowUpRight
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  activeProfessionals: number;
  totalReports: number;
  pendingReviews: number;
}

export const AdminDashboard = () => {
  const { logout } = useAuth();
  const [stats] = useState<AdminStats>({
    totalUsers: 1240,
    activeProfessionals: 45,
    totalReports: 12,
    pendingReviews: 3
  });

  return (
    <div className="min-h-screen bg-slate-50 font-['Nunito_Sans']">
      {/* Sidebar - Visual Administrativo */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 text-white z-50 hidden lg:flex flex-col p-6 space-y-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white">
            <LayoutDashboard className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Dialoga <span className="text-primary text-[10px] block uppercase tracking-widest opacity-80">Admin</span></h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<BarChart3 />} label="Visão Geral" active />
          <NavItem icon={<Users />} label="Usuários" />
          <NavItem icon={<ShieldAlert />} label="Moderação" />
          <NavItem icon={<Settings />} label="Configurações" />
        </nav>

        <Button
          variant="ghost"
          onClick={logout}
          className="justify-start gap-3 text-slate-400 hover:text-white hover:bg-white/5 rounded-xl h-12 px-4"
        >
          <LogOut className="w-5 h-5" /> Sair
        </Button>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 p-6 md:p-10 space-y-10">
        {/* Header Mobile/Tablet */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Bom dia, Administrador</h2>
            <p className="text-slate-400 text-sm font-medium">Aqui está o que aconteceu na plataforma hoje.</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" className="rounded-xl border-slate-200 text-slate-400 relative">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </Button>
            <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500">
              <UserPlus className="w-5 h-5" />
            </div>
          </div>
        </header>

        {/* Admin Metrics */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AdminStatCard
            label="Total de Jovens"
            value={stats.totalUsers.toLocaleString()}
            trend="+12% esta semana"
            icon={<Users className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Profissionais Ativos"
            value={stats.activeProfessionals.toString()}
            trend="Estável"
            icon={<CheckCircle2 className="w-5 h-5" />}
          />
          <AdminStatCard
            label="Alertas de Segurança"
            value={stats.totalReports.toString()}
            trend="-2 em relação a ontem"
            icon={<ShieldAlert className="w-5 h-5 text-rose-500" />}
            alert
          />
          <AdminStatCard
            label="Novos Cadastros"
            value="84"
            trend="+5% hoje"
            icon={<UserPlus className="w-5 h-5" />}
          />
        </section>

        {/* Charts / Activity placeholder */}
        <div className="grid lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 card-soft border-none bg-white p-8 space-y-6 shadow-sm">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Atividade do Sistema</h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="rounded-lg h-9 border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">7 Dias</Button>
                <Button variant="outline" size="sm" className="rounded-lg h-9 border-slate-100 text-[10px] font-bold uppercase tracking-widest text-slate-400">30 Dias</Button>
              </div>
            </div>
            <div className="h-64 bg-slate-50 rounded-3xl flex items-center justify-center border border-dashed border-slate-100">
              <div className="text-center">
                <BarChart3 className="w-10 h-10 text-slate-200 mx-auto mb-2" />
                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Visualização de Tráfego</p>
              </div>
            </div>
          </Card>

          <Card className="card-soft border-none bg-white p-8 space-y-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Logs Recentes</h3>
            <div className="space-y-4">
              <LogItem text="Novo profissional credenciado" time="há 2 min" status="success" />
              <LogItem text="Alerta de segurança crítico" time="há 15 min" status="alert" />
              <LogItem text="Manutenção programada concluída" time="há 1h" status="info" />
              <LogItem text="Backup automático realizado" time="há 3h" status="info" />
            </div>
            <Button variant="ghost" className="w-full text-primary font-bold text-xs gap-2 rounded-xl">
              Ver todos os logs <ArrowUpRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>

        {/* Recent Reports Preview */}
        <section className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Últimos Alertas de Segurança</h3>
            <Button variant="ghost" className="text-slate-400 font-bold text-xs">Gerenciar todos</Button>
          </div>
          <Card className="card-soft border-none bg-white overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-50">
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Tipo</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Ação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  <ReportRow date="26/04/2026 14:22" type="Bullying" status="Pendente" />
                  <ReportRow date="26/04/2026 12:10" type="Autoajuda" status="Em análise" />
                  <ReportRow date="25/04/2026 21:05" type="Conteúdo" status="Resolvido" />
                </tbody>
              </table>
            </div>
          </Card>
        </section>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active }: any) => (
  <button className={`w-full flex items-center gap-3 px-4 h-12 rounded-xl transition-all font-bold text-sm ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}>
    {icon}
    {label}
  </button>
);

const AdminStatCard = ({ label, value, trend, icon, alert }: any) => (
  <Card className="card-soft border-none bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${alert ? 'bg-rose-50 text-rose-500' : 'bg-slate-50 text-slate-400'}`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
      <p className={`text-[10px] font-bold mt-1 ${alert ? 'text-rose-400' : 'text-emerald-400'}`}>{trend}</p>
    </div>
  </Card>
);

const LogItem = ({ text, time, status }: any) => (
  <div className="flex items-start gap-3">
    <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${status === 'alert' ? 'bg-rose-500' : status === 'success' ? 'bg-emerald-500' : 'bg-primary'}`} />
    <div className="flex-1">
      <p className="text-xs font-bold text-slate-700 leading-tight">{text}</p>
      <p className="text-[10px] text-slate-400 font-medium">{time}</p>
    </div>
  </div>
);

const ReportRow = ({ date, type, status }: any) => (
  <tr className="hover:bg-slate-50 transition-colors cursor-pointer group">
    <td className="px-6 py-4 text-xs font-bold text-slate-500">{date}</td>
    <td className="px-6 py-4">
      <span className="text-xs font-bold text-slate-700">{type}</span>
    </td>
    <td className="px-6 py-4">
      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${status === 'Pendente' ? 'bg-amber-50 text-amber-500' : status === 'Resolvido' ? 'bg-emerald-50 text-emerald-500' : 'bg-slate-100 text-slate-500'}`}>
        {status}
      </span>
    </td>
    <td className="px-6 py-4">
      <Button variant="ghost" size="sm" className="rounded-lg h-8 px-3 text-[10px] font-black text-primary uppercase tracking-widest">Detalhes</Button>
    </td>
  </tr>
);

export default AdminDashboard;
