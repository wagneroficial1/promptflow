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

    // Restaura sessão no refresh
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;

      const sessionUser = data.session?.user ?? null;
      setUser(sessionUser);
      setScreen(sessionUser ? 'dashboard' : 'landing');
      setAuthReady(true);
    });

    // Mantém sincronizado com login / logout
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      const sessionUser = session?.user ?? null;
      setUser(sessionUser);
      setScreen(sessionUser ? 'dashboard' : 'landing');
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

const [subscription, setSubscription] = useState<SubscriptionPayload | null>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  // 🔒 Impede render antes da sessão estar pronta
  if (!authReady) {
    return null;
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
