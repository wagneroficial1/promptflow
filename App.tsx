import { setPlan } from './lib/usageStore';
import { PlansPage } from './components/PlansPage';
import { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'dashboard' | 'plans'>('landing');
  const [user, setUser] = useState<any>(null);

  const handleSubscribe = (planId: 'free' | 'pro' | 'business') => {
  setPlan(planId);
  setScreen(user ? 'dashboard' : 'auth');
};


  if (screen === 'landing') {
    return (
      <>

        <LandingPage
          onStart={() => setScreen('auth')}
          onPlans={() => setScreen('plans')}
        />
      </>
    );
  }

  if (screen === 'plans') {
    return (
      <>

        <PlansPage
          onBack={() => setScreen('landing')}
          onSubscribe={handleSubscribe}
        />
      </>
    );
  }

  if (screen === 'auth') {
    return (
      <>

        <AuthPage
          onBack={() => setScreen('landing')}
          onLogin={(loggedInUser: any) => {
            setUser(loggedInUser);
            setScreen('dashboard');
          }}
        />
      </>
    );
  }

  return (
    <>
      <div className="fixed bottom-3 left-3 z-[9999] text-xs bg-black/70 text-white px-2 py-1 rounded">
        screen: {screen}
      </div>

      <Dashboard
        user={user}
        onLogout={() => {
          setUser(null);
          setScreen('landing');
        }}
        onUpgrade={() => setScreen('plans')}
      />
    </>
  );
}
