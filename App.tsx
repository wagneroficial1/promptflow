import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'auth'>('landing');

  return screen === 'landing' ? (
    <LandingPage onStart={() => setScreen('auth')} />
  ) : (
    <AuthPage
      onBack={() => setScreen('landing')}
      onLogin={() => {
        // por enquanto só evita crash; depois conectamos no Dashboard
        // se seu AuthPage já faz o login internamente, isso só serve como callback
      }}
    />
  );
}



