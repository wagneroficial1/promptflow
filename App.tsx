import { useEffect, useState } from 'react';
import { fetchSubscription, type SubscriptionPayload } from './services/subscription';
import { supabase } from './services/supabaseClient';

import { PlansPage } from './components/PlansPage';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';

export default function App() {
  const [screen, setScreen] = useState<'landing' | 'auth' | 'dashboard' | 'plans'>('landing');
  const [user, setUser] = useState<any>(null);
  const [authReady, setAuthReady] = useState(false);

  useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      const { data, error } = await supabase.auth.getSession();

      if (!mounted) return;

      if (error) {
        console.warn('getSession error:', error);
        setUser(null);
        setScreen('landing');
      } else {
        const sessionUser = data.session?.user ?? null;
        setUser(sessionUser);
        setScreen(sessionUser ? 'dashboard' : 'landing');
      }
    } catch (e) {
      console.warn('getSession exception:', e);
      if (!mounted) return;
      setUser(null);
      setScreen('landing');
    } finally {
      if (mounted) setAuthReady(true);
    }
  })();

  const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
    const sessionUser = session?.user ?? null;
    setUser(sessionUser);
    setScreen(sessionUser ? 'dashboard' : 'landing');
    setAuthReady(true); // garante que não fica travado em loading
  });

  return () => {
    mounted = false;
    sub?.subscription?.unsubscribe();
  };
}, []);


  const [subscription, setSubscription] = useState<SubscriptionPayload | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // 🔒 Agora sim: impede render de telas antes da sessão estar pronta (sem quebrar hooks)
    if (!authReady) {
  return (
    <div className="min-h-screen bg-[#05050a] flex items-center justify-center text-white/70">
      Carregando...
    </div>
  );
}


  async function refreshSubscription() {
    setLoadingSubscription(true);
    setSubscriptionError(null);

    const result = await fetchSubscription();

    if (result.ok && result.data) {
  setSubscription(result.data);

  console.log('SUBSCRIPTION OK:', JSON.stringify(result.data, null, 2));
} else {
  setSubscription(null);

  console.log('SUBSCRIPTION ERROR:', result.error);
  setSubscriptionError(result.error ?? 'Erro ao consultar assinatura');
}

    setLoadingSubscription(false);
  }

  useEffect(() => {
    if (screen === 'dashboard') {
      refreshSubscription();
    }
  }, [screen]);

  const handleSubscribe = async (_planId: 'free' | 'pro' | 'business') => {
    if (!user) {
      setScreen('auth');
      return;
    }

    setScreen('dashboard');
    await refreshSubscription();
  };

  if (screen === 'landing') {
    return (
      <LandingPage
        onStart={() => setScreen('auth')}
        onPlans={() => setScreen('plans')}
      />
    );
  }

  if (screen === 'plans') {
    return (
      <PlansPage
        onBack={() => setScreen('landing')}
        onSubscribe={handleSubscribe}
      />
    );
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
      subscription={subscription}
      loadingSubscription={loadingSubscription}
      subscriptionError={subscriptionError}
      onLogout={async () => {
        await supabase.auth.signOut();
        setUser(null);
        setScreen('landing');
      }}
      onUpgrade={() => setScreen('plans')}
    />
  );
}
