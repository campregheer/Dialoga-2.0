import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import {  Lock, Mail, User, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [profile, setProfile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const isPasswordValid = password.length >= 8;
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(profile, email, "jovem", password );
      navigate('/dashboard');
    }catch (error) {
      console.error('Falha no cadastro:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden font-['Nunito_Sans']">
      {/* Background blobs - reduzidos para mobile */}
      <div className="absolute top-[-20%] right-[-30%] w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-secondary/20 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-30%] w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10">
        <div className="flex items-center gap-3 justify-center ">
          <div className="w-40 h-40 flex items-center justify-center">
            <img src="/Dialoga Logo S fundo.png" alt="dialoga logo" />
          </div>
        </div>

        <Card className="card-soft border-none bg-white p-6 md:p-10 shadow-xl shadow-slate-200/50">
          <CardHeader className="p-0 mb-6 md:mb-8">
            <CardTitle className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">Criar sua conta</CardTitle>
            <CardDescription className="text-slate-500 font-medium text-base md:text-lg mt-2">Comece a fazer parte dessa rede de apoio.</CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            <form onSubmit={handleSubmit} className="space-y-6">

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  {'Apelido (Anônimo)'}
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
                  <Input 
                    placeholder={"Ex: EstrelaCadente"} 
                    value={profile}
                    onChange={(e) => setProfile(e.target.value)}
                    required
                    className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                  />
                </div>
              </div>

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
                    placeholder="Mínimo 6 caracteres" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="h-14 pl-12 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-slate-600"
                  />
                  <p className={`text-sm ${isPasswordValid ? 'text-green-500' : 'text-red-500'}`}>
                    A senha deve ter pelo menos 8 caracteres
                  </p>
                  
                </div>
              </div>

              <Button 
                type="submit" 
                disabled={loading}
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all text-lg"
              >
                {loading ? 'Criando conta...' : 'Concluir Cadastro'}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="p-0 mt-8 flex flex-col items-center gap-6">
            <p className="text-slate-500 font-medium">
              Já tem uma conta? <Link to="/login" className="text-primary font-bold hover:underline">Entre aqui</Link>
            </p>
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50/50 border border-blue-100 rounded-full">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ambiente monitorado e seguro</span>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Register;
