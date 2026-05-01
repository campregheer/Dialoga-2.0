import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { MessageCircle, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Falha no login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-['Nunito_Sans']">
      {/* Background blobs - reduzidos para mobile */}
      <div className="absolute top-[-20%] right-[-30%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-secondary/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-30%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="flex items-center gap-3 justify-center mb-10">
          <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Dialoga</h1>
        </div>

        <Card className="card-soft border-none bg-white p-6 md:p-10 shadow-xl shadow-slate-200/50">
          <CardHeader className="p-0 mb-6 md:mb-8">
            <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Bem-vindo de volta</CardTitle>
            <CardDescription className="text-slate-500 font-medium text-base md:text-lg mt-2">Continue sua jornada de cuidado.</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="email" 
                    placeholder="seu@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Senha</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    type="password" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all text-lg group"
              >
                {loading ? 'Entrando...' : 'Entrar no Dialoga'}
                {!loading && <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="p-0 mt-8 flex flex-col items-center gap-6">
            <p className="text-slate-500 font-medium">
              Não tem uma conta? <Link to="/cadastro" className="text-primary font-bold hover:underline">Cadastre-se</Link>
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-full">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sua privacidade é nossa prioridade</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
