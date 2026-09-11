import React, { createContext, useContext, useState, ReactNode } from 'react';

type AuthView = 'LOGIN' | 'REGISTER' | 'VERIFY_EMAIL' | 'FORGOT_PASSWORD' | 'RESET_PASSWORD' | 'OAUTH_COMPLETION';

interface User {
  id: string;
  email: string;
  nickname: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authView: AuthView;
  contextMessage: string | null;
  openAuthModal: (view?: AuthView, message?: string | null) => void;
  closeAuthModal: () => void;
  setAuthView: (view: AuthView) => void;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('LOGIN');
  const [contextMessage, setContextMessage] = useState<string | null>(null);

  const openAuthModal = (view: AuthView = 'LOGIN', message: string | null = null) => {
    setAuthView(view);
    setContextMessage(message);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    setTimeout(() => {
      setContextMessage(null);
    }, 300);
  };

  const login = (userData: User) => {
    setUser(userData);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAuthModalOpen,
    authView,
    contextMessage,
    openAuthModal,
    closeAuthModal,
    setAuthView,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
