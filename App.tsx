import { useState } from 'react';

import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import MainApp from './MainApp';

import type { User } from './types/User';
import type { ViewState } from './types/ViewState';

function App() {
  const [view, setView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme ? savedTheme === 'dark' : true;
  });

  if (view === 'landing') {
    return (
      <LandingPage
        onLogin={() => setView('login')}
        onRegister={() => setView('register')}
      />
    );
  }

  if (view === 'login') {
    return <Login onBack={() => setView('landing')} onSuccess={setUser} />;
  }

  if (view === 'register') {
    return <Register onBack={() => setView('landing')} />;
  }

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

export default App;
