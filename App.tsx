import React, { useState, useEffect } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { ViewState, User } from './types';
import { LandingPage } from "./Components/LandingPage";

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);

  // Theme Management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  // 👉 NOVA HOME (Landing Page)
  if (view === 'landing') {
    return (
      <LandingPage
        onLogin={() => setView('login')}
        onRegister={() => setView('register')}
      />
    );
  }

  // 👉 As outras views continuam funcionando normalmente
  if (view === 'login') {
    return <Login onBack={() => setView('landing')} onSuccess={setUser} />;
  }

  if (view === 'register') {
    return <Register onBack={() => setView('landing')} />;
  }

  // 👉 App principal (usuário logado)
  return (
    <MainApp
      user={user}
      onLogout={() => {
        setUser(null);
        setView('landing');
      }}
      isDarkMode={isDarkMode}
      setIsDarkMode={setIsDarkMode}
    />
  );
}

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleStart = () => {
    setView('auth');
  };

  const handleLogin = (loggedInUser: User) => {
    setUser(loggedInUser);
    setView('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setView('landing');
  };

  // View Routing
  if (view === 'landing') {
    return <LandingPage onStart={handleStart} />;
  }

  if (view === 'auth') {
    return <AuthPage onLogin={handleLogin} />;
  }

  if (view === 'dashboard' && user) {
    return (
      <Dashboard 
        user={user} 
        onLogout={handleLogout} 
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
      />
    );
  }

  return null;
}

export default App;
