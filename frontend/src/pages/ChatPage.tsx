import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ChevronLeft, 
  Send, 
  User,
  Info,
  MoreVertical,
  Lock,
  Flag
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'professional' | 'user';
  timestamp: Date;
}

export const ChatPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá, eu sou o profissional responsável pela sua escuta hoje. Como posso te ajudar?',
      sender: 'professional',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
  };

  return (
    <div className="flex flex-col h-screen bg-background font-['Nunito_Sans'] overflow-x-hidden">
      {/* Header */}
      <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-blue-50/50 flex items-center px-4 md:px-6 shrink-0 z-10">
        <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-3 md:gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate('/dashboard')}
              className="rounded-xl text-slate-400 hover:bg-slate-50"
            >
              <ChevronLeft className="w-5 md:w-6 h-5 md:h-6" />
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 bg-slate-100 rounded-xl md:rounded-2xl flex items-center justify-center text-slate-400 border border-slate-200">
                <User className="w-5 md:w-6 h-5 md:h-6" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-slate-800 leading-none">Profissional de Escuta</h1>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Disponível agora</p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-300">
              <Flag className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-xl text-slate-300">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Security Disclaimer */}
      <div className="bg-slate-900 py-3 px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-3 text-white/80">
          <Lock className="w-3.5 h-3.5 text-primary" />
          <span className="text-[10px] font-bold uppercase tracking-[0.1em]">Criptografia de ponta a ponta & Sigilo Absoluto</span>
        </div>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto px-6 py-8 space-y-8 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Safety Reminder */}
            <div className="flex justify-center">
              <div className="bg-white/50 border border-blue-50 px-6 py-4 rounded-[2rem] text-center max-w-sm">
                <Info className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Este é um espaço seguro. Fique à vontade para compartilhar seus sentimentos. O profissional está aqui para acolher você.
                </p>
              </div>
            </div>

            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="space-y-1">
                    <Card className={`p-4 md:p-5 rounded-[1.5rem] border-none shadow-sm ${
                      msg.sender === 'user' 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white text-slate-600 rounded-tl-none'
                    }`}>
                      <p className="text-sm md:text-base font-medium leading-relaxed">
                        {msg.text}
                      </p>
                    </Card>
                    <p className={`text-[10px] font-bold text-slate-400 uppercase tracking-widest px-2 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-white border-t border-slate-100 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Conte o que está sentindo..."
                className="w-full h-14 px-6 bg-slate-50 border-none rounded-2xl text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
            </div>
            <Button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:hover:bg-primary"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <p className="text-center mt-4 text-[10px] text-slate-300 font-bold uppercase tracking-widest">
            Sua conversa é protegida por lei e ética profissional
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ChatPage;
