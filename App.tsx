import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'auth'>('landing');

  if (screen === 'auth') {
    return <AuthPage />;
  }

  return <LandingPage onStart={() => setScreen('auth')} />;
}


