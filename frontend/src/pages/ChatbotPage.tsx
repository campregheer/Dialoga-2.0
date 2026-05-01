import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  Send, 
  ChevronLeft, 
  Sparkles, 
  Heart,
  Smile,
  ShieldCheck,
  MoreVertical
} from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

export const ChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Eu sou o Guia Dialoga. Estou aqui para te ouvir e ajudar a entender seus sentimentos. Como você está se sentindo hoje?',
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

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
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Obrigado por compartilhar isso comigo. Lembre-se que este é um espaço seguro e você pode falar no seu tempo. Quer conversar mais sobre isso ou prefere fazer um exercício de respiração?',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
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
              <div className="relative">
                <div className="w-10 h-10 md:w-11 md:h-11 bg-primary/10 rounded-xl md:rounded-2xl flex items-center justify-center text-primary border border-primary/20">
                  <Sparkles className="w-5 md:w-6 h-5 md:h-6" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-emerald-500 border-2 border-white rounded-full" />
              </div>
              <div>
                <h1 className="text-base md:text-lg font-bold text-slate-800 leading-none">Guia Dialoga</h1>
                <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mt-1">Sempre aqui para você</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="rounded-xl text-slate-300">
            <MoreVertical className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Info Banner */}
      <div className="bg-secondary/20 py-2 md:py-3 px-4 md:px-6 border-b border-blue-50/50">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 text-primary">
          <ShieldCheck className="w-4 h-4" />
          <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider">Conversa privada e anônima</span>
        </div>
      </div>

      {/* Chat Area */}
      <main className="flex-1 overflow-hidden relative">
        <div 
          ref={scrollRef}
          className="h-full overflow-y-auto px-6 py-8 space-y-8 scroll-smooth"
        >
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((msg) => (
              <div 
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-xl bg-secondary/50 flex items-center justify-center text-primary shrink-0 mt-1">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  )}
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
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-xl bg-secondary/50 flex items-center justify-center text-primary shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div className="bg-white px-5 py-4 rounded-[1.5rem] rounded-tl-none shadow-sm flex gap-1">
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-slate-200 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Input Area */}
      <footer className="p-6 bg-white border-t border-slate-100 shrink-0">
        <div className="max-w-4xl mx-auto">
          <div className="relative flex items-center gap-3">
            <div className="flex-1 relative">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Escreva sua mensagem aqui..."
                className="w-full h-14 pl-6 pr-14 bg-slate-50 border-none rounded-2xl text-slate-600 placeholder:text-slate-400 focus:ring-2 focus:ring-primary/20 transition-all font-medium"
              />
              <Button 
                variant="ghost" 
                size="icon" 
                className="absolute right-2 top-2 h-10 w-10 text-slate-300 hover:text-primary rounded-xl"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>
            <Button 
              onClick={handleSend}
              disabled={!inputValue.trim()}
              className="h-14 w-14 rounded-2xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 disabled:opacity-50 disabled:scale-100 disabled:hover:bg-primary"
            >
              <Send className="w-6 h-6" />
            </Button>
          </div>
          <div className="flex justify-center gap-4 mt-4">
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-1">
               <Heart className="w-3 h-3" /> Preciso de ajuda urgente
             </button>
             <span className="text-slate-200 text-[10px]">|</span>
             <button className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary transition-colors">
               Dicas de bem-estar
             </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatbotPage;
