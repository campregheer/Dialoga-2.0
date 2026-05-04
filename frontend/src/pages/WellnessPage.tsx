import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wind, Brain, Play, RotateCcw, Heart, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WellnessPage = () => {
  const navigate = useNavigate();
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [phase, setPhase] = useState<'inspire' | 'segure' | 'expire' | 'pausa'>('inspire');
  const [exerciseType, setExerciseType] = useState<'478' | 'box' | 'diafragmatica'>('478');

  // Lógica do exercício de respiração
  useEffect(() => {
    let interval: any;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    } else {
      setSeconds(0);
      setPhase('inspire');
    }
    return () => clearInterval(interval);
  }, [isActive]);

  // Ciclo da Respiração 4-7-8
  useEffect(() => {
    if (exerciseType === '478' && isActive) {
      if (phase === 'inspire' && seconds >= 4) {
        setPhase('segure');
        setSeconds(0);
      } else if (phase === 'segure' && seconds >= 7) {
        setPhase('expire');
        setSeconds(0);
      } else if (phase === 'expire' && seconds >= 8) {
        setPhase('inspire');
        setSeconds(0);
      }
    } else if (exerciseType === 'box' && isActive) {
      if (seconds >= 4) {
        const phases: ('inspire' | 'segure' | 'expire' | 'pausa')[] = ['inspire', 'segure', 'expire', 'pausa'];
        const currentIndex = phases.indexOf(phase);
        setPhase(phases[(currentIndex + 1) % 4]);
        setSeconds(0);
      }
    } else if (exerciseType === 'diafragmatica' && isActive) {
      if (phase === 'inspire' && seconds >= 5) {
        setPhase('expire');
        setSeconds(0);
      } else if (phase === 'expire' && seconds >= 5) {
        setPhase('inspire');
        setSeconds(0);
      }
    }
  }, [seconds, isActive, phase, exerciseType]);

  const getPhaseText = () => {
    switch (phase) {
      case 'inspire': return 'Inspire pelo nariz...';
      case 'segure': return 'Segure o ar...';
      case 'expire': return 'Expire pela boca...';
      case 'pausa': return 'Aguarde...';
      default: return '';
    }
  };

  const getCircleSize = () => {
    if (!isActive) return 'scale-100';
    if (phase === 'inspire') return 'scale-150 duration-[4000ms]';
    if (phase === 'segure') return 'scale-150';
    if (phase === 'expire') return 'scale-100 duration-[8000ms]';
    return 'scale-100';
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-4 md:p-10 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo - reduzidos para mobile */}
      <div className="absolute top-[-20%] left-[-30%] w-[60%] md:w-[40%] h-[40%] md:h-[40%] bg-indigo-200/30 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-30%] w-[60%] md:w-[40%] h-[40%] md:h-[40%] bg-teal-200/30 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100/50 mb-6">
          <div className="flex items-center gap-3">
            <img 
              src="/Dialoga Logo S fundo.png" 
              alt="logo dialoga" 
              className="h-10 w-auto"
            />
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Dialoga</h2>
              <p className="text-sm text-slate-400">Centro de Bem-estar</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')} 
            className="gap-2 self-start md:self-auto hover:bg-white/40 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Button>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-full shadow-md animate-float">
              <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            </div>
            <h1 className="text-3xl font-extrabold text-[#1F6494] tracking-tight drop-shadow-sm">
              Espaço de Bem-Estar
            </h1>
          </div>
        </div>

        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-white/40 backdrop-blur-md border border-white/20 p-1 rounded-xl shadow-inner">
            <TabsTrigger 
              value="breathing" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <Wind className="w-4 h-4" /> Respiração Guiada
            </TabsTrigger>
            <TabsTrigger 
              value="meditation" 
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md rounded-lg transition-all"
            >
              <Brain className="w-4 h-4" /> Meditação & Mindful
            </TabsTrigger>
          </TabsList>

          <TabsContent value="breathing" className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card className="border-none shadow-2xl bg-white/60 backdrop-blur-xl rounded-3xl overflow-hidden relative">
              {/* Barra de progresso visual no topo do card */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#1F6494] via-[#4a90e2] to-[#38f9d7]" />
              
              <CardHeader className="text-center pb-2">
                <CardTitle className="text-4xl font-black text-[#1F6494] mb-2">Pausa Sagrada</CardTitle>
                <CardDescription className="text-lg text-gray-600 font-medium">
                  Sincronize sua alma com o ritmo do universo
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-12 py-10">

                {/* Seleção de Técnica - Modernizada */}
                <div className="flex flex-wrap justify-center gap-4">
                  {[
                    { id: '478', label: 'Técnica 4-7-8', color: 'from-rose-400 to-amber-400' },
                    { id: 'box', label: 'Caixa (Box)', color: 'from-indigo-400 to-purple-400' },
                    { id: 'diafragmatica', label: 'Diafragmática', color: 'from-teal-400 to-emerald-400' }
                  ].map((t) => (
                    <Button
                      key={t.id}
                      variant={exerciseType === t.id ? 'default' : 'outline'}
                      onClick={() => { setExerciseType(t.id as any); setIsActive(false); }}
                      className={`rounded-2xl px-6 h-12 transition-all duration-300 ${
                        exerciseType === t.id 
                        ? `bg-gradient-to-r ${t.color} border-none shadow-lg scale-105 text-white` 
                        : 'bg-white/50 hover:bg-white border-white/50'
                      }`}
                    >
                      {t.label}
                    </Button>
                  ))}
                </div>

                {/* Animação do Círculo - Versão Premium Multi-camada */}
                <div className="flex flex-col items-center justify-center space-y-12">
                  <div className="relative flex items-center justify-center w-72 h-72">
                    {/* Camadas de Brilho e Aura */}
                    <div className={`absolute inset-0 bg-indigo-400/20 rounded-full blur-3xl transition-all duration-1000 ${isActive ? 'opacity-100 scale-125' : 'opacity-0 scale-50'}`} />
                    <div className={`absolute inset-4 border-2 border-dashed border-white/40 rounded-full animate-spin-slow ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                    
                    {/* Círculo Principal com Gradiente Dinâmico */}
                    <div className={`w-40 h-40 bg-gradient-to-br from-[#1F6494] via-[#4a90e2] to-[#38f9d7] rounded-full shadow-[0_0_50px_rgba(31,100,148,0.4)] transition-all ease-in-out flex items-center justify-center z-10 ${getCircleSize()}`}>
                      <div className="w-[90%] h-[90%] rounded-full border border-white/20 flex items-center justify-center bg-white/10 backdrop-blur-sm">
                        <Wind className={`w-12 h-12 text-white transition-all duration-500 ${isActive && phase === 'inspire' ? 'rotate-180 scale-110' : ''}`} />
                      </div>
                    </div>

                    {/* Feedback Visual de Fase */}
                    <div className="absolute -bottom-16 text-center w-full">
                      <div className="inline-block px-6 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-white/50">
                        <p className="text-2xl font-bold text-[#1F6494] tracking-wide">
                          {isActive ? getPhaseText() : 'Pronto?'}
                        </p>
                      </div>
                      {isActive && (
                        <div className="mt-3 flex items-center justify-center gap-1">
                          <div className="w-2 h-2 bg-[#38f9d7] rounded-full animate-ping" />
                          <p className="text-[#4a90e2] font-black text-xl tabular-nums">{seconds}s</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-6 mt-16">
                    <Button
                      size="lg"
                      onClick={() => setIsActive(!isActive)}
                      className={`h-16 px-10 gap-3 text-lg font-bold rounded-3xl transition-all duration-500 shadow-xl ${
                        isActive 
                        ? 'bg-amber-500 hover:bg-amber-600 text-white hover:scale-105' 
                        : 'bg-[#1F6494] hover:bg-[#164e75] text-white hover:scale-105'
                      }`}
                    >
                      {isActive ? <><RotateCcw className="w-6 h-6 animate-spin-once" /> Parar agora</> : <><Play className="w-6 h-6 fill-current" /> Iniciar jornada</>}
                    </Button>
                  </div>
                </div>

                {/* Explicação da Técnica - Card Informativo Glass */}
                <div className="bg-white/40 p-8 rounded-[2rem] border border-white/50 mt-12 shadow-sm transition-all hover:bg-white/60">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-white rounded-2xl shadow-sm">
                      <Brain className="w-6 h-6 text-[#1F6494]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#1F6494] text-xl mb-2">Por que funciona?</h4>
                      <p className="text-gray-700 leading-relaxed font-medium">
                        {exerciseType === '478' && "A 4-7-8 atua como um interruptor biológico. Ao forçar uma expiração longa, você ativa o sistema parassimpático, reduzindo instantaneamente o cortisol."}
                        {exerciseType === 'box' && "A respiração quadrada reseta seu foco. O equilíbrio entre as fases estabiliza as ondas cerebrais, sendo a favorita de pessoas sob alta performance."}
                        {exerciseType === 'diafragmatica' && "Estimula o nervo vago através do diafragma. É a forma mais natural e poderosa de dizer ao seu corpo que você está em segurança."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="meditation" className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              {[
                { 
                  title: 'Meditação da Calma', 
                  time: '5 min', 
                  desc: 'Encontre silêncio no caos.', 
                  gradient: 'from-purple-500 to-indigo-600',
                  icon: <Heart className="w-6 h-6" />
                },
                { 
                  title: 'Escaneamento Corporal', 
                  time: '10 min', 
                  desc: 'Libere as tensões físicas.', 
                  gradient: 'from-teal-500 to-[#1F6494]',
                  icon: <Brain className="w-6 h-6" />
                }
              ].map((m, i) => (
                <Card key={i} className="group relative overflow-hidden border-none rounded-3xl shadow-xl transition-all hover:-translate-y-2 cursor-pointer">
                  <div className={`absolute inset-0 bg-gradient-to-br ${m.gradient} opacity-90 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative p-8 text-white h-full flex flex-col justify-between">
                    <div>
                      <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/20">
                        {m.icon}
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{m.title}</h3>
                      <p className="text-white/80 font-medium">{m.time}</p>
                      <p className="mt-4 text-white/90 leading-relaxed">{m.desc}</p>
                    </div>
                    <Button variant="secondary" className="mt-8 bg-white text-[#1F6494] hover:bg-gray-100 rounded-2xl h-12 font-bold shadow-lg">
                      Ouvir Áudio <Play className="ml-2 w-4 h-4 fill-current" />
                    </Button>
                  </div>
                </Card>
              ))}

              <Card className="md:col-span-2 bg-white/40 backdrop-blur-md border border-white/50 p-10 rounded-[2.5rem] shadow-lg flex flex-col md:flex-row items-center gap-8 group hover:bg-white/60 transition-all">
                <div className="relative">
                  <div className="absolute inset-0 bg-amber-400 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                  <div className="relative p-6 bg-amber-50 rounded-[2rem] border border-amber-100">
                    <Brain className="w-12 h-12 text-amber-600" />
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-2xl font-black text-[#1F6494] mb-3 tracking-tight">Afirmação de Poder</h3>
                  <p className="text-xl text-gray-700 italic leading-relaxed font-serif">
                    "Minha respiração é minha âncora infinita. Em cada ciclo, eu escolho a paz e libero o que não me serve mais."
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 12s linear infinite;
        }
        @keyframes spin-once {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-once {
          animation: spin-once 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default WellnessPage;
