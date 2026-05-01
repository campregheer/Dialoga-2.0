import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, LogOut, ShieldAlert, LayoutDashboard, Menu, X } from 'lucide-react';

interface HeaderProps {
  showReportButton?: boolean;
  showProfessionalButton?: boolean;
  showAdminButton?: boolean;
  onReportClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  showReportButton = true,
  showProfessionalButton = true,
  showAdminButton = true,
  onReportClick,
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleReport = () => {
    if (onReportClick) {
      onReportClick();
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-blue-50/50 h-16 md:h-20 flex items-center ">
      <div className="max-w-4xl mx-auto w-full px-4 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 md:w-10 md:h-10 bg-primary rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <MessageCircle className="w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-lg md:text-xl font-bold text-slate-800 tracking-tight">Dialoga</h1>
        </div>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-3">
          {showProfessionalButton && (user?.role === 'profissional' || 'admin') && (
            <Button
              variant="outline"
              onClick={() => navigate('/dashboard/profissional')}
              className="hidden md:flex h-11 px-5 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Painel Profissional
            </Button>
          )}
          {showAdminButton && user?.role === 'admin' && (
              <Button
                variant="outline"
                onClick={() => { navigate('/admin')}}
                className="w-full h-11 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Painel Admin
              </Button>
            )}
          {showReportButton && (
            <Button
              variant="ghost"
              onClick={handleReport}
              className="hidden sm:flex h-11 px-5 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 font-bold gap-2"
            >
              <ShieldAlert className="w-4 h-4" /> Alerta
            </Button>
          )}
          <Button
            variant="ghost"
            onClick={logout}
            className="w-11 h-11 rounded-xl p-0 text-slate-400 hover:bg-slate-50"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden w-11 h-11 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-blue-50 shadow-lg md:hidden">
          <div className="p-4 space-y-3">
            {showProfessionalButton && (user?.role === 'profissional' || 'admin') && (
              <Button
                variant="outline"
                onClick={() => { navigate('/dashboard/profissional'); setMobileMenuOpen(false); }}
                className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Painel Profissional
              </Button>
            )}
            {showAdminButton && user?.role === 'admin' && (
              <Button
                variant="outline"
                onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }}
                className="w-full h-12 rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-bold gap-2"
              >
                <LayoutDashboard className="w-4 h-4" /> Painel Admin
              </Button>
            )}
            {showReportButton && (
              <Button
                variant="ghost"
                onClick={() => { handleReport(); setMobileMenuOpen(false); }}
                className="w-full h-12 rounded-xl border-rose-100 text-rose-500 hover:bg-rose-50 font-bold gap-2 justify-start"
              >
                <ShieldAlert className="w-4 h-4" /> Alerta
              </Button>
            )}
            <Button
              variant="ghost"
              onClick={() => { logout(); setMobileMenuOpen(false); }}
              className="w-full h-12 rounded-xl text-slate-400 hover:bg-slate-50 justify-start gap-2"
            >
              <LogOut className="w-5 h-5" /> Sair
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;