import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShieldCheck, Heart, Users, ArrowRight, Sparkles } from 'lucide-react';

export const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background font-['Nunito_Sans'] overflow-x-hidden">
      {/* Background blobs - reduzidos para mobile */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-20%] right-[-30%] w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-secondary/20 rounded-full blur-[80px] md:blur-[120px]" />
        <div className="absolute bottom-[-20%] left-[-30%] w-[250px] md:w-[500px] h-[250px] md:h-[500px] bg-primary/5 rounded-full blur-[60px] md:blur-[100px]" />
      </div>

      {/* Header/Nav */}
      <header className="relative z-10 h-16 md:h-20 flex items-center px-4 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-35 h-35 md:w-14 md:h-10  rounded-xl md:rounded-2xl flex items-center justify-center">
            <img src="/Dialoga Logo S fundo.png " alt="logo dialoga" />
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 tracking-tight">Dialoga</h1>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-24 space-y-24">
        {/* Hero Section */}
        <section className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-blue-50">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sua voz tem um lugar seguro</span>
            </div>
            
            <h2 className="text-3xl  md:text-6xl font-extrabold text-slate-800 leading-[1.1] tracking-tight">
              Escuta especializada e <span className="text-primary">apoio emocional.</span>
            </h2>
            
            <p className="text-base md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
              Um espaço anônimo para adolescentes se expressarem e profissionais oferecerem acolhimento humano.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Button 
                onClick={() => navigate('/cadastro')}
                className="w-full sm:w-auto h-16 px-10 btn-dialoga bg-primary hover:bg-primary/90 text-white text-lg shadow-xl shadow-primary/20 group"
              >
                Sou jovem <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto h-16 px-10 btn-dialoga border-slate-100 text-slate-600 text-lg hover:bg-slate-50"
              >
                Sou profissional
              </Button>
            </div>
          </div>

          <div className="hidden lg:flex justify-center relative">
            <div className="w-full aspect-square max-w-[500px] relative">
              <div className="absolute inset-0 bg-primary/5 rounded-[4rem] rotate-6 animate-pulse" />
              <div className="absolute inset-0 bg-secondary/20 rounded-[4rem] -rotate-3 transition-transform hover:rotate-0 duration-700" />
              <div className="absolute inset-4 bg-white rounded-[3.5rem] shadow-2xl flex items-center justify-center p-12">
                <div className="space-y-6 text-center">
                  <Heart className="w-20 h-20 text-primary mx-auto animate-soft-float" />
                  <p className="text-2xl font-bold text-slate-800 italic">"Você não precisa carregar tudo sozinho."</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-primary" />}
            title="100% Anônimo"
            desc="Sua identidade é protegida. Use apelidos e sinta-se livre para ser quem você é."
          />
          <FeatureCard 
            icon={<Users className="w-8 h-8 text-primary" />}
            title="Escuta Humana"
            desc="Profissionais prontos para ouvir sem julgamentos, focados no seu bem-estar."
          />
          <FeatureCard 
            icon={<Heart className="w-8 h-8 text-primary" />}
            title="Sempre Aberto"
            desc="Ferramentas de apoio, diário emocional e meditações disponíveis a qualquer momento."
          />
        </section>

        {/* Closing CTA */}
        <section className="bg-slate-900 rounded-[2rem] md:rounded-[3rem] p-8 md:p-12 lg:p-20 text-center text-white space-y-6 md:space-y-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-primary/10 pointer-events-none" />
          <h2 className="text-2xl md:text-4xl font-bold relative z-10 tracking-tight">Pronto para dar o primeiro passo?</h2>
          <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto relative z-10">
            O Dialoga é uma iniciativa sem fins lucrativos focada em saúde mental. Junte-se a nós agora.
          </p>
          <Button 
            onClick={() => navigate('/cadastro')}
            className="h-16 px-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl relative z-10 shadow-2xl shadow-primary/40 transition-all hover:scale-105"
          >
            Começar agora
          </Button>
        </section>
      </main>

      <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm font-medium">
        <p>© 2026 Dialoga - Plataforma de Apoio Emocional.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <Card className="card-soft border-none bg-white p-6 md:p-10 space-y-4 md:space-y-6 hover:shadow-lg transition-all group">
    <div className="w-16 h-16 rounded-3xl bg-secondary/30 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
      {icon}
    </div>
    <div className="space-y-3">
      <h3 className="text-2xl font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="text-slate-500 font-medium leading-relaxed">{desc}</p>
    </div>
  </Card>
);

export default HomePage;
