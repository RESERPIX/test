import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './components/ui/ThemeProvider';
import TopNavigationBar from './components/TopNavigationBar';
import AuthModal from './components/auth/AuthModal';
import AuthDevTools from './components/auth/AuthDevTools';

export default function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <AuthProvider>
        <TopNavigationBar />
        <AuthModal />
        <AuthDevTools />
      </AuthProvider>
    </ThemeProvider>
  );
}
