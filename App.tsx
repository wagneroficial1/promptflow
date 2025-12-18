import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'dashboard'>('landing');
  const [user, setUser] = useState<any>(null);

  if (screen === 'landing') {
    return <LandingPage onStart={() => setScreen('auth')} />;
  }

  if (screen === 'auth') {
    return (
      <AuthPage
        onBack={() => setScreen('landing')}
        onLogin={(loggedInUser: any) => {
          setUser(loggedInUser);
          setScreen('dashboard');
        }}
      />
    );
  }

  return (
    <Dashboard
      user={user}
      onLogout={() => {
        setUser(null);
        setScreen('landing');
      }}
    />
  );
}
