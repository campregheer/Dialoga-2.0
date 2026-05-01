import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import type { ReactNode } from 'react';


interface User {
  id: string;
  email: string;
  role: 'jovem' | 'profissional' | 'admin';
  profile: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (profile: string, email: string, role: 'jovem' | 'profissional', password: string )=> Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Ao montar o provider, tenta restaurar a sessão a partir do cookie HttpOnly.
  // Se o cookie ainda for válido, o backend retorna os dados do usuário logado.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await api.get('/auth/me');
        setUser(res.data);
      } catch {
        // Cookie expirado ou ausente — usuário não está logado
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // silencia erro de rede no logout
    } finally {
      setUser(null);
    }
  };

const register = async ( profile: string, email: string, role: 'jovem' | 'profissional', password: string ) => {
  const res = await api.post('/auth/register', {
    profile,
    email,
    role,
    password,
  });

      setUser(res.data.user)
  }
  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
